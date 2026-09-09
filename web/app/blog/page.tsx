import type { Metadata } from "next";
import Link from "next/link";
import { Cta, JsonLd } from "@/components/ui";
import { ARTICLES } from "@/lib/blog";
import { ArrowRight, Author, CATEGORY_META, GoogleMark, PostCard, Thumb, blogHref, fmtDate, type Post } from "@/components/blog-ui";
import { SITE_URL, og } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Data-led writing on airline Wi-Fi: which airlines fly Starlink, which Wi-Fi is free, how to connect, and whether you can work in the air. Every number comes from the registry.",
  alternates: { canonical: "/blog/" },
  openGraph: og("/blog/")
};

const POSTS: Post[] = Object.entries(ARTICLES)
  .map(([slug, article]) => ({ slug, ...article }))
  .sort((a, b) => b.date.localeCompare(a.date));

const PER_PAGE = 6;

export default async function BlogIndex({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const sp = await searchParams;
  const activeEntry = Object.entries(CATEGORY_META).find(([, m]) => m.param === sp.category);
  const activeCategory = activeEntry?.[0];
  const filtered = activeCategory ? POSTS.filter((p) => p.category === activeCategory) : POSTS;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(totalPages, Math.max(1, parseInt(sp.page ?? "1", 10) || 1));
  const posts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const [featured] = POSTS;
  const categories = Object.entries(CATEGORY_META)
    .map(([category, meta]) => ({ category, ...meta, count: POSTS.filter((p) => p.category === category).length }))
    .filter((c) => c.count > 0);

  return (
    <>
      <div className="soar">
        <h1 className="sr-only">FlightWifi Blog</h1>

        <div className="mx-auto w-full max-w-[1200px] px-5 pt-6 sm:px-6 sm:pt-10 lg:px-8">
          <section className="sb-card sb-post overflow-hidden">
            <div className="grid lg:grid-cols-[46%_54%]">
              <div className="sb-panel flex flex-col px-7 py-8 sm:px-[51px] sm:py-[60px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="sb-pill">Featured article</span>
                  <span className="sb-meta">Posted {fmtDate(featured.date)}</span>
                </div>
                <h2 className="mt-7 text-[32px] leading-[1.04] tracking-[-0.035em] text-[var(--ink)] sm:text-[42px]">
                  <Link href={`/blog/${featured.slug}/`} className="sb-title-link sb-stretch">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-5 line-clamp-3 text-[16px] leading-[1.55] text-[var(--muted)]">{featured.excerpt}</p>
                <div className="mt-7">
                  <Author detail={`${featured.readTime} read`} />
                </div>
                <Link href={`/blog/${featured.slug}/`} className="sb-link relative z-[2] mt-auto w-fit pt-10">
                  Read the guide
                  <ArrowRight />
                </Link>
              </div>
              <div className="order-first min-h-[240px] overflow-hidden lg:order-last lg:min-h-[430px]">
                <Thumb post={featured} eager />
              </div>
            </div>
          </section>

          <div className="mt-9 flex justify-center">
            <a
              href="https://www.google.com/preferences/source?q=flightwifi.app"
              target="_blank"
              rel="noreferrer"
              className="sb-google"
            >
              <GoogleMark />
              Add FlightWifi to Preferred Sources
            </a>
          </div>

          <section className="mt-24 sm:mt-28">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-[36px] leading-[1.04] tracking-[-0.035em] text-[var(--ink)] sm:text-[48px]">Explore by category</h2>
              <p className="max-w-[490px] text-[16px] leading-[1.55] text-[var(--muted)]">
                From the deal announcement to the seat-back login page, find the part of airline Wi-Fi you want to understand.
              </p>
            </div>
            <div className="mt-10 grid gap-[14px] md:grid-cols-3">
              {categories.map((c) => (
                <Link key={c.category} href={blogHref(c.param)} className="sb-card group flex min-h-[280px] flex-col p-[25px]">
                  <span className="text-[32px] leading-none">{c.emoji}</span>
                  <h3 className="mt-[47px] text-[28.8px] leading-[1.1] tracking-[-0.025em] text-[var(--ink)]">{c.label}</h3>
                  <span className="mt-3 flex-1 text-[13px] leading-[1.55] text-[var(--muted)]">{c.blurb}</span>
                  <span className="flex items-center justify-between pt-4 text-[10px] text-[var(--muted)]">
                    {c.count} {c.count === 1 ? "story" : "stories"}
                    <ArrowRight className="text-[var(--ink)] transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-24 pb-6 sm:mt-36">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-[36px] leading-[1.04] tracking-[-0.035em] text-[var(--ink)] sm:text-[48px]">Latest from FlightWifi</h2>
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((c) => (
                  <Link key={c.param} href={blogHref(c.param)} className="sb-chip" aria-current={activeCategory === c.category ? "true" : undefined}>
                    {c.label}
                  </Link>
                ))}
                <Link href={blogHref()} className="sb-chip" aria-current={!activeCategory ? "true" : undefined}>
                  Browse all
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-[14px] md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="relative mt-12 flex h-11 items-center justify-between">
                <div>
                  {page > 1 ? (
                    <Link href={blogHref(activeEntry?.[1].param, page - 1)} className="flex items-center gap-2 text-[11px] font-semibold text-[var(--ink)]">
                      <ArrowRight className="rotate-180" />
                      Newer
                    </Link>
                  ) : null}
                </div>
                <p className="absolute left-1/2 -translate-x-1/2 text-[10px] text-[var(--muted)]">
                  Page {page} of {totalPages}
                </p>
                <div>
                  {page < totalPages ? (
                    <Link href={blogHref(activeEntry?.[1].param, page + 1)} className="flex items-center gap-2 text-[11px] font-semibold text-[var(--ink)]">
                      Older
                      <ArrowRight />
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "FlightWifi Blog",
          url: `${SITE_URL}/blog/`,
          publisher: { "@id": `${SITE_URL}/#org` },
          blogPost: POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.date,
            articleSection: p.category,
            image: p.image ? `${SITE_URL}${p.image}` : undefined,
            url: `${SITE_URL}/blog/${p.slug}/`
          }))
        }}
      />
    </>
  );
}
