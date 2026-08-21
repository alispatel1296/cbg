"use client";

import { useState } from "react";
import { REPORTS } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { formatInr } from "@/lib/format";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StatusPill,
} from "@/components/ui";
import type { HealthStatus } from "@/lib/types";
import { FileCheck, FilePen, Scale, FileText } from "lucide-react";

function reportTone(status: string): HealthStatus | "neutral" {
  if (status === "approved") return "green";
  if (status === "needs_correction") return "red";
  if (status === "under_review" || status === "sent") return "amber";
  return "neutral";
}

export default function ReportsPage() {
  const { activePlant, user } = useAuth();
  const readOnly = user?.role === "auditor";
  const [toast, setToast] = useState<string | null>(null);

  const generate = () => {
    setToast(
      "Auditor paper ready from live plant data — no consultant package needed this cycle.",
    );
    setTimeout(() => setToast(null), 4500);
  };

  return (
    <div>
      <PageHeader
        color="gold"
        title="Checker papers"
        description="One click makes the papers auditors need — avoid a big consultant bill."
        actions={
          !readOnly ? (
            <Button variant="gold" onClick={generate}>
              <FileCheck className="size-4" />
              Make auditor paper
            </Button>
          ) : null
        }
      />

      <SimpleGuide
        icon={FileText}
        plain="Stop paying lakhs just to format what your plant already logged."
        like="Consultant in a button"
      />

      <Decide
        cue="Paper"
        analysis={
          readOnly
            ? "You are in auditor seat. Read the pack. You cannot mint a new one."
            : `${REPORTS[0].title} is ${REPORTS[0].status.replace("_", " ")}. Making a new pack here is cheaper than a consultant.`
        }
        decision={
          readOnly
            ? "Open the latest report, or send a correction note."
            : "Make the auditor paper now, or wait till next month."
        }
      >
        {!readOnly ? (
          <Button variant="gold" onClick={generate}>
            Make auditor paper
          </Button>
        ) : (
          <Button variant="gold">Open latest</Button>
        )}
        <Button variant="secondary">Wait</Button>
      </Decide>

      {toast ? (
        <div className="mb-4 animate-rise rounded-xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm font-medium">
          {toast}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Old way vs Urja
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line/60 bg-raised/70 p-3">
              <p className="text-xs font-bold text-muted">Old way</p>
              <p className="mt-2 font-display text-2xl font-bold text-danger line-through decoration-2">
                {formatInr(450000, true)}
              </p>
              <p className="mt-1 text-xs text-muted">
                Consultant · weeks · email chaos
              </p>
            </div>
            <div className="rounded-xl border border-teal/30 bg-teal-soft/50 p-3">
              <p className="text-xs font-bold text-teal">With Urja</p>
              <p className="mt-2 font-display text-2xl font-bold text-teal">
                1 click
              </p>
              <p className="mt-1 text-xs text-muted">
                Live logs → {activePlant?.methodology ?? "methodology"} format
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Your Urja bill is cheaper than one bad consultant cycle.
          </p>
        </Panel>

        <Panel className="animate-rise-delay-1">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-teal-soft text-teal">
              <FilePen className="size-5" />
            </span>
            <div>
              <p className="font-display text-xl font-bold">Plant story paper</p>
              <p className="mt-1 text-sm text-muted">
                First big document — filled from your setup (place, size, dung
                types).
              </p>
            </div>
          </div>
          <Button
            className="mt-5"
            variant="secondary"
            disabled={readOnly}
            onClick={() =>
              setToast("Plant story wizard opened with your setup fields.")
            }
          >
            Open plant story
          </Button>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-xs text-muted">
            <Scale className="size-3.5 text-teal" />
            Auditor status shows on each paper below
          </div>
        </Panel>
      </div>

      <Panel className="mt-4 animate-rise-delay-2 overflow-x-auto">
        <h2 className="mb-1 font-display text-lg font-bold">
          Your paper shelf
        </h2>
        <p className="mb-4 text-sm text-muted">
          Every paper kept with date — download anytime
        </p>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-[11px] uppercase tracking-wide text-muted">
            <tr className="border-b border-line">
              <th className="pb-2 font-bold">Paper</th>
              <th className="pb-2 font-bold">Type</th>
              <th className="pb-2 font-bold">Version</th>
              <th className="pb-2 font-bold">Auditor</th>
              <th className="pb-2 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {REPORTS.map((r) => (
              <tr key={r.id} className="border-b border-line/70">
                <td className="py-3">
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-xs text-muted">
                    {r.id} · {new Date(r.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </td>
                <td className="py-3 capitalize">{r.type}</td>
                <td className="py-3 font-mono text-xs">{r.version}</td>
                <td className="py-3">
                  <StatusPill
                    status={reportTone(r.status)}
                    label={r.status.replace(/_/g, " ")}
                  />
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" className="px-2 py-1 text-xs">
                      Download
                    </Button>
                    {!readOnly ? (
                      <Button variant="secondary" className="px-2 py-1 text-xs">
                        Mark sent
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
