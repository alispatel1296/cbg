"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_USERS, PLANTS, homePathForRole } from "./data";
import type { Plant, Role, TierId, User } from "./types";

const STORAGE_KEY = "urja-mrv-session";

interface AuthContextValue {
  user: User | null;
  activePlantId: string;
  hydrated: boolean;
  login: (opts: { email?: string; phone?: string; role?: Role }) => string;
  loginAs: (userId: string) => string;
  logout: () => void;
  setActivePlantId: (id: string) => void;
  setTier: (tier: TierId) => void;
  completeOnboarding: () => void;
  plants: Plant[];
  activePlant: Plant | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadSession(): {
  user: User | null;
  activePlantId: string;
} {
  if (typeof window === "undefined") {
    return { user: null, activePlantId: PLANTS[0].id };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, activePlantId: PLANTS[0].id };
    const parsed = JSON.parse(raw) as {
      userId?: string;
      activePlantId?: string;
      tier?: TierId;
    };
    const base = DEMO_USERS.find((u) => u.id === parsed.userId) ?? null;
    const user = base
      ? { ...base, tier: parsed.tier ?? base.tier }
      : null;
    return {
      user,
      activePlantId: parsed.activePlantId ?? user?.plantIds[0] ?? PLANTS[0].id,
    };
  } catch {
    return { user: null, activePlantId: PLANTS[0].id };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activePlantId, setActivePlantIdState] = useState(PLANTS[0].id);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const session = loadSession();
    setUser(session.user);
    setActivePlantIdState(session.activePlantId);
    setHydrated(true);
  }, []);

  const persist = useCallback((nextUser: User | null, plantId: string) => {
    if (!nextUser) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        userId: nextUser.id,
        activePlantId: plantId,
        tier: nextUser.tier,
      }),
    );
  }, []);

  const loginAs = useCallback(
    (userId: string) => {
      const next = DEMO_USERS.find((u) => u.id === userId);
      if (!next) return "/login";
      const plantId = next.plantIds[0] ?? PLANTS[0].id;
      setUser(next);
      setActivePlantIdState(plantId);
      persist(next, plantId);
      if (!next.onboardingComplete) return "/onboarding";
      return homePathForRole(next.role);
    },
    [persist],
  );

  const login = useCallback(
    ({ email, phone, role }: { email?: string; phone?: string; role?: Role }) => {
      const match =
        DEMO_USERS.find(
          (u) =>
            (email && u.email.toLowerCase() === email.toLowerCase()) ||
            (phone && u.phone.replace(/\s/g, "") === phone.replace(/\s/g, "")),
        ) ??
        DEMO_USERS.find((u) => (role ? u.role === role : false)) ??
        DEMO_USERS[0];
      return loginAs(match.id);
    },
    [loginAs],
  );

  const logout = useCallback(() => {
    setUser(null);
    persist(null, PLANTS[0].id);
  }, [persist]);

  const setActivePlantId = useCallback(
    (id: string) => {
      setActivePlantIdState(id);
      if (user) persist(user, id);
    },
    [persist, user],
  );

  const setTier = useCallback(
    (tier: TierId) => {
      if (!user) return;
      const next = { ...user, tier };
      setUser(next);
      persist(next, activePlantId);
    },
    [activePlantId, persist, user],
  );

  const completeOnboarding = useCallback(() => {
    if (!user) return;
    const next = { ...user, onboardingComplete: true };
    setUser(next);
    persist(next, activePlantId);
  }, [activePlantId, persist, user]);

  const plants = useMemo(() => {
    if (!user) return [];
    if (user.role === "super_admin") return PLANTS;
    return PLANTS.filter((p) => user.plantIds.includes(p.id));
  }, [user]);

  const activePlant =
    plants.find((p) => p.id === activePlantId) ?? plants[0] ?? null;

  const value: AuthContextValue = {
    user,
    activePlantId: activePlant?.id ?? activePlantId,
    hydrated,
    login,
    loginAs,
    logout,
    setActivePlantId,
    setTier,
    completeOnboarding,
    plants,
    activePlant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
