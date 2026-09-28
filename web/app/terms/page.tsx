import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, GITHUB_URL, og } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "What FlightWifi is, what its Wi-Fi verdicts do and do not promise, and the terms for using the site, the extension and the data.",
  alternates: { canonical: "/terms/" },
  openGraph: og("/terms/")
};

export default function Terms() {
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Terms", href: "/terms/" }]} />
      <section className="mx-auto w-full max-w-[46rem] px-5 pt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Terms of use</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: 23 September 2026</p>
      </section>
      <div className="mx-auto w-full max-w-[46rem] px-5 py-8">
        <div className="prose">
          <h2>What FlightWifi is</h2>
          <p>
            FlightWifi is a free website and a free browser extension. Both answer one question for
            an airline or an aircraft type: what Wi-Fi to expect on board, whether it exists, who
            provides it, whether it is free, and whether it is quick enough for a video call. The
            answers come from a hand-audited registry compiled from airline pages, provider
            announcements and trade press under the rules on the{" "}
            <Link href="/methodology/">methodology page</Link>. By using the site, the extension or
            the data you agree to these terms.
          </p>

          <h2>Verdicts are information, not a promise</h2>
          <p>
            A verdict describes an aircraft type, not the individual plane you will board. Airlines
            swap aircraft, change providers and change prices, and a verdict is only as current as
            the check date shown on its page. We do not guarantee that any flight will have Wi-Fi,
            that it will work, or that it will be free. Before you depend on it, for a call you
            cannot miss or a fare you would not otherwise buy, confirm with the airline. We are not
            liable for a booking, a purchase of onboard Wi-Fi, or any other decision made on the
            strength of a verdict.
          </p>
          <p>
            When you check a flight number, the aircraft shown is the one planned in the schedule
            on that day. Airlines change planned aircraft up to departure, and the verdict changes
            with it.
          </p>

          <h2>The extension</h2>
          <p>
            The extension reads flight information on the flight search pages listed in its
            manifest (on Skyscanner it also asks Skyscanner for the details of the flights shown)
            and adds a verdict beside each result. It is provided as is. It
            can stop working when one of those sites changes its layout, and we may update it
            through your browser&rsquo;s extension store to keep it working. You can remove it at
            any time from your browser. What it collects is set out on the{" "}
            <Link href="/privacy/">privacy page</Link>: nothing.
          </p>
          <p>
            FlightWifi is independent. It is not affiliated with, endorsed by or connected to
            Google, Skyscanner, Soar, any airline or any connectivity provider.
          </p>

          <h2>Using the site and the data</h2>
          <p>
            You may read, quote and cite any page, and build on the published data, with a link
            back to the page you used. Automated access is welcome through the documented routes,
            the <a href="/data.json">registry JSON</a>, <a href="/llms.txt">llms.txt</a> and the{" "}
            <Link href="/mcp/">MCP server</Link>, within the rate limits they publish. Ask before
            redistributing the registry as a whole, and never present FlightWifi data as an
            airline&rsquo;s official statement. Do not use the site or the extension for anything
            unlawful, or in a way that degrades them for other people.
          </p>

          <h2>Other sites</h2>
          <p>
            Pages link to airline and provider sites, to the Chrome Web Store and to GitHub. Those
            sites have their own terms and we do not control them. If a page ever carries an
            affiliate link it is labelled as one, and it never changes a verdict.
          </p>

          <h2>No warranty and limits on liability</h2>
          <p>
            The site, the extension and the data are provided as is and as available, without
            warranties of any kind, express or implied, including accuracy, fitness for a
            particular purpose and uninterrupted availability. To the maximum extent the law
            allows, FlightWifi and its maker are not liable for any indirect, incidental,
            consequential or special loss arising from their use, and total liability for any claim
            is limited to the amount you have paid for them, which is nothing. Some jurisdictions do
            not allow these exclusions, in which case they apply to the extent permitted.
          </p>

          <h2>Changes</h2>
          <p>
            These terms may change. The date at the top is updated when they do, and continued use
            after a change means you accept it.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or
            open an issue at <a href={`${GITHUB_URL}/issues`}>github.com/Priyansh-Jain/flightWifi</a>.
          </p>
        </div>
      </div>
    </>
  );
}
