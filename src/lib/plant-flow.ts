/** Shared call ids — one desk writes, the next desk must see the same id. */

export const FLOW = {
  labSlow: "lab-slow-d2",
  labWait: "lab-wait-sample",
  holdFeed: "hold-feed-d2",
  mixLock: "mix-lock",
  mixKeep: "mix-keep",
  holdTruck: "hold-next-truck",
  holdLine: "hold-line",
  chaseFom: "chase-fom-savitri",
  holdCoop: "hold-coop-pay",
} as const;

export const WATCH = {
  trucks: [FLOW.mixLock, FLOW.holdCoop],
  store: [FLOW.mixLock, "allow-AP-12", "hold-AP-12"],
  tanks: [FLOW.labSlow, FLOW.labWait, FLOW.holdFeed],
  lab: [FLOW.holdFeed, FLOW.mixLock],
  mix: [FLOW.mixLock, FLOW.labSlow],
  sales: [FLOW.holdTruck],
  floor: [FLOW.holdLine],
  staff: [FLOW.holdLine],
  fom: [FLOW.chaseFom],
  cash: ["allow-AP-12", "hold-AP-12", FLOW.holdTruck, FLOW.chaseFom],
  owner: [
    FLOW.labSlow,
    FLOW.holdFeed,
    FLOW.mixLock,
    FLOW.holdTruck,
    FLOW.chaseFom,
    "allow-AP-12",
    "hold-AP-12",
  ],
} as const;
