"use client";

import { useState } from "react";
import Link from "next/link";
import { DEVICES } from "@/lib/gap-data";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import { Cpu } from "lucide-react";

export default function DevicesPage() {
  const online = DEVICES.filter((d) => d.status === "online").length;
  const bad = DEVICES.filter((d) => d.status !== "online").length;
  const [wait, setWait] = useState(false);

  return (
    <div>
      <PageHeader
        color="teal"
        title="Are machines working?"
        description="If a meter goes silent, your numbers and money go weak."
      />

      <SimpleGuide
        icon={Cpu}
        plain="Green = working. Yellow = weak. Red = silent. Fix silent ones first."
        like="Heartbeat check for hardware"
      />

      <Decide
        cue="Fix first"
        analysis={`${DEVICES.find((d) => d.status === "offline")?.name ?? "A meter"} is silent. ${bad} machine(s) need a person. Carbon paper gets weak if this stays dark.`}
        decision="Send a fitter to the silent meter, or wait till morning."
      >
        <Link href="/work-orders">
          <Button variant="gold">Send fitter (job)</Button>
        </Link>
        <Button variant="secondary" onClick={() => setWait(true)}>
          {wait ? "Waiting till morning" : "Wait till morning"}
        </Button>
      </Decide>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Panel className="animate-rise border-l-4 border-l-ok">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Working
          </p>
          <p className="font-display text-4xl font-bold text-ok">{online}</p>
        </Panel>
        <Panel className="animate-rise-delay-1 border-l-4 border-l-amber">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Need attention
          </p>
          <p className="font-display text-4xl font-bold text-amber">{bad}</p>
        </Panel>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DEVICES.map((d, i) => (
          <Panel
            key={d.id}
            className={
              i % 3 === 1
                ? "animate-rise-delay-1"
                : i % 3 === 2
                  ? "animate-rise-delay-2"
                  : "animate-rise"
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-lg font-bold">{d.name}</p>
                <p className="text-xs text-muted">{d.type}</p>
              </div>
              <StatusPill
                status={
                  d.status === "online"
                    ? "green"
                    : d.status === "degraded"
                      ? "amber"
                      : "red"
                }
                label={d.status}
              />
            </div>
            <p className="mt-3 font-mono text-[11px] text-muted">{d.id}</p>
            <p className="mt-1 text-xs text-muted">
              Last seen · {new Date(d.lastSeen).toLocaleString("en-IN")}
            </p>
            {d.battery != null ? (
              <p className="mt-1 text-xs font-semibold text-amber">
                Battery {d.battery}%
              </p>
            ) : null}
          </Panel>
        ))}
      </div>
    </div>
  );
}
