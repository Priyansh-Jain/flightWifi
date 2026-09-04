import { callPolicy, codes, costOf, entryFor, fleetVerdict, ruleTypes, verdict, type Verdict } from "./extension";
import { AIRCRAFT, PROVIDERS } from "./derive";
import { slugForCode } from "./slugs";

export type Family = { slug: string; name: string; aliases: string[] };

export function poss(name: string): string {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

const EJET = new Set(["170", "175", "190", "195"]);

function fam(slug: string, name: string, aliases: string[]): Family {
  return { slug, name, aliases };
}

export function familyOf(token: string): Family {
  const t = token.trim();
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^(7[1-8]7)$/))) return fam(`boeing-${m[1]}`, `Boeing ${m[1]}`, [m[1]]);
  if ((m = t.match(/^A(2\d\d|3\d\d)$/i))) return fam(`airbus-a${m[1]}`, `Airbus A${m[1]}`, [`a${m[1]}`]);
  if ((m = t.match(/^ATR ?(\d+)?$/i))) {
    const n = m[1] ?? "";
    return fam(n ? `atr-${n}` : "atr", n ? `ATR ${n}` : "ATR", [`atr${n}`]);
  }
  if (/^(Dash ?8|Q400)$/i.test(t)) return fam("dash-8", "Dash 8", ["dash8", "q400", "dhc8"]);
  if ((m = t.match(/^(?:Embraer ?|ERJ-?|E)(1[3-9]\d)$/i))) {
    const n = m[1];
    return EJET.has(n)
      ? fam(`embraer-e${n}`, `Embraer E${n}`, [`e${n}`])
      : fam(`embraer-erj-${n}`, `Embraer ERJ ${n}`, [`e${n}`]);
  }
  if ((m = t.match(/^CRJ ?(\d+)$/i))) return fam(`crj-${m[1]}`, `Bombardier CRJ ${m[1]}`, [`crj${m[1]}`]);
  if (/^Twin Otter$/i.test(t)) return fam("twin-otter", "Twin Otter", ["twinotter"]);
  if ((m = t.match(/^Saab (\d+)$/i))) return fam(`saab-${m[1]}`, `Saab ${m[1]}`, [`saab${m[1]}`]);
  if ((m = t.match(/^Fokker (\d+)$/i))) return fam(`fokker-${m[1]}`, `Fokker ${m[1]}`, [`fokker${m[1]}`]);
  const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return fam(slug, t, [slug.replace(/-/g, "")]);
}

const PROVIDER_SHORT: Record<string, string> = {
  starlink: "Starlink",
  viasat: "Viasat",
  panasonic: "Panasonic",
  intelsat: "Intelsat",
  ses: "SES",
  anuvu: "Anuvu",
  "sita-onair": "Inmarsat GX",
  oneweb: "OneWeb",
  kuiper: "Kuiper"
};

export function providerShort(text?: string | null): string | null {
  if (!text) return null;
  const hit = PROVIDERS.find((p) => p.match.test(text));
  return hit ? PROVIDER_SHORT[hit.slug] ?? hit.name : null;
}

export type Pair = {
  code: string;
  airline: string;
  airlineSlug: string;
  family: Family;
  probe: string;
  verdict: Verdict;
};

const RANK: Record<string, number> = { fast: 0, ok: 1, part: 2, unknown: 3, none: 4 };

function byRank(a: Pair, b: Pair): number {
  return (RANK[a.verdict.cls] ?? 5) - (RANK[b.verdict.cls] ?? 5) || a.family.name.localeCompare(b.family.name);
}

const pairCache = new Map<string, Pair[]>();

export function pairsFor(code: string): Pair[] {
  const up = code.toUpperCase();
  const hit = pairCache.get(up);
  if (hit) return hit;
  const entry = entryFor(up);
  const out: Pair[] = [];
  if (entry) {
    const seen = new Set<string>();
    for (const rule of entry.rules) {
      for (const token of ruleTypes(rule)) {
        const family = familyOf(token);
        if (seen.has(family.slug)) continue;
        const v = verdict(up, token);
        if (!v || !v.entry) continue;
        seen.add(family.slug);
        out.push({ code: up, airline: entry.airline, airlineSlug: slugForCode(up), family, probe: token, verdict: v });
      }
    }
    out.sort(byRank);
  }
  pairCache.set(up, out);
  return out;
}

export function allPairs(): Pair[] {
  return codes().flatMap((c) => pairsFor(c));
}

export function pairFor(code: string, aircraftSlug: string): Pair | undefined {
  return pairsFor(code).find((p) => p.family.slug === aircraftSlug);
}

export function pairHref(p: Pair): string {
  return `/airlines/${p.airlineSlug}/${p.family.slug}/`;
}

export function sameAircraft(family: Family, exceptCode?: string): Pair[] {
  return allPairs()
    .filter((p) => p.family.slug === family.slug && p.code !== (exceptCode ?? "").toUpperCase())
    .sort(byRank);
}

export function aircraftPageFor(family: Family): string | null {
  return AIRCRAFT.some((a) => a.slug === family.slug) ? `/aircraft/${family.slug}/` : null;
}

export type CheckerType = {
  s: string;
  n: string;
  a: string[];
  l: string;
  k: string;
  v: string;
  w: number;
  p: string | null;
};

export type CheckerAirline = {
  id: string;
  n: string;
  s: string;
  l: string;
  k: string;
  v: string;
  w: number;
  sl: string | null;
  sa: string | null;
  cost: string | null;
  calls: string | null;
  cc: boolean;
  conf: string;
  nv: boolean;
  as: string;
  t: CheckerType[];
};

export type CheckerIndex = {
  airlines: CheckerAirline[];
  whys: string[];
  aircraftPages: string[];
  policy: Record<string, string>;
};

export function checkerIndex(): CheckerIndex {
  const whys: string[] = [];
  const why = (text?: string) => {
    const t = text ?? "";
    let i = whys.indexOf(t);
    if (i < 0) {
      whys.push(t);
      i = whys.length - 1;
    }
    return i;
  };
  const airlines: CheckerAirline[] = [];
  for (const code of codes()) {
    const entry = entryFor(code)!;
    const fv = fleetVerdict(code);
    const policy = callPolicy(code);
    airlines.push({
      id: code,
      n: entry.airline,
      s: slugForCode(code),
      l: fv?.label ?? "Not verified",
      k: fv?.key ?? "UNKNOWN",
      v: fv?.cls ?? "unknown",
      w: why(fv?.why),
      sl: entry.starlink && entry.starlink.status !== "none" ? entry.starlink.status : null,
      sa: entry.starlink?.access ?? null,
      cost: costOf(entry.access),
      calls: policy?.calls ?? null,
      cc: Boolean(policy?.check),
      conf: entry.confidence ?? "reported",
      nv: Boolean(entry.needs_verification),
      as: entry.as_of ?? "",
      t: pairsFor(code).map((p) => ({
        s: p.family.slug,
        n: p.family.name,
        a: p.family.aliases,
        l: p.verdict.label,
        k: p.verdict.key,
        v: p.verdict.cls,
        w: why(p.verdict.why),
        p: providerShort(p.verdict.provider)
      }))
    });
  }
  return {
    airlines,
    whys,
    aircraftPages: AIRCRAFT.map((a) => a.slug),
    policy: { yes: "Permitted, headphones expected", no: "Not permitted by the airline", voice: "Voice permitted, video not" }
  };
}
