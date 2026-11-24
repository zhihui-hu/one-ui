"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export default function SidebarHeader({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const { m, href } = useI18n();
  return (
    <nav
      aria-label={m.common.sidebar.breadcrumb}
      className={cn("flex items-center gap-2", className)}
    >
      <Link
        href={href("/")}
        onClick={onNavigate}
        className="flex items-center gap-1.5 text-foreground/50 transition-colors duration-200 hover:text-foreground"
      >
        <img src="/logos/oneui-stack.svg" alt="" className="size-3.5" />
        One UI
      </Link>
      <span aria-hidden className="text-foreground/25">
        /
      </span>
      <Link
        href={href("/components")}
        onClick={onNavigate}
        className="text-foreground"
      >
        {m.common.nav.components}
      </Link>
    </nav>
  );
}
