"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CARBON } from "@/lib/data";
import { creditStatusLabel, formatInr, formatNumber } from "@/lib/format";
import {
  Button,
  ChartBox,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import type { CreditStatus } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Wallet } from "lucide-react";

const STAGES: { id: CreditStatus; hint: string }[] = [
  { id: "draft", hint: "Still counting" },
  { id: "submitted", hint: "Sent for check" },
  { id: "under_verification", hint: "Auditor checking" },
  { id: "issued", hint: "Credits ready" },
  { id: "sold", hint: "Money in hand" },
];

export default function CarbonPage() {
  const valueLow = CARBON.capturedTco2e * 720;
  const valueHigh = CARBON.capturedTco2e * 980;
  const mid = CARBON.capturedTco2e * CARBON.cccPriceInr;
  const chart = [
    { name: "No plant", value: CARBON.baselineTco2e },
    { name: "This plant", value: CARBON.capturedTco2e },
  ];
  const activeIdx = STAGES.findIndex((s) => s.id === CARBON.status);

  return (
    <div>
      <PageHeader
        color="gold"
        title="Climate money"
        description="How much climate benefit you captured, what it is worth in ₹, and where it sits in the credit journey."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/reports">
              <Button variant="gold">Make auditor paper</Button>
            </Link>
            <Link href="/evidence">
              <Button variant="secondary">Open proof locker</Button>
            </Link>
          </div>
        }
      />

      <SimpleGuide
        icon={Wallet}
        plain="Think of carbon credits like a bank balance that grows when your plant captures methane."
        like="Passbook for climate money"
      />

      <Decide
        cue="Where the paper sits"
        analysis={`About ${formatInr(mid, true)} is sitting as credits. Status: ${creditStatusLabel(CARBON.status)}. This is not cash until issued and sold.`}
        decision="Push the auditor pack, or wait — this money does not pay today’s diesel."
      >
        <Link href="/reports">
          <Button variant="gold">Make auditor paper</Button>
        </Link>
        <Link href="/evidence">
          <Button variant="secondary">Open proof</Button>
        </Link>
      </Decide>

      <Panel className="mb-4">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Carbon balance · this period
            </p>
            <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight">
              {formatNumber(CARBON.capturedTco2e, 0)}
              <span className="ml-2 text-lg font-medium text-muted">
                tonnes saved
              </span>
            </p>
            <p className="mt-4 text-3xl font-semibold tabular-nums tracking-tight text-ink md:text-4xl">
              {formatInr(mid, true)}
            </p>
            <p className="mt-2 text-sm text-muted">
              Mid price @ {formatInr(CARBON.cccPriceInr)}/t · band{" "}
              {formatInr(valueLow, true)} – {formatInr(valueHigh, true)}
            </p>
          </div>
          <div className="rounded-2xl border border-line/70 bg-raised/85 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              Money journey
            </p>
            <ol className="mt-3 space-y-2.5">
              {STAGES.map((s, i) => (
                <li key={s.id} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      i < activeIdx && "bg-ok text-white",
                      i === activeIdx && "bg-teal text-white ring-4 ring-teal/20",
                      i > activeIdx && "bg-surface text-muted",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span
                      className={cn(
                        "block text-sm",
                        i === activeIdx ? "font-bold" : "font-medium text-muted",
                      )}
                    >
                      {creditStatusLabel(s.id)}
                    </span>
                    <span className="text-xs text-muted">{s.hint}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Panel>

      <Panel className="animate-rise-delay-1">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold">
              Why buyers pay you
            </h2>
            <p className="text-sm text-muted">
              Without plant vs with your plant — the gap is your carbon money
            </p>
          </div>
          <StatusPill status="neutral" label="Without plant vs with plant" />
        </div>
        <ChartBox>
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart
              data={chart}
              layout="vertical"
              margin={{ top: 8, right: 36, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke="#bdd0c4" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickMargin={6} />
              <YAxis
                type="category"
                dataKey="name"
                width={72}
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip />
              <Bar
                dataKey="value"
                name="tCO₂e"
                fill="#0a5244"
                radius={[0, 10, 10, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </Panel>
    </div>
  );
}
