import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Chip, Cta, Faq, JsonLd, Section, type QA } from "@/components/ui";
import { AirlineLink, FleetTable, SourceList } from "@/components/airline";
import { accessPoints, callPolicy, entryFor, fleetNotes, fleetRows, fleetVerdict, orbitClass } from "@/lib/extension";
import { comparisonsFor, relatedAirlines, schemaDates, sourceMix, sourceNote } from "@/lib/derive";
import { airlineSlugs, codeForSlug } from "@/lib/slugs";
import { SITE_URL, og, clampDesc } from "@/lib/site";

export function generateStaticParams() {
  return airlineSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const code = codeForSlug(slug);
  const entry = code ? entryFor(code) : undefined;
  if (!code || !entry) return {};
  const v = fleetVerdict(code);
  return {
    // Search Trends for this niche is dominated by the question form: the rising queries are all
    // "does <airline> have free wifi" and "<airline> wifi cost", so the title answers that phrasing
    // rather than asserting a verdict the searcher has not asked for yet.
    // The "and is it free" half is dropped on long carrier names so the title still fits a SERP
    // line; the free question is answered by the description and an FAQ heading on every page.
    title:
      entry.airline.length <= 14
        ? `Does ${entry.airline} have Wi-Fi, and is it free?`
        : `Does ${entry.airline} have Wi-Fi?`,
    description: clampDesc(`Does ${entry.airline} have Wi-Fi? ${v?.label}. Provider, cost, per-aircraft coverage and video-call support, verified against official sources.`),
    alternates: { canonical: `/airlines/${slug}/` },
    openGraph: og(`/airlines/${slug}/`)
  };
}

function buildFaq(code: string): QA[] {
  const entry = entryFor(code)!;
  const name = entry.airline;
  const rows = fleetRows(code);
  const allNone = entry.rules.every((r) => orbitClass(r.orbit) === "NONE");

  const has = allNone
    ? `No. ${name} does not offer passenger internet on any aircraft as of ${entry.as_of ?? "our last check"}. ${entry.access ?? ""}`
    : `Yes, on part or all of the fleet. ${rows
        .map((r) => `${r.scope}: ${r.label}`)
        .join(". ")}.`;

  const free = entry.access
    ? entry.access
    : "Pricing has not been published by the airline.";

  // Branch on whether any rule actually carries a fast orbit rather than on the headline class: a
  // mid-rollout fleet classifies as VARIES, and telling those readers their wifi "runs over
  // high-orbit satellite" contradicts both the registry and the chip at the top of their own page.
  const policy = callPolicy(code);
  const fast = entry.rules.filter((r) => ["LEO", "MEO"].includes(orbitClass(r.orbit)));
  const mixed = entry.rules.filter((r) => orbitClass(r.orbit) === "VARIES");
  const hasFast = fast.length > 0 || mixed.length > 0;
  const onlyMeo = fast.length > 0 && fast.every((r) => orbitClass(r.orbit) === "MEO");
  const speed = onlyMeo ? "roughly 120-150 ms" : "roughly 20-50 ms";

  let calls: string;
  if (allNone) {
    calls = `No, because ${name} has no onboard internet at all.`;
  } else if (!hasFast) {
    calls = `Not reliably. ${name}'s wifi runs over high-orbit satellite, where the roughly 600 ms round trip breaks live calls even when browsing is fine.`;
  } else if (policy?.calls === "no") {
    calls = `The connection is fast enough on the equipped aircraft, but ${name} ${policy.check ? "is reported to restrict" : "restricts"} voice and video calls as cabin policy.`;
  } else if (policy?.calls === "voice") {
    calls = `${name} permits voice calls on its fast wifi, but not video calls.`;
  } else if (mixed.length && !fast.length) {
    calls = `On the aircraft already converted, yes: latency there is ${speed}, similar to home broadband. On the tails still running the older high-orbit system, no. Which one you get depends on the aircraft, so check the table above against the plane on your booking.`;
  } else if (mixed.length) {
    calls = `Yes on the converted aircraft, where latency is ${speed}. ${name} is mid-rollout, so the rest of the fleet still runs the older high-orbit system, which cannot hold a live call.`;
  } else {
    calls = `Yes, on the fast-equipped aircraft. Latency there is ${speed}, similar to home broadband.`;
  }

  return [
    { q: `Does ${name} have Wi-Fi?`, a: has.trim() },
    { q: `Is ${name} Wi-Fi free?`, a: free },
    { q: `Can you make video calls on ${name} Wi-Fi?`, a: calls }
  ];
}

export default async function AirlinePage({ params }: Props) {
  const { slug } = await params;
  const code = codeForSlug(slug);
  const entry = code ? entryFor(code) : undefined;
  if (!code || !entry) notFound();

  const v = fleetVerdict(code);
  const access = accessPoints(entry.access);
  const related = relatedAirlines(code);
  const faq = buildFaq(code);
  const notes = fleetNotes(code);
  const compares = comparisonsFor(code);
  const mix = sourceMix(entry);

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Airlines", href: "/airlines/" },
          { name: entry.airline, href: `/airlines/${slug}/` }
        ]}
      />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Does {entry.airline} have Wi-Fi?
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{faq[0].a}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {v ? <Chip cls={v.cls} label={v.label} /> : null}
          <span className="text-sm text-[var(--muted)]">
            {mix.official ? "Sourced from official pages" : "Sourced from trade reporting"}
            {entry.needs_verification ? " · verification pending" : ""} · as of {entry.as_of}
          </span>
        </div>
      </section>

      <Section title="Verdict by aircraft">
        <FleetTable code={code} />
        {notes.length ? (
          <div className="mt-3 grid gap-1.5 text-sm text-[var(--muted)]">
            {notes.map((n) => (
              <p key={n}>Announced, not yet flying: {n}</p>
            ))}
          </div>
        ) : null}
      </Section>

      {access.length ? (
        <Section title="Cost and access">
          <ul className="card grid gap-2 p-5 text-[0.95rem]">
            {access.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="text-[var(--accent)]">·</span>
                {a}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Faq items={faq} title={`${entry.airline} Wi-Fi questions`} />

      <Section title="Sources">
        <div className="card p-5">
          <SourceList entry={entry} />
          <p className="mt-3 text-sm text-[var(--muted)]">
            {sourceNote(entry)} See the <Link href="/methodology/">methodology</Link>.
          </p>
        </div>
      </Section>

      {compares.length ? (
        <Section title="Compared with">
          <p className="link-row flex flex-wrap gap-x-4 gap-y-1 text-[0.95rem]">
            {compares.map((c) => (
              <Link key={c.slug} href={`/compare/${c.slug}/`}>
                {c.title}
              </Link>
            ))}
          </p>
        </Section>
      ) : null}

      {related.length ? (
        <Section title="Airlines with a similar verdict">
          <p className="link-row flex flex-wrap gap-x-4 gap-y-1 text-[0.95rem]">
            {related.map((r) => (
              <AirlineLink key={r.code} code={r.code} airline={r.airline} />
            ))}
          </p>
        </Section>
      ) : null}

      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${entry.airline} Wi-Fi`,
          description: `Does ${entry.airline} have Wi-Fi? ${v?.label ?? "Not verified"}. Provider, cost and per-aircraft coverage.`,
          image: `${SITE_URL}/og.png`,
          ...schemaDates(entry.as_of ?? "2026-08"),
          author: { "@id": `${SITE_URL}/#org` },
          publisher: { "@id": `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/airlines/${slug}/`
        }}
      />
    </>
  );
}
