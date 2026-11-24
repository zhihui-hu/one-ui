import type { TrafficRange } from "./types";

export const HOUR = 3600;
export const DAY = 86_400;
// dashboard days follow beijing time (utc+8, no daylight saving)
export const BEIJING = 8 * HOUR;

// bucket starts in unix seconds; hourly `end` is exclusive, daily `last` inclusive
export type Window =
  | { kind: "hour"; start: number; end: number }
  | { kind: "day"; first: number; last: number };

export function rangeWindow(range: TrafficRange, now: number): Window {
  const nextHour = now - mod(now, HOUR) + HOUR;
  const midnight = now + BEIJING - mod(now + BEIJING, DAY) - BEIJING;
  const hourly = (start: number, end: number): Window => ({
    kind: "hour",
    start,
    end,
  });
  switch (range) {
    case "24h":
      return hourly(nextHour - DAY, nextHour);
    case "today":
      return hourly(midnight, nextHour);
    case "yesterday":
      return hourly(midnight - DAY, midnight);
    case "3d":
      return hourly(nextHour - 3 * DAY, nextHour);
    case "30d":
      return { kind: "day", first: midnight - 29 * DAY, last: midnight };
  }
}

export function buckets(window: Window): number[] {
  const out: number[] = [];
  if (window.kind === "hour") {
    for (let t = window.start; t < window.end; t += HOUR) out.push(t);
  } else {
    for (let t = window.first; t <= window.last; t += DAY) out.push(t);
  }
  return out;
}

export function mod(value: number, by: number) {
  return ((value % by) + by) % by;
}

export function iso(seconds: number) {
  return new Date(seconds * 1000).toISOString().replace(".000Z", "Z");
}

export function date(seconds: number) {
  return iso(seconds).slice(0, 10);
}

export function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}
