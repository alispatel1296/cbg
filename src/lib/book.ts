import type { Role } from "./types";
import { EMPLOYEES, LEAVE_REQUESTS, PRODUCTION_ORDERS, PURCHASE_ORDERS, PAY_VOUCHERS, SALES_ORDERS, AUDIT_LOG } from "./factory-ops";
import { WORKFORCE } from "./tier1-data";
import { WORK_ORDERS } from "./gap-data";
import { LIVE_TRUCKS, FACTORY, type LiveTruck } from "./extras";
import { FOM_BATCHES } from "./product-data";

export type Stamp = {
  byId: string;
  byName: string;
  desk: string;
  at: string;
  how: string;
};

export type BookAction =
  | "log_truck"
  | "add_staff"
  | "assign_job"
  | "new_order"
  | "new_purchase"
  | "new_payment"
  | "new_floor"
  | "log_fom"
  | "allow_leave"
  | "ask_leave"
  | "mark_call";

export const ACTION_ROLES: Record<BookAction, Role[]> = {
  log_truck: ["store_staff", "plant_operator", "plant_owner", "super_admin"],
  add_staff: ["hr_staff", "plant_owner", "super_admin"],
  assign_job: [
    "plant_operator",
    "hr_staff",
    "production_staff",
    "plant_owner",
    "super_admin",
  ],
  new_order: ["sales_staff", "plant_owner", "super_admin"],
  new_purchase: ["store_staff", "plant_owner", "super_admin"],
  new_payment: ["accountant", "plant_owner", "super_admin"],
  new_floor: ["production_staff", "plant_operator", "plant_owner", "super_admin"],
  log_fom: ["production_staff", "plant_operator", "plant_owner", "super_admin"],
  allow_leave: ["hr_staff", "plant_owner", "super_admin"],
  ask_leave: [
    "employee",
    "driver",
    "lab_staff",
    "store_staff",
    "production_staff",
    "sales_staff",
    "hr_staff",
    "plant_operator",
    "accountant",
  ],
  mark_call: [
    "plant_owner",
    "plant_operator",
    "store_staff",
    "production_staff",
    "sales_staff",
    "accountant",
    "hr_staff",
    "super_admin",
    "driver",
    "lab_staff",
    "employee",
  ],
};

export function canDo(role: Role | undefined, action: BookAction): boolean {
  if (!role) return false;
  return ACTION_ROLES[action].includes(role);
}

export type StaffPerson = {
  id: string;
  name: string;
  job: string;
  dept: string;
  phone: string;
  today: "present" | "late" | "absent";
  inTime: string;
  kind: "staff" | "driver";
  stamp: Stamp;
};

export type PlantJob = {
  id: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  due: string;
  priority: "high" | "medium" | "low";
  status: "open" | "done";
  source: string;
  stamp: Stamp;
};

export type BookOrder = (typeof SALES_ORDERS)[number] & { stamp: Stamp };
export type BookPurchase = (typeof PURCHASE_ORDERS)[number] & { stamp: Stamp };
export type BookPay = (typeof PAY_VOUCHERS)[number] & { stamp: Stamp };
export type BookProd = (typeof PRODUCTION_ORDERS)[number] & { stamp: Stamp };
export type BookFom = (typeof FOM_BATCHES)[number] & { stamp: Stamp };
export type BookLeave = (typeof LEAVE_REQUESTS)[number] & { stamp: Stamp };
export type BookTruck = LiveTruck & { stamp: Stamp };
export type BookAudit = {
  id: string;
  action: string;
  who: string;
  when: string;
  desk: string;
};

export type WaMsg = {
  id: string;
  to: string;
  body: string;
  at: string;
  by: string;
  kind: "alert" | "chase" | "remind";
};

export type DiaryRow = {
  id: string;
  date: string;
  title: string;
  kind: "money" | "staff" | "plant" | "govt";
  by: string;
  at: string;
};

const anita: Stamp = {
  byId: "u-store",
  byName: "Anita Deshmukh",
  desk: "Trucks / Store",
  at: "2026-08-16T06:40:00+05:30",
  how: "weighbridge slip",
};
const suresh: Stamp = {
  byId: "u-operator",
  byName: "Suresh Patil",
  desk: "Jobs",
  at: "2026-08-16T07:10:00+05:30",
  how: "typed",
};
const neha: Stamp = {
  byId: "u-sales",
  byName: "Neha Kulkarni",
  desk: "Sales",
  at: "2026-08-16T08:00:00+05:30",
  how: "typed",
};
const rajesh: Stamp = {
  byId: "u-owner",
  byName: "Rajesh Mehta",
  desk: "Staff",
  at: "2023-04-01T10:00:00+05:30",
  how: "hired on Staff",
};
const hr: Stamp = {
  byId: "u-hr",
  byName: "Sunita Rao",
  desk: "Staff",
  at: "2024-01-12T10:00:00+05:30",
  how: "hired on Staff",
};
const acct: Stamp = {
  byId: "u-acct",
  byName: "Vikram Shah",
  desk: "Pay out",
  at: "2026-08-16T09:10:00+05:30",
  how: "typed",
};
const ravi: Stamp = {
  byId: "u-prod",
  byName: "Ravi More",
  desk: "Floor",
  at: "2026-08-16T06:00:00+05:30",
  how: "typed",
};

const PHONE: Record<string, string> = {
  "E-01": "+91 98765 11111",
  "E-02": "+91 98765 30001",
  "E-03": "+91 98765 30002",
  "E-04": "+91 98765 30006",
  "E-05": "+91 98765 30016",
  "E-06": "+91 98220 44112",
  "E-07": "+91 98765 22011",
  "E-08": "+91 97654 11880",
};

const HIRED: Record<string, Stamp> = {
  "E-01": { ...rajesh, at: "2023-04-01T10:00:00+05:30" },
  "E-02": { ...hr, at: "2024-01-12T10:00:00+05:30" },
  "E-03": { ...hr, at: "2025-06-01T10:00:00+05:30", byName: "Sunita Rao" },
  "E-04": { ...hr, at: "2024-09-15T10:00:00+05:30" },
  "E-05": { ...hr, at: "2025-02-01T10:00:00+05:30" },
  "E-06": { ...hr, at: "2023-11-01T10:00:00+05:30", how: "hired as driver" },
  "E-07": { ...hr, at: "2024-06-01T10:00:00+05:30", how: "hired as driver" },
  "E-08": { ...hr, at: "2025-01-10T10:00:00+05:30", how: "hired as driver" },
};

export const SEED_STAFF: StaffPerson[] = WORKFORCE.map((w) => {
  const emp = EMPLOYEES.find((e) => e.id === w.id);
  return {
    id: w.id,
    name: w.name,
    job: emp?.job ?? w.role,
    dept: emp?.dept ?? "Plant",
    phone: PHONE[w.id] ?? "",
    today: w.today,
    inTime: w.inTime,
    kind: w.role === "Driver" ? "driver" : "staff",
    stamp: HIRED[w.id] ?? hr,
  };
});

export const SEED_TRUCKS: BookTruck[] = LIVE_TRUCKS.map((t, i) => ({
  ...t,
  stamp: {
    ...anita,
    at: i === 0 ? "2026-08-16T05:32:00+05:30" : i === 1 ? "2026-08-16T05:12:00+05:30" : "2026-08-16T06:08:00+05:30",
    how: "logged on Trucks · driver picked from Staff",
  },
}));

const STAFF_ID: Record<string, string> = {
  "Suresh Patil": "E-01",
  "Anita Deshmukh": "E-02",
  "Ravi More": "E-03",
  "Kiran Jadhav": "E-04",
  "Meena Pawar": "E-05",
  "Ganesh Patil": "E-06",
  "Sandeep Shinde": "E-07",
  "Kiran Pawar": "E-08",
};

export const SEED_JOBS: PlantJob[] = [
  ...WORK_ORDERS.map((w) => ({
    id: w.id,
    title: w.title,
    assigneeId: STAFF_ID[w.assignee] ?? "E-01",
    assigneeName: w.assignee,
    due: w.due,
    priority: w.priority,
    status: w.status,
    source: w.source,
    stamp: {
      ...suresh,
      how: `assigned on Jobs · from ${w.source}`,
      at:
        w.id === "WO-304"
          ? "2026-08-16T07:05:00+05:30"
          : w.id === "WO-303"
            ? "2026-08-16T06:50:00+05:30"
            : "2026-08-15T16:00:00+05:30",
    },
  })),
  {
    id: "TK-39",
    title: "Bag FOM-116 remaining",
    assigneeId: "E-03",
    assigneeName: "Ravi More",
    due: "2026-08-14",
    priority: "medium",
    status: "open",
    source: "Floor",
    stamp: { ...ravi, how: "assigned on Floor", at: "2026-08-14T09:00:00+05:30" },
  },
];

export const SEED_ORDERS: BookOrder[] = SALES_ORDERS.map((o) => ({
  ...o,
  stamp: { ...neha, at: `${o.date}T09:00:00+05:30`, how: "typed on Sales" },
}));

export const SEED_PURCHASES: BookPurchase[] = PURCHASE_ORDERS.map((p) => ({
  ...p,
  stamp: {
    ...anita,
    desk: "Stock",
    at: `${p.date}T11:00:00+05:30`,
    how: "typed on Stock",
  },
}));

export const SEED_PAY: BookPay[] = PAY_VOUCHERS.map((p) => ({
  ...p,
  stamp: { ...acct, at: `${p.date}T10:00:00+05:30`, how: "typed on Pay out" },
}));

export const SEED_PROD: BookProd[] = PRODUCTION_ORDERS.map((p) => ({
  ...p,
  stamp: { ...ravi, at: `${p.target}T06:10:00+05:30`, how: "typed on Floor" },
}));

export const SEED_FOM: BookFom[] = FOM_BATCHES.map((b) => ({
  ...b,
  stamp: { ...ravi, desk: "FOM", at: `${b.date}T14:00:00+05:30`, how: "typed on FOM" },
}));

export const SEED_LEAVE: BookLeave[] = LEAVE_REQUESTS.map((l) => ({
  ...l,
  stamp: {
    byId: l.name === "Kiran Jadhav" ? "E-04" : "E-03",
    byName: l.name,
    desk: "Staff",
    at: "2026-08-18T08:30:00+05:30",
    how: "asked on Staff",
  },
}));

export const SEED_AUDIT: BookAudit[] = [
  ...AUDIT_LOG.map((a) => ({
    id: a.id,
    action: a.action,
    who: a.who,
    when: a.when,
    desk: "Change log",
  })),
  {
    id: "AU-8837",
    action: "Hired driver Ganesh Patil (E-06) — collection",
    who: "Sunita Rao",
    when: "2023-11-01T10:00:00+05:30",
    desk: "Staff",
  },
  {
    id: "AU-8836",
    action: "Assigned Ganesh Patil to truck MH 15 GT 4421 (Wavi dung)",
    who: "Anita Deshmukh",
    when: "2026-08-16T05:32:00+05:30",
    desk: "Trucks",
  },
  {
    id: "AU-8835",
    action: "Assigned Sandeep Shinde to truck MH 12 SV 1188 (napier)",
    who: "Anita Deshmukh",
    when: "2026-08-16T05:12:00+05:30",
    desk: "Trucks",
  },
  {
    id: "AU-8834",
    action: "Assigned Kiran Pawar to truck MH 16 KP 3304 (Coop #12)",
    who: "Anita Deshmukh",
    when: "2026-08-16T06:08:00+05:30",
    desk: "Trucks",
  },
  {
    id: "AU-8833",
    action: "Assigned WO-304 to Suresh Patil (from alert AL-77)",
    who: "Suresh Patil",
    when: "2026-08-16T07:05:00+05:30",
    desk: "Jobs",
  },
];

export function nowIso() {
  return new Date().toISOString();
}

export function stampNow(
  user: { id: string; name: string; role: Role },
  desk: string,
  how = "typed",
): Stamp {
  return {
    byId: user.id,
    byName: user.name,
    desk,
    at: nowIso(),
    how,
  };
}

export function nextId(prefix: string, existing: { id: string }[]) {
  const n = existing.length + 41 + Math.floor(Math.random() * 50);
  return `${prefix}-${n}`;
}

export function villageRoute(fromName: string, lat: number, lng: number) {
  return [
    { name: fromName, lat, lng },
    {
      name: "Towards MIDC",
      lat: (lat + FACTORY.lat) / 2,
      lng: (lng + FACTORY.lng) / 2,
    },
    { name: "STICE south gate", lat: 19.8512, lng: 74.0446 },
    { name: "Weighbridge", lat: FACTORY.lat, lng: FACTORY.lng },
  ];
}
