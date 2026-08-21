"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth";
import {
  ACTION_ROLES,
  SEED_AUDIT,
  SEED_FOM,
  SEED_JOBS,
  SEED_LEAVE,
  SEED_ORDERS,
  SEED_PAY,
  SEED_PROD,
  SEED_PURCHASES,
  SEED_STAFF,
  SEED_TRUCKS,
  canDo,
  nextId,
  stampNow,
  villageRoute,
  type BookAction,
  type BookAudit,
  type BookFom,
  type BookLeave,
  type BookOrder,
  type BookPay,
  type BookProd,
  type BookPurchase,
  type BookTruck,
  type DiaryRow,
  type PlantJob,
  type StaffPerson,
  type WaMsg,
} from "./book";
import { AVATARS, PHOTOS } from "./extras";

type Persist = {
  extraStaff: StaffPerson[];
  extraTrucks: BookTruck[];
  extraJobs: PlantJob[];
  extraOrders: BookOrder[];
  extraPurchases: BookPurchase[];
  extraPayments: BookPay[];
  extraProd: BookProd[];
  extraFom: BookFom[];
  extraLeave: BookLeave[];
  leave: Record<string, BookLeave["status"]>;
  jobStatus: Record<string, PlantJob["status"]>;
  prodStatus: Record<string, BookProd["status"]>;
  poStatus: Record<string, BookPurchase["status"]>;
  ticks: Record<string, "pending" | "approved" | "held">;
  audit: BookAudit[];
  paidTrips: Record<string, boolean>;
  paidDrivers: Record<string, boolean>;
  calls: Record<string, string>;
  wa: WaMsg[];
  diary: DiaryRow[];
};

const KEY = "urja-book-v1";

function load(): Persist | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Persist) : null;
  } catch {
    return null;
  }
}

interface BookValue {
  staff: StaffPerson[];
  trucks: BookTruck[];
  jobs: PlantJob[];
  orders: BookOrder[];
  purchases: BookPurchase[];
  payments: BookPay[];
  production: BookProd[];
  fom: BookFom[];
  leave: BookLeave[];
  audit: BookAudit[];
  can: (action: BookAction) => boolean;
  whoCan: (action: BookAction) => string;
  addStaff: (input: {
    name: string;
    job: string;
    dept: string;
    phone: string;
    kind: "staff" | "driver";
  }) => string;
  addTruck: (input: {
    plate: string;
    load: string;
    qty: string;
    village: string;
    farmer: string;
    driverId: string;
  }) => string;
  addJob: (input: {
    title: string;
    assigneeId: string;
    due: string;
    priority: PlantJob["priority"];
  }) => string;
  addOrder: (input: {
    customer: string;
    item: string;
    qty: string;
    amount: number;
  }) => string;
  addPurchase: (input: {
    supplier: string;
    item: string;
    qty: number;
    rate: number;
    date: string;
  }) => string;
  addPayment: (input: {
    supplier: string;
    amount: number;
    against: string;
  }) => string;
  addFloor: (input: { product: string; qty: string; line: string }) => string;
  addFom: (input: { bags: number; grade: string }) => string;
  setLeave: (id: string, status: BookLeave["status"]) => void;
  askLeave: (input: {
    name: string;
    days: number;
    from: string;
    reason: string;
  }) => string;
  setJobDone: (id: string) => void;
  startFloor: (id: string) => void;
  paidTrips: Record<string, boolean>;
  paidDrivers: Record<string, boolean>;
  payTrip: (truckId: string, amount: number, farmer: string) => void;
  payDriverMonth: (staffId: string, name: string, amount: number) => void;
  calls: Record<string, string>;
  recordCall: (id: string, state: string, desk: string) => void;
  ticks: Record<string, "pending" | "approved" | "held">;
  setTick: (id: string, status: "approved" | "held", what: string) => void;
  wa: WaMsg[];
  sendWhatsApp: (input: {
    to: string;
    body: string;
    kind?: WaMsg["kind"];
    desk?: string;
  }) => void;
  diary: DiaryRow[];
  addDiary: (input: {
    date: string;
    title: string;
    kind: DiaryRow["kind"];
  }) => void;
}

const Ctx = createContext<BookValue | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [extraStaff, setExtraStaff] = useState<StaffPerson[]>([]);
  const [extraTrucks, setExtraTrucks] = useState<BookTruck[]>([]);
  const [extraJobs, setExtraJobs] = useState<PlantJob[]>([]);
  const [extraOrders, setExtraOrders] = useState<BookOrder[]>([]);
  const [extraPurchases, setExtraPurchases] = useState<BookPurchase[]>([]);
  const [extraPayments, setExtraPayments] = useState<BookPay[]>([]);
  const [extraProd, setExtraProd] = useState<BookProd[]>([]);
  const [extraFom, setExtraFom] = useState<BookFom[]>([]);
  const [extraLeave, setExtraLeave] = useState<BookLeave[]>([]);
  const [leaveMap, setLeaveMap] = useState<Record<string, BookLeave["status"]>>(
    {},
  );
  const [jobMap, setJobMap] = useState<Record<string, PlantJob["status"]>>({});
  const [prodMap, setProdMap] = useState<Record<string, BookProd["status"]>>({});
  const [poMap, setPoMap] = useState<Record<string, BookPurchase["status"]>>({});
  const [ticks, setTicks] = useState<Record<string, "pending" | "approved" | "held">>({});
  const [auditExtra, setAuditExtra] = useState<BookAudit[]>([]);
  const [paidTrips, setPaidTrips] = useState<Record<string, boolean>>({});
  const [paidDrivers, setPaidDrivers] = useState<Record<string, boolean>>({});
  const [calls, setCalls] = useState<Record<string, string>>({});
  const [wa, setWa] = useState<WaMsg[]>([]);
  const [diary, setDiary] = useState<DiaryRow[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = load();
    if (p) {
      setExtraStaff(p.extraStaff ?? []);
      setExtraTrucks(p.extraTrucks ?? []);
      setExtraJobs(p.extraJobs ?? []);
      setExtraOrders(p.extraOrders ?? []);
      setExtraPurchases(p.extraPurchases ?? []);
      setExtraPayments(p.extraPayments ?? []);
      setExtraProd(p.extraProd ?? []);
      setExtraFom(p.extraFom ?? []);
      setExtraLeave(p.extraLeave ?? []);
      setLeaveMap(p.leave ?? {});
      setJobMap(p.jobStatus ?? {});
      setProdMap(p.prodStatus ?? {});
      setPoMap(p.poStatus ?? {});
      setTicks(p.ticks ?? {});
      setAuditExtra(p.audit ?? []);
      setPaidTrips(p.paidTrips ?? {});
      setPaidDrivers(p.paidDrivers ?? {});
      setCalls(p.calls ?? {});
      setWa(p.wa ?? []);
      setDiary(p.diary ?? []);
    }
    setReady(true);
  }, []);

  const persist = useCallback((patch: Partial<Persist>) => {
    const cur = load() ?? {
      extraStaff: [],
      extraTrucks: [],
      extraJobs: [],
      extraOrders: [],
      extraPurchases: [],
      extraPayments: [],
      extraProd: [],
      extraFom: [],
      extraLeave: [],
      leave: {},
      jobStatus: {},
      prodStatus: {},
      poStatus: {},
      ticks: {},
      audit: [],
      paidTrips: {},
      paidDrivers: {},
      calls: {},
      wa: [],
      diary: [],
    };
    localStorage.setItem(KEY, JSON.stringify({ ...cur, ...patch }));
  }, []);

  const staff = useMemo(() => [...extraStaff, ...SEED_STAFF], [extraStaff]);
  const trucks = useMemo(() => [...extraTrucks, ...SEED_TRUCKS], [extraTrucks]);
  const jobs = useMemo(
    () =>
      [...extraJobs, ...SEED_JOBS].map((j) => ({
        ...j,
        status: jobMap[j.id] ?? j.status,
      })),
    [extraJobs, jobMap],
  );
  const orders = useMemo(() => [...extraOrders, ...SEED_ORDERS], [extraOrders]);
  const purchases = useMemo(
    () =>
      [...extraPurchases, ...SEED_PURCHASES].map((p) => ({
        ...p,
        status: poMap[p.id] ?? p.status,
      })),
    [extraPurchases, poMap],
  );
  const payments = useMemo(
    () => [...extraPayments, ...SEED_PAY],
    [extraPayments],
  );
  const production = useMemo(
    () =>
      [...extraProd, ...SEED_PROD].map((p) => ({
        ...p,
        status: prodMap[p.id] ?? p.status,
      })),
    [extraProd, prodMap],
  );
  const fom = useMemo(() => [...extraFom, ...SEED_FOM], [extraFom]);
  const leave = useMemo(
    () =>
      [...extraLeave, ...SEED_LEAVE].map((l) => ({
        ...l,
        status: leaveMap[l.id] ?? l.status,
      })),
    [extraLeave, leaveMap],
  );
  const audit = useMemo(() => [...auditExtra, ...SEED_AUDIT], [auditExtra]);

  const note = useCallback(
    (action: string, desk: string) => {
      const row: BookAudit = {
        id: `AU-${Date.now()}`,
        action,
        who: user?.name ?? "Unknown",
        when: new Date().toISOString(),
        desk,
      };
      setAuditExtra((prev) => {
        const next = [row, ...prev];
        persist({ audit: next });
        return next;
      });
    },
    [persist, user?.name],
  );

  const can = useCallback(
    (action: BookAction) => canDo(user?.role, action),
    [user?.role],
  );

  const whoCan = useCallback((action: BookAction) => {
    const labels: Record<string, string> = {
      store_staff: "Store",
      plant_operator: "Plant staff",
      plant_owner: "Owner",
      super_admin: "Admin",
      hr_staff: "HR",
      production_staff: "Production",
      sales_staff: "Sales",
      accountant: "Accountant",
      lab_staff: "Lab",
      driver: "Driver",
      employee: "Floor",
    };
    return ACTION_ROLES[action].map((r) => labels[r] ?? r).join(" / ");
  }, []);

  const addStaff: BookValue["addStaff"] = (input) => {
    if (!user) return "";
    const id = nextId("E", staff);
    const row: StaffPerson = {
      id,
      name: input.name,
      job: input.job,
      dept: input.dept,
      phone: input.phone,
      today: "present",
      inTime: "—",
      kind: input.kind,
      stamp: stampNow(user, "Staff", `hired as ${input.kind}`),
    };
    setExtraStaff((prev) => {
      const next = [row, ...prev];
      persist({ extraStaff: next });
      return next;
    });
    note(`Hired ${input.name} as ${input.job} (${id})`, "Staff");
    return id;
  };

  const addTruck: BookValue["addTruck"] = (input) => {
    if (!user) return "";
    const driver = staff.find((s) => s.id === input.driverId);
    if (!driver) return "";
    const id = input.plate.replace(/\s+/g, "-");
    const lat = 19.88 + Math.random() * 0.03;
    const lng = 73.96 + Math.random() * 0.04;
    const row: BookTruck = {
      id,
      plate: input.plate,
      photo: PHOTOS.truck,
      status: "on_road",
      statusLabel: "On the road",
      load: input.load,
      qty: input.qty,
      from: input.village,
      to: "Greenfield weighbridge",
      lat,
      lng,
      departed: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      eta: "Today",
      lastPing: "Now",
      kmLeft: 14,
      speedKmh: 32,
      lot: `LOT-${Date.now().toString().slice(-4)}`,
      farmer: input.farmer,
      driverStaffId: driver.id,
      progress: 0.2,
      route: villageRoute(input.village, lat, lng),
      driver: {
        name: driver.name,
        phone: driver.phone,
        license: "Pending scan",
        photo: AVATARS["u-employee"],
        hoursToday: "0 h 10 m",
      },
      helper: "—",
      stamp: stampNow(
        user,
        "Trucks",
        `logged on Trucks · driver ${driver.name} from Staff`,
      ),
    };
    setExtraTrucks((prev) => {
      const next = [row, ...prev];
      persist({ extraTrucks: next });
      return next;
    });
    note(
      `Logged truck ${input.plate} · assigned driver ${driver.name} · ${input.load} from ${input.village}`,
      "Trucks",
    );
    return id;
  };

  const addJob: BookValue["addJob"] = (input) => {
    if (!user) return "";
    const who = staff.find((s) => s.id === input.assigneeId);
    if (!who) return "";
    const id = nextId("WO", jobs);
    const row: PlantJob = {
      id,
      title: input.title,
      assigneeId: who.id,
      assigneeName: who.name,
      due: input.due,
      priority: input.priority,
      status: "open",
      source: `Typed by ${user.name}`,
      stamp: stampNow(user, "Jobs", `assigned to ${who.name} on Jobs`),
    };
    setExtraJobs((prev) => {
      const next = [row, ...prev];
      persist({ extraJobs: next });
      return next;
    });
    note(`Assigned ${id} “${input.title}” to ${who.name}`, "Jobs");
    return id;
  };

  const addOrder: BookValue["addOrder"] = (input) => {
    if (!user) return "";
    const id = nextId("SO", orders);
    const row: BookOrder = {
      id,
      customer: input.customer,
      item: input.item,
      qty: input.qty,
      rate: Math.round(input.amount / Math.max(1, Number.parseFloat(input.qty) || 1)),
      amount: input.amount,
      date: new Date().toISOString().slice(0, 10),
      creditOk: true,
      stamp: stampNow(user, "Sales", "typed on Sales"),
    };
    setExtraOrders((prev) => {
      const next = [row, ...prev];
      persist({ extraOrders: next });
      return next;
    });
    note(`New order ${id} · ${input.customer} · ${input.item}`, "Sales");
    return id;
  };

  const addPurchase: BookValue["addPurchase"] = (input) => {
    if (!user) return "";
    const id = nextId("PO", purchases);
    const row: BookPurchase = {
      id,
      supplier: input.supplier,
      item: input.item,
      qty: input.qty,
      unit: "t",
      rate: input.rate,
      date: input.date,
      status: input.qty * input.rate > 10000 ? "awaiting_approval" : "draft",
      needsApproval: input.qty * input.rate > 10000,
      stamp: stampNow(user, "Stock", "typed on Stock"),
    };
    setExtraPurchases((prev) => {
      const next = [row, ...prev];
      persist({ extraPurchases: next });
      return next;
    });
    note(`Purchase ${id} · ${input.item} from ${input.supplier}`, "Stock");
    return id;
  };

  const addPayment: BookValue["addPayment"] = (input) => {
    if (!user) return "";
    const id = nextId("PV", payments);
    const row: BookPay = {
      id,
      supplier: input.supplier,
      amount: input.amount,
      mode: "UPI",
      date: new Date().toISOString().slice(0, 10),
      against: input.against,
      stamp: stampNow(user, "Pay out", "typed on Pay out"),
    };
    setExtraPayments((prev) => {
      const next = [row, ...prev];
      persist({ extraPayments: next });
      return next;
    });
    note(`Paid ${input.supplier} ₹${input.amount} (${id})`, "Pay out");
    return id;
  };

  const addFloor: BookValue["addFloor"] = (input) => {
    if (!user) return "";
    const id = nextId("PRD", production);
    const row: BookProd = {
      id,
      product: input.product,
      qty: input.qty,
      target: new Date().toISOString().slice(0, 10),
      line: input.line,
      status: "pending",
      input: "—",
      output: "—",
      lots: "Not started",
      stamp: stampNow(user, "Floor", "typed on Floor"),
    };
    setExtraProd((prev) => {
      const next = [row, ...prev];
      persist({ extraProd: next });
      return next;
    });
    note(`Floor job ${id} · ${input.product} on ${input.line}`, "Floor");
    return id;
  };

  const addFom: BookValue["addFom"] = (input) => {
    if (!user) return "";
    const id = nextId("FOM", fom);
    const row: BookFom = {
      id,
      date: new Date().toISOString().slice(0, 10),
      solidT: 0,
      liquidKl: 0,
      bags: input.bags,
      grade: input.grade,
      status: "bagged",
      stamp: stampNow(user, "FOM", "typed on FOM"),
    };
    setExtraFom((prev) => {
      const next = [row, ...prev];
      persist({ extraFom: next });
      return next;
    });
    note(`FOM batch ${id} · ${input.bags} bags ${input.grade}`, "FOM");
    return id;
  };

  const setLeave = (id: string, status: BookLeave["status"]) => {
    setLeaveMap((prev) => {
      const next = { ...prev, [id]: status };
      persist({ leave: next });
      return next;
    });
    const row = leave.find((l) => l.id === id);
    note(`Leave ${id} for ${row?.name ?? id} → ${status}`, "Staff");
  };

  const askLeave = (input: {
    name: string;
    days: number;
    from: string;
    reason: string;
  }) => {
    if (!user) return "";
    const id = `LV-${Date.now().toString().slice(-5)}`;
    const row: BookLeave = {
      id,
      name: input.name,
      days: input.days,
      from: input.from,
      reason: input.reason,
      status: "pending",
      stamp: stampNow(user, "My card", "asked on My card"),
    };
    setExtraLeave((prev) => {
      const next = [row, ...prev];
      persist({ extraLeave: next });
      return next;
    });
    note(`${input.name} asked leave ${input.days} day(s) from ${input.from}`, "My card");
    return id;
  };

  const setTick = (id: string, status: "approved" | "held", what: string) => {
    setTicks((prev) => {
      const next = { ...prev, [id]: status };
      persist({ ticks: next });
      return next;
    });
    if (id === "AP-12" && status === "approved") {
      setPoMap((prev) => {
        const next = { ...prev, "PO-442": "approved" as const };
        persist({ poStatus: next });
        return next;
      });
    }
    recordCall(
      status === "approved" ? `allow-${id}` : `hold-${id}`,
      status === "approved" ? `Allowed: ${what}` : `Held: ${what}`,
      "Cash",
    );
  };

  const setJobDone = (id: string) => {
    setJobMap((prev) => {
      const next = { ...prev, [id]: "done" as const };
      persist({ jobStatus: next });
      return next;
    });
    note(`Marked job ${id} done`, "Jobs");
  };

  const startFloor = (id: string) => {
    setProdMap((prev) => {
      const next = { ...prev, [id]: "in_progress" as const };
      persist({ prodStatus: next });
      return next;
    });
    note(`Started floor job ${id}`, "Floor");
  };

  const payTrip = (truckId: string, amount: number, farmer: string) => {
    setPaidTrips((prev) => {
      const next = { ...prev, [truckId]: true };
      persist({ paidTrips: next });
      return next;
    });
    note(`Paid farmer ${farmer} ₹${amount} for trip ${truckId}`, "Trucks");
  };

  const payDriverMonth = (staffId: string, name: string, amount: number) => {
    setPaidDrivers((prev) => {
      const next = { ...prev, [staffId]: true };
      persist({ paidDrivers: next });
      return next;
    });
    note(`Paid driver ${name} monthly ₹${amount}`, "Trucks");
  };

  const recordCall = (id: string, state: string, desk: string) => {
    setCalls((prev) => {
      const next = { ...prev, [id]: state };
      persist({ calls: next });
      return next;
    });
    note(state, desk);
  };

  const sendWhatsApp = (input: {
    to: string;
    body: string;
    kind?: WaMsg["kind"];
    desk?: string;
  }) => {
    const row: WaMsg = {
      id: `WA-${Date.now()}`,
      to: input.to,
      body: input.body,
      at: new Date().toISOString(),
      by: user?.name ?? "Unknown",
      kind: input.kind ?? "alert",
    };
    setWa((prev) => {
      const next = [row, ...prev];
      persist({ wa: next });
      return next;
    });
    note(`WhatsApp to ${input.to}: ${input.body}`, input.desk ?? "Warnings");
  };

  const addDiary = (input: {
    date: string;
    title: string;
    kind: DiaryRow["kind"];
  }) => {
    const row: DiaryRow = {
      id: `DY-${Date.now()}`,
      date: input.date,
      title: input.title,
      kind: input.kind,
      by: user?.name ?? "Unknown",
      at: new Date().toISOString(),
    };
    setDiary((prev) => {
      const next = [row, ...prev];
      persist({ diary: next });
      return next;
    });
    note(`Diary ${input.date}: ${input.title}`, "Dates");
  };

  const value: BookValue = {
    staff,
    trucks,
    jobs,
    orders,
    purchases,
    payments,
    production,
    fom,
    leave,
    audit,
    can,
    whoCan,
    addStaff,
    addTruck,
    addJob,
    addOrder,
    addPurchase,
    addPayment,
    addFloor,
    addFom,
    setLeave,
    askLeave,
    setJobDone,
    startFloor,
    paidTrips,
    paidDrivers,
    payTrip,
    payDriverMonth,
    calls,
    recordCall,
    ticks,
    setTick,
    wa,
    sendWhatsApp,
    diary,
    addDiary,
  };

  if (!ready) {
    /* still provide seed so desks never render empty */
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBook() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBook must be inside BookProvider");
  return v;
}
