import type { Metadata } from "next";
import Link from "next/link";
import { Chip, Cta, Faq, InstallButton, Section } from "@/components/ui";
import { AirlineLink } from "@/components/airline";
import { Shot } from "@/components/Shot";
import { STARLINK_ACCESS_UI, starlinkRows, stats } from "@/lib/extension";
import { TAGLINE, og } from "@/lib/site";

const VERDICTS = [
  { cls: "fast", label: "Video calls work", d: "Low-orbit satellite. Quick enough to be treated like ground wifi." },
  { cls: "ok", label: "Email & browsing", d: "High-orbit satellite. The lag is the limit, not the speed." },
  { cls: "ok", label: "Varies by aircraft", d: "Every plane has wifi, but only some carry the fast system." },
  { cls: "part", label: "Not on every aircraft", d: "Part of the fleet has no wifi, and the schedule will not say which plane you get." },
  { cls: "none", label: "No Wi-Fi", d: "No usable internet on this aircraft." },
  { cls: "unknown", label: "Not verified", d: "We would rather say nothing than guess." }
];

const FAQ = [
  {
    q: "Which airlines have Starlink Wi-Fi right now?",
    a: "As of August 2026, Starlink is flying with passengers on Qatar Airways, United, Emirates, Hawaiian, WestJet, SAS, Air France, Aer Lingus, Iberia, Virgin Atlantic (A350s), airBaltic, ZIPAIR, British Airways (five 787s), Southwest, Alaska, Copa, Gulf Air and more. Many of these are mid-retrofit, so whether your specific plane has it varies. Our Starlink tracker shows the in-service status per airline."
  },
  {
    q: "Can you make video calls on plane Wi-Fi?",
    a: "Only on low-orbit systems like Starlink, where latency is 20-50 ms. Traditional satellite wifi runs through geostationary satellites 36,000 km up, adding roughly 600 ms of lag, which breaks live calls even when bandwidth is fine. Some airlines also prohibit calls as policy even on fast wifi."
  },
  {
    q: "Why does the same airline have great Wi-Fi on one flight and none on another?",
    a: "Airlines announce deals fleet-wide but retrofit one aircraft at a time. United had about 522 of 1,817 aircraft converted as of mid-August 2026. Your ticket is for one specific aircraft, so on mid-rollout fleets the wifi is decided by which plane shows up."
  },
  {
    q: "Is airline Wi-Fi free?",
    a: "Increasingly yes, but usually behind a free loyalty sign-up: United (MileagePlus), Air France (Flying Blue), SAS (EuroBonus), Southwest (Rapid Rewards), Delta (SkyMiles). Qatar, Emirates, airBaltic, ZIPAIR and Aer Lingus make Starlink free for everyone. Legacy satellite wifi is still commonly paid."
  },
  {
    q: "Where does this data come from?",
    a: "Airlines' own pages and connectivity-provider announcements (SpaceX, Viasat, Panasonic, Intelsat, SES, Anuvu, SITA) come first, with established aviation trade reporting used to corroborate them and to cover the minority of carriers that publish nothing about wifi. Every airline page lists its own sources, says which kind they are, and carries a last-verified date."
  }
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
    openGraph: og("/")
};

export default function Home() {
  const s = stats();
  const live = starlinkRows().filter((r) => r.status === "flying");
  return (
    <>
      <section className="mx-auto w-full max-w-5xl px-5 pb-4 pt-16 text-center sm:pt-24">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          {TAGLINE.replace(".", "")}<span className="text-[var(--accent)]">.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">
          An airline announcing Starlink doesn't mean your flight has Starlink. Planes are upgraded
          one at a time, and your ticket is for one specific aircraft. We track what is actually
          flying, across {s.airlines} airlines, from the airlines and their connectivity providers.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <InstallButton />
          <Link
            href="/starlink/"
            className="rounded-full border border-[var(--line)] px-5 py-2.5 font-semibold hover:no-underline"
          >
            Starlink tracker
          </Link>
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">
          {s.airlines} airlines · {s.sources} cited sources · last verified {s.asOf}
        </p>
      </section>

      <Section>
        <div className="card overflow-hidden">
          <Shot
            base="screenshot-compare"
            alt="Five real Google Flights results shown twice. Without FlightWifi each row gives only times, stops and price. With FlightWifi each carries a verdict: Video calls work on airBaltic, Email and browsing on Turkish Airlines, Varies by aircraft on British Airways, Not on every aircraft on Air India, and No Wi-Fi on easyJet."
            width={1080}
            height={914}
            className="w-full"
            priority
          />
        </div>
        <p className="mt-3 text-center text-sm text-[var(--muted)]">
          Five real results, taken from three searches, before and after. Same rows, same prices.
          The only thing that changed is that you can now tell them apart.
        </p>
      </Section>

      <Section>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="card p-5">
            <p className="font-semibold">Every claim has a source</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {s.sources} citations across {s.airlines} airlines, listed on each airline&apos;s page
              with the date it was checked and whether it came from the airline or the trade press.{" "}
              <Link href="/methodology/">How it is compiled</Link>.
            </p>
          </div>
          <div className="card p-5">
            <p className="font-semibold">The data is open</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              The whole registry is published as <a href="/data.json">JSON under CC BY 4.0</a>,
              so you can check any verdict yourself rather than take ours.
            </p>
          </div>
          <div className="card p-5">
            <p className="font-semibold">No account, no tracking</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              The extension collects nothing at all and has no server to send anything to. The site
              counts page views with cookieless analytics: no cookies, no cross-site tracking, no
              personal data. <Link href="/privacy/">Privacy policy</Link>.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Every flight gets one of six honest verdicts">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VERDICTS.map((v) => (
            <div key={v.label} className="card p-4">
              <Chip cls={v.cls} label={v.label} />
              <p className="mt-2 text-sm text-[var(--muted)]">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Starlink, as actually installed">
        <p className="mb-4 max-w-2xl text-[var(--muted)]">
          {live.length} airlines are carrying passengers on Starlink today. Most are mid-retrofit, so
          it is the aircraft that decides. Press releases quote contracted totals; this table tracks
          what is in service.
        </p>
        <div className="card scroller">
          <table>
            <thead>
              <tr>
                <th>Airline</th>
                <th>Coverage</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {live.slice(0, 8).map((r) => (
                <tr key={r.code}>
                  <td className="font-medium">
                    <AirlineLink code={r.code} airline={r.airline} />
                  </td>
                  <td>
                    <Chip
                      cls={r.fleetwide ? "fast" : "ok"}
                      label={r.fleetwide ? "Whole fleet" : "Some aircraft"}
                    />
                  </td>
                  <td className="whitespace-nowrap">{STARLINK_ACCESS_UI[r.access].flying.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          <Link href="/starlink/">See all {live.length} airlines and every announced deal</Link>
        </p>
      </Section>

      <Section title="How the extension works">
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            ["Search flights normally", "Google Flights, Skyscanner or Soar. Nothing to configure."],
            ["We read the exact aircraft", "Each result names its plane, and the registry knows what that plane carries."],
            ["The verdict appears inline", "Next to each flight, before you book, with sources one hover away."]
          ].map(([t, d], i) => (
            <li key={t} className="card p-5">
              <p className="text-sm font-semibold text-[var(--accent)]">Step {i + 1}</p>
              <p className="mt-1 font-semibold">{t}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Faq items={FAQ} />
      <Cta />
    </>
  );
}
