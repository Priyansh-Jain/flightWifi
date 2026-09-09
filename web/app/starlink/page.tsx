import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Breadcrumbs, Chip, Cta, JsonLd } from "@/components/ui";
import { FaqSection } from "@/components/Faq";
import { AirlineLink } from "@/components/airline";
import Checker from "@/components/Checker";
import { starlinkUpdates, stats } from "@/lib/extension";
import { schemaDates, shortDate, starlinkTableRows, type StarlinkTableRow } from "@/lib/derive";
import { CHROME_STORE_URL, SITE_LAUNCH, SITE_URL, og } from "@/lib/site";
import StarlinkTable from "./StarlinkTable";

export const metadata: Metadata = {
  title: "Starlink Wi-Fi on flights: who is flying it, and how far",
  description:
    "Which airlines fly Starlink today, which aircraft actually have it, and how far each rollout has got. In-service status per airline, not press releases.",
  alternates: { canonical: "/starlink/" },
  openGraph: og("/starlink/")
};

const EXAMPLES = ["QR702", "Qatar 777", "United 737", "Emirates A380", "airBaltic"];

// The comparison is the site's own verdict language, one row per thing a reader is deciding. Mid
// orbit is kept as its own column because collapsing it into "traditional satellite" would claim
// every non-Starlink system behaves like a geostationary one, which is not true of O3b mPOWER.
const ORBITS = [
  { k: "Where the satellites are", vals: ["Low orbit, about 550 km", "Mid orbit, about 8,000 km", "Geostationary, about 35,800 km"] },
  { k: "Typical latency", vals: ["20 to 50 ms", "120 to 150 ms", "600 ms and up"] },
  { k: "Video calls", cls: ["fast", "fast", "ok"], vals: ["Work", "Usually work", "Break on the lag"] },
  { k: "Email and browsing", cls: ["fast", "fast", "fast"], vals: ["Work", "Work", "Work"] },
  { k: "Who flies it", vals: ["Starlink, and OneWeb on multi-orbit fits", "SES O3b mPOWER", "Viasat, Panasonic, Intelsat, Inmarsat GX"] }
];

function list(names: string[]): string {
  if (names.length < 2) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

// Written from the rows rather than typed out, so the counts and the name lists cannot drift from
// the table above them the next time an airline moves from announced to flying.
function faqFor(rows: StarlinkTableRow[]) {
  const flying = rows.filter((r) => r.status === "flying");
  const announced = rows.filter((r) => r.status === "announced");
  const free = flying.filter((r) => r.access === "free");
  const whole = flying.filter((r) => r.fleetwide);
  const paid = flying.filter((r) => r.access === "paid");
  const counted = flying
    .filter((r) => r.pct !== null && !r.fleetwide)
    .sort((a, b) => a.pct! - b.pct!);
  const low = counted.slice(0, 3).map((r) => {
    const p = r.progress!;
    const of = typeof p.done === "number" && typeof p.of === "number" ? `${p.done} of ${p.of}` : `${r.pct}%`;
    return `${r.airline} at ${of}`;
  });
  return [
    {
      q: "Which airlines have Starlink Wi-Fi?",
      a: `${flying.length} airlines are carrying passengers on Starlink today: ${list(flying.map((r) => r.airline))}. Another ${announced.length} have signed a deal with nothing flying yet. The table on this page keeps those two apart and says how far each rollout has got.`
    },
    {
      q: "Does every aircraft at a Starlink airline have it?",
      a: `Almost never. ${whole.length ? `Only ${list(whole.map((r) => r.airline))} ${whole.length === 1 ? "has" : "have"} Starlink on every aircraft they fly.` : ""} Everywhere else the airline is mid-retrofit, ${list(low)}. Your ticket is for one specific aircraft, so on those fleets the tail that turns up decides what you get.`
    },
    {
      q: "Is Starlink Wi-Fi free on planes?",
      a: `Usually. ${free.length} of the ${flying.length} flying airlines make it free for every passenger: ${list(free.map((r) => r.airline))}. Most of the rest make it free behind a loyalty account that costs nothing to join, such as MileagePlus on United, Flying Blue on Air France or Rapid Rewards on Southwest.${paid.length ? ` ${list(paid.map((r) => r.airline))} ${paid.length === 1 ? "is the exception and sells" : "are the exceptions and sell"} access to most passengers.` : ""}`
    },
    {
      q: "Can you make Zoom or video calls on Starlink?",
      a: "The link can carry one: low orbit puts latency around 20 to 50 ms, which behaves like ground broadband. Whether you may is the airline's decision, not the satellite's. Several carriers running Starlink still prohibit voice and video calls in the cabin, so each airline page states its own policy alongside the verdict."
    },
    {
      q: "How do you verify which aircraft have Starlink?",
      a: "Claims come from the airline's own pages and press releases and from SpaceX, and an announced deal never counts as flying. Rollout counts are shown only where a named source published one, with a label saying whether it came from the airline, the trade press or a public tracker, and the date it was published. Where nobody has published a count, this page says the rollout is under way rather than estimating a number."
    }
  ];
}

export default function StarlinkPage() {
  const s = stats();
  const rows = starlinkTableRows();
  const flying = rows.filter((r) => r.status === "flying");
  const announced = rows.filter((r) => r.status === "announced");
  const rollout = flying
    .filter((r) => r.pct !== null && r.progress)
    .sort((a, b) => b.pct! - a.pct! || a.airline.localeCompare(b.airline));
  const noCount = flying.filter((r) => r.pct === null && !r.fleetwide);
  const updates = starlinkUpdates(8);
  const faq = faqFor(rows);

  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Starlink", href: "/starlink/" }]} />

      <section className="hero-band">
        <div className="mx-auto w-full max-w-[1200px] px-5 pb-14 pt-12 text-center sm:px-6 sm:pt-16 lg:px-8">
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Starlink Wi-Fi on flights
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">
            See which airlines are flying Starlink, which aircraft have it, and how far each rollout
            has progressed. Check a flight number, an airline or an aircraft for the answer on your
            own flight.
          </p>
          <Checker storeUrl={CHROME_STORE_URL} examples={EXAMPLES} />
          <p className="sl-stats mt-8">
            <span>
              <b>{flying.length}</b> airlines flying Starlink
            </span>
            <span>
              <b>{announced.length}</b> signed, not yet flying
            </span>
            <span>
              <b>{s.airlines}</b> airlines tracked
            </span>
            <span>
              <b>{s.sources}</b> cited sources
            </span>
            <span>Last verified {shortDate(s.asOf)}</span>
          </p>
        </div>
      </section>

      <section className="w-full border-t border-[var(--line)] py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Airlines flying Starlink</h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            {flying.length} airlines carry passengers on Starlink today, and {announced.length} more
            have signed a deal with nothing in the air yet. Coverage runs from two whole fleets down
            to single-figure retrofits, so the column that matters is how much of the fleet is
            actually converted.
          </p>
          <div className="mt-8">
            <StarlinkTable rows={rows} />
          </div>
        </div>
      </section>

      <section id="rollout" className="w-full border-t border-[var(--line)] py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Starlink rollout</h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            How far each airline has actually got, using the last count its source published. The
            label on each row says whether that number came from the airline, from trade reporting
            or from a public tracker, and what the count is measured against.
          </p>
          <div className="card mt-8 px-5 py-2 sm:px-6">
            {rollout.map((r) => {
              const p = r.progress!;
              const count =
                typeof p.done === "number" && typeof p.of === "number"
                  ? `${p.done} of ${p.of} aircraft`
                  : typeof p.done === "number"
                    ? `${p.done} aircraft`
                    : null;
              return (
                <div key={r.code} className="ro-row">
                  <p className="ro-name">
                    <AirlineLink code={r.code} airline={r.airline} />
                  </p>
                  <span className="ro-bar" role="img" aria-label={`${r.pct}% of the ${p.scope}`}>
                    <span
                      className={`ro-fill${r.pct! >= 100 ? " is-done" : ""}${p.basis === "tracker" ? " is-tracker" : ""}`}
                      style={{ width: `${Math.max(r.pct!, 2)}%` }}
                    />
                  </span>
                  <p className="ro-num">{r.pct}%</p>
                  <p className="ro-scope">
                    <span>
                      {count ? `${count} · ` : ""}
                      {p.scope}
                    </span>
                    <span className="ro-basis">
                      {p.basis === "tracker" ? "Tracker" : p.basis === "airline" ? "Airline" : p.basis === "provider" ? "Provider" : "Trade press"} ·{" "}
                      {shortDate(p.as_of)}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
          {noCount.length ? (
            <p className="mt-4 max-w-2xl text-sm text-[var(--muted)]">
              Flying, but no count published:{" "}
              {noCount.map((r, i) => (
                <span key={r.code}>
                  {i > 0 ? ", " : ""}
                  <AirlineLink code={r.code} airline={r.airline} />
                </span>
              ))}
              . Their aircraft are being converted with no published total, so no bar is drawn rather
              than an estimated one.
            </p>
          ) : null}
        </div>
      </section>

      <section className="w-full border-t border-[var(--line)] py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Why Starlink matters</h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Orbit height sets the lag, and the lag is what decides whether a live call holds. Speed
            is not the difference: a geostationary system can be fast and still break a call, and a
            mid-orbit one sits between the two.
          </p>
          <div className="card scroller mt-8">
            <div className="orb-grid" style={{ minWidth: "640px" }}>
              <div className="orb-h" />
              <div className="orb-h">Starlink (low orbit)</div>
              <div className="orb-h">Mid orbit</div>
              <div className="orb-h">High orbit (geostationary)</div>
              {ORBITS.map((row) => (
                <Fragment key={row.k}>
                  <div className="orb-k">{row.k}</div>
                  {row.vals.map((v, i) => (
                    <div key={`${row.k}-${i}`}>
                      {row.cls ? (
                        <span className="orb-v">
                          <span className={`dot dot-${row.cls[i]}`} aria-hidden="true" />
                          {v}
                        </span>
                      ) : (
                        v
                      )}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-[var(--muted)]">
            Throughput is not listed because it depends on how many people onboard are using it, so
            it is not a property of your flight. <Link href="/methodology/">Why we never quote megabits</Link>.
          </p>
        </div>
      </section>

      <section className="w-full border-t border-[var(--line)] py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Latest Starlink updates</h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            The dated changes behind the table above, newest first, each one linked to the source it
            came from.
          </p>
          <div className="card mt-8 px-5 py-2 sm:px-6">
            {updates.map((u) => (
              <div key={`${u.code}-${u.date}-${u.text.slice(0, 12)}`} className="upd">
                <p className="upd-date">{shortDate(u.date)}</p>
                <p>
                  <span className="upd-air">
                    <AirlineLink code={u.code} airline={u.airline} />
                  </span>{" "}
                  <span className="upd-text">{u.text}.</span>{" "}
                  {u.source ? (
                    <a href={u.source} rel="nofollow noopener" className="upd-src">
                      Source
                    </a>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection items={faq} title="Starlink questions." />

      <section className="w-full border-t border-[var(--line)] py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How we verify Starlink</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="vcard rounded-xl border p-5">
              <Chip cls="ok" label="In service, not announced" />
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                A signed deal never counts as flying. An airline moves to the flying list on the day
                a passenger aircraft carries the service, which is why {announced.length} carriers on
                this page are still listed as announced.
              </p>
            </div>
            <div className="vcard rounded-xl border p-5">
              <Chip cls="fast" label="Counts, not estimates" />
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                A rollout bar is drawn only where a named source published a figure. Each one shows
                whether it came from the airline, the trade press or a public tracker, and the date.
                {noCount.length ? ` ${noCount.length} flying airlines have no bar for that reason.` : ""}
              </p>
            </div>
            <div className="vcard rounded-xl border p-5">
              <Chip cls="part" label="Open data" />
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                Every airline on this page is one row of the registry, published as{" "}
                <a href="/data.json">open JSON</a> under CC BY 4.0 with sources per claim across all{" "}
                {s.airlines} airlines. <Link href="/methodology/">Full methodology</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Cta secondary={{ href: "/airlines/", label: "All airline Wi-Fi" }} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Airline Starlink deployment tracker",
          description:
            "In-service vs contracted Starlink status per airline and aircraft type, with published rollout counts, compiled from official airline and provider sources.",
          url: `${SITE_URL}/starlink/`,
          license: "https://creativecommons.org/licenses/by/4.0/",
          isAccessibleForFree: true,
          creator: { "@id": `${SITE_URL}/#org` },
          keywords: ["in-flight wifi", "Starlink", "airline connectivity", "aircraft wifi", "satellite internet"],
          temporalCoverage: `${SITE_LAUNCH}/..`,
          datePublished: SITE_LAUNCH,
          variableMeasured: [
            "airline",
            "aircraft type",
            "connectivity provider",
            "satellite orbit",
            "cost tier",
            "in-service status",
            "rollout progress"
          ],
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
