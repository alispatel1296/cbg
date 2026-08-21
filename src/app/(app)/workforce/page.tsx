"use client";

import Link from "next/link";
import { useState } from "react";
import { ADVANCES, SHIFTS } from "@/lib/factory-ops";
import { formatInr } from "@/lib/format";
import {
  ActionCard,
  Button,
  Decide,
  FillBar,
  Lane,
  PageHeader,
  Panel,
  StatusPill,
  WorkflowTabs,
} from "@/components/ui";
import { DateBoard, MiniTalk } from "@/components/ops";
import { useBook } from "@/lib/book-store";
import { DeskGate, EnteredBy, Field, FormCard, inputClass, LineNotice } from "@/components/book-ui";
import { WATCH } from "@/lib/plant-flow";
import { PLANT_TODAY } from "@/lib/plant-clock";
import { peopleForDirectory } from "@/lib/people";
import { usePrefs } from "@/lib/prefs";

const TABS = [
  { id: "floor", label: "Floor today" },
  { id: "jobs", label: "Jobs" },
  { id: "leave", label: "Leave" },
  { id: "pay", label: "Salary" },
];

export default function WorkforcePage() {
  const { t } = usePrefs();
  const [tab, setTab] = useState("floor");
  const [open, setOpen] = useState(false);
  const { staff, jobs, leave, addStaff, setLeave, setJobDone, can, calls, recordCall } =
    useBook();
  const [hire, setHire] = useState({
    name: "",
    job: "Driver",
    dept: "Collection",
    phone: "",
    kind: "driver" as "staff" | "driver",
  });
  const present = staff.filter((w) => w.today === "present");
  const late = staff.filter((w) => w.today === "late");
  const absent = staff.filter((w) => w.today === "absent");
  const pendingLeave = leave.filter((l) => l.status === "pending");
  const overdueJobs = jobs.filter((t) => t.status !== "done" && t.due < PLANT_TODAY);
  const openJobs = jobs.filter((t) => t.status !== "done");
  const coverageGap = absent[0];

  return (
    <div>
      <PageHeader
        color="teal"
        title="People"
        description="Who is missing. Which job is late. Whose leave needs a yes."
        actions={<Button onClick={() => setOpen((v) => !v)}>Add staff</Button>}
      />
      <LineNotice watch={WATCH.staff} />
      <WorkflowTabs tabs={TABS} active={tab} onChange={setTab} />

      {open ? (
        <DeskGate action="add_staff">
          <FormCard
            title="Hire someone — they must exist here before Trucks can assign a driver"
            submit="Save person"
            onSubmit={() => {
              if (!can("add_staff") || !hire.name.trim()) return;
              addStaff(hire);
              setOpen(false);
              setHire({ ...hire, name: "", phone: "" });
            }}
          >
            <Field label="Name">
              <input
                required
                className={inputClass}
                value={hire.name}
                onChange={(e) => setHire({ ...hire, name: e.target.value })}
              />
            </Field>
            <Field label="Job">
              <input
                required
                className={inputClass}
                value={hire.job}
                onChange={(e) => setHire({ ...hire, job: e.target.value })}
              />
            </Field>
            <Field label="Desk / dept">
              <input
                className={inputClass}
                value={hire.dept}
                onChange={(e) => setHire({ ...hire, dept: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <input
                className={inputClass}
                value={hire.phone}
                onChange={(e) => setHire({ ...hire, phone: e.target.value })}
              />
            </Field>
            <Field label="Kind">
              <select
                className={inputClass}
                value={hire.kind}
                onChange={(e) =>
                  setHire({ ...hire, kind: e.target.value as "staff" | "driver" })
                }
              >
                <option value="driver">Driver (can take a truck)</option>
                <option value="staff">Plant staff</option>
              </select>
            </Field>
          </FormCard>
        </DeskGate>
      ) : null}

      {tab === "floor" ? (
        <div className="space-y-4">
          <Decide
            cue="Coverage"
            analysis={
              coverageGap
                ? `${coverageGap.name} is absent. ${coverageGap.job} has no stand-in this shift.`
                : pendingLeave[0]
                  ? `${pendingLeave[0].name} asked leave. The floor is covered if you say no.`
                  : "Everyone needed is in."
            }
            decision={
              coverageGap
                ? "Move someone onto that line, or hold the line."
                : pendingLeave[0]
                  ? "Allow leave, or hold it."
                  : "No people decision right now."
            }
          >
            {coverageGap ? (
              <Button variant="gold" onClick={() => setTab("jobs")}>
                Move someone
              </Button>
            ) : null}
            {coverageGap ? (
              <Button
                variant="secondary"
                disabled={!can("mark_call")}
                onClick={() =>
                  recordCall(
                    "hold-line",
                    `Held the line — ${coverageGap.name} absent, no stand-in`,
                    "Staff",
                  )
                }
              >
                {calls["hold-line"] ? t("staff.heldLine") : t("staff.holdLine")}
              </Button>
            ) : null}
            {pendingLeave[0] && can("allow_leave") ? (
              <Button
                variant="secondary"
                onClick={() => setLeave(pendingLeave[0].id, "approved")}
              >
                Allow leave
              </Button>
            ) : null}
          </Decide>
          <div className="space-y-2">
            {coverageGap ? (
              <ActionCard
                tone="danger"
                cue="Line uncovered"
                title={`${coverageGap.name} is absent — ${coverageGap.job} has no stand-in`}
                detail="Afternoon purification has a hole. Move someone from morning or hold the line."
              />
            ) : null}
            {late.map((w) => (
              <ActionCard
                key={w.id}
                tone="amber"
                cue="Came late"
                title={`${w.name} in at ${w.inTime}`}
                detail={`${w.job}. Mark reason so the day’s muster is honest.`}
              />
            ))}
            {pendingLeave.map((l) => (
              <ActionCard
                key={l.id}
                tone="amber"
                cue="Leave waiting"
                title={`${l.name} asked ${l.days} day(s) from ${l.from}`}
                detail={l.reason}
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (!can("allow_leave")) return;
                      setLeave(l.id, "approved");
                    }}
                  >
                    Allow
                  </Button>
                }
              />
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Panel className="border-l-4 border-l-ok">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Present
              </p>
              <p className="text-3xl font-semibold tabular-nums text-ok">
                {present.length}
              </p>
            </Panel>
            <Panel className="border-l-4 border-l-amber">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Late
              </p>
              <p className="text-3xl font-semibold tabular-nums text-amber">
                {late.length}
              </p>
            </Panel>
            <Panel className="border-l-4 border-l-danger">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Absent
              </p>
              <p className="text-3xl font-semibold tabular-nums text-danger">
                {absent.length}
              </p>
            </Panel>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <DateBoard
              kinds={["staff"]}
              title="Who is off this month"
              hint="Leave and shift holes sit here — not on a separate Dates page."
            />
            <Panel>
              <h2 className="mb-2 font-display text-lg font-bold">
                Talk to shift in-charge
              </h2>
              <p className="mb-3 text-sm text-muted">
                Same chat as before, next to the people it belongs to.
              </p>
              <MiniTalk threadId="suresh" />
            </Panel>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <Lane title="On the floor" count={present.length}>
              {present.map((w) => (
                <PersonCard key={w.id} w={w} />
              ))}
            </Lane>
            <Lane title="Late" count={late.length} empty="Nobody late">
              {late.map((w) => (
                <PersonCard key={w.id} w={w} />
              ))}
            </Lane>
            <Lane title="Missing" count={absent.length} empty="Full house">
              {absent.map((w) => (
                <PersonCard key={w.id} w={w} />
              ))}
            </Lane>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {SHIFTS.map((s) => (
              <Panel key={s.name}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {s.name}
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {s.count}
                </p>
                <p className="text-sm text-muted">{s.people}</p>
              </Panel>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "jobs" ? (
        <div className="space-y-4">
          {overdueJobs.map((t) => (
            <ActionCard
              key={t.id}
              tone="danger"
              cue="Overdue"
              title={t.title}
              detail={`${t.assigneeName} · was due ${t.due}`}
              action={
                <Button variant="secondary" onClick={() => setJobDone(t.id)}>
                  Mark done
                </Button>
              }
            />
          ))}
          <div className="grid gap-3 lg:grid-cols-3">
            <Lane
              title="Late"
              count={overdueJobs.length}
              empty="Nothing late"
            >
              {overdueJobs.map((t) => (
                <JobMini key={t.id} t={t} />
              ))}
            </Lane>
            <Lane
              title="Open"
              count={openJobs.filter((t) => t.due >= PLANT_TODAY).length}
            >
              {openJobs
                .filter((t) => t.due >= PLANT_TODAY)
                .map((t) => (
                  <JobMini key={t.id} t={t} />
                ))}
            </Lane>
            <Lane
              title="Done"
              count={jobs.filter((t) => t.status === "done").length}
            >
              {jobs
                .filter((t) => t.status === "done")
                .map((t) => (
                  <JobMini key={t.id} t={t} />
                ))}
            </Lane>
          </div>
        </div>
      ) : null}

      {tab === "leave" ? (
        <div className="space-y-2">
          {leave.map((l) => (
            <ActionCard
              key={l.id}
              tone={l.status === "pending" ? "amber" : "ok"}
              cue={l.status === "pending" ? "Needs a yes" : "Allowed"}
              title={`${l.name} · ${l.days} day(s) from ${l.from}`}
              detail={l.reason}
              action={
                l.status === "pending" ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (!can("allow_leave")) return;
                      setLeave(l.id, "approved");
                    }}
                  >
                    Allow
                  </Button>
                ) : null
              }
            />
          ))}
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Staff book
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {staff.map((e) => (
                <div
                  key={e.id}
                  className="rounded-lg border border-line bg-surface px-3 py-3"
                >
                  <p className="font-medium">{e.name}</p>
                  <p className="text-sm text-muted">
                    {e.job} · {e.dept} · {e.id}
                    {e.kind === "driver" ? " · driver" : ""}
                  </p>
                  <Link
                    href={`/people/${e.id}`}
                    className="mt-1 inline-block text-sm font-semibold text-teal"
                  >
                    Open card
                  </Link>
                  <EnteredBy stamp={e.stamp} />
                </div>
              ))}
            </div>
          </Panel>
          <DateBoard
            kinds={["staff"]}
            title="Leave calendar"
            hint="Hover the gold days. Floor Kiran Jadhav is on leave — not truck driver Kiran Pawar."
          />
        </div>
      ) : null}

      {tab === "pay" ? (
        <div className="space-y-4">
          {ADVANCES.filter((a) => a.status !== "cleared").map((a) => (
            <ActionCard
              key={a.id}
              tone="amber"
              cue="Advance waiting"
              title={`${a.name} · ${formatInr(a.amount)} (${formatInr(a.left)} left)`}
              detail={`Taken ${a.date}. Large advances wait for owner tick.`}
                  action={
                    <Link href="/finance">
                      <Button variant="secondary">Owner tick</Button>
                    </Link>
                  }
            />
          ))}
          <div className="grid gap-3">
            {peopleForDirectory()
              .filter((p) => p.payKind === "salary" && p.pay)
              .map((p) => {
                const pay = p.pay!;
                const gross = pay.basic + pay.extras;
                return (
                  <Panel key={p.id}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted">
                          {p.jobTitle} · {p.monthPresent} days this month
                        </p>
                      </div>
                      <p className="text-xl font-semibold tabular-nums text-ok">
                        {formatInr(pay.net)}
                      </p>
                    </div>
                    <FillBar
                      pct={gross ? (pay.net / gross) * 100 : 0}
                      tone="ok"
                    />
                    <p className="mt-2 text-xs text-muted">
                      August running · pays 7 Sep
                      {pay.advance
                        ? ` · advance cut ${formatInr(pay.advance)}`
                        : ""}
                    </p>
                    <Link
                      href={`/people/${p.id}`}
                      className="mt-2 inline-block text-sm font-semibold text-teal"
                    >
                      Open card
                    </Link>
                  </Panel>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PersonCard({
  w,
}: {
  w: { id: string; name: string; job: string; inTime: string; today: string };
}) {
  return (
    <Link href={`/people/${w.id}`} className="block">
      <div className="rounded-lg border border-line bg-raised p-3 hover:border-teal">
        <p className="font-medium">{w.name}</p>
        <p className="text-xs text-muted">
          {w.job}
          {w.inTime !== "—" ? ` · in ${w.inTime}` : ""}
        </p>
        <p className="mt-1 text-xs font-semibold text-teal">Open card</p>
      </div>
    </Link>
  );
}

function JobMini({
  t,
}: {
  t: { id: string; title: string; assigneeName: string; due: string; status: string };
}) {
  return (
    <div className="rounded-lg border border-line bg-raised p-3">
      <StatusPill
        status={t.status === "done" ? "green" : t.due < PLANT_TODAY ? "red" : "amber"}
        label={t.status}
      />
      <p className="mt-2 font-medium">{t.title}</p>
      <p className="text-xs text-muted">
        {t.assigneeName} · {t.due}
      </p>
    </div>
  );
}
