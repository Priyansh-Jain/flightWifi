import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Cta, JsonLd, Section } from "@/components/ui";
import { FaqSection } from "@/components/Faq";
import { CopyField } from "@/components/CopyField";
import { stats, starlinkRows } from "@/lib/extension";
import { SITE_URL, og, clampDesc } from "@/lib/site";

const MCP_URL = `${SITE_URL}/api/mcp/`;

export const metadata: Metadata = {
  title: "MCP server: flight Wi-Fi answers inside your AI assistant",
  description: clampDesc(
    "Connect Claude, ChatGPT or Cursor to the FlightWifi registry: which airlines fly Starlink today, whether a link carries a video call, what it costs, per aircraft type. Free, no key."
  ),
  alternates: { canonical: "/mcp/" },
  openGraph: og("/mcp/")
};

const STEPS: [string, string][] = [
  ["Add the URL", "Paste the server address into your assistant's connector settings. One URL, no key, no sign-up."],
  ["Ask in plain language", "Airline, aircraft, route. No syntax to learn, and it works mid-conversation."],
  ["Get a dated answer", "The system on board, whether a call works, what it costs, and the month the claim was verified."]
];

const TOOLS: { name: string; desc: string; ask: string }[] = [
  {
    name: "check_airline_wifi",
    desc: "What Wi-Fi an airline has: the system fitted, its orbit, whether the link carries a video call, the cost, and how the answer changes by aircraft type. Returns the sources and the verification month.",
    ask: "Does Qatar Airways have Wi-Fi on the 777, and can I take a video call?"
  },
  {
    name: "list_starlink_airlines",
    desc: "Airlines flying Starlink with passengers today, kept separate from those that have only announced a deal, with how far each rollout has actually got and who published that count.",
    ask: "Which airlines actually have Starlink flying right now, not just announced?"
  },
  {
    name: "wifi_by_aircraft",
    desc: "One aircraft type across every operator that flies it, best first. The same plane carries different internet depending on the airline, which is the assumption travellers get wrong most often.",
    ask: "I'm booking an A350. Which airline gives me the best Wi-Fi on it?"
  },
  {
    name: "find_airlines_by_wifi",
    desc: "Filter the registry by what the Wi-Fi can do: quick enough for a video call, free for everyone, Starlink flying today, or no usable internet at all.",
    ask: "Which airlines have free Wi-Fi and Starlink already flying?"
  },
  {
    name: "registry_stats",
    desc: "What the registry covers and when it was last verified, so an assistant can say how current the answer is instead of implying it is live.",
    ask: "How current is your flight Wi-Fi data?"
  }
];

const CLIENTS: { name: string; slug: string; how: string }[] = [
  {
    name: "Claude",
    slug: "claude",
    how: "Settings, then Connectors, then Add custom connector. Paste the URL and the tools appear in your next chat. Claude Code takes one command."
  },
  {
    name: "ChatGPT",
    slug: "chatgpt",
    how: "Turn on Developer mode under Settings and Connectors, then add the URL as a custom MCP connector. Codex CLI takes one command."
  },
  {
    name: "Cursor",
    slug: "cursor",
    how: 'Add it to mcp.json as a server with "url" set to the address above, then query it from chat.'
  }
];

export default function McpPage() {
  const s = stats();
  const rows = starlinkRows();
  const flying = rows.filter((r) => r.status === "flying").length;

  const faq = [
    {
      q: "What is MCP, and why connect this?",
      a: "The Model Context Protocol is an open standard that lets an AI assistant call an outside tool instead of answering from memory. In-flight Wi-Fi is exactly the kind of detail a model gets confidently wrong, because it changes every month and airlines announce things years before they fly. Connected, your assistant reads the same registry this site is built from, with a source and a date on every claim."
    },
    {
      q: "Is it free? Do I need a key?",
      a: "Free, no key, no account, no sign-up. Requests are rate limited per client so one caller cannot slow it down for everyone."
    },
    {
      q: "Where does the data come from?",
      a: `${s.airlines} airlines, compiled from airline and connectivity-provider pages, with ${s.sources} source URLs behind the entries and a verification month on each one. It is the same registry the website and the browser extension use, published openly under CC BY 4.0.`
    },
    {
      q: "Will it tell me about my specific flight?",
      a: "It answers by airline and by aircraft type, not by tail number. On a fleet part-way through a retrofit that distinction matters, so pass the aircraft when you know it, and the answer says plainly when it is a fleet-wide one instead."
    },
    {
      q: "Does it know about Starlink rollouts?",
      a: `Yes, and it keeps flying separate from announced, which most sources do not. ${flying} airlines fly it with passengers today. Where a rollout count exists, the answer carries the number, the date and who published it, including when the count came from an independent tracker rather than the airline.`
    },
    {
      q: "Can it book anything?",
      a: "No. Every tool reads the registry and changes nothing, so it is safe for an assistant to call unprompted and safe to repeat."
    }
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "FlightWifi MCP server",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any MCP-compatible client",
          url: `${SITE_URL}/mcp/`,
          description: `Model Context Protocol server exposing the FlightWifi registry of ${s.airlines} airlines: in-flight Wi-Fi system, orbit, video-call support, cost and Starlink status, per aircraft type.`,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "FlightWifi", url: SITE_URL }
        }}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: "MCP server", href: "/mcp/" }
        ]}
      />

      <section className="mx-auto w-full max-w-5xl px-5 pt-10 text-center">
        <h1 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
          Flight Wi-Fi, inside your AI assistant
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">
          Ask Claude, ChatGPT or Cursor what Wi-Fi a flight has and it will guess, because the answer
          changes every month. Connect this server and it reads the same registry this site is built
          from: {s.airlines} airlines, sourced and dated, with Starlink that is flying kept separate
          from Starlink that is announced.
        </p>
        <div className="mx-auto mt-7 max-w-xl">
          <CopyField value={MCP_URL} label="Server URL" />
        </div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Free · no key · no account · {s.sources} cited sources · verified {s.asOf}
        </p>
      </section>

      <Section title="How it works">
        <ol className="grid list-none gap-3 p-0 sm:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="card p-5">
              <span className="text-sm font-semibold text-[var(--accent)]">{i + 1}</span>
              <p className="mt-1 font-semibold">{t}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Adding it to your assistant">
        <div className="grid gap-3 sm:grid-cols-3">
          {CLIENTS.map((c) => (
            <div key={c.name} className="card p-5">
              <p className="font-semibold">{c.name}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{c.how}</p>
              <p className="mt-3 text-sm">
                <Link href={`/mcp/${c.slug}/`}>Step-by-step for {c.name}</Link>
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Any client that speaks streamable HTTP works. There is nothing to install and no key to
          rotate, so removing it is just deleting the URL.
        </p>
      </Section>

      <Section title="What it can answer">
        <div className="grid gap-3">
          {TOOLS.map((t) => (
            <div key={t.name} className="card p-5">
              <code className="text-[13px] font-semibold">{t.name}</code>
              <p className="mt-2 text-sm text-[var(--muted)]">{t.desc}</p>
              <p className="mt-3 text-sm italic">&ldquo;{t.ask}&rdquo;</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why connect a tool at all">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="card p-5">
            <p className="font-semibold">Announced is not flying</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              An airline signing a Starlink deal does not put it on your aircraft. Models read the
              press release and answer as though it did. This separates the two and gives you the
              rollout count with its date.
            </p>
          </div>
          <div className="card p-5">
            <p className="font-semibold">The aircraft decides</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              A fleet part-way through a retrofit answers differently plane by plane. Ask about the
              aircraft and you get the aircraft&apos;s answer, not an average of the fleet.
            </p>
          </div>
          <div className="card p-5">
            <p className="font-semibold">Unknown stays unknown</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              An airline that publishes no call policy comes back as unknown, never as permitted. A
              missing answer is reported as missing rather than filled in.
            </p>
          </div>
        </div>
      </Section>

      <FaqSection items={faq} title="Questions about the server." />

      <Section title="Prefer the raw data?">
        <p className="max-w-[46rem] text-[var(--muted)]">
          The whole registry is published as JSON under CC BY 4.0 at{" "}
          <a href="/data.json">/data.json</a>, with no key and an open CORS header, so you can skip
          the protocol entirely. How entries are compiled and dated is written up in the{" "}
          <Link href="/methodology/">methodology</Link>.
        </p>
      </Section>

      <Cta secondary={{ href: "/starlink/", label: "Starlink on flights" }} />
    </>
  );
}
