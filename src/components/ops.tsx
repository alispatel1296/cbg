"use client";

import { useState } from "react";
import {
  CAL_EVENTS,
  CHAT_THREADS,
  CUSTOMER_PINS,
  FACTORY,
  googleDirFromFactory,
  googleDirTo,
  type CalEvent,
  type LiveTruck,
} from "@/lib/extras";
import { RouteScene } from "@/components/RouteMap";
import { Photo } from "@/components/Photo";
import { Button, Decide, Panel, StageBar, StatusPill } from "@/components/ui";
import { cn } from "@/lib/cn";
import { MessageSquare, Navigation, Phone } from "lucide-react";
import Link from "next/link";
import { useBook } from "@/lib/book-store";
import { EnteredBy } from "@/components/book-ui";
import { useAuth } from "@/lib/auth";
import { formatInr } from "@/lib/format";
import { findPerson } from "@/lib/people";
import { usePrefs } from "@/lib/prefs";
import { PLANT_TODAY } from "@/lib/plant-clock";
import { downloadIcs } from "@/lib/ics";

function truckTone(status: LiveTruck["status"]) {
  if (status === "weighbridge") return "green" as const;
  if (status === "on_road") return "amber" as const;
  return "neutral" as const;
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { tr } = usePrefs();
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {tr(label)}
      </p>
      <p className="mt-0.5 font-semibold leading-snug">{tr(value)}</p>
    </div>
  );
}

const TRIP_STEPS = ["Village", "Road", "Gate", "Pad", "Cash"];

function tripStage(t: LiveTruck, paid: boolean) {
  if (paid) return 4;
  if (t.status === "loading") return 0;
  if (t.status === "on_road") return t.progress < 0.45 ? 1 : 2;
  if (t.status === "weighbridge") return 3;
  return 1;
}

function farmerDue(id: string) {
  if (id.includes("1188")) return 7260;
  if (id.includes("3304")) return 2480;
  if (id.includes("4421")) return 4200;
  return 4000;
}

function driverMonth(id: string) {
  if (id === "E-06") return 19000;
  if (id === "E-07") return 18500;
  return 18000;
}

export function TruckLiveBoard({ pendingInr = 0 }: { pendingInr?: number }) {
  const { trucks, paidTrips, paidDrivers, payTrip } = useBook();
  const { user } = useAuth();
  const { tr } = usePrefs();
  const me = findPerson(user?.id);
  const mine = trucks.find((t) => t.driverStaffId === me?.staffId);
  const [activeId, setActiveId] = useState(mine?.id ?? trucks[0]?.id ?? "");
  const [talk, setTalk] = useState(false);
  const [more, setMore] = useState(false);
  const truck = trucks.find((t) => t.id === activeId) ?? mine ?? trucks[0];
  if (!truck) return null;

  const isDriver = user?.role === "driver";
  const threadId =
    truck.driverStaffId === "E-06"
      ? "ganesh"
      : truck.driverStaffId === "E-07"
        ? "sandeep"
        : truck.driverStaffId === "E-08"
          ? "kiran-drv"
          : "suresh";

  const farmerAmt = farmerDue(truck.id);
  const driverAmt = driverMonth(truck.driverStaffId);
  const tripPaid = Boolean(paidTrips[truck.id]);
  const driverPaid = Boolean(paidDrivers[truck.driverStaffId]);
  const stage = tripStage(truck, tripPaid);
  const canPayFarmer = [
    "plant_owner",
    "store_staff",
    "super_admin",
  ].includes(user?.role ?? "");
  const canPayDriver = [
    "plant_owner",
    "accountant",
    "super_admin",
  ].includes(user?.role ?? "");
  const tripReady = truck.status === "weighbridge" && !tripPaid;
  const tripHold =
    truck.status !== "weighbridge" && !tripPaid
      ? truck.status === "loading"
        ? "Still loading. No photo, no weight — do not pay the farmer."
        : "Trip not finished. Farmer pay waits for the weighbridge."
      : null;

  const analysis = isDriver
    ? tripReady
      ? `Your truck is on the pad. This trip can count in extras. August monthly still pays 7 Sep.`
      : `Your trip is ${Math.round(truck.progress * 100)}% done. Extra for this load waits for the weighbridge. Store pays the farmer, not you.`
    : tripPaid
      ? `This trip is done. Farmer ${truck.farmer} is paid ${formatInr(farmerAmt)}.`
      : tripReady
        ? `${truck.plate} is on the pad. ${truck.load} ${truck.qty}. Farmer ${truck.farmer} is waiting ${formatInr(farmerAmt)}.`
        : pendingInr > 0
          ? `${formatInr(pendingInr)} still waits in villages. ${truck.plate} is ${Math.round(truck.progress * 100)}% of the way. ${truck.kmLeft} km left.`
          : `${truck.plate} is ${Math.round(truck.progress * 100)}% of the way. ${truck.kmLeft} km left. Driver ${truck.driver.name}.`;

  const decision = isDriver
    ? "Finish the pad. Do not ask Accounts for August salary today."
    : tripReady
      ? "Pay the farmer for this trip. Do not pay August salary from here — that is 7 Sep."
      : "Hold farmer pay until the pad.";

  return (
    <div className="mb-4 space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 xl:hidden">
        {trucks.map((t) => (
          <button
            key={`chip-${t.id}`}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={cn(
              "shrink-0 rounded-xl border px-3 py-2 text-left",
              t.id === truck.id ? "border-teal bg-teal-soft" : "border-line bg-surface",
            )}
          >
            <p className="font-bold leading-tight">{t.plate}</p>
            <p className="mt-1">
              <StatusPill status={truckTone(t.status)} label={t.statusLabel} />
            </p>
          </button>
        ))}
      </div>

      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Panel className="hidden min-w-0 xl:order-1 xl:block">
          <h2 className="font-display text-xl font-bold">{tr("Which truck")}</h2>
          <p className="mb-3 text-sm text-muted">
            {tr("Tap one. The bar is how far that trip has reached.")}
          </p>
          <div className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
            {trucks.map((t) => {
              const st = tripStage(t, Boolean(paidTrips[t.id]));
              return (
                <button
                  key={t.id}
                  type="button"
                  onMouseEnter={() => setActiveId(t.id)}
                  onFocus={() => setActiveId(t.id)}
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-3 text-left transition",
                    t.id === truck.id
                      ? "border-teal bg-teal-soft"
                      : "border-line bg-surface hover:border-teal/50",
                  )}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">{t.plate}</p>
                    <StatusPill status={truckTone(t.status)} label={t.statusLabel} />
                  </div>
                  <StageBar steps={TRIP_STEPS} at={st} />
                  <p className="mt-2 text-sm text-muted">
                    {t.driver.name} · {tr(t.load)} · {t.qty}
                  </p>
                </button>
              );
            })}
          </div>
        </Panel>

        <div className="min-w-0 space-y-3 xl:order-2">
          <RouteScene
            path={truck.route}
            progress={truck.progress}
            movingLabel={truck.plate}
            eta={truck.eta}
            kmLeft={truck.kmLeft}
          />

          <Decide cue="What to do" analysis={analysis} decision={decision}>
            {tripReady && canPayFarmer ? (
              <Button variant="gold" onClick={() => payTrip(truck.id, farmerAmt, truck.farmer)}>
                {`Pay farmer ${formatInr(farmerAmt)}`}
              </Button>
            ) : null}
            {canPayDriver ? (
              driverPaid ? (
                <p className="w-full text-sm text-muted">{tr("Driver month paid")}</p>
              ) : (
                <p className="w-full text-sm text-muted">
                  {tr("August pay is 7 Sep")} · {formatInr(driverAmt)}
                </p>
              )
            ) : isDriver ? (
              <p className="w-full text-sm text-muted">
                {tr("Store pays the farmer. Your extras count after the pad. Monthly is 7 Sep.")}
              </p>
            ) : canPayFarmer ? (
              <p className="w-full text-sm text-muted">
                {tr("Store pays the farmer. Accountant / Owner run salary on 7 Sep.")}
              </p>
            ) : (
              <p className="w-full text-sm text-muted">
                {tr("Farmer pay is Store. Driver month is Accounts on 7 Sep.")}
              </p>
            )}
          </Decide>

          <Panel>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {tr("This trip")}
            </p>
            <h3 className="font-display text-xl font-bold">{truck.plate}</h3>
            <EnteredBy stamp={truck.stamp} />
            <div className="mt-3">
              <StageBar steps={TRIP_STEPS} at={stage} />
            </div>
            {tripHold ? (
              <p className="mt-3 text-sm font-semibold text-amber">{tr(tripHold)}</p>
            ) : null}
            <p className="mt-3 text-sm text-muted">
              {tr(truck.from)} → {tr("weighbridge")} · {tr("ETA")} {truck.eta} ·{" "}
              {tr("driver")} {truck.driver.name}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <a href={`tel:${truck.driver.phone.replace(/\s/g, "")}`} className="min-w-0">
                <Button variant="secondary" className="w-full">
                  <Phone className="size-4" /> {tr("Phone")}
                </Button>
              </a>
              <a
                href={googleDirTo(truck.route[0].lat, truck.route[0].lng)}
                target="_blank"
                rel="noreferrer"
                className="min-w-0"
              >
                <Button variant="secondary" className="w-full">
                  <Navigation className="size-4" /> {tr("Maps")}
                </Button>
              </a>
              <Button onClick={() => setTalk((v) => !v)}>
                <MessageSquare className="size-4" /> {tr("Talk")}
              </Button>
              <Button variant="ghost" onClick={() => setMore((v) => !v)}>
                {more ? tr("Hide detail") : tr("More detail")}
              </Button>
            </div>
            {talk ? (
              <MiniTalk key={threadId} threadId={threadId} className="mt-3" />
            ) : null}
            {more ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Field label="Lot" value={truck.lot} />
                <Field label="Farmer" value={truck.farmer} />
                <Field label="Left village" value={truck.departed} />
                <Field label="Speed" value={`${truck.speedKmh} km/h`} />
                <Field label="Plant" value={FACTORY.address} />
                <Field label="License" value={truck.driver.license} />
              </div>
            ) : null}
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function DateBoard({
  kinds,
  title,
  hint,
}: {
  kinds: CalEvent["kind"][];
  title: string;
  hint?: string;
}) {
  const { t, locale } = usePrefs();
  const { diary, addDiary, can } = useBook();
  const extra = diary.filter((e) => kinds.includes(e.kind));
  const merged = [
    ...CAL_EVENTS.filter((e) => kinds.includes(e.kind)),
    ...extra.map((e) => ({ date: e.date, title: e.title, kind: e.kind })),
  ];
  const seen = new Set<string>();
  const events = merged.filter((e) => {
    const k = `${e.date}|${e.title}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const todayN = Number(PLANT_TODAY.slice(-2));
  const days = Array.from({ length: 31 }, (_, i) => {
    const d = `2026-08-${String(i + 1).padStart(2, "0")}`;
    return { day: i + 1, date: d, hits: events.filter((e) => e.date === d) };
  });
  const next = events.find((e) => e.date >= PLANT_TODAY) ?? events[0];
  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>
          {hint ? <p className="mb-1 text-sm text-muted">{hint}</p> : null}
          <p className="mb-3 text-xs text-muted">{t("diaryHint")}</p>
        </div>
        {next ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={!can("mark_call")}
              onClick={() =>
                addDiary({
                  date: next.date,
                  title: next.title,
                  kind: next.kind,
                })
              }
            >
              {t("addDiary")}
            </Button>
            <Button
              variant="gold"
              onClick={() =>
                downloadIcs({
                  title: next.title,
                  date: next.date,
                  description: "Urja plant diary",
                })
              }
            >
              {t("addGoogle")}
            </Button>
          </div>
        ) : null}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span key={`dow-${i}`}>{t(`dow${i}`)}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {days.map((d) => {
          const hot = d.hits.length > 0;
          return (
            <div
              key={d.date}
              className={cn(
                "min-h-12 rounded-md border px-1 py-1 text-left",
                hot ? "border-gold bg-gold-soft" : "border-line bg-surface",
                d.day === todayN ? "ring-2 ring-teal" : "",
              )}
            >
              <p className="text-xs font-bold">{d.day}</p>
              {d.hits.slice(0, 1).map((h) => (
                <p
                  key={`${h.date}-${h.title}`}
                  className="line-clamp-2 text-[10px] leading-tight text-muted"
                >
                  {h.title}
                </p>
              ))}
            </div>
          );
        })}
      </div>
      <ul className="mt-3 space-y-1.5">
        {events.map((e) => (
          <li key={`${e.date}-${e.title}`} className="text-sm">
            <span className="font-bold">
              {new Date(e.date).toLocaleDateString(locale, {
                day: "numeric",
                month: "short",
              })}
            </span>
            <span className="text-muted"> · {e.title}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function MiniTalk({
  threadId,
  className,
}: {
  threadId: string;
  className?: string;
}) {
  const thread = CHAT_THREADS.find((t) => t.id === threadId) ?? CHAT_THREADS[0];
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState(thread.messages);

  return (
    <div className={cn("rounded-xl border border-line bg-surface p-3", className)}>
      <div className="mb-2 flex items-center gap-2">
        <Photo
          src={thread.avatar}
          alt={thread.name}
          className="size-8 rounded-full"
        />
        <div>
          <p className="text-sm font-bold">{thread.name}</p>
          <p className="text-xs text-muted">{thread.role}</p>
        </div>
      </div>
      <div className="max-h-40 space-y-2 overflow-y-auto">
        {msgs.map((m, i) => (
          <p
            key={`${m.at}-${i}`}
            className={cn(
              "max-w-[90%] rounded-lg px-2.5 py-1.5 text-sm",
              m.from === "me"
                ? "ml-auto bg-teal-soft font-medium"
                : "bg-raised",
            )}
          >
            {m.text}
            <span className="ml-2 text-[10px] text-muted">{m.at}</span>
          </p>
        ))}
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setMsgs((prev) => [...prev, { from: "me", text: text.trim(), at: "Now" }]);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here…"
          className="min-w-0 flex-1 rounded-lg border border-line bg-raised px-3 py-2 text-sm"
        />
        <Button type="submit" variant="secondary">
          Send
        </Button>
      </form>
    </div>
  );
}

export function LiveStrip() {
  const { audit } = useBook();
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold">Just now on the floor</h2>
        <Link href="/audit-log" className="text-sm font-semibold text-teal">
          Full log →
        </Link>
      </div>
      <ul className="space-y-2">
        {audit.slice(0, 5).map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-line bg-surface px-3 py-2"
          >
            <p className="font-semibold">{a.action}</p>
            <p className="text-sm text-muted">
              {a.who} · {a.desk} ·{" "}
              {new Date(a.when).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function CustomerMap() {
  const [id, setId] = useState(CUSTOMER_PINS[0].id);
  const pin = CUSTOMER_PINS.find((p) => p.id === id) ?? CUSTOMER_PINS[0];

  return (
    <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="order-2 space-y-2 lg:order-1">
        {CUSTOMER_PINS.map((p) => (
          <button
            key={p.id}
            type="button"
            onMouseEnter={() => setId(p.id)}
            onFocus={() => setId(p.id)}
            onClick={() => setId(p.id)}
            className={cn(
              "w-full rounded-xl border px-3 py-3 text-left",
              p.id === pin.id ? "border-gold bg-gold-soft" : "border-line bg-surface",
            )}
          >
            <p className="font-bold">{p.name}</p>
            <p className="text-sm text-muted">
              {p.contact} · {p.phone}
            </p>
            <p className="mt-1 text-sm font-semibold text-gold">{p.due}</p>
          </button>
        ))}
      </div>
      <div className="order-1 min-w-0 space-y-3 lg:order-2">
        <RouteScene
          path={pin.route}
          progress={1}
          movingLabel="Dispatch"
        />
        <Panel>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Buyer" value={pin.name} />
            <Field label="Money" value={pin.due} />
            <Field label="Contact" value={pin.contact} />
            <Field label="Phone" value={pin.phone} />
          </div>
          <p className="mt-2 text-sm text-muted">{pin.note}</p>
          <a
            href={googleDirFromFactory(pin.lat, pin.lng)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-bold text-teal"
          >
            Open this dispatch in Google Maps →
          </a>
        </Panel>
      </div>
    </div>
  );
}
