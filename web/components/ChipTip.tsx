"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { TipData } from "@/lib/extension";

export function ChipTip({ data, anchor }: { data: TipData; anchor: DOMRect }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = el.getBoundingClientRect();
    const left = Math.max(8, Math.min(anchor.left, window.innerWidth - t.width - 8));
    const below = anchor.bottom + 8;
    const top = below + t.height > window.innerHeight - 8 ? Math.max(8, anchor.top - t.height - 8) : below;
    setPos({ left, top });
  }, [anchor, data]);

  return (
    <div
      ref={ref}
      className="fw-tip"
      role="tooltip"
      style={{ left: pos ? pos.left : anchor.left, top: pos ? pos.top : anchor.bottom + 8, visibility: pos ? "visible" : "hidden" }}
    >
      <div className={`fw-tip-head fw-${data.cls}`}>
        <span className="fw-tip-dot" />
        {data.label}
      </div>
      <div className="fw-tip-why">{data.why}</div>
      {data.legs ? (
        <div className="fw-tip-legs">
          {data.legs.map((l, i) => (
            <div key={i} className="fw-tip-leg">
              <span>{l.airline}</span>
              <b className={`fw-tip-tag fw-${l.cls}`}>{l.label}</b>
            </div>
          ))}
        </div>
      ) : null}
      <div className="fw-tip-grid">
        {data.rows.map((r, i) => (
          <div key={i} className="contents">
            <div className="fw-tip-k">{r.k}</div>
            <div className="fw-tip-v">
              {r.caps ? (
                r.caps.items.map((it) => (
                  <span key={it} className={`fw-cap fw-cap-${r.caps!.kind}`}>
                    {it}
                  </span>
                ))
              ) : r.cost ? (
                <>
                  {r.cost.cost ? <b className="fw-cost">{r.cost.cost}</b> : null}
                  {r.cost.pts.length ? (
                    <ul className="fw-pts">
                      {r.cost.pts.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                r.v
              )}
            </div>
          </div>
        ))}
      </div>
      {data.notes.map((n) => (
        <div key={n} className="fw-tip-note">
          {n}
        </div>
      ))}
      {data.info ? <div className="fw-tip-info">{data.info}</div> : null}
      <div className="fw-tip-src">
        {data.src}
        {data.latency ? ` · ${data.latency}` : ""}
      </div>
    </div>
  );
}
