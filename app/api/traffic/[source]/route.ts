import { cached } from "@/lib/traffic/cache";
import { cloudflareStats } from "@/lib/traffic/cloudflare";
import { trafficConfig } from "@/lib/traffic/config";
import { gaStats } from "@/lib/traffic/ga";
import { bingStats, gscStats } from "@/lib/traffic/search";
import {
  DEFAULT_RANGE,
  isTrafficRange,
  isTrafficSource,
} from "@/lib/traffic/types";

export const dynamic = "force-dynamic";

const FIVE_MINUTES = 300;
const ONE_HOUR = 3600;

const json = (body: unknown, status = 200, maxAge = 0) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": maxAge
        ? `public, max-age=${maxAge}, stale-while-revalidate=${maxAge}`
        : "no-store",
    },
  });

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
        if (!settings) return json({ configured: false });
        const body = await cached(`cloudflare:${range}`, FIVE_MINUTES, () =>
          cloudflareStats(settings, range),
        );
        return json(body, 200, 60);
      }
      case "ga": {
        const settings = config.ga;
        if (!settings) return json({ configured: false });
        const body = await cached(`ga:${range}`, FIVE_MINUTES, () =>
          gaStats(settings, range),
        );
        return json(body, 200, 60);
      }
      case "gsc": {
        const settings = config.gsc;
        if (!settings) return json({ configured: false });
        const body = await cached("gsc", ONE_HOUR, () => gscStats(settings));
        return json(body, 200, 300);
      }
      case "bing": {
        const settings = config.bing;
        if (!settings) return json({ configured: false });
        const body = await cached("bing", ONE_HOUR, () => bingStats(settings));
        return json(body, 200, 300);
      }
    }
  } catch (error) {
    console.warn(`traffic ${source} failed:`, (error as Error).message);
    return json({ error: "unavailable" }, 502);
  }
}
