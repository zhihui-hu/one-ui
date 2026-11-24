"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import { useActiveComponent } from "@/components/i18n/useComponents";

export default function ComponentNotFound() {
  const { m } = useI18n();
  const item = useActiveComponent();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">
        {item?.name ?? m.docs.component}
      </h1>
      <p className="text-foreground/55">{m.docs.unavailable}</p>
    </div>
  );
}
