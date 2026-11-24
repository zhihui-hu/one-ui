"use client";

import PasswordInput from "@/components/ui/password-input";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function PasswordInputPage() {
  const { m } = useI18n();
  const t = m.demos.passwordinput;

  return (
    <div className="relative flex h-full items-center justify-center px-6">
      <PasswordInput
        placeholder={t.placeholder}
        labels={t.labels}
        autoComplete="new-password"
      />
    </div>
  );
}
