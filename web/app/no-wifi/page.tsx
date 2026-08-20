import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Cta, Faq, JsonLd, Section } from "@/components/ui";
import { AirlineLink } from "@/components/airline";
import { monthLabel, noWifiRows, schemaDates } from "@/lib/derive";
import { stats } from "@/lib/extension";
import { SITE_URL, og, clampDesc } from "@/lib/site";

export const metadata: Metadata = {
  title: "Which airlines have no Wi-Fi?",
  description:clampDesc(
    "The airlines that still fly with no internet at all, and the ones whose onboard Wi-Fi is a local movie server with no route to the ground. Compiled airline by airline."
    ),
  alternates: { canonical: "/no-wifi/" },
  openGraph: og("/no-wifi/")
};

function Table({ rows }: { rows: ReturnType<typeof noWifiRows> }) {
  return (
    <div className="card scroller">
      <table>
        <thead>
          <tr>
            <th>Airline</th>
            <th>What is actually on board</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.code}>
              <td className="whitespace-nowrap font-medium">
                <AirlineLink code={r.code} airline={r.airline} />
              </td>
              <td className="text-[var(--muted)]">{r.access}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NoWifiPage() {
  const rows = noWifiRows();
  const portal = rows.filter((r) => r.kind === "portal");
  const none = rows.filter((r) => r.kind === "none");
  const announced = rows.filter((r) => r.kind === "announced");
  const s = stats();
  const month = monthLabel(s.asOf);

  const faqs = [
    {
      q: "Which airlines have no Wi-Fi?",
      a: `As of ${month}, ${rows.length} of the ${s.airlines} airlines in the registry carry no passenger internet on any aircraft. ${none.length} have no onboard network at all, ${portal.length} run an entertainment-only cabin network with no route to the ground, and ${announced.length} have announced something that is not flying yet.`
    },
    {
      q: "Why does my phone show full Wi-Fi bars when nothing sends?",
      a: "Because you are connected to a cabin server, not to the internet. Dozens of airlines advertise onboard Wi-Fi that is a local streaming network: films, a menu, a moving map, and no link to the ground. Your device sees a strong signal because the access point is a few metres away, but no message leaves the aircraft."
    },
    {
      q: "Do budget airlines have Wi-Fi?",
      a: "Mostly not, and the exceptions matter more than the rule. Some low-cost carriers fly genuinely fast satellite internet while several full-service carriers still have nothing. The verdict follows the aircraft and the contract, not the fare model, which is why this list is compiled carrier by carrier."
    }
  ];

  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "No Wi-Fi", href: "/no-wifi/" }]} />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Which airlines have no Wi-Fi?
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          {rows.length} of the {s.airlines} airlines in the registry carry no passenger internet on
          any aircraft as of {month}. That splits two ways, and the second one is the trap:{" "}
          {none.length} have no onboard network at all, while {portal.length} run a cabin network
          that looks like Wi-Fi and reaches only a local entertainment server.
        </p>
      </section>

      <Section title={`Wi-Fi that is not internet (${portal.length})`}>
        <p className="mb-4 max-w-2xl text-[var(--muted)]">
          These airlines do have an onboard network. It carries films, a menu and a moving map, and
          nothing you send leaves the aircraft. Aggregator guides routinely list these carriers as
          having Wi-Fi, which is how the myth survives.
        </p>
        <Table rows={portal} />
      </Section>

      <Section title={`No onboard network at all (${none.length})`}>
        <Table rows={none} />
      </Section>

      {announced.length ? (
        <Section title={`Nothing flying yet, but something announced (${announced.length})`}>
          <p className="mb-4 max-w-2xl text-[var(--muted)]">
            A signed contract delivers nothing on your flight. These carriers have announced a
            system that is not carrying passengers yet, so book them as if they have no Wi-Fi.
          </p>
          <Table rows={announced} />
        </Section>
      ) : null}

      <Section title="How this list is built">
        <p className="max-w-2xl text-[var(--muted)]">
          An airline appears here only when every rule in its registry entry resolves to no usable
          internet. Each row links to that airline&apos;s page, where the sources and the
          last-verified date are listed. The{" "}
          <Link href="/methodology/">methodology</Link> explains what counts as a source, and the
          full registry is <a href="/data.json">open data</a>.
        </p>
      </Section>

      <Faq items={faqs} title="Airlines without Wi-Fi: questions" />
      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Which airlines have no Wi-Fi?",
          description:
            "The airlines flying with no internet at all, and the ones whose onboard Wi-Fi reaches only a local entertainment server.",
          image: `${SITE_URL}/og.png`,
          ...schemaDates(s.asOf),
          author: { "@id": `${SITE_URL}/#org` },
          publisher: { "@id": `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/no-wifi/`
        }}
      />
    </>
  );
}
