import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui";
import { CONTACT_EMAIL, GITHUB_URL, og } from "@/lib/site";
import { stats } from "@/lib/extension";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Report a wrong Wi-Fi verdict, a rollout we missed, or an airline we do not cover yet. Corrections are the fastest way to improve the registry.",
  alternates: { canonical: "/contact/" },
  openGraph: og("/contact/")
};

export default function Contact() {
  const s = stats();
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Contact", href: "/contact/" }]} />
      <section className="mx-auto w-full max-w-[46rem] px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Contact</h1>
      </section>
      <div className="mx-auto w-full max-w-[46rem] px-5 py-8">
        <div className="prose">
          <p>
            The registry covers {s.airlines} airlines and changes as fleets are retrofitted, so the
            most valuable thing you can send is a correction.
          </p>
          <h2>Reporting a wrong verdict</h2>
          <p>
            Include the airline, the aircraft type, and where you saw something different. A link to
            the airline&apos;s own page or its connectivity provider&apos;s announcement is enough to
            get the entry changed the same day, because that is the standard every claim in the
            registry has to meet. See the <Link href="/methodology/">methodology</Link> for what
            counts as a source.
          </p>
          <h2>Everything else</h2>
          <ul>
            <li>
              Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
            <li>
              Issues and pull requests: <a href={`${GITHUB_URL}/issues`}>GitHub</a>
            </li>
            <li>
              Using the data in your own project: it is{" "}
              <a href="/data.json">open under CC BY 4.0</a>, no permission needed, a link back
              is appreciated.
            </li>
          </ul>
          <p>
            There is no contact form and no mailing list, because the site collects nothing. See the{" "}
            <Link href="/privacy/">privacy policy</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
