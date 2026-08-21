"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEMO_USERS, homePathForRole } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { roleLabel } from "@/lib/format";
import { Button, Panel } from "@/components/ui";
import { BrandMark } from "@/components/motion";
import { usePrefs } from "@/lib/prefs";
import {
  Boxes,
  Calculator,
  Eye,
  Landmark,
  Truck,
  UserRound,
  Users,
  TestTubes,
  Wrench,
} from "lucide-react";

const ROLE_HELP: Record<string, { icon: typeof Landmark; line: string }> = {
  plant_owner: {
    icon: Landmark,
    line: "Late money, stock that can stop you, your yes on spends",
  },
  plant_operator: {
    icon: Wrench,
    line: "See tanks, trucks, warnings — daily plant work",
  },
  auditor: {
    icon: Eye,
    line: "Only look at proof & papers — cannot change",
  },
  super_admin: {
    icon: Landmark,
    line: "See all client plants",
  },
  store_staff: {
    icon: Boxes,
    line: "Only stock, PO, GRN — not sales or salary",
  },
  production_staff: {
    icon: Wrench,
    line: "Only making goods and quality checks",
  },
  sales_staff: {
    icon: Landmark,
    line: "Only customers, bills, and who owes money",
  },
  accountant: {
    icon: Calculator,
    line: "Bills, supplier pay, money snapshot — no HR edit",
  },
  hr_staff: {
    icon: Users,
    line: "Only staff, leave, salary",
  },
  employee: {
    icon: UserRound,
    line: "Only my attendance, jobs, payslip, leave",
  },
  driver: {
    icon: Truck,
    line: "My trips, working days, monthly pay + trip extra",
  },
  lab_staff: {
    icon: TestTubes,
    line: "Lab samples and burnt-gas log — prove if a tank is sick",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAs, hydrated, user } = useAuth();
  const { lang, setLang, t } = usePrefs();
  const [mode, setMode] = useState<"password" | "otp">("otp");
  const [email, setEmail] = useState("rajesh@greenfieldcbg.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [password, setPassword] = useState("••••••••");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (hydrated && user) router.replace(homePathForRole(user.role));
  }, [hydrated, user, router]);

  return (
    <div className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden min-h-screen flex-col justify-between bg-teal-deep px-10 py-12 text-white lg:flex">
        <BrandMark light size="lg" />
        <div className="max-w-md">
          <p className="text-4xl font-semibold leading-tight tracking-tight">
            See the holes. Then decide on ₹75,000.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/80">
            Open as the owner. In two minutes you should see late money, stock
            that can stop the line, and spends waiting for your yes.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { c: "bg-ok-soft text-ok", d: "Green = all fine" },
              { c: "bg-amber-soft text-amber", d: "Yellow = look today" },
              { c: "bg-danger-soft text-danger", d: "Red = money can leave" },
            ].map((x) => (
              <div
                key={x.d}
                className={`rounded-xl px-4 py-3 text-base font-semibold ${x.c}`}
              >
                {x.d}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/40">
          ₹75,000 / month · full plant · you tick big spends
        </p>
      </div>

      <div className="relative flex min-h-screen items-center justify-center bg-bg px-4 py-10">
        <div className="relative w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <BrandMark />
          </div>
          <Panel>
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setLang(lang === "en" ? "gu" : "en")}
                className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium"
              >
                {lang === "en" ? t("langOther") : t("english")}
              </button>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              Open the sample plant
            </h1>
            <p className="mt-1 text-sm text-muted">
              No payment. Look at the holes. Then decide.
            </p>

            <button
              type="button"
              onClick={() => router.push(loginAs("u-owner"))}
              className="mt-5 w-full rounded-xl bg-teal px-5 py-5 text-left text-white hover:bg-teal-deep"
            >
              <span className="block text-lg font-semibold">
                I am the owner — show me the holes
              </span>
              <span className="mt-1 block text-sm text-white/80">
                Big button. One tap. See late money first.
              </span>
            </button>

            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">
              Already have a login
            </p>

            <div className="mt-5 flex rounded-lg border border-line bg-surface p-0.5">
              <button
                className={`flex-1 rounded-md py-2 text-sm font-medium ${
                  mode === "otp" ? "bg-raised text-ink shadow-sm" : "text-muted"
                }`}
                onClick={() => setMode("otp")}
              >
                Phone OTP
              </button>
              <button
                className={`flex-1 rounded-md py-2 text-sm font-medium ${
                  mode === "password" ? "bg-raised text-ink shadow-sm" : "text-muted"
                }`}
                onClick={() => setMode("password")}
              >
                Email
              </button>
            </div>

            <form
              className="mt-5 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(mode === "otp" ? login({ phone }) : login({ email }));
              }}
            >
              {mode === "otp" ? (
                <>
                  <label className="block text-sm font-bold text-muted">
                    Phone number
                    <input
                      className="mt-1 w-full rounded-xl border border-line bg-raised px-4 py-3 text-lg outline-none focus:border-teal"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>
                  {otpSent ? (
                    <label className="block text-sm font-bold text-muted">
                      OTP code
                      <input
                        className="mt-1 w-full rounded-xl border border-line bg-raised px-4 py-3 text-lg outline-none focus:border-teal"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Any 6 digits for demo"
                      />
                    </label>
                  ) : null}
                  {!otpSent ? (
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => setOtpSent(true)}
                    >
                      Send OTP
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full">
                      Enter plant
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <label className="block text-sm font-bold text-muted">
                    Email
                    <input
                      className="mt-1 w-full rounded-xl border border-line bg-raised px-4 py-3 text-lg outline-none focus:border-teal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-bold text-muted">
                    Password
                    <input
                      type="password"
                      className="mt-1 w-full rounded-xl border border-line bg-raised px-4 py-3 text-lg outline-none focus:border-teal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <Button type="submit" className="w-full">
                    Enter plant
                  </Button>
                </>
              )}
            </form>

            <div className="mt-6 border-t border-line pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                Other people
              </p>
              <div className="grid gap-2">
                {DEMO_USERS.filter((u) => u.role === "plant_operator").map((u) => {
                  const help = ROLE_HELP[u.role];
                  const Icon = help.icon;
                  return (
                    <button
                      key={u.id}
                      onClick={() => router.push(loginAs(u.id))}
                      className="flex min-w-0 items-start gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-left hover:bg-teal-soft/50"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-soft text-teal">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{u.name}</span>
                        <span className="block text-xs leading-snug text-muted">
                          {roleLabel(u.role)} · {help.line}
                        </span>
                      </span>
                    </button>
                  );
                })}
                {DEMO_USERS.filter((u) => u.id === "u-lab").map((u) => {
                  const help = ROLE_HELP.lab_staff;
                  const Icon = help.icon;
                  return (
                    <button
                      key={u.id}
                      onClick={() => router.push(loginAs(u.id))}
                      className="flex min-w-0 items-start gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-left hover:bg-teal-soft/50"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-soft text-teal">
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{u.name}</span>
                        <span className="block text-xs text-muted">
                          Lab · samples, D2 acids, burnt gas
                        </span>
                      </span>
                    </button>
                  );
                })}
                {DEMO_USERS.filter((u) => u.id === "u-drv-ganesh").map((u) => {
                  const help = ROLE_HELP.driver;
                  const Icon = help.icon;
                  return (
                    <button
                      key={u.id}
                      onClick={() => router.push(loginAs(u.id))}
                      className="flex min-w-0 items-start gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-left hover:bg-teal-soft/50"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold-soft text-gold">
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{u.name}</span>
                        <span className="block text-xs text-muted">
                          Truck driver · days, trips, monthly pay
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <MoreDemos loginAs={loginAs} routerPush={(p) => router.push(p)} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function MoreDemos({
  loginAs,
  routerPush,
}: {
  loginAs: (id: string) => string;
  routerPush: (path: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const extra = DEMO_USERS.filter(
    (u) =>
      [
        "auditor",
        "super_admin",
        "store_staff",
        "production_staff",
        "sales_staff",
        "accountant",
        "hr_staff",
        "employee",
        "driver",
        "lab_staff",
      ].includes(u.role) && u.id !== "u-drv-ganesh" && u.id !== "u-lab",
  );

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs font-medium text-muted hover:text-ink"
      >
        {open ? "Hide other desks" : "More desks (store, drivers, HR…)"}
      </button>
      {open ? (
        <div className="mt-2 grid gap-1.5">
          {extra.map((u) => (
            <button
              key={u.id}
              onClick={() => routerPush(loginAs(u.id))}
              className="rounded-lg px-2 py-1.5 text-left text-sm hover:bg-surface"
            >
              <span className="font-medium">{u.name}</span>
              <span className="ml-2 text-xs text-muted">
                {u.id === "u-emp"
                  ? "Purification · floor"
                  : u.id === "u-drv-kiran"
                    ? "Residue truck"
                    : roleLabel(u.role)}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
