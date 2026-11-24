import type { TrafficConfig } from "./config";
import type { CloudflarePoint, CloudflareStats, TrafficRange } from "./types";
import {
  buckets,
  date,
  iso,
  nowSeconds,
  rangeWindow,
  type Window,
} from "./window";

const ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";
const TOP_COUNTRIES = 8;

const SUM =
  "sum { requests pageViews bytes cachedBytes cachedRequests countryMap { clientCountryName requests } }";

type Sum = {
  requests: number;
  pageViews: number;
  bytes: number;
  cachedBytes: number;
  cachedRequests: number;
  countryMap: { clientCountryName: string; requests: number }[];
};

type Group = { dimensions: { time: string }; sum: Sum };

function query(window: Window, zone: string) {
  // cloudflare caps hourly groups at 3 days, so 30d uses daily groups on utc dates
  if (window.kind === "hour") {
    return {
      query: `query($zone: string!, $start: Time!, $end: Time!) { viewer { zones(filter: { zoneTag: $zone }) { groups: httpRequests1hGroups(limit: 100, filter: { datetime_geq: $start, datetime_lt: $end }, orderBy: [datetime_ASC]) { dimensions { time: datetime } ${SUM} } } } }`,
      variables: { zone, start: iso(window.start), end: iso(window.end) },
    };
  }
  return {
    query: `query($zone: string!, $first: Date!, $last: Date!) { viewer { zones(filter: { zoneTag: $zone }) { groups: httpRequests1dGroups(limit: 100, filter: { date_geq: $first, date_leq: $last }, orderBy: [date_ASC]) { dimensions { time: date } ${SUM} } } } }`,
    variables: { zone, first: date(window.first), last: date(window.last) },
  };
}

const normalize = (time: string) =>
  time.length === 10 ? time : iso(Math.floor(Date.parse(time) / 1000));

export async function cloudflareStats(
  settings: NonNullable<TrafficConfig["cloudflare"]>,
  range: TrafficRange,
): Promise<CloudflareStats> {
  const now = nowSeconds();
  const window = rangeWindow(range, now, true);
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query(window, settings.zone)),
    signal: AbortSignal.timeout(20_000),
  });
  const body = (await response.json()) as {
    data?: { viewer?: { zones?: { groups?: Group[] }[] } };
    errors?: { message: string }[] | null;
  };
  if (body.errors?.length) {
    throw new Error(
      `cloudflare graphql: ${body.errors.map((e) => e.message).join("; ")}`,
    );
  }
  const groups = body.data?.viewer?.zones?.[0]?.groups;
  if (!groups) throw new Error("zone not found or token lacks Analytics:Read");

  const byTime = new Map(
    groups.map((g) => [normalize(g.dimensions.time), g.sum]),
  );
  const label = window.kind === "hour" ? iso : date;
  const totals = {
    pageViews: 0,
    requests: 0,
    bytes: 0,
    cachedBytes: 0,
    cachedRequests: 0,
  };
  const countries = new Map<string, number>();

  const series: CloudflarePoint[] = buckets(window).map((start) => {
    const time = label(start);
    const sum = byTime.get(time);
    const point: CloudflarePoint = {
      time,
      pageViews: sum?.pageViews ?? 0,
      requests: sum?.requests ?? 0,
      bytes: sum?.bytes ?? 0,
      cachedBytes: sum?.cachedBytes ?? 0,
      cachedRequests: sum?.cachedRequests ?? 0,
    };
    for (const key of Object.keys(totals) as (keyof typeof totals)[]) {
      totals[key] += point[key];
    }
    for (const entry of sum?.countryMap ?? []) {
      countries.set(
        entry.clientCountryName,
        (countries.get(entry.clientCountryName) ?? 0) + entry.requests,
      );
    }
    return point;
  });

  return {
    configured: true,
    granularity: window.kind,
    timezone: window.kind === "hour" ? "Asia/Shanghai" : "UTC",
    updatedAt: iso(now),
    totals,
    series,
    countries: [...countries]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, TOP_COUNTRIES)
      .map(([code, requests]) => ({ code, requests })),
  };
}
