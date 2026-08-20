import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { Breadcrumbs, Cta, Section, CollectionJsonLd } from "@/components/ui";
import { PROVIDERS, providerAirlines } from "@/lib/derive";

export const metadata: Metadata = {
  title: "In-flight Wi-Fi providers",
  description:
    "Starlink, Viasat, Panasonic, Intelsat, SES, OneWeb, Kuiper and more: how each system works, its latency, and which airlines fly it.",
  alternates: { canonical: "/providers/" },
    openGraph: og("/providers/")
};

export default function ProvidersIndex() {
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Providers", href: "/providers/" }]} />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Who actually runs airline Wi-Fi
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          The airline sells it, but one of these systems delivers it, and the orbit it flies in
          decides whether your video call survives.
        </p>
      </section>
      <Section>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROVIDERS.map((p) => {
            const n = providerAirlines(p).length;
            return (
              <Link
                key={p.slug}
                href={`/providers/${p.slug}/`}
                className="card block p-5 text-[var(--ink)] hover:border-[var(--accent)] hover:no-underline"
              >
                <p className="font-bold">{p.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{p.orbit}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {p.latency} · {n} airline{n === 1 ? "" : "s"} in the registry
                </p>
              </Link>
            );
          })}
        </div>
      </Section>
      <CollectionJsonLd
        name="In-flight connectivity providers"
        description="In-flight connectivity providers on FlightWifi."
        path="/providers/"
        items={PROVIDERS.map((p) => ({ name: p.name, href: `/providers/${p.slug}/` }))}
      />
      <Cta />
    </>
  );
}
