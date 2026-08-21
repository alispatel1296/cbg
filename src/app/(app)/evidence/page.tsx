"use client";

import { EVIDENCE } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import { Link2, Lock, ShieldCheck, Vault } from "lucide-react";
import { cn } from "@/lib/cn";

export default function EvidencePage() {
  const { user } = useAuth();
  const auditorMode = user?.role === "auditor";

  return (
    <div>
      <PageHeader
        color="teal"
        title="Proof box"
        description="Every photo, weight, and gas sale is locked here. Nobody can change it after writing."
      />

      <SimpleGuide
        icon={Vault}
        plain="This is where proof lives. Auditors can look — they cannot edit."
        like="Bank locker with a clear chain"
      />

      <Decide
        cue={auditorMode ? "Check this" : "Lock it"}
        analysis={
          auditorMode
            ? "You can read every photo and weight. You cannot change a line. Flag a gap if the chain is broken."
            : "A missing photo on a truck blocks farmer pay and carbon paper. Lock today’s proof before you leave."
        }
        decision={
          auditorMode
            ? "Open the newest pack, or mark a gap."
            : "Go lock today’s truck photos, or leave it for tomorrow."
        }
      >
        {auditorMode ? (
          <Button variant="gold">Open newest pack</Button>
        ) : (
          <Button variant="gold">Lock today’s photos</Button>
        )}
        <Button variant="secondary">Later</Button>
      </Decide>

      {auditorMode ? (
        <Panel className="mb-4 animate-rise border-teal/40 bg-gradient-to-r from-teal-soft to-raised">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-teal text-white">
              <Lock className="size-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status="neutral" label="Auditor view" />
                <StatusPill status="green" label="Read only" />
              </div>
              <p className="mt-1 text-sm font-medium">
                You can check the chain — you cannot rewrite history.
              </p>
            </div>
          </div>
        </Panel>
      ) : null}

      <Panel className="animate-rise-delay-1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold">
              Locked chain · newest first
            </h2>
            <p className="text-sm text-muted">
              Each entry links to the one before — break one and the locker
              fails the check
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ok-soft px-3 py-1 text-xs font-bold text-ok">
            <ShieldCheck className="size-3.5" />
            Chain OK
          </span>
        </div>

        <ul className="relative space-y-0">
          {EVIDENCE.map((e, i) => (
            <li key={e.id} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="flex w-8 flex-col items-center">
                <span
                  className={cn(
                    "z-10 flex size-8 items-center justify-center rounded-full border border-teal bg-raised text-[10px] font-bold text-teal",
                    i === 0 && "chain-pulse",
                  )}
                >
                  {EVIDENCE.length - i}
                </span>
                {i < EVIDENCE.length - 1 ? (
                  <span className="w-0.5 flex-1 bg-gradient-to-b from-teal to-teal/20" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 rounded-2xl border border-line bg-surface px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status="neutral" label={e.category} />
                      <p className="font-bold">{e.id}</p>
                    </div>
                    <p className="mt-1.5 text-sm leading-snug">{e.summary}</p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(e.timestamp).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-raised px-3 py-2 font-mono text-[10px] leading-relaxed text-muted">
                    <p className="inline-flex items-center gap-1 font-semibold text-teal">
                      <Link2 className="size-3" />
                      {e.hash}
                    </p>
                    <p className="mt-1">prev · {e.prevHash}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
