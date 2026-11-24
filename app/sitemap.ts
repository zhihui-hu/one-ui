import type { MetadataRoute } from "next";
import { components } from "@/lib/components";
import { HTML_LANG, LOCALES, localizePath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

const lastModified = new Date("2026-07-30");

type Entry = Omit<MetadataRoute.Sitemap[number], "url" | "alternates"> & {
  path: string;
};

const ENTRIES: Entry[] = [
  { path: "/", lastModified, changeFrequency: "weekly", priority: 1 },
  {
    path: "/components",
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/mcp",
    lastModified: new Date("2026-10-05"),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/stats",
    lastModified: new Date("2026-11-24"),
    changeFrequency: "daily",
    priority: 0.4,
  },
  ...(["/privacy", "/terms", "/dmca"] as const).map((path) => ({
    path,
    lastModified: new Date("2026-11-24"),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  })),
  ...components.map((component) => ({
    path: component.href,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
];

const absolute = (path: string) =>
  path === "/" ? SITE_URL : `${SITE_URL}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return ENTRIES.flatMap(({ path, ...entry }) => {
    const languages = Object.fromEntries(
      LOCALES.map((lang) => [
        HTML_LANG[lang],
        absolute(localizePath(path, lang)),
      ]),
    );
    return LOCALES.map((lang) => ({
      ...entry,
      url: absolute(localizePath(path, lang)),
      alternates: { languages },
    }));
  });
}
