import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { Breadcrumbs, Cta, Section, CollectionJsonLd } from "@/components/ui";
import { AIRCRAFT, aircraftAirlines } from "@/lib/derive";

export const metadata: Metadata = {
  title: "Airplane Wi-Fi by aircraft type",
  description:
    "Wi-Fi verdicts per aircraft: Boeing 777, 787, Airbus A350, A380 and more, across every airline that names the type in its rollout.",
  alternates: { canonical: "/aircraft/" },
    openGraph: og("/aircraft/")
};

export default function AircraftIndex() {
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Aircraft", href: "/aircraft/" }]} />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Wi-Fi by aircraft type
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Airlines retrofit type by type, so the aircraft on your boarding pass often says more about
          your Wi-Fi than the airline logo does.
        </p>
      </section>
      <Section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AIRCRAFT.map((a) => {
            const n = aircraftAirlines(a).length;
            return (
              <Link
                key={a.slug}
                href={`/aircraft/${a.slug}/`}
                className="card block p-5 text-[var(--ink)] hover:border-[var(--accent)] hover:no-underline"
              >
                <p className="font-bold">{a.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {n} airline{n === 1 ? "" : "s"} with type-specific verdicts
                </p>
              </Link>
            );
          })}
        </div>
      </Section>
      <CollectionJsonLd
        name="Wi-Fi by aircraft type"
        description="Wi-Fi by aircraft type on FlightWifi."
        path="/aircraft/"
        items={AIRCRAFT.map((a) => ({ name: a.name, href: `/aircraft/${a.slug}/` }))}
      />
      <Cta />
    </>
  );
}
