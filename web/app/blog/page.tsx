import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Chip, Cta, JsonLd, Section } from "@/components/ui";
import { ARTICLES, type BlogArticle } from "@/lib/blog";
import { AIRCRAFT, PROVIDERS, monthLabel } from "@/lib/derive";
import { starlinkRows, stats } from "@/lib/extension";
import { SITE_URL, og } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Data-led writing on airline Wi-Fi: which airlines fly Starlink, which Wi-Fi is free, and whether you can work in the air. Every number comes from the registry.",
  alternates: { canonical: "/blog/" },
  openGraph: og("/blog/")
};

function CardArt({ art }: { art: BlogArticle["art"] }) {
  if (!art?.length) return null;
  return (
    <div className="flex min-h-[5.5rem] flex-wrap content-center items-center gap-2 rounded-xl bg-[var(--bg)] p-4">
      {art.map((a) => (
        <Chip key={a.label} cls={a.cls} label={a.label} />
      ))}
    </div>
  );
}

function niceDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${monthLabel(`${y}-${m}`)}`;
}

export default function BlogIndex() {
  const posts = Object.entries(ARTICLES).sort((a, b) => b[1].date.localeCompare(a[1].date));
  const [featSlug, feat] = posts[0];
  const s = stats();
  const flying = starlinkRows().filter((r) => r.status === "flying").length;

  const figures = [
    { n: String(s.airlines), l: "airlines audited" },
    { n: String(flying), l: "flying Starlink today" },
    { n: String(s.sources), l: "cited sources" },
    { n: monthLabel(s.asOf).replace(/ \d{4}$/, ""), l: `last verified, ${s.asOf.slice(0, 4)}` }
  ];

  const destinations = [
    {
      href: "/starlink/",
      title: "Starlink tracker",
      d: "In service versus signed, airline by airline.",
      meta: `${flying} flying now`
    },
    {
      href: "/airlines/",
      title: "Every airline",
      d: "One page per carrier, with the verdict per aircraft type.",
      meta: `${s.airlines} pages`
    },
    {
      href: "/aircraft/",
      title: "By aircraft",
      d: "The same plane carries different internet depending on who flies it.",
      meta: `${AIRCRAFT.length} types`
    },
    {
      href: "/providers/",
      title: "By provider",
      d: "How each satellite system works, and what its orbit costs you in lag.",
      meta: `${PROVIDERS.length} providers`
    }
  ];

  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog/" }]} />

      <section className="mx-auto w-full max-w-5xl px-5 pt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">FlightWifi Blog</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Data-led writing on what is actually flying. Every number here is generated from the same
          registry that powers the extension, so an article cannot quietly go stale.
        </p>
      </section>

      <Section>
        <div className="card grid overflow-hidden lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-4 p-7 sm:p-9">
            <span className="w-fit rounded-full border border-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
              Featured
            </span>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              <Link href={`/blog/${featSlug}/`} className="text-[var(--ink)] hover:no-underline">
                {feat.title}
              </Link>
            </h2>
            <p className="text-[var(--muted)]">{feat.excerpt}</p>
            <p className="text-sm text-[var(--muted)]">
              {feat.category} · {feat.readTime} read · {niceDate(feat.date)}
            </p>
            <Link href={`/blog/${featSlug}/`} className="w-fit font-semibold">
              Read the guide →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-[var(--line)] bg-[var(--line)] lg:border-l lg:border-t-0">
            {figures.map((f) => (
              <div key={f.l} className="flex flex-col justify-center gap-1 bg-[var(--bg-raised)] p-6">
                <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">{f.n}</span>
                <span className="text-sm text-[var(--muted)]">{f.l}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="All articles">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(([slug, p]) => (
            <Link
              key={slug}
              href={`/blog/${slug}/`}
              className="card flex flex-col gap-3 p-4 text-[var(--ink)] hover:border-[var(--accent)] hover:no-underline"
            >
              <CardArt art={p.art} />
              <p className="text-sm text-[var(--muted)]">
                {p.category} · {p.readTime} read
              </p>
              <p className="text-lg font-bold leading-snug">{p.title}</p>
              <p className="text-sm text-[var(--muted)]">{p.excerpt}</p>
              <p className="mt-auto pt-1 text-sm text-[var(--muted)]">{niceDate(p.date)}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Go straight to the data">
        <p className="mb-4 max-w-2xl text-[var(--muted)]">
          The articles are written from these pages. If you already know what you are looking for,
          skip the reading.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="card flex flex-col gap-1.5 p-5 text-[var(--ink)] hover:border-[var(--accent)] hover:no-underline"
            >
              <span className="font-semibold">{d.title}</span>
              <span className="text-sm text-[var(--muted)]">{d.d}</span>
              <span className="mt-auto pt-2 text-sm font-medium text-[var(--accent)]">{d.meta}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "FlightWifi Blog",
          url: `${SITE_URL}/blog/`,
          publisher: { "@id": `${SITE_URL}/#org` },
          blogPost: posts.map(([slug, p]) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.date,
            articleSection: p.category,
            url: `${SITE_URL}/blog/${slug}/`
          }))
        }}
      />
    </>
  );
}
