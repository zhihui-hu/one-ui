import type { Metadata } from "next";
import LegalPage, { legalMetadata } from "@/components/legal/LegalPage";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  return legalMetadata("dmca", await resolveLocale(params));
}

export default async function DmcaPage({ params }: LocaleParams) {
  return <LegalPage doc="dmca" lang={await resolveLocale(params)} />;
}
