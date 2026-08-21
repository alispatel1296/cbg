"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePrefs } from "@/lib/prefs";
import { translateDom } from "@/lib/tr-gu";

export function GuDom({ children }: { children: ReactNode }) {
  const { lang, hydrated } = usePrefs();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!hydrated || lang !== "gu") return;
    const root = document.body;
    let queued = false;
    const run = () => {
      queued = false;
      translateDom(root);
    };
    const kick = () => {
      if (queued) return;
      queued = true;
      queueMicrotask(run);
    };
    run();
    const mo = new MutationObserver(kick);
    mo.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
    });
    return () => mo.disconnect();
  }, [hydrated, lang]);

  return (
    <div ref={ref} key={lang} className="contents">
      {children}
    </div>
  );
}
