import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  matchLocale,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const match = matchLocale(tag);
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}

// unprefixed urls answer differently per browser language, so shared caches must key on it
function varyByLocale(response: NextResponse) {
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { lang, path } = splitLocale(pathname);
  const prefixed = pathname !== path;

  if (prefixed && lang === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  }
  if (prefixed) return NextResponse.next();

  const preferred = preferredLocale(request);
  if (preferred !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/" ? `/${preferred}` : `/${preferred}${pathname}`;
    return varyByLocale(NextResponse.redirect(url));
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return varyByLocale(NextResponse.rewrite(url));
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
