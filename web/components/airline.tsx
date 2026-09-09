import Link from "next/link";
import { fleetRows, type Entry } from "@/lib/extension";
import { aircraftSlugFor, sourceKind, type DirectoryRow, type SourceKind } from "@/lib/derive";
import { familyOf, pairFor, pairHref } from "@/lib/matrix";
import { slugForCode } from "@/lib/slugs";
import { Chip } from "./ui";

function ScopeCell({ code, types, scope }: { code: string; types: string[]; scope: string }) {
  if (!types.length) return <>{scope}</>;
  return (
    <>
      {types.map((t, i) => {
        const pair = pairFor(code, familyOf(t).slug);
        const slug = aircraftSlugFor(t);
        const href = pair ? pairHref(pair) : slug ? `/aircraft/${slug}/` : null;
        return (
          <span key={t}>
            {i > 0 ? ", " : ""}
            {href ? <Link href={href}>{t}</Link> : t}
          </span>
        );
      })}
    </>
  );
}

export function FleetTable({ code, compact = false }: { code: string; compact?: boolean }) {
  const rows = fleetRows(code);
  if (!rows.length) return null;
  if (compact) {
    return (
      <div className="card divide-y divide-[var(--line)]">
        {rows.map((r, i) => (
          <div key={i} className="grid gap-1.5 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{r.scope}</span>
              <Chip cls={r.cls} label={r.label} />
            </div>
            {r.provider ? (
              <p className="text-sm text-[var(--muted)]">{r.provider}</p>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={`fleet-grid${rows.length === 1 ? " fleet-grid-one" : ""}`}>
      {rows.map((r, i) => (
        <div key={i} className="fleet-card">
          <p className="fleet-ac">
            <ScopeCell code={code} types={r.types} scope={r.scope} />
          </p>
          <p className="fleet-v">
            <span className={`dot dot-${r.cls}`} aria-hidden="true" />
            {r.label}
          </p>
          {r.provider ? <p className="fleet-sys">{r.provider}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function AirlineLink({ code, airline }: { code: string; airline: string }) {
  return <Link href={`/airlines/${slugForCode(code)}/`}>{airline}</Link>;
}

const SRC_LABEL: Record<SourceKind, string> = {
  airline: "Airline",
  provider: "Provider",
  trade: "Trade press"
};

function SourceIcon({ kind }: { kind: SourceKind }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true
  };
  if (kind === "airline")
    return (
      <svg {...common}>
        <path d="M17.8 19.8 16 14l-4 1.5V19l-2.5 2 .5-4-2-1 .5-2.5L3 15l-.5-2.5 8-4.5V4a1.5 1.5 0 0 1 3 0v4l8 4.5-.5 2.5-5.5-1.5" />
      </svg>
    );
  if (kind === "provider")
    return (
      <svg {...common}>
        <path d="M5 12a7 7 0 0 1 7-7" />
        <path d="M8.5 15.5a5 5 0 0 1 0-7" />
        <circle cx="13" cy="16" r="2.5" />
        <path d="m17 20 3 1-1-3" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M4 5h12v14H5a1 1 0 0 1-1-1z" />
      <path d="M16 9h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3" />
      <path d="M7 8.5h6" />
      <path d="M7 12h6" />
      <path d="M7 15.5h4" />
    </svg>
  );
}

export function SourceList({ entry }: { entry: Entry }) {
  const list = entry.sources ?? [];
  if (!list.length) return null;
  return (
    <ul className="src-list">
      {list.map((s) => {
        const kind = sourceKind(s, entry.airline);
        const bare = s.replace(/^https?:\/\/(www\.)?/, "");
        const [domain, ...rest] = bare.split("/");
        const path = rest.join("/").replace(/\/$/, "");
        return (
          <li key={s}>
            <a href={s} rel="nofollow noopener" className={`src-row src-${kind}`}>
              <span className="src-ico">
                <SourceIcon kind={kind} />
              </span>
              <span className="src-text">
                <span className="src-dom">{domain}</span>
                {path ? <span className="src-path">/{path}</span> : null}
              </span>
              <span className="src-pill">{SRC_LABEL[kind]}</span>
              <svg className="src-out" width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3.5 8.5 8.5 3.5" />
                <path d="M4.5 3.5h4v4" />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function RelatedGrid({ rows }: { rows: DirectoryRow[] }) {
  if (!rows.length) return null;
  const cols = rows.length === 1 ? "rel-grid-1" : rows.length === 2 ? "rel-grid-2" : "rel-grid-3";
  return (
    <div className={`rel-grid ${cols}`}>
      {rows.map((r) => {
        const meta = [r.cost, r.starlink === "flying" ? "Starlink flying" : r.starlink === "announced" ? "Starlink announced" : null]
          .filter(Boolean)
          .join(" \u00b7 ");
        return (
          <Link key={r.code} href={`/airlines/${r.slug}/`} className="rel-card">
            <span className="rel-name">{r.airline}</span>
            <span className="rel-v">
              <span className={`dot dot-${r.cls}`} aria-hidden="true" />
              {r.label}
            </span>
            {meta ? <span className="rel-meta">{meta}</span> : null}
          </Link>
        );
      })}
    </div>
  );
}
