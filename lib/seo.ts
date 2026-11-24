import type { Metadata } from "next";
import { components, localizeComponent } from "@/lib/components";
import { HTML_LANG, localizePath, type Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { getMessages } from "@/lib/i18n/messages";
import { localeAlternates } from "@/lib/i18n/metadata";
import { SITE_ALT_NAMES, SITE_NAME, SITE_REPO, SITE_URL } from "@/lib/site";

function localizedComponents(lang: Locale) {
  const translations = getMessages(lang).components;
  return components.map((item) => localizeComponent(item, translations));
}

function findComponent(href: string, lang: Locale) {
  const item = components.find((c) => c.href === href);
  return item && localizeComponent(item, getMessages(lang).components);
}

const absolute = (path: string, lang: Locale) => {
  const localized = localizePath(path, lang);
  return localized === "/" ? SITE_URL : `${SITE_URL}${localized}`;
};

export function componentPageMetadata(href: string, lang: Locale): Metadata {
  const item = findComponent(href, lang);
  const source = components.find((c) => c.href === href);
  if (!item || !source) return {};

  const { meta } = getMessages(lang);
  const name = source.name.toLowerCase();

  return {
    title: format(meta.componentTitle, { name: item.name }),
    description: item.description,
    keywords: [
      item.name,
      name,
      `${name} react`,
      `${name} component`,
      `animated ${name}`,
      `${name} shadcn`,
      ...meta.keywords,
    ],
    alternates: localeAlternates(item.href, lang),
  };
}

export function componentJsonLd(href: string, lang: Locale) {
  const item = findComponent(href, lang);
  if (!item) return null;

  const { meta } = getMessages(lang);
  const url = absolute(item.href, lang);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: meta.breadcrumbHome,
            item: absolute("/", lang),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: meta.breadcrumbComponents,
            item: absolute("/components", lang),
          },
          { "@type": "ListItem", position: 3, name: item.name, item: url },
        ],
      },
      {
        "@type": "SoftwareSourceCode",
        name: item.name,
        description: item.description,
        url,
        inLanguage: HTML_LANG[lang],
        codeRepository: item.source ?? SITE_REPO,
        programmingLanguage: "TypeScript",
        runtimePlatform: "React",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        license: `${SITE_REPO}/blob/main/LICENSE`,
        author: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function siteJsonLd(lang: Locale) {
  const { meta } = getMessages(lang);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_ALT_NAMES,
        url: SITE_URL,
        logo: `${SITE_URL}/logos/oneui-stack.svg`,
        sameAs: [SITE_REPO],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: SITE_ALT_NAMES,
        url: SITE_URL,
        description: meta.description,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: HTML_LANG[lang],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: SITE_NAME,
        alternateName: SITE_ALT_NAMES,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: absolute("/", lang),
        description: meta.description,
        softwareHelp: absolute("/components", lang),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };
}

export function componentsJsonLd(lang: Locale) {
  const { meta } = getMessages(lang);
  const items = localizedComponents(lang);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: format(meta.collectionName, { site: SITE_NAME }),
    url: absolute("/components", lang),
    inLanguage: HTML_LANG[lang],
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        description: item.description,
        url: absolute(item.href, lang),
      })),
    },
  };
}
