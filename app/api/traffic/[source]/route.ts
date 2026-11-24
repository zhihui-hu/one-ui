import { cached } from "@/lib/traffic/cache";
import { cloudflareStats } from "@/lib/traffic/cloudflare";
import { missingSettings, trafficConfig } from "@/lib/traffic/config";
import { gaStats } from "@/lib/traffic/ga";
import { bingStats, gscStats } from "@/lib/traffic/search";
import {
  DEFAULT_RANGE,
  isTrafficRange,
  isTrafficSource,
  type TrafficSource,
} from "@/lib/traffic/types";

export const dynamic = "force-dynamic";

const FIVE_MINUTES = 300;
const ONE_HOUR = 3600;
// bing only updates daily and throttles shared cloudflare ips, so ask it rarely
const SIX_HOURS = 6 * ONE_HOUR;

const json = (body: unknown, status = 200, maxAge = 0) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": maxAge
        ? `public, max-age=${maxAge}, stale-while-revalidate=${maxAge}`
        : "no-store",
    },
  });

const notConfigured = (source: TrafficSource) =>
  json({ configured: false, missing: missingSettings(source) });

// upstream messages explain a misconfiguration (wrong site, missing permission); secrets never reach them
function reason(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/\s+/g, " ").slice(0, 300);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ source: string }> },
) {
  const { source } = await params;
  if (!isTrafficSource(source)) return json({ error: "unknown source" }, 404);
  const range = new URL(request.url).searchParams.get("range") ?? DEFAULT_RANGE;
  if (!isTrafficRange(range)) return json({ error: "unknown range" }, 400);

  const config = trafficConfig();
  try {
    switch (source) {
      case "cloudflare": {
        const settings = config.cloudflare;
        if (!settings) return notConfigured(source);
        const body = await cached(
          `cloudflare:${range}`,
          { ttl: FIVE_MINUTES },
          () => cloudflareStats(settings, range),
        );
        return json(body, 200, 60);
      }
      case "ga": {
        const settings = config.ga;
        if (!settings) return notConfigured(source);
        const body = await cached(`ga:${range}`, { ttl: FIVE_MINUTES }, () =>
          gaStats(settings, range),
        );
        return json(body, 200, 60);
      }
      case "gsc": {
        const settings = config.gsc;
        if (!settings) return notConfigured(source);
        const body = await cached("gsc", { ttl: ONE_HOUR }, () =>
          gscStats(settings),
        );
        return json(body, 200, 300);
      }
      case "bing": {
        const settings = config.bing;
        if (!settings) return notConfigured(source);
        const body = await cached(
          "bing",
          { ttl: SIX_HOURS, backoff: ONE_HOUR },
          () => bingStats(settings),
        );
        return json(body, 200, 300);
      }
    }
  } catch (error) {
    console.warn(`traffic ${source} failed:`, reason(error));
    return json({ error: "unavailable", reason: reason(error) }, 502);
  }
}
