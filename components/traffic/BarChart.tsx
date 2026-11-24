"use client";

import { useState } from "react";

type Bar = { date: string; value: number };

export default function BarChart({
  bars,
  caption,
}: {
  bars: Bar[];
  caption: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...bars.map((b) => b.value));
  const active = hover === null ? null : bars[hover];

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative flex h-20 items-end gap-[3px]"
        onPointerLeave={() => setHover(null)}
      >
        {bars.map((bar, i) => (
          <div
            key={bar.date}
            className="flex h-full flex-1 items-end"
            onPointerEnter={() => setHover(i)}
          >
            <div
              className="w-full rounded-[3px] bg-[#30D158] transition-opacity duration-150"
              style={{
                height: bar.value ? `${(bar.value / max) * 100}%` : "2px",
                opacity: hover === null || hover === i ? 1 : 0.45,
              }}
            />
          </div>
        ))}
        {active && hover !== null && (
          <div
            className="pointer-events-none absolute -top-2 z-10 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-xs text-background shadow-sm"
            style={{
              left: `${((hover + 0.5) / bars.length) * 100}%`,
              transform: `translate(${hover / bars.length > 0.7 ? "-100%" : hover / bars.length < 0.3 ? "0" : "-50%"}, -100%)`,
            }}
          >
            <span className="opacity-60">{active.date.slice(5)}</span>{" "}
            <span className="font-semibold tabular-nums">{active.value}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between text-[11px] tabular-nums text-muted-foreground">
        <span>{bars[0]?.date.slice(5)}</span>
        <span>{caption}</span>
        <span>{bars[bars.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}
