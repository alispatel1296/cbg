"use client";

import { useState } from "react";
import { APPROVALS, FINANCE_SNAP } from "@/lib/factory-ops";
import { downloadCsv, printPdf } from "@/lib/export-file";
import { formatInr } from "@/lib/format";
import {
  ActionCard,
  Button,
  Decide,
  FillBar,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/ui";
import { DateBoard } from "@/components/ops";
import { useBook } from "@/lib/book-store";
import { usePrefs } from "@/lib/prefs";
import { LineNotice } from "@/components/book-ui";
import { WATCH } from "@/lib/plant-flow";

export default function FinancePage() {
  const { t } = usePrefs();
  const { calls, can, ticks, setTick } = useBook();
  const [toast, setToast] = useState<string | null>(null);
  const rows = APPROVALS.map((a) => ({
    ...a,
    status: ticks[a.id] ?? a.status,
  }));
  const pending = rows.filter((a) => a.status === "pending");
  const heldId = pending[0] ? calls[`hold-${pending[0].id}`] : undefined;
  const inFlow = FINANCE_SNAP.salesMonth;
  const outFlow = FINANCE_SNAP.expensesMonth;
  const stuck = FINANCE_SNAP.receivable;
  const weOwe = FINANCE_SNAP.payable;
  const maxBar = Math.max(inFlow, outFlow, stuck, weOwe);

  return (
    <div>
      <PageHeader
        color="gold"
        title={t("cash.title")}
        description={t("cash.desc")}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                downloadCsv("urja-cash.csv", [
                  ["What", "Rupees"],
                  ["Sales this month", inFlow],
                  ["Spend this month", outFlow],
                  ["Customers hold", stuck],
                  ["We owe", weOwe],
                  ["Profit snapshot", FINANCE_SNAP.profit],
                ]);
                setToast("Excel sheet downloaded — open in Excel / Sheets.");
                setTimeout(() => setToast(null), 3500);
              }}
            >
              Excel
            </Button>
            <Button
              variant="gold"
              onClick={() => {
                setToast("Use Print → Save as PDF.");
                printPdf();
              }}
            >
              PDF
            </Button>
          </div>
        }
      />
      {toast ? (
        <div className="mb-4 rounded-xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm font-medium">
          {toast}
        </div>
      ) : null}

      <LineNotice watch={WATCH.cash} />

      <Decide
        cue={t("cash.cue")}
        analysis={
          pending[0]
            ? t("cash.analysisTick", {
                who: pending[0].askedBy,
                what: pending[0].what,
              })
            : t("cash.analysisLate", { amt: formatInr(stuck) })
        }
        decision={
          pending[0] ? t("cash.decisionTick") : t("cash.decisionLate")
        }
      >
        {pending[0] ? (
          <Button
            variant="gold"
            disabled={!can("mark_call")}
            onClick={() => setTick(pending[0].id, "approved", pending[0].what)}
          >
            {t("allow")}
          </Button>
        ) : null}
        {pending[0] ? (
          <Button
            variant="secondary"
            disabled={!can("mark_call")}
            onClick={() => setTick(pending[0].id, "held", pending[0].what)}
          >
            {heldId ? t("held") : t("hold")}
          </Button>
        ) : null}
      </Decide>

      <div className="mb-4 space-y-2">
        {pending.map((a) => (
          <ActionCard
            key={a.id}
            tone="amber"
            cue={`${a.type} waiting`}
            title={a.what}
            detail={`Asked by ${a.askedBy}. Nothing moves until you say yes.`}
            action={
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setTick(a.id, "approved", a.what)}
                >
                  {t("allow")}
                </Button>
                <Button variant="ghost" onClick={() => setTick(a.id, "held", a.what)}>
                  {calls[`hold-${a.id}`] ? t("held") : t("hold")}
                </Button>
              </div>
            }
          />
        ))}
      </div>

      <Panel className="mb-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
          This month’s money
        </p>
        <MoneyRow
          label="Sales in"
          value={inFlow}
          max={maxBar}
          tone="ok"
          hint="Billed to customers"
        />
        <MoneyRow
          label="Spend out"
          value={outFlow}
          max={maxBar}
          tone="amber"
          hint="Store, salary, power"
        />
        <MoneyRow
          label="Customers still hold"
          value={stuck}
          max={maxBar}
          tone="gold"
          hint="Collect this — it is yours"
        />
        <MoneyRow
          label="We still owe"
          value={weOwe}
          max={maxBar}
          tone="teal"
          hint="Pay so trucks keep coming"
        />
        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Left after spend
            </p>
            <p className="text-2xl font-semibold tabular-nums text-ok">
              {formatInr(FINANCE_SNAP.profit, true)}
            </p>
          </div>
          <p className="max-w-xs text-right text-xs text-muted">
            Profit on paper. Real cash is this number minus what customers still
            owe.
          </p>
        </div>
      </Panel>

      <Panel>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Tick history
        </p>
        <ul className="space-y-2">
          {rows.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-surface px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">{a.what}</p>
                <p className="text-xs text-muted">
                  {a.type} · {a.askedBy}
                </p>
              </div>
              <StatusPill
                status={
                  a.status === "approved"
                    ? "green"
                    : a.status === "held"
                      ? "amber"
                      : "amber"
                }
                label={
                  a.status === "approved"
                    ? "Allowed"
                    : a.status === "held"
                      ? "Held"
                      : "Waiting"
                }
              />
            </li>
          ))}
        </ul>
      </Panel>

      <DateBoard
        kinds={["plant", "money"]}
        title="Spend dates"
        hint="PO ticks and pay-outs sit on Cash — Excel/PDF stay on this page too."
      />
    </div>
  );
}

function MoneyRow({
  label,
  value,
  max,
  tone,
  hint,
}: {
  label: string;
  value: number;
  max: number;
  tone: "ok" | "amber" | "gold" | "teal";
  hint: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm font-semibold tabular-nums">{formatInr(value)}</p>
      </div>
      <FillBar pct={(value / max) * 100} tone={tone} />
      <p className="mt-0.5 text-xs text-muted">{hint}</p>
    </div>
  );
}
