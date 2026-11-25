"use client";

import {
  AppInfo,
  buildVersion,
  formatBuildTime,
  printInfo,
} from "@/components/ui/app-info";
import { useI18n } from "@/components/i18n/I18nProvider";
import { name } from "@/package.json";

const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME;
const TIME_ZONE = "Asia/Shanghai";
const USER = { id: 42, role: "admin" };

const INFO: Record<string, unknown> = {
  [name]: buildVersion(BUILD_TIME, TIME_ZONE),
  "build time": formatBuildTime(BUILD_TIME, TIME_ZONE),
  env: process.env.NODE_ENV,
  user: USER,
};

export default function AppInfoPage() {
  const { m } = useI18n();
  const t = m.demos.appinfo;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 font-runde">
      <AppInfo info={INFO} />
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-[#F4F4F9] dark:bg-[#1C1C1E]">
        <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wide text-[#868593]">
          {t.console}
        </p>
        <ul className="flex flex-col gap-2 px-4 pb-4 pt-2.5 font-mono text-xs">
          {Object.entries(INFO).map(([key, value]) => {
            const expandable = typeof value === "object" && value !== null;
            return (
              <li key={key} className="flex min-w-0 items-center">
                <span
                  className={`bg-[#20232a] px-1.5 py-px text-white ${expandable ? "rounded-[3px]" : "rounded-l-[3px]"}`}
                >
                  {key}
                </span>
                {expandable ? (
                  <span className="ml-2 truncate text-[#868593]">
                    {JSON.stringify(value)}
                  </span>
                ) : (
                  <span className="truncate rounded-r-[3px] bg-[#61dafb] px-1.5 py-px font-bold text-[#20232a]">
                    {String(value)}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <button
        type="button"
        onClick={() =>
          Object.entries(INFO).forEach(([key, value]) => printInfo(key, value))
        }
        className="h-9 cursor-pointer rounded-full bg-[#F4F4F9] px-4 text-[13px] font-semibold text-black transition-[transform,background-color] hover:bg-[#EDEDF3] active:scale-95 motion-reduce:transition-none dark:bg-[#262626] dark:text-white dark:hover:bg-[#2C2C2C]"
      >
        {t.print}
      </button>
      <p className="text-center text-[13px] font-medium text-[#868593]">
        {t.hint}
      </p>
    </div>
  );
}
