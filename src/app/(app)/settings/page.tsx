"use client";

import { useState } from "react";
import Link from "next/link";
import { TEAM } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { TIERS } from "@/lib/tiers";
import { roleLabel } from "@/lib/format";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import { Settings } from "lucide-react";
import { AVATARS } from "@/lib/extras";
import { Photo } from "@/components/Photo";
import { findPerson } from "@/lib/people";

const PERMS = [
  { area: "Stock / PO / GRN", owner: "Full", store: "Full", prod: "—", sales: "—", acct: "—", hr: "—", emp: "—" },
  { area: "Making goods / QC", owner: "Full", store: "—", prod: "Full", sales: "—", acct: "—", hr: "—", emp: "—" },
  { area: "Sales & customer bills", owner: "Full", store: "—", prod: "—", sales: "Full", acct: "Full", hr: "—", emp: "—" },
  { area: "Pay suppliers", owner: "Full", store: "—", prod: "—", sales: "—", acct: "Full", hr: "—", emp: "—" },
  { area: "Staff / salary / leave", owner: "Full", store: "—", prod: "—", sales: "—", acct: "—", hr: "Full", emp: "Own" },
  { area: "Money snapshot / export", owner: "Full", store: "—", prod: "—", sales: "—", acct: "Full", hr: "—", emp: "—" },
  { area: "Approvals & users", owner: "Full", store: "—", prod: "—", sales: "—", acct: "—", hr: "—", emp: "—" },
  { area: "CBG / carbon (add-on later)", owner: "Full", store: "—", prod: "—", sales: "—", acct: "—", hr: "—", emp: "—" },
] as const;

export default function SettingsPage() {
  const { activePlant, user } = useAuth();
  const [mail, setMail] = useState({ late: true, stock: true, leave: false });
  const canBill =
    user?.role === "plant_owner" || user?.role === "super_admin";
  const plan = TIERS.find((t) => t.id === (user?.tier ?? 3))!;

  return (
    <div>
      <PageHeader
        color="teal"
        title="Team and bill"
        description="Who can open what, and the Urja price."
      />

      <SimpleGuide
        icon={Settings}
        plain="Only you add staff. Open What it costs if you want to see ₹20,000 vs ₹75,000 vs ₹90,000. Table below = who can open what."
        like="Office desk for people and money"
      />

      <Decide
        cue="Your seat"
        analysis={
          canBill
            ? `You are ${roleLabel(user?.role ?? "plant_owner")}. Plan is ${plan.name}. Only you change who can open what.`
            : `You are ${roleLabel(user?.role ?? "employee")}. You cannot change the bill. Ask the owner.`
        }
        decision={
          canBill
            ? "Open What it costs, or leave the seats as they are."
            : "Use your desk. Do not hunt other people’s pages."
        }
      >
        {canBill ? (
          <Link href="/pricing">
            <Button variant="gold">What it costs</Button>
          </Link>
        ) : (
          <Link href="/dashboard">
            <Button variant="gold">Back to my desk</Button>
          </Link>
        )}
      </Decide>

      <Panel className="mb-4 overflow-x-auto">
        <h2 className="mb-1 font-display text-lg font-bold">Who sees what</h2>
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-wide text-muted">
            <tr className="border-b border-line">
              <th className="pb-2 font-bold">Area</th>
              <th className="pb-2 font-bold">Owner</th>
              <th className="pb-2 font-bold">Store</th>
              <th className="pb-2 font-bold">Prod</th>
              <th className="pb-2 font-bold">Sales</th>
              <th className="pb-2 font-bold">Accounts</th>
              <th className="pb-2 font-bold">HR</th>
              <th className="pb-2 font-bold">Self</th>
            </tr>
          </thead>
          <tbody>
            {PERMS.map((p) => (
              <tr key={p.area} className="border-b border-line/70">
                <td className="py-2.5 font-medium">{p.area}</td>
                {(["owner", "store", "prod", "sales", "acct", "hr", "emp"] as const).map(
                  (k) => (
                    <td key={k} className="py-2.5">
                      <Cell label={p[k]} />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Team</h2>
            <Link href="/workforce">
              <Button variant="secondary" className="text-xs">
                Hire on Staff
              </Button>
            </Link>
          </div>
          <ul className="space-y-2">
            {TEAM.map((m) => (
              <li
                key={m.email}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  {AVATARS[m.id] ? (
                    <Photo
                      src={AVATARS[m.id]}
                      alt={m.name}
                      className="size-10 rounded-full"
                    />
                  ) : null}
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-muted">
                      {m.email} · {roleLabel(m.role)}
                    </p>
                    <Link
                      href={findPerson(m.id) ? `/people/${findPerson(m.id)!.id}` : "/me"}
                      className="text-xs font-semibold text-teal"
                    >
                      Open card
                    </Link>
                  </div>
                </div>
                <StatusPill status="green" label={m.status} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <h2 className="font-display text-lg font-bold">Plant basics</h2>
          {activePlant ? (
            <dl className="mt-3 space-y-3 text-sm">
              {[
                ["Size", `${activePlant.capacityTpd} TPD`],
                ["Carbon path", activePlant.methodology],
                ["Tanks", String(activePlant.digesterCount)],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b border-line pb-2"
                >
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Panel>

        {canBill ? (
          <Panel className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">Your plan</h2>
                <p className="mt-1 text-base font-bold text-teal">
                  {plan.short} · {plan.name}
                </p>
                <p className="mt-2 font-display text-4xl font-bold text-gold">
                  {plan.monthlyDisplay}
                  <span className="text-base font-semibold text-muted">
                    {" "}
                    / month
                  </span>
                </p>
                <p className="mt-2 max-w-xl text-sm text-muted">{plan.why}</p>
              </div>
              <Link href="/pricing">
                <Button variant="gold">Change plan</Button>
              </Link>
            </div>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              {["Aug 2026", "Jul 2026", "Jun 2026"].map((m) => (
                <li
                  key={m}
                  className="flex justify-between rounded-xl border border-line bg-raised/80 px-3 py-2"
                >
                  <span>{m}</span>
                  <span className="font-semibold text-ok">Paid</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Setup fees and sensor kit are one-time — see Plans. Optional 5–10%
              carbon success fee is a Tier 3 add-on.
            </p>
          </Panel>
        ) : (
          <Panel>
            <h2 className="font-display text-lg font-bold">Your bill</h2>
            <p className="mt-2 text-sm text-muted">
              Only owners see the bill — keeps staff screens simple.
            </p>
          </Panel>
        )}
      </div>

      <Panel className="mt-4">
        <h2 className="text-lg font-semibold">Email reminders</h2>
        <p className="mt-1 text-sm text-muted">
          Urja sends a simple mail the morning of. Switch off if you hate mail.
        </p>
        <ul className="mt-3 space-y-2">
          {(
            [
              ["late", "Late customer bills"],
              ["stock", "Stock that can stop the line"],
              ["leave", "Leave waiting for your yes"],
            ] as const
          ).map(([k, label]) => (
            <li key={k}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={mail[k]}
                  onChange={(e) =>
                    setMail({ ...mail, [k]: e.target.checked })
                  }
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Cell({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-bold",
        label === "Full" && "bg-ok-soft text-ok",
        (label === "View" || label === "Own") && "bg-teal-soft text-teal",
        label === "—" && "bg-surface text-muted",
      )}
    >
      {label}
    </span>
  );
}
