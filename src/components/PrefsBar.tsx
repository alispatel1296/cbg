"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { SEARCH_INDEX } from "@/lib/extras";
import { cn } from "@/lib/cn";
import { useBook } from "@/lib/book-store";
import { useAuth } from "@/lib/auth";
import { canAccess } from "@/lib/data";
import { buildNotices } from "@/lib/notices";
import { NoticeList } from "@/components/NoticeList";

export function PrefsBar({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme, lang, setLang, t } = usePrefs();
  const { user } = useAuth();
  const { wa, calls, ticks } = useBook();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const router = useRouter();

  const notices = useMemo(
    () =>
      buildNotices({
        role: user?.role ?? "employee",
        ticks,
        calls,
        wa,
      }),
    [user?.role, ticks, calls, wa],
  );
  const hot = notices.find((n) => n.tone === "red") ?? notices[0];
  const unread = notices.filter((n) => n.tone === "red" || n.tone === "amber").length;

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return SEARCH_INDEX.filter(
      (h) =>
        h.title.toLowerCase().includes(s) || h.tag.toLowerCase().includes(s),
    ).slice(0, 6);
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setNotesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        className={cn(
          "ml-auto flex items-center justify-end",
          compact ? "flex-nowrap gap-1" : "flex-wrap gap-1.5",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-line bg-raised text-sm text-muted hover:text-ink",
            compact ? "p-2.5" : "px-3 py-2",
          )}
        >
          <Search className="size-4" />
          {compact ? null : (
            <span className="hidden sm:inline">{t("search")}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setLang(lang === "en" ? "gu" : "en")}
          className={cn(
            "rounded-lg border border-line bg-raised font-medium",
            compact ? "px-2 py-2.5 text-xs" : "px-3 py-2 text-sm",
          )}
        >
          {compact
            ? lang === "en"
              ? "ગુ"
              : "EN"
            : lang === "en"
              ? t("langOther")
              : t("english")}
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-line bg-raised p-2.5"
          aria-label={theme === "dark" ? t("light") : t("dark")}
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotesOpen((v) => !v)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border",
              compact ? "p-2.5" : "max-w-[14rem] px-2.5 py-2 sm:max-w-[18rem]",
              unread
                ? "border-amber/50 bg-amber-soft text-ink"
                : "border-line bg-raised text-muted",
            )}
            aria-label={t("notes")}
            aria-expanded={notesOpen}
          >
            <span className="relative shrink-0">
              <Bell className="size-4" />
              {unread > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                  {unread > 9 ? "9" : unread}
                </span>
              ) : null}
            </span>
            {compact ? null : hot ? (
              <span className="hidden min-w-0 truncate text-left text-xs font-semibold sm:block">
                {hot.title}
              </span>
            ) : (
              <span className="hidden text-xs sm:block">{t("notesQuiet")}</span>
            )}
          </button>

          {notesOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                aria-label={t("closeMenu")}
                onClick={() => setNotesOpen(false)}
              />
              <div className="fixed right-3 top-14 z-50 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-line bg-raised shadow-lg lg:absolute lg:right-0 lg:top-[calc(100%+0.4rem)] lg:w-[min(20rem,calc(100vw-1.5rem))]">
                <div className="flex items-center justify-between border-b border-line px-3 py-2">
                  <p className="text-sm font-semibold">{t("notes")}</p>
                  <p className="text-[11px] text-muted">
                    {unread ? `${unread}` : t("notesQuiet")}
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <NoticeList items={notices} onPick={() => setNotesOpen(false)} />
                </div>
                {user && canAccess(user.role, "/alerts") ? (
                  <button
                    type="button"
                    className="w-full border-t border-line px-3 py-2 text-xs font-semibold text-teal"
                    onClick={() => {
                      router.push("/alerts");
                      setNotesOpen(false);
                    }}
                  >
                    {t("notesAll")}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-ink/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto mt-16 max-w-lg rounded-xl border border-line bg-raised p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              className="w-full rounded-lg border border-line bg-surface px-3 py-3 text-base"
              placeholder={t("search")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <ul className="mt-2">
              {(q ? hits : SEARCH_INDEX.slice(0, 6)).map((h) => (
                <li key={h.href + h.title}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-surface",
                    )}
                    onClick={() => {
                      router.push(h.href);
                      setOpen(false);
                      setQ("");
                    }}
                  >
                    <span className="font-medium">{h.title}</span>
                    <span className="text-xs text-muted">{h.tag}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
