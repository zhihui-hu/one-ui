"use client";

import type { MouseEvent } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/I18nProvider";

type ThemeName = "light" | "dark";

function applyThemeToRoot(theme: ThemeName) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

const ContrastIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 3l0 18" />
    <path d="M12 9l4.65 -4.65" />
    <path d="M12 14.3l7.37 -7.37" />
    <path d="M12 19.6l8.85 -8.85" />
  </svg>
);

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { m } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    const nextTheme: ThemeName = resolvedTheme === "dark" ? "light" : "dark";
    const update = () => {
      applyThemeToRoot(nextTheme);
      setTheme(nextTheme);
    };

    if (
      typeof document.startViewTransition !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      update();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    const transition = document.startViewTransition(update);
    // going dark shrinks the old light snapshot instead, see globals.css z-index swap
    void transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: nextTheme === "dark" ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 400,
            easing: "ease-in",
            fill: "both",
            pseudoElement:
              nextTheme === "dark"
                ? "::view-transition-old(root)"
                : "::view-transition-new(root)",
          },
        );
      })
      .catch(() => undefined);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={m.common.toggleTheme}
      className={cn(
        "cursor-pointer rounded-lg bg-secondary p-2 text-foreground/80 transition-colors hover:text-foreground",
        className,
      )}
    >
      <ContrastIcon className="h-5 w-5" />
    </button>
  );
}
