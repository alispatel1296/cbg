"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { BrandMark, Reveal } from "@/components/motion";
import { formatInr } from "@/lib/format";
import { usePrefs } from "@/lib/prefs";
import {
  CH4_WASTE_MONTH_INR,
  CRASH_LOSS_INR,
  DAYS_STOPPED_EQUALS_FEE,
  DAYS_TO_EARN_FEE_FROM_CH4,
  DAYS_TO_EARN_FEE_FROM_MIX,
  MIX_EXTRA_MONTH_INR,
  MONEY_HOLES,
  MONTHS_OF_URJA_PER_CRASH,
  STOPPED_DAY_INR,
  URJA_PRICE_INR,
} from "@/lib/money-story";

export default function LandingPage() {
  const { lang, setLang, t } = usePrefs();
  const [sent, setSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({
    name: "",
    plant: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen text-ink">
      <header
        className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-2 px-3 py-3 sm:px-5 md:px-10 ${
          scrolled
            ? "border-b border-line bg-raised/95 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <BrandMark light={!scrolled} />
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "gu" : "en")}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium sm:px-3.5 sm:text-sm ${
              scrolled
                ? "border border-line bg-raised text-ink"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            {lang === "en" ? t("langOther") : t("english")}
          </button>
          <Link
            href="/login"
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium sm:px-3.5 sm:text-sm ${
              scrolled
                ? "bg-teal text-white hover:bg-teal-deep"
                : "bg-white text-teal-deep hover:bg-white/90"
            }`}
          >
            <span className="sm:hidden">Open</span>
            <span className="hidden sm:inline">Open sample plant</span>
          </Link>
        </div>
      </header>

      <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-teal-deep px-3 pb-16 pt-28 sm:px-5 md:px-10 md:pb-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-teal-deep via-teal-deep/80 to-teal-deep/40" />
        <div className="landing-rise relative z-10 mx-auto w-full max-w-5xl">
          <p className="mb-3 text-sm font-medium text-white/70">
            For the owner who counts every rupee
          </p>
          <h1 className="max-w-4xl text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            If the plant stops for {DAYS_STOPPED_EQUALS_FEE} days, you already
            paid for Urja.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            Urja is {formatInr(URJA_PRICE_INR)} a month. One dead day of gas is{" "}
            {formatInr(STOPPED_DAY_INR)}. One sour tank is{" "}
            {formatInr(CRASH_LOSS_INR, true)}. You are not buying an app. You are
            buying that these holes stay shut.
          </p>
          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <HeroNum
              label="Urja"
              value={formatInr(URJA_PRICE_INR, true)}
              hint="every month"
            />
            <HeroNum
              label="Plant stops 1 day"
              value={formatInr(STOPPED_DAY_INR, true)}
              hint="gas you did not sell"
            />
            <HeroNum
              label="One tank dies"
              value={formatInr(CRASH_LOSS_INR, true)}
              hint={`${MONTHS_OF_URJA_PER_CRASH} months of Urja`}
            />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-teal-deep hover:bg-white/90"
            >
              Open a sample plant — free
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#holes"
              className="inline-flex items-center justify-center px-2 py-2.5 text-sm font-medium text-white/80 hover:text-white"
            >
              Show me the holes
            </a>
          </div>
          <p className="mt-4 text-sm text-white/55">
            No card. No salesman on the first click. You look. Then you decide.
          </p>
        </div>
      </section>

      <section id="holes" className="bg-raised px-5 py-16 md:px-10 md:py-24">
        <Reveal className="mx-auto max-w-5xl">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            These holes are already in the plant. Registers do not show them.
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted">
            A tight owner pays when the hole is bigger than the fee. Count with
            us.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {MONEY_HOLES.map((h) => (
              <div
                key={h.id}
                className="rounded-xl border border-line bg-bg p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {h.when}
                </p>
                <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">
                  {formatInr(h.rupees, true)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {h.plain}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line bg-bg px-5 py-16 md:px-10 md:py-24">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            When does ₹75,000 come back?
          </h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {[
              {
                t: "Only the gas cleaner is wasting",
                d: `${DAYS_TO_EARN_FEE_FROM_CH4} days`,
                n: `${formatInr(CH4_WASTE_MONTH_INR, true)} / month going out the pipe`,
              },
              {
                t: "Dung mix is a bit wrong",
                d: `${DAYS_TO_EARN_FEE_FROM_MIX} days`,
                n: `${formatInr(MIX_EXTRA_MONTH_INR, true)} / month extra gas you did not make`,
              },
              {
                t: "Line stops once",
                d: `${DAYS_STOPPED_EQUALS_FEE} days`,
                n: `${formatInr(STOPPED_DAY_INR)} of CBG not sold`,
              },
              {
                t: "One tank goes sour",
                d: `${MONTHS_OF_URJA_PER_CRASH} months paid`,
                n: `${formatInr(CRASH_LOSS_INR, true)} gone in ~3 weeks`,
              },
            ].map((r) => (
              <li
                key={r.t}
                className="flex flex-wrap items-baseline justify-between gap-2 py-4"
              >
                <div>
                  <p className="font-medium">{r.t}</p>
                  <p className="text-sm text-muted">{r.n}</p>
                </div>
                <p className="text-lg font-semibold text-teal">{r.d}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-muted">
            If we sit at your plant and cannot show a hole bigger than{" "}
            {formatInr(URJA_PRICE_INR)}, do not pay. Keep your money.
          </p>
        </Reveal>
      </section>

      <section className="bg-teal-soft/40 px-5 py-16 md:px-10 md:py-24">
        <Reveal className="mx-auto max-w-5xl">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            You stay the boss. Staff cannot empty the pocket.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                t: "You tick big money",
                d: "Buy over ₹10,000, salary advance, extra discount — nothing goes until you say yes on the phone.",
              },
              {
                t: "Store girl can run it",
                d: "Green = fine. Yellow = look. Red = stop. No English essay. WhatsApp OTP. Same as the phone they already use.",
              },
              {
                t: "Truck short? Pay less",
                d: "Ordered 40 t, got 38.4 t — the page says pay for 38.4. Paper books miss this. That is how money leaves.",
              },
            ].map((c) => (
              <div key={c.t} className="border-t-2 border-teal pt-5">
                <h3 className="text-xl font-semibold">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {c.d}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-raised px-5 py-16 md:px-10 md:py-24">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            How a tight owner buys this
          </h2>
          <ol className="mt-10 space-y-8">
            {[
              {
                n: "1",
                t: "Open the sample plant today",
                d: "Click once. See money stuck, stock that will stop the line, tank going yellow. Two minutes. No form.",
              },
              {
                n: "2",
                t: "We come to YOUR plant",
                d: "We put YOUR trucks, YOUR dues, YOUR tanks on the same pages. If the holes are smaller than ₹75,000, you walk away.",
              },
              {
                n: "3",
                t: "Start with what you already write",
                d: "No new machine on day one. Godown, bills, staff. Sensors later — only if you want them.",
              },
            ].map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal text-sm font-semibold text-white">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{s.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {s.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="border-t border-line bg-bg px-5 py-16 md:px-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">
            What it costs
          </p>
          <p className="mt-2 text-5xl font-semibold tabular-nums tracking-tight">
            {formatInr(URJA_PRICE_INR)}
          </p>
          <p className="mt-2 text-muted">
            a month for the full plant. One number. Smaller factory without tanks
            is ₹20,000. Carbon papers — later, only if that money is real.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal px-5 py-3 text-sm font-medium text-white hover:bg-teal-deep"
          >
            See it on a real plant screen
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>

      <section
        id="walkthrough"
        className="relative overflow-hidden px-3 py-16 sm:px-5 md:px-10 md:py-24"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal via-teal-deep to-[#0f1c16]" />
        <div className="relative z-10 mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
              Come. Show the holes on my plant. Then I decide.
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Free visit. You do not pay ₹75,000 to have a look. You pay after
              you see your own numbers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white p-6 md:p-8">
            {sent ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-ok-soft text-ok">
                  <Check className="size-7" />
                </div>
                <p className="text-2xl font-semibold">We will call you</p>
                <p className="mt-2 text-muted">
                  Keep your phone on. We only come to count holes — not to push
                  papers.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-block font-medium text-teal"
                >
                  Meanwhile, open the sample plant →
                </Link>
              </div>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <p className="text-xl font-semibold">Ask us to come</p>
                {(
                  [
                    ["name", "Your name", "Rajesh"],
                    ["plant", "Plant / factory name", "Greenfield Nashik"],
                    ["phone", "Phone (WhatsApp)", "+91 98765 43210"],
                    ["city", "City", "Nashik"],
                  ] as const
                ).map(([key, label, ph]) => (
                  <label
                    key={key}
                    className="block text-xs font-medium text-muted"
                  >
                    {label}
                    <input
                      required
                      className="mt-1 w-full rounded-lg border border-line bg-raised px-4 py-3 text-base font-medium text-ink outline-none focus:border-teal"
                      placeholder={ph}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  </label>
                ))}
                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-teal py-2.5 text-sm font-medium text-white hover:bg-teal-deep"
                >
                  Call me. Show the holes.
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-raised px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <p className="text-sm text-muted">
            {formatInr(URJA_PRICE_INR)} / month · full plant
          </p>
          <Link href="/login" className="text-sm font-medium text-teal">
            Open sample plant
          </Link>
        </div>
      </footer>
    </div>
  );
}

function HeroNum({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-4">
      <p className="text-sm text-white/70">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums text-white md:text-4xl">
        {value}
      </p>
      <p className="mt-1 text-sm text-white/55">{hint}</p>
    </div>
  );
}
