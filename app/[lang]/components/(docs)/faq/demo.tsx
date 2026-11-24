"use client";

import { Faq, type FaqItem } from "@/components/ui/faq";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function FaqPage() {
  const { m } = useI18n();
  const items: FaqItem[] = Object.entries(m.demos.faq.items).map(
    ([id, item]) => ({ id, ...item }),
  );

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto px-6 py-16">
      <Faq items={items} defaultValue="what-is-one-ui" />
    </div>
  );
}
