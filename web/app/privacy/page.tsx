import type { Metadata } from "next";
import { og } from "@/lib/site";
import { Breadcrumbs, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "FlightWifi collects no data of any kind in the extension, and on this site only what you type into the flight checker.",
  alternates: { canonical: "/privacy/" },
    openGraph: og("/privacy/")
};

export default function Privacy() {
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Privacy", href: "/privacy/" }]} />
      <section className="mx-auto w-full max-w-[46rem] px-5 pt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy policy</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: 3 September 2026</p>
      </section>
      <div className="mx-auto w-full max-w-[46rem] px-5 py-8">
        <div className="prose">
          <h2>The extension</h2>
          <p>FlightWifi collects no data of any kind.</p>
          <ul>
            <li>No personal information, no account, no sign-up</li>
            <li>No analytics, no telemetry, no crash reporting</li>
            <li>No cookies. The only thing it stores is your per-site on/off switches, on this device</li>
            <li>No browsing history: it only runs on the flight search pages listed in its manifest</li>
          </ul>
          <p>
            All processing happens locally in your browser. The extension reads the flight
            information already displayed in your own tab, compares it against a wifi registry
            bundled inside the package, and draws a verdict chip. While you browse it makes no
            network requests of its own to any server, including ours; it has no server.
          </p>
          <p>
            There is one moment it reaches our site, and it is the moment it stops running: if you
            uninstall the extension, Chrome opens a page here that asks why, carrying only the
            version number you had. That is a plain page load. Answering is optional, and nothing in
            it is tied to you or to anything you searched for.
          </p>
          <h3>Permissions</h3>
          <p>
            The extension asks Chrome for three permissions. None of them reads, stores or sends
            anything about you, and none of them shows an install warning.
          </p>
          <ul>
            <li>
              The storage permission keeps your per-site on/off switches for Google Flights,
              Skyscanner and Soar on this device. That is the only thing it stores.
            </li>
            <li>
              The activeTab and scripting permissions let the toolbar popup restart the extension on
              a flight search tab that was already open when the extension last updated, so you do
              not have to reload the page. They apply only to the tab you clicked the icon on, only
              at that moment, and never grant standing access to any site.
            </li>
          </ul>
          <p>
            Beyond that, its only access is the content scripts that run on the flight search pages
            listed in its manifest.
          </p>
          <h2>This website</h2>
          <p>
            The pages are static files served from this domain. The one exception to &ldquo;nothing
            runs here&rdquo; is page-view counting, added on 19 August 2026 using Vercel Web
            Analytics.
          </p>
          <p>It is cookieless. Specifically, it:</p>
          <ul>
            <li>sets no cookies and stores nothing on your device</li>
            <li>does not follow you across other sites, and builds no profile of you</li>
            <li>collects no personal information and no account is involved</li>
          </ul>
          <p>
            What it does record is the page you viewed, the site that referred you, and coarse
            device and country information, so we can see which pages people find useful. Nothing
            about it is shared with advertisers, because there are none.
          </p>
          <p>
            The uninstall page adds one counter to that same tool: which of the listed reasons was
            chosen, and the extension version it was chosen from. It is a tally and nothing more,
            with no way to trace a choice back to a person.
          </p>
          <p>
            That form also has an optional box for writing what went wrong. Only what you type there
            is sent, only when you press Submit, and only alongside the reason and the version.
            Leave it empty and the tally is all that is recorded. A written note is delivered into a
            private Google Sheet we own, so Google holds it as our storage provider and nothing
            about you is attached to it beyond what you typed. If that delivery is not set up or
            fails, the note opens as a draft in your own mail app instead, in which case it reaches
            us only once you send it and then carries your address the way any email does.
          </p>
          <h3>Checking a flight number</h3>
          <p>
            The checker on the homepage answers airline and aircraft questions entirely in your
            browser, from a copy of the registry it downloads once. A flight number is different,
            because we do not hold airline schedules. If you type one, the flight number and the
            date you pick are sent to our server, which asks AeroDataBox, a flight-schedule
            provider, which aircraft is planned for that flight. That is the whole request: no
            cookies, no account, no identifier of yours travels with it. Our server keeps the answer
            for up to a day, keyed only by the flight number and date, so the same lookup is not
            repeated. AeroDataBox sees the request as coming from our server and handles it under
            its own privacy policy.
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
