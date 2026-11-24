import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ComponentCard from "@/components/gallery/ComponentCard";
import GooeyNavbar from "@/components/GooeyNavbar";
import {
  components,
  gallerySections,
  localizeComponent,
} from "@/lib/components";
import { localizePath } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { getMessages } from "@/lib/i18n/messages";
import { localeAlternates } from "@/lib/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { rich } from "@/lib/i18n/rich";
import { componentsJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const { meta } = getMessages(lang);
  return {
    title: meta.componentsTitle,
    description: meta.componentsDescription,
    keywords: meta.keywords,
    alternates: localeAlternates("/components", lang),
  };
}

export default async function ComponentsIndexPage({ params }: LocaleParams) {
  const lang = await resolveLocale(params);
  const m = getMessages(lang);
  const sections = gallerySections.map((section) => ({
    ...section,
    items: section.items.map((item) => localizeComponent(item, m.components)),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(componentsJsonLd(lang)),
        }}
      />
      <GooeyNavbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 pt-32 sm:px-6 md:pt-40">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="max-w-2xl text-balance font-runde text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {format(m.common.componentsCount, { count: components.length })}
          </h1>
          <p className="max-w-lg text-balance text-sm font-medium text-muted-foreground sm:text-base">
            {rich(m.home.componentsSub, {
              mcp: (text) => (
                <a
                  href={localizePath("/mcp", lang)}
                  className="text-foreground underline decoration-foreground/25 underline-offset-4"
                >
                  {text}
                </a>
              ),
            })}{" "}
            <span className="hidden [@media(hover:hover)]:inline">
              <span className="text-[#FC4C01]">[</span>
              {m.home.hoverToPlay}
              <span className="text-[#FC4C01]">]</span>
            </span>
          </p>
        </header>

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="mt-14 scroll-mt-28 first:mt-10"
          >
            <h2 className="font-runde text-lg font-semibold tracking-tight sm:text-xl">
              {m.common.categories[section.id]}{" "}
              <span className="text-muted-foreground">
                <span className="text-[#FC4C01]">[</span>
                {section.items.length}
                <span className="text-[#FC4C01]">]</span>
              </span>
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <ComponentCard key={item.href} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </>
  );
}
