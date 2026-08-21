"use client";

import { GAS_DISPATCH, GAS_PRODUCTION } from "@/lib/data";
import { PURIFICATION } from "@/lib/product-data";
import { formatInr, formatNumber } from "@/lib/format";
import {
  Button,
  Decide,
  FlowStrip,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import { Flame } from "lucide-react";
import Link from "next/link";

export default function GasPage() {
  return (
    <div>
      <PageHeader
        color="teal"
        title="Gas in → clean gas sold"
        description="Raw biogas in, clean CBG out. See purification efficiency (CH₄ kept) and where gas went — cylinders, truck, or pipe."
      />

      <SimpleGuide
        icon={Flame}
        plain="Dirty gas becomes saleable CBG here. If recovery is low, you are throwing money away."
        like="Filter machine scorecard"
      />

      <Decide
        cue="Money on the floor"
        analysis={`Clean-up kept ${formatNumber(PURIFICATION.ch4RecoveryPct, 1)}% of methane. Target is ${formatNumber(PURIFICATION.targetRecoveryPct, 0)}%. Lost today is about ${formatInr(PURIFICATION.lostInrToday)}.`}
        decision="Fix the filter if this keeps happening, or accept the leak for today."
      >
        <Link href="/alerts">
          <Button variant="gold">See the warning</Button>
        </Link>
        <Link href="/yield">
          <Button variant="secondary">Change the mix</Button>
        </Link>
      </Decide>

      <Panel className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          CH₄ recovery
        </p>
        <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight text-ink">
          {formatNumber(PURIFICATION.ch4RecoveryPct, 1)}%
        </p>
        <p className="mt-2 text-base text-muted">
          Target {formatNumber(PURIFICATION.targetRecoveryPct, 0)}%. Lost today ~{" "}
          {formatNumber(PURIFICATION.lostCh4M3, 0)} m³ CH₄ ≈{" "}
          <span className="font-bold text-amber">
            {formatInr(PURIFICATION.lostInrToday)}
          </span>
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-raised">
          <div
            className="h-full rounded-full bg-teal"
            style={{ width: `${PURIFICATION.ch4RecoveryPct}%` }}
          />
        </div>
      </Panel>

      <Panel className="mb-4">
        <p className="mb-3 text-base font-bold text-muted">
          Today’s path: raw → clean → sold
        </p>
        <FlowStrip
          steps={[
            {
              label: "1 · Raw biogas",
              value: `${formatNumber(PURIFICATION.rawBiogasM3Today, 0)} m³`,
            },
            {
              label: "2 · Clean CBG",
              value: `${formatNumber(PURIFICATION.cbgOutKg, 0)} kg`,
              tone: "teal",
            },
            {
              label: "3 · CH₄ in raw",
              value: `${formatNumber(PURIFICATION.ch4InRawPct, 1)}%`,
              tone: "gold",
            },
          ]}
        />
      </Panel>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Panel className="border-l-4 border-l-teal">
          <p className="text-sm font-bold text-muted">Cylinders filled</p>
          <p className="font-display text-3xl font-bold">
            {PURIFICATION.cylindersFilled}
          </p>
        </Panel>
        <Panel className="border-l-4 border-l-gold">
          <p className="text-sm font-bold text-muted">Truck dispatch</p>
          <p className="font-display text-3xl font-bold">
            {formatNumber(PURIFICATION.truckKg, 0)} kg
          </p>
        </Panel>
        <Panel className="border-l-4 border-l-ok">
          <p className="text-sm font-bold text-muted">Pipeline injection</p>
          <p className="font-display text-3xl font-bold text-ok">
            {formatNumber(PURIFICATION.pipelineKg, 0)} kg
          </p>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="overflow-x-auto">
          <h2 className="mb-3 font-display text-lg font-bold">
            Cleaning cycles
          </h2>
          <table className="w-full min-w-[400px] text-left text-base">
            <thead className="text-sm text-muted">
              <tr className="border-b-2 border-line">
                <th className="pb-2 font-bold">Cycle</th>
                <th className="pb-2 font-bold">Raw</th>
                <th className="pb-2 font-bold">Clean CBG</th>
              </tr>
            </thead>
            <tbody>
              {GAS_PRODUCTION.map((g) => (
                <tr key={g.id} className="border-b border-line/70">
                  <td className="py-3 font-bold">{g.cycleId}</td>
                  <td className="py-3">{formatNumber(g.rawBiogasM3, 0)} m³</td>
                  <td className="py-3 font-bold text-teal">
                    {formatNumber(g.purifiedCbgKg, 0)} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel className="overflow-x-auto">
          <h2 className="mb-3 font-display text-lg font-bold">Where it went</h2>
          <table className="w-full min-w-[400px] text-left text-base">
            <thead className="text-sm text-muted">
              <tr className="border-b-2 border-line">
                <th className="pb-2 font-bold">ID</th>
                <th className="pb-2 font-bold">Amount</th>
                <th className="pb-2 font-bold">Path</th>
              </tr>
            </thead>
            <tbody>
              {GAS_DISPATCH.map((d) => (
                <tr key={d.id} className="border-b border-line/70">
                  <td className="py-3">
                    <p className="font-bold">{d.id}</p>
                    <p className="text-sm text-muted">{d.destination}</p>
                  </td>
                  <td className="py-3 font-bold">
                    {formatNumber(d.volumeKg, 0)} kg
                  </td>
                  <td className="py-3">
                    <p className="capitalize font-semibold">{d.mode}</p>
                    <StatusPill
                      status="neutral"
                      label={
                        d.destinationType === "cgd_network"
                          ? "Pipe / CGD"
                          : "Pump / retail"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
