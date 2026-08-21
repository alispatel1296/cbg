import { ALERTS, canAccess } from "./data";
import { APPROVALS, INVOICES } from "./factory-ops";
import { INVENTORY } from "./tier1-data";
import { FLOW } from "./plant-flow";
import type { Role } from "./types";
import type { WaMsg } from "./book";
import { formatInr } from "./format";

export type NoticeTone = "red" | "amber" | "teal";

export type Notice = {
  id: string;
  tone: NoticeTone;
  title: string;
  detail: string;
  href: string;
  when: string;
};

const CALL_HREF: Record<string, string> = {
  [FLOW.labSlow]: "/lab",
  [FLOW.labWait]: "/lab",
  [FLOW.holdFeed]: "/digesters",
  [FLOW.mixLock]: "/yield",
  [FLOW.mixKeep]: "/yield",
  [FLOW.holdTruck]: "/sales",
  [FLOW.holdLine]: "/workforce",
  [FLOW.chaseFom]: "/fertilizer",
  [FLOW.holdCoop]: "/sales",
  "allow-AP-12": "/finance",
  "hold-AP-12": "/finance",
};

function clock(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function moneySeat(role: Role) {
  return (
    role === "plant_owner" ||
    role === "super_admin" ||
    role === "accountant" ||
    role === "sales_staff"
  );
}

export function buildNotices(input: {
  role: Role;
  ticks: Record<string, string>;
  calls: Record<string, string>;
  wa: WaMsg[];
}): Notice[] {
  const { role, ticks, calls, wa } = input;
  const ok = (href: string) => canAccess(role, href);
  const out: Notice[] = [];

  for (const a of ALERTS.filter((x) => !x.acknowledged)) {
    const href =
      a.id === "AL-76"
        ? "/compliance"
        : ok("/digesters")
          ? "/digesters"
          : "/alerts";
    if (!ok(href) && !ok("/alerts")) continue;
    out.push({
      id: a.id,
      tone: a.severity === "critical" ? "red" : "amber",
      title: a.title,
      detail: a.message,
      href: ok(href) ? href : "/alerts",
      when: clock(a.createdAt),
    });
  }

  if (moneySeat(role) && ok("/sales")) {
    const overdue = INVOICES.filter((i) => i.status === "overdue");
    const amt = overdue.reduce((s, i) => s + (i.total - (i.paid ?? 0)), 0);
    if (amt > 0) {
      out.push({
        id: "money-late",
        tone: "red",
        title: `${formatInr(amt)} late`,
        detail: overdue.map((i) => i.customer).join(" · "),
        href: "/sales",
        when: "today",
      });
    }
  }

  if (moneySeat(role) && ok("/finance")) {
    const pending = APPROVALS.filter(
      (a) => (ticks[a.id] ?? a.status) === "pending",
    );
    if (pending[0]) {
      out.push({
        id: "ticks",
        tone: "amber",
        title: `${pending.length} spend${pending.length === 1 ? "" : "s"} wait for a yes`,
        detail: pending[0].what,
        href: "/finance",
        when: "now",
      });
    }
  }

  if (ok("/inventory")) {
    const napier = INVENTORY.find((i) => i.id === "SKU-NAP");
    const days = napier ? napier.onHand / napier.dailyUse : 99;
    if (napier && days < 2) {
      out.push({
        id: "stock-nap",
        tone: "red",
        title: `${napier.name} — ${days.toFixed(1)} days left`,
        detail: "One stopped day of gas is already most of the monthly fee.",
        href: "/inventory",
        when: "now",
      });
    }
  }

  for (const [id, text] of Object.entries(calls)) {
    if (!text) continue;
    const href = CALL_HREF[id] ?? "/dashboard";
    if (!ok(href)) continue;
    out.push({
      id: `call-${id}`,
      tone: "teal",
      title: "From another desk",
      detail: text,
      href,
      when: "now",
    });
  }

  for (const m of wa.slice(0, 4)) {
    if (!ok("/alerts") && !ok("/dashboard")) continue;
    out.push({
      id: m.id,
      tone: m.kind === "alert" ? "amber" : "teal",
      title: `Plant WhatsApp · ${m.to}`,
      detail: m.body,
      href: ok("/alerts") ? "/alerts" : "/dashboard",
      when: clock(m.at),
    });
  }

  const rank = { red: 0, amber: 1, teal: 2 };
  const seen = new Set<string>();
  return out
    .filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    })
    .sort((a, b) => rank[a.tone] - rank[b.tone]);
}
