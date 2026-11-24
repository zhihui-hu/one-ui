// add a language here, then a locales/<code>/ folder with its index.ts
export const LOCALE_INFO = {
  en: { label: "English", htmlLang: "en", ogLocale: "en_US" },
  zh: { label: "简体中文", htmlLang: "zh-CN", ogLocale: "zh_CN" },
} as const;

export type Locale = keyof typeof LOCALE_INFO;

export const LOCALES = Object.keys(LOCALE_INFO) as Locale[];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

const pick = (key: "label" | "htmlLang" | "ogLocale") => {
  const out = {} as Record<Locale, string>;
  for (const locale of LOCALES) out[locale] = LOCALE_INFO[locale][key];
  return out;
};

export const LOCALE_LABELS = pick("label");

export const HTML_LANG = pick("htmlLang");

export const OG_LOCALE = pick("ogLocale");

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

// the default locale lives at the unprefixed path, so existing urls keep working
export function localizePath(path: string, lang: Locale): string {
  if (!path.startsWith("/")) return path;
  if (lang === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

export function splitLocale(pathname: string): { lang: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) {
    return { lang: first, path: `/${rest.join("/")}` };
  }
  return { lang: DEFAULT_LOCALE, path: pathname || "/" };
}

// exact tag first (zh-tw), then the base language (zh)
export function matchLocale(tag: string): Locale | undefined {
  const lower = tag.toLowerCase();
  const exact = LOCALES.find((locale) => locale.toLowerCase() === lower);
  if (exact) return exact;
  const base = lower.split("-")[0];
  return LOCALES.find((locale) => locale.toLowerCase() === base);
}
