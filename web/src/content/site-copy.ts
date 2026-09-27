import catalog from "./site-copy.generated.json";
import type { Locale } from "./i18n";

export const COPY_STATUSES = ["aprovado", "revisar", "decidir"] as const;
export type CopyStatus = (typeof COPY_STATUSES)[number];
export type CopyKey = keyof typeof catalog.entries;

export interface CopyEntry {
  en: string;
  pt: string;
  page: string;
  section: string;
  status: CopyStatus;
  figma: string | null;
  note: string | null;
}

const entries = catalog.entries as Record<CopyKey, CopyEntry>;

export function getCopy(locale: Locale, key: CopyKey): string {
  return entries[key][locale];
}

export function getCopyEntry(key: CopyKey): Readonly<CopyEntry> {
  return entries[key];
}

export function isCopyKey(value: string): value is CopyKey {
  return Object.hasOwn(entries, value);
}
