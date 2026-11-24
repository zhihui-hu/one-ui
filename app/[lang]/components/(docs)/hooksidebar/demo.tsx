"use client";

import { useEffect, useRef, useState } from "react";
import { motion, stagger, type Variants } from "motion/react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { HookSidebar } from "@/components/ui/hook-sidebar";

const STEP = 0.04;
const getDelay = stagger(STEP, { startDelay: 0.05 });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (order: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: getDelay(order, TOTAL),
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

// paragraph order per section; every block after the first takes the next heading
const LAYOUT = [
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0],
  [0, 1, 2],
  [2, 0],
];

const TOTAL = 2 + LAYOUT.reduce((n, blocks) => n + 1 + blocks.length, 0);

export default function HookSidebarPage() {
  const { m } = useI18n();
  const t = m.demos.hooksidebar;
  const sections = t.sections.map((section, i) => ({
    title: section.title,
    blocks: LAYOUT[i].map((paragraph, b) => ({
      heading: b ? section.headings[b - 1] : undefined,
      text: t.paragraphs[paragraph],
    })),
  }));
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const lockUntil = useRef(0);

  const goTo = (index: number) => {
    const container = scrollRef.current;
    const el = sectionRefs.current[index];
    if (!container || !el) return;
    setActive(index);
    lockUntil.current = Date.now() + 800;
    const top =
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;
    container.scrollTo({ top: top - 8, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      if (Date.now() < lockUntil.current) return;
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 4
      ) {
        setActive(sectionRefs.current.length - 1);
        return;
      }
      const containerTop = container.getBoundingClientRect().top;
      let current = 0;
      sectionRefs.current.forEach((el, index) => {
        if (el && el.getBoundingClientRect().top - containerTop <= 80)
          current = index;
      });
      setActive(current);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  let order = 0;

  return (
    <div className="flex h-full gap-10 overflow-hidden p-6">
      <aside className="w-52 shrink-0 pt-2">
        <HookSidebar
          label={t.label}
          items={sections.map((s) => s.title)}
          value={active}
          onChange={goTo}
          color="#FC4C01"
        />
      </aside>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <motion.article
          className="max-w-2xl"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeUp}
            custom={order++}
            className="font-cal text-5xl font-medium tracking-wider text-foreground"
          >
            One UI
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={order++}
            className="mt-2 text-lg text-foreground/40"
          >
            {t.subtitle}
          </motion.p>

          {sections.map((section, index) => (
            <section
              key={section.title}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className="mt-10"
            >
              <motion.h2
                variants={fadeUp}
                custom={order++}
                className="border-b pb-2 font-cal text-3xl font-medium tracking-wide text-foreground/90"
              >
                {section.title}
              </motion.h2>

              {section.blocks.map((block, blockIndex) => (
                <motion.div
                  key={blockIndex}
                  variants={fadeUp}
                  custom={order++}
                  className="mt-6"
                >
                  {block.heading && (
                    <h3 className="font-cal text-lg font-normal tracking-wide text-foreground/80">
                      {block.heading}
                    </h3>
                  )}
                  <p className="mt-3 font-sans text-sm leading-6 text-foreground/40">
                    {block.text}
                  </p>
                </motion.div>
              ))}
            </section>
          ))}
        </motion.article>
      </div>
    </div>
  );
}
