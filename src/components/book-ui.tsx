"use client";

import type { FormEvent, ReactNode } from "react";
import { useBook } from "@/lib/book-store";
import type { BookAction, Stamp } from "@/lib/book";
import { Button, Panel } from "@/components/ui";
import { roleLabel } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { usePrefs } from "@/lib/prefs";

export function EnteredBy({ stamp }: { stamp?: Stamp }) {
  const { locale, tr } = usePrefs();
  if (!stamp) return null;
  return (
    <p className="mt-1 text-xs text-muted">
      {tr("Put in by")}{" "}
      <span className="font-semibold text-ink">{stamp.byName}</span>
      {" · "}
      {tr(stamp.desk)}
      {" · "}
      {new Date(stamp.at).toLocaleString(locale)}
      {stamp.how ? ` · ${tr(stamp.how)}` : ""}
    </p>
  );
}

export function DeskGate({
  action,
  children,
}: {
  action: BookAction;
  children: ReactNode;
}) {
  const { can, whoCan } = useBook();
  const { user } = useAuth();
  const { tr } = usePrefs();
  if (can(action)) return <>{children}</>;
  return (
    <p className="rounded-lg border border-amber/40 bg-amber-soft px-3 py-2 text-sm">
      {tr("This seat cannot write this. Need")} {whoCan(action)}.       {tr("You are")}{" "}
      {tr(roleLabel(user?.role ?? ""))}.
    </p>
  );
}

export function LineNotice({ watch }: { watch: readonly string[] }) {
  const { calls } = useBook();
  const { tr } = usePrefs();
  const hits = watch
    .map((id) => calls[id])
    .filter((text): text is string => Boolean(text));
  if (!hits.length) return null;
  return (
    <ul className="mb-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-raised">
      {hits.map((text) => (
        <li key={text} className="flex items-start gap-3 px-3 py-3">
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gold" />
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-wide text-gold">
              {tr("From another person")}
            </span>
            <span className="mt-0.5 block text-sm font-medium">{tr(text)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function FormCard({
  title,
  onSubmit,
  children,
  submit = "Save",
}: {
  title: string;
  onSubmit: () => void;
  children: ReactNode;
  submit?: string;
}) {
  const { tr } = usePrefs();
  return (
    <Panel className="mb-4 border-teal/30">
      <h2 className="mb-3 font-display text-lg font-bold">{tr(title)}</h2>
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {children}
        <div className="sm:col-span-2">
          <Button type="submit">{submit}</Button>
        </div>
      </form>
    </Panel>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const { tr } = usePrefs();
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
      {tr(label)}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-raised px-3 py-3 text-base font-medium text-ink";
