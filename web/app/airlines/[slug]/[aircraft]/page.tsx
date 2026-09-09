import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Chip, Cta, Faq, JsonLd, Section, type QA } from "@/components/ui";
import { AirlineLink, SourceList } from "@/components/airline";
import { accessPoints, callPolicy, callPolicyText, capability, entryFor, type Entry } from "@/lib/extension";
import { monthLabel, schemaDates, sourceMix, sourceNote } from "@/lib/derive";
import { aircraftPageFor, allPairs, pairFor, pairHref, pairsFor, poss, sameAircraft, type Pair } from "@/lib/matrix";
import { codeForSlug } from "@/lib/slugs";
import { SITE_URL, og, clampDesc } from "@/lib/site";

export function generateStaticParams() {
  return allPairs().map((p) => ({ slug: p.airlineSlug, aircraft: p.family.slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string; aircraft: string }> };

function resolve(slug: string, aircraft: string): { pair: Pair; entry: Entry } | null {
  const code = codeForSlug(slug);
  const entry = code ? entryFor(code) : undefined;
  const pair = code ? pairFor(code, aircraft) : undefined;
  return entry && pair ? { pair, entry } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, aircraft } = await params;
  const r = resolve(slug, aircraft);
  if (!r) return {};
  const { pair } = r;
  return {
    title: `Does ${pair.airline} have Wi-Fi on the ${pair.family.name}?`,
    description: clampDesc(
      `${pair.verdict.label} on ${poss(pair.airline)} ${pair.family.name}. ${pair.verdict.why}. The system on board, whether it carries a video call, and what it costs, with sources.`
    ),
    alternates: { canonical: `/airlines/${slug}/${aircraft}/` },
    openGraph: og(`/airlines/${slug}/${aircraft}/`)
  };
}

function buildFaq(pair: Pair, entry: Entry): QA[] {
  const name = pair.airline;
  const own = poss(name);
  const ac = pair.family.name;
  const v = pair.verdict;
  const month = entry.as_of ? monthLabel(entry.as_of) : "our last check";
  const sentence = (t: string) => t.trim().replace(/[.;,]+$/, "");
  const prov = v.provider ? sentence(v.provider) : "";
  const system = !prov
    ? ""
    : v.key === "NONE"
      ? ` ${prov.charAt(0).toUpperCase()}${prov.slice(1)}.`
      : v.key === "UNKNOWN"
        ? ` What we have so far: ${prov}.`
        : ` The system on board: ${prov}.`;

  let has: string;
  switch (v.key) {
    case "NONE":
      has = `No. ${own} ${ac} carries no passenger internet as of ${month}.${system}`;
      break;
    case "PARTIAL":
      has = `On some of them. ${v.why}.${system}`;
      break;
    case "VARIES":
      has = `Yes, on every ${ac}, but not the same system on each. ${v.why}.${system}`;
      break;
    case "UNKNOWN":
      has = `We could not verify it. ${v.why}.${system}`;
      break;
    default:
      has = `Yes. ${own} ${ac} has Wi-Fi on board.${system}`;
  }

  const free = entry.access
    ? `${sentence(entry.access)}. These terms are ${own} fleet-wide policy; the ${ac} follows them.`
    : `${name} has not published pricing for its Wi-Fi.`;

  const policy = callPolicy(pair.code);
  let calls: string;
  if (v.key === "NONE") calls = `No, because ${own} ${ac} has no onboard internet.`;
  else if (v.key === "PARTIAL") calls = `Not reliably. Some ${ac}s in ${own} fleet have no wifi at all, and the ones that do run a system that is not fast enough for a live call.`;
  else if (v.key === "UNKNOWN") calls = `We cannot say. The system on ${own} ${ac} is not verified.`;
  else if (v.key === "GEO" || v.key === "A2G") calls = `Not reliably. ${own} ${ac} runs ${v.key === "A2G" ? "a ground-based network" : "high-orbit satellite wifi"}, where the lag breaks live calls even when browsing is fine.`;
  else if (policy?.calls === "no") calls = `The connection on ${own} ${ac} is fast enough, but ${name} ${policy.check ? "is reported to restrict" : "restricts"} voice and video calls as cabin policy.`;
  else if (policy?.calls === "voice") calls = `${name} permits voice calls on the ${ac}'s wifi, but not video calls.`;
  else if (v.key === "VARIES") calls = `Yes on the ${ac}s already converted to the fast system, where latency is close to home broadband. On the ones still running the older high-orbit system, no. Which one you get depends on the individual aircraft.`;
  else calls = `Yes. ${own} ${ac} runs a low-lag system, quick enough for a live video call.${policy ? "" : ` ${name} has not published a policy on calls, so bring headphones and expect to be asked to keep it short.`}`;

  return [
    { q: `Does ${name} have Wi-Fi on the ${ac}?`, a: has },
    { q: `Is ${name} Wi-Fi free on the ${ac}?`, a: free },
    { q: `Can you make video calls on ${own} ${ac}?`, a: calls }
  ];
}

export default async function PairPage({ params }: Props) {
  const { slug, aircraft } = await params;
  const r = resolve(slug, aircraft);
  if (!r) notFound();
  const { pair, entry } = r;
  const v = pair.verdict;
  const faq = buildFaq(pair, entry);
  const cap = capability(v.key);
  const policy = callPolicy(pair.code);
  const access = accessPoints(entry.access);
  const mix = sourceMix(entry);
  const siblings = pairsFor(pair.code).filter((p) => p.family.slug !== pair.family.slug);
  const peers = sameAircraft(pair.family, pair.code).slice(0, 8);
  const aircraftPage = aircraftPageFor(pair.family);
  const starlink = entry.starlink && entry.starlink.status !== "none" && /starlink/i.test(v.provider ?? "") ? entry.starlink : null;

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Airlines", href: "/airlines/" },
          { name: pair.airline, href: `/airlines/${slug}/` },
          { name: pair.family.name, href: `/airlines/${slug}/${aircraft}/` }
        ]}
      />
      <section className="mx-auto w-full max-w-5xl px-5 pt-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Does {pair.airline} have Wi-Fi on the {pair.family.name}?
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Chip cls={v.cls} label={v.label} />
          <span className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs text-[var(--ink)]">
            Aircraft-specific answer
          </span>
          {starlink ? (
            <span className="rounded-full border border-[var(--line)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
              {starlink.status === "flying" ? "Starlink, flying" : "Starlink announced, not yet flying"}
            </span>
          ) : null}
        </div>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{faq[0].a}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {mix.official ? "Sourced from official pages" : "Sourced from trade reporting"}
          {entry.needs_verification ? " · verification pending" : ""} · as of {entry.as_of}
        </p>
      </section>

      <Section title="What you can do on board">
        <div className="card grid gap-4 p-5 sm:grid-cols-2">
          {cap ? (
            <>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Good for</p>
                <ul className="mt-1.5 grid gap-1 text-[0.95rem]">
                  {cap.good.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Not for</p>
                <ul className="mt-1.5 grid gap-1 text-[0.95rem]">
                  {cap.bad.length ? cap.bad.map((b) => <li key={b}>{b}</li>) : <li>Nothing the link itself rules out</li>}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-[0.95rem] text-[var(--muted)] sm:col-span-2">{faq[2].a}</p>
          )}
          {policy ? (
            <p className="text-sm text-[var(--muted)] sm:col-span-2">
              Calls: {callPolicyText(policy.calls)}
              {policy.check ? " (reported, not confirmed by the airline)" : ""}.
            </p>
          ) : null}
        </div>
      </Section>

      <Section title={`The system on ${poss(pair.airline)} ${pair.family.name}`}>
        <div className="card grid gap-3 p-5 text-[0.95rem]">
          <p>{v.provider || "The registry does not name the system on this type."}</p>
          {v.latency ? <p className="text-sm text-[var(--muted)]">Latency: {v.latency}.</p> : null}
          {access.length ? (
            <ul className="grid gap-1.5 border-t border-[var(--line)] pt-3">
              {access.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="text-[var(--accent)]">·</span>
                  {a}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-sm text-[var(--muted)]">
            Cost and access are {poss(pair.airline)} fleet-wide terms; the verdict above is specific to the{" "}
            {pair.family.name}.
          </p>
        </div>
      </Section>

      {siblings.length ? (
        <Section title={`Other ${pair.airline} aircraft`}>
          <div className="card divide-y divide-[var(--line)]">
            {siblings.map((s) => (
              <Link
                key={s.family.slug}
                href={pairHref(s)}
                className="flex items-center justify-between gap-3 px-4 py-3 text-[var(--ink)] hover:no-underline"
              >
                <span className="font-medium">{s.family.name}</span>
                <Chip cls={s.verdict.cls} label={s.verdict.label} />
              </Link>
            ))}
          </div>
          <p className="mt-3 text-sm">
            <Link href={`/airlines/${slug}/`}>Everything about {pair.airline} Wi-Fi</Link>
          </p>
        </Section>
      ) : null}

      {peers.length ? (
        <Section title={`The ${pair.family.name} on other airlines`}>
          <div className="card scroller">
            <table>
              <thead>
                <tr>
                  <th>Airline</th>
                  <th>Verdict on this type</th>
                </tr>
              </thead>
              <tbody>
                {peers.map((p) => (
                  <tr key={p.code}>
                    <td className="whitespace-nowrap font-medium">
                      <Link href={pairHref(p)}>{p.airline}</Link>
                    </td>
                    <td>
                      <Chip cls={p.verdict.cls} label={p.verdict.label} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {aircraftPage ? (
            <p className="mt-3 text-sm">
              <Link href={aircraftPage}>Every airline on the {pair.family.name}</Link>
            </p>
          ) : null}
        </Section>
      ) : null}

      <Faq items={faq} title={`${pair.airline} ${pair.family.name} Wi-Fi questions`} />

      <Section title="Sources">
        <div className="card p-5">
          <SourceList entry={entry} />
          <p className="mt-3 text-sm text-[var(--muted)]">
            {sourceNote(entry)} See the <Link href="/methodology/">methodology</Link>.
          </p>
        </div>
      </Section>

      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${pair.airline} Wi-Fi on the ${pair.family.name}`,
          description: `${v.label} on ${poss(pair.airline)} ${pair.family.name}. ${v.why}.`,
          image: `${SITE_URL}/og.png`,
          ...schemaDates(entry.as_of ?? "2026-08"),
          author: { "@id": `${SITE_URL}/#org` },
          publisher: { "@id": `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/airlines/${slug}/${aircraft}/`,
          about: [
            { "@type": "Airline", name: pair.airline, iataCode: pair.code },
            { "@type": "Thing", name: `${pair.family.name} airliner` }
          ]
        }}
      />
      <p className="sr-only">
        <AirlineLink code={pair.code} airline={pair.airline} />
      </p>
    </>
  );
}
