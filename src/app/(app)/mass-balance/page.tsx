"use client";

import { MASS_BALANCE } from "@/lib/gap-data";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { Scale } from "lucide-react";

export default function MassBalancePage() {
  return (
    <div>
      <PageHeader
        color="teal"
        title="In vs Out"
        description="Did the dung that went in match the gas that came out? Auditors check this."
      />

      <SimpleGuide
        icon={Scale}
        plain="Like a shop balance: what went in should match what came out (within a small gap)."
        like="Weighing scale for the whole plant"
      />

      <Decide
        cue="Balance"
        analysis={`Gap is ${formatNumber(MASS_BALANCE.imbalancePct, 1)}% (ok under 3%). If this jumps, dung or gas is leaking off the books.`}
        decision="Keep running, or send lab if you do not trust the number."
      >
        <Button variant="gold">Keep running</Button>
        <Button variant="secondary">Send lab</Button>
      </Decide>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Panel className="animate-rise border-l-4 border-l-teal">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Period
          </p>
          <p className="mt-1 font-display text-xl font-bold">
            {MASS_BALANCE.period}
          </p>
        </Panel>
        <Panel className="animate-rise-delay-1 border-l-4 border-l-ok">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Gap
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-ok">
            {formatNumber(MASS_BALANCE.imbalancePct, 1)}%
          </p>
          <StatusPill status="green" label="OK (under 3%)" />
        </Panel>
        <Panel className="animate-rise-delay-2 border-l-4 border-l-gold">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Why it matters
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Clean In vs Out means auditors finish faster — and your carbon money
            comes sooner.
          </p>
        </Panel>
      </div>

      <Panel className="animate-rise mb-4">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          Plant flow
        </p>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
          {MASS_BALANCE.nodes.map((n, i) => (
            <div key={n.id} className="flex flex-1 items-stretch gap-2">
              <div className="flex-1 rounded-xl border border-line bg-surface px-3 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                  {n.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-teal">
                  {n.value}
                </p>
              </div>
              {i < MASS_BALANCE.nodes.length - 1 ? (
                <div className="hidden items-center text-teal lg:flex">→</div>
              ) : null}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="animate-rise-delay-1 overflow-x-auto">
        <h2 className="mb-3 font-display text-lg font-bold">
          Day-by-day check
        </h2>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-wide text-muted">
            <tr className="border-b border-line">
              <th className="pb-2 font-bold">When</th>
              <th className="pb-2 font-bold">Step</th>
              <th className="pb-2 font-bold">In</th>
              <th className="pb-2 font-bold">Out</th>
              <th className="pb-2 font-bold">Gap</th>
            </tr>
          </thead>
          <tbody>
            {MASS_BALANCE.ledger.map((row) => (
              <tr key={row.ts + row.step} className="border-b border-line/70">
                <td className="py-3 text-xs text-muted">
                  {new Date(row.ts).toLocaleString("en-IN")}
                </td>
                <td className="py-3 font-semibold">{row.step}</td>
                <td className="py-3">{row.inQty}</td>
                <td className="py-3">{row.outQty}</td>
                <td className="py-3">
                  <StatusPill status="neutral" label={row.variance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
