"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DIGESTERS, sensorHistory } from "@/lib/data";
import { DIGESTER_CRASH_COST } from "@/lib/product-data";
import { formatInr, formatNumber } from "@/lib/format";
import {
  Button,
  ChartBox,
  Decide,
  EmptySlot,
  Metric,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
  ZoneBar,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { HeartPulse } from "lucide-react";
import { useBook } from "@/lib/book-store";
import { usePrefs } from "@/lib/prefs";
import { LineNotice } from "@/components/book-ui";
import { WATCH } from "@/lib/plant-flow";

export default function DigestersPage() {
  const { t } = usePrefs();
  const { calls, recordCall, can } = useBook();
  const [range, setRange] = useState<7 | 30 | 90>(7);
  const [focus, setFocus] = useState(DIGESTERS[0].digesterId);
  const history = useMemo(() => sensorHistory(range), [range]);
  const active = DIGESTERS.find((d) => d.digesterId === focus) ?? DIGESTERS[0];

  return (
    <div>
      <PageHeader
        color="teal"
        title="Tank health"
        description="Heat, sourness, and gas of each tank. Catch a sick tank before gas is lost."
        actions={
          <div className="flex rounded-xl border border-line bg-raised p-1">
            {([7, 30, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => setRange(d)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  range === d ? "bg-teal text-white" : "text-muted"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        }
      />

      <LineNotice watch={WATCH.tanks} />

      <SimpleGuide
        icon={HeartPulse}
        plain="One sick tank can stop gas for weeks. This page is your early warning."
        like="Hospital monitor for each digester"
      />

      <Decide
        cue="Tank call"
        analysis={
          DIGESTERS.find((d) => d.status !== "green")
            ? `${DIGESTERS.find((d) => d.status !== "green")?.name} is drifting — ${DIGESTERS.find((d) => d.status !== "green")?.anomaly ?? "watch pH"}. A crash can cost about ${formatInr(DIGESTER_CRASH_COST.estimatedLossInr, true)}.`
            : "All tanks are in the safe band."
        }
        decision="Slow the feed on the sick tank, send a lab sample, or wait and watch."
      >
        <Button
          variant="gold"
          onClick={() => {
            const sick = DIGESTERS.find((d) => d.status !== "green");
            if (sick) setFocus(sick.digesterId);
          }}
        >
          Open the sick tank
        </Button>
        <Button
          variant="secondary"
          disabled={!can("mark_call")}
          onClick={() =>
            recordCall("hold-feed-d2", "Extra feed held on D2", "Tanks")
          }
        >
          {calls["hold-feed-d2"] ? t("tank.held") : t("tank.hold")}
        </Button>
      </Decide>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {DIGESTERS.map((d) => (
          <button
            key={d.digesterId}
            onClick={() => setFocus(d.digesterId)}
            className={cn(
              "rounded-2xl border p-4 text-left transition",
              focus === d.digesterId
                ? "border-teal bg-teal text-white shadow-[0_12px_30px_rgba(10,82,68,0.28)]"
                : "border-line bg-raised/90 hover:border-teal/40",
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-bold">{d.name}</p>
              <StatusPill
                status={d.status}
                label={d.status === "green" ? "OK" : "Watch"}
              />
            </div>
            <p
              className={cn(
                "mt-3 font-display text-3xl font-bold tabular-nums",
                focus === d.digesterId ? "text-teal-deep" : "text-teal",
              )}
            >
              {formatNumber(d.ph, 1)}
              <span className="ml-1 text-sm font-semibold opacity-70">pH</span>
            </p>
            <p
              className={cn(
                "mt-1 text-xs",
                focus === d.digesterId ? "text-white/70" : "text-muted",
              )}
            >
              {formatNumber(d.gasYieldM3h, 1)} m³/h · CH₄{" "}
              {formatNumber(d.ch4Pct, 1)}%
            </p>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="animate-rise">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-display text-xl font-bold">{active.name} right now</p>
              <p className="text-sm text-muted">
                Needle shows today’s reading — green band is safe
              </p>
            </div>
            {active.anomaly ? (
              <StatusPill status="amber" label="Watch this" />
            ) : (
              <StatusPill status="green" label="Looking good" />
            )}
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                pH zone
              </p>
              <ZoneBar
                value={active.ph}
                min={6.2}
                max={7.6}
                unit=""
                zones={[
                  { from: 6.2, to: 6.7, tone: "danger" },
                  { from: 6.7, to: 6.9, tone: "amber" },
                  { from: 6.9, to: 7.4, tone: "ok" },
                  { from: 7.4, to: 7.6, tone: "amber" },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                Temperature °C
              </p>
              <ZoneBar
                value={active.temperatureC}
                min={30}
                max={42}
                unit="°C"
                zones={[
                  { from: 30, to: 33, tone: "amber" },
                  { from: 33, to: 38, tone: "ok" },
                  { from: 38, to: 42, tone: "danger" },
                ]}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                H₂S ppm
              </p>
              <ZoneBar
                value={active.h2sPpm}
                min={0}
                max={400}
                unit=" ppm"
                zones={[
                  { from: 0, to: 200, tone: "ok" },
                  { from: 200, to: 250, tone: "amber" },
                  { from: 250, to: 400, tone: "danger" },
                ]}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
            <Metric label="CH₄" value={`${formatNumber(active.ch4Pct, 1)}%`} tone="teal" />
            <Metric label="CO₂" value={`${formatNumber(active.co2Pct, 1)}%`} />
            <Metric
              label="Yield"
              value={`${formatNumber(active.gasYieldM3h, 1)}`}
              hint="m³/h"
            />
          </div>
        </Panel>

        <Panel className="animate-rise-delay-1 flex flex-col">
          <p className="font-display text-lg font-bold">What to do</p>
          {active.anomaly ? (
            <div className="mt-3 flex-1 rounded-xl border border-amber/30 bg-amber-soft/50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber">
                Problem spotted
              </p>
              <p className="mt-2 font-display text-xl font-bold leading-snug">
                {active.anomaly}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Try this: feed less acidic load for 24 hours, check again next
                shift, call owner if pH goes below 6.5.
              </p>
            </div>
          ) : (
            <div className="mt-3 flex-1">
              <EmptySlot
                title="Smart warnings coming later"
                description="Soon this box will tell you if a tank is going bad before you lose gas."
              />
            </div>
          )}
          <div className="mt-4 rounded-xl bg-teal-soft/50 px-3 py-3 text-xs leading-relaxed text-muted">
            Remember: green = fine, yellow = watch, red = fix now.
          </div>
        </Panel>
      </div>

      <Panel className="mt-4 animate-rise-delay-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold">Health over days</h2>
            <p className="text-sm text-muted">
              If a line goes down, that tank is getting weaker
            </p>
          </div>
          <Button variant="ghost" className="text-xs">
            Export CSV
          </Button>
        </div>
        <ChartBox>
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <LineChart
              data={history}
              margin={{ top: 28, right: 16, left: 4, bottom: 8 }}
            >
              <CartesianGrid stroke="#bdd0c4" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                tickMargin={8}
                height={28}
              />
              <YAxis
                domain={[6.2, 7.4]}
                width={36}
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <Tooltip />
              <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="d1Ph" name="D1" stroke="#0a5244" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="d2Ph" name="D2" stroke="#b86e00" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="d3Ph" name="D3" stroke="#177446" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </Panel>

      <Panel className="mt-4 animate-rise-delay-3">
        <h2 className="font-display text-xl font-bold">Which tank makes more gas?</h2>
        <p className="mt-1 text-sm text-muted">
          Higher line = healthier tank making more gas.
        </p>
        <div className="mt-4">
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <LineChart
                data={history}
                margin={{ top: 28, right: 16, left: 4, bottom: 8 }}
              >
                <CartesianGrid stroke="#bdd0c4" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  tickMargin={8}
                  height={28}
                />
                <YAxis width={40} tick={{ fontSize: 10 }} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="d1Yield" name="D1 m³/h" stroke="#0a5244" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="d2Yield" name="D2 m³/h" stroke="#b86e00" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="d3Yield" name="D3 m³/h" stroke="#c6e05a" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>
      </Panel>
    </div>
  );
}
