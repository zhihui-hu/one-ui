import type { Metadata } from "next";
import Link from "next/link";
import GooeyNavbar from "@/components/GooeyNavbar";
import HeroCta from "@/components/HeroCta";
import HeroIntro from "@/components/HeroIntro";
import ComponentsShowcase from "@/components/ComponentsShowcase";
import Footer from "@/components/Footer";
import SpiderWebs from "@/components/SpiderWebs";
import DiwaliLights from "@/components/DiwaliLights";
import { localizePath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeAlternates } from "@/lib/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { rich } from "@/lib/i18n/rich";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  return { alternates: localeAlternates("/", await resolveLocale(params)) };
}

export default async function Home({ params }: LocaleParams) {
  const lang = await resolveLocale(params);
  const { home } = getMessages(lang);

  return (
    <>
      <section className="relative w-full p-1.5 md:p-2.5">
        <div className="relative flex min-h-[min(100svh_-_0.75rem,60rem)] w-full items-center justify-center overflow-hidden rounded-[45px] border border-black/[0.04] bg-[#F5F5F7] dark:border-transparent dark:border-apple dark:bg-[#121212] md:min-h-[min(100svh_-_1.25rem,60rem)]">
          <GooeyNavbar />

          <img
            src="/logos/oneui-stack-mark.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[68%] w-[860px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.05] [filter:brightness(0)] dark:opacity-[0.07] dark:[filter:brightness(0)_invert(1)]"
          />
          <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(120%_75%_at_50%_-5%,rgba(255,255,255,0.07),transparent_60%)] dark:block" />
          <SpiderWebs />
          <DiwaliLights />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-3 px-4 pb-20 pt-28 text-center sm:gap-4 sm:px-6">
            <HeroIntro
              headline={home.headline}
              sub={rich(home.sub, {
                mcp: (text) => (
                  <Link
                    href={localizePath("/mcp", lang)}
                    className="text-inherit"
                  >
                    {text}
                  </Link>
                ),
              })}
            >
              <HeroCta />
            </HeroIntro>
          </div>
        </div>
      </section>
      <ComponentsShowcase />
      <Footer />
    </>
  );
}
