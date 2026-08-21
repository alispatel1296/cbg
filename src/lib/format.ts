export function formatInr(value: number, compact = false): string {
  if (compact) {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 1): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function roleLabel(role: string): string {
  const map: Record<string, string> = {
    super_admin: "Company Admin",
    plant_owner: "Business Owner",
    plant_operator: "Plant Staff",
    auditor: "Outside Checker",
    store_staff: "Store / Purchase",
    production_staff: "Production",
    sales_staff: "Sales",
    accountant: "Accountant",
    hr_staff: "HR / Admin",
    employee: "Employee",
    driver: "Truck driver",
    lab_staff: "Lab",
  };
  return map[role] ?? role;
}

export function creditStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "Still counting",
    submitted: "Sent for check",
    under_verification: "Auditor checking",
    issued: "Credits ready",
    sold: "Money in hand",
  };
  return map[status] ?? status;
}
