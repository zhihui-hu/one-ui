"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GripVertical } from "lucide-react";
import MatrixOrb, { type MatrixOrbState } from "@/components/ui/matrix-orb";
import { usePreviewControl } from "@/components/preview/PreviewControls";
import { useI18n } from "@/components/i18n/I18nProvider";

const STATES: MatrixOrbState[] = ["idle", "listening", "thinking"];

export default function MatrixOrbPage() {
  const { m } = useI18n();
  const t = m.demos.matrixorb;
  const [state, setState] = usePreviewControl("state", "listening");
  const previewRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const slide = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 34 };

  return (
    <div
      ref={previewRef}
      className="relative flex h-full items-center justify-center"
    >
      <MatrixOrb state={state as MatrixOrbState} size={200} labels={t.states} />
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

        {STATES.map((option) => {
          const selected = state === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setState(option)}
              aria-pressed={selected}
              className="relative h-8 cursor-pointer rounded-xl px-3.5 text-xs font-medium capitalize outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
            >
              {selected && (
                <motion.span
                  layoutId="matrix-orb-state-pill"
                  transition={slide}
                  className="absolute inset-0 rounded-xl bg-background shadow-sm"
                />
              )}
              <span
                className={`relative transition-colors duration-200 ${
                  selected ? "text-foreground" : "text-foreground/50"
                }`}
              >
                {t.states[option]}
              </span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
