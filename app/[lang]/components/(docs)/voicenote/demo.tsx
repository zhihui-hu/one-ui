"use client";

import { useRef } from "react";
import { VoiceNote } from "@/components/ui/voice-note";
import ColorSwatches from "@/components/preview/ColorSwatches";
import { usePreviewControl } from "@/components/preview/PreviewControls";
import { useI18n } from "@/components/i18n/I18nProvider";
import { format } from "@/lib/i18n/format";

export default function VoiceNotePage() {
  const { m } = useI18n();
  const t = m.demos.voicenote.labels;
  const [accent] = usePreviewControl("accent", "#FC4C01");
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={previewRef}
      className="relative flex h-full items-center justify-center p-6"
    >
      <VoiceNote
        accent={accent}
        className="w-[340px]"
        labels={{
          play: t.play,
          pause: t.pause,
          seek: t.seek,
          position: (elapsed, total) => format(t.position, { elapsed, total }),
          speed: (speed) => format(t.speed, { speed }),
        }}
      />

      <ColorSwatches
        draggable
        constraintsRef={previewRef}
        className="absolute inset-x-0 bottom-4 mx-auto w-fit rounded-2xl bg-muted px-4 py-2.5 shadow-xl backdrop-blur"
      />
    </div>
  );
}
