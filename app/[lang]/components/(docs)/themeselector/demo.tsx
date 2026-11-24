"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import ThemeSelector, { DEFAULT_THEMES } from "@/components/ui/theme-selector";
import { useI18n } from "@/components/i18n/I18nProvider";

const subscribe = () => () => {};

export default function ThemeSelectorPage() {
  const { m } = useI18n();
  const t = m.demos.themeselector;
  const names: Record<string, string> = t.themes;
  const themes = DEFAULT_THEMES.map((theme) => ({
    ...theme,
    label: names[theme.value] ?? theme.label,
  }));
  const { resolvedTheme, setTheme } = useTheme();
  // false during ssr and hydration, so the first client render matches the server
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <div className="relative flex h-full items-center justify-center px-6 font-runde">
      <div className="flex min-w-0 flex-col gap-4 rounded-[calc(22px*var(--corner-scale))] bg-white px-5 py-4 dark:bg-black">
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold tracking-[-0.01em] text-black dark:text-white">
            {t.title}
          </p>
          <p className="text-[13px] font-medium text-[#868593]">
            {t.description}
          </p>
        </div>
        <ThemeSelector
          themes={themes}
          aria-label={t.title}
          value={hydrated ? (resolvedTheme ?? null) : null}
          onChange={setTheme}
        />
      </div>
    </div>
  );
}
