"use client";

import { useState } from "react";
import OtpInput, { type OtpStatus } from "@/components/ui/otp-input";
import { useI18n } from "@/components/i18n/I18nProvider";
import { format } from "@/lib/i18n/format";

const CORRECT_CODE = "123456";

export default function OtpInputPage() {
  const { m } = useI18n();
  const t = m.demos.otpinput;
  const [status, setStatus] = useState<OtpStatus>("idle");

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6">
      <OtpInput
        length={6}
        status={status}
        size="md"
        labels={{
          digit: (position, length) =>
            format(t.labels.digit, { position, length }),
          character: (position, length) =>
            format(t.labels.character, { position, length }),
        }}
        onChange={() => setStatus("idle")}
        onComplete={(code) =>
          setStatus(code === CORRECT_CODE ? "success" : "error")
        }
      />
      <p className="text-sm text-foreground/50">
        {format(t.hint, { code: CORRECT_CODE })}
      </p>
    </div>
  );
}
