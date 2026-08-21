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
import { COPY, fill, type Lang } from "./i18n";
import { toGujarati } from "./tr-gu";

type Theme = "light" | "dark";

const THEME_KEY = "urja-theme";
const LANG_KEY = "urja-lang";

interface Prefs {
  theme: Theme;
  lang: Lang;
  hydrated: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tr: (text: string) => string;
  locale: string;
}

const Ctx = createContext<Prefs | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const savedLang = localStorage.getItem(LANG_KEY);
    const nextTheme = savedTheme === "dark" ? "dark" : "light";
    const nextLang: Lang = savedLang === "gu" || savedLang === "hi" ? "gu" : "en";
    setThemeState(nextTheme);
    setLangState(nextLang);
    applyTheme(nextTheme);
    document.documentElement.lang = nextLang === "gu" ? "gu" : "en";
    setHydrated(true);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
    applyTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
    document.documentElement.lang = l === "gu" ? "gu" : "en";
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      fill(COPY[lang][key] ?? COPY.en[key] ?? key, vars),
    [lang],
  );

  const tr = useCallback(
    (text: string) => (lang === "gu" ? toGujarati(text) : text),
    [lang],
  );

  const locale = lang === "gu" ? "gu-IN" : "en-IN";

  const value = useMemo(
    () => ({
      theme,
      lang,
      hydrated,
      setTheme,
      toggleTheme,
      setLang,
      t,
      tr,
      locale,
    }),
    [theme, lang, hydrated, setTheme, toggleTheme, setLang, t, tr, locale],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePrefs must be inside PrefsProvider");
  return v;
}
