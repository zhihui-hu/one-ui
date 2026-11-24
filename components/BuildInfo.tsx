"use client";

import { useEffect } from "react";
import { env } from "@/lib/env";
import { name, version } from "../package.json";

let printed = false;

function formatBuildTime(value: string | undefined) {
  const date = new Date(value ?? "");
  if (Number.isNaN(date.getTime())) return "unknown";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")} +08:00`;
}

// logs build metadata to the console once; renders nothing
export default function BuildInfo() {
  useEffect(() => {
    // strict mode and route remounts would print it again
    if (printed) return;
    printed = true;
    const print = (key: string, value: string) =>
      console.log(
        `%c ${key} %c ${value} %c `,
        "background:#20232a; padding: 1px; border-radius: 3px 0 0 3px; color: #fff",
        "background:#61dafb; padding: 1px; border-radius: 0 3px 3px 0; color: #20232a; font-weight: bold;",
        "background:transparent",
      );
    print(name, version);
    print("build time", formatBuildTime(env.BUILD_TIME));
  }, []);

  return null;
}
