import type { Metadata } from "next";
import { og } from "@/lib/site";
import { Breadcrumbs, CollectionJsonLd, Cta, Section } from "@/components/ui";
import { searchIndex } from "@/lib/derive";
import { slugForCode } from "@/lib/slugs";
import { stats } from "@/lib/extension";
import AirlineDirectory from "./AirlineDirectory";

export const metadata: Metadata = {
  title: "Airline Wi-Fi directory: every airline's verdict",
  description:
    "Does your airline have Wi-Fi, and is it fast enough to work on? Verdicts for 235 airlines from official sources, updated continuously.",
  alternates: { canonical: "/airlines/" },
    openGraph: og("/airlines/")
};

export default function AirlinesIndex() {
  const s = stats();
  const rows = searchIndex().map((r) => ({ ...r, slug: slugForCode(r.code) }));
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Airlines", href: "/airlines/" }]} />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Airline Wi-Fi directory</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          One page per airline: provider, cost, per-aircraft coverage and whether a video call will
          survive. {s.airlines} airlines, {s.sources} official sources, last verified {s.asOf}.
        </p>
      </section>
      <Section>
        <AirlineDirectory rows={rows} />
      </Section>
      <CollectionJsonLd
        name="Airline Wi-Fi directory"
        description={`Wi-Fi verdicts for ${s.airlines} airlines, one page each.`}
        path="/airlines/"
        items={rows.map((r) => ({ name: r.airline, href: `/airlines/${r.slug}/` }))}
      />
      <Cta />
    </>
  );
}
