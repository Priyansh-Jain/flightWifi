import Link from "next/link";
import { fleetRows, type Entry } from "@/lib/extension";
import { aircraftSlugFor } from "@/lib/derive";
import { slugForCode } from "@/lib/slugs";
import { Chip } from "./ui";

function ScopeCell({ types, scope }: { types: string[]; scope: string }) {
  if (!types.length) return <>{scope}</>;
  return (
    <>
      {types.map((t, i) => {
        const slug = aircraftSlugFor(t);
        return (
          <span key={t}>
            {i > 0 ? ", " : ""}
            {slug ? <Link href={`/aircraft/${slug}/`}>{t}</Link> : t}
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
    <div className="card scroller">
      <table>
        <thead>
          <tr>
            <th>Aircraft</th>
            <th>Verdict</th>
            <th>System</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="font-medium">
                <ScopeCell types={r.types} scope={r.scope} />
              </td>
              <td>
                <Chip cls={r.cls} label={r.label} />
              </td>
              <td className="text-[var(--muted)]">{r.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AirlineLink({ code, airline }: { code: string; airline: string }) {
  return <Link href={`/airlines/${slugForCode(code)}/`}>{airline}</Link>;
}

export function SourceList({ entry }: { entry: Entry }) {
  if (!entry.sources?.length) return null;
  return (
    <ul className="grid gap-1.5 text-sm">
      {entry.sources.map((s) => {
        const bare = s.replace(/^https?:\/\/(www\.)?/, "");
        const [domain, ...rest] = bare.split("/");
        const path = rest.join("/").replace(/\/$/, "");
        return (
          <li key={s} className="truncate">
            {/* the path stays inside the anchor so two sources on one domain never share the same
                link text, which is what a screen reader reads out of the link list */}
            <a href={s} rel="nofollow noopener">
              <span className="font-medium">{domain}</span>
              {path ? (
                <span className="text-[var(--muted)]">
                  {" /"}
                  {path.length > 72 ? `${path.slice(0, 72)}\u2026` : path}
                </span>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
