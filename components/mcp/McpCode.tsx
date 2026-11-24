"use client";

import CopyButton from "@/components/CopyButton";
import Tooltip from "@/components/Tooltip";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function McpCode({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const { m } = useI18n();
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg bg-muted p-2 pl-3",
        className,
      )}
    >
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/80 [scrollbar-width:none]">
        {value}
      </code>
      <Tooltip label={m.common.copy} align="end">
        <CopyButton value={value} title="" className="hover:text-foreground" />
      </Tooltip>
    </div>
  );
}
