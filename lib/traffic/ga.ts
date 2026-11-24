import type { TrafficConfig } from "./config";
import { googleAccessToken } from "./google-auth";
import type { GaStats, TrafficRange } from "./types";
import {
  BEIJING,
  buckets,
  date,
  iso,
  nowSeconds,
  rangeWindow,
  type Window,
} from "./window";

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOP_ROWS = 10;
// fetched before merging /zh/x into /x
const PAGE_ROWS = 250;

const SERIES = ["activeUsers", "sessions", "screenPageViews"];
const TOTALS = [
  "activeUsers",
  "newUsers",
  "sessions",
  "screenPageViews",
  "averageSessionDuration",
];

// bucket key in the property's reporting time zone, which should be asia/shanghai
function bucketKey(window: Window, start: number) {
  const digits = iso(start + BEIJING).replace(/\D/g, "");
  return window.kind === "hour" ? digits.slice(0, 10) : digits.slice(0, 8);
}

function report(
  window: Window,
  dimensions: string[],
  metrics: string[],
  extra: Record<string, unknown> = {},
) {
  const all = buckets(window);
  const body: Record<string, unknown> = {
    dateRanges: [
      {
        startDate: date(all[0] + BEIJING),
        endDate: date(all[all.length - 1] + BEIJING),
      },
    ],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    keepEmptyRows: false,
    ...extra,
  };
  // date ranges are whole days; trim hourly windows to their exact hours
  if (window.kind === "hour") {
    body.dimensionFilter = {
      filter: {
        fieldName: "dateHour",
        inListFilter: { values: all.map((s) => bucketKey(window, s)) },
      },
    };
  }
  return body;
}

type Report = {
  rows?: {
    dimensionValues?: { value: string }[];
    metricValues?: { value: string }[];
  }[];
};

function rows(report: Report) {
  return (report.rows ?? []).map((row) => ({
    dims: (row.dimensionValues ?? []).map((v) => v.value),
    metrics: (row.metricValues ?? []).map((v) => Number(v.value) || 0),
  }));
}

// route shape only: query strings dropped, /zh/x counted as /x
function publicPath(path: string) {
  const clean = path.split(/[?#]/)[0] || "/";
  if (clean === "/zh") return "/";
  return clean.startsWith("/zh/") ? clean.slice(3) : clean;
}

export async function gaStats(
  settings: NonNullable<TrafficConfig["ga"]>,
  range: TrafficRange,
): Promise<GaStats> {
  const now = nowSeconds();
  const window = rangeWindow(range, now);
  const top = (metric: string, limit = TOP_ROWS) => ({
    limit,
    orderBys: [{ metric: { metricName: metric }, desc: true }],
  });
  const requests = [
    report(window, [window.kind === "hour" ? "dateHour" : "date"], SERIES, {
      limit: 1000,
    }),
    report(window, [], TOTALS),
    report(
      window,
      ["sessionSource", "sessionMedium"],
      ["sessions"],
      top("sessions"),
    ),
    report(
      window,
      ["pagePath"],
      ["screenPageViews"],
      top("screenPageViews", PAGE_ROWS),
    ),
  ];

  const token = await googleAccessToken(settings.credentials, SCOPE);
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${settings.property}:batchRunReports`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
      signal: AbortSignal.timeout(20_000),
    },
  );
  const body = (await response.json()) as {
    reports?: Report[];
    error?: { message?: string };
  };
  if (body.error?.message) throw new Error(`ga4: ${body.error.message}`);
  const reports = body.reports;
  if (!reports || reports.length !== 4)
    throw new Error("ga4 returned no reports");

  const byKey = new Map(rows(reports[0]).map((r) => [r.dims[0], r.metrics]));
  const series = buckets(window).map((start) => {
    const values = byKey.get(bucketKey(window, start)) ?? [];
    return {
      time: window.kind === "hour" ? iso(start) : date(start + BEIJING),
      users: Math.round(values[0] ?? 0),
      sessions: Math.round(values[1] ?? 0),
      pageViews: Math.round(values[2] ?? 0),
    };
  });

  const totals = rows(reports[1])[0]?.metrics ?? [];
  const pages = new Map<string, number>();
  for (const row of rows(reports[3])) {
    const path = publicPath(row.dims[0] ?? "/");
    pages.set(path, (pages.get(path) ?? 0) + Math.round(row.metrics[0] ?? 0));
  }

  return {
    configured: true,
    granularity: window.kind,
    timezone: "Asia/Shanghai",
    updatedAt: iso(now),
    totals: {
      users: Math.round(totals[0] ?? 0),
      newUsers: Math.round(totals[1] ?? 0),
      sessions: Math.round(totals[2] ?? 0),
      pageViews: Math.round(totals[3] ?? 0),
      avgSessionSeconds: Math.round(totals[4] ?? 0),
    },
    series,
    sources: rows(reports[2]).map((row) => ({
      source: row.dims[0] ?? "",
      medium: row.dims[1] ?? "",
      sessions: Math.round(row.metrics[0] ?? 0),
    })),
    pages: [...pages]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, TOP_ROWS)
      .map(([path, pageViews]) => ({ path, pageViews })),
  };
}
