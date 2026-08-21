import type { Role } from "./types";

/** First-sight desks for each seat — five taps, then the rest stays folded. */
export const QUICK_PATHS: Record<Role, string[]> = {
  super_admin: ["/dashboard", "/sales", "/finance", "/feedstock", "/digesters"],
  plant_owner: ["/dashboard", "/sales", "/finance", "/feedstock", "/digesters"],
  plant_operator: ["/dashboard", "/digesters", "/work-orders", "/lab", "/feedstock"],
  auditor: ["/evidence", "/reports", "/data-quality", "/compliance", "/lab"],
  store_staff: ["/dashboard", "/inventory", "/feedstock", "/work-orders", "/me"],
  production_staff: ["/dashboard", "/production", "/fertilizer", "/work-orders", "/me"],
  sales_staff: ["/dashboard", "/sales", "/me"],
  accountant: ["/dashboard", "/finance", "/sales", "/suppliers", "/me"],
  hr_staff: ["/dashboard", "/workforce", "/people", "/me"],
  employee: ["/me"],
  driver: ["/me", "/feedstock"],
  lab_staff: ["/lab", "/digesters", "/me"],
};

export function quickPaths(
  role: Role,
  allowed: (href: string) => boolean,
): string[] {
  return (QUICK_PATHS[role] ?? ["/me"]).filter(allowed);
}
