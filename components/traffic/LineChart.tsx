"use client";

import { useRef, useState } from "react";
import { axisLabel, bucketLabel } from "./format";

type Point = { time: string; value: number };

const TICKS = 4;
const X_LABELS = 7;

// rounds the axis top up to 1, 2 or 5 times a power of ten
function niceMax(value: number) {
  if (value <= 0) return TICKS;
  const step = value / TICKS;
  const power = 10 ** Math.floor(Math.log10(step));
  const nice = [1, 2, 5, 10].find((n) => n * power >= step) ?? 10;
  return nice * power * TICKS;
}

export default function LineChart({
  points,
  granularity,
  format,
}: {
  points: Point[];
  granularity: "hour" | "day";
  format: (value: number) => string;
}) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const top = niceMax(Math.max(0, ...points.map((p) => p.value)));
  const last = Math.max(points.length - 1, 1);
  const x = (i: number) => (i / last) * 100;
  const y = (v: number) => 100 - (v / top) * 100;

  const line = points
    .map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`)
    .join(" ");
  const area = points.length
    ? `${line} L${x(points.length - 1)},100 L0,100 Z`
    : "";
  const labelStep = Math.max(1, Math.ceil(points.length / X_LABELS));
  const active = hover === null ? null : points[hover];

  function track(clientX: number) {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect || !points.length) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setHover(Math.round(ratio * last));
  }

  return (
    <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-2">
      <div className="relative h-40 text-right text-[11px] tabular-nums text-muted-foreground">
        {Array.from({ length: TICKS + 1 }, (_, i) => (
          <span
            key={i}
            className="absolute right-0 -translate-y-1/2"
            style={{ top: `${(i / TICKS) * 100}%` }}
          >
            {format((top / TICKS) * (TICKS - i))}
          </span>
        ))}
      </div>

      <div
        ref={plotRef}
        className="relative h-40 touch-none"
        onPointerMove={(e) => track(e.clientX)}
        onPointerDown={(e) => track(e.clientX)}
        onPointerLeave={() => setHover(null)}
      >
        {Array.from({ length: TICKS + 1 }, (_, i) => (
          <div
            key={i}
            className="absolute inset-x-0 border-t border-dashed border-foreground/8"
            style={{ top: `${(i / TICKS) * 100}%` }}
          />
        ))}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible text-[#0A84FF]"
          aria-hidden="true"
        >
          <path d={area} fill="currentColor" opacity={0.1} />
          <path
            d={line}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {active && hover !== null && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 w-px bg-foreground/20"
              style={{ left: `${x(hover)}%` }}
            />
            <div
              className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-[#0A84FF]"
              style={{ left: `${x(hover)}%`, top: `${y(active.value)}%` }}
            />
            <div
              className="pointer-events-none absolute -top-2 z-10 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-xs text-background shadow-sm"
              style={{
                left: `${x(hover)}%`,
                transform: `translate(${hover / last > 0.7 ? "-100%" : hover / last < 0.3 ? "0" : "-50%"}, -100%)`,
              }}
            >
              <span className="opacity-60">
                {bucketLabel(active.time, granularity)}
              </span>{" "}
              <span className="font-semibold tabular-nums">
                {format(active.value)}
              </span>
            </div>
          </>
        )}

        <div className="absolute inset-x-0 top-full mt-2 h-4 text-[11px] tabular-nums text-muted-foreground">
          {points.map((p, i) =>
            i % labelStep === 0 ? (
              <span
                key={p.time}
                className="absolute -translate-x-1/2 whitespace-nowrap"
                style={{ left: `${x(i)}%` }}
              >
                {axisLabel(p.time, granularity)}
              </span>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
