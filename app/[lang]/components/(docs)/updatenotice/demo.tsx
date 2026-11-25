"use client";

import { useEffect, useState } from "react";
import { UpdateNotice } from "@/components/ui/update-notice";
import { useI18n } from "@/components/i18n/I18nProvider";

const RELOAD = 1400;

export default function UpdateNoticePage() {
  const { m } = useI18n();
  const t = m.demos.updatenotice;
  const [open, setOpen] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!updating) return;
    const done = setTimeout(() => {
      setUpdating(false);
      setOpen(false);
    }, RELOAD);
    return () => clearTimeout(done);
  }, [updating]);

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden px-6 font-runde">
      <button
        type="button"
        disabled={open}
        onClick={() => setOpen(true)}
        className="h-9 cursor-pointer rounded-full bg-[#F4F4F9] px-4 text-[13px] font-semibold text-black transition-[transform,background-color,opacity] hover:bg-[#EDEDF3] active:scale-95 disabled:cursor-default disabled:opacity-50 disabled:active:scale-100 motion-reduce:transition-none dark:bg-[#262626] dark:text-white dark:hover:bg-[#2C2C2C]"
      >
        {t.show}
      </button>
      <p className="text-center text-[13px] font-medium text-[#868593]">
        {t.hint}
      </p>
      {/* absolute keeps the notice inside the preview instead of the viewport */}
      <UpdateNotice
        open={open}
        labels={t.labels}
        onUpdate={() => setUpdating(true)}
        onLater={() => setOpen(false)}
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6"
      />
    </div>
  );
}
