import type { Metadata } from "next";
import { Inter, Geist_Mono, Cal_Sans } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandMenuLoader } from "@/components/CommandMenuLoader";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import {
  HTML_LANG,
  LOCALES,
  OG_LOCALE,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { localeAlternates } from "@/lib/i18n/metadata";
import { notFound } from "next/navigation";
import Analytics from "@/components/Analytics";
import BuildInfo from "@/components/BuildInfo";
import UpdateNotice from "@/components/UpdateNotice";
import {
  BING_SITE_VERIFICATION,
  GOOGLE_SITE_VERIFICATION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import { siteJsonLd } from "@/lib/seo";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const calSans = Cal_Sans({
  variable: "--font-cal-sans",
  subsets: ["latin"],
  weight: "400",
});

const openRunde = localFont({
  variable: "--font-open-runde",
  src: [
    {
      path: "../../public/fonts/OpenRunde-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenRunde-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/OpenRunde-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getMessages(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.tagline,
      template: `%s | ${SITE_NAME}`,
    },
    description: meta.description,
    keywords: meta.keywords,
    applicationName: SITE_NAME,
    authors: [{ name: "huzhihui", url: "https://github.com/zhihui-hu" }],
    creator: "huzhihui",
    publisher: SITE_NAME,
    alternates: localeAlternates("/", lang),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    verification: {
      google: GOOGLE_SITE_VERIFICATION || undefined,
      other: BING_SITE_VERIFICATION
        ? { "msvalidate.01": BING_SITE_VERIFICATION }
        : undefined,
    },
    icons: {
      icon: [{ url: "/logos/oneui-stack-favicon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      title: meta.tagline,
      description: meta.description,
      url: "/",
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      images: [
        {
          url: `/og/${lang}.png`,
          width: 1200,
          height: 630,
          alt: meta.ogAlt,
          type: "image/png",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.tagline,
      description: meta.description,
      images: [`/og/${lang}.png`],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const messages = getMessages(locale);

  return (
    <html
      lang={HTML_LANG[locale]}
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${openRunde.variable} ${calSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd(locale)),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider lang={locale} messages={messages}>
            <div className="flex flex-1 flex-col">{children}</div>
            <CommandMenuLoader />
            <UpdateNotice />
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
        <BuildInfo />
      </body>
    </html>
  );
}
