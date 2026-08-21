"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CI_SCORE } from "@/lib/gap-data";
import { formatInr, formatNumber } from "@/lib/format";
import {
  Button,
  ChartBox,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { TrendingUp } from "lucide-react";

export default function CiScorePage() {
  const delta = CI_SCORE.priorMonth - CI_SCORE.current;
  const chart = CI_SCORE.breakdown.map((b) => ({
    name:
      b.source === "Feedstock cultivation / collection"
        ? "Dung"
        : b.source === "Transport to plant"
          ? "Trucks"
          : b.source === "Plant process energy"
            ? "Power"
            : b.source === "Upgrading & compression"
              ? "Cleaning"
              : "Flare",
    full: b.source,
    share: b.share,
  }));

  return (
    <div>
      <PageHeader
        color="gold"
        title="Better price score"
        description="Better score = more ₹ for the same carbon. Lower number is better."
      />

      <SimpleGuide
        icon={TrendingUp}
        plain="This score decides how much buyers pay for your carbon. Improve it, earn more."
        like="Price tag for your carbon"
      />

      <Decide
        cue="Price lever"
        analysis={`Score is ${CI_SCORE.current} (want ${CI_SCORE.target}). Cutting village distance is the cheapest lever — extra carbon money ~ ${formatInr(CI_SCORE.estimatedExtraInr, true)}.`}
        decision="Tell collection to stay local, or leave the score as it is."
      >
        <Button variant="gold">Use local dung</Button>
        <Button variant="secondary">Leave score</Button>
      </Decide>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Your score right now
          </p>
          <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-ink">
            {formatNumber(CI_SCORE.current, 1)}
            <span className="ml-2 text-xl font-semibold text-muted">
              {CI_SCORE.unit}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusPill
              status="green"
              label={`↓ ${formatNumber(delta, 1)} vs last month`}
            />
            <StatusPill
              status="neutral"
              label={`Goal ${formatNumber(CI_SCORE.target, 1)}`}
            />
          </div>
          <p className="mt-4 text-sm text-muted">
            Extra money if score stays good:{" "}
            <span className="font-bold text-gold">
              {formatInr(CI_SCORE.estimatedExtraInr, true)}
            </span>{" "}
            (+{CI_SCORE.creditUpliftPct}%)
          </p>
        </Panel>

        <Panel className="animate-rise-delay-1">
          <h2 className="font-display text-lg font-bold">What makes the score</h2>
          <p className="mb-3 text-xs text-muted">
            Dung, trucking, power, burnt gas — bigger bar = more of the score
          </p>
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <BarChart
                data={chart}
                layout="vertical"
                margin={{ top: 8, right: 36, left: 8, bottom: 8 }}
              >
                <CartesianGrid stroke="#bdd0c4" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 10 }} unit="%" tickMargin={6} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={64}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Share"]}
                  labelFormatter={(_, p) => p?.[0]?.payload?.full ?? ""}
                />
                <Bar dataKey="share" name="% of CI" radius={[0, 8, 8, 0]}>
                  {chart.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? "#0a5244" : i === 4 ? "#b86e00" : "#177446"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Panel>
      </div>

      <Panel className="mt-4 animate-rise-delay-2">
        <h2 className="font-display text-lg font-bold">
          Ways to get a better score
        </h2>
        <p className="mb-4 text-sm text-muted">
          Change mix / power / burnt gas → score drops → more ₹
        </p>
        <ul className="space-y-2">
          {CI_SCORE.levers.map((l) => (
            <li
              key={l.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3"
            >
              <div>
                <p className="font-semibold">{l.name}</p>
                <p className="text-xs text-muted">Effort · {l.effort}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-ok">
                  {l.impact} CI
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-bold",
                    l.status === "available" && "bg-teal-soft text-teal",
                    l.status === "planned" && "bg-amber-soft text-amber",
                    l.status === "in_progress" && "bg-ok-soft text-ok",
                  )}
                >
                  {l.status.replace("_", " ")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
