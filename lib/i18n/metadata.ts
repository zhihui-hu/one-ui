import type { Metadata } from "next";
import { HTML_LANG, LOCALES, localizePath, type Locale } from "./config";

export function localeAlternates(
  path: string,
  lang: Locale,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = { "x-default": path };
  for (const locale of LOCALES) {
    languages[HTML_LANG[locale]] = localizePath(path, locale);
  }
  return { canonical: localizePath(path, lang), languages };
}
