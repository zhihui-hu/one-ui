"use client";

import { Fragment, useMemo } from "react";
import ProximitySidebar from "@/components/ui/proximity-sidebar";
import type { ProximitySection } from "@/components/ui/proximity-sidebar";
import { useI18n } from "@/components/i18n/I18nProvider";

type DocText = { label: string; description: string };

type DocGroup = DocText & {
  id: string;
  eyebrow: string;
  title: string;
  items: (DocText & { id: string })[];
};

const withCode = (text: string) =>
  text
    .split(/\{(\w+)\}/)
    .map((part, i) =>
      i % 2 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>,
    );

export default function Page() {
  const { m } = useI18n();
  const t = m.demos.proximitysidebar;
  const docs = useMemo<DocGroup[]>(
    () =>
      Object.entries(t.groups).map(([id, group]) => ({
        ...group,
        id,
        items: Object.entries(group.items as Record<string, DocText>).map(
          ([itemId, item]) => ({ ...item, id: itemId }),
        ),
      })),
    [t],
  );
  // the sidebar re-measures whenever sections changes identity
  const sections = useMemo<ProximitySection[]>(
    () =>
      docs.flatMap((group) => [
        { id: group.id, label: group.label, kind: "title" as const },
        ...group.items.map((item) => ({
          id: item.id,
          label: item.label,
          kind: "body" as const,
        })),
      ]),
    [docs],
  );
  const labels = {
    nav: t.labels.nav,
    goTo: (label: string) => t.labels.goTo.replace("{label}", label),
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-transparent text-foreground">
      <aside className="h-full w-24 shrink-0">
        <ProximitySidebar side="left" sections={sections} labels={labels} />
      </aside>

      <main className="min-h-0 flex-1 overflow-auto px-8 py-20 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:px-14 ml-20">
        <article className="max-w-2xl">
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

              {group.id === "reference" ? (
                <div className="mt-6 grid gap-6">
                  <div id="reference-props" className="scroll-mt-12">
                    <p className="font-sans text-sm leading-6 text-foreground/40">
                      {withCode(t.reference.props)}
                    </p>
                  </div>
                  <div id="reference-output" className="scroll-mt-12">
                    <p className="font-sans text-sm leading-6 text-foreground/40">
                      {t.reference.output}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {group.items.map((item) => (
                    <section
                      key={item.id}
                      id={item.id}
                      className="scroll-mt-12"
                    >
                      <p className="font-sans text-sm leading-6 text-foreground/40">
                        {item.description}
                      </p>
                    </section>
                  ))}
                </div>
              )}
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}
