"use client";

import { useActiveComponent } from "@/components/i18n/useComponents";
import { cn } from "@/lib/utils";
import MobileSidebar from "./MobileSidebar";
import DescriptionContent from "../Description/DescriptionContent";
import SourceSection from "../Description/SourceSection";

const CARD = "rounded-[calc(32px*var(--corner-scale))] bg-card";

export default function MobileShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const item = useActiveComponent();

  return (
    <div className="no-scrollbar h-full overflow-y-auto">
      <div className="flex flex-col gap-2 pb-2">
        <div className={cn(CARD, "relative h-[88svh] shrink-0 p-4")}>
          <MobileSidebar />
          {children}
        </div>

        <div className={cn(CARD, "p-4")}></div>

        <div className={cn(CARD, "p-6")}>
          <DescriptionContent item={item} showSourceHint={false} />
        </div>

        {item?.registry && (
          <div className={cn(CARD, "p-6")}>
            <SourceSection key={item.registry} registry={item.registry} />
          </div>
        )}
      </div>
    </div>
  );
}
