import type { Metadata } from "next";
import HeroIntro from "@/components/HeroIntro";
import CtaLink from "@/components/not-found/CtaLink";
import { CONTACT_EMAIL } from "@/lib/components";
import { getMessages } from "@/lib/i18n/messages";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { common } = getMessages(await resolveLocale(params));
  return {
    title: common.unavailable.title,
    description: common.unavailable.description,
    robots: { index: false, follow: false },
  };
}

export default async function Unavailable({ params }: LocaleParams) {
  const { common } = getMessages(await resolveLocale(params));

  return (
    <section className="relative w-full p-1.5 md:p-2.5">
      <div className="relative flex min-h-[calc(100svh_-_0.75rem)] w-full items-center justify-center overflow-hidden rounded-[45px] border border-black/4 bg-[#F5F5F7] dark:border-transparent dark:border-apple dark:bg-[#121212] md:min-h-[calc(100svh_-_1.25rem)]">
        <img
          src="/logos/oneui-stack.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[68%] w-[860px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-5 [filter:brightness(0)] dark:opacity-[0.07] dark:[filter:brightness(0)_invert(1)]"
        />
        <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(120%_75%_at_50%_-5%,rgba(255,255,255,0.07),transparent_60%)] dark:block" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-3 px-4 pb-20 pt-28 text-center sm:gap-4 sm:px-6">
          <HeroIntro
            headline={common.unavailable.headline}
            sub={common.unavailable.body}
            badge={
              <img
                src="/logos/oneui-stack.svg"
                alt="One UI"
                className="h-12 w-12"
              />
            }
          >
            <div className="mt-4">
              <CtaLink
                href={`mailto:${CONTACT_EMAIL}`}
                label={common.unavailable.contact}
                primary
              />
            </div>
          </HeroIntro>
        </div>
      </div>
    </section>
  );
}
