"use client";

import { EmojiReaction } from "@/components/ui/emoji-reaction";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function EmojiReactionPage() {
  const { m } = useI18n();
  const t = m.demos.emojireaction;
  const names: Record<string, string> = t.emojis;
  const labels = {
    ...t.labels,
    emoji: (name: string) => names[name] ?? name.replaceAll("-", " "),
    reacted: (emoji: string) => t.labels.reacted.replace("{emoji}", emoji),
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6">
      <EmojiReaction size="md" align="center" labels={labels} />
      <p className="text-sm text-foreground/50">{t.hint}</p>
    </div>
  );
}
