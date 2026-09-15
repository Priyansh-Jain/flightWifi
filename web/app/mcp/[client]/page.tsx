import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Cta, JsonLd, Section } from "@/components/ui";
import { FaqSection } from "@/components/Faq";
import { CopyField } from "@/components/CopyField";
import { SetupTabs, type Tab } from "@/components/SetupTabs";
import { stats, starlinkRows } from "@/lib/extension";
import { SITE_URL, og, clampDesc } from "@/lib/site";

const MCP_URL = `${SITE_URL}/api/mcp/`;

type Client = {
  name: string;
  h1: string;
  sub: string;
  setupNote: string;
  tabs: Tab[];
  asks: string[];
  extraFaq?: { q: string; a: string }[];
};

const CLIENTS: Record<string, Client> = {
  claude: {
    name: "Claude",
    h1: "Connect Claude to real flight Wi-Fi data",
    sub: "Add the FlightWifi server to Claude and ask what Wi-Fi a flight has, whether the link carries a video call, and which airlines fly Starlink today rather than having announced it.",
    setupNote: "No key and no account. Pick where you use Claude.",
    tabs: [
      {
        label: "Claude web and desktop",
        steps: [
          {
            title: "Open Settings",
            body: "On claude.ai click your initials in the bottom-left corner and choose Settings. In the desktop app, open Settings from the menu bar."
          },
          {
            title: "Go to Connectors",
            body: "In the Settings sidebar choose Connectors, then Add custom connector."
          },
          {
            title: "Fill in the form and add it",
            form: [
              ["Name", "FlightWifi"],
              ["URL", MCP_URL],
              ["Authentication", "None"]
            ]
          },
          {
            title: "Ask in your next chat",
            body: "The tools appear straight away. Claude decides when to call them, so you can ask in plain language mid-conversation."
          }
        ]
      },
      {
        label: "Claude Code",
        steps: [
          {
            title: "Add the server from your terminal",
            body: "One command, scoped to your user by default so it works in every project.",
            code: `claude mcp add --transport http flightwifi ${MCP_URL}`
          },
          {
            title: "Confirm it connected",
            body: "The server should be listed as connected.",
            code: "claude mcp list"
          },
          {
            title: "Ask away",
            body: 'Try "which airlines have Starlink flying today" and Claude will call the server rather than answering from memory.'
          }
        ]
      }
    ],
    asks: [
      "Does Qatar Airways have Wi-Fi on the 777, and can I take a video call?",
      "Which airlines actually have Starlink flying right now, not just announced?",
      "I'm booking an A350. Which airline gives me the best Wi-Fi on it?",
      "Is United's Wi-Fi free, and does every plane have it yet?"
    ]
  },

  chatgpt: {
    name: "ChatGPT",
    h1: "Give ChatGPT real flight Wi-Fi data",
    sub: "Add the FlightWifi server as a custom connector and ChatGPT answers Wi-Fi questions from a sourced registry instead of guessing from press releases.",
    setupNote: "Custom connectors need Developer mode switched on first.",
    tabs: [
      {
        label: "ChatGPT web and desktop",
        steps: [
          {
            title: "Turn on Developer mode",
            body: "Open Settings, then Connectors, then Advanced, and enable Developer mode. Custom MCP connectors are hidden until you do."
          },
          {
            title: "Add a custom connector",
            body: "Back in Connectors, choose Create or Add custom connector.",
            form: [
              ["Name", "FlightWifi"],
              ["MCP server URL", MCP_URL],
              ["Authentication", "No authentication"]
            ]
          },
          {
            title: "Enable it in a chat",
            body: "Open the tools menu in the composer and tick FlightWifi, then ask your question."
          }
        ]
      },
      {
        label: "Codex CLI",
        steps: [
          {
            title: "Add the server",
            body: "Codex picks the HTTP transport automatically when you pass a URL.",
            code: `codex mcp add --url ${MCP_URL} flightwifi`
          },
          {
            title: "Or edit the config by hand",
            body: "Add this table to ~/.codex/config.toml if you prefer editing the file.",
            code: `[mcp_servers.flightwifi]\nurl = "${MCP_URL}"`
          },
          {
            title: "Check it is registered",
            code: "codex mcp list"
          }
        ]
      }
    ],
    asks: [
      "Which airlines have free Wi-Fi and Starlink already flying?",
      "Does Emirates have Wi-Fi on the A380, and what does it cost?",
      "Which airlines have no Wi-Fi at all?",
      "How current is your flight Wi-Fi data?"
    ],
    extraFaq: [
      {
        q: "Why can I not see custom connectors?",
        a: "They sit behind Developer mode, under Settings then Connectors then Advanced. Availability also depends on your ChatGPT plan, so if the option is missing entirely it is a plan limit rather than a problem with the server."
      }
    ]
  },

  cursor: {
    name: "Cursor",
    h1: "Query flight Wi-Fi from your editor",
    sub: "Add the FlightWifi server to Cursor and pull airline Wi-Fi, Starlink rollout state and per-aircraft verdicts straight into chat, or into whatever you are building against the open dataset.",
    setupNote: "Two ways in, both a single URL.",
    tabs: [
      {
        label: "Settings",
        steps: [
          {
            title: "Open MCP settings",
            body: "Cursor Settings, then MCP, then Add new global MCP server. That opens mcp.json for you."
          },
          {
            title: "Add the server",
            body: "Save the file and Cursor connects immediately.",
            code: `{\n  "mcpServers": {\n    "flightwifi": {\n      "url": "${MCP_URL}"\n    }\n  }\n}`
          },
          {
            title: "Check the green dot",
            body: "The MCP settings pane lists the server with its tools once it has connected."
          }
        ]
      },
      {
        label: "mcp.json",
        steps: [
          {
            title: "Edit the file directly",
            body: "Global config lives at ~/.cursor/mcp.json. For one project, use .cursor/mcp.json in the repo root instead.",
            code: `{\n  "mcpServers": {\n    "flightwifi": {\n      "url": "${MCP_URL}"\n    }\n  }\n}`
          },
          {
            title: "Reload Cursor",
            body: "The tools appear in chat under the MCP section."
          }
        ]
      }
    ],
    asks: [
      "Which airlines in the registry fly Starlink, and how far along is each rollout?",
      "Give me every airline with an aircraft-specific verdict for the 787.",
      "How many airlines have no Wi-Fi, and how many sources back the registry?"
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(CLIENTS).map((client) => ({ client }));
}

export async function generateMetadata(props: {
  params: Promise<{ client: string }>;
}): Promise<Metadata> {
  const { client } = await props.params;
  const c = CLIENTS[client];
  if (!c) return {};
  return {
    title: `${c.name} MCP setup: flight Wi-Fi data`,
    description: clampDesc(c.sub),
    alternates: { canonical: `/mcp/${client}/` },
    openGraph: og(`/mcp/${client}/`)
  };
}

export default async function ClientPage(props: { params: Promise<{ client: string }> }) {
  const { client } = await props.params;
  const c = CLIENTS[client];
  if (!c) notFound();

  const s = stats();
  const flying = starlinkRows().filter((r) => r.status === "flying").length;

  const faq = [
    ...(c.extraFaq ?? []),
    {
      q: "Do I need an account or a key?",
      a: "No. The server is free and open, with no key and no sign-up. Requests are rate limited per client so one caller cannot slow it down for everyone."
    },
    {
      q: "Where do the answers come from?",
      a: `${s.airlines} airlines compiled from airline and connectivity-provider pages, with ${s.sources} source URLs and a verification month on every entry. It is the same registry behind this website and the browser extension, published openly under CC BY 4.0.`
    },
    {
      q: `Will ${c.name} know about my exact flight?`,
      a: "It answers by airline and by aircraft type, not by tail number. On a fleet mid-retrofit that distinction decides the answer, so name the aircraft when you know it and the reply says plainly when it is a fleet-wide answer instead."
    },
    {
      q: "Can it change anything or book something?",
      a: "No. Every tool only reads the registry, which is why they are marked read-only and safe to repeat."
    }
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `Connect ${c.name} to the FlightWifi MCP server`,
          description: c.sub,
          totalTime: "PT2M",
          step: c.tabs[0].steps.map((st, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: st.title,
            text: st.body ?? st.title
          }))
        }}
      />
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: "MCP server", href: "/mcp/" },
          { name: c.name, href: `/mcp/${client}/` }
        ]}
      />

      <section className="mx-auto w-full max-w-5xl px-5 pt-8 text-center">
        <h1 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">{c.h1}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">{c.sub}</p>
        <div className="mx-auto mt-7 max-w-xl">
          <CopyField value={MCP_URL} label="Server URL" />
        </div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Free · no key · {s.airlines} airlines · {flying} flying Starlink · verified {s.asOf}
        </p>
      </section>

      <Section title={`Setting it up in ${c.name}`}>
        <p className="mb-5 text-[var(--muted)]">{c.setupNote}</p>
        <SetupTabs tabs={c.tabs} />
      </Section>

      <Section title="Things to ask once it is connected">
        <ul className="grid list-none gap-3 p-0 sm:grid-cols-2">
          {c.asks.map((a) => (
            <li key={a} className="card p-5 text-sm italic">
              &ldquo;{a}&rdquo;
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What it will and will not claim">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="card p-5">
            <p className="font-semibold">Announced is not flying</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              A signed Starlink deal does not put it on your aircraft. The two are kept apart, and a
              rollout count comes back with its date and who published it.
            </p>
          </div>
          <div className="card p-5">
            <p className="font-semibold">The aircraft decides</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              A fleet part-way through a retrofit answers differently plane by plane, so naming the
              aircraft gets you the aircraft&apos;s answer rather than an average.
            </p>
          </div>
          <div className="card p-5">
            <p className="font-semibold">Unknown stays unknown</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              An airline that publishes no call policy comes back unknown, never permitted. Missing
              data is reported as missing.
            </p>
          </div>
        </div>
      </Section>

      <FaqSection items={faq} title={`Questions about ${c.name}.`} />

      <Section title="Other clients">
        <p className="max-w-[46rem] text-[var(--muted)]">
          {Object.entries(CLIENTS)
            .filter(([k]) => k !== client)
            .map(([k, other], i, arr) => (
              <span key={k}>
                <Link href={`/mcp/${k}/`}>Set it up in {other.name}</Link>
                {i < arr.length - 1 ? ", or " : ". "}
              </span>
            ))}
          Any client that speaks streamable HTTP works, and the{" "}
          <Link href="/mcp/">overview page</Link> lists what each tool answers.
        </p>
      </Section>

      <Cta secondary={{ href: "/starlink/", label: "Starlink on flights" }} />
    </>
  );
}
