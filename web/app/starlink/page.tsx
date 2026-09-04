import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Chip, Cta, Faq, JsonLd, Section } from "@/components/ui";
import { AirlineLink } from "@/components/airline";
import { STARLINK_ACCESS_UI, starlinkRows, stats } from "@/lib/extension";
import { schemaDates } from "@/lib/derive";
import { SITE_LAUNCH, SITE_URL, og } from "@/lib/site";

export const metadata: Metadata = {
  title: "Which airlines have Starlink? The in-service tracker",
  description:
    "Every airline flying Starlink Wi-Fi today, every mid-retrofit fleet, and every signed deal with nothing in the air yet. In-service status, not press releases.",
  alternates: { canonical: "/starlink/" },
    openGraph: og("/starlink/")
};

const STATUS_META = {
  flying: {
    cls: "fast",
    title: "Flying with passengers",
    blurb: "Starlink is carrying passengers on these airlines today. Most are mid-retrofit, so whether your specific aircraft is converted is decided by which tail shows up; the note on each row says how far it has got."
  },
  announced: {
    cls: "part",
    title: "Signed, nothing flying yet",
    blurb: "A real contract exists, and not one passenger flight has it. Booking these airlines today gets you their old system or nothing. The cost column here is what the airline has promised for launch, not what you can buy now."
  }
} as const;

const FAQ = [
  {
    q: "How is this different from other Starlink airline lists?",
    a: "Most lists repeat contracted totals from press releases. This tracker distinguishes in-service from announced, per aircraft type, because airlines retrofit one plane at a time and a signed deal delivers nothing on your flight."
  },
  {
    q: "Is Starlink Wi-Fi free?",
    a: "On most carriers yes, either for everyone (Qatar, Emirates on fitted planes, airBaltic, ZIPAIR, Aer Lingus, Iberia, Gulf Air, British Airways) or behind a free loyalty account (United, Air France, SAS, Southwest, Alaska, WestJet, Virgin Atlantic, Air Canada, Hawaiian, Air New Zealand). Copa is the exception: it sells access to most passengers."
  },
  {
    q: "How fast is Starlink on a plane?",
    a: "Low orbit puts latency around 20-50 ms, which is the property that matters: video calls and live work behave like ground broadband. We deliberately do not quote speed numbers, because throughput varies by load and is not a property of a flight."
  }
];

export default function StarlinkPage() {
  const rows = starlinkRows();
  const s = stats();
  const groups = ["flying", "announced"] as const;
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Starlink tracker", href: "/starlink/" }]} />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Which airlines have Starlink?
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          The number press releases never give you: what is actually in service. Compiled from
          official airline and SpaceX announcements, last verified {s.asOf}. An announced deal never
          counts as flying here.
        </p>
      </section>

      {groups.map((g) => {
        const meta = STATUS_META[g];
        const list = rows.filter((r) => r.status === g);
        if (!list.length) return null;
        return (
          <Section key={g} title={`${meta.title} (${list.length})`}>
            <p className="mb-4 max-w-2xl text-sm text-[var(--muted)]">{meta.blurb}</p>
            <div className="card scroller">
              <table>
                <thead>
                  <tr>
                    <th>Airline</th>
                    <th>Where it stands</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((r) => (
                    <tr key={r.code}>
                      <td className="whitespace-nowrap font-medium">
                        <AirlineLink code={r.code} airline={r.airline} />
                      </td>
                      <td className="text-[var(--muted)]">{r.detail}</td>
                      <td>
                        {r.status === "flying" ? (
                          <Chip
                            cls={STARLINK_ACCESS_UI[r.access].flying.cls}
                            label={STARLINK_ACCESS_UI[r.access].flying.label}
                          />
                        ) : (
                          <span className="whitespace-nowrap text-sm text-[var(--muted)]">
                            {STARLINK_ACCESS_UI[r.access].announced}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        );
      })}

      <Section title="Use this data">
        <p className="max-w-2xl text-[var(--muted)]">
          The full registry behind this page is published as <a href="/data.json">open JSON</a>,
          covering all {s.airlines} airlines with sources per claim. Cite it freely with a link back;
          the <Link href="/methodology/">methodology</Link> explains how it is compiled.
        </p>
      </Section>

      <Faq items={FAQ} title="Starlink on airlines" />
      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Airline Starlink deployment tracker",
          description:
            "In-service vs contracted Starlink status per airline and aircraft type, compiled from official airline and provider sources.",
          url: `${SITE_URL}/starlink/`,
          license: "https://creativecommons.org/licenses/by/4.0/",
          isAccessibleForFree: true,
          creator: { "@id": `${SITE_URL}/#org` },
          keywords: ["in-flight wifi", "Starlink", "airline connectivity", "aircraft wifi", "satellite internet"],
          temporalCoverage: `${SITE_LAUNCH}/..`,
          datePublished: SITE_LAUNCH,
          variableMeasured: ["airline", "aircraft type", "connectivity provider", "satellite orbit", "cost tier", "in-service status"],
          distribution: {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `${SITE_URL}/data.json`
          },
          dateModified: schemaDates(s.asOf).dateModified
        }}
      />
    </>
  );
}
