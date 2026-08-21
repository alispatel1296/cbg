"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button, Panel, SimpleGuide } from "@/components/ui";
import { ListChecks } from "lucide-react";

const STEPS = [
  { label: "Plant basics", sense: "Where & how big" },
  { label: "Carbon path", sense: "Which market pays" },
  { label: "Link sensors", sense: "Trust the numbers" },
  { label: "Invite team", sense: "Who sees what" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding, user, hydrated } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "Greenfield Nashik",
    location: "Sinnar, Nashik",
    capacity: "50",
    digesters: "3",
    feedstock: "Cattle dung, Napier grass",
    methodology: "BEE CCTS",
    deviceId: "",
    inviteEmail: "",
  });

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Loading…
      </div>
    );
  }

  const finish = () => {
    completeOnboarding();
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-10">
      <p className="font-display text-3xl font-bold text-teal">Urja</p>
      <h1 className="mt-2 font-display text-3xl font-bold">
        First setup — 4 easy steps
      </h1>
      <p className="mt-2 text-muted">
        Tell Urja about your plant once. Then every page already knows your
        story.
      </p>

      <div className="mt-5">
        <SimpleGuide
          icon={ListChecks}
          plain="Four short steps: plant, carbon path, sensors, team. Then you are ready."
          like="Plant birth certificate"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <span
            key={s.label}
            className={`rounded-xl px-3 py-2 text-left ${
              i === step
                ? "bg-teal text-white"
                : i < step
                  ? "bg-ok-soft text-ok"
                  : "bg-surface text-muted"
            }`}
          >
            <span className="block text-xs font-bold">
              {i + 1}. {s.label}
            </span>
            <span
              className={`block text-[10px] ${
                i === step ? "text-white" : "opacity-80"
              }`}
            >
              {s.sense}
            </span>
          </span>
        ))}
      </div>

      <Panel className="mt-5 animate-rise">
        {step === 0 ? (
          <div className="space-y-3">
            <Field
              label="Plant name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <Field
              label="Location (map pin)"
              value={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Size (TPD)"
                value={form.capacity}
                onChange={(v) => setForm({ ...form, capacity: v })}
              />
              <Field
                label="Number of tanks"
                value={form.digesters}
                onChange={(v) => setForm({ ...form, digesters: v })}
              />
            </div>
            <Field
              label="What you feed in"
              value={form.feedstock}
              onChange={(v) => setForm({ ...form, feedstock: v })}
            />
            <div className="rounded-xl border border-dashed border-line bg-teal-soft/40 px-4 py-6 text-center text-sm text-muted">
              Map pin · 19.85°N, 74.00°E — used later to check truck GPS
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              This choice shapes your auditor papers and carbon money words.
            </p>
            {(["BEE CCTS", "Verra", "Gold Standard"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setForm({ ...form, methodology: m })}
                className={`block w-full rounded-xl border px-4 py-3 text-left ${
                  form.methodology === m
                    ? "border-teal bg-teal-soft text-teal"
                    : "border-line bg-surface"
                }`}
              >
                <span className="font-bold">{m}</span>
                <span className="mt-0.5 block text-xs opacity-80">
                  {m === "BEE CCTS"
                    ? "India carbon market path"
                    : m === "Verra"
                      ? "International credit path"
                      : "Premium co-benefit path"}
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Link sensor kits so tank health has real machine numbers.
            </p>
            <Field
              label="Device ID"
              value={form.deviceId}
              onChange={(v) => setForm({ ...form, deviceId: v })}
              placeholder="URJA-SNS-••••"
            />
            <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-line bg-surface text-sm text-muted">
              QR scanner — aim at tank kit label
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setForm({ ...form, deviceId: "URJA-SNS-D1-8842" })
              }
            >
              Simulate successful scan
            </Button>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Operators get floor pages. Auditors get proof locker + papers —
              view only.
            </p>
            <Field
              label="Invite email"
              value={form.inviteEmail}
              onChange={(v) => setForm({ ...form, inviteEmail: v })}
              placeholder="operator@plant.in"
            />
            <div className="rounded-xl bg-gold-soft/70 px-4 py-3 text-sm">
              Tip: invite your auditor now — they land in Proof locker, not
              billing.
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex justify-between gap-2">
          <Button
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
          ) : (
            <Button variant="gold" onClick={finish}>
              Open morning page
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wide text-muted">
      {label}
      <input
        className="mt-1 w-full rounded-xl border border-line bg-raised px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-teal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
