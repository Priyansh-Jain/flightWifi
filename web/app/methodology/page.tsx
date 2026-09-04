import type { Metadata } from "next";
import { og } from "@/lib/site";
import Link from "next/link";
import { Breadcrumbs, Section } from "@/components/ui";
import { sourceTotals } from "@/lib/derive";
import { stats } from "@/lib/extension";

export const metadata: Metadata = {
  title: "Methodology: how the registry is compiled",
  description:
    "Airline and provider sources first, trade reporting named where it is used, in-service over announced, per-aircraft rules, and a paper trail for every claim.",
  alternates: { canonical: "/methodology/" },
    openGraph: og("/methodology/")
};

export default function Methodology() {
  const src = sourceTotals();
  const s = stats();
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Methodology", href: "/methodology/" }]} />
      <section className="mx-auto w-full max-w-[46rem] px-5 pt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Methodology</h1>
      </section>
      <div className="mx-auto w-full max-w-[46rem] px-5 py-8">
        <div className="prose">
          <p>
            The registry covers {s.airlines} airlines with {s.sources} source citations. Its rules
            are simple and strict, because a wrong verdict on a page like this costs someone a
            working day at 35,000 feet.
          </p>
          <h2>Where a claim comes from</h2>
          <p>
            A claim enters the registry from an airline's own pages and press releases, or from its
            connectivity provider's announcements (SpaceX, Viasat, Panasonic, Intelsat, SES, Anuvu,
            SITA). Those come first and outrank everything else.
          </p>
          <p>
            Some airlines publish nothing about wifi at all. For those, established aviation trade
            reporting is used rather than leaving the entry blank, and the airline's page says so
            in place of claiming an official source it does not have. Of {src.total} sources in the
            registry today, {src.official} are airline or provider publications and {src.trade} are
            trade reporting; {src.tradeOnly} airlines rest on trade reporting alone.
          </p>
          <p>
            Aggregator wifi guides and user reports are not sources: they are where the errors we
            correct come from.
          </p>
          <h2>In service beats announced</h2>
          <p>
            An announced deal never changes a verdict. Until a system carries passengers, the
            registry keeps reporting what actually flies today. This single rule is why our Starlink
            table disagrees with most others, and why it is right when they are not.
          </p>
          <h2>Per-aircraft rules</h2>
          <p>
            Airlines retrofit type by type and tail by tail, so each entry holds rules per aircraft
            type. When a type is genuinely split, the verdict says varies by aircraft rather than
            guessing. When we cannot verify, the verdict is not verified, never an estimate.
          </p>
          <h2>No speed numbers</h2>
          <p>
            Throughput depends on load and is not a property of a flight, so we never print
            megabits. Latency class is a property of the system's orbit, which is why verdicts are
            framed around what works: video calls on low orbit, email and browsing on high orbit.
          </p>
          <h2>Freshness</h2>
          <p>
            Every entry carries an as-of date (currently {s.asOf}) and entries with moving rollouts
            are flagged for re-verification. Corrections are welcome and acted on:{" "}
            <a href="https://github.com/Priyansh-Jain/flightWifi/issues">open an issue</a> with a
            source and the registry changes.
          </p>
          <h2>Open data</h2>
          <p>
            The full registry is published at <a href="/data.json">/data.json</a> under CC BY
            4.0. Cite it with a link back. The same file ships inside the extension, so this site
            and the chips can never disagree.
          </p>
        </div>
      </div>
    </>
  );
}
