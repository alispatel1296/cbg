/** Product pillars 1–7 — demo data for businessman-facing modules */

export const DIGESTER_CRASH_COST = {
  daysLostTypical: 21,
  gasLossPerDayKg: 1100,
  inrPerKgCbg: 45,
  estimatedLossInr: 21 * 1100 * 45, // ~10.4 L
};

export const FEED_MIX_PERFORMANCE = [
  {
    mix: "70% dung · 30% napier",
    batches: 42,
    yieldM3t: 64.2,
    revenueIndex: 100,
    note: "Best this quarter",
  },
  {
    mix: "50% dung · 50% agri residue",
    batches: 28,
    yieldM3t: 52.8,
    revenueIndex: 82,
    note: "OK when dung short",
  },
  {
    mix: "Mixed waste heavy",
    batches: 15,
    yieldM3t: 41.5,
    revenueIndex: 65,
    note: "Avoid if possible",
  },
  {
    mix: "100% dung",
    batches: 36,
    yieldM3t: 58.1,
    revenueIndex: 90,
    note: "Stable but not peak",
  },
];

export const BLEND_RECOMMENDATION = {
  todayIncoming: {
    dungT: 28.4,
    napierT: 12.1,
    residueT: 15.6,
  },
  suggest: "65% dung · 25% napier · 10% residue",
  expectedYieldM3t: 62.5,
  vsCurrentM3t: 59.4,
  extraGasM3Day: 148,
  extraInrDay: 6660,
  extraInrMonth: 6660 * 30,
};

export const PURIFICATION = {
  rawBiogasM3Today: 2840,
  ch4InRawPct: 56.8,
  cbgOutKg: 1180,
  ch4RecoveryPct: 91.4,
  targetRecoveryPct: 94,
  lostCh4M3: 72,
  lostInrToday: 3240,
  cylindersFilled: 48,
  pipelineKg: 760,
  truckKg: 420,
};

export const FOM_BATCHES = [
  {
    id: "FOM-118",
    date: "2026-08-16",
    solidT: 6.2,
    liquidKl: 18.4,
    bags: 310,
    grade: "Grade A",
    status: "bagged" as const,
  },
  {
    id: "FOM-117",
    date: "2026-08-14",
    solidT: 5.8,
    liquidKl: 16.1,
    bags: 290,
    grade: "Grade A",
    status: "sold" as const,
  },
  {
    id: "FOM-116",
    date: "2026-08-11",
    solidT: 7.1,
    liquidKl: 20.0,
    bags: 355,
    grade: "Grade B",
    status: "drying" as const,
  },
];

export const FOM_SALES = [
  {
    id: "FS-44",
    buyer: "Ramesh Kolekar",
    village: "Wavi",
    bags: 40,
    rateInr: 180,
    amountInr: 7200,
    date: "2026-08-15",
    paid: true,
  },
  {
    id: "FS-43",
    buyer: "Village Coop #12",
    village: "Sinnar",
    bags: 120,
    rateInr: 175,
    amountInr: 21000,
    date: "2026-08-12",
    paid: true,
  },
  {
    id: "FS-42",
    buyer: "Savitri SHG",
    village: "Nandur",
    bags: 60,
    rateInr: 180,
    amountInr: 10800,
    date: "2026-08-10",
    paid: false,
  },
];

export const FOM_SUMMARY = {
  bagsInStock: 355 + 310 - 40,
  monthSalesInr: 7200 + 21000 + 10800,
  pendingInr: 10800,
  solidOutTMonth: 19.1,
};

export const COLLECTION_ROUTES = [
  {
    id: "RT-A",
    name: "North belt · Wavi–Nandur",
    stops: 6,
    tonnesToday: 20.5,
    villages: ["Wavi", "Nandur", "Ojhar"],
    status: "done" as const,
  },
  {
    id: "RT-B",
    name: "East belt · Dindori",
    stops: 4,
    tonnesToday: 15.6,
    villages: ["Dindori", "Sinnar"],
    status: "running" as const,
  },
  {
    id: "RT-C",
    name: "South coop loop",
    stops: 5,
    tonnesToday: 11.8,
    villages: ["Sinnar", "Phatan"],
    status: "planned" as const,
  },
];

export const PAYMENT_TRIGGERS = [
  {
    batchId: "FB-2407",
    farmer: "Savitri SHG",
    tonnes: 12.1,
    amountInr: 7260,
    trigger: "Weighbridge OK + photo sealed",
    status: "ready_to_pay" as const,
  },
  {
    batchId: "FB-2405",
    farmer: "Kailas Pawar",
    tonnes: 6.2,
    amountInr: 2480,
    trigger: "Waiting photo proof",
    status: "blocked" as const,
  },
  {
    batchId: "FB-2408",
    farmer: "Ramesh Kolekar",
    tonnes: 8.4,
    amountInr: 4200,
    trigger: "Auto-paid to UPI",
    status: "paid" as const,
  },
];

export const SCHEME_MILESTONES = [
  {
    id: "SAT-01",
    scheme: "SATAT",
    title: "LOI offtake volume — monthly check",
    due: "2026-08-31",
    status: "on_track" as const,
    detail: "Need ≥ 1,000 kg/day average CBG to IOCL / CGD",
    daysLeft: 15,
  },
  {
    id: "GOB-02",
    scheme: "GOBARdhan",
    title: "Subsidy tranche 2 — plant photos + logs",
    due: "2026-09-10",
    status: "action_needed" as const,
    detail: "Upload commissioning evidence pack",
    daysLeft: 25,
  },
  {
    id: "SAT-03",
    scheme: "SATAT",
    title: "CGD injection meter calibration",
    due: "2026-08-28",
    status: "action_needed" as const,
    detail: "Certificate required for offtake invoice",
    daysLeft: 12,
  },
  {
    id: "PCB-01",
    scheme: "PCB",
    title: "Consent to Operate renewal",
    due: "2026-10-15",
    status: "upcoming" as const,
    detail: "Maharashtra Pollution Control Board",
    daysLeft: 60,
  },
  {
    id: "BIO-01",
    scheme: "Biosafety",
    title: "Biosafety / slurry handling certificate",
    due: "2026-09-20",
    status: "upcoming" as const,
    detail: "Renew before slurry sales peak season",
    daysLeft: 35,
  },
];
