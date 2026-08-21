"use client";

import Link from "next/link";
import { CO_BENEFITS, PORTFOLIO } from "@/lib/gap-data";
import { useAuth } from "@/lib/auth";
import { formatInr, formatNumber } from "@/lib/format";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { Building2 } from "lucide-react";

export default function PortfolioPage() {
  const { setActivePlantId, plants } = useAuth();
  const bestYield = Math.max(...PORTFOLIO.map((p) => p.yieldM3t));

  return (
    <div>
      <PageHeader
        color="teal"
        title="All my plants"
        description="Compare every site side by side — which one is strong, which one needs help."
      />

      <SimpleGuide
        icon={Building2}
        plain="If you own more than one plant, start here. Spot the weak site fast."
        like="Scoreboard for all your plants"
      />

      <Decide
        cue="Weak site"
        analysis={`${[...PORTFOLIO].sort((a, b) => a.health - b.health)[0].name} is the weak one (health ${[...PORTFOLIO].sort((a, b) => a.health - b.health)[0].health}). Spend time there, not on the healthy plant.`}
        decision="Open that plant now, or keep looking at Nashik."
      >
        <Button
          variant="gold"
          onClick={() =>
            setActivePlantId(
              [...PORTFOLIO].sort((a, b) => a.health - b.health)[0].plantId,
            )
          }
        >
          Open weak plant
        </Button>
        <Button variant="secondary" onClick={() => setActivePlantId("plant-nashik")}>
          Stay on Nashik
        </Button>
      </Decide>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="animate-rise">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Waste used
          </p>
          <p className="font-display text-2xl font-bold">
            {formatNumber(CO_BENEFITS.wasteDivertedT, 0)} t
          </p>
        </Panel>
        <Panel className="animate-rise-delay-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Farmer pay this year
          </p>
          <p className="font-display text-2xl font-bold text-gold">
            {formatInr(CO_BENEFITS.farmerPaymentsInr, true)}
          </p>
        </Panel>
        <Panel className="animate-rise-delay-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Jobs supported
          </p>
          <p className="font-display text-2xl font-bold">
            {CO_BENEFITS.jobsSupported}
          </p>
        </Panel>
        <Panel className="animate-rise-delay-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Good impact tags
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {CO_BENEFITS.sdgTags.map((t) => (
              <StatusPill key={t} status="neutral" label={t} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {PORTFOLIO.map((p, i) => {
          const plant = plants.find((x) => x.id === p.plantId);
          const isBest = p.yieldM3t === bestYield;
          return (
            <Panel
              key={p.plantId}
              className={cn(
                "animate-rise",
                i === 1 && "animate-rise-delay-1",
                isBest && "border-teal/40 ring-2 ring-teal/15",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-xl font-bold">{p.name}</p>
                  {isBest ? (
                    <StatusPill status="green" label="Best gas" />
                  ) : (
                    <StatusPill status="amber" label="Can improve" />
                  )}
                </div>
                <p className="font-display text-3xl font-bold text-teal">
                  {p.health}
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted">
                    Gas per tonne
                  </p>
                  <p className="font-bold tabular-nums">
                    {formatNumber(p.yieldM3t, 1)} m³/t
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted">
                    Price score
                  </p>
                  <p className="font-bold tabular-nums">
                    {formatNumber(p.ci, 1)} g/MJ
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted">
                    Carbon tonnes
                  </p>
                  <p className="font-bold tabular-nums">
                    {formatNumber(p.creditsT, 0)} t
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted">
                    Uptime
                  </p>
                  <p className="font-bold tabular-nums">
                    {formatNumber(p.uptime, 1)}%
                  </p>
                </div>
              </div>
              {plant ? (
                <Link
                  href="/dashboard"
                  onClick={() => setActivePlantId(p.plantId)}
                  className="mt-4 inline-block text-sm font-bold text-teal"
                >
                  Open this plant →
                </Link>
              ) : null}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
