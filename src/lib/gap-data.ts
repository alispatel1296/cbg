/** Competitive gap modules — data for features Rimba/Mangrove/Civerify/Goenvi ship */

export const MASS_BALANCE = {
  period: "15–16 Aug 2026",
  feedstockInT: 54.1,
  digesterInventoryT: 312,
  digestateOutT: 38.4,
  rawBiogasM3: 2840,
  purifiedCbgKg: 1180,
  flaredM3: 42,
  imbalancePct: 1.8,
  status: "within_tolerance" as const,
  nodes: [
    { id: "in", label: "Feedstock in", value: "54.1 t", ok: true },
    { id: "dig", label: "In digesters", value: "312 t", ok: true },
    { id: "gas", label: "Raw biogas", value: "2,840 m³", ok: true },
    { id: "cbg", label: "Purified CBG", value: "1,180 kg", ok: true },
    { id: "flare", label: "Flared", value: "42 m³", ok: true },
    { id: "out", label: "Digestate out", value: "38.4 t", ok: true },
  ],
  ledger: [
    {
      ts: "2026-08-16T08:00:00+05:30",
      step: "Weighbridge → Digester 1",
      inQty: "8.4 t dung",
      outQty: "—",
      variance: "0%",
    },
    {
      ts: "2026-08-16T08:05:00+05:30",
      step: "Digesters → Upgrading",
      inQty: "920 m³ raw",
      outQty: "380 kg CBG",
      variance: "1.2%",
    },
    {
      ts: "2026-08-16T07:30:00+05:30",
      step: "Upgrading → Dispatch",
      inQty: "380 kg",
      outQty: "420 kg truck*",
      variance: "buffer draw",
    },
    {
      ts: "2026-08-15T22:10:00+05:30",
      step: "Safety flare event",
      inQty: "42 m³",
      outQty: "destroyed",
      variance: "logged",
    },
  ],
};

export const CI_SCORE = {
  current: 28.4,
  unit: "gCO₂e / MJ",
  target: 25.0,
  priorMonth: 31.2,
  creditUpliftPct: 6.5,
  estimatedExtraInr: 185000,
  levers: [
    {
      name: "Cut transport distance (local dung)",
      impact: -1.8,
      effort: "Medium",
      status: "available",
    },
    {
      name: "Shift 20% grid → solar for upgrading",
      impact: -2.1,
      effort: "High",
      status: "planned",
    },
    {
      name: "Raise CH₄ purity 58% → 61%",
      impact: -0.9,
      effort: "Low",
      status: "available",
    },
    {
      name: "Zero avoidable flare this month",
      impact: -0.6,
      effort: "Low",
      status: "in_progress",
    },
  ],
  breakdown: [
    { source: "Feedstock cultivation / collection", share: 34 },
    { source: "Transport to plant", share: 18 },
    { source: "Plant process energy", share: 27 },
    { source: "Upgrading & compression", share: 14 },
    { source: "Fugitives & flare", share: 7 },
  ],
};

export const DATA_QUALITY = {
  integrityScore: 94,
  gapsOpen: 3,
  substitutionsUsed: 1,
  lastScan: "2026-08-16T08:12:00+05:30",
  issues: [
    {
      id: "DQ-19",
      severity: "warning" as const,
      stream: "Digester 2 · H₂S",
      issue: "15-min gap 22:40–22:55 (sensor reboot)",
      action: "Interpolate per BEE gap rule · flag for auditor",
      status: "open",
    },
    {
      id: "DQ-18",
      severity: "critical" as const,
      stream: "Weighbridge · FB-2405",
      issue: "Photo evidence missing on poor-quality batch",
      action: "Operator must upload before period close",
      status: "open",
    },
    {
      id: "DQ-17",
      severity: "info" as const,
      stream: "Gas meter · PC-439",
      issue: "Clock skew 47s vs plant NTP",
      action: "Auto-corrected · logged in vault",
      status: "resolved",
    },
  ],
  streams: [
    { name: "pH / temp probes", uptime: 99.2, status: "green" as const },
    { name: "Gas chromatograph", uptime: 97.8, status: "green" as const },
    { name: "Weighbridge", uptime: 100, status: "green" as const },
    { name: "Flow meters", uptime: 98.1, status: "amber" as const },
    { name: "Dispatch ERP sync", uptime: 94.0, status: "amber" as const },
  ],
};

export const LAB_READINGS = [
  {
    id: "LAB-441",
    ts: "2026-08-16T06:00:00+05:30",
    digester: "D2",
    parameter: "VFA (mg/L)",
    value: 820,
    limit: " < 600 ideal",
    flag: "amber" as const,
  },
  {
    id: "LAB-440",
    ts: "2026-08-16T06:00:00+05:30",
    digester: "D2",
    parameter: "Alkalinity (mg/L)",
    value: 2100,
    limit: "2000–4000",
    flag: "green" as const,
  },
  {
    id: "LAB-439",
    ts: "2026-08-15T06:00:00+05:30",
    digester: "D1",
    parameter: "VS in (%)",
    value: 8.4,
    limit: "6–12",
    flag: "green" as const,
  },
  {
    id: "LAB-438",
    ts: "2026-08-15T06:00:00+05:30",
    digester: "All",
    parameter: "TS separation eff. 5d",
    value: 72,
    limit: "> 65%",
    flag: "green" as const,
  },
];

export const FLARE_EVENTS = [
  {
    id: "FL-88",
    ts: "2026-08-15T22:10:00+05:30",
    volumeM3: 42,
    reason: "Upgrader trip · safety flare",
    methaneDestroyedPct: 99.1,
    creditImpact: "Avoided methane claim reduced for window",
  },
  {
    id: "FL-87",
    ts: "2026-08-09T14:22:00+05:30",
    volumeM3: 18,
    reason: "Planned maintenance vent",
    methaneDestroyedPct: 98.8,
    creditImpact: "Logged · within monthly allowance",
  },
];

export const COMPLIANCE_ITEMS = [
  {
    id: "CMP-12",
    title: "Annual GHG data package (BEE CCTS)",
    due: "2026-09-03",
    status: "upcoming" as const,
    owner: "Rajesh Mehta",
    daysLeft: 18,
  },
  {
    id: "CMP-11",
    title: "Q2 monitoring report — ACVA response",
    due: "2026-08-25",
    status: "in_progress" as const,
    owner: "Priya Sharma",
    daysLeft: 9,
  },
  {
    id: "CMP-10",
    title: "Sensor calibration certificates renew",
    due: "2026-08-30",
    status: "upcoming" as const,
    owner: "Suresh Patil",
    daysLeft: 14,
  },
  {
    id: "CMP-09",
    title: "Q1 monitoring report",
    due: "2026-04-15",
    status: "done" as const,
    owner: "Rajesh Mehta",
    daysLeft: 0,
  },
];

export const PORTFOLIO = [
  {
    plantId: "plant-nashik",
    name: "Greenfield Nashik",
    yieldM3t: 59.4,
    ci: 28.4,
    health: 86,
    creditsT: 1840,
    uptime: 98.2,
  },
  {
    plantId: "plant-satara",
    name: "Greenfield Satara",
    yieldM3t: 51.1,
    ci: 33.8,
    health: 72,
    creditsT: 920,
    uptime: 94.6,
  },
];

export const WORK_ORDERS = [
  {
    id: "WO-304",
    title: "Rebalance D2 feedstock — early souring",
    priority: "high" as const,
    assignee: "Suresh Patil",
    due: "2026-08-16",
    status: "open" as const,
    source: "Alert AL-77",
  },
  {
    id: "WO-303",
    title: "Upload missing photo for FB-2405",
    priority: "high" as const,
    assignee: "Anita Deshmukh",
    due: "2026-08-17",
    status: "open" as const,
    source: "Data quality DQ-18",
  },
  {
    id: "WO-302",
    title: "Calibrate H₂S probe D2",
    priority: "medium" as const,
    assignee: "Suresh Patil",
    due: "2026-08-18",
    status: "open" as const,
    source: "Device health",
  },
  {
    id: "WO-301",
    title: "Scrubber media check after H₂S spike",
    priority: "medium" as const,
    assignee: "Suresh Patil",
    due: "2026-08-15",
    status: "done" as const,
    source: "Alert AL-75",
  },
];

export const DEVICES = [
  {
    id: "URJA-SNS-D1-8842",
    name: "Digester 1 kit",
    type: "Multi-probe",
    status: "online" as const,
    lastSeen: "2026-08-16T08:14:00+05:30",
    battery: null as number | null,
  },
  {
    id: "URJA-SNS-D2-8843",
    name: "Digester 2 kit",
    type: "Multi-probe",
    status: "degraded" as const,
    lastSeen: "2026-08-16T08:05:00+05:30",
    battery: null as number | null,
  },
  {
    id: "URJA-SNS-D3-8844",
    name: "Digester 3 kit",
    type: "Multi-probe",
    status: "online" as const,
    lastSeen: "2026-08-16T08:14:00+05:30",
    battery: null as number | null,
  },
  {
    id: "URJA-WB-120",
    name: "Weighbridge bridge",
    type: "Weighbridge gateway",
    status: "online" as const,
    lastSeen: "2026-08-16T08:13:00+05:30",
    battery: null as number | null,
  },
  {
    id: "URJA-GC-09",
    name: "Gas chromatograph",
    type: "Lab / GC",
    status: "online" as const,
    lastSeen: "2026-08-16T07:55:00+05:30",
    battery: null as number | null,
  },
  {
    id: "URJA-FL-02",
    name: "Flare meter",
    type: "Flow",
    status: "offline" as const,
    lastSeen: "2026-08-15T22:40:00+05:30",
    battery: 12,
  },
];

export const CO_BENEFITS = {
  wasteDivertedT: 12480,
  farmerPaymentsInr: 1860000,
  jobsSupported: 42,
  villagesLinked: 28,
  sdgTags: ["SDG 7", "SDG 13", "SDG 8", "SDG 12"],
};
