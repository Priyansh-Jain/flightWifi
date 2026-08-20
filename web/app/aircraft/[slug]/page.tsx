import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Chip, Cta, Faq, JsonLd, Section } from "@/components/ui";
import { AirlineLink } from "@/components/airline";
import { AIRCRAFT, aircraftAirlines, monthLabel, schemaDates } from "@/lib/derive";
import { stats } from "@/lib/extension";
import { SITE_URL, og, clampDesc } from "@/lib/site";

export function generateStaticParams() {
  return AIRCRAFT.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const def = AIRCRAFT.find((a) => a.slug === slug);
  if (!def) return {};
  return {
    title: `Does the ${def.name} have Wi-Fi?`,
    description: clampDesc(`Whether the ${def.name} aircraft has Wi-Fi depends entirely on the airline flying it. Every operator in the registry that names the ${def.name}, with the system on board and whether it carries a video call.`),
    alternates: { canonical: `/aircraft/${slug}/` },
    openGraph: og(`/aircraft/${slug}/`)
  };
}

export default async function AircraftPage({ params }: Props) {
  const { slug } = await params;
  const def = AIRCRAFT.find((a) => a.slug === slug);
  if (!def) notFound();
  const rows = aircraftAirlines(def);
  const month = monthLabel(stats().asOf);
  const fast = rows.filter((r) => r.cls === "fast");
  const faqs = rows.length
    ? [
        {
          q: `Does the ${def.name} have Wi-Fi?`,
          a: `It depends on the operator, not the aircraft. ${rows.length} airlines in the registry name the ${def.name} specifically, with verdicts on this type ranging from "${rows[0].label}" to "${rows[rows.length - 1].label}". The table above shows each airline's system.`
        },
        {
          q: `Which airline has the best Wi-Fi on the ${def.name}?`,
          a: fast.length
            ? `As of ${month}, ${fast.map((r) => r.airline).join(", ")} ${fast.length === 1 ? "runs" : "run"} a system quick enough for live calls on the ${def.name}, the fastest tier in the registry. This covers the airlines whose entries name the ${def.name}; carriers with one fleet-wide answer are on their own pages.`
            : `Among the airlines whose entries name the ${def.name} specifically, none flies a call-grade system on it yet, and the strongest verdict on this type is "${rows[0].label}" (${rows[0].airline}). Carriers with a single fleet-wide answer are on their own pages, and some of those are mid-rollout on this type.`
        }
      ]
    : [];

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Aircraft", href: "/aircraft/" },
          { name: def.name, href: `/aircraft/${slug}/` }
        ]}
      />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Does the {def.name} have Wi-Fi?
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          {faqs.length ? faqs[0].a : ""}
        </p>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          The {def.name} is an airliner, not a single product with one answer: the same airframe
          carries completely different internet depending on who operates it. These are the airlines
          whose registry entries name the {def.name} specifically; carriers with a single fleet-wide
          answer are on their own pages.
        </p>
      </section>
      <Section>
        <div className="card scroller">
          <table>
            <thead>
              <tr>
                <th>Airline</th>
                <th>Verdict on this type</th>
                <th>System</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.code}>
                  <td className="whitespace-nowrap font-medium">
                    <AirlineLink code={r.code} airline={r.airline} />
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
      </Section>
      {faqs.length ? <Faq items={faqs} title={`${def.name} Wi-Fi questions`} /> : null}
      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `Does the ${def.name} have Wi-Fi?`,
          image: `${SITE_URL}/og.png`,
          description: `Which airlines have Wi-Fi on the ${def.name}, whose is fast enough for video calls, and whose ${def.name}s fly with nothing.`,
          ...schemaDates(stats().asOf),
          author: { "@id": `${SITE_URL}/#org` },
          publisher: { "@id": `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/aircraft/${slug}/`,
          about: { "@type": "Product", name: `${def.name} airliner`, sameAs: def.wikipedia }
        }}
      />
    </>
  );
}
