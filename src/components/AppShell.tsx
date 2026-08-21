"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeIndianRupee,
  Bell,
  Boxes,
  CalendarCheck2,
  ChevronDown,
  ClipboardList,
  FileText,
  FlaskConical,
  FolderOpen,
  Factory,
  Gauge,
  GitBranch,
  Landmark,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Package,
  PieChart,
  Radio,
  Receipt,
  Scale,
  ScrollText,
  Settings,
  Shield,
  ShieldCheck,
  Sprout,
  TestTubes,
  Truck,
  UserRound,
  Users,
  Waypoints,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { canAccess } from "@/lib/data";
import { canUsePath, tierLabel, TIERS } from "@/lib/tiers";
import { PLANT_TODAY_LABEL } from "@/lib/plant-clock";
import { cn } from "@/lib/cn";
import { StatusPill } from "./ui";
import { BrandMark, PageEnter } from "./motion";
import { PrefsBar } from "./PrefsBar";
import { usePrefs } from "@/lib/prefs";
import { NAV_KEY } from "@/lib/i18n";
import { quickPaths } from "@/lib/nav";
import type { User } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

type NavGroup = {
  id: string;
  title: string;
  open: "always" | "daily" | "if-used";
  items: NavItem[];
};

const GROUPS: NavGroup[] = [
  {
    id: "now",
    title: "Now",
    open: "always",
    items: [
      { href: "/dashboard", label: "Today", icon: LayoutDashboard },
      { href: "/alerts", label: "Warnings", icon: Bell },
      { href: "/work-orders", label: "Jobs", icon: ClipboardList },
    ],
  },
  {
    id: "daily",
    title: "Daily work",
    open: "daily",
    items: [
      { href: "/alerts", label: "Warnings", icon: Bell },
      { href: "/work-orders", label: "Jobs", icon: ClipboardList },
      { href: "/inventory", label: "Stock", icon: Boxes },
      { href: "/production", label: "Floor", icon: Factory },
      { href: "/sales", label: "Sales", icon: Receipt },
      { href: "/suppliers", label: "Pay out", icon: Landmark },
      { href: "/workforce", label: "Staff", icon: Users },
      { href: "/finance", label: "Money", icon: PieChart },
      { href: "/feedstock", label: "Trucks", icon: Scale },
    ],
  },
  {
    id: "records",
    title: "Records",
    open: "if-used",
    items: [
      { href: "/people", label: "People", icon: UserRound },
      { href: "/docs", label: "Papers", icon: FolderOpen },
      { href: "/reports", label: "Reports", icon: FileText },
      { href: "/audit-log", label: "Change log", icon: ScrollText },
    ],
  },
  {
    id: "plant",
    title: "Plant",
    open: "if-used",
    items: [
      { href: "/digesters", label: "Tanks", icon: FlaskConical },
      { href: "/yield", label: "Mix", icon: Sprout },
      { href: "/gas", label: "Gas", icon: Truck },
      { href: "/lab", label: "Lab", icon: TestTubes },
      { href: "/fertilizer", label: "FOM", icon: Package },
      { href: "/compliance", label: "Govt dates", icon: CalendarCheck2 },
      { href: "/devices", label: "Machines", icon: Radio },
      { href: "/mass-balance", label: "In vs out", icon: Waypoints },
      { href: "/data-quality", label: "Data gaps", icon: ShieldCheck },
    ],
  },
  {
    id: "carbon",
    title: "Carbon",
    open: "if-used",
    items: [
      { href: "/carbon", label: "Credits", icon: Leaf },
      { href: "/evidence", label: "Proof", icon: Shield },
      { href: "/ci-score", label: "CI score", icon: Gauge },
      { href: "/portfolio", label: "All plants", icon: GitBranch },
    ],
  },
];

function visibleItems(group: NavGroup, role: User["role"], tier: User["tier"]) {
  return group.items.filter(
    (item) => canAccess(role, item.href) && canUsePath(tier, item.href),
  );
}

function lockedCount(group: NavGroup, role: User["role"], tier: User["tier"]) {
  return group.items.filter(
    (item) => canAccess(role, item.href) && !canUsePath(tier, item.href),
  ).length;
}

const ALL_ITEMS: NavItem[] = [
  ...GROUPS.flatMap((g) => g.items),
  { href: "/me", label: "My card", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = usePrefs();
  const pathname = usePathname();
  const router = useRouter();
  const { user, plants, activePlant, setActivePlantId, logout, hydrated } =
    useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, user, router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        {t("opening")}
      </div>
    );
  }

  const owner = user.role === "plant_owner" || user.role === "super_admin";
  const allowed = (href: string) =>
    canAccess(user.role, href) && canUsePath(user.tier, href);
  const quickHrefs = quickPaths(user.role, allowed);
  const quickSet = new Set(quickHrefs);
  const quickItems = quickHrefs
    .map((href) => ALL_ITEMS.find((i) => i.href === href))
    .filter((i): i is NavItem => Boolean(i));

  const asideInner = (
    <div className="flex h-full flex-col px-2.5 py-3">
      <Link href={quickHrefs[0] ?? "/dashboard"} className="mb-4 hidden px-2 pt-1 lg:block">
        <BrandMark size="sm" />
      </Link>

      {plants.length > 1 ? (
        <label className="mb-3 block px-1">
          <span className="mb-1 block text-[11px] font-medium text-muted">
            {t("plant")}
          </span>
          <select
            className="w-full rounded-lg border border-line bg-raised px-2.5 py-2 text-sm font-medium outline-none"
            value={activePlant?.id}
            onChange={(e) => setActivePlantId(e.target.value)}
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-muted">
            {t("plantDay")} {PLANT_TODAY_LABEL}
          </p>
        </label>
      ) : activePlant ? (
        <p className="mb-3 truncate px-2 text-xs text-muted">
          {activePlant.name} · {t("plantDay")} {PLANT_TODAY_LABEL}
        </p>
      ) : null}

      <nav className="nav-scroll flex-1 space-y-1 overflow-y-auto pr-1">
        {quickItems.length ? (
          <div className="mb-2">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
              {t("now")}
            </p>
            <div className="space-y-0.5">
              {quickItems.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} t={t} />
              ))}
            </div>
          </div>
        ) : null}
        {GROUPS.filter((group) => group.id !== "now").map((group) => {
          const items = visibleItems(group, user.role, user.tier).filter(
            (i) => !quickSet.has(i.href),
          );
          const locked = owner
            ? lockedCount(group, user.role, user.tier)
            : 0;
          if (!items.length && !locked) return null;
          return (
            <NavBlock
              key={group.id}
              group={group}
              items={items}
              locked={locked}
              pathname={pathname}
              showLockedHint={owner && locked > 0}
              t={t}
            />
          );
        })}
      </nav>

      <div className="mt-2 space-y-1 border-t border-line px-1 pt-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-2.5 text-base",
            pathname.startsWith("/settings")
              ? "bg-teal-soft font-medium text-teal"
              : "text-muted hover:bg-surface hover:text-ink",
          )}
        >
          <Settings className="size-5" strokeWidth={1.75} />
          {t("team")}
        </Link>
        {owner ? (
          <Link
            href="/pricing"
            className={cn(
              "flex items-center gap-2 rounded-lg px-2 py-2.5 text-base",
              pathname.startsWith("/pricing")
                ? "bg-teal-soft font-medium text-teal"
                : "text-muted hover:bg-surface hover:text-ink",
            )}
          >
            <BadgeIndianRupee className="size-5" strokeWidth={1.75} />
            {t("plan")} · {TIERS.find((x) => x.id === user.tier)?.monthlyDisplay}
          </Link>
        ) : (
          <p className="px-2 text-[11px] text-muted">
            {tierLabel(user.tier)}
          </p>
        )}
        <Link href="/me" className="block px-2 pt-2">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted">{t(`role.${user.role}`)}</p>
        </Link>
        {user.role === "auditor" ? (
          <div className="px-2 pt-1">
            <StatusPill status="neutral" label={t("viewOnly")} />
          </div>
        ) : null}
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-surface hover:text-ink"
        >
          <LogOut className="size-3.5" />
          {t("logOut")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg">
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-raised px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-line"
          aria-label={t("menu")}
        >
          <Menu className="size-5" />
        </button>
        <Link href={quickHrefs[0] ?? "/dashboard"} className="min-w-0 flex-1 overflow-hidden">
          <BrandMark size="sm" />
        </Link>
        <PrefsBar compact />
      </div>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          aria-label={t("closeMenu")}
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        <aside
          className={cn(
            "border-line bg-raised lg:sticky lg:top-0 lg:block lg:h-screen lg:border-r",
            menuOpen
              ? "fixed inset-y-0 left-0 z-50 w-[min(280px,88vw)] overflow-y-auto border-r"
              : "hidden",
          )}
          style={{ viewTransitionName: "app-nav" }}
        >
          {asideInner}
        </aside>

        <main className="min-w-0 px-3 py-4 pb-24 sm:px-4 md:px-8 md:py-6 lg:pb-6">
          <div className="mb-5 hidden flex-wrap items-center gap-2 text-sm lg:flex">
            {activePlant ? (
              <>
                <span className="inline-flex items-center gap-1.5 font-medium text-ok">
                  <span className="live-dot size-1.5 rounded-full bg-ok" />
                  {t("live")}
                </span>
                <span className="text-muted">·</span>
                <span className="font-medium">{activePlant.name}</span>
                <StatusPill
                  status={activePlant.healthStatus}
                  label={
                    activePlant.healthStatus === "green"
                      ? t("ok")
                      : activePlant.healthStatus === "amber"
                        ? t("watch")
                        : t("alert")
                  }
                />
              </>
            ) : null}
            <PrefsBar />
          </div>
          <PageEnter>{children}</PageEnter>
        </main>
      </div>

      {quickItems.length ? (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-raised px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 lg:hidden">
          <ul
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${Math.min(quickItems.length, 5)}, minmax(0, 1fr))`,
            }}
          >
            {quickItems.slice(0, 5).map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              const key = NAV_KEY[item.href];
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[11px] font-semibold",
                      active ? "bg-teal-soft text-teal" : "text-muted",
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                    <span className="max-w-full truncate">
                      {key ? t(key) : item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}


function NavBlock({
  group,
  items,
  locked,
  pathname,
  showLockedHint,
  t,
}: {
  group: NavGroup;
  items: NavItem[];
  locked: number;
  pathname: string;
  showLockedHint: boolean;
  t: (k: string) => string;
}) {
  const hasActive = items.some(
    (i) => pathname === i.href || pathname.startsWith(`${i.href}/`),
  );
  const startOpen =
    group.open === "always" || group.open === "daily" || hasActive;
  const [open, setOpen] = useState(startOpen);
  const title = t(group.id);

  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  if (group.open === "always") {
    return (
      <div className="mb-2">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
          {title}
        </p>
        <div className="space-y-0.5">
          {items.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} t={t} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted hover:bg-surface"
      >
        {title}
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="space-y-0.5 pb-1">
          {items.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} t={t} />
          ))}
          {showLockedHint ? (
            <p className="px-2.5 py-1 text-[11px] text-muted">
              {locked} more — extra money ·{" "}
              <Link href="/pricing" className="text-teal hover:underline">
                {t("plan")}
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function NavLink({
  item,
  pathname,
  t,
}: {
  item: NavItem;
  pathname: string;
  t: (k: string) => string;
}) {
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;
  const key = NAV_KEY[item.href];
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-base",
        active
          ? "bg-teal-soft font-medium text-teal"
          : "text-ink hover:bg-surface",
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.75} />
      <span className="truncate">{key ? t(key) : item.label}</span>
    </Link>
  );
}
