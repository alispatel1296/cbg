"use client";

import { useState } from "react";
import { QUALITY_CHECKS } from "@/lib/factory-ops";
import {
  ActionCard,
  Button,
  Decide,
  FillBar,
  Lane,
  PageHeader,
  Panel,
  PairBar,
  StatusPill,
} from "@/components/ui";
import { useBook } from "@/lib/book-store";
import { usePrefs } from "@/lib/prefs";
import { DeskGate, EnteredBy, Field, FormCard, inputClass, LineNotice } from "@/components/book-ui";
import { WATCH } from "@/lib/plant-flow";

export default function ProductionPage() {
  const { t } = usePrefs();
  const { production, addFloor, startFloor, can, calls, recordCall } = useBook();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    product: "Purified CBG",
    qty: "1,000 kg",
    line: "Upgrader line A",
  });
  const waiting = production.filter((o) => o.status === "pending");
  const running = production.filter((o) => o.status === "in_progress");
  const done = production.filter((o) => o.status === "completed");
  const fail = QUALITY_CHECKS.filter((q) => q.result === "fail");
  const live = running[0];
  const yieldPct = live ? 98 : 0;

  return (
    <div>
      <PageHeader
        color="teal"
        title="Floor"
        description="What is running, waiting, or failed the check."
        actions={<Button onClick={() => setOpen((v) => !v)}>New job</Button>}
      />

      <LineNotice watch={WATCH.floor} />

      {open ? (
        <DeskGate action="new_floor">
          <FormCard
            title="Start a floor job — Production types this"
            submit="Save job"
            onSubmit={() => {
              if (!can("new_floor")) return;
              addFloor(draft);
              setOpen(false);
            }}
          >
            <Field label="Product">
              <input
                className={inputClass}
                value={draft.product}
                onChange={(e) => setDraft({ ...draft, product: e.target.value })}
              />
            </Field>
            <Field label="Qty">
              <input
                className={inputClass}
                value={draft.qty}
                onChange={(e) => setDraft({ ...draft, qty: e.target.value })}
              />
            </Field>
            <Field label="Line">
              <input
                className={inputClass}
                value={draft.line}
                onChange={(e) => setDraft({ ...draft, line: e.target.value })}
              />
            </Field>
          </FormCard>
        </DeskGate>
      ) : null}

      <Decide
        cue="Floor call"
        analysis={
          fail[0]
            ? `${fail[0].batch} failed check. Do not send this lot forward.`
            : waiting[0]
              ? `${waiting[0].product} is waiting on ${waiting[0].line}.`
              : live
                ? `${live.product} is running on ${live.line}. Keep it moving.`
                : "No floor job is open."
        }
        decision={
          fail[0]
            ? "Hold the lot, or rework it."
            : waiting[0]
              ? "Start this job, or leave the line free."
              : "Watch the running line."
        }
      >
        {fail[0] ? (
          <Button
            variant="gold"
            disabled={!can("mark_call")}
            onClick={() =>
              recordCall(
                `hold-lot-${fail[0].id}`,
                `Held lot ${fail[0].batch} after quality fail`,
                "Floor",
              )
            }
          >
            {calls[`hold-lot-${fail[0].id}`]
              ? t("floor.heldLot")
              : t("floor.holdLot")}
          </Button>
        ) : null}
        {waiting[0] ? (
          <Button variant="gold" onClick={() => startFloor(waiting[0].id)}>
            Start
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => setOpen(true)}>
          New floor job
        </Button>
      </Decide>

      <div className="mb-4 space-y-2">
        {fail.map((q) => (
          <ActionCard
            key={q.id}
            tone="danger"
            cue="Stop — quality fail"
            title={q.remarks}
            detail={`${q.batch} · ${q.inspector} · ${q.date}. Do not send this lot forward.`}
          />
        ))}
        {waiting.map((o) => (
          <ActionCard
            key={o.id}
            tone="amber"
            cue="Waiting to start"
            title={`${o.product} — ${o.qty} on ${o.line}`}
            detail={`Due ${o.target}. Line is free after the running CBG job.`}
            action={
              <Button variant="secondary" onClick={() => startFloor(o.id)}>
                Start
              </Button>
            }
          />
        ))}
      </div>

      {live ? (
        <Panel className="mb-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Running now · {live.line}
              </p>
              <p className="mt-1 text-lg font-semibold">{live.product}</p>
              <p className="text-sm text-muted">
                Target {live.qty} by {live.target} · lots {live.lots}
              </p>
              <EnteredBy stamp={live.stamp} />
            </div>
            <StatusPill status="amber" label="On the line" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-muted">
                Raw in vs finished out
              </p>
              <p className="text-sm">
                {live.input} → <span className="font-semibold text-teal">{live.output}</span>
              </p>
              <FillBar pct={yieldPct} tone="teal" />
              <p className="mt-1 text-xs text-muted">
                {yieldPct}% of today’s CBG target
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted">
                Last QC on this batch
              </p>
              {QUALITY_CHECKS.filter((q) => q.batch === live.id).map((q) => (
                <p key={q.id} className="text-sm">
                  {q.remarks}
                  <span className="block text-xs text-muted">{q.inspector}</span>
                </p>
              ))}
            </div>
          </div>
        </Panel>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-3">
        <Lane title="Waiting" count={waiting.length} empty="Floor is clear">
          {waiting.map((o) => (
            <JobCard key={o.id} o={o} />
          ))}
        </Lane>
        <Lane title="Running" count={running.length} empty="Nothing on line">
          {running.map((o) => (
            <JobCard key={o.id} o={o} />
          ))}
        </Lane>
        <Lane title="Done — stock updated" count={done.length}>
          {done.map((o) => (
            <JobCard key={o.id} o={o} />
          ))}
        </Lane>
      </div>

      <Panel className="mt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          In vs out — finished batches
        </p>
        <div className="space-y-4">
          {done.map((o) => (
            <div key={o.id}>
              <div className="mb-1 flex justify-between gap-2 text-sm">
                <span className="font-medium">{o.product}</span>
                <span className="text-muted">{o.id}</span>
              </div>
              <PairBar
                leftLabel="In"
                rightLabel="Out"
                left={Number.parseFloat(o.input) || 0}
                right={Number.parseFloat(o.output) || 0}
              />
              <p className="mt-1 text-xs text-muted">
                {o.input} → {o.output} · {o.lots}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

import type { BookProd } from "@/lib/book";

function JobCard({ o }: { o: BookProd }) {
  return (
    <div className="rounded-lg border border-line bg-raised p-3">
      <p className="text-xs font-medium text-muted">
        {o.id} · {o.line}
      </p>
      <p className="font-medium">{o.product}</p>
      <p className="text-sm text-muted">
        {o.qty} · due {o.target}
      </p>
      <EnteredBy stamp={o.stamp} />
    </div>
  );
}
