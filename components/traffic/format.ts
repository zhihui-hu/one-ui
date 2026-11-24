import { HTML_LANG, type Locale } from "@/lib/i18n/config";

const compactFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

// 59.5k / 1.48M, matching cloudflare's own dashboard
export const compact = (value: number) =>
  compactFormat.format(value).replace("K", "k");

export function bytes(value: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unit = 0;
  while (size >= 1000 && unit < units.length - 1) {
    size /= 1000;
    unit += 1;
  }
  return `${unit === 0 ? size : size.toFixed(2)} ${units[unit]}`;
}

export const percent = (value: number | null, digits = 1) =>
  value === null ? "–" : `${value.toFixed(digits)}%`;

export const share = (part: number, whole: number) =>
  whole === 0 ? 0 : (part / whole) * 100;

export function duration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m ? `${m}m ${s}s` : `${s}s`;
}

export function regionName(code: string, lang: Locale, unknown: string) {
  if (code === "T1") return "Tor";
  if (code === "XX" || !/^[A-Z]{2}$/.test(code)) return unknown;
  return (
    new Intl.DisplayNames([HTML_LANG[lang]], { type: "region" }).of(code) ??
    code
  );
}

const beijing = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hourCycle: "h23",
    ...options,
  });

const monthDay = (iso: string) => iso.slice(5, 10);

// hourly buckets read in beijing time, daily ones are already calendar dates
export function bucketLabel(time: string, granularity: "hour" | "day") {
  if (granularity === "day") return monthDay(time);
  const parts = beijing({
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(time));
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

export function axisLabel(time: string, granularity: "hour" | "day") {
  if (granularity === "day") return monthDay(time);
  return `${beijing({ hour: "2-digit", minute: "2-digit" }).format(new Date(time))}`;
}

export function updatedLabel(iso: string) {
  const parts = beijing({
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("month")}-${get("day")} ${get("hour")}:${get("minute")} (UTC+8)`;
}
