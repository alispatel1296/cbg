"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { usePrefs } from "@/lib/prefs";
import type { Notice } from "@/lib/notices";

export function NoticeList({
  items,
  onPick,
}: {
  items: Notice[];
  onPick?: () => void;
}) {
  const { t, tr } = usePrefs();
  if (!items.length) {
    return (
      <p className="px-3 py-6 text-center text-sm text-muted">{t("notesQuiet")}</p>
    );
  }
  return (
    <ul className="divide-y divide-line">
      {items.map((n) => (
        <li key={n.id}>
          <Link
            href={n.href}
            onClick={onPick}
            className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-surface"
          >
            <span
              className={cn(
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                n.tone === "red" && "bg-danger",
                n.tone === "amber" && "bg-amber",
                n.tone === "teal" && "bg-teal",
              )}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">
                {tr(n.title)}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted">
                {tr(n.detail)}
              </span>
            </span>
            <span className="shrink-0 pt-0.5 text-[11px] text-muted">
              {n.when === "today" || n.when === "now" ? tr(n.when) : n.when}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
