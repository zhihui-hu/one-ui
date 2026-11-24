"use client";

import { useState } from "react";
import { StepPlayer } from "@/components/ui/step-player";
import { useI18n } from "@/components/i18n/I18nProvider";
import { format } from "@/lib/i18n/format";

export default function StepPlayerPage() {
  const { m } = useI18n();
  const t = m.demos.stepplayer;
  const [step, setStep] = useState(0);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
      <StepPlayer
        steps={5}
        value={step}
        onValueChange={setStep}
        duration={3000}
        size={60}
        seekable
        labels={{
          play: t.labels.play,
          pause: t.labels.pause,
          replay: t.labels.replay,
          progress: (current, count) =>
            format(t.labels.progress, { step: current, count }),
          step: (current) => format(t.labels.step, { step: current }),
        }}
      />

      <p className="text-sm text-[#868593] dark:text-[#9B9AA7]">
        {format(t.status, { step: step + 1, count: 5 })}
      </p>
    </div>
  );
}
