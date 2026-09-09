import type { Metadata } from "next";
import { Breadcrumbs, Cta, JsonLd } from "@/components/ui";
import { Avatar, PostCard, type Post } from "@/components/blog-ui";
import { AUTHOR } from "@/lib/author";
import { ARTICLES } from "@/lib/blog";
import { SITE_URL, og } from "@/lib/site";

export const metadata: Metadata = {
  title: `${AUTHOR.name}`,
  description: `${AUTHOR.name}, ${AUTHOR.role.toLowerCase()}. ${AUTHOR.bio}`,
  alternates: { canonical: `/blog/authors/${AUTHOR.slug}/` },
  openGraph: og(`/blog/authors/${AUTHOR.slug}/`)
};

const POSTS: Post[] = Object.entries(ARTICLES)
  .map(([slug, article]) => ({ slug, ...article }))
  .sort((a, b) => b.date.localeCompare(a.date));

export default function AuthorPage() {
  return (
    <>
      <Breadcrumbs
        hidden
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog/" },
          { name: AUTHOR.name, href: `/blog/authors/${AUTHOR.slug}/` }
        ]}
      />
      <div className="soar">
        <div className="mx-auto w-full max-w-[1200px] px-5 pt-6 sm:px-6 sm:pt-10 lg:px-8">
          <section className="sb-card sb-panel px-7 py-9 sm:px-[51px] sm:py-[56px]">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-10">
              <Avatar size={96} />
              <div className="min-w-0 flex-1">
                <p className="sb-kicker">Author</p>
                <h1 className="mt-3 text-[36px] leading-[1.04] tracking-[-0.035em] text-[var(--ink)] sm:text-[48px]">{AUTHOR.name}</h1>
                <p className="mt-2 text-[13px] font-semibold text-[var(--muted)]">{AUTHOR.role}</p>
                <p className="mt-5 max-w-[62ch] text-[16px] leading-[1.6] text-[var(--muted)]">{AUTHOR.bio}</p>
                <div className="au-tags mt-5">
                  {AUTHOR.topics.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <a href={AUTHOR.links.x} rel="me noopener" className="sb-chip">
                    Priyansh on X
                  </a>
                  <a href={AUTHOR.links.github} rel="noopener" className="sb-chip">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-20 pb-6 sm:mt-24">
            <h2 className="text-[36px] leading-[1.04] tracking-[-0.035em] text-[var(--ink)] sm:text-[48px]">
              Articles by {AUTHOR.name.split(" ")[0]}
            </h2>
            <div className="mt-10 grid gap-[14px] md:grid-cols-2 lg:grid-cols-3">
              {POSTS.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </div>
      </div>
      <Cta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            "@id": `${SITE_URL}/blog/authors/${AUTHOR.slug}/#person`,
            name: AUTHOR.name,
            jobTitle: AUTHOR.role,
            description: AUTHOR.bio,
            url: `${SITE_URL}/blog/authors/${AUTHOR.slug}/`,
            image: AUTHOR.image ? `${SITE_URL}${AUTHOR.image}` : undefined,
            sameAs: [AUTHOR.links.x, AUTHOR.links.github],
            worksFor: { "@id": `${SITE_URL}/#org` }
          }
        }}
      />
    </>
  );
}
