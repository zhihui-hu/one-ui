"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GripVertical, RotateCcw } from "lucide-react";
import { AiStatus, type AiStatusState } from "@/components/ui/ai-status";
import { useI18n } from "@/components/i18n/I18nProvider";

// on small screens the command breaks at a space or before a slash, never inside a word
const COMMAND = [
  "npx shadcn@latest",
  "add",
  "zhihui-hu",
  "/one-ui",
  "/ai-status",
];

const STEPS: {
  at: number;
  state: AiStatusState;
  detail?: string;
  favicon?: string;
}[] = [
  { at: 0, state: "thinking" },
  {
    at: 2200,
    state: "researching",
    detail: "ui.huzhihui.com",
    favicon: "/logos/oneui-stack.svg",
  },
  { at: 4600, state: "analyzing" },
  { at: 6800, state: "writing" },
  { at: 9000, state: "done" },
];

export default function AiStatusPage() {
  const { m } = useI18n();
  const t = m.demos.aistatus;
  const previewRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.slice(1).map(({ at }, i) =>
      window.setTimeout(() => setStep(i + 1), at),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [run]);

  const replay = () => {
    setStep(0);
    setRun((n) => n + 1);
  };

  const { state, favicon } = STEPS[step];
  const detail = state === "analyzing" ? t.detail : STEPS[step].detail;
  const states = {
    thinking: { label: t.states.thinking },
    researching: { label: t.states.researching },
    analyzing: { label: t.states.analyzing },
    writing: { label: t.states.writing },
    done: {
      label: (elapsed?: string) =>
        elapsed ? t.states.workedFor.replace("{time}", elapsed) : t.states.done,
    },
  };

  return (
    <div
      ref={previewRef}
      className="relative flex h-full flex-col items-center justify-center p-6 pb-20"
    >
      <div className="flex w-[480px] max-w-full flex-col gap-6 font-runde">
        <p className="ml-auto w-fit max-w-[80%] rounded-[calc(20px*var(--corner-scale))] bg-[#F4F4F9] px-4 py-2.5 text-[14px] font-medium text-black dark:bg-[#262626] dark:text-white">
          {t.question}
        </p>

        <div className="flex min-h-24 flex-col gap-2">
          <AiStatus
            key={run}
            state={state}
            states={states}
            detail={detail}
            favicon={favicon}
          />
          <AnimatePresence>
            {state === "done" && (
              <motion.p
                key={run}
                initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", duration: 0.6, bounce: 0 }}
                className="text-[14px] leading-relaxed text-black dark:text-white"
              >
                {t.answerBefore}{" "}
                <span className="sm:whitespace-nowrap">
                  <code className="box-decoration-clone rounded-md bg-[#F4F4F9] px-1.5 py-0.5 font-mono text-[13px] dark:bg-[#262626]">
                    {COMMAND.map((part, i) => (
                      <Fragment key={part}>
                        {i > 0 && (part.startsWith("/") ? <wbr /> : " ")}
                        <span className="whitespace-nowrap">{part}</span>
                      </Fragment>
                    ))}
                  </code>
                  {t.period}
                </span>
                {t.answerAfter}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.div
        drag
        dragConstraints={previewRef}
        dragMomentum={false}
        dragElastic={0}
        whileDrag={{ scale: 1.03 }}
        className="absolute inset-x-0 bottom-4 mx-auto flex w-fit items-center gap-1 rounded-[calc(var(--radius-xl)+4px)] border border-black/[0.06] bg-muted p-1 shadow-xl backdrop-blur dark:border-transparent dark:border-apple"
      >
        <span
          className="cursor-grab pr-0.5 pl-1 text-foreground/30 transition-colors hover:text-foreground/60 active:cursor-grabbing"
          aria-hidden
        >
          <GripVertical className="h-5 w-5" />
        </span>
        <button
          type="button"
          onClick={replay}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-xl bg-background px-3.5 text-xs font-medium text-foreground shadow-sm outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t.replay}
        </button>
      </motion.div>
    </div>
  );
}
