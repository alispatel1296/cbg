export type Role =
  | "super_admin"
  | "plant_owner"
  | "plant_operator"
  | "auditor"
  | "store_staff"
  | "production_staff"
  | "sales_staff"
  | "accountant"
  | "hr_staff"
  | "employee"
  | "driver"
  | "lab_staff";

export type TierId = 1 | 2 | 3;

export type HealthStatus = "green" | "amber" | "red";

export type Methodology = "BEE CCTS" | "Verra" | "Gold Standard";

export type CreditStatus =
  | "draft"
  | "submitted"
  | "under_verification"
  | "issued"
  | "sold";

export type AlertSeverity = "critical" | "warning" | "info";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  plantIds: string[];
  onboardingComplete: boolean;
  /** Commercial package — demo switchable */
  tier: TierId;
}

export interface Plant {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  capacityTpd: number;
  digesterCount: number;
  feedstockTypes: string[];
  methodology: Methodology;
  healthScore: number;
  healthStatus: HealthStatus;
}

export interface DigesterReading {
  digesterId: string;
  name: string;
  ph: number;
  temperatureC: number;
  ch4Pct: number;
  co2Pct: number;
  h2sPpm: number;
  gasYieldM3h: number;
  status: HealthStatus;
  anomaly?: string;
}

export interface FeedstockBatch {
  id: string;
  timestamp: string;
  source: string;
  village: string;
  weightTonnes: number;
  feedstockType: string;
  moisturePct: number;
  qualityFlag: "good" | "fair" | "poor";
  lat: number;
  lng: number;
  photoAttached: boolean;
  amountDueInr: number;
  paid: boolean;
}

export interface GasProduction {
  id: string;
  timestamp: string;
  rawBiogasM3: number;
  purifiedCbgKg: number;
  cycleId: string;
}

export interface GasDispatch {
  id: string;
  timestamp: string;
  volumeKg: number;
  mode: "cylinder" | "truck" | "pipeline";
  destination: string;
  destinationType: "retail_pump" | "cgd_network";
}

export interface CarbonPeriod {
  capturedTco2e: number;
  projectedAnnualTco2e: number;
  cccPriceInr: number;
  baselineTco2e: number;
  status: CreditStatus;
}

export interface Report {
  id: string;
  title: string;
  type: "monitoring" | "pdd" | "verification";
  methodology: Methodology;
  createdAt: string;
  version: string;
  status: "draft" | "sent" | "under_review" | "approved" | "needs_correction";
}

export interface EvidenceEntry {
  id: string;
  timestamp: string;
  category: "sensor" | "weighbridge" | "dispatch" | "report";
  summary: string;
  hash: string;
  prevHash: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  plantId: string;
  createdAt: string;
  acknowledged: boolean;
  channel: ("in_app" | "sms" | "whatsapp")[];
}

export interface RevenueCallout {
  id: string;
  title: string;
  amountInr: number;
  detail: string;
}
