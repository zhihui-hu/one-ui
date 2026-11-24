import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";

export type LocaleParams = { params: Promise<{ lang: string }> };

export async function resolveLocale(
  params: LocaleParams["params"],
): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}
