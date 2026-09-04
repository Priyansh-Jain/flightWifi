import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NUMBER_RX = /^([A-Z][A-Z0-9]|[0-9][A-Z])(\d{1,4})$/;
const DATE_RX = /^\d{4}-\d{2}-\d{2}$/;
const PAST_DAYS = 1;
const FUTURE_DAYS = 180;
const PROVIDER = "https://aerodatabox.p.rapidapi.com";

type Movement = {
  airport?: { iata?: string | null; name?: string | null; municipalityName?: string | null; timeZone?: string | null };
  scheduledTime?: { utc?: string; local?: string };
  terminal?: string | null;
};

type ProviderFlight = {
  number?: string;
  status?: string;
  codeshareStatus?: string;
  isCargo?: boolean;
  airline?: { name?: string; iata?: string | null; icao?: string | null };
  aircraft?: { reg?: string | null; model?: string | null };
  departure?: Movement;
  arrival?: Movement;
};

function json(body: unknown, status = 200, cache = "no-store"): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache }
  });
}

function dayOffset(date: string): number {
  const t = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(t)) return Number.NaN;
  const today = new Date();
  const base = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((t - base) / 86400000);
}

function place(m?: Movement) {
  return {
    iata: m?.airport?.iata ?? null,
    name: m?.airport?.name ?? null,
    city: m?.airport?.municipalityName ?? null,
    time: m?.scheduledTime?.local ?? null,
    terminal: m?.terminal ?? null
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  const key = process.env.AERODATABOX_KEY;
  if (!key) return json({ error: "unavailable" }, 503);

  const n = (req.nextUrl.searchParams.get("n") ?? "").toUpperCase().replace(/\s+/g, "");
  const d = req.nextUrl.searchParams.get("d") ?? "";
  if (!NUMBER_RX.test(n)) return json({ error: "bad-number" }, 400);
  if (!DATE_RX.test(d)) return json({ error: "bad-date" }, 400);
  const off = dayOffset(d);
  if (Number.isNaN(off) || off < -PAST_DAYS || off > FUTURE_DAYS) return json({ error: "date-range", pastDays: PAST_DAYS, futureDays: FUTURE_DAYS }, 400);

  let upstream: Response;
  try {
    upstream = await fetch(
      `${PROVIDER}/flights/number/${encodeURIComponent(n)}/${d}?dateLocalRole=Both&withAircraftImage=false&withLocation=false&withFlightPlan=false`,
      {
        headers: { "x-rapidapi-key": key, "x-rapidapi-host": "aerodatabox.p.rapidapi.com", accept: "application/json" },
        signal: AbortSignal.timeout(8000),
        cache: "no-store"
      }
    );
  } catch {
    return json({ error: "provider" }, 503);
  }

  const dayCache = "public, s-maxage=86400, stale-while-revalidate=604800";
  if (upstream.status === 204 || upstream.status === 404) return json({ number: n, date: d, flights: [] }, 200, dayCache);
  if (upstream.status === 400) return json({ error: "date-range" }, 400);
  if (!upstream.ok) return json({ error: "provider", status: upstream.status }, 503);

  let raw: unknown;
  try {
    raw = await upstream.json();
  } catch {
    return json({ error: "provider" }, 503);
  }
  const list: ProviderFlight[] = Array.isArray(raw) ? raw : [];
  const flights = list
    .filter((f) => !f.isCargo)
    .map((f) => ({
      number: (f.number ?? n).replace(/\s+/g, ""),
      status: f.status ?? "Unknown",
      codeshare: f.codeshareStatus ?? "Unknown",
      airline: { name: f.airline?.name ?? null, iata: f.airline?.iata ?? null },
      aircraft: { model: f.aircraft?.model ?? null, reg: f.aircraft?.reg ?? null },
      from: place(f.departure),
      to: place(f.arrival)
    }));
  return json({ number: n, date: d, flights }, 200, dayCache);
}
