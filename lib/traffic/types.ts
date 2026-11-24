export const TRAFFIC_RANGES = [
  "24h",
  "today",
  "yesterday",
  "3d",
  "30d",
] as const;

export type TrafficRange = (typeof TRAFFIC_RANGES)[number];

export const DEFAULT_RANGE: TrafficRange = "30d";

export const TRAFFIC_SOURCES = ["cloudflare", "ga", "gsc", "bing"] as const;

export type TrafficSource = (typeof TRAFFIC_SOURCES)[number];

export function isTrafficRange(value: unknown): value is TrafficRange {
  return TRAFFIC_RANGES.includes(value as TrafficRange);
}

export function isTrafficSource(value: unknown): value is TrafficSource {
  return TRAFFIC_SOURCES.includes(value as TrafficSource);
}

export type NotConfigured = { configured: false; missing?: string[] };

type Window = {
  configured: true;
  // hourly buckets are utc instants, daily ones are yyyy-mm-dd dates
  granularity: "hour" | "day";
  timezone: "Asia/Shanghai" | "UTC";
  updatedAt: string;
};

export type CloudflarePoint = {
  time: string;
  pageViews: number;
  requests: number;
  bytes: number;
  cachedBytes: number;
  cachedRequests: number;
};

export type CloudflareStats = Window & {
  host: string;
  totals: Omit<CloudflarePoint, "time">;
  series: CloudflarePoint[];
  countries: { code: string; requests: number }[];
};

export type GaPoint = {
  time: string;
  users: number;
  sessions: number;
  pageViews: number;
};

export type GaStats = Window & {
  totals: {
    users: number;
    newUsers: number;
    sessions: number;
    pageViews: number;
    avgSessionSeconds: number;
  };
  series: GaPoint[];
  sources: { source: string; medium: string; sessions: number }[];
  pages: { path: string; pageViews: number }[];
};

export type SearchStats = {
  configured: true;
  days: number;
  start: string;
  end: string;
  updatedAt: string;
  totals: {
    clicks: number;
    impressions: number;
    // percent with two decimals, null while there are no impressions
    ctr: number | null;
    dailyClicks7d: number;
    position?: number | null;
  };
  series: { date: string; clicks: number; impressions: number }[];
};

export type TrafficResponse = {
  cloudflare: CloudflareStats | NotConfigured;
  ga: GaStats | NotConfigured;
  gsc: SearchStats | NotConfigured;
  bing: SearchStats | NotConfigured;
};
