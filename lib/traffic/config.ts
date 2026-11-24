import { SITE_URL } from "@/lib/site";

export type TrafficConfig = {
  cloudflare?: { token: string; zone: string; host: string };
  ga?: { property: string; credentials: string };
  gsc?: { site: string; credentials: string };
  bing?: { site: string; key: string };
};

function read(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

// a source with half its settings stays off instead of failing the whole page
export function trafficConfig(): TrafficConfig {
  const config: TrafficConfig = {};

  const token = read("CLOUDFLARE_ANALYTICS_TOKEN");
  const zone = read("CLOUDFLARE_ZONE_ID");
  if (token && zone) {
    const host = read("CLOUDFLARE_HOST") ?? new URL(SITE_URL).host;
    config.cloudflare = { token, zone, host };
  }

  const googleKey = read("GOOGLE_SERVICE_ACCOUNT_JSON");
  const property = read("GA4_PROPERTY_ID");
  if (googleKey && property && /^\d+$/.test(property)) {
    config.ga = { property, credentials: googleKey };
  }
  const gscSite = read("GSC_SITE_URL");
  if (googleKey && gscSite)
    config.gsc = { site: gscSite, credentials: googleKey };

  const bingKey = read("BING_WEBMASTER_API_KEY");
  if (bingKey) {
    config.bing = {
      key: bingKey,
      site: read("BING_WEBMASTER_SITE_URL") ?? `${SITE_URL}/`,
    };
  }
  return config;
}

const REQUIRED: Record<keyof TrafficConfig, string[]> = {
  cloudflare: ["CLOUDFLARE_ANALYTICS_TOKEN", "CLOUDFLARE_ZONE_ID"],
  ga: ["GOOGLE_SERVICE_ACCOUNT_JSON", "GA4_PROPERTY_ID"],
  gsc: ["GOOGLE_SERVICE_ACCOUNT_JSON", "GSC_SITE_URL"],
  bing: ["BING_WEBMASTER_API_KEY"],
};

// names only, never values, so the page can say which setting is missing
export function missingSettings(source: keyof TrafficConfig): string[] {
  return REQUIRED[source].filter((name) => {
    const value = read(name);
    if (name === "GA4_PROPERTY_ID") return !value || !/^\d+$/.test(value);
    return !value;
  });
}
