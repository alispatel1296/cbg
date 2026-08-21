/** Tier 1 — generic factory workflows A–F */

export const PURCHASE_ORDERS = [
  {
    id: "PO-441",
    supplier: "Ganesh Transport",
    item: "Cattle dung",
    qty: 40,
    unit: "t",
    rate: 500,
    date: "2026-08-14",
    status: "approved" as const,
    needsApproval: false,
  },
  {
    id: "PO-442",
    supplier: "Savitri SHG",
    item: "Napier grass",
    qty: 20,
    unit: "t",
    rate: 600,
    date: "2026-08-15",
    status: "awaiting_approval" as const,
    needsApproval: true,
  },
  {
    id: "PO-443",
    supplier: "Village Coop #12",
    item: "Agri residue",
    qty: 25,
    unit: "t",
    rate: 400,
    date: "2026-08-16",
    status: "draft" as const,
    needsApproval: false,
  },
];

export const GRN_NOTES = [
  {
    id: "GRN-220",
    poId: "PO-441",
    supplier: "Ganesh Transport",
    item: "Cattle dung",
    ordered: 40,
    received: 38.4,
    date: "2026-08-16",
    lot: "LOT-D-0816",
    mismatch: true,
  },
  {
    id: "GRN-219",
    poId: "PO-438",
    supplier: "Savitri SHG",
    item: "Napier grass",
    ordered: 12,
    received: 12.1,
    date: "2026-08-16",
    lot: "LOT-N-0816",
    mismatch: false,
  },
  {
    id: "GRN-218",
    poId: "PO-436",
    supplier: "Village Coop #12",
    item: "Agri residue",
    ordered: 16,
    received: 15.6,
    date: "2026-08-15",
    lot: "LOT-R-0815",
    mismatch: true,
  },
];

export const STOCK_MOVES = [
  {
    id: "MV-91",
    item: "Cattle dung",
    qty: "8.4 t",
    from: "Store",
    to: "Production floor",
    lot: "LOT-D-0816",
    by: "Anita Deshmukh",
    ts: "2026-08-16T06:42:00+05:30",
  },
  {
    id: "MV-90",
    item: "Napier grass",
    qty: "12.1 t",
    from: "Store",
    to: "Production floor",
    lot: "LOT-N-0816",
    by: "Anita Deshmukh",
    ts: "2026-08-16T05:55:00+05:30",
  },
  {
    id: "MV-89",
    item: "FOM bags (filled)",
    qty: "310 pcs",
    from: "Production floor",
    to: "Warehouse",
    lot: "FOM-118",
    by: "Suresh Patil",
    ts: "2026-08-16T14:10:00+05:30",
  },
];

export const WASTAGE = [
  {
    id: "W-18",
    item: "Cattle dung",
    qty: "0.6 t",
    reason: "High moisture / rejected at pit",
    lot: "LOT-D-0815",
    date: "2026-08-15",
  },
  {
    id: "W-17",
    item: "Empty bags",
    qty: "24 pcs",
    reason: "Torn in store",
    lot: "SKU-BAG",
    date: "2026-08-12",
  },
];

export const PRODUCTION_ORDERS = [
  {
    id: "PRD-77",
    product: "Purified CBG",
    qty: "1,200 kg",
    target: "2026-08-16",
    line: "Upgrader line A",
    status: "in_progress" as const,
    input: "54.1 t feedstock",
    output: "1,180 kg CBG",
    lots: "LOT-D-0816 · LOT-N-0816",
  },
  {
    id: "PRD-76",
    product: "FOM bags (Grade A)",
    qty: "310 bags",
    target: "2026-08-16",
    line: "Separation bay",
    status: "completed" as const,
    input: "6.2 t solids",
    output: "310 bags",
    lots: "LOT-R-0815",
  },
  {
    id: "PRD-75",
    product: "Purified CBG",
    qty: "1,000 kg",
    target: "2026-08-15",
    line: "Upgrader line A",
    status: "completed" as const,
    input: "48 t feedstock",
    output: "1,040 kg CBG",
    lots: "LOT-D-0815",
  },
  {
    id: "PRD-78",
    product: "FOM bags (Grade B)",
    qty: "200 bags",
    target: "2026-08-18",
    line: "Drying yard",
    status: "pending" as const,
    input: "—",
    output: "—",
    lots: "Not started",
  },
];

export const QUALITY_CHECKS = [
  {
    id: "QC-55",
    batch: "PRD-77",
    result: "pass" as const,
    inspector: "Meena Pawar",
    remarks: "CH₄ 56.8% — within band",
    date: "2026-08-16",
  },
  {
    id: "QC-54",
    batch: "PRD-76",
    result: "pass" as const,
    inspector: "Meena Pawar",
    remarks: "Moisture OK for bagging",
    date: "2026-08-16",
  },
  {
    id: "QC-53",
    batch: "LOT-D-0815",
    result: "fail" as const,
    inspector: "Anita Deshmukh",
    remarks: "Too wet — logged as wastage W-18",
    date: "2026-08-15",
  },
];

export const CUSTOMERS = [
  {
    id: "C-01",
    name: "IOCL Sinnar Retail",
    contact: "Amit Kulkarni",
    phone: "+91 98220 11122",
    address: "IOCL pump, Sinnar Highway, Nashik",
    gst: "27AAACI1681G1Z3",
    creditLimit: 800000,
    terms: "15 days",
  },
  {
    id: "C-02",
    name: "MNGL CGD Node N3",
    contact: "Neha Joshi",
    phone: "+91 98220 33344",
    address: "CGD Node N3, Nashik city",
    gst: "27AABCM1234F1Z8",
    creditLimit: 2500000,
    terms: "30 days",
  },
  {
    id: "C-03",
    name: "Village Coop #12",
    contact: "Ramesh Kolekar",
    phone: "+91 98765 43218",
    address: "Village Coop office, Sinnar taluka",
    gst: "—",
    creditLimit: 50000,
    terms: "Cash",
  },
];

export const SALES_ORDERS = [
  {
    id: "SO-188",
    customer: "IOCL Sinnar Retail",
    item: "CBG",
    qty: "420 kg",
    rate: 45,
    amount: 18900,
    date: "2026-08-16",
    creditOk: true,
  },
  {
    id: "SO-187",
    customer: "MNGL CGD Node N3",
    item: "CBG (pipe)",
    qty: "760 kg",
    rate: 44,
    amount: 33440,
    date: "2026-08-15",
    creditOk: true,
  },
  {
    id: "SO-186",
    customer: "Village Coop #12",
    item: "FOM bags",
    qty: "120 bags",
    rate: 175,
    amount: 21000,
    date: "2026-08-12",
    creditOk: true,
  },
  {
    id: "SO-189",
    customer: "Village Coop #12",
    item: "FOM bags",
    qty: "400 bags",
    rate: 175,
    amount: 70000,
    date: "2026-08-16",
    creditOk: false,
  },
];

export const INVOICES = [
  {
    id: "INV-901",
    soId: "SO-188",
    customer: "IOCL Sinnar Retail",
    amount: 18900,
    tax: 3402,
    total: 22302,
    date: "2026-08-16",
    due: "2026-08-31",
    status: "unpaid" as const,
  },
  {
    id: "INV-900",
    soId: "SO-187",
    customer: "MNGL CGD Node N3",
    amount: 33440,
    tax: 6019,
    total: 39459,
    date: "2026-08-15",
    due: "2026-09-14",
    status: "partial" as const,
    paid: 20000,
  },
  {
    id: "INV-898",
    soId: "SO-186",
    customer: "Village Coop #12",
    amount: 21000,
    tax: 0,
    total: 21000,
    date: "2026-08-12",
    due: "2026-08-12",
    status: "paid" as const,
    paid: 21000,
  },
  {
    id: "INV-890",
    soId: "SO-180",
    customer: "IOCL Sinnar Retail",
    amount: 45000,
    tax: 8100,
    total: 53100,
    date: "2026-07-20",
    due: "2026-08-04",
    status: "overdue" as const,
    paid: 0,
  },
];

export const DISPATCH_NOTES = [
  {
    id: "DN-512",
    invoice: "INV-901",
    what: "420 kg CBG · truck",
    to: "IOCL Sinnar Retail",
    date: "2026-08-16",
  },
  {
    id: "DN-511",
    invoice: "INV-900",
    what: "760 kg CBG · pipeline",
    to: "MNGL CGD Node N3",
    date: "2026-08-15",
  },
];

export const SUPPLIERS = [
  {
    id: "SUP-01",
    name: "Ganesh Transport",
    contact: "Manoj Kale",
    bank: "SBI · XX4421",
    terms: "7 days after GRN",
    outstanding: 19200,
  },
  {
    id: "SUP-02",
    name: "Savitri SHG",
    contact: "Savitri Tai",
    bank: "BOI · XX1188",
    terms: "On weighbridge OK",
    outstanding: 7260,
  },
  {
    id: "SUP-03",
    name: "Village Coop #12",
    contact: "Coop secretary",
    bank: "UPI",
    terms: "On photo + weight",
    outstanding: 2480,
  },
];

export const PAY_VOUCHERS = [
  {
    id: "PV-110",
    supplier: "Ramesh Kolekar",
    amount: 4200,
    mode: "UPI",
    date: "2026-08-16",
    against: "GRN-221 / FB-2408",
  },
  {
    id: "PV-109",
    supplier: "Ganesh Transport",
    amount: 15000,
    mode: "NEFT",
    date: "2026-08-14",
    against: "GRN-215",
  },
];

export const EMPLOYEES = [
  {
    id: "E-01",
    name: "Suresh Patil",
    job: "Shift in-charge",
    dept: "Production",
    joined: "2023-04-01",
    basic: 28000,
    attendPay: 200,
  },
  {
    id: "E-02",
    name: "Anita Deshmukh",
    job: "Store / weighbridge",
    dept: "Purchase",
    joined: "2024-01-12",
    basic: 22000,
    attendPay: 180,
  },
  {
    id: "E-03",
    name: "Ravi More",
    job: "Digester helper",
    dept: "Production",
    joined: "2025-06-01",
    basic: 18000,
    attendPay: 150,
  },
  {
    id: "E-04",
    name: "Kiran Jadhav",
    job: "Purification",
    dept: "Production",
    joined: "2024-09-15",
    basic: 20000,
    attendPay: 160,
  },
  {
    id: "E-05",
    name: "Meena Pawar",
    job: "Lab sample",
    dept: "Quality",
    joined: "2025-02-01",
    basic: 21000,
    attendPay: 170,
  },
  {
    id: "E-06",
    name: "Ganesh Patil",
    job: "Driver",
    dept: "Collection",
    joined: "2023-11-01",
    basic: 19000,
    attendPay: 150,
  },
  {
    id: "E-07",
    name: "Sandeep Shinde",
    job: "Driver",
    dept: "Collection",
    joined: "2024-06-01",
    basic: 18500,
    attendPay: 150,
  },
  {
    id: "E-08",
    name: "Kiran Pawar",
    job: "Driver",
    dept: "Collection",
    joined: "2025-01-10",
    basic: 18000,
    attendPay: 140,
  },
];

export const LEAVE_REQUESTS = [
  {
    id: "LV-22",
    name: "Kiran Jadhav",
    days: 2,
    from: "2026-08-19",
    reason: "Family function",
    status: "pending" as const,
  },
  {
    id: "LV-21",
    name: "Ravi More",
    days: 1,
    from: "2026-08-12",
    reason: "Fever",
    status: "approved" as const,
  },
];

export const SHIFTS = [
  { name: "Morning 6–14", count: 4, people: "Suresh, Anita, Meena, Ravi (late)" },
  { name: "Collection", count: 3, people: "Ganesh, Sandeep, Kiran Pawar — on trucks" },
  { name: "Afternoon 14–22", count: 0, people: "Kiran Jadhav absent — purification hole" },
];

export const TASKS = [
  {
    id: "TK-41",
    title: "Calibrate H₂S probe D2",
    who: "Suresh Patil",
    due: "2026-08-18",
    status: "pending" as const,
  },
  {
    id: "TK-40",
    title: "Upload missing photo FB-2405",
    who: "Anita Deshmukh",
    due: "2026-08-17",
    status: "in_progress" as const,
  },
  {
    id: "TK-39",
    title: "Bag FOM-116 remaining",
    who: "Ravi More",
    due: "2026-08-14",
    status: "overdue" as const,
  },
  {
    id: "TK-38",
    title: "Scrubber media check",
    who: "Suresh Patil",
    due: "2026-08-15",
    status: "done" as const,
  },
];

export const PAYSLIPS = [
  {
    id: "PAY-E01-07",
    name: "Suresh Patil",
    month: "Jul 2026",
    days: 26,
    gross: 33200,
    deduct: 1200,
    net: 32000,
    advance: 0,
  },
  {
    id: "PAY-E02-07",
    name: "Anita Deshmukh",
    month: "Jul 2026",
    days: 25,
    gross: 26500,
    deduct: 2500,
    net: 24000,
    advance: 2000,
  },
  {
    id: "PAY-E04-07",
    name: "Kiran Jadhav",
    month: "Jul 2026",
    days: 24,
    gross: 23840,
    deduct: 0,
    net: 23840,
    advance: 0,
  },
];

export const ADVANCES = [
  {
    id: "ADV-9",
    name: "Anita Deshmukh",
    amount: 5000,
    date: "2026-07-05",
    left: 2000,
    status: "needs_approval" as const,
  },
  {
    id: "ADV-8",
    name: "Ravi More",
    amount: 3000,
    date: "2026-06-20",
    left: 0,
    status: "cleared" as const,
  },
];

export const APPROVALS = [
  {
    id: "AP-12",
    what: "PO-442 · Napier 20 t (₹12,000)",
    type: "Purchase",
    askedBy: "Anita Deshmukh",
    status: "pending" as const,
  },
  {
    id: "AP-11",
    what: "Salary advance ₹5,000 — Anita",
    type: "Advance",
    askedBy: "HR",
    status: "pending" as const,
  },
  {
    id: "AP-10",
    what: "Discount 8% on INV-901",
    type: "Discount",
    askedBy: "Sales",
    status: "approved" as const,
  },
];

export const AUDIT_LOG = [
  {
    id: "AU-8841",
    who: "Anita Deshmukh",
    action: "Created GRN-220 (38.4 t vs 40 ordered)",
    when: "2026-08-16T06:44:00+05:30",
  },
  {
    id: "AU-8840",
    who: "Rajesh Mehta",
    action: "Approved PO-441",
    when: "2026-08-14T11:02:00+05:30",
  },
  {
    id: "AU-8839",
    who: "Meena Pawar",
    action: "QC-55 pass on PRD-77",
    when: "2026-08-16T08:20:00+05:30",
  },
  {
    id: "AU-8838",
    who: "System",
    action: "Low-stock flag · Napier grass near reorder",
    when: "2026-08-16T07:00:00+05:30",
  },
];

export const FINANCE_SNAP = {
  salesMonth: 189000,
  expensesMonth: 124000,
  receivable: 94861,
  payable: 28940,
  profit: 65000,
};

export const DOC_RENEWALS = [
  {
    id: "DOC-02",
    title: "Fire NOC",
    renew: "2026-11-03",
    daysLeft: 77,
  },
  {
    id: "DOC-05",
    title: "Factory license",
    renew: "2026-09-30",
    daysLeft: 43,
  },
  {
    id: "DOC-06",
    title: "GST registration check",
    renew: "2026-08-31",
    daysLeft: 13,
  },
];
