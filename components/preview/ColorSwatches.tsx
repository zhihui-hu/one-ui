"use client";

import { motion } from "motion/react";
import { GripVertical } from "lucide-react";
import { cleanDefault, swatchProp } from "@/lib/components";
import { format } from "@/lib/i18n/format";
import { useI18n } from "@/components/i18n/I18nProvider";
import { useActiveComponent } from "@/components/i18n/useComponents";
import { usePreviewControl } from "./PreviewControls";

const PANEL =
  "flex items-center gap-2.5 border border-black/[0.06] dark:border-transparent dark:border-apple";

type ColorSwatchesProps = {
  className?: string;
  showLabel?: boolean;
  draggable?: boolean;
  constraintsRef?: React.RefObject<HTMLElement | null>;
};

export default function ColorSwatches({
  className = "",
  showLabel = false,
  draggable = false,
  constraintsRef,
}: ColorSwatchesProps) {
  const prop = swatchProp(useActiveComponent());
  const { m } = useI18n();

  const options = prop?.options ?? [];
  const [value, setValue] = usePreviewControl(
    prop?.name ?? "",
    cleanDefault(prop) ?? options[0] ?? "",
  );

  if (!prop || !prop.optionColors || options.length === 0) return null;

  const handle = draggable && (
    <span
      className="-ml-1 cursor-grab text-foreground/30 transition-colors hover:text-foreground/60 active:cursor-grabbing"
      aria-hidden
    >
      <GripVertical className="h-5 w-5" />
    </span>
  );

  const swatches = (
    <>
      {handle}
      {showLabel && (
        <span className="mr-0.5 text-xs font-medium text-foreground/55">
          {prop.name}
        </span>
      )}
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setValue(option)}
            aria-label={format(m.docs.setOption, {
              name: prop.name,
              value: option,
            })}
            aria-pressed={selected}
            title={option}
            className={`h-7 w-7 cursor-pointer rounded-xl shadow-xl transition-transform duration-150  ${
              selected
                ? "ring-2 ring-neutral-700 ring-offset-1 ring-offset-background"
                : ""
            }`}
            style={{ backgroundColor: prop.optionColors![option] }}
          />
        );
      })}
    </>
  );

  if (draggable) {
    return (
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0}
        whileDrag={{ scale: 1.03 }}
        className={`${PANEL} ${className}`}
      >
        {swatches}
      </motion.div>
    );
  }

  return <div className={`${PANEL} ${className}`}>{swatches}</div>;
}
