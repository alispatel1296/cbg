import { APPROVALS, INVOICES, SUPPLIERS } from "./factory-ops";

export function openInr(bill: { total: number; paid?: number }) {
  return bill.total - (bill.paid ?? 0);
}

export const OVERDUE_BILLS = INVOICES.filter((i) => i.status === "overdue");
export const OPEN_BILLS = INVOICES.filter((i) => i.status !== "paid");

export const OVERDUE_INR = OVERDUE_BILLS.reduce((s, i) => s + openInr(i), 0);
export const RECEIVABLE_INR = OPEN_BILLS.reduce((s, i) => s + openInr(i), 0);

export const PENDING_TICKS = APPROVALS.filter((a) => a.status === "pending");
export const PAYABLE_INR = SUPPLIERS.reduce((s, x) => s + x.outstanding, 0);
