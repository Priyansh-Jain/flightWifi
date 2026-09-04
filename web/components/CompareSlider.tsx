"use client";

import { useEffect, useRef, useState } from "react";
import { Shot } from "./Shot";
import { ChipTip } from "./ChipTip";
import type { TipData } from "@/lib/extension";

export type Hotspot = { x: number; y: number; w: number; h: number; tip: TipData };

export function CompareSlider({
  before,
  after,
  alt,
  beforeLabel,
  afterLabel,
  width,
  height,
  start = 14,
  intro = 34,
  hotspots = []
}: {
  before: string;
  after: string;
  alt: string;
  beforeLabel: string;
  afterLabel: string;
  width: number;
  height: number;
  start?: number;
  intro?: number;
  hotspots?: Hotspot[];
}) {
  const [pos, setPos] = useState(start + intro);
  const [focused, setFocused] = useState(false);
  const [tip, setTip] = useState<{ i: number; rect: DOMRect } | null>(null);
  const touched = useRef(false);
  const dragging = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPos(start);
      return;
    }
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        io.disconnect();
        const t0 = performance.now() + 250;
        const dur = 1100;
        const tick = (t: number) => {
          if (touched.current) return;
          const k = Math.min(1, Math.max(0, (t - t0) / dur));
          const e = 1 - Math.pow(1 - k, 3);
          setPos(start + intro * (1 - e));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [start, intro]);

  useEffect(() => {
    if (!tip) return;
    const hide = () => setTip(null);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide);
      window.removeEventListener("resize", hide);
    };
  }, [tip]);

  const stop = () => {
    touched.current = true;
  };
  const showTip = (i: number, el: HTMLElement) => setTip({ i, rect: el.getBoundingClientRect() });
  const setFromPointer = (e: React.PointerEvent<HTMLElement>) => {
    const r = surface.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };
  const img = "absolute left-0 top-0 h-full w-auto max-w-none";
  const sizes = "(max-width: 639px) 200vw, (max-width: 900px) 100vw, 900px";
  const frame = { "--cmp-wide": `${width} / ${height}`, "--cmp-narrow": `${width / 2} / ${height}` } as React.CSSProperties;

  return (
    <div ref={root} className="select-none">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-3 py-2 text-xs font-medium">
        <span>{beforeLabel}</span>
        <span className="text-[var(--muted)]">Drag to compare</span>
        <span>{afterLabel}</span>
      </div>
      <div ref={surface} className="cmp relative overflow-hidden" style={frame}>
        <Shot base={before} alt={alt} width={width} height={height} priority className={img} sizes={sizes} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }} aria-hidden="true">
          <Shot base={after} alt="" width={width} height={height} eager className={img} sizes={sizes} />
        </div>
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }} aria-hidden="true">
          <div className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white mix-blend-difference" />
          <div
            className={`absolute left-0 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#0b0f14]/20 bg-white text-[#0b0f14] shadow-lg ${focused ? "ring-2 ring-[var(--accent)] ring-offset-2" : ""}`}
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1 2 7l6 6" />
              <path d="m14 1 6 6-6 6" />
            </svg>
          </div>
        </div>
        <div
          className="absolute inset-0 cursor-ew-resize touch-pan-y"
          onPointerDown={(e) => {
            stop();
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setFromPointer(e);
          }}
          onPointerMove={(e) => {
            if (dragging.current) setFromPointer(e);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          aria-hidden="true"
        />
        {hotspots.length ? (
          <div
            className="pointer-events-none absolute left-0 top-0 h-full"
            style={{ aspectRatio: `${width} / ${height}`, clipPath: `inset(0 0 0 ${pos}%)` }}
          >
            {hotspots.map((h, i) => (
              <button
                key={i}
                type="button"
                className="hs pointer-events-auto absolute"
                style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
                aria-label={`${h.tip.label}: show details`}
                onPointerEnter={(e) => showTip(i, e.currentTarget)}
                onPointerLeave={() => setTip(null)}
                onFocus={(e) => showTip(i, e.currentTarget)}
                onBlur={() => setTip(null)}
                onPointerDown={(e) => {
                  stop();
                  dragging.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setFromPointer(e);
                }}
                onPointerMove={(e) => {
                  if (dragging.current) setFromPointer(e);
                }}
                onPointerUp={() => {
                  dragging.current = false;
                }}
                onPointerCancel={() => {
                  dragging.current = false;
                }}
              />
            ))}
          </div>
        ) : null}
        {tip && hotspots[tip.i] ? <ChipTip data={hotspots[tip.i].tip} anchor={tip.rect} /> : null}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => {
            stop();
            setPos(Number(e.target.value));
          }}
          onKeyDown={stop}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={`Compare: drag left for ${afterLabel}, right for ${beforeLabel}`}
          aria-valuetext={`${Math.round(pos)} percent showing ${beforeLabel}`}
          className="sr-only"
        />
      </div>
    </div>
  );
}
