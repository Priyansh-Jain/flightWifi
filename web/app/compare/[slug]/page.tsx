import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Cta, Faq, JsonLd, Section } from "@/components/ui";
import { FleetTable } from "@/components/airline";
import { COMPARISONS, monthLabel, schemaDates } from "@/lib/derive";
import { accessPoints, entryFor, fleetVerdict, stats } from "@/lib/extension";
import { SITE_URL, og } from "@/lib/site";
import { slugForCode } from "@/lib/slugs";
import Link from "next/link";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const def = COMPARISONS.find((c) => c.slug === slug);
  if (!def) return {};
  return {
    title: def.title,
    description: `${def.title}: per-aircraft verdicts, cost and video-call support side by side, from official sources.`,
    alternates: { canonical: `/compare/${slug}/` },
    openGraph: og(`/compare/${slug}/`)
  };
}

function Side({ code }: { code: string }) {
  const entry = entryFor(code)!;
  const access = accessPoints(entry.access);
  return (
    <div className="min-w-0">
      <h2 className="mb-3 text-lg font-bold">
        <Link href={`/airlines/${slugForCode(code)}/`}>{entry.airline}</Link>
      </h2>
      <FleetTable code={code} compact />
      {access.length ? (
        <ul className="mt-3 grid gap-1.5 text-sm text-[var(--muted)]">
          {access.map((a) => (
            <li key={a}>· {a}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const def = COMPARISONS.find((c) => c.slug === slug);
  if (!def) notFound();

  const month = monthLabel(stats().asOf);
  const a = entryFor(def.a)!;
  const b = entryFor(def.b)!;
  const va = fleetVerdict(def.a);
  const vb = fleetVerdict(def.b);
  const accessA = accessPoints(a.access);
  const accessB = accessPoints(b.access);
  const faqs = [
    {
      q: `Does ${a.airline} or ${b.airline} have better Wi-Fi?`,
      a: `As of ${month}, ${a.airline}'s fleet-level verdict is "${va?.label ?? "Not verified"}" and ${b.airline}'s is "${vb?.label ?? "Not verified"}". On mid-rollout fleets the answer changes with the specific aircraft, so check the per-aircraft tables for the plane on your route.`
    },
    ...(accessA.length || accessB.length
      ? [
          {
            q: `Is Wi-Fi free on ${a.airline} and ${b.airline}?`,
            a: `${a.airline}: ${accessA.join("; ") || "cost not published in the registry"}. ${b.airline}: ${accessB.join("; ") || "cost not published in the registry"}.`
          }
        ]
      : [])
  ];

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Compare", href: "/compare/" },
          { name: def.title, href: `/compare/${slug}/` }
        ]}
      />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{def.title}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Same route, different metal. The tables below are the two carriers' live registry entries,
          per aircraft type, so the comparison stays current as their rollouts move.
        </p>
      </section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Side code={def.a} />
          <Side code={def.b} />
        </div>
      </Section>
      <Faq items={faqs} title={`${def.title} questions`} />
      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: def.title,
          image: `${SITE_URL}/og.png`,
          description: `${def.title}: per-aircraft verdicts, cost and video-call support side by side, from official sources.`,
          ...schemaDates(stats().asOf),
          author: { "@id": `${SITE_URL}/#org` },
          publisher: { "@id": `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/compare/${slug}/`
        }}
      />
    </>
  );
}
