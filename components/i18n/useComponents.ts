"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/i18n/I18nProvider";
import {
  components,
  localizeComponent,
  type ComponentItem,
} from "@/lib/components";
import { splitLocale } from "@/lib/i18n/config";

export function useComponents(): ComponentItem[] {
  const { m } = useI18n();
  return useMemo(
    () => components.map((item) => localizeComponent(item, m.components)),
    [m.components],
  );
}

export function useActiveComponent(): ComponentItem | undefined {
  const pathname = usePathname();
  const items = useComponents();
  const { path } = splitLocale(pathname);
  return items.find((item) => item.href === path);
}

export function useLocalPath(): string {
  return splitLocale(usePathname()).path;
}
