"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BLEND_RECOMMENDATION,
  FEED_MIX_PERFORMANCE,
} from "@/lib/product-data";
import { formatInr, formatNumber } from "@/lib/format";
import {
  Button,
  ChartBox,
  Decide,
  PageHeader,
  Panel,
  SimpleGuide,
  StageBar,
  StatusPill,
} from "@/components/ui";
import { Sprout } from "lucide-react";
import { useBook } from "@/lib/book-store";
import { usePrefs } from "@/lib/prefs";
import { DeskGate, LineNotice } from "@/components/book-ui";
import { WATCH } from "@/lib/plant-flow";

export default function YieldPage() {
  const { t } = usePrefs();
  const { calls, recordCall, can } = useBook();
  const locked = Boolean(calls["mix-lock"]);
  const kept = Boolean(calls["mix-keep"]);
  const at = locked ? 3 : kept ? 2 : 1;
  const chart = FEED_MIX_PERFORMANCE.map((m) => ({
    name: m.mix,
    short:
      m.mix === "70% dung · 30% napier"
        ? "70/30"
        : m.mix === "50% dung · 50% agri residue"
          ? "50/50"
          : m.mix === "Mixed waste heavy"
            ? "Waste"
            : "100% dung",
    yield: m.yieldM3t,
  }));

  return (
    <div>
      <PageHeader
        color="gold"
        title={t("yield.title")}
        description={t("yield.desc")}
        actions={
          <Link href="/feedstock">
            <Button variant="secondary">{t("yield.back")}</Button>
          </Link>
        }
      />

      <LineNotice watch={WATCH.mix} />

      <SimpleGuide
        icon={Sprout}
        plain={t("yield.guide")}
        like={t("yield.like")}
      />

      <Panel className="mb-4">
        <StageBar
          steps={[
            t("yield.step1"),
            t("yield.step2"),
            t("yield.step3"),
            t("yield.step4"),
          ]}
          at={at}
        />
      </Panel>

      <Decide
        cue={t("yield.cue")}
        analysis={t("yield.analysis", { tip: BLEND_RECOMMENDATION.suggest })}
        decision={t("yield.decision")}
      >
        <DeskGate action="mark_call">
          <Button
            variant="gold"
            disabled={!can("mark_call")}
            onClick={() =>
              recordCall(
                "mix-lock",
                `Store must follow mix ${BLEND_RECOMMENDATION.suggest}`,
                "Mix",
              )
            }
          >
            {locked ? t("yield.followed") : t("yield.follow")}
          </Button>
          <Button
            variant="secondary"
            disabled={!can("mark_call")}
            onClick={() =>
              recordCall("mix-keep", "Kept current mix — tip rejected", "Mix")
            }
          >
            {kept ? t("yield.kept") : t("yield.keep")}
          </Button>
        </DeskGate>
      </Decide>

      <Panel className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {t("yield.tip")}
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {BLEND_RECOMMENDATION.suggest}
        </p>
        <p className="mt-3 text-base text-muted">
          {t("yield.incoming", {
            dung: formatNumber(BLEND_RECOMMENDATION.todayIncoming.dungT),
            napier: formatNumber(BLEND_RECOMMENDATION.todayIncoming.napierT),
            residue: formatNumber(BLEND_RECOMMENDATION.todayIncoming.residueT),
          })}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-raised/80 p-3">
            <p className="text-sm text-muted">{t("yield.expect")}</p>
            <p className="font-display text-2xl font-bold text-teal">
              {formatNumber(BLEND_RECOMMENDATION.expectedYieldM3t, 1)} m³/t
            </p>
          </div>
          <div className="rounded-xl bg-raised/80 p-3">
            <p className="text-sm text-muted">{t("yield.extraGas")}</p>
            <p className="font-display text-2xl font-bold">
              +{formatNumber(BLEND_RECOMMENDATION.extraGasM3Day, 0)} m³
            </p>
          </div>
          <div className="rounded-xl bg-raised/80 p-3">
            <p className="text-sm text-muted">{t("yield.extraMoney")}</p>
            <p className="font-display text-2xl font-bold text-gold">
              {formatInr(BLEND_RECOMMENDATION.extraInrMonth, true)}
            </p>
          </div>
        </div>
      </Panel>

      <Panel className="mb-4">
        <h2 className="font-display text-xl font-bold">{t("yield.won")}</h2>
        <p className="mb-3 text-base text-muted">{t("yield.wonHint")}</p>
        <ChartBox>
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart
              data={chart}
              margin={{ top: 8, right: 12, left: 4, bottom: 52 }}
            >
              <CartesianGrid stroke="#bdd0c4" strokeDasharray="3 3" />
              <XAxis
                dataKey="short"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-28}
                textAnchor="end"
                height={56}
                tickMargin={6}
              />
              <YAxis width={36} tick={{ fontSize: 10 }} tickLine={false} />
              <Tooltip
                formatter={(v) => [`${v} m³ / tonne`, "Yield"]}
                labelFormatter={(_, p) => p?.[0]?.payload?.name ?? ""}
              />
              <Bar dataKey="yield" name="m³ / tonne" fill="#0a5244" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2">
        {FEED_MIX_PERFORMANCE.map((m) => (
          <Panel key={m.mix}>
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold">{m.mix}</p>
              {m.revenueIndex === 100 ? (
                <StatusPill status="green" label={t("yield.best")} />
              ) : m.revenueIndex < 70 ? (
                <StatusPill status="red" label={t("yield.weak")} />
              ) : (
                <StatusPill status="neutral" label={t("ok")} />
              )}
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-teal">
              {formatNumber(m.yieldM3t, 1)}{" "}
              <span className="text-lg text-muted">m³/t</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {m.batches} · {m.note}
            </p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
