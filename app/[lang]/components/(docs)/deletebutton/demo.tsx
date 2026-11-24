"use client";

import { DeleteButton } from "@/components/ui/delete-button";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function DeleteButtonPage() {
  const { m } = useI18n();

  return (
    <div className="flex h-full items-center justify-center">
      <DeleteButton labels={m.demos.deletebutton.labels} />
    </div>
  );
}
