import type { Metadata } from "next";
import { Breadcrumbs, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "FlightWifi collects no data of any kind, on this site or in the extension.",
  alternates: { canonical: "/privacy/" },
    openGraph: { url: "/privacy/" }
};

export default function Privacy() {
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Privacy", href: "/privacy/" }]} />
      <section className="mx-auto w-full max-w-[46rem] px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Privacy policy</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: 18 August 2026</p>
      </section>
      <div className="mx-auto w-full max-w-[46rem] px-5 py-8">
        <div className="prose">
          <h2>The extension</h2>
          <p>FlightWifi collects no data of any kind.</p>
          <ul>
            <li>No personal information, no account, no sign-up</li>
            <li>No analytics, no telemetry, no crash reporting</li>
            <li>No cookies and no stored state beyond the extension package itself</li>
            <li>No browsing history: it only runs on the flight search pages listed in its manifest</li>
          </ul>
          <p>
            All processing happens locally in your browser. The extension reads the flight
            information already displayed in your own tab, compares it against a wifi registry
            bundled inside the package, and draws a verdict chip. It makes no network requests of
            its own to any server, including ours; it has no server.
          </p>
          <h2>This website</h2>
          <p>
            The site is static pages. It sets no cookies, runs no third-party trackers, and hosts
            all assets itself.
          </p>
          <h2>Changes</h2>
          <p>
            If a future version of either ever changes any of the above, this policy and the Chrome
            Web Store disclosures will be updated before that version ships.
          </p>
          <h2>Contact</h2>
          <p>
            Questions: open an issue at{" "}
            <a href="https://github.com/Priyansh-Jain/flightWifi/issues">
              github.com/Priyansh-Jain/flightWifi
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
