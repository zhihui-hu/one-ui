import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import GooeyNavbar from "@/components/GooeyNavbar";
import TrafficDashboard from "@/components/traffic/TrafficDashboard";
import { OG_LOCALE, localizePath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeAlternates } from "@/lib/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const { stats } = getMessages(lang);
  return {
    title: stats.title,
    description: stats.description,
    alternates: localeAlternates("/stats", lang),
    openGraph: {
      title: `${stats.title} | ${SITE_NAME}`,
      description: stats.description,
      url: localizePath("/stats", lang),
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      type: "website",
    },
  };
}

export default async function StatsPage({ params }: LocaleParams) {
  const { stats } = getMessages(await resolveLocale(params));

  return (
    <>
      <GooeyNavbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 pt-32 sm:px-6 md:pt-40">
        <header className="mb-8 flex flex-col gap-3">
          <h1 className="font-runde text-3xl font-bold tracking-tight sm:text-4xl">
            {stats.title}
          </h1>
          <p className="max-w-2xl font-medium text-muted-foreground">
            {stats.description}
          </p>
        </header>

        <Suspense>
          <TrafficDashboard />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
