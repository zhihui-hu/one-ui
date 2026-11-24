import { SITE_URL } from "@/lib/site";

export type TrafficConfig = {
  cloudflare?: { token: string; zone: string };
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
  if (token && zone) config.cloudflare = { token, zone };

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
