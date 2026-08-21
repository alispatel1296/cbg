/** Photos, map pins, calendar, chat — plant-ops extras (demo) */

export const PHOTOS = {
  plant:
    "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80",
  tanks:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  truck:
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
  farm:
    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
  store:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  gas:
    "https://images.unsplash.com/photo-1473341304170-c95c4c3d23d5?auto=format&fit=crop&w=1200&q=80",
  paper:
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
};

export const AVATARS: Record<string, string> = {
  "u-owner":
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
  "u-operator":
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
  "u-store":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
  "u-prod":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  "u-sales":
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80",
  "u-acct":
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
  "u-hr":
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
  "u-employee":
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  "u-auditor":
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80",
  "u-drv-ganesh":
    "https://images.unsplash.com/photo-1544723795-378487fc84c6?auto=format&fit=crop&w=240&q=80",
  "u-drv-sandeep":
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  "u-drv-kiran":
    "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=240&q=80",
  "u-lab":
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=240&q=80",
  support:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=240&q=80",
};

export const PROFILES: Record<
  string,
  { bio: string; village: string; since: string }
> = {
  "u-owner": {
    bio: "Plant owner. I tick big spends. I want to see holes, not English essays.",
    village: "Sinnar",
    since: "2019",
  },
  "u-operator": {
    bio: "Shift in-charge. Tanks, mix, and the night crew.",
    village: "Nashik",
    since: "2023",
  },
  "u-store": {
    bio: "Weighbridge and godown. Lot numbers stay with the truck.",
    village: "Sinnar",
    since: "2024",
  },
  "u-employee": {
    bio: "Purification line. I punch in and finish my jobs.",
    village: "Wavi",
    since: "2024",
  },
};

export type GeoPoint = {
  name: string;
  lat: number;
  lng: number;
};

/** Sample plant: STICE Musalgaon MIDC, Sinnar (Nashik). */
export const FACTORY = {
  name: "Greenfield CBG",
  short: "Your plant",
  address: "Plot D-12, STICE Musalgaon MIDC, Sinnar, Nashik 422112",
  gate: "South gate · NH-160",
  lat: 19.8503,
  lng: 74.0469,
};

export const PLANT_PIN = {
  name: FACTORY.name,
  lat: FACTORY.lat,
  lng: FACTORY.lng,
};

export type LiveTruck = {
  id: string;
  plate: string;
  photo: string;
  status: "on_road" | "weighbridge" | "loading";
  statusLabel: string;
  load: string;
  qty: string;
  from: string;
  to: string;
  lat: number;
  lng: number;
  departed: string;
  eta: string;
  lastPing: string;
  kmLeft: number;
  speedKmh: number;
  lot: string;
    farmer: string;
  driverStaffId: string;
  /** 0 = still at village, 1 = on the weighbridge */
  progress: number;
  route: GeoPoint[];
  driver: {
    name: string;
    phone: string;
    license: string;
    photo: string;
    hoursToday: string;
  };
  helper: string;
};

export const LIVE_TRUCKS: LiveTruck[] = [
  {
    id: "MH-15-GT-4421",
    plate: "MH 15 GT 4421",
    photo: PHOTOS.truck,
    status: "on_road",
    statusLabel: "On the road",
    load: "Cattle dung",
    qty: "8.4 t",
    from: "Wavi village pit",
    to: "Greenfield weighbridge",
    lat: 19.8688,
    lng: 74.0125,
    departed: "05:40",
    eta: "07:10",
    lastPing: "06:52",
    kmLeft: 11,
    speedKmh: 38,
    lot: "LOT-D-0816",
    farmer: "Ramesh Kolekar",
    driverStaffId: "E-06",
    progress: 0.52,
    route: [
      { name: "Wavi village pit", lat: 19.9175, lng: 73.9572 },
      { name: "Wavi–Sinnar road", lat: 19.902, lng: 73.974 },
      { name: "Towards NH-160", lat: 19.8845, lng: 73.9968 },
      { name: "Sinnar town bypass", lat: 19.8688, lng: 74.0125 },
      { name: "MIDC approach", lat: 19.8572, lng: 74.031 },
      { name: "STICE south gate", lat: 19.8512, lng: 74.0446 },
      { name: "Weighbridge", lat: FACTORY.lat, lng: FACTORY.lng },
    ],
    driver: {
      name: "Ganesh Patil",
      phone: "+91 98220 44112",
      license: "MH15 2019 004812",
      photo: AVATARS["u-drv-ganesh"],
      hoursToday: "1 h 12 m",
    },
    helper: "Vijay More",
  },
  {
    id: "MH-12-SV-1188",
    plate: "MH 12 SV 1188",
    photo: PHOTOS.farm,
    status: "weighbridge",
    statusLabel: "At weighbridge",
    load: "Napier grass",
    qty: "12.1 t",
    from: "Savitri SHG field",
    to: "Greenfield weighbridge",
    lat: FACTORY.lat,
    lng: FACTORY.lng,
    departed: "05:10",
    eta: "Now",
    lastPing: "06:48",
    kmLeft: 0,
    speedKmh: 0,
    lot: "LOT-N-0816",
    farmer: "Savitri Tai",
    driverStaffId: "E-07",
    progress: 1,
    route: [
      { name: "Savitri SHG field", lat: 19.8568, lng: 74.0215 },
      { name: "MIDC service road", lat: 19.8524, lng: 74.0368 },
      { name: "STICE south gate", lat: 19.8512, lng: 74.0446 },
      { name: "Weighbridge", lat: FACTORY.lat, lng: FACTORY.lng },
    ],
    driver: {
      name: "Sandeep Shinde",
      phone: "+91 98765 22011",
      license: "MH12 2021 009104",
      photo: AVATARS["u-drv-sandeep"],
      hoursToday: "2 h 05 m",
    },
    helper: "Raju More (loader)",
  },
  {
    id: "MH-16-KP-3304",
    plate: "MH 16 KP 3304",
    photo: PHOTOS.store,
    status: "loading",
    statusLabel: "Loading in village",
    load: "Agri residue",
    qty: "6.0 t of 16 t",
    from: "Village Coop #12",
    to: "Greenfield weighbridge",
    lat: 19.8124,
    lng: 74.0786,
    departed: "Not left",
    eta: "08:40",
    lastPing: "06:55",
    kmLeft: 18,
    speedKmh: 0,
    lot: "LOT-R-0816",
    farmer: "Village Coop #12",
    driverStaffId: "E-08",
    progress: 0,
    route: [
      { name: "Village Coop #12", lat: 19.8124, lng: 74.0786 },
      { name: "Khopadi road", lat: 19.822, lng: 74.0688 },
      { name: "Musalgaon village", lat: 19.8355, lng: 74.058 },
      { name: "STICE south gate", lat: 19.847, lng: 74.0502 },
      { name: "Weighbridge", lat: FACTORY.lat, lng: FACTORY.lng },
    ],
    driver: {
      name: "Kiran Pawar",
      phone: "+91 97654 11880",
      license: "MH16 2018 002271",
      photo: AVATARS["u-drv-kiran"],
      hoursToday: "0 h 40 m",
    },
    helper: "Two loaders on site",
  },
];

export type CustomerPin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  contact: string;
  phone: string;
  due: string;
  note: string;
  route: GeoPoint[];
};

export const CUSTOMER_PINS: CustomerPin[] = [
  {
    id: "c-iocl",
    name: "IOCL Sinnar Retail",
    lat: 19.8518,
    lng: 73.9994,
    contact: "Amit Kulkarni",
    phone: "+91 98220 11122",
    due: "₹53,100 late",
    note: "Call before next CBG truck",
    route: [
      { name: FACTORY.name, lat: FACTORY.lat, lng: FACTORY.lng },
      { name: "STICE south gate", lat: 19.8512, lng: 74.0446 },
      { name: "Sinnar highway", lat: 19.8508, lng: 74.022 },
      { name: "IOCL Sinnar Retail", lat: 19.8518, lng: 73.9994 },
    ],
  },
  {
    id: "c-mngl",
    name: "MNGL CGD Node N3",
    lat: 19.9975,
    lng: 73.7898,
    contact: "Neha Joshi",
    phone: "+91 98220 33344",
    due: "₹19,459 left",
    note: "Pipe supply · part paid",
    route: [
      { name: FACTORY.name, lat: FACTORY.lat, lng: FACTORY.lng },
      { name: "Sinnar–Nashik road", lat: 19.91, lng: 73.92 },
      { name: "Nashik Road", lat: 19.96, lng: 73.85 },
      { name: "MNGL CGD Node N3", lat: 19.9975, lng: 73.7898 },
    ],
  },
  {
    id: "c-coop",
    name: "Village Coop #12",
    lat: 19.8124,
    lng: 74.0786,
    contact: "Ramesh Kolekar",
    phone: "+91 98765 43218",
    due: "Credit stop",
    note: "Do not dispatch FOM until owner allows",
    route: [
      { name: FACTORY.name, lat: FACTORY.lat, lng: FACTORY.lng },
      { name: "STICE south gate", lat: 19.847, lng: 74.0502 },
      { name: "Musalgaon village", lat: 19.8355, lng: 74.058 },
      { name: "Village Coop #12", lat: 19.8124, lng: 74.0786 },
    ],
  },
];

export type MapPin = {
  id: string;
  kind: "plant" | "truck" | "village" | "customer";
  name: string;
  detail: string;
  lat: number;
  lng: number;
};

export const MAP_PINS: MapPin[] = [
  {
    id: "plant",
    kind: "plant",
    name: FACTORY.name,
    detail: FACTORY.address,
    lat: FACTORY.lat,
    lng: FACTORY.lng,
  },
  {
    id: "tr-1",
    kind: "truck",
    name: "Truck MH-15 · dung",
    detail: "On Sinnar bypass · 11 km · Ganesh Patil",
    lat: 19.8688,
    lng: 74.0125,
  },
  {
    id: "tr-2",
    kind: "truck",
    name: "Truck MH-12 · napier",
    detail: "At weighbridge now",
    lat: FACTORY.lat,
    lng: FACTORY.lng,
  },
  {
    id: "v-wavi",
    kind: "village",
    name: "Wavi collection",
    detail: "12 farmers · dung + grass",
    lat: 19.9175,
    lng: 73.9572,
  },
  {
    id: "v-sinnar",
    kind: "village",
    name: "Village Coop #12",
    detail: "Credit stop — do not send FOM",
    lat: 19.8124,
    lng: 74.0786,
  },
  {
    id: "c-iocl",
    kind: "customer",
    name: "IOCL Sinnar Retail",
    detail: "Late bill · ₹53,100",
    lat: 19.8518,
    lng: 73.9994,
  },
  {
    id: "c-mngl",
    kind: "customer",
    name: "MNGL CGD Node N3",
    detail: "Pipe gas · part paid",
    lat: 19.9975,
    lng: 73.7898,
  },
];

export type CalEvent = {
  date: string;
  title: string;
  kind: "money" | "staff" | "plant" | "govt";
};

export const CAL_EVENTS: CalEvent[] = [
  { date: "2026-08-19", title: "Kiran Jadhav leave (2 days) — purification hole", kind: "staff" },
  { date: "2026-08-20", title: "Kiran Jadhav still on leave (floor, not truck)", kind: "staff" },
  { date: "2026-08-21", title: "Chase IOCL overdue ₹53,100", kind: "money" },
  { date: "2026-08-22", title: "Napier PO-442 — owner tick or line stops", kind: "plant" },
  { date: "2026-08-23", title: "Pay Ganesh Transport (7-day GRN)", kind: "money" },
  { date: "2026-08-31", title: "GST registration check", kind: "govt" },
  { date: "2026-09-14", title: "MNGL bill due", kind: "money" },
  { date: "2026-09-30", title: "Factory license renew", kind: "govt" },
];

export type ChatMsg = {
  from: "me" | "them";
  text: string;
  at: string;
};

export type ChatThread = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  unread: number;
  messages: ChatMsg[];
};

export const CHAT_THREADS: ChatThread[] = [
  {
    id: "ganesh",
    name: "Ganesh Patil",
    role: "Driver · MH 15 GT 4421",
    avatar: AVATARS["u-drv-ganesh"],
    unread: 1,
    messages: [
      { from: "them", text: "Left Wavi 05:40. Dung wet. 11 km left.", at: "06:52" },
      { from: "me", text: "Come to weighbridge bay 2. Photo the pit.", at: "06:54" },
    ],
  },
  {
    id: "sandeep",
    name: "Sandeep Shinde",
    role: "Driver · MH 12 SV 1188",
    avatar: AVATARS["u-drv-sandeep"],
    unread: 0,
    messages: [
      { from: "them", text: "On the pad. Waiting for Anita to print the slip.", at: "06:48" },
    ],
  },
  {
    id: "kiran-drv",
    name: "Kiran Pawar",
    role: "Residue truck · MH 16 KP 3304",
    avatar: AVATARS["u-drv-kiran"],
    unread: 0,
    messages: [
      { from: "them", text: "Still loading residue at Coop #12. 6 t on, 10 t left.", at: "06:55" },
    ],
  },
  {
    id: "suresh",
    name: "Suresh Patil",
    role: "Shift in-charge",
    avatar: AVATARS["u-operator"],
    unread: 1,
    messages: [
      { from: "them", text: "D2 pH still falling. I cut napier on that tank.", at: "07:12" },
      { from: "me", text: "Good. Photo the probe after calibrate.", at: "07:18" },
      { from: "them", text: "Job WO-304 is on me. Need 20 min.", at: "07:21" },
    ],
  },
  {
    id: "anita",
    name: "Anita Deshmukh",
    role: "Store",
    avatar: AVATARS["u-store"],
    unread: 0,
    messages: [
      { from: "them", text: "GRN-220 short 1.6 t dung. Paying 38.4 only.", at: "06:44" },
      { from: "me", text: "Correct. Do not pay the PO number.", at: "06:50" },
    ],
  },
  {
    id: "support",
    name: "Urja help",
    role: "Support",
    avatar: AVATARS.support,
    unread: 0,
    messages: [
      { from: "them", text: "Namaste. If a hole is not showing, send a photo of the screen.", at: "Yesterday" },
    ],
  },
];

export const JOB_COMMENTS = [
  {
    id: "c1",
    who: "Suresh Patil",
    text: "Cut napier on D2. pH 6.6 still. Recheck at 2pm.",
    at: "07:22",
  },
  {
    id: "c2",
    who: "Meena Pawar",
    text: "Lab sample taken. Do not add more residue till result.",
    at: "07:40",
  },
];

export type SearchHit = {
  href: string;
  title: string;
  tag: string;
};

export const SEARCH_INDEX: SearchHit[] = [
  { href: "/sales", title: "IOCL overdue ₹53,100", tag: "Money" },
  { href: "/inventory", title: "Napier grass — 1.5 days left", tag: "Stock" },
  { href: "/finance", title: "PO-442 waiting owner tick", tag: "Your yes" },
  { href: "/feedstock", title: "Truck MH-15 on the way", tag: "Trucks" },
  { href: "/digesters", title: "Digester 2 souring", tag: "Tank" },
  { href: "/workforce", title: "Kiran Jadhav absent (floor, not truck)", tag: "Staff" },
  { href: "/feedstock", title: "Kiran Pawar residue truck MH 16 KP 3304", tag: "Trucks" },
  { href: "/lab", title: "Meena Pawar — D2 VFA high", tag: "Lab" },
  { href: "/workforce", title: "Talk to Suresh", tag: "Staff" },
  { href: "/compliance", title: "GST check 31 Aug", tag: "Govt date" },
  { href: "/docs", title: "Fire NOC", tag: "Paper" },
  { href: "/suppliers", title: "Pay Ganesh Transport", tag: "Pay out" },
];

export function googleEmbed(lat: number, lng: number, zoom = 12) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
}

export function googleRouteEmbed(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  return `https://maps.google.com/maps?saddr=${from.lat},${from.lng}&daddr=${to.lat},${to.lng}&hl=en&z=13&t=m&output=embed`;
}

export function googleDirections(from: MapPin, to: MapPin) {
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}`;
}

export function googleDirTo(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${FACTORY.lat},${FACTORY.lng}`;
}

export function googleDirFromFactory(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&origin=${FACTORY.lat},${FACTORY.lng}&destination=${lat},${lng}`;
}
