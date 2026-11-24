import type { TrafficConfig } from "./config";
import type { CloudflarePoint, CloudflareStats, TrafficRange } from "./types";
import {
  BEIJING,
  DAY,
  HOUR,
  buckets,
  date,
  iso,
  nowSeconds,
  rangeWindow,
} from "./window";

const ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";
const TOP_COUNTRIES = 8;
// adaptive datasets accept at most 3 days per node, so longer windows are split into aliased slices
const SLICE = 3 * DAY;
const CACHED = new Set(["hit", "stale", "updating", "revalidated"]);

type Row = {
  count: number;
  sum: { edgeResponseBytes: number };
  dimensions: {
    datetimeHour: string;
    cacheStatus: string;
    edgeResponseContentTypeName: string;
  };
};

type CountryRow = { count: number; dimensions: { clientCountryName: string } };

function slices(start: number, end: number) {
  const out: [number, number][] = [];
  for (let from = start; from < end; from += SLICE) {
    out.push([from, Math.min(end, from + SLICE)]);
  }
  return out;
}

// aggregated groups cannot filter by hostname, the adaptive dataset can; eyeball skips worker subrequests
function query(parts: [number, number][]) {
  const filter = (i: number) =>
    `filter: { datetime_geq: "${iso(parts[i][0])}", datetime_lt: "${iso(parts[i][1])}", clientRequestHTTPHost: $host, requestSource: "eyeball" }`;
  const nodes = parts
    .map(
      (_, i) =>
        `s${i}: httpRequestsAdaptiveGroups(limit: 10000, ${filter(i)}) { count sum { edgeResponseBytes } dimensions { datetimeHour cacheStatus edgeResponseContentTypeName } } ` +
        `c${i}: httpRequestsAdaptiveGroups(limit: 50, orderBy: [count_DESC], ${filter(i)}) { count dimensions { clientCountryName } }`,
    )
    .join(" ");
  return `query($zone: string!, $host: string!) { viewer { zones(filter: { zoneTag: $zone }) { ${nodes} } } }`;
}

export async function cloudflareStats(
  settings: NonNullable<TrafficConfig["cloudflare"]>,
  range: TrafficRange,
): Promise<CloudflareStats> {
  const now = nowSeconds();
  const window = rangeWindow(range, now);
  const [start, end] =
    window.kind === "hour"
      ? [window.start, window.end]
      : [window.first, Math.min(window.last + DAY, now - (now % HOUR) + HOUR)];
  const parts = slices(start, end);

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query(parts),
      variables: { zone: settings.zone, host: settings.host },
    }),
    signal: AbortSignal.timeout(20_000),
  });
  const body = (await response.json()) as {
    data?: { viewer?: { zones?: Record<string, Row[] | CountryRow[]>[] } };
    errors?: { message: string }[] | null;
  };
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  const zone = body.data?.viewer?.zones?.[0];
  if (!zone) throw new Error("zone not found or token lacks Analytics:Read");

  // hourly ranges keep utc hour instants; 30d folds hours into beijing dates
  const keyOf = (seconds: number) =>
    window.kind === "hour"
      ? iso(seconds - (seconds % HOUR))
      : date(seconds + BEIJING);
  const points = new Map<string, CloudflarePoint>(
    buckets(window).map((t) => {
      const time = window.kind === "hour" ? iso(t) : date(t + BEIJING);
      return [
        time,
        {
          time,
          pageViews: 0,
          requests: 0,
          bytes: 0,
          cachedBytes: 0,
          cachedRequests: 0,
        },
      ];
    }),
  );
  const countries = new Map<string, number>();

  parts.forEach((_, i) => {
    for (const row of (zone[`s${i}`] ?? []) as Row[]) {
      const point = points.get(
        keyOf(Date.parse(row.dimensions.datetimeHour) / 1000),
      );
      if (!point) continue;
      const bytes = row.sum.edgeResponseBytes;
      point.requests += row.count;
      point.bytes += bytes;
      if (row.dimensions.edgeResponseContentTypeName === "html") {
        point.pageViews += row.count;
      }
      if (CACHED.has(row.dimensions.cacheStatus)) {
        point.cachedRequests += row.count;
        point.cachedBytes += bytes;
      }
    }
    for (const row of (zone[`c${i}`] ?? []) as CountryRow[]) {
      const code = row.dimensions.clientCountryName;
      countries.set(code, (countries.get(code) ?? 0) + row.count);
    }
  });

  const series = [...points.values()];
  const totals = {
    pageViews: 0,
    requests: 0,
    bytes: 0,
    cachedBytes: 0,
    cachedRequests: 0,
  };
  for (const point of series) {
    for (const key of Object.keys(totals) as (keyof typeof totals)[]) {
      totals[key] += point[key];
    }
  }

  return {
    configured: true,
    granularity: window.kind,
    timezone: "Asia/Shanghai",
    host: settings.host,
    updatedAt: iso(now),
    totals,
    series,
    countries: [...countries]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, TOP_COUNTRIES)
      .map(([code, requests]) => ({ code, requests })),
  };
}
