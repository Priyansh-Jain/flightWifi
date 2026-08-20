import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Chip, Cta, Faq, JsonLd, Section } from "@/components/ui";
import { AirlineLink } from "@/components/airline";
import { callRows, monthLabel, schemaDates } from "@/lib/derive";
import { stats } from "@/lib/extension";
import { SITE_URL, og, clampDesc } from "@/lib/site";

export const metadata: Metadata = {
  title: "Which airlines let you take a call on board?",
  description:clampDesc(
    "Whether the link can carry a call and whether the airline permits one are different questions. Both, airline by airline, for every carrier that publishes a policy."
    ),
  alternates: { canonical: "/calls/" },
  openGraph: og("/calls/")
};

const POLICY_UI = {
  yes: { label: "Calls allowed", cls: "fast" },
  voice: { label: "Voice only, no video", cls: "ok" },
  no: { label: "Calls not allowed", cls: "part" }
} as const;

export default function CallsPage() {
  const rows = callRows();
  const s = stats();
  const month = monthLabel(s.asOf);
  const allowed = rows.filter((r) => r.policy === "yes");
  const fastEnough = rows.filter((r) => r.fastEnough);
  const official = rows.filter((r) => !r.reported).length;

  const faqs = [
    {
      q: "Can you make phone calls on a plane?",
      a: `Rarely, and for two separate reasons. Of the ${rows.length} airlines that publish a policy, only ${allowed.length} permit voice and video calls: ${allowed.map((r) => r.airline).join(", ")}. Separately, only ${fastEnough.length} of those ${rows.length} fly a connection quick enough to carry a live call at all. A fast link on an airline that bans calls gets you nowhere, and permission on a high-orbit link gets you a call that will not hold.`
    },
    {
      q: "Why do airlines ban calls if the Wi-Fi is fast enough?",
      a: "Because it is a cabin-comfort rule, not a technical limit. Low-orbit systems like Starlink carry a video call fine, and several carriers still prohibit voice and video over Wi-Fi as a term of carriage so that the cabin stays quiet."
    },
    {
      q: "Can you use WhatsApp or iMessage on a plane?",
      a: "Usually yes, even where calls are banned. Most airlines that prohibit voice and video still allow messaging, and many sell a messaging-only tier as their free option. The ban is specific to live audio and video."
    }
  ];

  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Calls", href: "/calls/" }]} />
      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Which airlines let you take a call on board?
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Two things have to be true before you can take a call at 35,000 feet: the connection has
          to be quick enough to hold one, and the airline has to permit it. As of {month}, of the{" "}
          {rows.length} airlines that publish a policy, {fastEnough.length} fly a link fast enough
          and only {allowed.length} allow the call.
        </p>
      </section>

      <Section title={`Stated policies (${rows.length})`}>
        <div className="card scroller">
          <table>
            <thead>
              <tr>
                <th>Airline</th>
                <th>Policy</th>
                <th>Source</th>
                <th>Is the link fast enough?</th>
                <th>Fleet verdict</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.code}>
                  <td className="whitespace-nowrap font-medium">
                    <AirlineLink code={r.code} airline={r.airline} />
                  </td>
                  <td>
                    <Chip cls={POLICY_UI[r.policy].cls} label={POLICY_UI[r.policy].label} />
                  </td>
                  <td className="whitespace-nowrap text-sm text-[var(--muted)]">
                    {r.reported ? "Reported" : "Airline's own page"}
                  </td>
                  <td className="text-[var(--muted)]">
                    {r.fastEnough ? "Yes, on the fast-equipped aircraft" : "No, high-orbit only"}
                  </td>
                  <td>
                    <Chip cls={r.cls} label={r.label} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="What this list does not cover">
        <p className="max-w-2xl text-[var(--muted)]">
          {s.airlines - rows.length} of the {s.airlines} airlines in the registry publish no call
          policy at all. Absent means unknown here, never permitted. Of the {rows.length} rows
          above, {official} come from the airline&apos;s own page or contract of carriage and the
          rest are marked <em>reported</em>, meaning the policy is consistently described in
          aviation reporting but we could not retrieve the carrier&apos;s own wording. The{" "}
          <Link href="/methodology/">methodology</Link> explains the distinction, and the underlying
          data is <a href="/data.json">open</a>.
        </p>
      </Section>

      <Faq items={faqs} title="Calls on planes: questions" />
      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Which airlines let you take a call on board?",
          description:
            "Per-airline voice and video call policy, paired with whether the aircraft's connection could carry a call at all.",
          image: `${SITE_URL}/og.png`,
          ...schemaDates(s.asOf),
          author: { "@id": `${SITE_URL}/#org` },
          publisher: { "@id": `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/calls/`
        }}
      />
    </>
  );
}
