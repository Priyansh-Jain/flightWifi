import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { createRateLimiter } from "@/lib/rate-limit";
import {
  DISCLAIMER,
  aircraftAnswer,
  airlineAnswer,
  airlineSuggestions,
  findAirlines,
  registryStats,
  resolveAirline,
  starlinkAirlines
} from "@/lib/mcp/data";

export const maxDuration = 30;

// Registry gateways put many callers behind one address, so a per-address window is a shared
// bucket rather than one person's budget. Sized for that. Nothing here is metered downstream:
// every tool reads a snapshot compiled into the bundle, so a generous limit costs nothing but CPU.
const limiter = createRateLimiter({ maxRequests: 240, windowMs: 60_000 });

// Declaring an outputSchema makes structuredContent mandatory, and the SDK fails the call without
// it. The JSON text block rides alongside so clients that only read text still work.
function textResult<T extends Record<string, unknown>>(data: T) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: data
  };
}

// Every tool reads a compiled snapshot and changes nothing, so all of them are safe to call
// unprompted and safe to repeat, and none of them reaches outside this dataset.
const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false
} as const;

const starlinkProgress = z
  .object({
    aircraft_done: z.number().nullable(),
    aircraft_total: z.number().nullable(),
    percent: z.number().nullable(),
    scope: z.string().describe("Which aircraft the count covers, e.g. mainline and regional fleet"),
    counted_by: z
      .string()
      .describe("Who published the count: airline, provider, trade press or an independent tracker"),
    as_of: z.string(),
    source: z.string().nullable()
  })
  .loose();

const milestone = z.object({ date: z.string(), text: z.string(), source: z.string().optional() }).loose();

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "check_airline_wifi",
      {
        title: "Check an airline's in-flight Wi-Fi",
        description:
          "Answer what in-flight Wi-Fi an airline has: the connectivity system on board, its satellite orbit, whether the link is quick enough for a video call, what it costs, and how it differs by aircraft type. Pass the aircraft when it is known, because on a fleet part-way through a retrofit the aircraft decides the answer, not the airline. Returns the sources behind the verdict and the month it was verified.",
        inputSchema: {
          airline: z.string().describe('Airline name or 2-letter IATA code, e.g. "Qatar Airways" or "QR"'),
          aircraft: z
            .string()
            .optional()
            .describe('Aircraft type as a booking prints it, e.g. "777", "A350" or "Boeing 787". Omit for the fleet-wide answer')
        },
        outputSchema: {
          found: z.boolean(),
          airline: z.string().optional(),
          iata: z.string().optional(),
          asked_aircraft: z.string().nullable().optional(),
          answer_level: z
            .string()
            .optional()
            .describe('"aircraft-specific" when an aircraft was given and matched a typed rule, otherwise "whole fleet"'),
          verdict: z
            .string()
            .optional()
            .describe("One of: Video calls work, Email & browsing, Varies by aircraft, Not on every aircraft, No Wi-Fi, Not verified"),
          verdict_key: z.string().optional().describe("LEO, MEO, GEO, A2G, VARIES, PARTIAL, NONE or UNKNOWN"),
          what_it_means: z.string().nullable().optional(),
          good_for: z.array(z.string()).optional(),
          not_for: z.array(z.string()).optional(),
          system: z.string().nullable().optional().describe("The connectivity system, in the registry's own words"),
          orbit: z.string().nullable().optional(),
          latency: z.string().nullable().optional(),
          cost: z.string().nullable().optional().describe("Free, Paid, or Free tier, then paid"),
          access: z.string().nullable().optional().describe("Who pays and what it costs, in the airline's terms"),
          access_points: z.array(z.string()).optional(),
          video_calls: z
            .object({
              policy: z.string().describe("yes, no or voice"),
              stated: z.string(),
              from_airline_page: z.boolean().describe("False when only trade reporting carries the policy")
            })
            .nullable()
            .optional()
            .describe("Null when the airline publishes no call policy. Absent never means permitted"),
          starlink: z
            .object({
              status: z.string(),
              cost_tier: z.string(),
              whole_fleet: z.boolean(),
              progress: starlinkProgress.nullable(),
              latest_milestone: milestone.nullable()
            })
            .nullable()
            .optional(),
          by_aircraft: z
            .array(
              z
                .object({
                  aircraft: z.array(z.string()).nullable(),
                  scope: z.string(),
                  verdict: z.string(),
                  verdict_key: z.string(),
                  system: z.string().nullable(),
                  orbit: z.string().nullable(),
                  latency: z.string().nullable()
                })
                .loose()
            )
            .optional()
            .describe("Every rule the airline has, most cautious first"),
          confidence: z.string().optional().describe('"sourced" when an airline or provider page carries it, "reported" otherwise'),
          verification_pending: z.boolean().optional(),
          last_verified: z.string().nullable().optional(),
          sources: z.array(z.string()).optional(),
          details_url: z.string().optional(),
          message: z.string().optional(),
          did_you_mean: z.array(z.string()).optional(),
          disclaimer: z.string().optional()
        },
        annotations: READ_ONLY
      },
      async ({ airline, aircraft }) => {
        const hit = resolveAirline(airline);
        if (!hit) {
          return textResult({
            found: false,
            message: `No airline in the registry matches "${airline}". It covers ${registryStats().airlines} carriers; try the IATA code.`,
            did_you_mean: airlineSuggestions(airline)
          });
        }
        return textResult({ ...airlineAnswer(hit.code, aircraft), disclaimer: DISCLAIMER });
      }
    );

    server.registerTool(
      "list_starlink_airlines",
      {
        title: "List airlines with Starlink",
        description:
          "List airlines by Starlink status, separating those flying it with passengers today from those that have only announced a deal. Includes how far each rollout has actually got, who published that count, and whether the service is free. Use this rather than assuming an announcement means the aircraft has it.",
        inputSchema: {
          status: z
            .enum(["flying", "announced"])
            .optional()
            .describe("Omit for both. flying means passengers are using it on at least some aircraft today")
        },
        outputSchema: {
          count: z.number(),
          flying: z.number().describe("Airlines with Starlink in passenger service today"),
          announced: z.number().describe("Airlines that have signed a deal with nothing flying yet"),
          airlines: z.array(
            z
              .object({
                airline: z.string(),
                iata: z.string(),
                status: z.string(),
                cost_tier: z.string().describe("free, free_with_account, paid or unannounced"),
                whole_fleet: z.boolean().describe("True only when every aircraft the airline flies is low orbit"),
                progress: starlinkProgress.nullable(),
                latest_milestone: milestone.nullable(),
                details_url: z.string()
              })
              .loose()
          ),
          last_verified: z.string(),
          disclaimer: z.string()
        },
        annotations: READ_ONLY
      },
      async ({ status }) => {
        const rows = starlinkAirlines(status);
        const s = registryStats();
        return textResult({
          count: rows.length,
          flying: s.starlink_flying,
          announced: s.starlink_announced,
          airlines: rows,
          last_verified: s.last_verified,
          disclaimer:
            "A rollout count is a point in time and moves every month. Where the count came from a third-party tracker rather than the airline, counted_by says so."
        });
      }
    );

    server.registerTool(
      "wifi_by_aircraft",
      {
        title: "Compare one aircraft type across airlines",
        description:
          "Show what Wi-Fi a given aircraft type carries on each airline that flies it, best first. The same aircraft carries different internet depending on the operator, which is the assumption travellers most often get wrong, so answer per operator rather than per type.",
        inputSchema: {
          aircraft: z.string().describe('Aircraft type, e.g. "777", "A350", "Boeing 787", "A320"')
        },
        outputSchema: {
          aircraft: z.string(),
          count: z.number(),
          airlines: z.array(
            z
              .object({
                airline: z.string(),
                iata: z.string(),
                verdict: z.string(),
                verdict_key: z.string(),
                system: z.string().nullable(),
                orbit: z.string().nullable(),
                last_verified: z.string().nullable(),
                details_url: z.string()
              })
              .loose()
          ),
          note: z.string(),
          disclaimer: z.string()
        },
        annotations: READ_ONLY
      },
      async ({ aircraft }) => {
        const rows = aircraftAnswer(aircraft);
        return textResult({
          aircraft,
          count: rows.length,
          airlines: rows,
          note: rows.length
            ? "Only airlines with an aircraft-specific rule for this type appear. An airline missing here may still fly the type; its registry entry just answers fleet-wide."
            : "No airline in the registry has an aircraft-specific rule matching that type. Try a shorter token such as 777 or A350, or ask about the airline instead.",
          disclaimer: DISCLAIMER
        });
      }
    );

    server.registerTool(
      "find_airlines_by_wifi",
      {
        title: "Find airlines by what their Wi-Fi can do",
        description:
          "Filter the registry by what the Wi-Fi can actually do: airlines whose link is quick enough for a video call, airlines where it is free, airlines flying Starlink today, or airlines with no usable internet at all. Use this to answer which airline to book rather than to look one up.",
        inputSchema: {
          video_calls: z
            .boolean()
            .optional()
            .describe("Airlines with at least one aircraft quick enough for a video call, who do not forbid calls. Check on_every_aircraft before promising it for a given flight"),
          free: z.boolean().optional().describe("Only airlines where Wi-Fi is free for everyone, no paid tier"),
          starlink: z.boolean().optional().describe("Only airlines flying Starlink with passengers today"),
          no_wifi: z.boolean().optional().describe("Only airlines with no usable internet on any aircraft"),
          limit: z.number().int().positive().optional().describe("Cap the list; omit for all matches")
        },
        outputSchema: {
          count: z.number(),
          total_airlines_in_registry: z.number(),
          airlines: z.array(
            z
              .object({
                airline: z.string(),
                iata: z.string(),
                verdict: z.string(),
                verdict_key: z.string(),
                cost: z.string().nullable(),
                starlink: z.string().nullable(),
                video_calls: z.string().nullable(),
                on_every_aircraft: z
                  .boolean()
                  .describe("False when only part of the fleet matches, so the answer depends on the aircraft"),
                last_verified: z.string().nullable(),
                details_url: z.string()
              })
              .loose()
          ),
          disclaimer: z.string()
        },
        annotations: READ_ONLY
      },
      async (filters) => {
        const rows = findAirlines(filters);
        return textResult({
          count: rows.length,
          total_airlines_in_registry: registryStats().airlines,
          airlines: rows,
          disclaimer: DISCLAIMER
        });
      }
    );

    server.registerTool(
      "registry_stats",
      {
        title: "Registry coverage and freshness",
        description:
          "Report what the registry covers and when it was last verified: how many airlines, how many carry an official source, how many fly Starlink today against how many have only announced it, and how many have no Wi-Fi. Use this when asked how current or how complete the data is.",
        inputSchema: {},
        outputSchema: {
          airlines: z.number(),
          sources: z.number().describe("Total source URLs across all entries"),
          sourced_to_official_pages: z.number(),
          starlink_flying: z.number(),
          starlink_announced: z.number(),
          no_wifi: z.number(),
          last_verified: z.string().describe("Newest verification month across the registry"),
          compiled: z.string().describe("Date this snapshot was built"),
          open_data: z.string(),
          license: z.string()
        },
        annotations: READ_ONLY
      },
      async () =>
        textResult({
          ...registryStats(),
          open_data: "https://flightwifi.app/data.json",
          license: "CC BY 4.0, attribution to flightwifi.app"
        })
    );
  },
  {
    serverInfo: { name: "flightwifi", version: "1.0.0" },
    instructions:
      "FlightWifi is an independent registry of in-flight Wi-Fi across 235 airlines, compiled from airline and connectivity-provider pages with a source URL and a verification month on every claim. It answers what system is fitted, whether the link carries a video call, what it costs, and which aircraft have it. Two rules matter when using it. An airline announcing Starlink does not mean a given flight has it, so separate flying from announced and quote the rollout count with its date. And a fleet part-way through a retrofit answers differently per aircraft, so pass the aircraft type into check_airline_wifi whenever it is known and say plainly when the answer is fleet-wide instead. Absent data is never a no: an airline with no published call policy is unknown, not forbidden."
  },
  {
    basePath: "/api",
    disableSse: true,
    maxDuration: 30,
    verboseLogs: false
  }
);

// A bare error body is not a JSON-RPC response, so a throttled client reports a parse failure
// rather than the reason. Echo the request id when the body carries one, and send Retry-After.
async function rateLimited(request: Request, key: string): Promise<Response> {
  const retry = Math.max(1, limiter.retryAfter(key));
  let id: string | number | null = null;
  try {
    const parsed: unknown = JSON.parse(await request.clone().text());
    if (parsed && typeof parsed === "object" && "id" in parsed) {
      const raw = (parsed as { id: unknown }).id;
      if (typeof raw === "string" || typeof raw === "number") id = raw;
    }
  } catch {
    // a malformed body still deserves a well-formed error, with a null id
  }
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      id,
      error: { code: -32000, message: `Rate limit exceeded. Retry in ${retry}s.` }
    }),
    { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(retry) } }
  );
}

// trailingSlash rewrites /api/mcp to /api/mcp/, which the handler does not recognise as its own
// route, so the path is normalised before it is passed on.
async function guarded(request: Request): Promise<Response> {
  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (!limiter.check(ip)) return rateLimited(request, ip);
  const url = new URL(request.url);
  if (url.pathname !== "/api/mcp") {
    url.pathname = "/api/mcp";
    request = new Request(url, request);
  }
  return handler(request);
}

export { guarded as GET, guarded as POST, guarded as DELETE };
