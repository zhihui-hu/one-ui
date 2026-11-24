"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BarChart3, Cloud, Search } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { format } from "@/lib/i18n/format";
import {
  DEFAULT_RANGE,
  TRAFFIC_RANGES,
  isTrafficRange,
  type CloudflareStats,
  type GaStats,
  type SearchStats,
  type TrafficRange,
} from "@/lib/traffic/types";
import { cn } from "@/lib/utils";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import {
  bytes,
  compact,
  duration,
  flag,
  percent,
  regionName,
  share,
  updatedLabel,
} from "./format";
import {
  ChartHeading,
  Panel,
  PanelState,
  RankList,
  Tile,
  notConfigured,
  type Load,
} from "./parts";

// matches the server cache, so a refresh can pick up new numbers
const REFRESH_MS = 5 * 60_000;

function useSource<T>(path: string): Load<T> {
  const [result, setResult] = useState<{ path: string; load: Load<T> }>();
  useEffect(() => {
    const controller = new AbortController();
    const run = () =>
      fetch(path, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data) => setResult({ path, load: { state: "ready", data } }))
        .catch(() => {
          if (!controller.signal.aborted) {
            setResult({ path, load: { state: "error" } });
          }
        });
    run();
    const timer = setInterval(run, REFRESH_MS);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [path]);
  return result?.path === path ? result.load : { state: "loading" };
}

function Badge({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-7 items-center justify-center rounded-lg text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

export default function TrafficDashboard() {
  const { m } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get("range");
  const range: TrafficRange = isTrafficRange(requested)
    ? requested
    : DEFAULT_RANGE;

  const cloudflare = useSource<CloudflareStats>(
    `/api/traffic/cloudflare?range=${range}`,
  );
  const ga = useSource<GaStats>(`/api/traffic/ga?range=${range}`);
  const gsc = useSource<SearchStats>("/api/traffic/gsc");
  const bing = useSource<SearchStats>("/api/traffic/bing");

  function select(next: TrafficRange) {
    const query = next === DEFAULT_RANGE ? "" : `?range=${next}`;
    router.replace(`${pathname}${query}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div
          role="tablist"
          className="flex gap-1 overflow-x-auto rounded-2xl bg-[#F5F5F7] p-1 dark:bg-[#121212]"
        >
          {TRAFFIC_RANGES.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={value === range}
              onClick={() => select(value)}
              className={cn(
                "shrink-0 cursor-pointer rounded-xl px-3 py-1.5 text-sm transition-colors duration-150",
                value === range
                  ? "bg-white font-medium text-foreground shadow-sm dark:bg-white/10"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.stats.ranges[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CloudflarePanel load={cloudflare} />
        <GaPanel load={ga} />
        <SearchPanel
          load={gsc}
          title="Google Search Console"
          logo={
            <Badge className="bg-[#4285F4]">
              <Search className="size-4" strokeWidth={2.5} />
            </Badge>
          }
          withPosition
        />
        <SearchPanel
          load={bing}
          title="Bing Webmaster Tools"
          logo={
            <Badge className="bg-[#008373] font-runde text-base font-bold">
              b
            </Badge>
          }
        />
      </div>
    </div>
  );
}

function note(updatedAt: string | undefined, prefix: string) {
  return updatedAt ? `${prefix} · ${updatedLabel(updatedAt)}` : prefix;
}

const readyData = <T,>(load: Load<T>) =>
  load.state === "ready" && !notConfigured(load.data)
    ? (load.data as T)
    : undefined;

type CfMetric = "pageViews" | "requests" | "bytes" | "cachedBytes";

function CloudflarePanel({ load }: { load: Load<CloudflareStats> }) {
  const { m, lang } = useI18n();
  const t = m.stats.cloudflare;
  const [metric, setMetric] = useState<CfMetric>("pageViews");
  const data = readyData(load);
  const prefix =
    data?.granularity === "day" ? t.dailyNote : m.stats.beijingTime;

  return (
    <Panel
      title="Cloudflare"
      logo={
        <Badge className="bg-[#F38020]">
          <Cloud className="size-4" strokeWidth={2.5} />
        </Badge>
      }
      note={data ? note(data.updatedAt, prefix) : undefined}
    >
      <PanelState load={load}>
        {(d: CloudflareStats) => {
          const fmt =
            metric === "bytes" || metric === "cachedBytes" ? bytes : compact;
          const values = d.series.map((p) => ({
            time: p.time,
            value: p[metric],
          }));
          const peak = Math.max(0, ...values.map((v) => v.value));
          const label = {
            pageViews: t.pageViews,
            requests: t.requests,
            bytes: t.bytes,
            cachedBytes: t.cachedBytes,
          }[metric];
          return (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                <Tile
                  label={t.pageViews}
                  value={compact(d.totals.pageViews)}
                  active={metric === "pageViews"}
                  onSelect={() => setMetric("pageViews")}
                />
                <Tile
                  label={t.requests}
                  value={compact(d.totals.requests)}
                  active={metric === "requests"}
                  onSelect={() => setMetric("requests")}
                />
                <Tile
                  label={t.cacheRate}
                  value={percent(
                    share(d.totals.cachedRequests, d.totals.requests),
                    0,
                  )}
                />
                <Tile
                  label={t.bytes}
                  value={bytes(d.totals.bytes)}
                  active={metric === "bytes"}
                  onSelect={() => setMetric("bytes")}
                />
                <Tile
                  label={t.cachedBytes}
                  value={bytes(d.totals.cachedBytes)}
                  active={metric === "cachedBytes"}
                  onSelect={() => setMetric("cachedBytes")}
                />
              </div>
              <div className="flex flex-col gap-3 pb-6">
                <ChartHeading
                  label={label}
                  peak={format(m.stats.peak, { value: fmt(peak) })}
                />
                <LineChart
                  points={values}
                  granularity={d.granularity}
                  format={fmt}
                />
              </div>
              <RankList
                title={t.countries}
                barClass="bg-[#0A84FF]"
                rows={d.countries.map((c) => ({
                  key: c.code,
                  label: (
                    <>
                      <span className="mr-2">{flag(c.code)}</span>
                      {regionName(c.code, lang, t.unknownRegion)}
                    </>
                  ),
                  value: compact(c.requests),
                  share: share(c.requests, d.totals.requests),
                }))}
              />
            </>
          );
        }}
      </PanelState>
    </Panel>
  );
}

type GaMetric = "users" | "sessions" | "pageViews";

function GaPanel({ load }: { load: Load<GaStats> }) {
  const { m } = useI18n();
  const t = m.stats.ga;
  const [metric, setMetric] = useState<GaMetric>("users");
  const data = readyData(load);

  return (
    <Panel
      title="Google Analytics"
      logo={
        <Badge className="bg-[#F9AB00]">
          <BarChart3 className="size-4" strokeWidth={2.5} />
        </Badge>
      }
      note={data ? note(data.updatedAt, m.stats.beijingTime) : undefined}
    >
      <PanelState load={load}>
        {(d: GaStats) => {
          const values = d.series.map((p) => ({
            time: p.time,
            value: p[metric],
          }));
          const peak = Math.max(0, ...values.map((v) => v.value));
          const label = {
            users: t.users,
            sessions: t.sessions,
            pageViews: t.pageViews,
          }[metric];
          const pageTotal = d.pages.reduce((s, p) => s + p.pageViews, 0);
          return (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                <Tile
                  label={t.users}
                  value={compact(d.totals.users)}
                  active={metric === "users"}
                  onSelect={() => setMetric("users")}
                />
                <Tile label={t.newUsers} value={compact(d.totals.newUsers)} />
                <Tile
                  label={t.sessions}
                  value={compact(d.totals.sessions)}
                  active={metric === "sessions"}
                  onSelect={() => setMetric("sessions")}
                />
                <Tile
                  label={t.pageViews}
                  value={compact(d.totals.pageViews)}
                  active={metric === "pageViews"}
                  onSelect={() => setMetric("pageViews")}
                />
                <Tile
                  label={t.avgSession}
                  value={duration(d.totals.avgSessionSeconds)}
                />
              </div>
              <div className="flex flex-col gap-3 pb-6">
                <ChartHeading
                  label={label}
                  peak={format(m.stats.peak, { value: compact(peak) })}
                />
                <LineChart
                  points={values}
                  granularity={d.granularity}
                  format={compact}
                />
              </div>
              {d.sources.length || d.pages.length ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  <RankList
                    title={t.sources}
                    barClass="bg-[#F9AB00]"
                    rows={d.sources.slice(0, 6).map((s) => ({
                      key: `${s.source}/${s.medium}`,
                      label:
                        s.source === "(direct)"
                          ? t.direct
                          : `${s.source} / ${s.medium}`,
                      value: compact(s.sessions),
                      share: share(s.sessions, d.totals.sessions),
                    }))}
                  />
                  <RankList
                    title={t.pages}
                    barClass="bg-[#F9AB00]"
                    rows={d.pages.slice(0, 6).map((p) => ({
                      key: p.path,
                      label: p.path,
                      value: compact(p.pageViews),
                      share: share(p.pageViews, pageTotal),
                    }))}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t.empty}</p>
              )}
            </>
          );
        }}
      </PanelState>
    </Panel>
  );
}

function SearchPanel({
  load,
  title,
  logo,
  withPosition,
}: {
  load: Load<SearchStats>;
  title: string;
  logo: React.ReactNode;
  withPosition?: boolean;
}) {
  const { m } = useI18n();
  const t = m.stats.search;
  const data = readyData(load);

  return (
    <Panel
      title={title}
      logo={logo}
      note={
        data
          ? note(data.updatedAt, format(t.window, { days: data.days }))
          : undefined
      }
    >
      <PanelState load={load}>
        {(d: SearchStats) => {
          const peak = Math.max(0, ...d.series.map((s) => s.clicks));
          return (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Tile label={t.clicks} value={compact(d.totals.clicks)} />
                <Tile
                  label={t.impressions}
                  value={compact(d.totals.impressions)}
                />
                <Tile label={t.ctr} value={percent(d.totals.ctr)} />
                {withPosition ? (
                  <Tile
                    label={t.position}
                    value={
                      d.totals.position == null
                        ? "–"
                        : d.totals.position.toFixed(1)
                    }
                  />
                ) : (
                  <Tile
                    label={t.dailyClicks}
                    value={compact(d.totals.dailyClicks7d)}
                  />
                )}
              </div>
              <BarChart
                bars={d.series.map((s) => ({ date: s.date, value: s.clicks }))}
                caption={format(t.chart, { value: peak })}
              />
              <p className="text-xs text-muted-foreground">{t.lag}</p>
            </>
          );
        }}
      </PanelState>
    </Panel>
  );
}
