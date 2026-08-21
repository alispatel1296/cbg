"use client";

import { useMemo, useState } from "react";
import {
  CUSTOMERS,
  DISPATCH_NOTES,
  INVOICES,
} from "@/lib/factory-ops";
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
import { CustomerMap, DateBoard } from "@/components/ops";
import { useBook } from "@/lib/book-store";
import { usePrefs } from "@/lib/prefs";
import { DeskGate, EnteredBy, Field, FormCard, inputClass, LineNotice } from "@/components/book-ui";
import { WATCH } from "@/lib/plant-flow";

const TABS = [
  { id: "now", label: "Money now" },
  { id: "orders", label: "Orders" },
  { id: "bills", label: "Bills" },
  { id: "people", label: "Customers" },
];

export default function SalesPage() {
  const { t } = usePrefs();
  const [tab, setTab] = useState("now");
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-08-31");
  const [open, setOpen] = useState(false);
  const { orders, addOrder, can, calls, recordCall } = useBook();
  const [draft, setDraft] = useState({
    customer: CUSTOMERS[0].name,
    item: "CBG",
    qty: "100 kg",
    amount: 4500,
  });

  const blocked = orders.filter((s) => !s.creditOk);
  const openBills = INVOICES.filter((i) => i.status !== "paid");
  const overdue = INVOICES.filter((i) => i.status === "overdue");
  const waiting = INVOICES.filter(
    (i) => i.status === "unpaid" || i.status === "partial",
  );
  const collectable = openBills.reduce(
    (s, i) => s + (i.total - (i.paid ?? 0)),
    0,
  );
  const overdueAmt = overdue.reduce(
    (s, i) => s + (i.total - (i.paid ?? 0)),
    0,
  );
  const blockedAmt = blocked.reduce((s, o) => s + o.amount, 0);
  const paid = INVOICES.filter((i) => i.status === "paid");

  const filteredInv = useMemo(
    () => INVOICES.filter((i) => i.date >= from && i.date <= to),
    [from, to],
  );

  return (
    <div>
      <PageHeader
        color="gold"
        title={t("sales.title")}
        description={t("sales.desc")}
        actions={
          <Button variant="gold" onClick={() => setOpen((v) => !v)}>
            New order
          </Button>
        }
      />

      <LineNotice watch={WATCH.sales} />

      <WorkflowTabs tabs={TABS} active={tab} onChange={setTab} />

      {open ? (
        <DeskGate action="new_order">
          <FormCard
            title="New order — Sales types this. It does not appear by itself."
            submit="Save order"
            onSubmit={() => {
              if (!can("new_order")) return;
              addOrder(draft);
              setOpen(false);
            }}
          >
            <Field label="Customer">
              <select
                className={inputClass}
                value={draft.customer}
                onChange={(e) => setDraft({ ...draft, customer: e.target.value })}
              >
                {CUSTOMERS.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Item">
              <input
                className={inputClass}
                value={draft.item}
                onChange={(e) => setDraft({ ...draft, item: e.target.value })}
              />
            </Field>
            <Field label="Qty">
              <input
                className={inputClass}
                value={draft.qty}
                onChange={(e) => setDraft({ ...draft, qty: e.target.value })}
              />
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
          </FormCard>
        </DeskGate>
      ) : null}

      {tab === "now" ? (
        <div className="space-y-4">
          <Decide
            cue="Collect first"
            analysis={
              overdue[0]
                ? `${overdue[0].customer} is late by ${formatInr(overdue[0].total - (overdue[0].paid ?? 0))}. Next truck to them is money walking out.`
                : blocked[0]
                  ? `${blocked[0].customer} crossed credit. Do not load another truck.`
                  : "No late bills. You can take a new order."
            }
            decision={
              overdue[0]
                ? "Call them now, or hold the next dispatch."
                : blocked[0]
                  ? "Hold the truck until the owner allows."
                  : "Book a new order if Sales has a buyer."
            }
          >
            {overdue[0] ? (
              <a href={`tel:${CUSTOMERS.find((c) => c.name === overdue[0].customer)?.phone.replace(/\s/g, "") ?? ""}`}>
                <Button variant="gold">Call {overdue[0].customer.split(" ")[0]}</Button>
              </a>
            ) : null}
            {overdue[0] || blocked[0] ? (
              <Button
                variant="secondary"
                disabled={!can("mark_call")}
                onClick={() =>
                  recordCall(
                    "hold-next-truck",
                    "Held next dispatch until late bill is collected",
                    "Sales",
                  )
                }
              >
                {calls["hold-next-truck"]
                  ? t("sales.heldTruck")
                  : t("sales.holdTruck")}
              </Button>
            ) : (
              <Button onClick={() => setOpen(true)}>New order</Button>
            )}
          </Decide>
          <div className="space-y-2">
            {overdue.map((i) => (
              <ActionCard
                key={i.id}
                tone="danger"
                cue="Late money"
                title={`${i.customer} still owes ${formatInr(i.total - (i.paid ?? 0))}`}
                detail={`${i.id} was due ${i.due}. Call before sending the next truck.`}
                action={
                  <a
                    href={`tel:${(
                      CUSTOMERS.find((c) => c.name === i.customer)?.phone ?? ""
                    ).replace(/\s/g, "")}`}
                  >
                    <Button variant="gold">Call</Button>
                  </a>
                }
              />
            ))}
            {blocked.map((s) => (
              <ActionCard
                key={s.id}
                tone="danger"
                cue="Credit stop"
                title={`${s.customer} crossed their limit`}
                detail={`${s.id} · ${s.item} · ${formatInr(s.amount)}. Do not dispatch until the owner allows.`}
              />
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Panel className="border-l-4 border-l-danger">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Late
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-danger">
                {formatInr(overdueAmt, true)}
              </p>
              <p className="mt-1 text-xs text-muted">Past due date</p>
            </Panel>
            <Panel className="border-l-4 border-l-gold">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Still to collect
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-gold">
                {formatInr(collectable, true)}
              </p>
              <p className="mt-1 text-xs text-muted">Open bills</p>
            </Panel>
            <Panel className="border-l-4 border-l-danger">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Held at credit
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {formatInr(blockedAmt, true)}
              </p>
              <p className="mt-1 text-xs text-muted">Not billed yet</p>
            </Panel>
          </div>

          <DateBoard
            kinds={["money"]}
            title="When money is due"
            hint="Chase dates live on Sales — not a separate calendar."
          />

          <div className="grid gap-3 lg:grid-cols-4">
            <Lane title="New orders" count={orders.length}>
              {orders.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-line bg-raised p-3"
                >
                  <p className="text-xs text-muted">{s.id}</p>
                  <p className="font-medium">{s.customer}</p>
                  <p className="text-sm tabular-nums">{formatInr(s.amount)}</p>
                  {!s.creditOk ? (
                    <p className="mt-1 text-xs font-medium text-danger">
                      Over limit
                    </p>
                  ) : null}
                </div>
              ))}
            </Lane>
            <Lane title="Collect" count={waiting.length}>
              {waiting.map((i) => (
                <CollectCard key={i.id} i={i} />
              ))}
            </Lane>
            <Lane title="Overdue" count={overdue.length} empty="None late">
              {overdue.map((i) => (
                <CollectCard key={i.id} i={i} hot />
              ))}
            </Lane>
            <Lane title="Left the gate" count={DISPATCH_NOTES.length}>
              {DISPATCH_NOTES.map((d) => (
                <div
                  key={d.id}
                  className="rounded-lg border border-line bg-raised p-3"
                >
                  <p className="text-xs text-muted">
                    {d.id} · {d.invoice}
                  </p>
                  <p className="font-medium">{d.what}</p>
                  <p className="text-sm text-muted">To {d.to}</p>
                </div>
              ))}
            </Lane>
          </div>
        </div>
      ) : null}

      {tab === "orders" ? (
        <div className="grid gap-3">
          {orders.map((s) => (
            <Panel
              key={s.id}
              className={!s.creditOk ? "border-danger/30" : ""}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted">{s.id} · {s.date}</p>
                  <p className="font-medium">{s.customer}</p>
                  <p className="text-sm text-muted">
                    {s.item} · {s.qty}
                  </p>
                  <EnteredBy stamp={s.stamp} />
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold tabular-nums text-gold">
                    {formatInr(s.amount)}
                  </p>
                  <StatusPill
                    status={s.creditOk ? "green" : "red"}
                    label={s.creditOk ? "Within limit" : "Stop — over limit"}
                  />
                </div>
              </div>
            </Panel>
          ))}
        </div>
      ) : null}

      {tab === "bills" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 text-xs font-medium">
            <label>
              From
              <input
                type="date"
                className="ml-2 rounded-lg border border-line px-2 py-1"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                className="ml-2 rounded-lg border border-line px-2 py-1"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </div>
          {filteredInv.map((i) => {
            const due = i.total - (i.paid ?? 0);
            const pct = ((i.paid ?? 0) / i.total) * 100;
            return (
              <Panel key={i.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{i.customer}</p>
                    <p className="text-xs text-muted">
                      {i.id} from {i.soId} · due {i.due}
                    </p>
                  </div>
                  <StatusPill
                    status={
                      i.status === "paid"
                        ? "green"
                        : i.status === "overdue"
                          ? "red"
                          : i.status === "partial"
                            ? "amber"
                            : "neutral"
                    }
                    label={
                      i.status === "paid"
                        ? "Paid"
                        : i.status === "overdue"
                          ? "Overdue"
                          : i.status === "partial"
                            ? "Part paid"
                            : "Unpaid"
                    }
                  />
                </div>
                <p className="mt-2 text-xl font-semibold tabular-nums">
                  {formatInr(i.total)}
                  {due > 0 ? (
                    <span className="ml-2 text-sm font-medium text-gold">
                      {formatInr(due)} left
                    </span>
                  ) : null}
                </p>
                <FillBar
                  pct={pct}
                  tone={i.status === "overdue" ? "danger" : "gold"}
                />
              </Panel>
            );
          })}
          {paid.length ? (
            <p className="text-xs text-muted">
              Settled this range: {paid.map((p) => p.id).join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}

      {tab === "people" ? (
        <div className="space-y-4">
          <CustomerMap />
          <div className="grid gap-3 md:grid-cols-2">
          {CUSTOMERS.map((c) => {
            const owed = INVOICES.filter(
              (i) => i.customer === c.name && i.status !== "paid",
            ).reduce((s, i) => s + (i.total - (i.paid ?? 0)), 0);
            const used = (owed / c.creditLimit) * 100;
            return (
              <Panel key={c.id}>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-muted">
                  {c.contact} · {c.phone}
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
                  Credit used
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatInr(owed)}
                  <span className="ml-1 text-sm font-medium text-muted">
                    / {formatInr(c.creditLimit)}
                  </span>
                </p>
                <FillBar
                  pct={used}
                  tone={used > 80 ? "danger" : used > 40 ? "amber" : "ok"}
                />
                <p className="mt-2 text-xs text-muted">
                  {c.terms} · GST {c.gst}
                </p>
              </Panel>
            );
          })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CollectCard({
  i,
  hot,
}: {
  i: (typeof INVOICES)[number];
  hot?: boolean;
}) {
  const left = i.total - (i.paid ?? 0);
  return (
    <div
      className={`rounded-lg border bg-raised p-3 ${
        hot ? "border-danger/30" : "border-line"
      }`}
    >
      <p className="text-xs text-muted">{i.id}</p>
      <p className="font-medium">{i.customer}</p>
      <p className="text-sm font-semibold tabular-nums text-gold">
        {formatInr(left)}
      </p>
      <p className="text-xs text-muted">Due {i.due}</p>
    </div>
  );
}
