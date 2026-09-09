import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Chip, Cta, JsonLd } from "@/components/ui";
import { Shot } from "@/components/Shot";
import ArticleSectionNav from "@/components/ArticleSectionNav";
import { AirlineLink } from "@/components/airline";
import {
  ArrowRight,
  ArrowUpRight,
  Author,
  Thumb,
  catLabel,
  fmtDate,
  type Post,
} from "@/components/blog-ui";
import { STARLINK_ACCESS_UI, starlinkRows, stats } from "@/lib/extension";
import { ARTICLES } from "@/lib/blog";
import { AUTHOR } from "@/lib/author";
import { codeForSlug } from "@/lib/slugs";
import { CHROME_STORE_URL, SITE_URL, og, clampDesc } from "@/lib/site";

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
      modifiedTime: article.date,
    }),
  };
}

const POSTS: Post[] = Object.entries(ARTICLES)
  .map(([s, article]) => ({ slug: s, ...article }))
  .sort((a, b) => b.date.localeCompare(a.date));

const clip = (text: string, n: number) => {
  if (text.length <= n) return text;
  const cut = text.slice(0, n);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

const headingId = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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
        throw new Error(
          `Article ${articleSlug} links to unknown airline slug: ${m[1]}`,
        );
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
        ),
      );
    }
  }
  return out;
}

function renderBold(text: string, keyPrefix: string) {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((seg, i) =>
      i % 2 === 1 ? <strong key={`${keyPrefix}b${i}`}>{seg}</strong> : seg,
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
              <td className="whitespace-nowrap">
                {STARLINK_ACCESS_UI[r.access].flying.label}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TooltipFigure() {
  return (
    <figure>
      <div className="card overflow-hidden">
        <Shot
          base="screenshot-tooltip"
          alt="FlightWifi tooltip on a Qatar Airways itinerary showing one leg as Varies by aircraft on a Boeing 787 and one leg as Fast enough for calls on an Airbus A350"
          width={1067}
          height={642}
          className="w-full"
        />
      </div>
      <figcaption className="mt-3 text-center text-sm text-[var(--muted)]">
        One trip, two verdicts: the 787 leg is mid-retrofit while the A350 leg
        is done. This is why per-aircraft data matters.
      </figcaption>
    </figure>
  );
}

function InlineCta() {
  return (
    <div className="sb-cta">
      <div>
        <strong>Want this on the flight you are about to book?</strong>
        <span>
          The free extension shows the verdict for the exact aircraft on Google
          Flights, Skyscanner and Soar.
        </span>
      </div>
      <a href={CHROME_STORE_URL} rel="noopener">
        Get the extension
        <ArrowUpRight />
      </a>
    </div>
  );
}

function renderBlocks(content: string[], slug: string) {
  const out: React.ReactNode[] = [];
  let items: string[] = [];
  let h2Count = 0;
  const flush = (key: string) => {
    if (!items.length) return;
    out.push(
      <ul key={key}>
        {items.map((item, j) => (
          <li key={j}>{renderInline(item, slug)}</li>
        ))}
      </ul>,
    );
    items = [];
  };
  content.forEach((block, i) => {
    if (block.startsWith("- ")) {
      items.push(block.slice(2));
      return;
    }
    flush(`ul${i}`);
    if (block === "{{starlink-table}}") out.push(<StarlinkTable key={i} />);
    else if (block === "{{image:tooltip}}") out.push(<TooltipFigure key={i} />);
    else if (block.startsWith("## ")) {
      const title = block.slice(3).trim();
      h2Count += 1;
      if (h2Count === 3) out.push(<InlineCta key={`cta${i}`} />);
      out.push(
        <h2 key={i} id={headingId(title)}>
          {title}
        </h2>,
      );
    } else if (block.startsWith("### ")) {
      out.push(<h3 key={i}>{block.slice(4).trim()}</h3>);
    } else out.push(<p key={i}>{renderInline(block, slug)}</p>);
  });
  flush("ul-end");
  return out;
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  const s = stats();
  const sections = article.content
    .filter((c) => c.startsWith("## "))
    .map((c) => ({ id: headingId(c.slice(3)), title: c.slice(3).trim() }));
  const railSections = article.faqs?.length
    ? [...sections, { id: "faqs", title: "Frequently asked questions" }]
    : sections;
  const idx = POSTS.findIndex((p) => p.slug === slug);
  const related = POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  const next = POSTS[(idx + 1) % POSTS.length];
  const post = { slug, ...article };

  return (
    <>
      <Breadcrumbs
        hidden
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog/" },
          {
            name: article.title.split(":")[0].split("?")[0],
            href: `/blog/${slug}/`,
          },
        ]}
      />
      <div className="soar">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8">
          <header className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_540px] lg:items-center lg:gap-[56px] lg:pt-20">
            <div>
              <p className="sb-kicker">{catLabel(article.category)}</p>
              <h1 className="sb-h1 mt-5">{article.title}</h1>
              <p className="sb-lead mt-6">{article.excerpt}</p>
              <div className="mt-9">
                <Author
                  detail={`Posted ${fmtDate(article.date)} · ${article.readTime} read`}
                />
              </div>
            </div>
            <div className="order-first aspect-[593/460] overflow-hidden rounded-[24px] lg:order-last">
              <Thumb post={post} eager />
            </div>
          </header>

          <div className="relative mt-16 lg:mt-20">
            <ArticleSectionNav sections={railSections} />
            <div className="mx-auto w-full max-w-[680px]">
              <div className="min-w-0">
                {railSections.length > 2 ? (
                  <nav
                    aria-label="On this page"
                    className="sb-card mb-10 px-5 py-4 text-sm lg:hidden"
                  >
                    <p className="sb-toc-label">On this page</p>
                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {railSections.map((sec) => (
                        <li key={sec.id}>
                          <a
                            href={`#${sec.id}`}
                            className="text-[13px] text-[var(--muted)] hover:text-[var(--ink)]"
                          >
                            {sec.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : null}

                <div className="sb-body">
                  {renderBlocks(article.content, slug)}
                </div>

                {article.faqs?.length ? (
                  <section className="sb-body" aria-labelledby="faqs">
                    <h2 id="faqs">Frequently asked questions</h2>
                    <div className="sb-faq">
                      {article.faqs.map((item) => (
                        <details
                          key={item.q}
                          name="faq"
                          className="fq border-b border-[var(--line)]"
                        >
                          <summary className="fq-sum -mx-3 flex cursor-pointer list-none items-start justify-between gap-3 rounded-xl px-3 py-5 sm:-mx-4 sm:gap-8 sm:px-4">
                            <h3 className="m-0 min-w-0 text-[17px] font-medium leading-snug text-[var(--ink)]">
                              {item.q}
                            </h3>
                            <span
                              aria-hidden="true"
                              className="fq-btn mt-px grid size-10 shrink-0 place-items-center rounded-full border"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </span>
                          </summary>
                          <div className="pb-6 sm:pr-[3.25rem]">
                            <p className="m-0 text-[16px] leading-[1.6] text-[var(--muted)]">
                              {item.a}
                            </p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>
          </div>

          <section className="mt-24 border-t border-[var(--line)] pt-14">
            <div className="grid gap-[14px] md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}/`}
                  className="sb-card group flex flex-col overflow-hidden !rounded-[12px]"
                >
                  <span className="block aspect-[384/145] overflow-hidden">
                    <Thumb post={p} eager />
                  </span>
                  <span className="flex flex-1 flex-col gap-4 p-4">
                    <span className="sb-kicker !text-[var(--muted)]">
                      {catLabel(p.category)}
                    </span>
                    <span className="flex items-center justify-between gap-4">
                      <span className="sb-related-title">
                        {p.title.split(":")[0].split("?")[0]}
                      </span>
                      <ArrowRight className="shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {next ? (
            <section className="my-16 border-t border-[var(--line)] pt-12">
              <Link
                href={`/blog/${next.slug}/`}
                className="group flex items-center justify-between gap-6 text-[var(--ink)] hover:no-underline"
              >
                <span>
                  <span className="sb-kicker !text-[var(--muted)]">
                    Read next
                  </span>
                  <span className="sb-next mt-3 block">
                    {next.title.split(":")[0].split("?")[0]}
                  </span>
                </span>
                <ArrowRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </section>
          ) : null}
        </div>
      </div>

      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          dateModified:
            `${s.asOf}-01` > article.date ? `${s.asOf}-01` : article.date,
          articleSection: article.category,
          image: article.image ? `${SITE_URL}${article.image}` : undefined,
          author: {
            "@type": "Person",
            "@id": `${SITE_URL}/blog/authors/${AUTHOR.slug}/#person`,
            name: AUTHOR.name,
            url: `${SITE_URL}/blog/authors/${AUTHOR.slug}/`,
          },
          publisher: { "@id": `${SITE_URL}/#org` },
          mainEntityOfPage: `${SITE_URL}/blog/${slug}/`,
        }}
      />
      {article.faqs?.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }}
        />
      ) : null}
    </>
  );
}
