"use client";

import CtaLink from "@/components/not-found/CtaLink";
import DodgingDigits from "@/components/not-found/DodgingDigits";
import Rise from "@/components/not-found/Rise";
import { useI18n } from "@/components/i18n/I18nProvider";

const CARD =
  "relative flex min-h-[min(100svh_-_0.75rem,60rem)] w-full items-center justify-center overflow-hidden rounded-[45px] border border-black/[0.04] bg-[#F5F5F7] dark:border-transparent dark:border-apple dark:bg-[#121212] md:min-h-[min(100svh_-_1.25rem,60rem)]";

const GLOW =
  "pointer-events-none absolute inset-0 hidden bg-[radial-gradient(120%_75%_at_50%_-5%,rgba(255,255,255,0.07),transparent_60%)] dark:block";

export default function NotFoundHero() {
  const { m } = useI18n();
  return (
    <section className="relative w-full p-1.5 md:p-2.5">
      <div className={CARD}>
        <div className={GLOW} />

        <div className="relative flex flex-col items-center justify-center gap-4 px-6 pb-24 pt-28 text-center sm:gap-5">
          <title>{`${m.common.notFound.title} | One UI`}</title>
          <meta name="description" content={m.common.notFound.description} />
          <h1 className="sr-only">{m.common.notFound.title}</h1>

          <Rise
            index={0}
            className="font-runde text-[6.5rem] font-bold leading-[0.85] tracking-tight sm:text-[9rem] lg:text-[12rem]"
          >
            <DodgingDigits digits="404" accentIndex={1} />
          </Rise>

          <Rise index={1}>
            <p className="font-runde text-2xl font-bold tracking-tight text-black dark:text-white sm:text-3xl">
              {m.common.notFound.headline}
            </p>
          </Rise>

          <Rise index={2}>
            <p className="max-w-md font-medium text-black/60 dark:text-white/60 sm:text-lg">
              {m.common.notFound.body}
            </p>
          </Rise>

          <Rise
            index={3}
            className="mt-4 flex flex-col items-center gap-3 sm:flex-row"
          >
            <CtaLink
              href="/components"
              label={m.common.notFound.browse}
              primary
            />
            <CtaLink href="/" label={m.common.notFound.home} />
          </Rise>
        </div>
      </div>
    </section>
  );
}
