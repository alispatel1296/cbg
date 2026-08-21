"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ALERTS,
  CARBON,
  TODAY_SNAPSHOT,
} from "@/lib/data";
import {
  APPROVALS,
  INVOICES,
  PRODUCTION_ORDERS,
} from "@/lib/factory-ops";
import { INVENTORY, WORKFORCE } from "@/lib/tier1-data";
import { PURIFICATION } from "@/lib/product-data";
import { useAuth } from "@/lib/auth";
import { formatInr, formatNumber } from "@/lib/format";
import {
  DAYS_STOPPED_EQUALS_FEE,
  STOPPED_DAY_INR,
  URJA_PRICE_INR,
} from "@/lib/money-story";
import {
  ActionCard,
  Button,
  CashTile,
  Decide,
  FlowStrip,
  HealthRing,
  PageHeader,
  Panel,
} from "@/components/ui";
import { Photo } from "@/components/Photo";
import { PHOTOS } from "@/lib/extras";
import { LiveStrip } from "@/components/ops";
import { usePrefs } from "@/lib/prefs";
import { useBook } from "@/lib/book-store";
import { LineNotice } from "@/components/book-ui";
import { WATCH } from "@/lib/plant-flow";

const DESK_ROLES = [
  "store_staff",
  "production_staff",
  "sales_staff",
  "accountant",
  "hr_staff",
  "employee",
  "driver",
  "lab_staff",
  "plant_operator",
  "auditor",
] as const;

export default function DashboardPage() {
  const { activePlant, user } = useAuth();
  const { ticks } = useBook();
  const { t } = usePrefs();
  const firstName = user?.name.split(" ")[0] ?? "Boss";
  const isDesk = DESK_ROLES.includes(
    (user?.role ?? "") as (typeof DESK_ROLES)[number],
  );
  const showPlant = (user?.tier ?? 1) >= 2 && !isDesk;
  const showCarbon = (user?.tier ?? 1) >= 3 && !isDesk;

  const pendingTicks = APPROVALS.filter(
    (a) => (ticks[a.id] ?? a.status) === "pending",
  );
  const present = WORKFORCE.filter((w) => w.today === "present").length;
  const running = PRODUCTION_ORDERS.filter((o) => o.status === "in_progress").length;
  const dues = INVOICES.filter((i) => i.status !== "paid").reduce(
    (s, i) => s + (i.total - (i.paid ?? 0)),
    0,
  );
  const overdue = INVOICES.filter((i) => i.status === "overdue").reduce(
    (s, i) => s + (i.total - (i.paid ?? 0)),
    0,
  );
  const creditValue = CARBON.capturedTco2e * CARBON.cccPriceInr;
  const napier = INVENTORY.find((i) => i.id === "SKU-NAP");
  const napierDays = napier ? napier.onHand / napier.dailyUse : 0;

  const [order, setOrder] = useState(["stuck", "late", "gas", "ticks"]);
  const [drag, setDrag] = useState<string | null>(null);

  const tiles: Record<string, ReactNode> = {
    stuck: (
      <CashTile
        href="/sales"
        tone="gold"
        label="Your money, still with customers"
        value={formatInr(dues, true)}
        hint="Not in your bank yet · drag to move"
      />
    ),
    late: (
      <CashTile
        href="/sales"
        tone="danger"
        label="Late — call today"
        value={formatInr(overdue, true)}
        hint="Past the due date · drag to move"
      />
    ),
    gas: (
      <CashTile
        href="/gas"
        tone="amber"
        label="Gas wasted today"
        value={formatInr(PURIFICATION.lostInrToday)}
        hint={`In 30 days this is more than ${formatInr(URJA_PRICE_INR, true)}`}
      />
    ),
    ticks: (
      <CashTile
        href="/finance"
        tone="teal"
        label="Waiting for your yes"
        value={String(pendingTicks.length)}
        hint="Staff cannot spend till you tick"
      />
    ),
  };

  if (isDesk) {
    return <DeskHome name={firstName} role={user?.role ?? "employee"} />;
  }

  return (
    <div>
      <div className="relative mb-5 overflow-hidden rounded-xl">
        <Photo
          src={PHOTOS.plant}
          alt="Plant at dusk"
          className="h-44 w-full md:h-56"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <p className="absolute bottom-3 left-4 text-lg font-semibold text-white">
          Greenfield Nashik · live cameras later, photo now
        </p>
      </div>

      <PageHeader
        color="teal"
        title={`Namaste ${firstName}`}
        description="One call for today. The rest can wait."
      />

      <LineNotice watch={WATCH.owner} />

      <Decide
        cue="Today’s call"
        analysis={
          overdue > 0
            ? `${formatInr(overdue)} is late from customers. That is already your money.`
            : napier && napierDays < 2
              ? `${napier.name} will finish in about ${napierDays.toFixed(1)} days.`
              : pendingTicks[0]
                ? `Staff is waiting on “${pendingTicks[0].what}”.`
                : "No hole is on fire. Watch the plant."
        }
        decision={
          overdue > 0
            ? "Call to collect, or send another truck anyway."
            : napier && napierDays < 2
              ? "Order grass today, or accept a stop."
              : pendingTicks[0]
                ? "Tick yes, or hold the spend."
                : "Open tanks if you want a walk-round."
        }
      >
        {overdue > 0 ? (
          <Link href="/sales">
            <Button variant="gold">Who owes</Button>
          </Link>
        ) : napier && napierDays < 2 ? (
          <Link href="/inventory">
            <Button variant="gold">Order stock</Button>
          </Link>
        ) : pendingTicks[0] ? (
          <Link href="/finance">
                <Button variant="gold">Say yes</Button>
          </Link>
        ) : (
          <Link href="/digesters">
            <Button variant="gold">Tanks</Button>
          </Link>
        )}
        <Link href="/alerts">
          <Button variant="secondary">Warnings</Button>
        </Link>
      </Decide>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {t("goHere")}
      </p>
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {(
          [
            ["/sales", "sales"],
            ["/finance", "money"],
            ["/inventory", "stock"],
            ["/feedstock", "trucks"],
            ["/digesters", "tanks"],
            ["/fertilizer", "fom"],
            ["/compliance", "govtDates"],
          ] as const
        ).map(([href, key]) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-line bg-raised px-3 py-3 text-center text-sm font-semibold hover:border-teal hover:text-teal"
          >
            {t(key)}
          </Link>
        ))}
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        {order.map((id) => (
          <div
            key={id}
            draggable
            onDragStart={() => setDrag(id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (!drag || drag === id) return;
              setOrder((prev) => {
                const next = [...prev];
                const a = next.indexOf(drag);
                const b = next.indexOf(id);
                [next[a], next[b]] = [next[b], next[a]];
                return next;
              });
              setDrag(null);
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            {tiles[id]}
          </div>
        ))}
      </div>

      <div className="mb-4 space-y-3">
        {overdue > 0 ? (
          <ActionCard
            tone="danger"
            cue="Money sitting outside"
            title={`${formatInr(overdue)} is late from customers`}
            detail="This is your money. Call before the next truck leaves."
            action={
              <Link href="/sales">
                <Button variant="gold">Who owes</Button>
              </Link>
            }
          />
        ) : null}
        {napier && napierDays < 2 ? (
          <ActionCard
            tone="danger"
            cue="Line can stop"
            title={`${napier.name} — about ${napierDays.toFixed(1)} days left`}
            detail={`One stopped day of gas is ${formatInr(STOPPED_DAY_INR)}. That is most of a ${formatInr(URJA_PRICE_INR)} month.`}
            action={
              <Link href="/inventory">
                <Button variant="secondary">Order</Button>
              </Link>
            }
          />
        ) : null}
        {pendingTicks.map((a) => (
          <ActionCard
            key={a.id}
            tone="amber"
            cue="Needs your yes"
            title={a.what}
            detail="Staff cannot spend this until you tick."
            action={
              <Link href="/finance">
                <Button variant="secondary">Say yes</Button>
              </Link>
            }
          />
        ))}
        {ALERTS.filter((a) => !a.acknowledged).slice(0, 1).map((a) => (
          <ActionCard
            key={a.id}
            tone="amber"
            cue="Tank"
            title={a.title}
            detail={a.message}
            action={
              <Link href="/alerts">
                <Button variant="ghost">See</Button>
              </Link>
            }
          />
        ))}
      </div>

      <LiveStrip />

      {showPlant ? (
        <div className="grid gap-3 lg:grid-cols-[200px_1fr]">
          <Panel className="flex flex-col items-center text-center">
            {activePlant ? (
              <HealthRing
                score={activePlant.healthScore}
                status={activePlant.healthStatus}
                size={112}
              />
            ) : null}
            <Link
              href="/digesters"
              className="mt-2 text-sm font-medium text-teal"
            >
              Tanks →
            </Link>
          </Panel>
          <Panel>
            <p className="mb-3 text-base font-semibold">
              Today: dung in → gas out → money
            </p>
            <FlowStrip
              steps={[
                {
                  label: "In",
                  value: `${formatNumber(TODAY_SNAPSHOT.feedstockTonnes)} t`,
                },
                {
                  label: "Gas",
                  value: `${formatNumber(TODAY_SNAPSHOT.gasProducedM3, 0)} m³`,
                  tone: "teal",
                },
                {
                  label: "Sold",
                  value: `${formatNumber(TODAY_SNAPSHOT.cbgDispatchedKg, 0)} kg`,
                  tone: "gold",
                },
              ]}
            />
            <p className="mt-3 text-base text-muted">
              Staff in {present} · jobs running {running}. One dead day ≈{" "}
              {formatInr(STOPPED_DAY_INR)} · Urja fee ≈ {DAYS_STOPPED_EQUALS_FEE}{" "}
              of those days.
            </p>
            {showCarbon ? (
              <Link
                href="/carbon"
                className="mt-2 inline-block text-sm font-medium text-teal"
              >
                Extra later: carbon ~ {formatInr(creditValue, true)} sitting in
                papers →
              </Link>
            ) : null}
          </Panel>
        </div>
      ) : null}
    </div>
  );
}

function DeskHome({ name, role }: { name: string; role: string }) {
  const { t } = usePrefs();
  const tiles: Record<string, { href: string; t: string; d: string }[]> = {
    store_staff: [
      { href: "/inventory", t: "Stock", d: "What will finish. Trucks that came short." },
      { href: "/feedstock", t: "Trucks", d: "Trip bar → pay farmer or hold." },
      { href: "/me", t: "My card", d: "Your days and pay." },
    ],
    production_staff: [
      { href: "/production", t: "Floor", d: "Start, hold, or scrap a lot." },
      { href: "/me", t: "My card", d: "Your days and pay." },
    ],
    sales_staff: [
      { href: "/sales", t: "Who owes us", d: "Call late money. Hold the next truck." },
      { href: "/me", t: "My card", d: "Target vs collected. Your incentive." },
    ],
    accountant: [
      { href: "/finance", t: "Cash", d: "Tick spend. Then collect or pay out." },
      { href: "/sales", t: "Bills", d: "Who is late" },
      { href: "/suppliers", t: "Pay out", d: "Who to pay so trucks keep coming" },
      { href: "/me", t: "My card", d: "Your pay. Salary run date." },
    ],
    hr_staff: [
      { href: "/workforce", t: "Staff today", d: "Cover the hole, or hold the line." },
      { href: "/people", t: "People cards", d: "Open a person — days and pay." },
      { href: "/me", t: "My card", d: "Your own days and pay." },
    ],
    employee: [{ href: "/me", t: "My card", d: "Punch, days, pay, leave." }],
    driver: [
      { href: "/me", t: "My card", d: "Days, trips, monthly + extra." },
      { href: "/feedstock", t: "My truck", d: "How far this trip has gone." },
    ],
    lab_staff: [
      { href: "/lab", t: "Lab", d: "D2 acids. Slow feed or wait for the next draw." },
      { href: "/digesters", t: "Tanks", d: "See the souring tank." },
      { href: "/me", t: "My card", d: "Your days and pay." },
    ],
    plant_operator: [
      { href: "/digesters", t: "Tanks", d: "D2 is souring. Stop a crash." },
      { href: "/work-orders", t: "Jobs", d: "What is late on your shift." },
      { href: "/me", t: "My card", d: "Your days and pay." },
    ],
    auditor: [
      { href: "/evidence", t: "Proof", d: "Read. You cannot edit." },
      { href: "/reports", t: "Papers", d: "Q2 pack under review." },
      { href: "/data-quality", t: "Gaps", d: "Missing hours before carbon money." },
    ],
  };
  const mine = tiles[role] ?? tiles.employee;
  const call: Record<string, { a: string; d: string; href: string; go: string }> = {
    store_staff: {
      a: "Napier or dung can stop the line. Trucks only get paid when the bar hits weighbridge.",
      d: "Order stock, or open trucks to pay / hold.",
      href: "/inventory",
      go: "Store now",
    },
    production_staff: {
      a: "A failed lot should not leave the floor. A waiting job should start or wait.",
      d: "Open Floor and pick Start or Hold.",
      href: "/production",
      go: "Floor",
    },
    sales_staff: {
      a: "Late money is already yours. Loading another truck makes the hole bigger.",
      d: "Call to collect, or hold the next dispatch.",
      href: "/sales",
      go: "Collect",
    },
    accountant: {
      a: "Staff cannot spend until you tick. Farmers and suppliers wait on the same yes.",
      d: "Open Cash and Allow or Hold.",
      href: "/finance",
      go: "Say yes",
    },
    hr_staff: {
      a: "If a line has no stand-in, the afternoon shift is a hole.",
      d: "Move someone, or hold the line.",
      href: "/workforce",
      go: "People",
    },
    employee: {
      a: "Only your punch, your days, your pay.",
      d: "Open your card.",
      href: "/me",
      go: "My card",
    },
    driver: {
      a: "Your month is days worked plus trip extra. Today’s trip counts only after the pad. August salary is 7 Sep.",
      d: "Open your card, or the truck.",
      href: "/me",
      go: "My card",
    },
    lab_staff: {
      a: "D2 acids are high. You prove it with the sample, then Suresh slows the feed.",
      d: "Open lab, or send the slow-feed call.",
      href: "/lab",
      go: "Lab",
    },
    plant_operator: {
      a: "D2 pH is drifting. That is your shift, not the owner’s bank.",
      d: "Open tanks, or the late job.",
      href: "/digesters",
      go: "Tanks",
    },
    auditor: {
      a: "You are not on this plant’s payroll. Read proof. Flag a gap.",
      d: "Open the locker.",
      href: "/evidence",
      go: "Proof",
    },
  };
  const mineCall = call[role] ?? call.employee;

  return (
    <div>
      <PageHeader
        color="teal"
        title={t("dash.hello", { name })}
        description={t("dash.desk")}
      />
      <LineNotice
        watch={
          role === "store_staff"
            ? WATCH.store
            : role === "lab_staff"
              ? WATCH.lab
              : role === "plant_operator"
                ? WATCH.tanks
                : role === "sales_staff"
                  ? WATCH.sales
                  : role === "production_staff"
                    ? WATCH.floor
                    : role === "hr_staff"
                      ? WATCH.staff
                      : role === "accountant"
                        ? WATCH.cash
                        : role === "driver"
                          ? WATCH.trucks
                          : []
        }
      />
      <Decide
        cue={t("dash.cue")}
        analysis={role === "lab_staff" ? t("labDesk.a") : mineCall.a}
        decision={role === "lab_staff" ? t("labDesk.d") : mineCall.d}
      >
        <Link href={mineCall.href}>
          <Button variant="gold">
            {role === "lab_staff" ? t("labDesk.go") : mineCall.go}
          </Button>
        </Link>
      </Decide>
      <div className="grid gap-3 sm:grid-cols-2">
        {mine.map((m) => (
          <Link key={m.href} href={m.href}>
            <Panel className="h-full hover:border-teal">
              <p className="text-base font-semibold">{m.t}</p>
              <p className="mt-1 text-sm text-muted">{m.d}</p>
            </Panel>
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <LiveStrip />
      </div>
    </div>
  );
}
