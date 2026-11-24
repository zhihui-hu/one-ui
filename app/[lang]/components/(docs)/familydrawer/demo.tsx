"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import FamilyDrawer from "@/components/ui/family-drawer";

export default function FamilyDrawerPage() {
  const { m } = useI18n();

  return (
    <div className="relative h-full w-full">
      <FamilyDrawer labels={m.demos.familydrawer.labels} />
    </div>
  );
}
