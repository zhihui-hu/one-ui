"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SidebarNav from "./SidebarNav";
import SidebarHeader from "./SidebarHeader";
import SidebarScroll from "./SidebarScroll";
import { ClosedIcon, OpenIcon } from "./icons";
import { CommandMenuTrigger } from "../CommandMenuTrigger";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const { m } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? m.common.sidebar.close : m.common.sidebar.open}
        className="absolute left-4 top-4 z-60 cursor-pointer rounded-lg bg-[#F4F4F9] p-2 dark:bg-popover"
      >
        {open ? <OpenIcon /> : <ClosedIcon />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 touch-none bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col rounded-r-3xl bg-card p-4 pl-6"
            >
              <div className="mt-18 flex items-center justify-between gap-3">
                <SidebarHeader onNavigate={() => setOpen(false)} />
                <CommandMenuTrigger onClick={() => setOpen(false)} />
              </div>
              <SidebarScroll className="mt-4 min-h-0 flex-1">
                <SidebarNav onNavigate={() => setOpen(false)} />
              </SidebarScroll>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
