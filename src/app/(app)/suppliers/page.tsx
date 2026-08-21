"use client";

import { useState } from "react";
import { SUPPLIERS } from "@/lib/factory-ops";
import { formatInr } from "@/lib/format";
import {
  ActionCard,
  Button,
  Decide,
  FillBar,
  PageHeader,
  Panel,
  StatusPill,
  WorkflowTabs,
} from "@/components/ui";
import { useBook } from "@/lib/book-store";
import { DeskGate, EnteredBy, Field, FormCard, inputClass } from "@/components/book-ui";

const TABS = [
  { id: "pay", label: "Pay first" },
  { id: "slips", label: "Paid slips" },
  { id: "book", label: "Book" },
];

const DUE = [
  { id: "SUP-01", days: 4, why: "7 days after GRN-220 (dung short 1.6 t)" },
  { id: "SUP-02", days: 0, why: "Pay when weighbridge is OK — grass is in" },
  { id: "SUP-03", days: 1, why: "Hold — residue truck still loading, no photo yet" },
];

export default function SuppliersPage() {
  const [tab, setTab] = useState("pay");
  const [open, setOpen] = useState(false);
  const { payments, addPayment, can, calls, recordCall } = useBook();
  const [draft, setDraft] = useState({
    supplier: SUPPLIERS[0].name,
    amount: 5000,
    against: "GRN",
  });
  const ranked = [...SUPPLIERS].sort((a, b) => b.outstanding - a.outstanding);
  const total = SUPPLIERS.reduce((s, x) => s + x.outstanding, 0);
  const first = ranked[0];
  const dueMeta = (id: string) => DUE.find((d) => d.id === id);

  return (
    <div>
      <PageHeader
        color="gold"
        title="Pay out"
        description="Who to pay so the next truck still comes."
        actions={
          <Button variant="gold" onClick={() => setOpen((v) => !v)}>
            New payment
          </Button>
        }
      />
      <WorkflowTabs tabs={TABS} active={tab} onChange={setTab} />

      {open ? (
        <DeskGate action="new_payment">
          <FormCard
            title="Pay a supplier — Accountant types this slip"
            submit="Save payment"
            onSubmit={() => {
              if (!can("new_payment")) return;
              addPayment(draft);
              setOpen(false);
            }}
          >
            <Field label="Supplier">
              <select
                className={inputClass}
                value={draft.supplier}
                onChange={(e) => setDraft({ ...draft, supplier: e.target.value })}
              >
                {SUPPLIERS.map((s) => (
                  <option key={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Amount ₹">
              <input
                type="number"
                className={inputClass}
                value={draft.amount}
                onChange={(e) =>
                  setDraft({ ...draft, amount: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Against (GRN / lot)">
              <input
                className={inputClass}
                value={draft.against}
                onChange={(e) => setDraft({ ...draft, against: e.target.value })}
              />
            </Field>
          </FormCard>
        </DeskGate>
      ) : null}

      {tab === "pay" ? (
        <div className="space-y-4">
          <Decide
            cue="Who to pay"
            analysis={
              first
                ? `${first.name} is the biggest hole — ${formatInr(first.outstanding)}. If they stop sending dung, the tanks starve.`
                : "No supplier is waiting."
            }
            decision="Pay this name now, or hold if the weighbridge is still short."
          >
            {first ? (
              <Button
                variant="gold"
                onClick={() => {
                  setDraft({
                    supplier: first.name,
                    amount: first.outstanding,
                    against: "outstanding",
                  });
                  setOpen(true);
                }}
              >
                Pay {formatInr(first.outstanding)}
              </Button>
            ) : null}
            <Button
              variant="secondary"
              disabled={!can("mark_call")}
              onClick={() =>
                recordCall(
                  "hold-coop-pay",
                  "Held Village Coop pay — residue truck still loading, no photo",
                  "Suppliers",
                )
              }
            >
              {calls["hold-coop-pay"] ? "Held till photo" : "Hold till weight OK"}
            </Button>
          </Decide>
          {first ? (
            <ActionCard
              tone="gold"
              cue="Pay this week"
              title={`${first.name} · ${formatInr(first.outstanding)}`}
              detail={dueMeta(first.id)?.why ?? first.terms}
              action={
                <Button
                  variant="gold"
                  onClick={() => {
                    setDraft({
                      supplier: first.name,
                      amount: first.outstanding,
                      against: "outstanding",
                    });
                    setOpen(true);
                  }}
                >
                  Pay now
                </Button>
              }
            />
          ) : null}

          <Panel className="border-l-4 border-l-gold">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Still to pay
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-gold">
              {formatInr(total)}
            </p>
            <p className="mt-1 text-xs text-muted">
              Ranked by size. Pay the top name so dung keeps arriving.
            </p>
          </Panel>

          <div className="space-y-3">
            {ranked.map((s, i) => {
              const meta = dueMeta(s.id);
              const share = (s.outstanding / total) * 100;
              return (
                <Panel key={s.id}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted">
                        #{i + 1} · {s.terms}
                      </p>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted">{meta?.why}</p>
                    </div>
                    <p className="text-xl font-semibold tabular-nums text-gold">
                      {formatInr(s.outstanding)}
                    </p>
                  </div>
                  <FillBar pct={share} tone={i === 0 ? "gold" : "teal"} />
                  <p className="mt-2 text-xs text-muted">
                    {meta && meta.days <= 2
                      ? "Due almost now"
                      : `${meta?.days ?? "—"} days to terms`}
                    {" · "}
                    {Math.round(share)}% of what we owe
                  </p>
                </Panel>
              );
            })}
          </div>
        </div>
      ) : null}

      {tab === "slips" ? (
        <div className="space-y-2">
          {payments.map((v) => (
            <Panel key={v.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted">
                    {v.id} · {v.date} · {v.mode}
                  </p>
                  <p className="font-medium">{v.supplier}</p>
                  <p className="text-sm text-muted">Against {v.against}</p>
                  <EnteredBy stamp={v.stamp} />
                </div>
                <p className="text-lg font-semibold tabular-nums">
                  {formatInr(v.amount)}
                </p>
              </div>
            </Panel>
          ))}
        </div>
      ) : null}

      {tab === "book" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {SUPPLIERS.map((s) => (
            <Panel key={s.id}>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-muted">{s.contact}</p>
              <p className="mt-2 text-sm">Bank {s.bank}</p>
              <div className="mt-2">
                <StatusPill status="neutral" label={s.terms} />
              </div>
            </Panel>
          ))}
        </div>
      ) : null}
    </div>
  );
}
