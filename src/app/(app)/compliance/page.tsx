"use client";

import { COMPLIANCE_ITEMS } from "@/lib/gap-data";
import { SCHEME_MILESTONES } from "@/lib/product-data";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StageBar,
  StatusPill,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { CalendarClock } from "lucide-react";
import { DateBoard } from "@/components/ops";
import { useBook } from "@/lib/book-store";
import { usePrefs } from "@/lib/prefs";
import { DeskGate } from "@/components/book-ui";
import { downloadIcs } from "@/lib/ics";

export default function CompliancePage() {
  const { t, locale } = usePrefs();
  const { calls, recordCall, addDiary, sendWhatsApp, can } = useBook();
  const hot =
    SCHEME_MILESTONES.find((m) => m.status === "action_needed") ??
    SCHEME_MILESTONES[0];
  const started = Boolean(calls[`gov-start-${hot.id}`]);
  const reminded = Boolean(calls[`gov-remind-${hot.id}`]);
  const at = started ? 2 : reminded ? 1 : 0;

  return (
    <div>
      <PageHeader
        color="amber"
        title={t("gov.title")}
        description={t("gov.desc")}
      />

      <SimpleGuide
        icon={CalendarClock}
        plain={t("gov.guide")}
        like={t("gov.like")}
      />

      <Panel className="mb-4">
        <StageBar
          steps={[t("gov.step1"), t("gov.step2"), t("gov.step3"), t("gov.step4")]}
          at={at}
        />
      </Panel>

      <Decide
        cue={t("gov.cue")}
        analysis={
          hot.status === "action_needed"
            ? `${hot.scheme}: ${hot.title}. ${hot.detail}`
            : t("gov.analysisOk")
        }
        decision={t("gov.decision")}
      >
        <DeskGate action="mark_call">
          <Button
            variant="gold"
            disabled={!can("mark_call")}
            onClick={() =>
              recordCall(
                `gov-start-${hot.id}`,
                `Started gov file ${hot.scheme} — ${hot.title}`,
                "Govt dates",
              )
            }
          >
            {started ? t("gov.started") : t("gov.start")}
          </Button>
          <Button
            variant="secondary"
            disabled={!can("mark_call")}
            onClick={() => {
              recordCall(
                `gov-remind-${hot.id}`,
                `Remind later: ${hot.title} due ${hot.due}`,
                "Govt dates",
              );
              addDiary({
                date: hot.due,
                title: `${hot.scheme}: ${hot.title}`,
                kind: "govt",
              });
              sendWhatsApp({
                to: "Rajesh Mehta",
                body: `${hot.scheme} due ${hot.due}: ${hot.title}`,
                kind: "remind",
                desk: "Govt dates",
              });
              downloadIcs({
                title: `${hot.scheme} — ${hot.title}`,
                date: hot.due,
                description: hot.detail,
              });
            }}
          >
            {reminded ? t("gov.reminded") : t("gov.remind")}
          </Button>
        </DeskGate>
      </Decide>

      <DateBoard
        kinds={["govt"]}
        title={t("gov.dates")}
        hint={t("gov.datesHint")}
      />

      <h2 className="mb-3 mt-4 font-display text-xl font-bold">
        SATAT · GOBARdhan · PCB
      </h2>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SCHEME_MILESTONES.map((m, i) => (
          <Panel
            key={m.id}
            className={cn(
              "border-l-4",
              m.status === "action_needed"
                ? "border-l-amber"
                : m.status === "on_track"
                  ? "border-l-ok"
                  : "border-l-teal",
              i === 1 && "animate-rise-delay-1",
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status="neutral" label={m.scheme} />
              <StatusPill
                status={
                  m.status === "action_needed"
                    ? "amber"
                    : m.status === "on_track"
                      ? "green"
                      : "neutral"
                }
                label={
                  m.status === "action_needed"
                    ? t("gov.doSoon")
                    : m.status === "on_track"
                      ? t("gov.onTrack")
                      : t("gov.coming")
                }
              />
            </div>
            <p className="mt-2 font-display text-lg font-bold leading-snug">
              {m.title}
            </p>
            <p className="mt-1 text-sm text-muted">{m.detail}</p>
            <p className="mt-2 text-sm font-bold text-amber">
              {t("gov.days", {
                n: m.daysLeft,
                due: new Date(m.due).toLocaleDateString(locale),
              })}
            </p>
          </Panel>
        ))}
      </div>

      <Panel className="overflow-x-auto">
        <h2 className="mb-3 font-display text-lg font-bold">{t("gov.other")}</h2>
        <table className="w-full min-w-[640px] text-left text-base">
          <thead className="text-sm text-muted">
            <tr className="border-b-2 border-line">
              <th className="pb-2 font-bold">{t("gov.item")}</th>
              <th className="pb-2 font-bold">{t("gov.due")}</th>
              <th className="pb-2 font-bold">{t("gov.owner")}</th>
              <th className="pb-2 font-bold">{t("gov.status")}</th>
            </tr>
          </thead>
          <tbody>
            {COMPLIANCE_ITEMS.map((c) => (
              <tr key={c.id} className="border-b border-line/70">
                <td className="py-3 font-semibold">{c.title}</td>
                <td className="py-3">
                  {new Date(c.due).toLocaleDateString(locale)}
                  {c.status !== "done" ? (
                    <span className="block text-sm text-muted">
                      {c.daysLeft}d
                    </span>
                  ) : null}
                </td>
                <td className="py-3">{c.owner}</td>
                <td className="py-3">
                  <StatusPill
                    status={
                      c.status === "done"
                        ? "green"
                        : c.status === "in_progress"
                          ? "amber"
                          : "neutral"
                    }
                    label={c.status.replace("_", " ")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
