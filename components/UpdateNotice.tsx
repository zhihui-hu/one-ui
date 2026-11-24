"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import {
  isUpdateSnoozed,
  reloadForUpdate,
  snoozeUpdateForToday,
  startAppUpdateCheck,
} from "@/lib/app-update";

export default function UpdateNotice() {
  const { m } = useI18n();
  const t = m.common.update;
  const [available, setAvailable] = useState(false);
  const [updating, setUpdating] = useState(false);

  // checks keep running while snoozed, so the prompt returns on the first check after midnight
  useEffect(
    () =>
      startAppUpdateCheck(() => {
        if (!isUpdateSnoozed()) setAvailable(true);
      }),
    [],
  );

  if (!available) return null;

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[100] w-[calc(100%-2rem)] max-w-sm sm:bottom-6 sm:right-6">
      <div
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        className="rounded-2xl bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-foreground/5"
      >
        <p className="flex items-center gap-2 font-semibold">
          <RefreshCw aria-hidden="true" className="size-4 shrink-0" />
          {t.title}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={updating}
            aria-busy={updating || undefined}
            onClick={() => {
              setUpdating(true);
              reloadForUpdate();
            }}
            className="h-8 cursor-pointer rounded-full bg-foreground px-3.5 text-xs font-medium text-background transition-opacity duration-150 hover:opacity-85 disabled:opacity-60"
          >
            {updating ? t.updating : t.action}
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={() => {
              snoozeUpdateForToday();
              setAvailable(false);
            }}
            className="h-8 cursor-pointer text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            {t.later}
          </button>
        </div>
      </div>
    </div>
  );
}
