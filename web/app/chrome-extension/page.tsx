import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Chip, Faq, JsonLd, Section } from "@/components/ui";
import { Shot } from "@/components/Shot";
import { stats } from "@/lib/extension";
import { CHROME_STORE_URL, SITE_URL, og, EXTENSION_VERSION } from "@/lib/site";

export const metadata: Metadata = {
  title: "FlightWifi Chrome extension: Wi-Fi verdicts on Google Flights",
  description:
    "Free extension that shows whether each flight's Wi-Fi handles video calls, per exact aircraft, inline on Google Flights, Skyscanner and Soar. Zero permissions, no tracking.",
  alternates: { canonical: "/chrome-extension/" },
    openGraph: og("/chrome-extension/")
};

const FAQ = [
  {
    q: "Is it free?",
    a: "Yes, completely. No account, no tier, no trial."
  },
  {
    q: "What does it collect about me?",
    a: "Nothing. The extension requests zero API permissions, makes no network requests of its own, and has no server. All matching happens locally against a registry bundled in the package."
  },
  {
    q: "Which sites does it work on?",
    a: "Google Flights (results, expanded cards and the booking page), Skyscanner, and soar.flights. The verdict follows the exact aircraft wherever the page names it."
  },
  {
    q: "Why do some flights say Varies by aircraft?",
    a: "Because that is the truth: on mid-retrofit fleets like United or Emirates, some planes of the same type carry the fast system and some carry the old one, and the schedule does not say which tail you will get."
  }
];

export default function ExtensionPage() {
  const s = stats();
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Chrome extension", href: "/chrome-extension/" }]} />
      <section className="mx-auto w-full max-w-5xl px-5 pt-10 text-center">
        <h1 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">
          The verdicts, where you book
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">
          FlightWifi adds one honest chip to every flight result: video calls work, email and
          browsing, varies by aircraft, or no Wi-Fi. Matched to the exact aircraft, sourced from
          official pages, computed entirely in your browser.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={CHROME_STORE_URL}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-ink)] no-underline hover:opacity-90 hover:no-underline"
          >
            Add to Chrome, free
          </a>
          <span className="text-sm text-[var(--muted)]">
            {s.airlines} airlines · zero permissions · no tracking
          </span>
        </div>
      </section>

      <Section>
        <div className="card overflow-hidden">
          <Shot
            base="screenshot-results"
            alt="FlightWifi verdict chips on Google Flights results"
            width={1067}
            height={642}
            className="w-full"
            priority
          />
        </div>
      </Section>

      <Section title="What it checks that airlines won't tell you">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Exact aircraft, not fleet averages", "A mid-rollout airline gets a per-plane answer, because that is how retrofits actually happen."],
            ["Call policy included", "Fast wifi where the airline bans calls says so: Fast, but no calls."],
            ["Trips roll up honestly", "A two-leg trip where one leg has nothing says Not on every aircraft, not a cheerful average."],
            ["Sources one hover away", "Every verdict's tooltip names the system, the rollout state and the official sources behind it."]
          ].map(([t, d]) => (
            <div key={t} className="card p-5">
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Verdicts it shows">
        <div className="flex flex-wrap gap-2">
          <Chip cls="fast" label="Video calls work" />
          <Chip cls="fast" label="Fast, but no calls" />
          <Chip cls="ok" label="Email & browsing" />
          <Chip cls="ok" label="Varies by aircraft" />
          <Chip cls="part" label="Not on every aircraft" />
          <Chip cls="none" label="No Wi-Fi" />
          <Chip cls="unknown" label="Not verified" />
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[var(--muted)]">
          The label system is deliberate: the first words name what varies, and no chip ever
          promises more than the sources support. When we don't know, it says so.
        </p>
      </Section>

      <Faq items={FAQ} title="Extension questions" />

      <Section>
        <p className="text-sm text-[var(--muted)]">
          Privacy in one line: the extension collects nothing, sends nothing, and has no server.
          Read the <Link href="/privacy/">full privacy policy</Link>, or the source on{" "}
          <a href="https://github.com/Priyansh-Jain/flightWifi">GitHub</a>.
        </p>
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "@id": `${SITE_URL}/chrome-extension/#app`,
          name: "FlightWifi",
          description:
            "A free Chrome extension that shows each flight's Wi-Fi verdict inline on Google Flights, Skyscanner and Soar, matched to the exact aircraft. Collects no data and makes no network requests.",
          operatingSystem: "Chrome",
          applicationCategory: "BrowserApplication",
          softwareVersion: EXTENSION_VERSION,
          screenshot: `${SITE_URL}/screenshot-results.jpg`,
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: CHROME_STORE_URL
          },
          url: `${SITE_URL}/chrome-extension/`,
          downloadUrl: CHROME_STORE_URL,
          publisher: { "@id": `${SITE_URL}/#org` }
        }}
      />
    </>
  );
}
