"use client";

import { Toaster, toast } from "@/components/ui/toast";
import { useI18n } from "@/components/i18n/I18nProvider";

const BUTTON =
  "h-9 cursor-pointer rounded-full bg-[#F4F4F9] px-4 text-[13px] font-semibold text-black transition-[transform,background-color] hover:bg-[#EDEDF3] active:scale-95 motion-reduce:transition-none dark:bg-[#262626] dark:text-white dark:hover:bg-[#2C2C2C]";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ToastPage() {
  const { m } = useI18n();
  const t = m.demos.toast;

  const demos = [
    {
      label: t.success.button,
      run: () =>
        toast.success(t.success.title, {
          description: t.success.description,
        }),
    },
    {
      label: t.error.button,
      run: () =>
        toast.error(t.error.title, {
          description: t.error.description,
          action: {
            label: t.error.action,
            onClick: () => toast.success(t.error.done),
          },
        }),
    },
    {
      label: t.warning.button,
      run: () =>
        toast.warning(t.warning.title, {
          description: t.warning.description,
        }),
    },
    {
      label: t.info.button,
      run: () =>
        toast.info(t.info.title, {
          description: t.info.description,
        }),
    },
    {
      label: t.promise.button,
      run: () =>
        toast.promise(wait(2000), {
          loading: t.promise.loading,
          success: t.promise.success,
          error: t.promise.error,
        }),
    },
    {
      label: t.undo.button,
      run: () =>
        toast(t.undo.title, {
          action: {
            label: t.undo.action,
            onClick: () => toast(t.undo.done),
          },
        }),
    },
  ];

  return (
    <div className="relative flex h-full items-center justify-center px-6 font-runde">
      <div className="flex max-w-sm flex-wrap justify-center gap-2">
        {demos.map((demo) => (
          <button
            key={demo.label}
            type="button"
            onClick={demo.run}
            className={BUTTON}
          >
            {demo.label}
          </button>
        ))}
      </div>
      <Toaster
        position="top-center"
        labels={t.labels}
        containerAriaLabel={t.containerAriaLabel}
      />
    </div>
  );
}
