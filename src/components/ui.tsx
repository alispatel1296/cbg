"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { HealthStatus } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import { usePrefs } from "@/lib/prefs";

export function StatusPill({
  status,
  label,
}: {
  status: HealthStatus | "neutral";
  label: string;
}) {
  const { tr } = usePrefs();
  const styles =
    status === "green"
      ? "bg-ok-soft text-ok"
      : status === "amber"
        ? "bg-amber-soft text-amber"
        : status === "red"
          ? "bg-danger-soft text-danger"
          : "bg-surface text-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles,
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          status === "green" && "bg-ok",
          status === "amber" && "bg-amber",
          status === "red" && "bg-danger",
          status === "neutral" && "bg-muted",
        )}
      />
      {tr(label)}
    </span>
  );
}

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-visible rounded-xl border border-line bg-raised p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function ChartBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full min-w-0 overflow-visible", className)}>
      <div className="h-80 w-full min-w-0 sm:h-96">{children}</div>
    </div>
  );
}

export function Decide({
  cue,
  analysis,
  decision,
  children,
}: {
  cue?: string;
  analysis: string;
  decision: string;
  children?: React.ReactNode;
}) {
  const { tr } = usePrefs();
  return (
    <Panel className="mb-4 border-l-4 border-l-gold">
      {cue ? (
        <p className="text-xs font-bold uppercase tracking-wide text-gold">{tr(cue)}</p>
      ) : null}
      <p className="mt-1 text-base leading-relaxed text-muted">{tr(analysis)}</p>
      <p className="mt-2 font-display text-xl font-bold leading-snug">{tr(decision)}</p>
      {children ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap [&>a]:w-full [&>button]:w-full sm:[&>a]:w-auto sm:[&>button]:w-auto [&_button]:w-full sm:[&_button]:w-auto">
          {children}
        </div>
      ) : null}
    </Panel>
  );
}

export function StageBar({
  steps,
  at,
}: {
  steps: string[];
  at: number;
}) {
  const { tr } = usePrefs();
  const max = Math.max(steps.length - 1, 1);
  const pct = Math.min(100, Math.max(0, (at / max) * 100));
  const last = steps.length - 1;
  return (
    <div>
      <div className="relative pt-0.5">
        <div className="h-2 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
        </div>
        <ol className="pointer-events-none absolute inset-x-0 top-0.5 flex justify-between">
          {steps.map((s, i) => (
            <li
              key={`${s}-dot-${i}`}
              className={cn(
                "size-2.5 rounded-full ring-2 ring-raised",
                i <= at ? "bg-teal" : "bg-line",
              )}
            />
          ))}
        </ol>
      </div>
      <ol
        className="mt-2.5 grid gap-x-1"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((s, i) => (
          <li
            key={`${s}-${i}`}
            className={cn(
              "truncate text-[11px] font-bold leading-tight",
              i === 0 && "text-left",
              i === last && "text-right",
              i !== 0 && i !== last && "text-center",
              i < at && "text-teal",
              i === at && "text-ink",
              i > at && "text-muted",
            )}
          >
            {tr(s)}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  color = "teal",
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  color?: "teal" | "gold" | "amber" | "ok";
}) {
  const { tr } = usePrefs();
  const bar =
    color === "gold"
      ? "bg-gold"
      : color === "amber"
        ? "bg-amber"
        : color === "ok"
          ? "bg-ok"
          : "bg-teal";

  return (
    <div className="mb-6">
      <div className={cn("header-bar mb-3", bar)} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl md:text-[34px]">
            {tr(title)}
          </h1>
          {description ? (
            <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">
              {tr(description)}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export function SimpleGuide({
  icon: Icon,
  plain,
  like,
}: {
  icon: LucideIcon;
  plain: string;
  like?: string;
}) {
  const { t, tr } = usePrefs();
  return (
    <div className="mb-5 flex gap-3 rounded-xl border border-line bg-teal-soft/60 px-4 py-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal text-white">
        <Icon className="size-4" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug text-ink">{tr(plain)}</p>
        {like ? (
          <p className="mt-0.5 text-xs text-muted">
            {t("likeWord")} <span className="font-medium text-teal">{tr(like)}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function WorkflowTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  const { tr } = usePrefs();
  return (
    <div className="mb-5 flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "-mb-px shrink-0 border-b-2 px-3 py-3 text-base font-medium transition-colors",
            active === t.id
              ? "border-teal text-teal"
              : "border-transparent text-muted hover:text-ink",
          )}
        >
          {tr(t.label)}
        </button>
      ))}
    </div>
  );
}

export function FeatureSense({
  promise,
  metaphor,
}: {
  forWhom?: string;
  promise: string;
  metaphor?: string;
}) {
  const { t, tr } = usePrefs();
  return (
    <div className="mb-5 rounded-xl border border-line bg-teal-soft/50 px-4 py-3">
      <p className="text-sm font-medium text-ink">{tr(promise)}</p>
      {metaphor ? (
        <p className="mt-0.5 text-xs text-muted">
          {t("likeWord")} <span className="font-medium text-teal">{tr(metaphor)}</span>
        </p>
      ) : null}
    </div>
  );
}

export function Metric({
  label,
  value,
  hint,
  tone = "default",
  delta,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "gold" | "teal";
  delta?: string;
}) {
  const { tr } = usePrefs();
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {tr(label)}
      </p>
      <p
        className={cn(
          "mt-1 text-xl font-semibold tabular-nums tracking-tight sm:text-2xl",
          tone === "gold" && "text-gold",
          tone === "teal" && "text-teal",
          tone === "default" && "text-ink",
        )}
      >
        {value}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {delta ? (
          <span className="rounded-full bg-ok-soft px-1.5 py-0.5 text-[11px] font-semibold text-ok">
            {delta}
          </span>
        ) : null}
        {hint ? <p className="text-xs text-muted">{tr(hint)}</p> : null}
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "gold";
}) {
  const { tr } = usePrefs();
  return (
    <button
      className={cn(
        "inline-flex h-11 min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg px-5 text-base font-semibold transition-colors disabled:opacity-50 sm:min-w-[7rem]",
        variant === "primary" && "bg-teal text-white hover:bg-teal-deep",
        variant === "secondary" &&
          "border border-line bg-raised text-ink hover:bg-surface",
        variant === "ghost" && "text-muted hover:bg-surface hover:text-ink",
        variant === "gold" && "bg-gold text-white hover:brightness-95",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? tr(children) : children}
    </button>
  );
}

export function EmptySlot({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { tr } = usePrefs();
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-center">
      <p className="text-sm font-medium text-ink">{tr(title)}</p>
      <p className="mt-1 text-sm text-muted">{tr(description)}</p>
    </div>
  );
}

export function HealthRing({
  score,
  status,
  size = 132,
}: {
  score: number;
  status: HealthStatus;
  size?: number;
}) {
  const { tr } = usePrefs();
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color =
    status === "green" ? "#137333" : status === "amber" ? "#c26400" : "#c5221f";
  const word =
    status === "green" ? "Good" : status === "amber" ? "Watch" : "Alert";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e3e8e5"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="ring-draw"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-semibold tabular-nums" style={{ color }}>
          {score}
        </p>
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color }}>
          {tr(word)}
        </p>
      </div>
    </div>
  );
}

export function FlowStrip({
  steps,
}: {
  steps: { label: string; value: string; tone?: "teal" | "gold" | "default" }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {steps.map((s) => (
        <div key={s.label} className="rounded-xl border border-line bg-surface px-4 py-4">
          <p className="text-sm font-medium text-muted">{s.label}</p>
          <p
            className={cn(
              "mt-1 text-2xl font-semibold tabular-nums",
              s.tone === "teal" && "text-teal",
              s.tone === "gold" && "text-gold",
            )}
          >
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function FillBar({
  pct,
  tone = "teal",
}: {
  pct: number;
  tone?: "teal" | "ok" | "amber" | "danger" | "gold";
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface">
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          tone === "ok" && "bg-ok",
          tone === "amber" && "bg-amber",
          tone === "danger" && "bg-danger",
          tone === "gold" && "bg-gold",
          tone === "teal" && "bg-teal",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function PairBar({
  left,
  right,
  leftLabel = "Ordered",
  rightLabel = "Got",
  unit = "",
}: {
  left: number;
  right: number;
  leftLabel?: string;
  rightLabel?: string;
  unit?: string;
}) {
  const max = Math.max(left, right, 1);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs">
        <span className="w-16 shrink-0 text-muted">{leftLabel}</span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-muted/50"
            style={{ width: `${(left / max) * 100}%` }}
          />
        </div>
        <span className="w-16 text-right tabular-nums font-medium">
          {left}
          {unit}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="w-16 shrink-0 text-muted">{rightLabel}</span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-teal"
            style={{ width: `${(right / max) * 100}%` }}
          />
        </div>
        <span className="w-16 text-right tabular-nums font-medium text-teal">
          {right}
          {unit}
        </span>
      </div>
    </div>
  );
}

export function Lane({
  title,
  count,
  children,
  empty = "Nothing here",
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  empty?: string;
}) {
  const { tr } = usePrefs();
  const hasKids = Array.isArray(children)
    ? children.filter(Boolean).length > 0
    : Boolean(children);

  return (
    <div className="flex min-h-0 flex-col rounded-xl border border-line bg-surface/70 p-3 sm:min-h-[180px]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          {tr(title)}
        </p>
        {count != null ? (
          <span className="rounded-full bg-raised px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-ink">
            {count}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {hasKids ? children : (
          <p className="px-1 py-6 text-center text-xs text-muted">{tr(empty)}</p>
        )}
      </div>
    </div>
  );
}

export function ActionCard({
  title,
  detail,
  cue,
  tone = "amber",
  action,
}: {
  title: string;
  detail: string;
  cue?: string;
  tone?: "amber" | "danger" | "teal" | "ok" | "gold";
  action?: React.ReactNode;
}) {
  const { tr } = usePrefs();
  const fill =
    tone === "danger"
      ? "border-l-danger bg-danger-soft/50"
      : tone === "ok"
        ? "border-l-ok bg-ok-soft/40"
        : tone === "teal"
          ? "border-l-teal bg-teal-soft/50"
          : tone === "gold"
            ? "border-l-gold bg-gold-soft/70"
            : "border-l-amber bg-amber-soft/60";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-line border-l-[6px] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5",
        fill,
      )}
    >
      <div className="min-w-0">
        {cue ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {tr(cue)}
          </p>
        ) : null}
        <p className="text-lg font-semibold text-ink">{tr(title)}</p>
        <p className="mt-1 text-base text-muted">{tr(detail)}</p>
      </div>
      {action ? (
        <div className="w-full shrink-0 sm:w-auto [&_a]:block [&_button]:w-full sm:[&_button]:w-auto">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export function CashTile({
  label,
  value,
  hint,
  tone = "gold",
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "gold" | "danger" | "ok" | "amber" | "teal";
  href?: string;
}) {
  const { tr } = usePrefs();
  const skin =
    tone === "danger"
      ? "border-danger/30 bg-danger-soft"
      : tone === "ok"
        ? "border-ok/30 bg-ok-soft"
        : tone === "amber"
          ? "border-amber/30 bg-amber-soft"
          : tone === "teal"
            ? "border-teal/25 bg-teal-soft"
            : "border-gold/30 bg-gold-soft";
  const num =
    tone === "danger"
      ? "text-danger"
      : tone === "ok"
        ? "text-ok"
        : tone === "amber"
          ? "text-amber"
          : tone === "teal"
            ? "text-teal"
            : "text-gold";

  const inner = (
    <section className={cn("h-full rounded-xl border p-5", skin)}>
      <p className="text-sm font-semibold text-ink">{tr(label)}</p>
      <p className={cn("mt-2 text-3xl font-semibold tabular-nums tracking-tight md:text-4xl lg:text-5xl", num)}>
        {value}
      </p>
      {hint ? <p className="mt-2 text-base text-muted">{tr(hint)}</p> : null}
    </section>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function ZoneBar({
  value,
  min,
  max,
  zones,
  unit,
}: {
  value: number;
  min: number;
  max: number;
  zones: { from: number; to: number; tone: "ok" | "amber" | "danger" }[];
  unit: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="relative h-2 overflow-hidden rounded-full bg-surface">
        <div className="absolute inset-0 flex">
          {zones.map((z) => {
            const w = ((z.to - z.from) / (max - min)) * 100;
            return (
              <div
                key={`${z.from}-${z.to}`}
                style={{ width: `${w}%` }}
                className={cn(
                  z.tone === "ok" && "bg-ok/35",
                  z.tone === "amber" && "bg-amber/40",
                  z.tone === "danger" && "bg-danger/35",
                )}
              />
            );
          })}
        </div>
        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink"
          style={{ left: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        Now{" "}
        <span className="font-medium text-ink">
          {value}
          {unit}
        </span>
        <span className="ml-2">Green = safe · Yellow = careful · Red = problem</span>
      </p>
    </div>
  );
}

export function BigStat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "gold" | "teal" | "ok" | "amber" | "danger";
}) {
  return (
    <div className="rounded-xl border border-line bg-raised p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-2xl font-semibold tabular-nums tracking-tight",
          tone === "gold" && "text-gold",
          tone === "teal" && "text-teal",
          tone === "ok" && "text-ok",
          tone === "amber" && "text-amber",
          tone === "danger" && "text-danger",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
