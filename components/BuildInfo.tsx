"use client";

import {
  AppInfo,
  buildVersion,
  formatBuildTime,
} from "@/components/ui/app-info";
import { name } from "../package.json";

const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME;
const TIME_ZONE = "Asia/Shanghai";

export default function BuildInfo() {
  return (
    <AppInfo
      info={{
        [name]: buildVersion(BUILD_TIME, TIME_ZONE),
        "build time": formatBuildTime(BUILD_TIME, TIME_ZONE),
      }}
    />
  );
}
