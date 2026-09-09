"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CheckerAirline, CheckerIndex, CheckerType } from "@/lib/matrix";

const EXAMPLES = ["Qatar 777", "QR702", "Cathay A350", "Air India 787", "Hawaiian 717"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FAST = new Set(["LEO", "MEO"]);
const SPLIT = new Set(["VARIES", "PARTIAL", "LEG_PARTIAL"]);
const PAST_DAYS = 1;
const FUTURE_DAYS = 180;

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

function acKey(s: string): string | null {
  const c = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let m: RegExpMatchArray | null;
  if ((m = c.match(/^(?:b|boeing)?(7[1-8]7)/))) return m[1];
  if ((m = c.match(/^(?:airbus)?a(2\d\d|3\d\d)/))) return `a${m[1]}`;
  if ((m = c.match(/^(?:embraer|erj|e)?(1[3-9]\d)/))) return `e${m[1]}`;
  if ((m = c.match(/^atr(42|72)?/))) return `atr${m[1] ?? ""}`;
  if (/^(dash8|q400|dhc8)/.test(c)) return "dash8";
  if ((m = c.match(/^crj(\d{3})/))) return `crj${m[1]}`;
  if (/^twinotter/.test(c)) return "twinotter";
  if ((m = c.match(/^saab(\d{3})/))) return `saab${m[1]}`;
  if ((m = c.match(/^fokker(70|100)/))) return `fokker${m[1]}`;
  if ((m = c.match(/(?:boeing|b)(7[1-8]7)/))) return m[1];
  if ((m = c.match(/airbusa(2\d\d|3\d\d)/))) return `a${m[1]}`;
  if ((m = c.match(/(?:embraer|erj)(1[3-9]\d)/))) return `e${m[1]}`;
  if ((m = c.match(/atr(42|72)/))) return `atr${m[1]}`;
  if (/dhc8|dash8|q400/.test(c)) return "dash8";
  if ((m = c.match(/crj(\d{3})/))) return `crj${m[1]}`;
  if (/twinotter|dhc6/.test(c)) return "twinotter";
  if ((m = c.match(/saab(\d{3})/))) return `saab${m[1]}`;
  if ((m = c.match(/fokker(70|100)/))) return `fokker${m[1]}`;
  return null;
}

function monthLabel(asOf: string): string {
  const [y, m] = asOf.split("-");
  const i = Number(m) - 1;
  return MONTHS[i] ? `${MONTHS[i]} ${y}` : asOf;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function shiftDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return isoDate(new Date(y, m - 1, d + days));
}

function prettyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return MONTHS[m - 1] ? `${d} ${MONTHS[m - 1]} ${y}` : iso;
}

function clock(local: string | null): string | null {
  const m = local ? local.match(/(\d{2}:\d{2})/) : null;
  return m ? m[1] : null;
}

type Match = { a: CheckerAirline; score: number };

function findAirlines(list: CheckerAirline[], s: string): Match[] {
  const q = s.trim();
  if (!q) return [];
  if (/^[a-z0-9]{2}$/.test(q)) {
    const byCode = list.find((a) => a.id.toLowerCase() === q);
    if (byCode) return [{ a: byCode, score: 0 }];
  }
  if (q.length < 3) return [];
  const qs = q.replace(/\s+/g, "");
  const out: Match[] = [];
  for (const a of list) {
    const n = norm(a.n);
    const ns = n.replace(/\s+/g, "");
    let score = -1;
    if (n === q) score = 0;
    else if (ns.startsWith(qs)) score = 1;
    else if (n.split(" ").some((w) => w.startsWith(q))) score = 2;
    else if (ns.includes(qs)) score = 3;
    if (score >= 0) out.push({ a, score });
  }
  return out.sort((x, y) => x.score - y.score || x.a.n.length - y.a.n.length);
}

function typeFor(a: CheckerAirline, key: string | null): CheckerType | null {
  if (!key) return null;
  return a.t.find((t) => t.a.includes(key)) ?? null;
}

type Result =
  | { kind: "empty" }
  | { kind: "none"; q: string }
  | { kind: "pair"; a: CheckerAirline; t: CheckerType; alts: CheckerAirline[] }
  | { kind: "airline"; a: CheckerAirline; wanted: string | null; alts: CheckerAirline[] }
  | { kind: "flight"; a: CheckerAirline | null; flight: string }
  | { kind: "aircraft"; key: string; airlines: { a: CheckerAirline; t: CheckerType }[] };

function parse(raw: string, index: CheckerIndex): Result {
  const n = norm(raw);
  if (!n) return { kind: "empty" };
  const compact = n.replace(/\s+/g, "");
  const fm = compact.match(/^([a-z][a-z0-9]|[0-9][a-z])(\d{1,4})$/);
  if (fm && !acKey(compact)) {
    const a = index.airlines.find((x) => x.id.toLowerCase() === fm[1]) ?? null;
    return { kind: "flight", a, flight: compact.toUpperCase() };
  }
  const whole = findAirlines(index.airlines, n);
  if (whole.length && whole[0].score <= 1) {
    return { kind: "airline", a: whole[0].a, wanted: null, alts: whole.slice(1, 5).map((m) => m.a) };
  }
  const words = n.split(" ");
  const attempt = (left: string, right: string): Result | null => {
    const key = acKey(right);
    if (!key) return null;
    const ms = findAirlines(index.airlines, left);
    if (!ms.length) return null;
    const alts = ms.slice(1, 5).map((m) => m.a);
    const t = typeFor(ms[0].a, key);
    return t ? { kind: "pair", a: ms[0].a, t, alts } : { kind: "airline", a: ms[0].a, wanted: key, alts };
  };
  for (let i = words.length - 1; i >= 1; i--) {
    const r = attempt(words.slice(0, i).join(" "), words.slice(i).join(""));
    if (r) return r;
  }
  for (let i = 1; i < words.length; i++) {
    const r = attempt(words.slice(i).join(" "), words.slice(0, i).join(""));
    if (r) return r;
  }
  if (whole.length) {
    return { kind: "airline", a: whole[0].a, wanted: null, alts: whole.slice(1, 5).map((m) => m.a) };
  }
  const key = acKey(compact);
  if (key) {
    const airlines: { a: CheckerAirline; t: CheckerType }[] = [];
    for (const a of index.airlines) {
      const t = typeFor(a, key);
      if (t) airlines.push({ a, t });
    }
    const rank: Record<string, number> = { fast: 0, ok: 1, part: 2, unknown: 3, none: 4 };
    airlines.sort((x, y) => (rank[x.t.v] ?? 5) - (rank[y.t.v] ?? 5) || x.a.n.localeCompare(y.a.n));
    return { kind: "aircraft", key, airlines };
  }
  return { kind: "none", q: raw.trim() };
}

type Place = { iata: string | null; name: string | null; city: string | null; time: string | null; terminal: string | null };
type Leg = {
  number: string;
  status: string;
  codeshare: string;
  airline: { name: string | null; iata: string | null };
  aircraft: { model: string | null; reg: string | null };
  from: Place;
  to: Place;
};
type Lookup = { state: "loading" | "ok" | "empty" | "unavailable" | "range" | "error"; legs: Leg[] };

function poss(name: string): string {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

function Tag({ children, tone }: { children: React.ReactNode; tone?: "good" | "warn" }) {
  const color = tone === "good" ? "text-[var(--ink)]" : "text-[var(--muted)]";
  return (
    <span className={`inline-flex items-center rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs ${color}`}>
      {children}
    </span>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">{k}</dt>
      <dd className="text-sm text-[var(--ink)]">{children}</dd>
    </>
  );
}

function Card({
  a,
  t,
  index,
  onPick,
  lead
}: {
  a: CheckerAirline;
  t: CheckerType | null;
  index: CheckerIndex;
  onPick: (t: CheckerType) => void;
  lead?: React.ReactNode;
}) {
  const label = t ? t.l : a.l;
  const cls = t ? t.v : a.v;
  const key = t ? t.k : a.k;
  const why = index.whys[t ? t.w : a.w];
  const provider = t ? t.p : null;
  const starlinkShown = t ? provider === "Starlink" : Boolean(a.sl);
  const cost = starlinkShown && a.sa && a.sa !== "unannounced"
    ? a.sa === "free_with_account"
      ? "Free with account"
      : a.sa === "free"
        ? "Free"
        : "Paid"
    : a.cost;
  const href = t ? `/airlines/${a.s}/${t.s}/` : `/airlines/${a.s}/`;
  const others = t ? a.t.filter((x) => x.s !== t.s) : a.t;
  // "Varies" and "not on every aircraft" are the two verdicts the reader can resolve themselves by
  // naming the plane, so those are the only ones that get pushed toward the picker.
  const resolves = others.some((x) => !SPLIT.has(x.k));
  const resolvable = !t && SPLIT.has(key) && resolves;
  return (
    <div className="card p-5">
      {lead ? <p className="mb-3 text-sm text-[var(--muted)]">{lead}</p> : null}
      <p className="text-sm text-[var(--muted)]">
        {a.n}
        {t ? ` · ${t.n}` : ""}
      </p>
      <p className="mt-1.5 flex items-center gap-2.5 text-xl font-semibold tracking-[-0.02em]">
        <span className={`dot dot-${cls}`} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 text-[0.95rem] text-[var(--muted)]">{why}.</p>
      {resolvable ? (
        <p className="mt-1 text-[0.95rem] text-[var(--ink)]">Pick your aircraft below for an exact answer.</p>
      ) : null}

      {others.length ? (
        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
            {t ? `Other ${a.n} aircraft` : resolves ? "Choose your aircraft" : `Aircraft ${a.n} flies`}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {others.map((x) => (
              <button key={x.s} type="button" onClick={() => onPick(x)} className="ac-btn">
                <span className={`dot dot-${x.v}`} aria-hidden="true" />
                <span className="font-medium text-[var(--ink)]">{x.n}</span>
                <span className="text-[var(--muted)]">{x.p && !SPLIT.has(x.k) ? x.p : x.l}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <dl className="mt-4 grid grid-cols-[92px_1fr] items-baseline gap-x-4 gap-y-2 border-t border-[var(--line)] pt-4">
        <Row k="Aircraft">{t ? t.n : "Not confirmed"}</Row>
        <Row k="Answer">{t ? (SPLIT.has(key) ? "Still varies within this type" : "Aircraft-specific") : "Fleet-level"}</Row>
        {provider ? <Row k="System">{t && SPLIT.has(key) ? `${provider} on some of them` : provider}</Row> : null}
        {starlinkShown && a.sl ? (
          <Row k="Starlink">{a.sl === "flying" ? "Flying with passengers" : "Announced, not yet flying"}</Row>
        ) : null}
        {cost ? <Row k="Cost">{cost}</Row> : null}
        {FAST.has(key) ? (
          <Row k="Calls">
            {a.calls ? `${index.policy[a.calls]}${a.cc ? " (unconfirmed)" : ""}` : "Policy not published"}
          </Row>
        ) : null}
        <Row k="Checked">
          {monthLabel(a.as)} · {a.conf === "sourced" ? "airline and provider pages" : "trade press"}
        </Row>
        {a.nv ? <Row k="Pending">Some detail still to be re-checked</Row> : null}
      </dl>

      <p className="mt-4 text-sm">
        <Link href={href}>Full details, sources and cost</Link>
        {t ? (
          <>
            <span className="mx-2 text-[var(--muted)]">·</span>
            <Link href={`/airlines/${a.s}/`}>{a.n} overview</Link>
          </>
        ) : null}
      </p>
    </div>
  );
}

function LegResult({
  leg,
  fallback,
  index,
  onPick
}: {
  leg: Leg;
  fallback: CheckerAirline | null;
  index: CheckerIndex;
  onPick: (a: CheckerAirline, t: CheckerType) => void;
}) {
  const airline = (leg.airline.iata ? index.airlines.find((a) => a.id === leg.airline.iata) : null) ?? fallback;
  const model = leg.aircraft.model;
  const key = model ? acKey(model) : null;
  const t = airline && key ? typeFor(airline, key) : null;
  const route = [leg.from.iata ?? leg.from.city, leg.to.iata ?? leg.to.city].filter(Boolean).join(" → ");
  const dep = clock(leg.from.time);
  const head = (
    <span>
      <span className="font-medium text-[var(--ink)]">{leg.number}</span>
      {route ? ` · ${route}` : ""}
      {dep ? ` · departs ${dep} local` : ""}
      {" · "}
      {model ? (
        <span className="font-medium text-[var(--ink)]">
          {model}
          {leg.aircraft.reg ? ` (${leg.aircraft.reg})` : ""}
        </span>
      ) : (
        "aircraft not published yet"
      )}
    </span>
  );

  if (leg.codeshare === "IsCodeshared") {
    return (
      <div className="card p-5">
        <p className="text-sm text-[var(--muted)]">{head}</p>
        <p className="mt-3 text-[0.95rem]">
          This number is a codeshare{airline ? ` sold by ${airline.n}` : ""}. Another airline operates the aircraft,
          so {airline ? poss(airline.n) : "the selling airline's"} Wi-Fi rules do not apply to it. Look up the operating
          airline&apos;s own flight number, printed on your ticket next to &ldquo;operated by&rdquo;.
        </p>
      </div>
    );
  }
  if (!airline) {
    return (
      <div className="card p-5">
        <p className="text-sm text-[var(--muted)]">{head}</p>
        <p className="mt-3 text-[0.95rem]">
          {leg.airline.name ?? "This airline"} is not in the registry yet, so there is no verdict for it.
        </p>
      </div>
    );
  }
  if (t) {
    return <Card a={airline} t={t} index={index} onPick={(x) => onPick(airline, x)} lead={head} />;
  }
  const lead = (
    <>
      {head}
      <br />
      {model
        ? `The schedule names ${/^[aeiou]/i.test(model) ? "an" : "a"} ${model}, but ${poss(airline.n)} entry has no rule for that type, so this is the fleet answer.`
        : `The schedule does not name the aircraft yet. It usually appears closer to departure, so this is ${poss(airline.n)} fleet answer for now.`}
    </>
  );
  return <Card a={airline} t={null} index={index} onPick={(x) => onPick(airline, x)} lead={lead} />;
}

function hrefFor(r: Result): string | null {
  if (r.kind === "pair") return `/airlines/${r.a.s}/${r.t.s}/`;
  if (r.kind === "airline") return `/airlines/${r.a.s}/`;
  if (r.kind === "flight" && r.a) return `/airlines/${r.a.s}/`;
  if (r.kind === "aircraft" && r.airlines.length) return `/airlines/${r.airlines[0].a.s}/${r.airlines[0].t.s}/`;
  return null;
}

const EMPTY: CheckerIndex = { airlines: [], whys: [], aircraftPages: [], policy: {} };

export default function Checker({ src = "/checker.json", storeUrl, examples = EXAMPLES }: { src?: string; storeUrl: string; examples?: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [pick, setPick] = useState<{ a: CheckerAirline; t: CheckerType } | null>(null);
  const [index, setIndex] = useState<CheckerIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const [date, setDate] = useState("");
  const [lookups, setLookups] = useState<Record<string, Lookup>>({});
  const loading = useRef(false);

  useEffect(() => {
    setDate(isoDate(new Date()));
  }, []);

  const load = () => {
    if (index || loading.current) return;
    loading.current = true;
    fetch(src)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: CheckerIndex) => setIndex(data))
      .catch(() => {
        loading.current = false;
        setFailed(true);
      });
  };

  const idx = index ?? EMPTY;
  const parsed = useMemo(() => parse(q, idx), [q, idx]);
  const result: Result = pick ? { kind: "pair", a: pick.a, t: pick.t, alts: [] } : parsed;
  const waiting = !index && q.trim().length > 0;
  const flightKey = !waiting && result.kind === "flight" && date ? `${result.flight}|${date}` : null;
  const lookup = flightKey ? lookups[flightKey] : undefined;

  useEffect(() => {
    if (!flightKey || lookups[flightKey]) return;
    const [n, d] = flightKey.split("|");
    setLookups((m) => ({ ...m, [flightKey]: { state: "loading", legs: [] } }));
    fetch(`/api/flight/?n=${encodeURIComponent(n)}&d=${encodeURIComponent(d)}`)
      .then(async (r): Promise<Lookup> => {
        if (r.status === 503) return { state: "unavailable", legs: [] };
        if (r.status === 400) {
          const j = await r.json().catch(() => ({}));
          return { state: j && j.error === "date-range" ? "range" : "error", legs: [] };
        }
        if (!r.ok) return { state: "error", legs: [] };
        const j = await r.json();
        const legs: Leg[] = Array.isArray(j.flights) ? j.flights : [];
        return { state: legs.length ? "ok" : "empty", legs };
      })
      .catch((): Lookup => ({ state: "error", legs: [] }))
      .then((lk) => setLookups((m) => ({ ...m, [flightKey]: lk })));
  }, [flightKey, lookups]);

  const onChange = (v: string) => {
    load();
    setPick(null);
    setQ(v);
  };
  const go = () => {
    let href = hrefFor(result);
    if (result.kind === "flight" && lookup && lookup.state === "ok") {
      const leg = lookup.legs.find((l) => l.codeshare !== "IsCodeshared") ?? lookup.legs[0];
      const airline = (leg.airline.iata ? idx.airlines.find((a) => a.id === leg.airline.iata) : null) ?? result.a;
      const t = airline && leg.aircraft.model ? typeFor(airline, acKey(leg.aircraft.model)) : null;
      if (airline && t) href = `/airlines/${airline.s}/${t.s}/`;
      else if (airline) href = `/airlines/${airline.s}/`;
    }
    if (href) router.push(href);
  };
  const minDate = date ? shiftDays(date, -PAST_DAYS) : undefined;
  const maxDate = date ? shiftDays(isoDate(new Date()), FUTURE_DAYS) : undefined;

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl text-left">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="flex gap-2"
      >
        <label htmlFor="fw-check" className="sr-only">
          Check your flight&apos;s Wi-Fi
        </label>
        <input
          id="fw-check"
          type="search"
          value={q}
          onChange={(e) => onChange(e.target.value)}
          onFocus={load}
          onPointerEnter={load}
          placeholder="Flight number, airline or aircraft"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="fld min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)]"
        />
        <button
          type="submit"
          className="btn-cta shrink-0 rounded-xl px-5 py-3 font-semibold"
        >
          Check
        </button>
      </form>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
        <span>Try</span>
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onChange(ex)}
            className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--ink)]"
          >
            {ex}
          </button>
        ))}
      </p>

      <div aria-live="polite" className="mt-4">
        {waiting ? (
          <p className="text-sm text-[var(--muted)]">
            {failed ? "The registry did not load. Refresh the page and try again." : "Loading the registry…"}
          </p>
        ) : null}

        {!waiting && result.kind === "pair" ? (
          <>
            <Card a={result.a} t={result.t} index={idx} onPick={(t) => setPick({ a: result.a, t })} />
            {result.alts.length ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Not {result.a.n}?{" "}
                {result.alts.map((x, i) => (
                  <span key={x.id}>
                    {i > 0 ? ", " : ""}
                    <button type="button" className="underline underline-offset-4" onClick={() => onChange(`${x.n} ${result.t.n}`)}>
                      {x.n}
                    </button>
                  </span>
                ))}
              </p>
            ) : null}
          </>
        ) : null}

        {!waiting && result.kind === "airline" ? (
          <>
            {result.wanted ? (
              <p className="mb-2 text-sm text-[var(--muted)]">
                {poss(result.a.n)} entry does not name that aircraft, so this is the fleet answer.
              </p>
            ) : null}
            <Card a={result.a} t={null} index={idx} onPick={(t) => setPick({ a: result.a, t })} />
            {result.alts.length ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Not {result.a.n}?{" "}
                {result.alts.map((x, i) => (
                  <span key={x.id}>
                    {i > 0 ? ", " : ""}
                    <button type="button" className="underline underline-offset-4" onClick={() => onChange(x.n)}>
                      {x.n}
                    </button>
                  </span>
                ))}
              </p>
            ) : null}
          </>
        ) : null}

        {!waiting && result.kind === "flight" ? (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted)]">
              <span>
                <span className="font-medium text-[var(--ink)]">{result.flight}</span>
                {result.a ? ` · ${result.a.n}` : ""}
              </span>
              <label className="flex items-center gap-2">
                <span>on</span>
                <input
                  type="date"
                  value={date}
                  min={minDate}
                  max={maxDate}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label="Date of travel"
                  className="fld rounded-lg border border-[var(--line)] bg-[var(--bg-raised)] px-2 py-1 text-[var(--ink)]"
                />
              </label>
            </div>
            {!lookup || lookup.state === "loading" ? (
              <p className="text-sm text-[var(--muted)]">Checking the schedule for {result.flight} on {date ? prettyDate(date) : "that date"}…</p>
            ) : null}
            {lookup && lookup.state === "ok"
              ? lookup.legs.map((leg, i) => (
                  <LegResult key={`${leg.number}-${i}`} leg={leg} fallback={result.a} index={idx} onPick={(a, t) => setPick({ a, t })} />
                ))
              : null}
            {lookup && lookup.state !== "ok" && lookup.state !== "loading" && result.a ? (
              <>
                <Card
                  a={result.a}
                  t={null}
                  index={idx}
                  onPick={(t) => result.a && setPick({ a: result.a, t })}
                  lead={`The aircraft flying ${result.flight} is not confirmed, so this is the fleet answer.`}
                />
                <p className="text-sm text-[var(--muted)]">
                  {lookup.state === "unavailable"
                    ? "Flight-specific aircraft data is not available yet. Pick the aircraft above, or check the plane named on your booking."
                    : lookup.state === "empty"
                      ? `No ${result.flight} on ${prettyDate(date)} in the schedule. Check the number, or try a day either side.`
                      : lookup.state === "range"
                        ? "Schedules run from yesterday to about six months ahead. Pick a date in that range for the exact aircraft."
                        : "The schedule lookup failed, so we could not read the aircraft. Try again in a moment."}
                </p>
              </>
            ) : null}
            {lookup && lookup.state !== "ok" && lookup.state !== "loading" && !result.a ? (
              <p className="text-sm text-[var(--muted)]">
                We do not recognise the airline code in {result.flight}. Try the airline&apos;s name instead.
              </p>
            ) : null}
          </div>
        ) : null}

        {!waiting && result.kind === "aircraft" ? (
          result.airlines.length ? (
            <div className="card p-5">
              <p className="font-semibold">Which airline? The aircraft alone does not decide it.</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {result.airlines.length} airlines name the {result.airlines[0].t.n} in their entry. Type the airline too
                for an exact answer, or pick one.
              </p>
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {result.airlines.slice(0, 10).map(({ a, t }) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setPick({ a, t })}
                      className="flex w-full items-center justify-between gap-2 rounded-lg border border-[var(--line)] px-3 py-2 text-left text-sm hover:border-[var(--accent)]"
                    >
                      <span className="truncate">{a.n}</span>
                      <span className={`v v-${t.v} shrink-0`}>{t.l}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {idx.aircraftPages.includes(result.airlines[0].t.s) ? (
                <p className="mt-3 text-sm">
                  <Link href={`/aircraft/${result.airlines[0].t.s}/`}>Every airline on the {result.airlines[0].t.n}</Link>
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">No airline in the registry names that aircraft.</p>
          )
        ) : null}

        {!waiting && result.kind === "none" ? (
          <p className="text-sm text-[var(--muted)]">
            No airline called &ldquo;{result.q}&rdquo; in the registry.{" "}
            <Link href="/airlines/">Browse all airlines</Link>.
          </p>
        ) : null}
        {!waiting && (result.kind === "pair" || result.kind === "airline" || (result.kind === "flight" && lookup && lookup.state !== "loading")) ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Want this on every flight while you search?{" "}
            <a href={storeUrl} rel="noopener" className="font-medium">
              Get the free extension
            </a>
            , and it shows next to each result on Google Flights and Skyscanner.
          </p>
        ) : null}
      </div>
    </div>
  );
}
