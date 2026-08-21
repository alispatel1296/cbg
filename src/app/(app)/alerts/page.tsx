"use client";

import Link from "next/link";
import { ALERTS, canAccess } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { Button, Decide, PageHeader } from "@/components/ui";
import { useBook } from "@/lib/book-store";
import { usePrefs } from "@/lib/prefs";
import { buildNotices } from "@/lib/notices";
import { NoticeList } from "@/components/NoticeList";

export default function AlertsPage() {
  const { t } = usePrefs();
  const { user } = useAuth();
  const { sendWhatsApp, wa, can, ticks, calls } = useBook();
  const open = ALERTS.filter((a) => !a.acknowledged);
  const critical = open.filter((a) => a.severity === "critical");
  const watch = open.filter((a) => a.severity !== "critical");
  const notices = buildNotices({
    role: user?.role ?? "employee",
    ticks,
    calls,
    wa,
  });

  return (
    <div>
      <PageHeader
        color="amber"
        title={t("warn.title")}
        description={t("warn.desc")}
      />

      <Decide
        cue="What to do"
        analysis={
          critical[0]
            ? `${critical[0].title}. ${critical[0].message}`
            : watch[0]
              ? `${watch[0].title}. ${watch[0].message}`
              : notices[0]
                ? notices[0].detail
                : "No open warning. Plant is quiet."
        }
        decision={
          critical[0]
            ? "Send a person now, or open the desk on the list."
            : watch[0] || notices[0]
              ? "Open the line. One tap."
              : "Nothing to tick."
        }
      >
        {critical[0] && user && user.role !== "auditor" && canAccess(user.role, "/digesters") ? (
          <Link href="/digesters">
            <Button variant="gold">Send a person to D2</Button>
          </Link>
        ) : notices[0] ? (
          <Link href={notices[0].href}>
            <Button variant="gold">{t("notesGo")}</Button>
          </Link>
        ) : null}
        {user?.role !== "auditor" ? (
          <Button
            variant="secondary"
            disabled={!can("mark_call")}
            onClick={() =>
              sendWhatsApp({
                to: "Suresh Patil",
                body: critical[0]?.title ?? watch[0]?.title ?? t("waStock"),
                kind: "alert",
                desk: "Warnings",
              })
            }
          >
            {wa.length ? t("warn.waSent") : t("warn.waSend")}
          </Button>
        ) : null}
      </Decide>

      <div className="overflow-hidden rounded-xl border border-line bg-raised">
        <div className="border-b border-line px-4 py-3">
          <p className="text-base font-semibold">{t("notes")}</p>
        </div>
        <NoticeList items={notices} />
      </div>
    </div>
  );
}
