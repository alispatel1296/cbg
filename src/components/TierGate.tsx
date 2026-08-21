"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { TIERS, canUsePath, tierForPath } from "@/lib/tiers";
import { Button, Panel } from "@/components/ui";

export function TierGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  const need = tierForPath(pathname);
  if (canUsePath(user.tier, pathname)) return <>{children}</>;

  const tier = TIERS.find((t) => t.id === need)!;
  const current = TIERS.find((t) => t.id === user.tier)!;

  return (
    <div className="mx-auto max-w-xl py-10">
      <Panel className="animate-rise border border-amber/40 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-amber-soft text-amber">
          <Lock className="size-8" />
        </div>
        <p className="text-sm font-medium uppercase tracking-wide text-amber">
          Extra — not in {current.monthlyDisplay}
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          {tier.name} · {tier.monthlyDisplay}
        </h1>
        <p className="mt-3 text-sm text-muted">
          You are on {current.name}. This page is only if you take that box.
        </p>
        <p className="mt-2 text-base font-semibold text-teal">{tier.why}</p>
        <ul className="mt-4 space-y-1 text-left text-base">
          {tier.features.slice(0, 4).map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-ok">✓</span> {f}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/pricing">
            <Button variant="gold">What extra costs</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary">Back to Today</Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">
          Tap a box to look. You do not pay to peek.
        </p>
      </Panel>
    </div>
  );
}
