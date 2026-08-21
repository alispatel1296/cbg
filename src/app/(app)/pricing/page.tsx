"use client";

import Link from "next/link";
import { REVENUE_SHARE, SETUP_FEES, TIERS } from "@/lib/tiers";
import { useAuth } from "@/lib/auth";
import type { TierId } from "@/lib/types";
import { formatInr } from "@/lib/format";
import {
  DAYS_STOPPED_EQUALS_FEE,
  DAYS_TO_EARN_FEE_FROM_CH4,
  MONTHS_OF_URJA_PER_CRASH,
  STOPPED_DAY_INR,
  URJA_PRICE_INR,
} from "@/lib/money-story";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/ui";
import { cn } from "@/lib/cn";

export default function PricingPage() {
  const { user, setTier } = useAuth();
  const current = user?.tier ?? 2;

  return (
    <div>
      <PageHeader
        color="gold"
        title={`${formatInr(URJA_PRICE_INR)} a month`}
        description="One number for the full plant. If the holes on your ground are smaller than this, do not pay."
      />

      <Decide
        cue="Stay or change"
        analysis={`Full plant is ${formatInr(URJA_PRICE_INR)}/month. One stopped day is about ${formatInr(STOPPED_DAY_INR)}. You are on plan ${current}.`}
        decision="Keep Full plant if the holes are bigger than the fee. Do not buy carbon papers until T2 is earning."
      >
        <Button variant="gold" onClick={() => setTier(2)}>
          Keep Full plant
        </Button>
        <Button variant="secondary" onClick={() => setTier(1)}>
          Drop to factory only
        </Button>
      </Decide>

      <Panel className="mb-4 border-l-4 border-l-gold">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Why a tight owner still pays this
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            Plant stops {DAYS_STOPPED_EQUALS_FEE} days → already{" "}
            {formatInr(STOPPED_DAY_INR)} × {DAYS_STOPPED_EQUALS_FEE} = the fee.
          </li>
          <li>
            Gas cleaner waste alone → fee comes back in{" "}
            {DAYS_TO_EARN_FEE_FROM_CH4} days.
          </li>
          <li>
            One sour tank → {MONTHS_OF_URJA_PER_CRASH} months of Urja, paid by
            that one crash.
          </li>
        </ul>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        {TIERS.map((t) => {
          const active = current === t.id;
          const hero = t.id === 2;
          return (
            <Panel
              key={t.id}
              className={cn(
                "flex flex-col",
                hero && "border-2 border-gold",
                active && "ring-2 ring-teal/20",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <StatusPill
                  status={hero ? "amber" : t.id === 3 ? "green" : "neutral"}
                  label={hero ? "Pay this" : t.short}
                />
                {active ? (
                  <StatusPill status="green" label="On now" />
                ) : null}
              </div>
              <h2 className="mt-3 text-xl font-semibold">{t.name}</h2>
              <p className="mt-1 text-sm text-muted">{t.tagline}</p>
              <p className="mt-4 text-3xl font-semibold tabular-nums text-gold">
                {t.monthlyDisplay}
              </p>
              <p className="text-sm text-muted">every month</p>
              <p className="mt-3 text-sm">{t.why}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-ok">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-5 w-full"
                variant={hero && !active ? "gold" : active ? "secondary" : "primary"}
                onClick={() => setTier(t.id as TierId)}
              >
                {active ? "This is on" : `See ${t.name}`}
              </Button>
            </Panel>
          );
        })}
      </div>

      <Panel className="mt-4">
        <h2 className="text-lg font-semibold">Extra — only if you choose it</h2>
        <p className="mt-1 text-sm text-muted">
          Monthly fee is the fee. These are not hidden in it. Say no if you want.
        </p>
        <ul className="mt-3 space-y-3">
          {SETUP_FEES.map((s) => (
            <li
              key={s.item}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 last:border-0"
            >
              <div>
                <p className="font-medium">{s.item}</p>
                <p className="text-sm text-muted">{s.note}</p>
              </div>
              <p className="text-lg font-semibold tabular-nums text-gold">
                {s.price}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="mt-4">
        <p className="font-medium">{REVENUE_SHARE.label}</p>
        <p className="mt-1 text-sm text-muted">{REVENUE_SHARE.note}</p>
      </Panel>

      <p className="mt-4 text-center text-sm text-muted">
        Still not sure?{" "}
        <Link href="/dashboard" className="font-medium text-teal">
          Go back to Today and count the holes
        </Link>
        .
      </p>
    </div>
  );
}
