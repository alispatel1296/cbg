"use client";

import { FLARE_EVENTS, LAB_READINGS } from "@/lib/gap-data";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StageBar,
  StatusPill,
} from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { FlaskConical } from "lucide-react";
import { useBook } from "@/lib/book-store";
import { usePrefs } from "@/lib/prefs";
import { DeskGate, LineNotice } from "@/components/book-ui";
import { WATCH } from "@/lib/plant-flow";

export default function LabPage() {
  const { t, locale } = usePrefs();
  const { calls, recordCall, can } = useBook();
  const top = LAB_READINGS[0];
  const slowed = Boolean(calls["lab-slow-d2"]);
  const waiting = Boolean(calls["lab-wait-sample"]);
  const at = slowed ? 3 : waiting ? 2 : 1;

  return (
    <div>
      <PageHeader
        color="teal"
        title={t("lab.title")}
        description={t("lab.desc")}
      />

      <LineNotice watch={WATCH.lab} />

      <SimpleGuide
        icon={FlaskConical}
        plain={t("lab.guide")}
        like={t("lab.like")}
      />

      <Panel className="mb-4">
        <StageBar
          steps={[t("lab.step1"), t("lab.step2"), t("lab.step3"), t("lab.step4")]}
          at={at}
        />
      </Panel>

      <Decide
        cue={t("lab.cue")}
        analysis={t("lab.analysis", {
          tank: top.digester,
          test: top.parameter,
          value: String(top.value),
          want: top.limit,
        })}
        decision={t("lab.decision")}
      >
        <DeskGate action="mark_call">
          <Button
            variant="gold"
            disabled={!can("mark_call")}
            onClick={() =>
              recordCall(
                "lab-slow-d2",
                "Slow feed on D2 after VFA 820 — lab Meena / operator",
                "Lab",
              )
            }
          >
            {slowed ? t("lab.slowed") : t("lab.slow")}
          </Button>
          <Button
            variant="secondary"
            disabled={!can("mark_call")}
            onClick={() =>
              recordCall(
                "lab-wait-sample",
                "Wait for D2 sample tomorrow 06:00",
                "Lab",
              )
            }
          >
            {waiting ? t("lab.waiting") : t("lab.wait")}
          </Button>
        </DeskGate>
      </Decide>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="animate-rise overflow-x-auto">
          <h2 className="mb-1 font-display text-lg font-bold">
            {t("lab.results")}
          </h2>
          <p className="mb-3 text-xs text-muted">{t("lab.resultsHint")}</p>
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-muted">
              <tr className="border-b border-line">
                <th className="pb-2 font-bold">{t("sample")}</th>
                <th className="pb-2 font-bold">{t("test")}</th>
                <th className="pb-2 font-bold">{t("value")}</th>
                <th className="pb-2 font-bold">{t("flag")}</th>
              </tr>
            </thead>
            <tbody>
              {LAB_READINGS.map((r) => (
                <tr key={r.id} className="border-b border-line/70">
                  <td className="py-3">
                    <p className="font-semibold">
                      {r.digester} · {r.id}
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(r.ts).toLocaleString(locale)}
                    </p>
                  </td>
                  <td className="py-3">{r.parameter}</td>
                  <td className="py-3">
                    <span className="font-bold tabular-nums">{r.value}</span>
                    <span className="block text-xs text-muted">{r.limit}</span>
                  </td>
                  <td className="py-3">
                    <StatusPill status={r.flag} label={r.flag} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel className="animate-rise-delay-1">
          <h2 className="mb-1 font-display text-lg font-bold">
            {t("lab.burnt")}
          </h2>
          <p className="mb-3 text-xs text-muted">{t("lab.burntHint")}</p>
          <ul className="space-y-3">
            {FLARE_EVENTS.map((f) => (
              <li
                key={f.id}
                className="rounded-xl border border-amber/30 bg-amber-soft/30 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">{f.id}</p>
                  <StatusPill
                    status="amber"
                    label={`${formatNumber(f.volumeM3, 0)} m³`}
                  />
                </div>
                <p className="mt-1 text-sm">{f.reason}</p>
                <p className="mt-1 text-xs text-muted">
                  {formatNumber(f.methaneDestroyedPct, 1)}% ·{" "}
                  {new Date(f.ts).toLocaleString(locale)}
                </p>
                <p className="mt-2 text-xs font-semibold text-amber">
                  {t("lab.money", { impact: f.creditImpact })}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
