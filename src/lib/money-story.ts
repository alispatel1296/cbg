import { DIGESTER_CRASH_COST, PURIFICATION, BLEND_RECOMMENDATION } from "./product-data";
import { FINANCE_SNAP } from "./factory-ops";

/** The number a tight owner must feel is cheap — one figure, no range. */
export const URJA_PRICE_INR = 75_000;

export const STOPPED_DAY_INR =
  DIGESTER_CRASH_COST.gasLossPerDayKg * DIGESTER_CRASH_COST.inrPerKgCbg;

export const CH4_WASTE_MONTH_INR = PURIFICATION.lostInrToday * 30;

export const MIX_EXTRA_MONTH_INR = BLEND_RECOMMENDATION.extraInrMonth;

export const CRASH_LOSS_INR = DIGESTER_CRASH_COST.estimatedLossInr;

export const DAYS_TO_EARN_FEE_FROM_CH4 = Math.ceil(
  URJA_PRICE_INR / PURIFICATION.lostInrToday,
);

export const DAYS_TO_EARN_FEE_FROM_MIX = Math.ceil(
  URJA_PRICE_INR / BLEND_RECOMMENDATION.extraInrDay,
);

export const DAYS_STOPPED_EQUALS_FEE = Number(
  (URJA_PRICE_INR / STOPPED_DAY_INR).toFixed(1),
);

export const MONTHS_OF_URJA_PER_CRASH = Math.round(
  CRASH_LOSS_INR / URJA_PRICE_INR,
);

export const MONEY_HOLES = [
  {
    id: "stop",
    rupees: STOPPED_DAY_INR,
    when: "If the line stops for 1 day",
    plain: "No dung, no gas, no bill. That one day is already most of the monthly fee.",
  },
  {
    id: "filter",
    rupees: CH4_WASTE_MONTH_INR,
    when: "Gas cleaning waste · every month",
    plain: "Dirty gas going out the pipe. You cannot see it in a register. It is already more than ₹75,000.",
  },
  {
    id: "mix",
    rupees: MIX_EXTRA_MONTH_INR,
    when: "Wrong mix of dung and grass · every month",
    plain: "Same trucks, less gas. The extra you did not make is 2–3 times the fee.",
  },
  {
    id: "crash",
    rupees: CRASH_LOSS_INR,
    when: "One tank goes sour · about 3 weeks",
    plain: "That one crash is more than a year of Urja. Yellow warning is cheaper than a dead tank.",
  },
  {
    id: "stuck",
    rupees: FINANCE_SNAP.receivable,
    when: "Customers holding your money · right now",
    plain: "Not profit. Not sales. Money that is yours, sitting in their pocket.",
  },
] as const;
