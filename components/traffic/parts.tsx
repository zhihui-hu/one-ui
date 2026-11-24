"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export const notConfigured = (data: unknown) =>
  typeof data === "object" &&
  data !== null &&
  (data as { configured?: boolean }).configured === false;

export type Load<T> =
  | { state: "loading" }
  | { state: "error" }
  | { state: "ready"; data: T | { configured: false } };

export function Panel({
  logo,
  title,
  note,
  children,
}: {
  logo: ReactNode;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-5 rounded-[28px] bg-[#F5F5F7] p-5 dark:bg-[#121212] sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-center gap-2.5 font-runde text-lg font-bold tracking-tight">
          {logo}
          {title}
        </h2>
        {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      </header>
      {children}
    </section>
  );
}

// the panel body for anything other than ready data
export function PanelState<T>({
  load,
  children,
}: {
  load: Load<T>;
  children: (data: T) => ReactNode;
}) {
  const { m } = useI18n();
  if (load.state === "ready" && notConfigured(load.data)) {
    return <Message>{m.stats.notConfigured}</Message>;
  }
  if (load.state === "ready") return <>{children(load.data as T)}</>;
  if (load.state === "error") return <Message>{m.stats.unavailable}</Message>;
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <span className="sr-only">{m.stats.loading}</span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="h-[4.25rem] animate-pulse rounded-2xl bg-foreground/5"
          />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-foreground/5" />
    </div>
  );
}

function Message({ children }: { children: ReactNode }) {
  return (
    <p className="flex min-h-40 items-center justify-center rounded-2xl bg-foreground/[0.03] px-4 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function Tile({
  label,
  value,
  active,
  onSelect,
}: {
  label: string;
  value: string;
  active?: boolean;
  onSelect?: () => void;
}) {
  const body = (
    <>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tracking-tight tabular-nums">
        {value}
      </span>
    </>
  );
  const className = cn(
    "flex min-w-0 flex-col gap-1 rounded-2xl px-3.5 py-3 text-left transition-colors duration-150",
    active
      ? "bg-[#0A84FF]/10 ring-1 ring-[#0A84FF]/40 ring-inset"
      : "bg-white dark:bg-white/[0.04]",
  );
  if (!onSelect) return <div className={className}>{body}</div>;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        className,
        "cursor-pointer",
        !active && "hover:bg-white/70 dark:hover:bg-white/[0.07]",
      )}
    >
      {body}
    </button>
  );
}

export function ChartHeading({ label, peak }: { label: string; peak: string }) {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums">{peak}</span>
    </div>
  );
}

export function RankList({
  title,
  rows,
  barClass,
}: {
  title: string;
  rows: { key: string; label: ReactNode; value: string; share: number }[];
  barClass: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <h3 className="mb-1 text-xs text-muted-foreground">{title}</h3>
      {rows.map((row) => (
        <div key={row.key} className="flex flex-col gap-1.5 py-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{row.label}</span>
            <span className="flex shrink-0 gap-3 tabular-nums">
              <span>{row.value}</span>
              <span className="w-12 text-right text-muted-foreground">
                {row.share.toFixed(1)}%
              </span>
            </span>
          </div>
          <div className="h-[3px] rounded-full bg-foreground/6">
            <div
              className={cn("h-full rounded-full", barClass)}
              style={{ width: `${Math.min(100, row.share)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
