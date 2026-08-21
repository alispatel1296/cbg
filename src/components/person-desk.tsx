"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/Photo";
import {
  Button,
  Decide,
  FillBar,
  PageHeader,
  Panel,
  StageBar,
  StatusPill,
} from "@/components/ui";
import { formatInr } from "@/lib/format";
import type { PersonCard } from "@/lib/people";
import { canSeePay } from "@/lib/people";
import type { Role } from "@/lib/types";
import { canAccess } from "@/lib/data";
import { LAST_PAY_DAY, NEXT_PAY_DAY, PLANT_TODAY } from "@/lib/plant-clock";
import { usePrefs } from "@/lib/prefs";
import { useBook } from "@/lib/book-store";

function todayTone(t?: PersonCard["today"]) {
  if (t === "present") return "green" as const;
  if (t === "late") return "amber" as const;
  if (t === "absent") return "red" as const;
  return "neutral" as const;
}

function todayWord(t?: PersonCard["today"]) {
  if (t === "present") return "Present";
  if (t === "late") return "Late";
  if (t === "absent") return "Absent";
  if (t === "off") return "Off";
  return "—";
}

export function PersonDesk({
  person,
  viewerRole,
  self,
}: {
  person: PersonCard;
  viewerRole?: Role;
  self: boolean;
}) {
  const { t } = usePrefs();
  const { jobs, leave, askLeave, setJobDone, can } = useBook();
  const [asked, setAsked] = useState(false);
  const myJobs = jobs.filter(
    (j) =>
      j.status === "open" &&
      (j.assigneeId === person.staffId || j.assigneeName === person.name),
  );
  const myLeave = leave.filter((l) => l.name === person.name);
  const showPay = canSeePay(viewerRole, person, self);
  const showDays = person.payKind === "salary" && person.monthTarget > 0;
  const deskOk =
    person.deskHref &&
    person.deskHref !== "/me" &&
    (!viewerRole || canAccess(viewerRole, person.deskHref));
  const daysPct =
    person.monthTarget > 0
      ? (person.monthPresent / person.monthTarget) * 100
      : 0;
  const pay = person.pay;
  const gross = pay ? pay.basic + pay.extras : 0;

  return (
    <div>
      <PageHeader
        color="teal"
        title={self ? t("me.title") : person.name}
        description={
          self
            ? t("me.desc")
            : `${person.jobTitle} · ${person.dept}`
        }
        actions={
          deskOk ? (
            <Link href={person.deskHref!}>
              <Button variant="secondary">{t("me.openDesk")}</Button>
            </Link>
          ) : null
        }
      />

      <Panel className="mb-4 flex flex-wrap items-start gap-4">
        <Photo
          src={person.photo}
          alt={person.name}
          className="size-20 shrink-0 rounded-full"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xl font-semibold">{person.name}</p>
          <p className="text-sm text-muted">
            {person.jobTitle} · {person.dept}
          </p>
          <p className="mt-1 text-sm text-muted">
            {person.village} · here since {person.since} · reports to{" "}
            {person.reportsTo}
          </p>
          {person.truck ? (
            <p className="mt-1 text-sm font-semibold">
              Truck {person.truck}
              {person.license ? ` · License ${person.license}` : ""}
            </p>
          ) : null}
          <p className="mt-2 text-sm">{person.bio}</p>
          <p className="mt-2 text-sm text-muted">
            {person.phone}
            {person.email ? ` · ${person.email}` : ""}
          </p>
        </div>
        {person.today ? (
          <StatusPill
            status={todayTone(person.today)}
            label={todayWord(person.today)}
          />
        ) : null}
      </Panel>

      <Decide
        cue={person.call.cue}
        analysis={person.call.analysis}
        decision={person.call.decision}
      >
        {person.call.options.map((o) =>
          o.href ? (
            <Link key={o.label} href={o.href}>
              <Button variant={o.gold ? "gold" : "secondary"}>{o.label}</Button>
            </Link>
          ) : (
            <Button key={o.label} variant="secondary" disabled={!o.gold}>
              {o.label}
            </Button>
          ),
        )}
        {self && person.payKind === "salary" ? (
          <Button
            variant="ghost"
            disabled={!can("ask_leave")}
            onClick={() => {
              askLeave({
                name: person.name,
                days: 1,
                from: PLANT_TODAY,
                reason: "Asked from My card",
              });
              setAsked(true);
            }}
          >
            Ask leave
          </Button>
        ) : null}
      </Decide>

      {asked ? (
        <p className="mb-4 text-sm font-medium text-teal">
          Leave asked. It is on Staff for HR / Owner to tick — and on the change log.
        </p>
      ) : null}

      {myLeave.length ? (
        <Panel className="mb-4 border-l-4 border-l-amber">
          <p className="text-xs font-bold uppercase tracking-wide text-amber">
            Leave on this card
          </p>
          <ul className="mt-2 space-y-2">
            {myLeave.map((l) => (
              <li key={l.id} className="text-sm">
                <span className="font-semibold">{l.from}</span>
                {" · "}
                {l.days} day(s) · {l.reason}
                {" · "}
                <span className="font-semibold">
                  {l.status === "approved" ? "Allowed" : "Waiting for HR"}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {myJobs.length ? (
        <Panel className="mb-4 border-l-4 border-l-teal">
          <p className="text-xs font-bold uppercase tracking-wide text-teal">
            Jobs assigned to you
          </p>
          <ul className="mt-2 space-y-2">
            {myJobs.map((j) => (
              <li
                key={j.id}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <p className="text-sm font-medium">
                  {j.title}
                  <span className="block text-xs text-muted">Due {j.due}</span>
                </p>
                {self ? (
                  <Button
                    variant="secondary"
                    onClick={() => setJobDone(j.id)}
                  >
                    Mark done
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {showDays ? (
        <Panel className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Working days this month
          </p>
          <p className="mt-1 font-display text-2xl font-bold">
            {person.monthPresent} / {person.monthTarget}
          </p>
          <div className="mt-3">
            <StageBar
              steps={["Start", "Week 1", "Week 2", "Week 3", "Pay day"]}
              at={Math.min(4, Math.round((person.monthPresent / person.monthTarget) * 4))}
            />
          </div>
          <FillBar pct={daysPct} tone="teal" />
          <p className="mt-2 text-sm text-muted">
            Absent {person.monthAbsent} · off {person.monthOff}
            {person.inTime && person.inTime !== "—"
              ? ` · today in ${person.inTime}`
              : ""}
          </p>
        </Panel>
      ) : null}

      {showPay && pay ? (
        <Panel className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            This month’s money
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-gold">
            {formatInr(pay.net)}
          </p>
          <p className="text-sm text-muted">
            {pay.month} running · bank on {NEXT_PAY_DAY}. July already paid{" "}
            {LAST_PAY_DAY}.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface px-3 py-2">
              <p className="text-[11px] font-semibold uppercase text-muted">
                Monthly
              </p>
              <p className="font-bold">{formatInr(pay.basic)}</p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-3 py-2">
              <p className="text-[11px] font-semibold uppercase text-muted">
                {pay.extrasLabel}
              </p>
              <p className="font-bold">{formatInr(pay.extras)}</p>
            </div>
            {pay.advance ? (
              <div className="rounded-lg border border-line bg-surface px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-muted">
                  Advance cut
                </p>
                <p className="font-bold text-amber">{formatInr(pay.advance)}</p>
              </div>
            ) : null}
            {pay.deduct && !pay.advance ? (
              <div className="rounded-lg border border-line bg-surface px-3 py-2">
                <p className="text-[11px] font-semibold uppercase text-muted">
                  Cuts
                </p>
                <p className="font-bold">{formatInr(pay.deduct)}</p>
              </div>
            ) : null}
          </div>
          <FillBar
            pct={gross ? (pay.net / gross) * 100 : 0}
            tone="gold"
          />
        </Panel>
      ) : null}

      {person.metrics.length ? (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {person.metrics.map((m) => (
            <Panel key={m.label} className="border-l-4 border-l-teal">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {m.label}
              </p>
              <p className="mt-1 font-display text-2xl font-bold">{m.value}</p>
              {m.hint ? (
                <p className="mt-1 text-sm text-muted">{m.hint}</p>
              ) : null}
            </Panel>
          ))}
        </div>
      ) : null}
    </div>
  );
}
