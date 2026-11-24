import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import GooeyNavbar from "@/components/GooeyNavbar";
import McpAsk from "@/components/mcp/McpAsk";
import McpClients from "@/components/mcp/McpClients";
import McpCode from "@/components/mcp/McpCode";
import McpText from "@/components/mcp/McpText";
import CodeBlock from "@/components/ui/code-block";
import { MCP_CLI, MCP_COMPONENTS_JSON } from "@/lib/mcp";
import { OG_LOCALE, localizePath, type Locale } from "@/lib/i18n/config";
import { getMessages, type Messages } from "@/lib/i18n/messages";
import { localeAlternates } from "@/lib/i18n/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { rich } from "@/lib/i18n/rich";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const { mcp } = getMessages(lang);
  return {
    title: "MCP",
    description: mcp.description,
    alternates: localeAlternates("/mcp", lang),
    openGraph: {
      title: `MCP | ${SITE_NAME}`,
      description: mcp.description,
      url: localizePath("/mcp", lang),
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      type: "website",
    },
  };
}

const steps = (
  mcp: Messages["mcp"],
): { heading: string; content: ReactNode }[] => [
  {
    heading: mcp.steps.registry.heading,
    content: (
      <>
        <McpText>{mcp.steps.registry.body}</McpText>
        <CodeBlock
          code={MCP_COMPONENTS_JSON}
          language="json"
          showFrame={false}
          showLineNumbers={false}
          className="rounded-lg bg-muted p-3"
        />
      </>
    ),
  },
  {
    heading: mcp.steps.connect.heading,
    content: <McpClients />,
  },
  {
    heading: mcp.steps.ask.heading,
    content: (
      <>
        <McpText>{mcp.steps.ask.body}</McpText>
        <McpAsk />
      </>
    ),
  },
];

export default async function McpPage({ params }: LocaleParams) {
  const lang: Locale = await resolveLocale(params);
  const { mcp } = getMessages(lang);
  const STEPS = steps(mcp);

  return (
    <>
      <GooeyNavbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-32 sm:px-6 md:pt-40">
        <header className="flex flex-col gap-3">
          <h1 className="font-runde text-3xl font-bold tracking-tight sm:text-4xl">
            MCP
          </h1>
          <p className="font-medium text-muted-foreground">{mcp.description}</p>
        </header>

        <ol className="mt-12 flex flex-col">
          {STEPS.map((step, index) => (
            <li
              key={step.heading}
              className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 pb-12 last:pb-0"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-[#FC4C01]/10 font-mono text-xs font-medium text-[#FC4C01]">
                {index + 1}
              </span>
              <section className="flex flex-col gap-3">
                <h2 className="font-runde text-lg font-bold leading-6 tracking-tight">
                  {step.heading}
                </h2>
                {step.content}
              </section>
            </li>
          ))}
        </ol>

        <section className="mt-16 flex flex-col gap-3 border-t border-foreground/10 pt-10">
          <h2 className="font-runde text-lg font-bold tracking-tight">
            {mcp.withoutHeading}
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {rich(mcp.withoutBody, {
              link: (text) => (
                <Link
                  href={localizePath("/components", lang)}
                  className="text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-foreground"
                >
                  {text}
                </Link>
              ),
            })}
          </p>
          <McpCode value={MCP_CLI} />
        </section>
      </main>

      <Footer />
    </>
  );
}
