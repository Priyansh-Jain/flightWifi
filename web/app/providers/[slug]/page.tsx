import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, Chip, Cta, Faq, JsonLd, Section } from "@/components/ui";
import { AirlineLink } from "@/components/airline";
import { PROVIDERS, monthLabel, providerAirlines, schemaDates, type ProviderDef } from "@/lib/derive";
import { stats } from "@/lib/extension";
import { SITE_URL, og } from "@/lib/site";

export function generateStaticParams() {
  return PROVIDERS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const def = PROVIDERS.find((p) => p.slug === slug);
  if (!def) return {};
  return {
    title: `${def.name} in-flight Wi-Fi: which airlines use it`,
    description: `${def.summary} Latency, orbit, and every airline in our registry flying or planning it.`,
    alternates: { canonical: `/providers/${slug}/` },
    openGraph: og(`/providers/${slug}/`)
  };
}

function callAnswer(def: ProviderDef): string {
  if (def.slug === "kuiper") {
    return `On paper yes: low orbit puts expected latency at ${def.latency.replace(" expected", "")}, the range where live calls work. No airline is flying passengers on Kuiper yet; the first installs are scheduled from 2027.`;
  }
  if (/LEO|Medium/.test(def.orbit)) {
    return `Generally yes. ${def.name} runs at ${def.latency} latency, close enough to ground broadband for live video, though some airlines still ban calls as cabin policy.`;
  }
  const multi = /multi-orbit/i.test(def.orbit)
    ? " Newer multi-orbit fits that add low-orbit capacity are the exception."
    : "";
  return `Usually not. The satellite sits roughly 36,000 km up, so latency runs ${def.latency}, which breaks live video even when bandwidth is fine. Browsing, email and messaging work well.${multi}`;
}

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const def = PROVIDERS.find((p) => p.slug === slug);
  if (!def) notFound();
  const airlines = providerAirlines(def);
  const flying = airlines.filter((a) => a.inService);
  const planned = airlines.filter((a) => !a.inService);
  const month = monthLabel(stats().asOf);
  const names = flying.slice(0, 8).map((a) => a.airline);
  const faqs = [
    { q: `Is ${def.name} Wi-Fi fast enough for video calls?`, a: callAnswer(def) },
    {
      q: `Which airlines use ${def.name}?`,
      a: flying.length
        ? `As of ${month}, ${flying.length} ${flying.length === 1 ? "airline" : "airlines"} in the registry ${flying.length === 1 ? "is" : "are"} flying ${def.name}: ${names.join(", ")}${flying.length > names.length ? " and more" : ""}.${planned.length ? ` Another ${planned.length} ${planned.length === 1 ? "has" : "have"} announced or planned it.` : ""}`
        : `No airline is flying passengers on ${def.name} yet. ${planned.length === 1 ? "One airline in the registry has announced it" : `${planned.length} airlines in the registry have announced it`}: ${airlines.map((a) => a.airline).join(", ")}.`
    }
  ];

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Providers", href: "/providers/" },
          { name: def.name, href: `/providers/${slug}/` }
        ]}
      />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {def.name} in-flight Wi-Fi
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{def.summary}</p>
        <dl className="mt-5 grid max-w-xl grid-cols-2 gap-3 text-sm">
          <div className="card p-4">
            <dt className="text-[var(--muted)]">Orbit</dt>
            <dd className="mt-1 font-semibold">{def.orbit}</dd>
          </div>
          <div className="card p-4">
            <dt className="text-[var(--muted)]">Typical latency</dt>
            <dd className="mt-1 font-semibold">{def.latency}</dd>
          </div>
        </dl>
      </section>

      <Section title="How it works">
        <ul className="card grid gap-2.5 p-5">
          {def.how.map((h) => (
            <li key={h} className="flex gap-2 text-[0.95rem]">
              <span className="text-[var(--accent)]">·</span>
              {h}
            </li>
          ))}
        </ul>
      </Section>

      {flying.length ? (
        <Section title={`Airlines flying ${def.name} (${flying.length})`}>
          <div className="card scroller">
            <table>
              <thead>
                <tr>
                  <th>Airline</th>
                  <th>Where</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {flying.map((a) => (
                  <tr key={a.code}>
                    <td className="whitespace-nowrap font-medium">
                      <AirlineLink code={a.code} airline={a.airline} />
                    </td>
                    <td className="text-[var(--muted)]">{a.scope}</td>
                    <td>
                      <Chip cls={a.cls} label={a.label} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      ) : null}

      {planned.length ? (
        <Section title={`Announced or planned (${planned.length})`}>
          <p className="link-row flex flex-wrap gap-x-4 gap-y-1 text-[0.95rem]">
            {planned.map((a) => (
              <AirlineLink key={a.code} code={a.code} airline={a.airline} />
            ))}
          </p>
        </Section>
      ) : null}

      <Faq items={faqs} title={`${def.name} questions`} />
      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${def.name} in-flight Wi-Fi`,
          description: def.summary,
          image: `${SITE_URL}/og.png`,
          ...schemaDates(stats().asOf),
          author: { "@id": `${SITE_URL}/#org` },
          publisher: { "@id": `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/providers/${slug}/`
        }}
      />
    </>
  );
}
