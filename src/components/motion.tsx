"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function PageEnter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div key={pathname} className={cn("page-enter", className)}>
      {children}
    </div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOn(true);
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", on && "reveal-on", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export function AmbientField({ dark = false }: { dark?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={cn(
          "absolute -left-24 -top-24 h-[22rem] w-[22rem] rounded-full blur-3xl",
          dark ? "bg-white/5" : "bg-teal-soft",
        )}
      />
    </div>
  );
}

export function BrandMark({
  light = false,
  size = "md",
}: {
  light?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "lg" ? "size-10 text-base" : size === "sm" ? "size-7 text-xs" : "size-8 text-sm";
  return (
    <span className="inline-flex items-center gap-2" data-no-gu>
      <span
        className={cn(
          "flex items-center justify-center rounded-lg font-semibold",
          light ? "bg-white/15 text-white" : "bg-teal text-white",
          box,
        )}
      >
        U
      </span>
      <span
        className={cn(
          "font-semibold tracking-tight",
          size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl",
          light ? "text-white" : "text-ink",
        )}
      >
        Urja
      </span>
    </span>
  );
}
