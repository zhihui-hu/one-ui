import type { TrafficConfig } from "./config";
import { googleAccessToken } from "./google-auth";
import type { SearchStats } from "./types";
import { DAY, date, iso, nowSeconds } from "./window";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const BING_ENDPOINT =
  "https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats";
const DAYS = 28;
// pacific standard time, close enough to pick the day a lagging report ends on
const PACIFIC = -8 * 3600;
// days both sources usually trail behind, only used while there are no rows yet
const LAG_DAYS = 2;

// `day` counts days since the unix epoch
type Row = {
  day: number;
  clicks: number;
  impressions: number;
  position?: number;
};

const today = (now: number) => Math.floor((now + PACIFIC) / DAY);

const dayNumber = (value: string) => {
  const ms = Date.parse(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(ms) ? undefined : Math.floor(ms / 1000 / DAY);
};

// wcf dates: /Date(1316156400000-0700)/ is that instant, read in the given offset
function bingDay(value: string) {
  const match = /^\/Date\((-?\d+)([+-]\d{4})?\)\/$/.exec(value);
  if (!match) return dayNumber(value);
  const zone = match[2];
  const offset = zone
    ? (zone[0] === "-" ? -1 : 1) *
      (Number(zone.slice(1, 3)) * 3600 + Number(zone.slice(3)) * 60)
    : 0;
  return Math.floor((Math.floor(Number(match[1]) / 1000) + offset) / DAY);
}

function summarize(
  rows: Row[],
  now: number,
  withPosition: boolean,
): SearchStats {
  const end = rows.length
    ? Math.max(...rows.map((r) => r.day))
    : today(now) - LAG_DAYS;
  const start = end - DAYS + 1;
  const days = new Map<
    number,
    { clicks: number; impressions: number; weighted: number }
  >();
  for (let day = start; day <= end; day++) {
    days.set(day, { clicks: 0, impressions: 0, weighted: 0 });
  }
  for (const row of rows) {
    const day = days.get(row.day);
    if (!day) continue;
    day.clicks += row.clicks;
    day.impressions += row.impressions;
    day.weighted += (row.position ?? 0) * row.impressions;
  }
  const values = [...days.values()];
  const clicks = values.reduce((s, d) => s + d.clicks, 0);
  const impressions = values.reduce((s, d) => s + d.impressions, 0);
  const weighted = values.reduce((s, d) => s + d.weighted, 0);
  const lastWeek = values.slice(-7).reduce((s, d) => s + d.clicks, 0);
  const perImpression = (value: number, scale: number) =>
    impressions > 0 ? Math.round((value / impressions) * scale) / scale : null;

  return {
    configured: true,
    days: DAYS,
    start: date(start * DAY),
    end: date(end * DAY),
    updatedAt: iso(now),
    totals: {
      clicks: Math.round(clicks),
      impressions: Math.round(impressions),
      ctr: perImpression(clicks * 100, 100),
      dailyClicks7d: Math.round(lastWeek / 7),
      // impression-weighted, as search console aggregates it
      ...(withPosition ? { position: perImpression(weighted, 10) } : {}),
    },
    series: [...days].map(([day, d]) => ({
      date: date(day * DAY),
      clicks: Math.round(d.clicks),
      impressions: Math.round(d.impressions),
    })),
  };
}

export async function gscStats(
  settings: NonNullable<TrafficConfig["gsc"]>,
): Promise<SearchStats> {
  const now = nowSeconds();
  const last = today(now);
  const token = await googleAccessToken(settings.credentials, SCOPE);
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(settings.site)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // a few spare days, so the newest 28 are complete whatever the lag is
        startDate: date((last - DAYS - 4) * DAY),
        endDate: date(last * DAY),
        dimensions: ["date"],
        rowLimit: 100,
      }),
      signal: AbortSignal.timeout(20_000),
    },
  );
  const body = (await response.json()) as {
    rows?: {
      keys: string[];
      clicks: number;
      impressions: number;
      position: number;
    }[];
    error?: { message?: string };
  };
  if (body.error?.message)
    throw new Error(`search console: ${body.error.message}`);
  const rows: Row[] = [];
  for (const row of body.rows ?? []) {
    const day = dayNumber(row.keys[0] ?? "");
    if (day === undefined) continue;
    rows.push({
      day,
      clicks: row.clicks,
      impressions: row.impressions,
      position: row.position,
    });
  }
  return summarize(rows, now, true);
}

export async function bingStats(
  settings: NonNullable<TrafficConfig["bing"]>,
): Promise<SearchStats> {
  const url = new URL(BING_ENDPOINT);
  url.searchParams.set("siteUrl", settings.site);
  url.searchParams.set("apikey", settings.key);
  let body: {
    d?: { Date: string; Clicks: number; Impressions: number }[];
    Message?: string;
    ErrorCode?: number;
  };
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    body = await response.json();
  } catch {
    // the url carries the api key, so never surface the original error
    throw new Error("bing webmaster request failed");
  }
  if (body.Message)
    throw new Error(`bing webmaster ${body.ErrorCode}: ${body.Message}`);
  if (!body.d) throw new Error("bing webmaster returned no stats list");
  const rows: Row[] = [];
  for (const row of body.d) {
    const day = bingDay(row.Date);
    if (day === undefined) continue;
    rows.push({ day, clicks: row.Clicks, impressions: row.Impressions });
  }
  return summarize(rows, nowSeconds(), false);
}
