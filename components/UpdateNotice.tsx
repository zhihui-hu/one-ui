"use client";

import { UpdateNotice as Notice } from "@/components/ui/update-notice";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function UpdateNotice() {
  const { m } = useI18n();
  return <Notice labels={m.common.update} />;
}
