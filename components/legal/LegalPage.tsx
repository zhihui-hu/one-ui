import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import GooeyNavbar from "@/components/GooeyNavbar";
import { CONTACT_EMAIL } from "@/lib/components";
import { OG_LOCALE, localizePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeAlternates } from "@/lib/i18n/metadata";
import { rich } from "@/lib/i18n/rich";
import { SITE_NAME } from "@/lib/site";

export type LegalDoc = "privacy" | "terms" | "dmca";

const LINK =
  "text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-foreground";

export function legalMetadata(doc: LegalDoc, lang: Locale): Metadata {
  const page = getMessages(lang).legal[doc];
  const path = `/${doc}`;
  return {
    title: page.title,
    description: page.description,
    alternates: localeAlternates(path, lang),
    openGraph: {
      title: `${page.title} | ${SITE_NAME}`,
      description: page.description,
      url: localizePath(path, lang),
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      type: "website",
    },
  };
}

export default function LegalPage({
  doc,
  lang,
}: {
  doc: LegalDoc;
  lang: Locale;
}) {
  const { legal } = getMessages(lang);
  const page = legal[doc];
  const text = (message: string) =>
    rich(message.replaceAll("{email}", CONTACT_EMAIL), {
      email: (chunk) => (
        <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
          {chunk}
        </a>
      ),
      dmca: (chunk) => (
        <Link href={localizePath("/dmca", lang)} className={LINK}>
          {chunk}
        </Link>
      ),
    });

  return (
    <>
      <GooeyNavbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-32 sm:px-6 md:pt-40">
        <header className="flex flex-col gap-3">
          <h1 className="font-runde text-3xl font-bold tracking-tight sm:text-4xl">
            {page.title}
          </h1>
          <p className="font-medium text-muted-foreground">
            {page.description}
          </p>
          <p className="text-sm text-muted-foreground/70">
            {legal.updatedLabel.replace("{date}", legal.updated)}
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-10">
          {page.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h2 className="font-runde text-lg font-bold tracking-tight">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[15px] leading-relaxed text-muted-foreground"
                >
                  {text(paragraph)}
                </p>
              ))}
            </section>
          ))}

          <section className="flex flex-col gap-3 border-t border-foreground/10 pt-10">
            <h2 className="font-runde text-lg font-bold tracking-tight">
              {legal.contactHeading}
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {text(legal.contactBody)}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
