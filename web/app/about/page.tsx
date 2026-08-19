import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Section } from "@/components/ui";
import { CONTACT_EMAIL, GITHUB_URL, og } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why FlightWifi exists: a hand-audited registry of in-flight Wi-Fi across 235 airlines, sourced from the carriers and their connectivity providers.",
  alternates: { canonical: "/about/" },
  openGraph: og("/about/")
};

export default function About() {
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "About", href: "/about/" }]} />
      <section className="mx-auto w-full max-w-[46rem] px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">About FlightWifi</h1>
      </section>
      <div className="mx-auto w-full max-w-[46rem] px-5 py-8">
        <div className="prose">
          <p>
            FlightWifi exists because of a gap between what airlines announce and what their planes
            carry. Fleet-wide Starlink deals make headlines, but aircraft are converted one at a
            time, and no booking site tells you which plane you are getting. So travelers board
            expecting broadband and find a system from 2015, or a movie server with no internet at
            all.
          </p>
          <p>
            The project is one maker and one dataset: a hand-audited registry of in-flight Wi-Fi
            across 235 airlines, compiled under strict{" "}
            <Link href="/methodology/">sourcing rules</Link>. The free{" "}
            <Link href="/chrome-extension/">Chrome extension</Link> puts its verdicts inline on
            flight search results, and this site publishes the same data as pages anyone can read
            and cite.
          </p>
          <p>
            It is independent: no airline pays to be here, no affiliate placement changes a verdict,
            and the data is <a href="/data.json">open</a>.
          </p>
          <p>
            Corrections, questions, or a rollout we missed:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or{" "}
            <a href={GITHUB_URL}>GitHub</a>.
          </p>
        </div>
      </div>
    </>
  );
}
