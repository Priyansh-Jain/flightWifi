import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { Breadcrumbs, Cta, Section, CollectionJsonLd } from "@/components/ui";
import { PROVIDERS, providerAirlines, type ProviderDef } from "@/lib/derive";

export const metadata: Metadata = {
  title: "In-flight Wi-Fi providers",
  description:
    "Starlink, Viasat, Panasonic, Intelsat, SES, OneWeb, Kuiper and more: how each system works, its latency, and which airlines fly it.",
  alternates: { canonical: "/providers/" },
    openGraph: og("/providers/")
};

type Outcome = { rank: number; cls: string[]; label: string; note: string };

// What a reader gets is decided by the orbit, not the brand, and this is the same mapping the
// verdict chips use, so the table cannot disagree with an airline page. Rank orders the table with
// the best outcome first; the flying count breaks ties so a constellation nobody is flying yet does
// not sit above the ones carrying passengers today.
function outcomeFor(p: ProviderDef, flying: number): Outcome {
  const o = p.orbit;
  if (/Medium Earth orbit/.test(o)) {
    return { rank: 1, cls: ["fast"], label: "Video calls usually work", note: `Mid orbit, ${p.latency.replace(" on MEO", "")}` };
  }
  if (/^Low Earth orbit/.test(o)) {
    return {
      rank: 0,
      cls: ["fast"],
      label: "Video calls work",
      note: flying ? `Low orbit, ${p.latency}` : "Low orbit, but not flying passengers yet"
    };
  }
  if (/multi-orbit/i.test(o)) {
    return { rank: 2, cls: ["ok", "fast"], label: "Depends on the fit", note: "Email and browsing everywhere; calls only on the newer multi-orbit installs" };
  }
  return { rank: 3, cls: ["ok"], label: "Email & browsing", note: "High orbit, and the lag breaks live calls" };
}

export default function ProvidersIndex() {
  const rows = PROVIDERS.map((p) => {
    const airlines = providerAirlines(p);
    const flying = airlines.filter((a) => a.inService).length;
    return { p, flying, total: airlines.length, out: outcomeFor(p, flying) };
  }).sort((a, b) => a.out.rank - b.out.rank || b.flying - a.flying || a.p.name.localeCompare(b.p.name));

  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Providers", href: "/providers/" }]} />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Who actually runs airline Wi-Fi
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          The airline sells it, but one of these systems delivers it, and the orbit it flies in
          decides whether your video call survives.
        </p>
      </section>

      <Section title="Which Wi-Fi systems are actually good?">
        <p className="-mt-2 mb-5 max-w-2xl text-[var(--muted)]">
          Outcome first. The brand on the seatback card matters less than how high its satellites
          sit, because height sets the lag and the lag is what decides a live call.
        </p>
        <div className="card scroller">
          <div className="orb-grid" style={{ minWidth: "680px" }}>
            <div className="orb-h">System</div>
            <div className="orb-h">Orbit</div>
            <div className="orb-h">What you get</div>
            <div className="orb-h">Flying with</div>
            {rows.map(({ p, flying, out }) => (
              <div key={p.slug} className="contents">
                <div>
                  <Link href={`/providers/${p.slug}/`} className="font-semibold text-[var(--ink)]">
                    {p.name}
                  </Link>
                </div>
                <div className="text-[var(--muted)]">{p.orbit.split(",")[0]}</div>
                <div>
                  <span className="orb-v">
                    <span className="flex shrink-0 gap-1">
                      {out.cls.map((c) => (
                        <span key={c} className={`dot dot-${c}`} aria-hidden="true" />
                      ))}
                    </span>
                    <span>
                      <span className="font-medium">{out.label}</span>
                      <span className="block text-sm text-[var(--muted)]">{out.note}</span>
                    </span>
                  </span>
                </div>
                <div className="text-[var(--muted)]">{flying ? `${flying} ${flying === 1 ? "airline" : "airlines"}` : "None yet"}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Every provider in the registry">
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
