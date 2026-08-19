import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { Breadcrumbs, Cta, Section, CollectionJsonLd } from "@/components/ui";
import { COMPARISONS } from "@/lib/derive";

export const metadata: Metadata = {
  title: "Airline Wi-Fi comparisons",
  description:
    "Side-by-side Wi-Fi comparisons for airlines that compete on the same routes: Qatar vs Emirates, United vs Delta and more.",
  alternates: { canonical: "/compare/" },
    openGraph: og("/compare/")
};

export default function CompareIndex() {
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Compare", href: "/compare/" }]} />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Wi-Fi, airline vs airline
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          When two carriers fly the same route for the same price, the Wi-Fi is often the real
          difference. These comparisons render live from the registry.
        </p>
      </section>
      <Section>
        <div className="grid gap-3 sm:grid-cols-2">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}/`}
              className="card block p-5 font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:no-underline"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </Section>
      <CollectionJsonLd
        name="Airline Wi-Fi comparisons"
        description="Airline Wi-Fi comparisons on FlightWifi."
        path="/compare/"
        items={COMPARISONS.map((c) => ({ name: c.title, href: `/compare/${c.slug}/` }))}
      />
      <Cta />
    </>
  );
}
