import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Chip, Cta, Faq, JsonLd } from "@/components/ui";
import { Shot } from "@/components/Shot";
import ArticleSectionNav from "@/components/ArticleSectionNav";
import { AirlineLink } from "@/components/airline";
import { STARLINK_ACCESS_UI, starlinkRows, stats } from "@/lib/extension";
import { ARTICLES } from "@/lib/blog";
import { codeForSlug } from "@/lib/slugs";
import { SITE_URL, og, clampDesc } from "@/lib/site";

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return {};
  return {
    title: article.seoTitle ?? article.title,
    description: clampDesc(article.excerpt),
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: og(`/blog/${slug}/`, {
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.date
    })
  };
}

const clip = (text: string, n: number) => {
  if (text.length <= n) return text;
  const cut = text.slice(0, n);
  return `${cut.slice(0, cut.lastIndexOf(" "))}\u2026`;
};

const headingId = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const LINK_RX = /\[([^\]]+)\]\(([^)]+)\)/g;

// Internal airline links are asserted against real slugs at build time, so a renamed carrier
// breaks the build instead of shipping a 404 inside an article.
function renderInline(text: string, articleSlug: string) {
  const withLinks = text.split(LINK_RX);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < withLinks.length; i += 3) {
    out.push(...renderBold(withLinks[i], `${i}`));
    const label = withLinks[i + 1];
    const href = withLinks[i + 2];
    if (label && href) {
      const m = href.match(/^\/airlines\/([a-z0-9-]+)\/$/);
      if (m && !codeForSlug(m[1])) {
        throw new Error(`Article ${articleSlug} links to unknown airline slug: ${m[1]}`);
      }
      out.push(
        href.startsWith("/") ? (
          <Link key={`l${i}`} href={href}>
            {label}
          </Link>
        ) : (
          <a key={`l${i}`} href={href}>
            {label}
          </a>
        )
      );
    }
  }
  return out;
}

function renderBold(text: string, keyPrefix: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((seg, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyPrefix}b${i}`} className="font-semibold">
        {seg}
      </strong>
    ) : (
      seg
    )
  );
}

function StarlinkTable() {
  const rows = starlinkRows().filter((r) => r.status === "flying");
  return (
    <div className="card scroller my-6">
      <table>
        <thead>
          <tr>
            <th>Airline</th>
            <th>Starlink today?</th>
            <th>Where it stands</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.code}>
              <td className="whitespace-nowrap font-medium">
                <AirlineLink code={r.code} airline={r.airline} />
              </td>
              <td>
                <Chip
                  cls={r.fleetwide ? "fast" : "ok"}
                  label={r.fleetwide ? "Whole fleet" : "Some aircraft"}
                />
              </td>
              <td className="text-[var(--muted)]">{clip(r.detail, 90)}</td>
              <td className="whitespace-nowrap">{STARLINK_ACCESS_UI[r.access].flying.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TooltipFigure() {
  return (
    <figure className="my-8">
      <div className="card overflow-hidden">
        <Shot
          base="screenshot-tooltip"
          alt="FlightWifi tooltip on a Qatar Airways itinerary showing one leg as Varies by aircraft on a Boeing 787 and one leg as Fast enough for calls on an Airbus A350"
          width={1067}
          height={642}
          className="w-full"
        />
      </div>
      <figcaption className="mt-2 text-center text-sm text-[var(--muted)]">
        One trip, two verdicts: the 787 leg is mid-retrofit while the A350 leg is done. This is why
        per-aircraft data matters.
      </figcaption>
    </figure>
  );
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  const s = stats();
  const sections = article.content
    .filter((c) => c.startsWith("## "))
    .map((c) => ({ id: headingId(c.slice(3)), title: c.slice(3).trim() }));
  const railSections = article.faqs?.length ? [...sections, { id: "faqs", title: "FAQs" }] : sections;

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog/" },
          { name: article.title.split(":")[0].split("?")[0], href: `/blog/${slug}/` }
        ]}
      />
      <ArticleSectionNav sections={railSections} />
      <article className="mx-auto w-full max-w-[46rem] px-5 pt-6">
        <header className="prose">
          <p className="text-sm text-[var(--muted)]">
            {article.category} · {article.date} · {article.readTime} read · data last verified {s.asOf}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)]">{article.excerpt}</p>
        </header>

        {sections.length > 2 ? (
          <nav aria-label="On this page" className="card mt-6 px-5 py-4 text-sm xl:hidden">
            <p className="mb-1.5 font-semibold">On this page</p>
            <ul className="grid gap-1 sm:grid-cols-2">
              {sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`}>{sec.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="prose">
          {article.content.map((block, i) => {
            if (block === "{{starlink-table}}") return <StarlinkTable key={i} />;
            if (block === "{{image:tooltip}}") return <TooltipFigure key={i} />;
            if (block.startsWith("## ")) {
              const title = block.slice(3).trim();
              return (
                <h2 key={i} id={headingId(title)}>
                  {title}
                </h2>
              );
            }
            return <p key={i}>{renderInline(block, slug)}</p>;
          })}
        </div>
      </article>

      {article.faqs?.length ? <Faq items={article.faqs} title="FAQs" id="faqs" /> : null}
      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          dateModified: `${s.asOf}-01` > article.date ? `${s.asOf}-01` : article.date,
          articleSection: article.category,
          author: { "@id": `${SITE_URL}/#org` },
          publisher: { "@id": `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/blog/${slug}/`,
          image: `${SITE_URL}/og.png`
        }}
      />
    </>
  );
}
