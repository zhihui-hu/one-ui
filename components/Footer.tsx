"use client";

import { Fragment } from "react";
import Link from "next/link";
import FluidWave from "./FluidWave";
import { GithubLogo, type LogoProps } from "./logos";
import { useI18n } from "@/components/i18n/I18nProvider";

const GITHUB_URL = "https://github.com/zhihui-hu/one-ui";
const DMCA_STATUS_URL =
  "https://www.dmca.com/Protection/Status.aspx?ID=7ce9d68a-4aef-4050-8f88-df33bdeac077&refurl=https://ui.huzhihui.com";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  icon?: (props: LogoProps) => React.ReactElement;
};

const HOVER =
  "transition-colors duration-150 ease-out hover:text-black dark:hover:text-white";

const MUTED = "text-black/50 dark:text-white/50";

function NavLink({ label, href, external, icon: Icon }: FooterLink) {
  const className = `w-fit ${Icon ? "flex items-center" : "text-lg"} ${MUTED} ${HOVER}`;
  const content = Icon ? <Icon className="h-[1.375rem] w-[1.375rem]" /> : label;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
        aria-label={Icon ? label : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      aria-label={Icon ? label : undefined}
    >
      {content}
    </Link>
  );
}

export default function Footer() {
  const { m, href } = useI18n();
  const LINKS: FooterLink[] = [
    { label: m.common.nav.home, href: href("/") },
    { label: m.common.nav.components, href: href("/components") },
    { label: "MCP", href: href("/mcp") },
    { label: "GitHub", href: GITHUB_URL, external: true, icon: GithubLogo },
  ];
  const UTILITY_LINKS = [
    { label: m.common.footer.traffic, href: href("/stats"), page: true },
    { label: m.common.footer.privacy, href: href("/privacy"), page: true },
    { label: m.common.footer.terms, href: href("/terms"), page: true },
    { label: m.common.footer.dmca, href: href("/dmca"), page: true },
    { label: m.common.footer.sitemap, href: "/sitemap.xml" },
    { label: "robots.txt", href: "/robots.txt" },
  ];

  return (
    <footer className="relative w-full overflow-hidden bg-white text-black dark:bg-black dark:text-white">
      <FluidWave />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white to-transparent dark:from-black" />

      <div className="relative mx-auto flex min-h-[min(40svh,50rem)] w-full max-w-[96rem] flex-col px-6 pt-10 sm:min-h-[min(85svh,50rem)] sm:px-10 sm:pt-24 md:pt-32">
        <div className="h-px w-full bg-white/10" />

        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <Link
            href={href("/")}
            className="flex h-fit w-fit items-center gap-2.5"
          >
            <img src="/logos/oneui-stack.svg" alt="" className="h-8 w-8" />
            <span className="font-runde text-2xl font-bold tracking-tight">
              One UI
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {LINKS.map((link, index) => (
              <Fragment key={link.label}>
                {link.icon && !LINKS[index - 1]?.icon && (
                  <span
                    aria-hidden="true"
                    className="-mx-3 text-lg text-black/25 dark:text-white/25"
                  >
                    |
                  </span>
                )}
                <NavLink {...link} />
              </Fragment>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center py-16">
          <h2 className="selection-contrast font-runde text-[clamp(3rem,12.5vw,10.5rem)] font-bold leading-[0.92] tracking-tight">
            {m.common.footer.headline}
          </h2>
        </div>

        <div
          className={`selection-contrast flex flex-wrap items-center justify-between gap-3 pb-8 text-xs ${MUTED}`}
        >
          <span className="flex flex-wrap items-center gap-2.5">
            <span>One UI &copy; {new Date().getFullYear()}</span>
          </span>
          <span className="flex flex-wrap items-center gap-2.5">
            {UTILITY_LINKS.map((link, index) => (
              <Fragment key={link.href}>
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="text-black/25 dark:text-white/25"
                  >
                    &middot;
                  </span>
                )}
                {link.page ? (
                  <Link href={link.href} className={HOVER}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} className={HOVER}>
                    {link.label}
                  </a>
                )}
              </Fragment>
            ))}
            <span
              aria-hidden="true"
              className="text-black/25 dark:text-white/25"
            >
              &middot;
            </span>
            <a
              href={DMCA_STATUS_URL}
              target="_blank"
              rel="noreferrer"
              title="DMCA.com Protection Status"
              className="flex h-4.25 w-fit overflow-hidden rounded-[3px] font-runde text-[9px] font-bold uppercase leading-none tracking-[0.06em] shadow-[0_0_3px_rgba(0,0,0,0.16)] dark:shadow-[0_0_3px_rgba(0,0,0,0.55)]"
            >
              <span className="flex items-center bg-[#ff3300] px-1.5 text-[#282828]">
                DMCA
              </span>
              <span className="flex items-center bg-[#282828] px-1.5 text-[#ff3300]">
                Protected
              </span>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
