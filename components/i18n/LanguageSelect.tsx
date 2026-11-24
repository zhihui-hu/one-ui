"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import {
  LOCALE_COOKIE,
  LOCALE_LABELS,
  LOCALES,
  localizePath,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

// session cookie: a fresh browser session follows the browser language again
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; samesite=lax`;
}

const spring = { type: "spring", stiffness: 420, damping: 32 } as const;

export default function LanguageSelect({
  side = "bottom",
  className,
}: {
  side?: "top" | "bottom";
  className?: string;
}) {
  const { lang, m } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    itemRefs.current[LOCALES.indexOf(lang)]?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, lang]);

  const select = (next: Locale) => {
    setOpen(false);
    triggerRef.current?.focus();
    if (next === lang) return;
    rememberLocale(next);
    const { path } = splitLocale(pathname);
    router.push(`${localizePath(path, next)}${window.location.hash}`);
  };

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const move = (to: number) => {
      event.preventDefault();
      items[(to + items.length) % items.length]?.focus();
    };
    if (event.key === "ArrowDown") move(index + 1);
    else if (event.key === "ArrowUp") move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(items.length - 1);
    else if (event.key === "Tab") setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${m.common.language.label}: ${LOCALE_LABELS[lang]}`}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 transition-colors",
          className,
        )}
      >
        <Languages className="size-5 shrink-0" />
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 opacity-60 transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={m.common.language.label}
            onKeyDown={onMenuKeyDown}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: side === "bottom" ? -4 : 4 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: side === "bottom" ? -4 : 4 }
            }
            transition={reduceMotion ? { duration: 0.1 } : spring}
            className={cn(
              "absolute right-0 z-50 flex min-w-40 flex-col gap-0.5 rounded-[22px] border border-black/[0.06] bg-white p-1.5 shadow-lg dark:border-transparent dark:border-apple dark:bg-neutral-900",
              side === "bottom"
                ? "top-full mt-2 origin-top-right"
                : "bottom-full mb-2 origin-bottom-right",
            )}
          >
            {LOCALES.map((locale, index) => {
              const selected = locale === lang;
              return (
                <button
                  key={locale}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  lang={locale}
                  onClick={() => select(locale)}
                  className={cn(
                    "flex h-10 cursor-pointer items-center justify-between gap-3 rounded-[16px] px-3 text-left text-sm outline-none transition-colors focus-visible:bg-neutral-100 dark:focus-visible:bg-neutral-800",
                    selected
                      ? "font-semibold text-neutral-900 dark:text-white"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-white/60 dark:hover:bg-neutral-800 dark:hover:text-white",
                  )}
                >
                  {LOCALE_LABELS[locale]}
                  {selected && <Check className="size-4 text-[#FC4C01]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
