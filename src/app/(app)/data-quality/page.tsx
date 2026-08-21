"use client";

import { DATA_QUALITY } from "@/lib/gap-data";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { SearchCheck } from "lucide-react";

export default function DataQualityPage() {
  return (
    <div>
      <PageHeader
        color="amber"
        title="Missing data?"
        description="Find gaps before the auditor does — missing hours or bad tickets can stop your carbon money."
      />

      <SimpleGuide
        icon={SearchCheck}
        plain="If photos, weights, or sensors are missing, fix it here first."
        like="Spell-check for plant truth"
      />

      <Decide
        cue="Gaps"
        analysis={`${DATA_QUALITY.gapsOpen} open gaps. Auditors stop carbon money for missing hours, not for a pretty dashboard.`}
        decision="Fill the oldest gap now, or wait and risk the paper."
      >
        <Button variant="gold">Fill oldest gap</Button>
        <Button variant="secondary">Wait</Button>
      </Decide>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Panel className="animate-rise sm:col-span-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Health score
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-teal sm:text-4xl">
            {DATA_QUALITY.integrityScore}
          </p>
        </Panel>
        <Panel className="animate-rise-delay-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Open gaps
          </p>
          <p className="mt-1 font-display text-3xl font-bold text-amber sm:text-4xl">
            {DATA_QUALITY.gapsOpen}
          </p>
        </Panel>
        <Panel className="animate-rise-delay-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Fill-ins used
          </p>
          <p className="mt-1 font-display text-4xl font-bold">
            {DATA_QUALITY.substitutionsUsed}
          </p>
        </Panel>
        <Panel className="animate-rise-delay-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Last check
          </p>
          <p className="mt-2 text-sm font-semibold">
            {new Date(DATA_QUALITY.lastScan).toLocaleString("en-IN")}
          </p>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel className="animate-rise space-y-3">
          <h2 className="font-display text-lg font-bold">Things to fix</h2>
          {DATA_QUALITY.issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-xl border border-line bg-surface px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill
                  status={
                    issue.severity === "critical"
                      ? "red"
                      : issue.severity === "warning"
                        ? "amber"
                        : "neutral"
                  }
                  label={issue.severity}
                />
                <StatusPill
                  status={issue.status === "open" ? "amber" : "green"}
                  label={issue.status}
                />
                <span className="text-xs font-bold text-muted">{issue.id}</span>
              </div>
              <p className="mt-2 font-semibold">{issue.stream}</p>
              <p className="text-sm text-muted">{issue.issue}</p>
              <p className="mt-2 text-xs font-medium text-teal">
                → {issue.action}
              </p>
            </div>
          ))}
        </Panel>

        <Panel className="animate-rise-delay-1">
          <h2 className="font-display text-lg font-bold">Streams working?</h2>
          <ul className="mt-3 space-y-3">
            {DATA_QUALITY.streams.map((s) => (
              <li key={s.name}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="tabular-nums font-bold">
                    {formatNumber(s.uptime, 1)}%
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-teal-soft">
                  <div
                    className={`h-full rounded-full ${
                      s.status === "green" ? "bg-ok" : "bg-amber"
                    }`}
                    style={{ width: `${s.uptime}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-teal-soft/50 px-3 py-2 text-xs text-muted">
            One bad month of missing data can stop your carbon money. Fix gaps
            early.
          </p>
        </Panel>
      </div>
    </div>
  );
}
