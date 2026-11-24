"use client";

import { useMemo, useRef } from "react";

import ScrollProgress from "@/components/ui/scroll-progress";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function Page() {
  const { m } = useI18n();
  const t = m.demos.scrollprogressindicator;
  const docs = t.groups;
  const progressSections = useMemo(
    () => docs.map((group) => ({ id: group.id, label: group.title })),
    [docs],
  );
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-transparent text-foreground">
      <ScrollProgress
        containerRef={scrollRef}
        sections={progressSections}
        labels={t.labels}
      />

      <main
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-auto px-8 py-20 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:px-14"
      >
        <article className="mx-auto max-w-2xl">
          {docs.map((group, groupIndex) => (
            <section
              key={group.id}
              id={group.id}
              className="mt-10 scroll-mt-12 first:mt-0"
            >
              <p className="mb-2 text-sm text-foreground/40">{group.eyebrow}</p>
              {groupIndex === 0 ? (
                <h1 className="font-cal text-5xl font-medium tracking-wider text-foreground">
                  {group.title}
                </h1>
              ) : (
                <h2 className="border-b pb-2 font-cal text-3xl font-medium tracking-wide text-foreground/90">
                  {group.title}
                </h2>
              )}
              <p className="mt-2 text-lg text-foreground/40">
                {group.description}
              </p>

              <div className="mt-6 space-y-6">
                {group.items.map((item) => (
                  <section key={item.id} id={item.id} className="scroll-mt-12">
                    <p className="mb-1 text-sm text-foreground/40">
                      {item.eyebrow}
                    </p>
                    <h3 className="font-cal text-xl font-medium text-foreground/90">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-sans text-sm leading-6 text-foreground/40">
                      {item.description}
                    </p>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}
