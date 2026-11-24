import type { Metadata } from "next";
import LegalPage, { legalMetadata } from "@/components/legal/LegalPage";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  return legalMetadata("privacy", await resolveLocale(params));
}

export default async function PrivacyPage({ params }: LocaleParams) {
  return <LegalPage doc="privacy" lang={await resolveLocale(params)} />;
}
