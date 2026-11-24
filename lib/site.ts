export const SITE_URL = "https://ui.huzhihui.com";

export const SITE_NAME = "One UI";

export const SITE_ALT_NAMES = ["oneui", "One UI Components", "ui.huzhihui.com"];

export const SITE_REPO = "https://github.com/zhihui-hu/one-ui";

export const REGISTRY_NAMESPACE = "@one-ui";

export const REGISTRY_URL = `${SITE_URL}/r/{name}.json`;

export function registryItemUrl(name: string): string {
  return REGISTRY_URL.replace("{name}", name);
}

export const LAUNCH_DATE = "2026-06-10";

export const HALLOWEEN_WEBS_ENABLED = true;
export const DIWALI_LIGHTS_ENABLED = true;

// public ids, leave empty to switch each one off
export const GA_MEASUREMENT_ID = "G-MBX28WR3LD";
export const GOOGLE_SITE_VERIFICATION = "";
export const BING_SITE_VERIFICATION = "";
