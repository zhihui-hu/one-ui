"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import { GooeyNav } from "@/components/ui/gooey-nav";
import { useIsMobile } from "@/lib/use-media-query";
import { BookIcon, BriefcaseIcon, HouseIcon, InfoIcon } from "./icons";

const ITEMS = [
  { id: "home", icon: <HouseIcon /> },
  { id: "changelog", icon: <BookIcon /> },
  { id: "career", icon: <BriefcaseIcon /> },
  { id: "about", icon: <InfoIcon /> },
] as const;

export default function GooeyNavPage() {
  const isMobile = useIsMobile();
  const { m } = useI18n();
  const items = ITEMS.map(({ id, icon }) => ({
    label: m.demos.gooeynav.items[id],
    icon,
  }));

  return (
    <div className="relative flex h-full items-center justify-center px-2">
      <GooeyNav
        items={isMobile ? items.slice(0, 3) : items}
        size={isMobile ? "xs" : "md"}
      />
    </div>
  );
}
