import type {
  Alert,
  CarbonPeriod,
  DigesterReading,
  EvidenceEntry,
  FeedstockBatch,
  GasDispatch,
  GasProduction,
  Plant,
  Report,
  RevenueCallout,
  User,
} from "./types";

export const DEMO_USERS: User[] = [
  {
    id: "u-owner",
    name: "Rajesh Mehta",
    email: "rajesh@greenfieldcbg.in",
    phone: "+91 98765 43210",
    role: "plant_owner",
    plantIds: ["plant-nashik", "plant-satara"],
    onboardingComplete: true,
    tier: 2,
  },
  {
    id: "u-operator",
    name: "Suresh Patil",
    email: "suresh@greenfieldcbg.in",
    phone: "+91 98765 11111",
    role: "plant_operator",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 2,
  },
  {
    id: "u-auditor",
    name: "Priya Sharma",
    email: "priya@acva-verify.org",
    phone: "+91 98765 22222",
    role: "auditor",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 3,
  },
  {
    id: "u-admin",
    name: "Platform Admin",
    email: "admin@urja.mrv",
    phone: "+91 90000 00000",
    role: "super_admin",
    plantIds: ["plant-nashik", "plant-satara"],
    onboardingComplete: true,
    tier: 3,
  },
  {
    id: "u-store",
    name: "Anita Deshmukh",
    email: "anita.store@greenfieldcbg.in",
    phone: "+91 98765 30001",
    role: "store_staff",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 1,
  },
  {
    id: "u-prod",
    name: "Ravi More",
    email: "ravi.prod@greenfieldcbg.in",
    phone: "+91 98765 30002",
    role: "production_staff",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 1,
  },
  {
    id: "u-sales",
    name: "Neha Kulkarni",
    email: "neha.sales@greenfieldcbg.in",
    phone: "+91 98765 30003",
    role: "sales_staff",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 1,
  },
  {
    id: "u-acct",
    name: "Vikram Shah",
    email: "vikram.accounts@greenfieldcbg.in",
    phone: "+91 98765 30004",
    role: "accountant",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 1,
  },
  {
    id: "u-hr",
    name: "Sunita Rao",
    email: "sunita.hr@greenfieldcbg.in",
    phone: "+91 98765 30005",
    role: "hr_staff",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 1,
  },
  {
    id: "u-emp",
    name: "Kiran Jadhav",
    email: "kiran.floor@greenfieldcbg.in",
    phone: "+91 98765 30006",
    role: "employee",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 1,
  },
  {
    id: "u-drv-ganesh",
    name: "Ganesh Patil",
    email: "ganesh.driver@greenfieldcbg.in",
    phone: "+91 98220 44112",
    role: "driver",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 1,
  },
  {
    id: "u-drv-sandeep",
    name: "Sandeep Shinde",
    email: "sandeep.driver@greenfieldcbg.in",
    phone: "+91 98765 22011",
    role: "driver",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 1,
  },
  {
    id: "u-drv-kiran",
    name: "Kiran Pawar",
    email: "kiran.driver@greenfieldcbg.in",
    phone: "+91 97654 11880",
    role: "driver",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 1,
  },
  {
    id: "u-lab",
    name: "Meena Pawar",
    email: "meena.lab@greenfieldcbg.in",
    phone: "+91 98765 30016",
    role: "lab_staff",
    plantIds: ["plant-nashik"],
    onboardingComplete: true,
    tier: 2,
  },
];

export const PLANTS: Plant[] = [
  {
    id: "plant-nashik",
    name: "Greenfield Nashik",
    location: "Sinnar, Nashik, Maharashtra",
    lat: 19.85,
    lng: 74.0,
    capacityTpd: 50,
    digesterCount: 3,
    feedstockTypes: ["Cattle dung", "Agri residue", "Napier grass"],
    methodology: "BEE CCTS",
    healthScore: 86,
    healthStatus: "green",
  },
  {
    id: "plant-satara",
    name: "Greenfield Satara",
    location: "Phaltan, Satara, Maharashtra",
    lat: 17.99,
    lng: 74.43,
    capacityTpd: 30,
    digesterCount: 2,
    feedstockTypes: ["Cattle dung", "Poultry litter"],
    methodology: "Verra",
    healthScore: 72,
    healthStatus: "amber",
  },
];

export const DIGESTERS: DigesterReading[] = [
  {
    digesterId: "D1",
    name: "Digester 1",
    ph: 7.1,
    temperatureC: 36.4,
    ch4Pct: 58.2,
    co2Pct: 38.1,
    h2sPpm: 180,
    gasYieldM3h: 42.5,
    status: "green",
  },
  {
    digesterId: "D2",
    name: "Digester 2",
    ph: 6.6,
    temperatureC: 34.8,
    ch4Pct: 52.4,
    co2Pct: 42.0,
    h2sPpm: 310,
    gasYieldM3h: 31.2,
    status: "amber",
    anomaly: "Early souring risk — pH drift over 48h",
  },
  {
    digesterId: "D3",
    name: "Digester 3",
    ph: 7.0,
    temperatureC: 37.1,
    ch4Pct: 59.8,
    co2Pct: 36.5,
    h2sPpm: 140,
    gasYieldM3h: 45.1,
    status: "green",
  },
];

export const TODAY_SNAPSHOT = {
  feedstockTonnes: 47.8,
  gasProducedM3: 2840,
  cbgDispatchedKg: 1180,
};

export const CARBON: CarbonPeriod = {
  capturedTco2e: 1840,
  projectedAnnualTco2e: 6200,
  cccPriceInr: 850,
  baselineTco2e: 4120,
  status: "under_verification",
};

export const REVENUE_CALLOUTS: RevenueCallout[] = [
  {
    id: "rc1",
    title: "Early souring alert prevented loss",
    amountInr: 240000,
    detail:
      "Digester 2 pH drift caught 11 days ago — estimated gas yield protected vs. historical souring events.",
  },
  {
    id: "rc2",
    title: "MRV report auto-generated",
    amountInr: 450000,
    detail:
      "Q1 monitoring report ready for ACVA — replaces typical consultant package for this compliance cycle.",
  },
];

export const FEEDSTOCK_BATCHES: FeedstockBatch[] = [
  {
    id: "FB-2408",
    timestamp: "2026-08-16T06:42:00+05:30",
    source: "Ramesh Kolekar",
    village: "Wavi",
    weightTonnes: 8.4,
    feedstockType: "Cattle dung",
    moisturePct: 78,
    qualityFlag: "good",
    lat: 19.86,
    lng: 74.02,
    photoAttached: true,
    amountDueInr: 4200,
    paid: true,
  },
  {
    id: "FB-2407",
    timestamp: "2026-08-16T05:55:00+05:30",
    source: "Savitri SHG",
    village: "Nandur",
    weightTonnes: 12.1,
    feedstockType: "Napier grass",
    moisturePct: 62,
    qualityFlag: "good",
    lat: 19.88,
    lng: 73.97,
    photoAttached: true,
    amountDueInr: 7260,
    paid: false,
  },
  {
    id: "FB-2406",
    timestamp: "2026-08-15T18:20:00+05:30",
    source: "Ganesh Transport",
    village: "Dindori",
    weightTonnes: 15.6,
    feedstockType: "Agri residue",
    moisturePct: 45,
    qualityFlag: "fair",
    lat: 20.2,
    lng: 73.83,
    photoAttached: true,
    amountDueInr: 6240,
    paid: true,
  },
  {
    id: "FB-2405",
    timestamp: "2026-08-15T14:10:00+05:30",
    source: "Kailas Pawar",
    village: "Ojhar",
    weightTonnes: 6.2,
    feedstockType: "Cattle dung",
    moisturePct: 82,
    qualityFlag: "poor",
    lat: 20.09,
    lng: 73.93,
    photoAttached: false,
    amountDueInr: 2480,
    paid: false,
  },
  {
    id: "FB-2404",
    timestamp: "2026-08-15T09:35:00+05:30",
    source: "Village Coop #12",
    village: "Sinnar",
    weightTonnes: 11.8,
    feedstockType: "Cattle dung",
    moisturePct: 76,
    qualityFlag: "good",
    lat: 19.85,
    lng: 74.0,
    photoAttached: true,
    amountDueInr: 5900,
    paid: true,
  },
];

export const SUPPLIER_LEDGER = [
  { name: "Ramesh Kolekar", tonnesYtd: 186.4, paidInr: 93200, pendingInr: 0 },
  { name: "Savitri SHG", tonnesYtd: 242.1, paidInr: 118400, pendingInr: 7260 },
  { name: "Ganesh Transport", tonnesYtd: 410.8, paidInr: 164320, pendingInr: 0 },
  { name: "Kailas Pawar", tonnesYtd: 98.2, paidInr: 36800, pendingInr: 2480 },
  { name: "Village Coop #12", tonnesYtd: 320.5, paidInr: 160250, pendingInr: 0 },
];

export const GAS_PRODUCTION: GasProduction[] = [
  {
    id: "GP-901",
    timestamp: "2026-08-16T08:00:00+05:30",
    rawBiogasM3: 920,
    purifiedCbgKg: 380,
    cycleId: "PC-441",
  },
  {
    id: "GP-900",
    timestamp: "2026-08-16T02:00:00+05:30",
    rawBiogasM3: 880,
    purifiedCbgKg: 365,
    cycleId: "PC-440",
  },
  {
    id: "GP-899",
    timestamp: "2026-08-15T20:00:00+05:30",
    rawBiogasM3: 1040,
    purifiedCbgKg: 435,
    cycleId: "PC-439",
  },
];

export const GAS_DISPATCH: GasDispatch[] = [
  {
    id: "GD-512",
    timestamp: "2026-08-16T07:30:00+05:30",
    volumeKg: 420,
    mode: "truck",
    destination: "IOCL Sinnar Retail",
    destinationType: "retail_pump",
  },
  {
    id: "GD-511",
    timestamp: "2026-08-15T16:00:00+05:30",
    volumeKg: 760,
    mode: "pipeline",
    destination: "MNGL CGD Node N3",
    destinationType: "cgd_network",
  },
  {
    id: "GD-510",
    timestamp: "2026-08-15T10:15:00+05:30",
    volumeKg: 180,
    mode: "cylinder",
    destination: "Local cluster pumps",
    destinationType: "retail_pump",
  },
];

export const REPORTS: Report[] = [
  {
    id: "RPT-104",
    title: "Q2 2026 Monitoring Report",
    type: "monitoring",
    methodology: "BEE CCTS",
    createdAt: "2026-08-10T11:00:00+05:30",
    version: "v1.2",
    status: "under_review",
  },
  {
    id: "RPT-103",
    title: "Q1 2026 Monitoring Report",
    type: "monitoring",
    methodology: "BEE CCTS",
    createdAt: "2026-04-12T09:30:00+05:30",
    version: "v1.0",
    status: "approved",
  },
  {
    id: "RPT-090",
    title: "Project Design Document",
    type: "pdd",
    methodology: "BEE CCTS",
    createdAt: "2025-11-02T14:00:00+05:30",
    version: "v2.0",
    status: "approved",
  },
];

export const EVIDENCE: EvidenceEntry[] = [
  {
    id: "EV-8841",
    timestamp: "2026-08-16T08:05:12+05:30",
    category: "sensor",
    summary: "D2 pH 6.60 · temp 34.8°C · CH₄ 52.4%",
    hash: "a7f3c9e1b2d84f0a",
    prevHash: "91bc44de7701aa2f",
  },
  {
    id: "EV-8840",
    timestamp: "2026-08-16T06:42:01+05:30",
    category: "weighbridge",
    summary: "FB-2408 · 8.4 t cattle dung · Wavi",
    hash: "91bc44de7701aa2f",
    prevHash: "55e0ad9912cc7b38",
  },
  {
    id: "EV-8839",
    timestamp: "2026-08-16T07:30:44+05:30",
    category: "dispatch",
    summary: "GD-512 · 420 kg truck · IOCL Sinnar",
    hash: "55e0ad9912cc7b38",
    prevHash: "c0ffee12ab34cd56",
  },
  {
    id: "EV-8838",
    timestamp: "2026-08-10T11:00:00+05:30",
    category: "report",
    summary: "RPT-104 Q2 monitoring report sealed",
    hash: "c0ffee12ab34cd56",
    prevHash: "deadbeef0099aa11",
  },
];

export const ALERTS: Alert[] = [
  {
    id: "AL-77",
    severity: "warning",
    title: "Digester 2 early souring risk",
    message: "pH dropped from 7.0 → 6.6 over 48 hours. Review feedstock mix.",
    plantId: "plant-nashik",
    createdAt: "2026-08-16T05:12:00+05:30",
    acknowledged: false,
    channel: ["in_app", "whatsapp", "sms"],
  },
  {
    id: "AL-76",
    severity: "info",
    title: "GHG submission deadline in 18 days",
    message: "Annual BEE CCTS data package due 3 Sep 2026.",
    plantId: "plant-nashik",
    createdAt: "2026-08-15T09:00:00+05:30",
    acknowledged: false,
    channel: ["in_app"],
  },
  {
    id: "AL-75",
    severity: "critical",
    title: "H₂S spike on Digester 2",
    message: "H₂S at 310 ppm — above 250 ppm scrubber threshold.",
    plantId: "plant-nashik",
    createdAt: "2026-08-14T22:40:00+05:30",
    acknowledged: true,
    channel: ["in_app", "sms"],
  },
];

export function sensorHistory(days: 7 | 30 | 90) {
  const points = days === 7 ? 7 : days === 30 ? 30 : 45;
  return Array.from({ length: points }, (_, i) => {
    const day = i + 1;
    return {
      label: days === 7 ? `D${day}` : `W${Math.ceil(day / (days === 30 ? 1 : 2))}`,
      d1Ph: 7.0 + Math.sin(i / 3) * 0.15,
      d2Ph: 6.9 - i * (days === 7 ? 0.05 : 0.012) + Math.sin(i / 4) * 0.08,
      d3Ph: 7.05 + Math.cos(i / 5) * 0.12,
      d1Yield: 40 + Math.sin(i / 2) * 4,
      d2Yield: 38 - i * (days === 7 ? 0.9 : 0.2) + Math.sin(i / 3) * 3,
      d3Yield: 44 + Math.cos(i / 2.5) * 3,
    };
  });
}

export const TEAM = DEMO_USERS.map((u) => ({
  id: u.id,
  name: u.name,
  role: u.role,
  email: u.email,
  status: "active" as const,
}));

const COMMON = ["/dashboard", "/pricing", "/me"];

const ROLE_PATHS: Record<User["role"], string[] | "all"> = {
  super_admin: "all",
  plant_owner: "all",
  plant_operator: [
    ...COMMON,
    "/digesters",
    "/feedstock",
    "/gas",
    "/alerts",
    "/lab",
    "/work-orders",
    "/devices",
    "/data-quality",
    "/mass-balance",
    "/compliance",
    "/yield",
    "/fertilizer",
    "/inventory",
    "/workforce",
    "/docs",
    "/production",
    "/me",
    "/people",
  ],
  auditor: [
    ...COMMON,
    "/evidence",
    "/reports",
    "/carbon",
    "/mass-balance",
    "/ci-score",
    "/data-quality",
    "/compliance",
    "/lab",
    "/docs",
    "/audit-log",
  ],
  store_staff: [...COMMON, "/inventory", "/docs", "/work-orders", "/feedstock"],
  production_staff: [...COMMON, "/production", "/work-orders", "/workforce", "/fertilizer"],
  sales_staff: [...COMMON, "/sales"],
  accountant: [
    ...COMMON,
    "/sales",
    "/suppliers",
    "/finance",
    "/docs",
    "/reports",
    "/audit-log",
    "/people",
    "/feedstock",
  ],
  hr_staff: [...COMMON, "/workforce", "/docs", "/people"],
  employee: [...COMMON],
  driver: [...COMMON, "/feedstock", "/alerts"],
  lab_staff: [...COMMON, "/lab", "/digesters", "/alerts", "/yield"],
};

export function homePathForRole(role: User["role"]): string {
  switch (role) {
    case "plant_operator":
      return "/digesters";
    case "auditor":
      return "/evidence";
    case "store_staff":
      return "/inventory";
    case "production_staff":
      return "/production";
    case "sales_staff":
      return "/sales";
    case "accountant":
      return "/finance";
    case "hr_staff":
      return "/workforce";
    case "employee":
    case "driver":
      return "/me";
    case "lab_staff":
      return "/lab";
    default:
      return "/dashboard";
  }
}

export function canAccess(role: User["role"], href: string): boolean {
  const allowed = ROLE_PATHS[role];
  if (allowed === "all") return true;
  return allowed.some((p) => href === p || href.startsWith(`${p}/`));
}
