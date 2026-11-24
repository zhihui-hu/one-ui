"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CodeXml, Maximize, Minimize, X } from "lucide-react";
import { useActiveComponent } from "@/components/i18n/useComponents";
import { cn } from "@/lib/utils";
import CodeDrawer from "./CodeDrawer";
import DescriptionContent from "./DescriptionContent";
import InstallBar from "./InstallBar";
import ThemeToggle from "../ThemeToggle";
import Tooltip from "../Tooltip";
import { useI18n } from "@/components/i18n/I18nProvider";

const PANEL_SHIFT = 600;

type DescriptionPanelProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DescriptionPanel({ open, setOpen }: DescriptionPanelProps) {
  const { m } = useI18n();
  const item = useActiveComponent();

  const [codeOpen, setCodeOpen] = useState(false);
  useEffect(() => {
    if (!open) setCodeOpen(false);
  }, [open]);

  const toggleCode = () => {
    if (codeOpen) {
      setCodeOpen(false);
    } else {
      setOpen(true);
      setCodeOpen(true);
    }
  };

  return (
    <div className="pointer-events-none absolute right-0 top-0 z-40 h-full">
      <div
        data-chrome
        className="pointer-events-auto absolute right-4 top-4 z-50 flex items-stretch"
      >
        {item?.registry && <InstallBar key={item.href} item={item} />}

        <div
          className={cn(
            "flex items-center gap-2 border border-black/[0.06] bg-muted p-2 shadow-sm dark:border-transparent dark:border-apple",
            item?.registry ? "rounded-r-2xl border-l-0" : "rounded-2xl",
          )}
        >
          <Tooltip
            label={open ? m.docs.closeDescription : m.docs.openDescription}
          >
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={
                open ? m.docs.closeDescription : m.docs.openDescription
              }
              className="cursor-pointer rounded-full bg-popover p-1"
            >
              {open ? (
                <Maximize className="h-5 w-5" />
              ) : (
                <Minimize className="h-5 w-5" />
              )}
            </button>
          </Tooltip>

          {item?.registry && (
            <Tooltip label={codeOpen ? m.docs.hideCode : m.docs.getCode}>
              <button
                type="button"
                onClick={toggleCode}
                aria-label={codeOpen ? m.docs.hideCode : m.docs.getCode}
                className="cursor-pointer rounded-full bg-popover p-1"
              >
                {codeOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <CodeXml className="h-5 w-5" />
                )}
              </button>
            </Tooltip>
          )}

          <Tooltip label={m.common.toggleTheme} align="end">
            <ThemeToggle className="rounded-full p-1 bg-popover" />
          </Tooltip>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ x: open ? 0 : PANEL_SHIFT }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pointer-events-auto relative flex h-full w-140 flex-col overflow-hidden rounded-2xl bg-background"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-background to-transparent" />

        <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto">
          <DescriptionContent item={item} className="p-8 pt-60" />
        </div>

        <CodeDrawer
          open={codeOpen}
          onClose={() => setCodeOpen(false)}
          item={item}
        />
      </motion.div>
    </div>
  );
}
