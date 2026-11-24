import type { Metadata } from "next";
import LegalPage, { legalMetadata } from "@/components/legal/LegalPage";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  return legalMetadata("terms", await resolveLocale(params));
}

export default async function TermsPage({ params }: LocaleParams) {
  return <LegalPage doc="terms" lang={await resolveLocale(params)} />;
}
