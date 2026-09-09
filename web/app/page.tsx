import type { Metadata } from "next";
import Link from "next/link";
import { Chip, Cta, Section } from "@/components/ui";
import { FaqSection } from "@/components/Faq";
import { AirlineLink } from "@/components/airline";
import { ChromeMark } from "@/components/chrome";
import { CompareSlider } from "@/components/CompareSlider";
import Checker from "@/components/Checker";
import { STARLINK_ACCESS_UI, legsTip, starlinkRows, stats } from "@/lib/extension";
import { CHROME_STORE_URL, TAGLINE, og } from "@/lib/site";

const VERDICTS = [
  { cls: "fast", label: "Video calls work", t: "Low-orbit satellite.", d: "Quick enough to be treated like ground wifi, calls included.", icon: "video" },
  { cls: "ok", label: "Email & browsing", t: "High-orbit satellite.", d: "The lag is the limit, not the speed. Mail and pages load, live calls stutter.", icon: "mail" },
  { cls: "ok", label: "Varies by aircraft", t: "Same airline, two systems.", d: "Every plane has wifi, but only some carry the fast system. The aircraft decides.", icon: "shuffle" },
  { cls: "part", label: "Not on every aircraft", t: "Part of the fleet is dark.", d: "Some planes have no wifi, and the schedule will not say which one you get.", icon: "layers" },
  { cls: "none", label: "No Wi-Fi", t: "Nothing on board.", d: "No usable internet on this aircraft. Download before you fly.", icon: "wifi-off" },
  { cls: "unknown", label: "Not verified", t: "We would rather say nothing.", d: "No trustworthy source yet, so we do not guess and we say so.", icon: "help" }
];

const ICONS: Record<string, React.ReactNode> = {
  video: (
    <>
      <path d="m22 8-6 4 6 4V8Z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  shuffle: (
    <>
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
      <path d="m18 14 4 4-4 4" />
    </>
  ),
  layers: (
    <>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </>
  ),
  "wifi-off": (
    <>
      <path d="M12 20h.01" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
      <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
      <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
      <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
      <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
      <path d="m2 2 20 20" />
    </>
  ),
  "file-check": (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  braces: (
    <>
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
      <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
    </>
  ),
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  )
};

const FAQ = [
  {
    q: "Which airlines have Starlink Wi-Fi right now?",
    a: "As of August 2026, Starlink is flying with passengers on Qatar Airways, United, Emirates, Hawaiian, WestJet, SAS, Air France, Aer Lingus, Iberia, Virgin Atlantic (A350s), airBaltic, ZIPAIR, British Airways (five 787s), Southwest, Alaska, Copa, Gulf Air and more. Many of these are mid-retrofit, so whether your specific plane has it varies. Our Starlink page shows the in-service status and rollout progress per airline."
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

const CHIPS = [
  { x: 18.36, y: 10.56, w: 11.98, h: 5.63, legs: [{ code: "BT", aircraft: "Airbus A220-300 Passenger" }] },
  { x: 13.28, y: 30.56, w: 12.37, h: 5.54, legs: [{ code: "EY", aircraft: "Airbus A380" }] },
  { x: 13.57, y: 50.56, w: 12.27, h: 5.54, legs: [{ code: "SV", aircraft: "Boeing 777" }] },
  { x: 14.91, y: 70.56, w: 13.96, h: 5.54, legs: [{ code: "WY", aircraft: "Boeing 737" }, { code: "WY", aircraft: "Boeing 787" }] },
  { x: 14.13, y: 90.56, w: 8.04, h: 5.54, legs: [{ code: "U2", aircraft: "Airbus A319" }] }
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
    openGraph: og("/")
};

export default function Home() {
  const s = stats();
  const starlink = starlinkRows();
  const live = starlink.filter((r) => r.status === "flying");
  const announced = starlink.filter((r) => r.status === "announced");
  const freeForAll = live.filter((r) => r.access === "free");
  const starlinkCards = [...live]
    .sort((a, b) => Number(b.fleetwide) - Number(a.fleetwide) || a.airline.localeCompare(b.airline))
    .slice(0, 9);
  const hotspots = CHIPS.flatMap((c) => {
    const tip = legsTip(c.legs);
    return tip ? [{ x: c.x, y: c.y, w: c.w, h: c.h, tip }] : [];
  });
  return (
    <>
      <section className="hero-band">
        <div className="mx-auto w-full max-w-5xl px-5 pb-14 pt-16 text-center sm:pt-24">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {TAGLINE.replace(".", "")}<span className="text-[var(--accent)]">.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">
          An airline announcing Starlink does not mean your flight has it. Planes are upgraded one at a
          time, so the aircraft decides. Check a flight number, an airline or an aircraft and see the
          same Wi-Fi verdict FlightWifi shows while you search.
        </p>
        <Checker storeUrl={CHROME_STORE_URL} />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={CHROME_STORE_URL} rel="noopener" className="flare-btn">
            <span aria-hidden="true" className="flare-ring">
              <span className="flare-spin" />
              <span className="flare-heat" />
            </span>
            <ChromeMark size={16} />
            Get the free extension
          </a>
          <Link href="/starlink/" className="ghost-btn">
            Starlink on flights
          </Link>
        </div>
        <p className="mt-6 text-sm text-[var(--muted)]">
          {s.airlines} airlines · {s.sources} cited sources · last verified {s.asOf}
        </p>
        </div>
      </section>

      <Section title="Five real Google Flights results. Drag to see what the extension adds.">
        <div className="card overflow-hidden">
          <CompareSlider
            before="screenshot-without"
            after="screenshot-with"
            alt="Five real Google Flights results. Without FlightWifi each row gives only times, stops, emissions and price. With FlightWifi each carries a verdict: Video calls work on airBaltic, Email and browsing on Turkish Airlines, Varies by aircraft on British Airways, Not on every aircraft on Air India, and No Wi-Fi on easyJet."
            beforeLabel="Without FlightWifi"
            afterLabel="With FlightWifi"
            width={3072}
            height={1155}
          hotspots={hotspots}
        />
        </div>
        <p className="mt-3 text-center text-sm text-[var(--muted)]">
          Same flights. Same prices. The only difference: now you know the Wi-Fi.
        </p>
      </Section>

      <section className="w-full py-20 md:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="sec-title">Six verdicts. No guessing.</h2>
            <p className="mx-auto mt-5 max-w-[580px] text-base text-[var(--muted)]">
              Every flight gets one of six honest verdicts, decided by the exact aircraft on the route
              rather than by what the airline announced.
            </p>
          </div>
          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {VERDICTS.map((v) => (
              <li key={v.label} className="vcard rounded-xl border p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <span className={`vc v-${v.cls}`} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {ICONS[v.icon]}
                    </svg>
                  </span>
                  <Chip cls={v.cls} label={v.label} />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[var(--ink)]">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full border-t border-[var(--line)] py-20 md:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="sec-title">Starlink, as actually installed.</h2>
            <p className="mx-auto mt-5 max-w-[580px] text-base text-[var(--muted)]">
              {live.length} airlines are carrying passengers on Starlink today. Most are mid-retrofit,
              so it is the aircraft that decides. Press releases quote contracted totals. This tracks
              what is in service.
            </p>
            <dl className="mx-auto mt-10 grid max-w-[640px] grid-cols-3 gap-4">
              {[
                [live.length, "flying passengers today"],
                [announced.length, "announced, not yet flying"],
                [freeForAll.length, "free for every passenger"]
              ].map(([n, l]) => (
                <div key={String(l)} className="flex flex-col items-center gap-1.5">
                  <dt className="max-w-[170px] text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">{l}</dt>
                  <dd className="stat-num order-first">{n}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {starlinkCards.map((r) => (
              <li key={r.code} className="vcard rounded-xl border p-5 md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold tracking-[-0.02em] [&_a]:text-[var(--ink)]">
                    <AirlineLink code={r.code} airline={r.airline} />
                  </span>
                  <Chip cls={r.fleetwide ? "fast" : "ok"} label={r.fleetwide ? "Whole fleet" : "Some aircraft"} />
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">{STARLINK_ACCESS_UI[r.access].flying.label}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link href="/starlink/" className="ghost-btn wrap">
              See all {live.length} airlines and every announced deal
            </Link>
          </div>
        </div>
      </section>

      <section className="proof w-full border-t border-[var(--line)] py-20 md:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="sec-title">Built to be checked.</h2>
            <p className="mx-auto mt-5 max-w-[580px] text-base text-[var(--muted)]">
              Every verdict traces to a source you can open, the whole registry is yours to download,
              and the extension has nothing to send home.
            </p>
          </div>
          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            <li className="vcard rounded-xl border p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="vc v-ok" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS["file-check"]}
                  </svg>
                </span>
                <Chip cls="ok" label="Sourced" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[var(--ink)]">Every claim has a source.</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {s.sources} citations across {s.airlines} airlines, listed on each airline&apos;s page
                with the date it was checked and whether it came from the airline or the trade press.{" "}
                <Link href="/methodology/">How it is compiled</Link>.
              </p>
            </li>
            <li className="vcard rounded-xl border p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="vc v-part" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS.braces}
                  </svg>
                </span>
                <Chip cls="part" label="Open data" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[var(--ink)]">The data is open.</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                The whole registry is published as <a href="/data.json">JSON under CC BY 4.0</a>, so
                you can check any verdict yourself rather than take ours.
              </p>
            </li>
            <li className="vcard rounded-xl border p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="vc v-fast" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS.shield}
                  </svg>
                </span>
                <Chip cls="fast" label="Private" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[var(--ink)]">No account, no tracking.</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                The extension collects nothing at all and has no server to send anything to. The site
                counts page views with cookieless analytics, and a flight-number check sends only that
                number and date to a schedule provider. <Link href="/privacy/">Privacy policy</Link>.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <FaqSection items={FAQ} title="Frequently asked questions." />
      <Cta />
    </>
  );
}
