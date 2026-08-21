"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Factory, MapPin, Truck } from "lucide-react";
import { FACTORY, googleRouteEmbed, type GeoPoint } from "@/lib/extras";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/cn";

const TILE = 256;
const MAP_H =
  "h-[min(22rem,42svh)] min-h-[16rem] w-full sm:h-[28rem] lg:h-[32rem]";

function lngToX(lng: number, z: number) {
  return ((lng + 180) / 360) * 2 ** z;
}

function latToY(lat: number, z: number) {
  const s = Math.sin((lat * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * 2 ** z;
}

function pointAlong(path: GeoPoint[], t: number): GeoPoint {
  const start = path[0];
  const end = path[path.length - 1] ?? start;
  if (!start) return { name: FACTORY.name, lat: FACTORY.lat, lng: FACTORY.lng };
  if (path.length === 1 || t <= 0) return start;
  if (t >= 1) return end;
  const seg = (path.length - 1) * t;
  const i = Math.min(Math.floor(seg), path.length - 2);
  const f = seg - i;
  return {
    name: path[i].name,
    lat: path[i].lat + (path[i + 1].lat - path[i].lat) * f,
    lng: path[i].lng + (path[i + 1].lng - path[i].lng) * f,
  };
}

function tileUrl(z: number, x: number, y: number, dark: boolean) {
  const s = ["a", "b", "c", "d"][(x + y) % 4];
  const style = dark ? "dark_all" : "rastertiles/voyager";
  return `https://${s}.basemaps.cartocdn.com/${style}/${z}/${x}/${y}.png`;
}

export function RouteScene({
  path,
  progress,
  movingLabel,
  eta,
  kmLeft,
  className,
}: {
  path: GeoPoint[];
  progress: number;
  movingLabel: string;
  eta?: string;
  kmLeft?: number;
  className?: string;
}) {
  const { theme, tr } = usePrefs();
  const dark = theme === "dark";
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [mode, setMode] = useState<"scene" | "road">("scene");

  useEffect(() => {
    if (mode !== "scene") return;
    const el = wrapRef.current;
    if (!el) return;
    const sync = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 8 || h < 8) return;
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [mode]);

  const origin = path[0];
  const dest = path[path.length - 1];
  const here = pointAlong(path, progress);
  const doneName =
    progress >= 1
      ? dest?.name
      : progress <= 0
        ? origin?.name
        : here.name;

  const view = useMemo(() => {
    const pts = path.length ? path : [{ lat: FACTORY.lat, lng: FACTORY.lng }];
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);
    const padX = Math.min(88, w * 0.18);
    const padY = Math.min(96, h * 0.22);
    const innerW = Math.max(80, w - padX * 2);
    const innerH = Math.max(80, h - padY * 2);

    let z = 11;
    for (let tryZ = 14; tryZ >= 9; tryZ--) {
      const xs = pts.map((p) => lngToX(p.lng, tryZ));
      const ys = pts.map((p) => latToY(p.lat, tryZ));
      const spanX = (Math.max(...xs) - Math.min(...xs)) * TILE;
      const spanY = (Math.max(...ys) - Math.min(...ys)) * TILE;
      if (spanX <= innerW && spanY <= innerH) {
        z = tryZ;
        break;
      }
      z = tryZ;
    }

    const xs = pts.map((p) => lngToX(p.lng, z));
    const ys = pts.map((p) => latToY(p.lat, z));
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const viewW = w / TILE;
    const viewH = h / TILE;
    const originX = cx - viewW / 2;
    const originY = cy - viewH / 2;

    const project = (lat: number, lng: number) => ({
      x: (lngToX(lng, z) - originX) * TILE,
      y: (latToY(lat, z) - originY) * TILE,
    });
    const x0 = Math.floor(originX) - 1;
    const y0 = Math.floor(originY) - 1;
    const x1 = Math.ceil(originX + viewW) + 1;
    const y1 = Math.ceil(originY + viewH) + 1;
    const tiles: { x: number; y: number; left: number; top: number }[] = [];
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        tiles.push({
          x,
          y,
          left: (x - originX) * TILE,
          top: (y - originY) * TILE,
        });
      }
    }
    const projected = pts.map((p) => project(p.lat, p.lng));
    const done = pointAlong(path, progress);
    const truck = project(done.lat, done.lng);
    const factory = project(FACTORY.lat, FACTORY.lng);
    const start = project(origin?.lat ?? FACTORY.lat, origin?.lng ?? FACTORY.lng);
    const end = project(dest?.lat ?? FACTORY.lat, dest?.lng ?? FACTORY.lng);
    const cut = Math.max(1, Math.round((projected.length - 1) * progress) + 1);
    return { z, tiles, projected, truck, factory, start, end, cut, w, h };
  }, [path, progress, size.h, size.w, origin?.lat, origin?.lng, dest?.lat, dest?.lng]);

  const d = view.projected
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const dDone = view.projected
    .slice(0, view.cut)
    .concat(progress > 0 && progress < 1 ? [view.truck] : [])
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const from = origin ?? FACTORY;
  const to = dest ?? FACTORY;

  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-line",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-line bg-raised px-3 py-2">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold leading-tight sm:text-base">
            {FACTORY.short} · {FACTORY.gate}
          </p>
          <p className="hidden truncate text-xs text-muted sm:block">
            {FACTORY.address}
          </p>
        </div>
        <div className="flex shrink-0 gap-1 rounded-lg border border-line bg-surface p-0.5">
          <button
            type="button"
            onClick={() => setMode("scene")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-bold",
              mode === "scene" ? "bg-teal text-white" : "text-muted",
            )}
          >
            {tr("Route")}
          </button>
          <button
            type="button"
            onClick={() => setMode("road")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-bold",
              mode === "road" ? "bg-teal text-white" : "text-muted",
            )}
          >
            {tr("Road map")}
          </button>
        </div>
      </div>

      {mode === "road" ? (
        <iframe
          title={`${from.name} to ${to.name}`}
          src={googleRouteEmbed(from, to)}
          className={cn("w-full border-0", MAP_H)}
          loading="lazy"
        />
      ) : (
        <div ref={wrapRef} className={cn("relative bg-[#dfe8d8]", MAP_H)}>
          <div className="absolute inset-0 overflow-hidden">
            {size.w > 0
              ? view.tiles.map((t) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${view.z}-${t.x}-${t.y}`}
                    alt=""
                    src={tileUrl(view.z, t.x, t.y, dark)}
                    className="absolute"
                    style={{
                      left: t.left,
                      top: t.top,
                      width: TILE,
                      height: TILE,
                      maxWidth: "none",
                    }}
                    draggable={false}
                  />
                ))
              : null}
          </div>

          {size.w > 0 ? (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${view.w} ${view.h}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d={d}
                fill="none"
                stroke={dark ? "rgba(255,255,255,0.25)" : "rgba(26,31,28,0.22)"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 10"
              />
              <path
                d={dDone || d}
                fill="none"
                stroke="#0d6b5c"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}

          {size.w > 0 ? (
            <>
              <Pin
                x={view.start.x}
                y={view.start.y}
                w={view.w}
                h={view.h}
                tone="muted"
                icon={<MapPin className="size-3.5" />}
                label={origin?.name ?? tr("Start")}
                sub={tr("Pickup")}
                hide={
                  Math.hypot(
                    (origin?.lat ?? 0) - FACTORY.lat,
                    (origin?.lng ?? 0) - FACTORY.lng,
                  ) < 0.003
                }
              />
              <Pin
                x={view.factory.x}
                y={view.factory.y}
                w={view.w}
                h={view.h}
                tone="teal"
                icon={<Factory className="size-3.5" />}
                label={FACTORY.name}
                sub={tr("Pad")}
              />
              <Pin
                x={view.end.x}
                y={view.end.y}
                w={view.w}
                h={view.h}
                tone="muted"
                icon={<MapPin className="size-3.5" />}
                label={dest?.name ?? tr("End")}
                sub={tr("Drop")}
                hide={
                  Math.hypot(
                    (dest?.lat ?? 0) - FACTORY.lat,
                    (dest?.lng ?? 0) - FACTORY.lng,
                  ) < 0.003
                }
              />
              <Pin
                x={view.truck.x}
                y={view.truck.y}
                w={view.w}
                h={view.h}
                tone="gold"
                pulse={progress > 0 && progress < 1}
                icon={<Truck className="size-3.5" />}
                label={movingLabel}
                sub={doneName}
              />
            </>
          ) : null}

          <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex items-end justify-between gap-2">
            <div className="min-w-0 rounded-lg bg-raised/95 px-3 py-2 shadow-sm ring-1 ring-line">
              <p className="truncate text-xs font-bold">
                {origin?.name} → {dest?.name}
              </p>
              <p className="truncate text-xs text-muted">
                {tr("Now at")} {doneName}
                {typeof kmLeft === "number" ? ` · ${kmLeft} ${tr("km left")}` : ""}
                {eta ? ` · ${tr("ETA")} ${eta}` : ""}
              </p>
            </div>
            <p className="hidden shrink-0 rounded bg-raised/80 px-1.5 py-0.5 text-[10px] text-muted sm:block">
              Map © OpenStreetMap © CARTO
            </p>
          </div>
        </div>
      )}

      <ol className="grid grid-cols-2 border-t border-line sm:flex sm:flex-wrap">
        {path.map((stop, i) => {
          const at = Math.round(progress * Math.max(path.length - 1, 1));
          const state = i < at ? "done" : i === at ? "now" : "wait";
          return (
            <li
              key={`${stop.name}-${i}`}
              className={cn(
                "min-w-0 border-b border-r border-line px-2.5 py-2 sm:min-w-[7.5rem] sm:flex-1 sm:border-b-0",
                state === "now" && "bg-teal-soft",
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                {i + 1}
                {state === "now"
                  ? ` · ${tr("now")}`
                  : state === "done"
                    ? ` · ${tr("passed")}`
                    : ""}
              </p>
              <p className="text-sm font-semibold leading-snug">{stop.name}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Pin({
  x,
  y,
  w,
  h,
  tone,
  icon,
  label,
  sub,
  pulse,
  hide,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: "teal" | "gold" | "muted";
  icon: ReactNode;
  label: string;
  sub: string;
  pulse?: boolean;
  hide?: boolean;
}) {
  if (hide) return null;
  const left = Math.min(Math.max(x, 44), Math.max(44, w - 44));
  const top = Math.min(Math.max(y, 56), Math.max(56, h - 52));
  const nearLeft = left < 96;
  const nearRight = left > w - 96;
  const nearTop = top < 72;
  const chip =
    tone === "teal"
      ? "bg-teal text-white"
      : tone === "gold"
        ? "bg-gold text-white"
        : "bg-raised text-ink ring-1 ring-line";
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10",
        nearTop ? "translate-y-1" : "-translate-y-full",
        nearLeft
          ? "translate-x-0"
          : nearRight
            ? "-translate-x-full"
            : "-translate-x-1/2",
      )}
      style={{ left, top }}
    >
      <div
        className={cn(
          "mb-1 flex flex-col",
          nearLeft ? "items-start" : nearRight ? "items-end" : "items-center",
        )}
      >
        {!nearTop ? (
          <div className="rounded-md bg-raised/95 px-1.5 py-0.5 text-center shadow-sm ring-1 ring-line">
            <p className="max-w-[8.5rem] truncate text-[10px] font-bold leading-tight">
              {label}
            </p>
            <p className="text-[10px] leading-tight text-muted">{sub}</p>
          </div>
        ) : null}
        <div
          className={cn(
            "mt-1 flex size-8 items-center justify-center rounded-full shadow-md",
            chip,
            pulse && "ring-4 ring-gold/35",
          )}
        >
          {icon}
        </div>
        {nearTop ? (
          <div className="rounded-md bg-raised/95 px-1.5 py-0.5 text-center shadow-sm ring-1 ring-line">
            <p className="max-w-[8.5rem] truncate text-[10px] font-bold leading-tight">
              {label}
            </p>
            <p className="text-[10px] leading-tight text-muted">{sub}</p>
          </div>
        ) : (
          <span className="block h-2 w-0.5 bg-ink/40" />
        )}
      </div>
    </div>
  );
}
