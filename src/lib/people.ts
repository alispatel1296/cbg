/** One card per person on the plant — pay, days, and the numbers that job lives by. */

import type { Role } from "./types";
import { AVATARS } from "./extras";
import type { StaffPerson } from "./book";

export type PersonKind =
  | "owner"
  | "operator"
  | "store"
  | "production"
  | "sales"
  | "accountant"
  | "hr"
  | "floor"
  | "driver"
  | "lab"
  | "auditor"
  | "admin";

export type PayKind = "salary" | "owner_draw" | "none";

export type PersonMetric = {
  label: string;
  value: string;
  hint?: string;
};

export type PersonCall = {
  cue: string;
  analysis: string;
  decision: string;
  options: { label: string; href?: string; gold?: boolean }[];
};

export type PersonCard = {
  id: string;
  userId?: string;
  staffId?: string;
  name: string;
  phone: string;
  email?: string;
  photo: string;
  loginRole?: Role;
  kind: PersonKind;
  jobTitle: string;
  dept: string;
  village: string;
  since: string;
  reportsTo: string;
  bio: string;
  today?: "present" | "late" | "absent" | "off";
  inTime?: string;
  outTime?: string;
  monthPresent: number;
  monthAbsent: number;
  monthOff: number;
  monthTarget: number;
  payKind: PayKind;
  pay?: {
    month: string;
    basic: number;
    extras: number;
    extrasLabel: string;
    advance: number;
    deduct: number;
    net: number;
    payDay: string;
  };
  license?: string;
  truck?: string;
  metrics: PersonMetric[];
  call: PersonCall;
  deskHref?: string;
};

export const PEOPLE: PersonCard[] = [
  {
    id: "u-owner",
    userId: "u-owner",
    name: "Rajesh Mehta",
    phone: "+91 98765 43210",
    email: "rajesh@greenfieldcbg.in",
    photo: AVATARS["u-owner"],
    loginRole: "plant_owner",
    kind: "owner",
    jobTitle: "Plant owner",
    dept: "Office",
    village: "Sinnar",
    since: "2019",
    reportsTo: "—",
    bio: "I tick big spends. I want holes in rupees, not English essays.",
    monthPresent: 0,
    monthAbsent: 0,
    monthOff: 0,
    monthTarget: 0,
    payKind: "owner_draw",
    metrics: [
      { label: "Late — IOCL", value: "₹53,100", hint: "INV-890 due 4 Aug" },
      { label: "Still to collect", value: "₹94,861", hint: "Open bills" },
      { label: "Waiting for your yes", value: "2 ticks", hint: "Napier PO + Anita advance" },
    ],
    call: {
      cue: "Your card",
      analysis: "IOCL still holds ₹53,100 past due. Two spends wait for your tick. That is the hole — not a carbon essay.",
      decision: "Call IOCL, or tick the Napier buy before the line stops.",
      options: [
        { label: "Who owes", href: "/sales", gold: true },
        { label: "Tick spends", href: "/finance" },
      ],
    },
    deskHref: "/dashboard",
  },
  {
    id: "E-01",
    userId: "u-operator",
    staffId: "E-01",
    name: "Suresh Patil",
    phone: "+91 98765 11111",
    email: "suresh@greenfieldcbg.in",
    photo: AVATARS["u-operator"],
    loginRole: "plant_operator",
    kind: "operator",
    jobTitle: "Shift in-charge",
    dept: "Production",
    village: "Nashik",
    since: "2023",
    reportsTo: "Rajesh Mehta",
    bio: "Tanks, mix, and the night crew. If D2 sours, it is on me.",
    today: "present",
    inTime: "06:02",
    outTime: "14:08",
    monthPresent: 22,
    monthAbsent: 1,
    monthOff: 3,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 28000,
      extras: 4400,
      extrasLabel: "Night shift + attend",
      advance: 0,
      deduct: 1200,
      net: 31200,
      payDay: "7 Sep",
    },
    metrics: [
      { label: "Tanks on watch", value: "D2 souring", hint: "pH 6.6" },
      { label: "Open jobs", value: "2", hint: "One can stop the plant" },
      { label: "Hours this week", value: "58 h", hint: "Night overlap" },
    ],
    call: {
      cue: "Your shift",
      analysis: "You are in. D2 is the sick tank. One job on you can stop gas.",
      decision: "Open tanks, or finish the late job.",
      options: [
        { label: "Tanks", href: "/digesters", gold: true },
        { label: "My jobs", href: "/work-orders" },
      ],
    },
    deskHref: "/digesters",
  },
  {
    id: "E-02",
    userId: "u-store",
    staffId: "E-02",
    name: "Anita Deshmukh",
    phone: "+91 98765 30001",
    email: "anita.store@greenfieldcbg.in",
    photo: AVATARS["u-store"],
    loginRole: "store_staff",
    kind: "store",
    jobTitle: "Weighbridge / store",
    dept: "Purchase",
    village: "Sinnar",
    since: "2024",
    reportsTo: "Rajesh Mehta",
    bio: "Lot numbers stay with the truck. No photo, no farmer pay.",
    today: "present",
    inTime: "06:15",
    outTime: "14:12",
    monthPresent: 21,
    monthAbsent: 2,
    monthOff: 3,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 22000,
      extras: 3780,
      extrasLabel: "Attend days",
      advance: 2000,
      deduct: 2000,
      net: 23780,
      payDay: "7 Sep",
    },
    metrics: [
      { label: "Trucks logged today", value: "3", hint: "One still on the road" },
      { label: "Napier left", value: "1.6 days", hint: "Line can stop" },
      { label: "Advance still cut", value: "₹2,000", hint: "From July" },
    ],
    call: {
      cue: "Store card",
      analysis: "You are in. Napier is short. One truck is on the pad waiting for a slip.",
      decision: "Order grass, or weigh the pad truck.",
      options: [
        { label: "Order stock", href: "/inventory", gold: true },
        { label: "Trucks", href: "/feedstock" },
      ],
    },
    deskHref: "/inventory",
  },
  {
    id: "E-03",
    userId: "u-prod",
    staffId: "E-03",
    name: "Ravi More",
    phone: "+91 98765 30002",
    email: "ravi.prod@greenfieldcbg.in",
    photo: AVATARS["u-prod"],
    loginRole: "production_staff",
    kind: "production",
    jobTitle: "Digester helper / floor",
    dept: "Production",
    village: "Dindori",
    since: "2025",
    reportsTo: "Suresh Patil",
    bio: "Feed, slurry, FOM bags. Late today — say why.",
    today: "late",
    inTime: "07:40",
    outTime: "—",
    monthPresent: 19,
    monthAbsent: 4,
    monthOff: 3,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 18000,
      extras: 2850,
      extrasLabel: "Attend days",
      advance: 0,
      deduct: 0,
      net: 20850,
      payDay: "7 Sep",
    },
    metrics: [
      { label: "Late this month", value: "4 days", hint: "Cuts attend pay" },
      { label: "FOM bags waiting", value: "FOM-116", hint: "Overdue job" },
      { label: "Line now", value: "Upgrader A", hint: "CBG running" },
    ],
    call: {
      cue: "Floor card",
      analysis: "You came at 07:40. Four late days this month already cut attend pay. FOM bags are still waiting.",
      decision: "Start the bag job, or tell Suresh why you were late.",
      options: [
        { label: "Floor", href: "/production", gold: true },
        { label: "Ask leave", href: "/me" },
      ],
    },
    deskHref: "/production",
  },
  {
    id: "E-04",
    userId: "u-emp",
    staffId: "E-04",
    name: "Kiran Jadhav",
    phone: "+91 98765 30006",
    email: "kiran.floor@greenfieldcbg.in",
    photo: AVATARS["u-employee"],
    loginRole: "employee",
    kind: "floor",
    jobTitle: "Purification · floor (not the truck driver)",
    dept: "Production",
    village: "Wavi",
    since: "2024",
    reportsTo: "Suresh Patil",
    bio: "Scrubber and cylinders. I punch in and finish my jobs.",
    today: "absent",
    inTime: "—",
    outTime: "—",
    monthPresent: 20,
    monthAbsent: 3,
    monthOff: 3,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 20000,
      extras: 3200,
      extrasLabel: "Attend days",
      advance: 0,
      deduct: 0,
      net: 23200,
      payDay: "7 Sep",
    },
    metrics: [
      { label: "Marked today", value: "Absent", hint: "Ask HR if you are on site" },
      { label: "Leave asked", value: "2 days", hint: "From 19 Aug" },
      { label: "Last take-home", value: "₹23,840", hint: "July, paid 7 Aug" },
    ],
    call: {
      cue: "Your shift",
      analysis: "Muster says you are absent today (16 Aug). Leave you asked is from 19 Aug — that is not today. If you are on site, HR must punch you in or this day is lost.",
      decision: "Ask HR to punch you in, or sit the leave you already asked.",
      options: [
        { label: "Ask leave", href: "/me", gold: true },
      ],
    },
    deskHref: "/me",
  },
  {
    id: "E-05",
    userId: "u-lab",
    staffId: "E-05",
    name: "Meena Pawar",
    phone: "+91 98765 30016",
    email: "meena.lab@greenfieldcbg.in",
    photo: AVATARS["u-lab"],
    loginRole: "lab_staff",
    kind: "lab",
    jobTitle: "Lab sample",
    dept: "Quality",
    village: "Sinnar",
    since: "2025",
    reportsTo: "Suresh Patil",
    bio: "Morning VFA and alkalinity. D2 is my first draw.",
    today: "present",
    inTime: "06:30",
    outTime: "14:05",
    monthPresent: 23,
    monthAbsent: 0,
    monthOff: 3,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 21000,
      extras: 3910,
      extrasLabel: "Attend days",
      advance: 0,
      deduct: 0,
      net: 24910,
      payDay: "7 Sep",
    },
    metrics: [
      { label: "Samples today", value: "D2 VFA high", hint: "820 mg/L" },
      { label: "Days present", value: "23 / 26", hint: "Best on the floor" },
      { label: "Next draw", value: "Tomorrow 06:00", hint: "Same tank" },
    ],
    call: {
      cue: "Lab card",
      analysis: "D2 acids are high. That matches the souring warning. You are the one who proves it.",
      decision: "Log the next sample, or tell Suresh to slow feed.",
      options: [{ label: "Lab", href: "/lab", gold: true }],
    },
    deskHref: "/lab",
  },
  {
    id: "E-06",
    userId: "u-drv-ganesh",
    staffId: "E-06",
    name: "Ganesh Patil",
    phone: "+91 98220 44112",
    email: "ganesh.driver@greenfieldcbg.in",
    photo: AVATARS["u-drv-ganesh"],
    loginRole: "driver",
    kind: "driver",
    jobTitle: "Dung collection driver",
    dept: "Collection",
    village: "Wavi",
    since: "2023",
    reportsTo: "Anita Deshmukh",
    bio: "Village pit to weighbridge. License MH15 2019 004812.",
    today: "present",
    inTime: "05:20",
    outTime: "—",
    monthPresent: 22,
    monthAbsent: 1,
    monthOff: 3,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 19000,
      extras: 8400,
      extrasLabel: "Trip extra (tonnes)",
      advance: 0,
      deduct: 0,
      net: 27400,
      payDay: "7 Sep",
    },
    license: "MH15 2019 004812",
    truck: "MH 15 GT 4421",
    metrics: [
      { label: "Working days", value: "22 / 26", hint: "1 absent this month" },
      { label: "Trips this month", value: "48", hint: "Today still on the road" },
      { label: "Tonnes hauled", value: "186 t", hint: "Trip extra from this" },
      { label: "KM this month", value: "1,240 km", hint: "Plant diesel" },
      { label: "Hours today", value: "1 h 12 m", hint: "Left Wavi 05:40" },
      { label: "This trip extra", value: "Waits", hint: "Weighbridge first" },
    ],
    call: {
      cue: "Driver pay",
      analysis: "July salary already left on 7 Aug. August monthly ₹19,000 pays 7 Sep. Trip extra this month ₹8,400 — today’s dung is still on the road, so this trip is not in extras yet.",
      decision: "Finish this trip. Do not ask Accounts for August pay today.",
      options: [
        { label: "My truck", href: "/feedstock", gold: true },
        { label: "Hold — wait for pad" },
      ],
    },
    deskHref: "/feedstock",
  },
  {
    id: "E-07",
    userId: "u-drv-sandeep",
    staffId: "E-07",
    name: "Sandeep Shinde",
    phone: "+91 98765 22011",
    email: "sandeep.driver@greenfieldcbg.in",
    photo: AVATARS["u-drv-sandeep"],
    loginRole: "driver",
    kind: "driver",
    jobTitle: "Napier collection driver",
    dept: "Collection",
    village: "Dindori",
    since: "2024",
    reportsTo: "Anita Deshmukh",
    bio: "Napier belt. License MH12 2021 009104.",
    today: "present",
    inTime: "05:00",
    outTime: "—",
    monthPresent: 21,
    monthAbsent: 2,
    monthOff: 3,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 18500,
      extras: 7260,
      extrasLabel: "Trip extra (today pad OK)",
      advance: 0,
      deduct: 0,
      net: 25760,
      payDay: "7 Sep",
    },
    license: "MH12 2021 009104",
    truck: "MH 12 SV 1188",
    metrics: [
      { label: "Working days", value: "21 / 26", hint: "2 absent" },
      { label: "Trips this month", value: "44", hint: "On the pad now" },
      { label: "Tonnes hauled", value: "162 t", hint: "Napier" },
      { label: "KM this month", value: "980 km", hint: "Short belt" },
      { label: "Hours today", value: "2 h 05 m", hint: "At weighbridge" },
      { label: "Today’s trip extra", value: "₹7,260", hint: "Weight OK — can count" },
    ],
    call: {
      cue: "Driver pay",
      analysis: "You are on the pad. This trip can count. Monthly ₹18,500 plus extras ₹7,260 this month so far. August monthly still pays 7 Sep.",
      decision: "Count this trip in extras. Do not ask for August salary today.",
      options: [
        { label: "My truck", href: "/feedstock", gold: true },
        { label: "Pay day is 7 Sep" },
      ],
    },
    deskHref: "/feedstock",
  },
  {
    id: "E-08",
    userId: "u-drv-kiran",
    staffId: "E-08",
    name: "Kiran Pawar",
    phone: "+91 97654 11880",
    email: "kiran.driver@greenfieldcbg.in",
    photo: AVATARS["u-drv-kiran"],
    loginRole: "driver",
    kind: "driver",
    jobTitle: "Residue truck driver — not floor Kiran Jadhav",
    dept: "Collection",
    village: "Sinnar",
    since: "2025",
    reportsTo: "Anita Deshmukh",
    bio: "Residue coop loop. License MH16 2018 002271.",
    today: "present",
    inTime: "06:10",
    outTime: "—",
    monthPresent: 20,
    monthAbsent: 2,
    monthOff: 4,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 18000,
      extras: 4200,
      extrasLabel: "Trip extra so far",
      advance: 1500,
      deduct: 1500,
      net: 20700,
      payDay: "7 Sep",
    },
    license: "MH16 2018 002271",
    truck: "MH 16 KP 3304",
    metrics: [
      { label: "Working days", value: "20 / 26", hint: "Advance ₹1,500 still cutting" },
      { label: "Trips this month", value: "31", hint: "Still loading" },
      { label: "Tonnes hauled", value: "94 t", hint: "Residue" },
      { label: "KM this month", value: "1,080 km", hint: "Longer loop" },
      { label: "Hours today", value: "0 h 40 m", hint: "Not left the coop" },
      { label: "This trip extra", value: "Not yet", hint: "No photo, no weight" },
    ],
    call: {
      cue: "Driver pay",
      analysis: "Still loading. This trip does not count. Advance ₹1,500 comes off the 7 Sep pay, not today.",
      decision: "Finish loading and photo the pit, or hold — extras wait.",
      options: [
        { label: "My truck", href: "/feedstock", gold: true },
        { label: "Hold extras" },
      ],
    },
    deskHref: "/feedstock",
  },
  {
    id: "u-sales",
    userId: "u-sales",
    name: "Neha Kulkarni",
    phone: "+91 98765 30003",
    email: "neha.sales@greenfieldcbg.in",
    photo: AVATARS["u-sales"],
    loginRole: "sales_staff",
    kind: "sales",
    jobTitle: "Sales",
    dept: "Sales",
    village: "Nashik",
    since: "2022",
    reportsTo: "Rajesh Mehta",
    bio: "IOCL, CGD, local cylinders. Collect before you chase new orders.",
    today: "present",
    inTime: "09:05",
    monthPresent: 22,
    monthAbsent: 0,
    monthOff: 4,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 28000,
      extras: 6500,
      extrasLabel: "Collection incentive",
      advance: 0,
      deduct: 0,
      net: 34500,
      payDay: "7 Sep",
    },
    metrics: [
      { label: "Late to collect", value: "₹53,100", hint: "IOCL INV-890" },
      { label: "Still open", value: "₹94,861", hint: "All unpaid bills" },
      { label: "Blocked credit", value: "₹70,000", hint: "Coop FOM — do not load" },
    ],
    call: {
      cue: "Sales card",
      analysis: "IOCL is late by ₹53,100. Coop FOM ₹70,000 is blocked on credit. Incentive waits on the late call.",
      decision: "Call the late buyer, or hold their next truck.",
      options: [
        { label: "Who owes", href: "/sales", gold: true },
      ],
    },
    deskHref: "/sales",
  },
  {
    id: "u-acct",
    userId: "u-acct",
    name: "Vikram Shah",
    phone: "+91 98765 30004",
    email: "vikram.accounts@greenfieldcbg.in",
    photo: AVATARS["u-acct"],
    loginRole: "accountant",
    kind: "accountant",
    jobTitle: "Accountant",
    dept: "Accounts",
    village: "Nashik",
    since: "2021",
    reportsTo: "Rajesh Mehta",
    bio: "In, out, ticks. August salary run is 7 Sep.",
    today: "present",
    inTime: "09:30",
    monthPresent: 23,
    monthAbsent: 0,
    monthOff: 3,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 35000,
      extras: 0,
      extrasLabel: "—",
      advance: 0,
      deduct: 2100,
      net: 32900,
      payDay: "7 Sep",
    },
    metrics: [
      { label: "Ticks waiting", value: "2", hint: "Owner must say yes" },
      { label: "Salary run", value: "7 Sep", hint: "26 people" },
      { label: "We still owe", value: "Suppliers", hint: "Pay so trucks come" },
    ],
    call: {
      cue: "Accounts card",
      analysis: "Two spends wait on the owner. Driver August pay is 7 Sep — do not pay it today. You tick what the desk typed.",
      decision: "Open Cash, or pay the top supplier.",
      options: [
        { label: "Cash", href: "/finance", gold: true },
        { label: "Pay out", href: "/suppliers" },
      ],
    },
    deskHref: "/finance",
  },
  {
    id: "u-hr",
    userId: "u-hr",
    name: "Sunita Rao",
    phone: "+91 98765 30005",
    email: "sunita.hr@greenfieldcbg.in",
    photo: AVATARS["u-hr"],
    loginRole: "hr_staff",
    kind: "hr",
    jobTitle: "HR / Admin",
    dept: "HR",
    village: "Sinnar",
    since: "2020",
    reportsTo: "Rajesh Mehta",
    bio: "Muster, leave, hire. A person exists when I type them on Staff.",
    today: "present",
    inTime: "09:00",
    monthPresent: 22,
    monthAbsent: 1,
    monthOff: 3,
    monthTarget: 26,
    payKind: "salary",
    pay: {
      month: "Aug 2026",
      basic: 30000,
      extras: 0,
      extrasLabel: "—",
      advance: 0,
      deduct: 1800,
      net: 28200,
      payDay: "7 Sep",
    },
    metrics: [
      { label: "On the book", value: "8 floor + office", hint: "Open a card to see pay" },
      { label: "Leave waiting", value: "1", hint: "Kiran Jadhav" },
      { label: "Hole today", value: "Purification", hint: "Kiran absent" },
    ],
    call: {
      cue: "HR card",
      analysis: "Purification is uncovered. One leave is waiting. Every person has a card — open it, do not dump a list.",
      decision: "Move someone, or open a person’s card.",
      options: [
        { label: "Staff today", href: "/workforce", gold: true },
      ],
    },
    deskHref: "/workforce",
  },
  {
    id: "u-auditor",
    userId: "u-auditor",
    name: "Priya Sharma",
    phone: "+91 98765 22222",
    email: "priya@acva-verify.org",
    photo: AVATARS["u-auditor"],
    loginRole: "auditor",
    kind: "auditor",
    jobTitle: "Outside checker",
    dept: "ACVA Verify",
    village: "Pune",
    since: "This assignment",
    reportsTo: "ACVA Verify",
    bio: "Look at proof. Cannot change a line. Cannot see staff pay.",
    monthPresent: 4,
    monthAbsent: 0,
    monthOff: 0,
    monthTarget: 4,
    payKind: "none",
    metrics: [
      { label: "Assignment", value: "Greenfield Nashik", hint: "View only" },
      { label: "Latest pack", value: "Q2 2026", hint: "Under review" },
      { label: "Gaps open", value: "3", hint: "Data quality" },
    ],
    call: {
      cue: "Auditor card",
      analysis: "You are not on this plant’s payroll. Open proof. Flag a gap. You cannot edit.",
      decision: "Open the locker, or the monitoring pack.",
      options: [
        { label: "Proof", href: "/evidence", gold: true },
        { label: "Papers", href: "/reports" },
      ],
    },
    deskHref: "/evidence",
  },
  {
    id: "u-admin",
    userId: "u-admin",
    name: "Platform Admin",
    phone: "+91 90000 00000",
    email: "admin@urja.mrv",
    photo: AVATARS["u-acct"],
    loginRole: "super_admin",
    kind: "admin",
    jobTitle: "Urja platform",
    dept: "Urja",
    village: "—",
    since: "—",
    reportsTo: "—",
    bio: "All client plants. Not on Greenfield salary.",
    monthPresent: 0,
    monthAbsent: 0,
    monthOff: 0,
    monthTarget: 0,
    payKind: "none",
    metrics: [
      { label: "Plants on this login", value: "2", hint: "Nashik + Satara" },
    ],
    call: {
      cue: "Platform",
      analysis: "This seat is Urja, not a plant worker. Switch plant from the left.",
      decision: "Open Nashik as the owner would.",
      options: [{ label: "Today", href: "/dashboard", gold: true }],
    },
    deskHref: "/dashboard",
  },
];

export function findPerson(id: string | undefined | null): PersonCard | undefined {
  if (!id) return undefined;
  return PEOPLE.find(
    (p) => p.id === id || p.userId === id || p.staffId === id,
  );
}

export function personFromStaff(s: StaffPerson): PersonCard {
  return {
    id: s.id,
    staffId: s.id,
    name: s.name,
    phone: s.phone,
    photo: AVATARS["u-employee"],
    kind: s.kind === "driver" ? "driver" : "floor",
    jobTitle: s.job,
    dept: s.dept,
    village: "—",
    since: s.stamp.at.slice(0, 4),
    reportsTo: "HR",
    bio: "Put on Staff by " + s.stamp.byName + ".",
    today: s.today,
    inTime: s.inTime,
    monthPresent: 0,
    monthAbsent: 0,
    monthOff: 0,
    monthTarget: 26,
    payKind: "salary",
    metrics: [],
    call: {
      cue: "New on the book",
      analysis: `${s.name} was typed by ${s.stamp.byName}. Days and pay will show after the first month.`,
      decision: "Open Staff to edit, or leave the card as it is.",
      options: [{ label: "Staff", href: "/workforce" }],
    },
    deskHref: "/workforce",
  };
}

export function canViewPerson(viewerRole: Role | undefined, person: PersonCard, self: boolean) {
  if (self) return true;
  if (!viewerRole) return false;
  return (
    viewerRole === "plant_owner" ||
    viewerRole === "super_admin" ||
    viewerRole === "hr_staff" ||
    viewerRole === "plant_operator" ||
    viewerRole === "accountant"
  );
}

export function canSeePay(viewerRole: Role | undefined, person: PersonCard, self: boolean) {
  if (person.payKind === "none") return false;
  if (self) return person.payKind === "salary";
  return (
    viewerRole === "plant_owner" ||
    viewerRole === "hr_staff" ||
    viewerRole === "accountant" ||
    viewerRole === "super_admin"
  );
}

export function peopleForDirectory() {
  return PEOPLE.filter((p) => p.kind !== "admin" && p.kind !== "auditor");
}
