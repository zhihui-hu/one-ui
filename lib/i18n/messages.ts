import en from "@/locales/en";
import zh from "@/locales/zh";
import type { Locale } from "./config";
import type { ComponentTranslation } from "./types";

export type Messages = Omit<typeof en, "components"> & {
  components: Record<string, ComponentTranslation>;
};

// typed against en so a missing or renamed key in another locale fails the build
const MESSAGES: Record<Locale, Messages> = { en, zh };

export function getMessages(lang: Locale): Messages {
  return MESSAGES[lang];
}
