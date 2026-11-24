"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

type I18nValue = {
  lang: Locale;
  m: Messages;
  href: (path: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  lang,
  messages,
  children,
}: {
  lang: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({
      lang,
      m: messages,
      href: (path: string) => localizePath(path, lang),
    }),
    [lang, messages],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
