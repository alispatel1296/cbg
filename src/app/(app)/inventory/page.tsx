"use client";

import { useState } from "react";
import { INVENTORY } from "@/lib/tier1-data";
import {
  GRN_NOTES,
  STOCK_MOVES,
  WASTAGE,
} from "@/lib/factory-ops";
import { formatInr, formatNumber } from "@/lib/format";
import { Photo } from "@/components/Photo";
import { PHOTOS } from "@/lib/extras";
import { MiniTalk } from "@/components/ops";
import Link from "next/link";
import { useBook } from "@/lib/book-store";
import { WATCH } from "@/lib/plant-flow";
import { DeskGate, EnteredBy, LineNotice } from "@/components/book-ui";
import type { BookPurchase } from "@/lib/book";
import {
  ActionCard,
  Button,
  Decide,
  FillBar,
  Lane,
  PageHeader,
  PairBar,
  Panel,
  StatusPill,
  WorkflowTabs,
} from "@/components/ui";

const TABS = [
  { id: "now", label: "Store now" },
  { id: "buy", label: "Buying" },
  { id: "in", label: "Trucks in" },
  { id: "flow", label: "Where it went" },
];

export default function InventoryPage() {
  const [tab, setTab] = useState("now");
  const { purchases: orders, addPurchase, can } = useBook();
  const [draft, setDraft] = useState({
    supplier: "",
    item: "Cattle dung",
    qty: "10",
    rate: "500",
    date: "2026-08-18",
  });

  const levels = INVENTORY.map((item) => {
    const days = item.onHand / item.dailyUse;
    const fill = (item.onHand / (item.reorderAt * 2.5)) * 100;
    const isLow = item.onHand <= item.reorderAt;
    const critical = days < 2;
    return { ...item, days, fill, isLow, critical };
  }).sort((a, b) => a.days - b.days);

  const waiting = orders.filter((p) => p.status === "awaiting_approval");
  const drafts = orders.filter((p) => p.status === "draft");
  const approved = orders.filter((p) => p.status === "approved");
  const short = GRN_NOTES.filter((g) => g.mismatch);
  const wasteCostHint = WASTAGE[0];

  return (
    <div>
      <PageHeader
        color="teal"
        title="Godown"
        description="Will the line stop? What came short? What waits for your yes."
        actions={
          <Button
            onClick={() => {
              setTab("buy");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            New purchase
          </Button>
        }
      />

      <Photo
        src={PHOTOS.store}
        alt="Godown"
        className="mb-4 h-40 w-full rounded-xl"
      />

      <LineNotice watch={WATCH.store} />

      <WorkflowTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "now" ? (
        <div className="space-y-4">
          <Decide
            cue="Will the line stop?"
            analysis={
              levels[0]?.isLow
                ? `${levels[0].name} has about ${levels[0].days.toFixed(1)} days left. One empty day means no gas money.`
                : waiting[0]
                  ? `${waiting[0].item} from ${waiting[0].supplier} is waiting for a tick.`
                  : "Stock is enough for now."
            }
            decision={
              levels[0]?.isLow
                ? "Order more today, or accept a stop."
                : waiting[0]
                  ? "Allow this buy, or hold it."
                  : "No buy needed."
            }
          >
            {levels[0]?.isLow ? (
              <Button variant="gold" onClick={() => setTab("buy")}>
                Order more
              </Button>
            ) : null}
            {waiting[0] ? (
              <Button variant="secondary" onClick={() => setTab("buy")}>
                Tick the buy
              </Button>
            ) : null}
          </Decide>
          <div className="space-y-2">
            {levels
              .filter((i) => i.isLow)
              .map((i) => (
                <ActionCard
                  key={i.id}
                  tone="danger"
                  cue="Will run out"
                  title={`${i.name} — about ${i.days.toFixed(1)} days left`}
                  detail={`Using ~${formatNumber(i.dailyUse, i.unit === "pcs" ? 0 : 0)} ${i.unit}/day. Reorder line is ${i.reorderAt}.`}
                  action={
                    <Button
                      variant="secondary"
                      onClick={() => setTab("buy")}
                    >
                      Order more
                    </Button>
                  }
                />
              ))}
            {waiting.map((p) => (
              <ActionCard
                key={p.id}
                tone="amber"
                cue="Waiting for owner"
                title={`${p.id} · ${p.item} from ${p.supplier}`}
                detail={`${p.qty} ${p.unit} · ${formatInr(p.qty * p.rate)} — will not go to the supplier until you allow it.`}
              />
            ))}
            {short.map((g) => (
              <ActionCard
                key={g.id}
                tone="amber"
                cue="Truck short"
                title={`${g.item} came in ${g.received} vs ${g.ordered} ordered`}
                detail={`${g.id} against ${g.poId} · lot ${g.lot}. Pay only for what arrived.`}
                action={
                  <Button variant="ghost" onClick={() => setTab("in")}>
                    See truck
                  </Button>
                }
              />
            ))}
          </div>

          <Panel>
            <h2 className="mb-2 font-display text-lg font-bold">
              Talk to store
            </h2>
            <p className="mb-3 text-sm text-muted">
              Weight slips and short trucks — talk sits here, not a Talk page.
            </p>
            <MiniTalk threadId="anita" />
          </Panel>

          <div className="grid gap-3 sm:grid-cols-2">
            {levels.map((item) => (
              <Panel
                key={item.id}
                className={
                  item.critical
                    ? "border-danger/30"
                    : item.isLow
                      ? "border-amber/40"
                      : ""
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted">
                      Last truck {item.lastIn}
                    </p>
                  </div>
                  <StatusPill
                    status={
                      item.critical ? "red" : item.isLow ? "amber" : "green"
                    }
                    label={
                      item.critical
                        ? "1–2 days"
                        : item.isLow
                          ? "Order soon"
                          : `${item.days.toFixed(0)} days`
                    }
                  />
                </div>
                <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">
                  {formatNumber(item.onHand, item.unit === "pcs" ? 0 : 1)}
                  <span className="ml-1 text-sm font-medium text-muted">
                    {item.unit}
                  </span>
                </p>
                <FillBar
                  pct={item.fill}
                  tone={
                    item.critical ? "danger" : item.isLow ? "amber" : "ok"
                  }
                />
                <p className="mt-2 text-xs text-muted">
                  Comfort line {item.reorderAt} {item.unit} · using ~
                  {formatNumber(item.dailyUse, 0)} / day
                </p>
              </Panel>
            ))}
          </div>

          {wasteCostHint ? (
            <Panel>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Lost in store
              </p>
              <p className="mt-1 text-sm">
                {WASTAGE.map((w) => `${w.qty} ${w.item.toLowerCase()} (${w.reason})`).join(" · ")}
              </p>
            </Panel>
          ) : null}
        </div>
      ) : null}

      {tab === "buy" ? (
        <div className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-3">
            <Lane title="Draft" count={drafts.length} empty="No drafts">
              {drafts.map((p) => (
                <PoCard key={p.id} p={p} />
              ))}
            </Lane>
            <Lane
              title="Needs owner"
              count={waiting.length}
              empty="Nothing waiting"
            >
              {waiting.map((p) => (
                <PoCard key={p.id} p={p} />
              ))}
            </Lane>
            <Lane title="Approved — send" count={approved.length}>
              {approved.map((p) => (
                <PoCard key={p.id} p={p} />
              ))}
            </Lane>
          </div>

          <Panel>
            <p className="mb-3 text-sm font-medium">Write a buy</p>
            <p className="mb-4 text-sm text-muted">
              Over ₹10,000 waits for the owner. Under that, store can send it. This is the only way a PO is born.
            </p>
            <DeskGate action="new_purchase">
            <form
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!can("new_purchase")) return;
                const qty = Number(draft.qty) || 0;
                const rate = Number(draft.rate) || 0;
                addPurchase({
                  supplier: draft.supplier || "Walk-in supplier",
                  item: draft.item,
                  qty,
                  rate,
                  date: draft.date,
                });
                setDraft((d) => ({ ...d, supplier: "" }));
              }}
            >
              <label className="text-xs font-medium text-muted">
                Supplier
                <input
                  required
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm font-medium"
                  value={draft.supplier}
                  onChange={(e) =>
                    setDraft({ ...draft, supplier: e.target.value })
                  }
                  placeholder="Name"
                />
              </label>
              <label className="text-xs font-medium text-muted">
                Item
                <input
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm font-medium"
                  value={draft.item}
                  onChange={(e) =>
                    setDraft({ ...draft, item: e.target.value })
                  }
                />
              </label>
              <label className="text-xs font-medium text-muted">
                Qty (t)
                <input
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm font-medium"
                  value={draft.qty}
                  onChange={(e) =>
                    setDraft({ ...draft, qty: e.target.value })
                  }
                />
              </label>
              <label className="text-xs font-medium text-muted">
                Rate ₹
                <input
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm font-medium"
                  value={draft.rate}
                  onChange={(e) =>
                    setDraft({ ...draft, rate: e.target.value })
                  }
                />
              </label>
              <label className="text-xs font-medium text-muted">
                Date
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm font-medium"
                  value={draft.date}
                  onChange={(e) =>
                    setDraft({ ...draft, date: e.target.value })
                  }
                />
              </label>
              <div className="md:col-span-5">
                <Button type="submit">Save purchase</Button>
              </div>
            </form>
            </DeskGate>
          </Panel>
        </div>
      ) : null}

      {tab === "in" ? (
        <div className="grid gap-3">
          <Panel>
            <p className="font-semibold">
              Live location of trucks is on Trucks — hover a vehicle for driver
              and timings.
            </p>
            <Link href="/feedstock" className="mt-2 inline-block text-sm font-bold text-teal">
              Open truck map →
            </Link>
          </Panel>
          {GRN_NOTES.map((g) => (
            <Panel
              key={g.id}
              className={g.mismatch ? "border-amber/40" : ""}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {g.item} · {g.supplier}
                  </p>
                  <p className="text-xs text-muted">
                    {g.id} against {g.poId} · lot {g.lot} · {g.date}
                  </p>
                </div>
                <StatusPill
                  status={g.mismatch ? "amber" : "green"}
                  label={
                    g.mismatch
                      ? `Short ${formatNumber(g.ordered - g.received, 1)}`
                      : "Matched"
                  }
                />
              </div>
              <PairBar left={g.ordered} right={g.received} unit=" t" />
              {g.mismatch ? (
                <p className="mt-3 text-sm text-amber">
                  Pay for {g.received} t only — not the {g.ordered} on the PO.
                </p>
              ) : null}
            </Panel>
          ))}
        </div>
      ) : null}

      {tab === "flow" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Today’s moves
            </p>
            <ol className="relative space-y-4 border-l border-line pl-4">
              {STOCK_MOVES.map((m) => (
                <li key={m.id}>
                  <span className="absolute -left-[5px] mt-1.5 size-2.5 rounded-full bg-teal" />
                  <p className="font-medium">
                    {m.item} · {m.qty}
                  </p>
                  <p className="text-sm text-muted">
                    {m.from} → {m.to}
                  </p>
                  <p className="text-xs text-muted">
                    Lot {m.lot} · {m.by} ·{" "}
                    {new Date(m.ts).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </li>
              ))}
            </ol>
          </Panel>
          <Panel>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Written off
            </p>
            <ul className="space-y-2">
              {WASTAGE.map((w) => (
                <li
                  key={w.id}
                  className="rounded-lg border border-danger/20 bg-danger-soft/40 px-3 py-3"
                >
                  <p className="font-medium">
                    {w.qty} {w.item}
                  </p>
                  <p className="text-sm">{w.reason}</p>
                  <p className="text-xs text-muted">
                    Lot {w.lot} · {w.date}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}

function PoCard({
  p,
}: {
  p: BookPurchase;
}) {
  return (
    <div className="rounded-lg border border-line bg-raised p-3">
      <p className="text-xs font-medium text-muted">{p.id}</p>
      <p className="font-medium">{p.item}</p>
      <p className="text-sm text-muted">{p.supplier}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">
        {p.qty} {p.unit} · {formatInr(p.qty * p.rate)}
      </p>
      <EnteredBy stamp={p.stamp} />
    </div>
  );
}
