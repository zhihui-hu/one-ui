"use client";

import DurationPicker from "@/components/ui/duration-picker";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function DurationPickerPage() {
  const { m } = useI18n();
  const t = m.demos.durationpicker;

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl">
      <DurationPicker
        hoursLabel={t.hours}
        minutesLabel={t.minutes}
        labels={t.labels}
      />
    </div>
  );
}
