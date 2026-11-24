"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { GripVertical, RotateCcw } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { format } from "@/lib/i18n/format";
import {
  WebSearch,
  WebSearchAnswer,
  WebSearchCitation,
  type WebSearchLabels,
  type WebSource,
  type WebSearchStatus,
} from "@/components/ui/web-search";

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const LINKS = [
  { id: "motion", url: "https://motion.dev/docs/react-transitions" },
  {
    id: "mdn",
    url: "https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion",
  },
  { id: "react", url: "https://react.dev/reference/react/useEffect" },
  { id: "webdev", url: "https://web.dev/articles/animations-and-performance" },
  { id: "github", url: "https://github.com/zhihui-hu/one-ui" },
  { id: "vercel", url: "https://vercel.com/blog" },
] as const;

const FAVICONS = LINKS.map(({ url }) => favicon(new URL(url).hostname));

// the answer cites these, in order, after each of its parts
const CITED = ["motion", "webdev", "mdn", "react"];

// a slow network shouldn't hold the demo back for long
const PRELOAD_TIMEOUT = 3000;

const preload = (urls: string[]) =>
  Promise.race([
    Promise.all(
      urls.map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = image.onerror = () => resolve();
            image.src = src;
          }),
      ),
    ),
    new Promise<void>((resolve) => setTimeout(resolve, PRELOAD_TIMEOUT)),
  ]);

const ARRIVALS = [600, 1000, 1300, 1800, 2200, 2500];
const FINISH = 2900;

export default function WebSearchPage() {
  const { m } = useI18n();
  const t = m.demos.websearch;
  const sources: WebSource[] = LINKS.map(({ id, url }, i) => ({
    id,
    url,
    favicon: FAVICONS[i],
    ...t.sources[id],
  }));
  const labels: WebSearchLabels = {
    searching: t.labels.searching,
    searchingQuery: (query) => format(t.labels.searchingQuery, { query }),
    searched: (count) =>
      format(count === 1 ? t.labels.searchedOne : t.labels.searchedOther, {
        count,
      }),
    showLess: t.labels.showLess,
    showMore: (count) => format(t.labels.showMore, { count }),
    moreSources: (count) =>
      count === 1 ? t.labels.moreSourcesOne : t.labels.moreSourcesOther,
  };
  const cite = (id: string) =>
    sources.find((source) => source.id === id) ?? sources[0];
  const previewRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<WebSearchStatus>("searching");
  const [ready, setReady] = useState(false);

  // the favicons load before the search starts, so each one lands with its icon instead of popping in late
  useEffect(() => {
    let active = true;
    preload(FAVICONS).then(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timers = [
      ...ARRIVALS.map((at, i) => window.setTimeout(() => setCount(i + 1), at)),
      window.setTimeout(() => setStatus("done"), FINISH),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [run, ready]);

  const replay = () => {
    setCount(0);
    setStatus("searching");
    setRun((n) => n + 1);
  };

  return (
    <div
      ref={previewRef}
      className="relative flex h-full flex-col items-center justify-center p-6 pb-20"
    >
      <div className="flex w-[560px] max-w-full flex-col gap-5">
        <WebSearch
          key={run}
          status={status}
          query={t.query}
          sources={sources.slice(0, count)}
          labels={labels}
          linked={false}
        />

        <WebSearchAnswer key={`answer-${run}`} play={status === "done"}>
          {t.answer.flatMap((part, i) =>
            CITED[i]
              ? [
                  `${part} `,
                  <WebSearchCitation
                    key={CITED[i]}
                    linked={false}
                    source={cite(CITED[i])}
                  />,
                ]
              : [part],
          )}
        </WebSearchAnswer>
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
