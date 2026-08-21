"use client";

import { useState } from "react";
import {
  FOM_SALES,
  FOM_SUMMARY,
} from "@/lib/product-data";
import { formatInr, formatNumber } from "@/lib/format";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import { Leaf } from "lucide-react";
import { useBook } from "@/lib/book-store";
import { usePrefs } from "@/lib/prefs";
import { DeskGate, EnteredBy, Field, FormCard, inputClass, LineNotice } from "@/components/book-ui";
import { WATCH } from "@/lib/plant-flow";

export default function FertilizerPage() {
  const { t } = usePrefs();
  const { fom, addFom, can, calls, recordCall } = useBook();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ bags: 200, grade: "Grade A" });

  return (
    <div>
      <PageHeader
        color="ok"
        title="Fertilizer bags (FOM)"
        description="Bags exist only when the floor writes them here."
        actions={
          <Button onClick={() => setOpen((v) => !v)}>Log new FOM batch</Button>
        }
      />

      <LineNotice watch={WATCH.fom} />

      {open ? (
        <DeskGate action="log_fom">
          <FormCard
            title="Log FOM bags"
            submit="Save batch"
            onSubmit={() => {
              if (!can("log_fom")) return;
              addFom(draft);
              setOpen(false);
            }}
          >
            <Field label="Bags">
              <input
                type="number"
                className={inputClass}
                value={draft.bags}
                onChange={(e) =>
                  setDraft({ ...draft, bags: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Grade">
              <select
                className={inputClass}
                value={draft.grade}
                onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
              >
                <option>Grade A</option>
                <option>Grade B</option>
              </select>
            </Field>
          </FormCard>
        </DeskGate>
      ) : null}

      <Decide
        cue="Second cash"
        analysis={`${FOM_SUMMARY.bagsInStock} bags sit in the yard. A buyer still owes ${formatInr(FOM_SUMMARY.pendingInr)}.`}
        decision="Chase that unpaid lot, or log a new batch if bags are ready."
      >
        <Button
          variant="gold"
          disabled={!can("mark_call")}
          onClick={() =>
            recordCall(
              "chase-fom-savitri",
              "Chased Savitri SHG for unpaid FOM ₹10,800",
              "FOM",
            )
          }
        >
          {calls["chase-fom-savitri"] ? t("fom.chased") : t("fom.chase")}
        </Button>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Log new bags
        </Button>
      </Decide>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Panel className="border-l-4 border-l-ok">
          <p className="text-sm font-bold text-muted">Bags in stock</p>
          <p className="font-display text-3xl font-bold text-ok">
            {FOM_SUMMARY.bagsInStock}
          </p>
        </Panel>
        <Panel className="border-l-4 border-l-gold">
          <p className="text-sm font-bold text-muted">FOM sales this month</p>
          <p className="font-display text-3xl font-bold text-gold">
            {formatInr(FOM_SUMMARY.monthSalesInr, true)}
          </p>
        </Panel>
        <Panel className="border-l-4 border-l-amber">
          <p className="text-sm font-bold text-muted">Buyer payment pending</p>
          <p className="font-display text-3xl font-bold text-amber">
            {formatInr(FOM_SUMMARY.pendingInr)}
          </p>
        </Panel>
      </div>

      <Panel className="mb-4 overflow-x-auto">
        <h2 className="mb-1 font-display text-xl font-bold">
          Separation → dry → bag
        </h2>
        <p className="mb-3 text-base text-muted">
          Solid out, liquid out, then bagged Fermented Organic Manure
        </p>
        <table className="w-full min-w-[640px] text-left text-base">
          <thead className="text-sm text-muted">
            <tr className="border-b-2 border-line">
              <th className="pb-2 font-bold">Batch</th>
              <th className="pb-2 font-bold">Solid</th>
              <th className="pb-2 font-bold">Liquid</th>
              <th className="pb-2 font-bold">Bags</th>
              <th className="pb-2 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {fom.map((b) => (
              <tr key={b.id} className="border-b border-line/70">
                <td className="py-3">
                  <p className="font-bold">{b.id}</p>
                  <p className="text-sm text-muted">
                    {b.date} · {b.grade}
                  </p>
                  <EnteredBy stamp={b.stamp} />
                </td>
                <td className="py-3 font-semibold">
                  {formatNumber(b.solidT)} t
                </td>
                <td className="py-3">{formatNumber(b.liquidKl)} kL</td>
                <td className="py-3 font-bold">{b.bags}</td>
                <td className="py-3">
                  <StatusPill
                    status={
                      b.status === "sold"
                        ? "green"
                        : b.status === "bagged"
                          ? "neutral"
                          : "amber"
                    }
                    label={b.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel className="overflow-x-auto">
        <h2 className="mb-3 font-display text-xl font-bold">
          Sold back to farmers
        </h2>
        <table className="w-full min-w-[560px] text-left text-base">
          <thead className="text-sm text-muted">
            <tr className="border-b-2 border-line">
              <th className="pb-2 font-bold">Sale</th>
              <th className="pb-2 font-bold">Buyer</th>
              <th className="pb-2 font-bold">Bags</th>
              <th className="pb-2 font-bold">Amount</th>
              <th className="pb-2 font-bold">Paid?</th>
            </tr>
          </thead>
          <tbody>
            {FOM_SALES.map((s) => (
              <tr key={s.id} className="border-b border-line/70">
                <td className="py-3 font-bold">{s.id}</td>
                <td className="py-3">
                  <p className="font-semibold">{s.buyer}</p>
                  <p className="text-sm text-muted">{s.village}</p>
                </td>
                <td className="py-3">
                  {s.bags} · ₹{s.rateInr}/bag
                </td>
                <td className="py-3 font-bold text-gold">
                  {formatInr(s.amountInr)}
                </td>
                <td className="py-3">
                  <StatusPill
                    status={s.paid ? "green" : "amber"}
                    label={s.paid ? "Paid" : "Pending"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-muted">
          Month solid out: {formatNumber(FOM_SUMMARY.solidOutTMonth)} t slurry
          solids processed
        </p>
      </Panel>
    </div>
  );
}
