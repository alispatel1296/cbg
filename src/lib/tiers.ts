export type TierId = 1 | 2 | 3;

export const TIERS = [
  {
    id: 1 as TierId,
    name: "Small factory",
    short: "Small",
    tagline: "No tanks — only store, staff, bills",
    monthlyFrom: 20000,
    monthlyTo: 20000,
    monthlyDisplay: "₹20,000",
    color: "teal" as const,
    forWhom: "Any factory / godown",
    why: "If you have no biogas tanks yet. Stock, who owes you, who you owe, staff.",
    features: [
      "Stock, buy orders, trucks in, wastage",
      "What the floor is making + quality",
      "Bills, who is late, goods out",
      "Pay suppliers + staff salary",
      "Only you tick big spends",
    ],
  },
  {
    id: 2 as TierId,
    name: "Full plant",
    short: "Plant",
    tagline: "The ₹75,000 plan — stop the holes",
    monthlyFrom: 75000,
    monthlyTo: 75000,
    monthlyDisplay: "₹75,000",
    addOnDisplay: "One number. No range.",
    color: "gold" as const,
    forWhom: "CBG / biogas plant owners",
    why: "One stopped day is ~₹49,500. One sour tank is ~₹10 lakh. This fee is smaller than those holes.",
    features: [
      "Everything in Small factory",
      "Tank health — yellow before it dies",
      "Which dung mix makes more gas ₹",
      "Pay farmer when weighbridge says OK",
      "See gas wasted in the cleaner (₹ every day)",
      "Lab tests, dung mix, FOM bags, govt dates",
    ],
  },
  {
    id: 3 as TierId,
    name: "Carbon later",
    short: "Carbon",
    tagline: "Only when that money is real",
    monthlyFrom: 90000,
    monthlyTo: 90000,
    monthlyDisplay: "₹90,000",
    addOnDisplay: "+₹15,000 when you want papers",
    color: "ok" as const,
    forWhom: "After the plant is tight",
    why: "Do not start here. Add this when carbon / govt papers can bring cash — not before.",
    features: [
      "Everything in Full plant",
      "Carbon money, step by step",
      "Papers the checker asks for",
      "Fertilizer bag sales",
      "Govt due dates on one page",
    ],
  },
] as const;

export const SETUP_FEES = [
  {
    item: "First-time plant setup",
    price: "₹25,000 once",
    note: "Your people, your items, your suppliers. Not every month.",
  },
  {
    item: "Carbon papers (only if you take Carbon later)",
    price: "₹1–3 lakh once",
    note: "Outside man asks ₹4–25 lakh for the same work.",
  },
  {
    item: "Tank sensors — only if you want them",
    price: "₹1.5–4 lakh / plant",
    note: "You can start with registers. No one forces machines on day one.",
  },
];

export const REVENUE_SHARE = {
  pctFrom: 5,
  pctTo: 10,
  label: "5–10% only on carbon money you actually get",
  note: "Off unless you switch it on. We do not take a cut of your gas sales.",
};

/** Minimum tier required to open a route */
export const ROUTE_TIER: Record<string, TierId> = {
  "/dashboard": 1,
  "/inventory": 1,
  "/workforce": 1,
  "/feedstock": 1,
  "/reports": 1,
  "/settings": 1,
  "/alerts": 1,
  "/work-orders": 1,
  "/pricing": 1,
  "/docs": 1,
  "/production": 1,
  "/sales": 1,
  "/suppliers": 1,
  "/finance": 1,
  "/audit-log": 1,
  "/me": 1,
  "/people": 1,

  "/digesters": 2,
  "/yield": 2,
  "/gas": 2,
  "/lab": 2,
  "/devices": 2,
  "/mass-balance": 2,
  "/data-quality": 2,

  "/carbon": 3,
  "/ci-score": 3,
  "/evidence": 3,
  "/fertilizer": 2,
  "/compliance": 2,
  "/portfolio": 3,
  "/onboarding": 1,
};

export function tierForPath(pathname: string): TierId {
  const hit = Object.keys(ROUTE_TIER)
    .filter((p) => pathname === p || pathname.startsWith(`${p}/`))
    .sort((a, b) => b.length - a.length)[0];
  return hit ? ROUTE_TIER[hit] : 1;
}

export function canUsePath(userTier: TierId, pathname: string): boolean {
  return userTier >= tierForPath(pathname);
}

export function tierLabel(id: TierId): string {
  return TIERS.find((t) => t.id === id)?.name ?? `Tier ${id}`;
}

export function formatTierShort(id: TierId): string {
  return `T${id}`;
}
