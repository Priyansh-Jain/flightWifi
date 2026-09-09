import Link from "next/link";
import type { BlogArticle } from "@/lib/blog";
import { AUTHOR } from "@/lib/author";

export type Post = BlogArticle & { slug: string };

export const CATEGORY_META: Record<string, { label: string; emoji: string; param: string; blurb: string }> = {
  DATA: {
    label: "Data",
    emoji: "📡",
    param: "data",
    blurb: "Straight from the registry: which airlines fly Starlink, whose Wi-Fi is free, and what changed this month."
  },
  GUIDE: {
    label: "Guides",
    emoji: "🧭",
    param: "guides",
    blurb: "How to actually get online: the network name, the portal address, and the loyalty step to do before boarding."
  },
  EXPLAINER: {
    label: "Explainers",
    emoji: "🛰️",
    param: "explainers",
    blurb: "Why the orbit above your plane decides whether a video call works, and what the speed number leaves out."
  }
};

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${iso}T00:00:00Z`));

export const catLabel = (category: string) => CATEGORY_META[category]?.label ?? category;

export function blogHref(category?: string, page?: number) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/blog/?${qs}` : "/blog/";
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.56 12.23c0-.71-.06-1.24-.2-1.8h-9.14v3.52h5.37a4.57 4.57 0 0 1-1.99 3v2.28h3.22c1.88-1.73 2.74-4.29 2.74-7Z" fill="#4285F4" />
      <path d="M12.22 21.72c2.69 0 4.94-.89 6.6-2.49l-3.22-2.28c-.9.6-2.04.96-3.38.96-2.59 0-4.79-1.75-5.57-4.1H3.32v2.35a9.97 9.97 0 0 0 8.9 5.56Z" fill="#34A853" />
      <path d="M6.65 13.81a5.98 5.98 0 0 1 0-3.84V7.62H3.32a9.97 9.97 0 0 0 0 8.54l3.33-2.35Z" fill="#FBBC05" />
      <path d="M12.22 6.06c1.47 0 2.78.5 3.81 1.49l2.85-2.85A9.97 9.97 0 0 0 3.32 7.62l3.33 2.35c.78-2.35 2.98-4.1 5.57-4.1Z" fill="#EA4335" />
    </svg>
  );
}

export function Avatar({ size = 40 }: { size?: number }) {
  return (
    <span className="au-avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}>
      {AUTHOR.image ? <img src={AUTHOR.image} alt="" width={size} height={size} /> : AUTHOR.initials}
    </span>
  );
}

export function Author({ detail, small = false }: { detail: string; small?: boolean }) {
  return (
    <span className="au">
      <Link href={`/blog/authors/${AUTHOR.slug}/`} className="au-trigger">
        <Avatar size={small ? 28 : 40} />
        <span className="flex flex-col">
          <span className={`${small ? "text-[11px]" : "text-[13px]"} font-semibold leading-tight text-[var(--ink)]`}>{AUTHOR.name}</span>
          <span className={`${small ? "text-[10px]" : "text-[12px]"} leading-tight text-[var(--muted)]`}>{detail}</span>
        </span>
      </Link>
      <span className="au-card">
        <span className="au-card-head">
          <Avatar size={56} />
          <span className="flex min-w-0 flex-col gap-0.5">
            <strong>{AUTHOR.name}</strong>
            <small>{AUTHOR.role}</small>
          </span>
        </span>
        <span className="au-bio">{AUTHOR.bio}</span>
        <span className="au-tags">
          {AUTHOR.topics.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </span>
        <span className="au-links">
          <Link href={`/blog/authors/${AUTHOR.slug}/`} className="au-btn">
            View profile
          </Link>
          <a href={AUTHOR.links.x} rel="me noopener">
            Priyansh on X
          </a>
          <a href={AUTHOR.links.github} rel="noopener">
            GitHub
          </a>
        </span>
      </span>
    </span>
  );
}

export function Thumb({ post, className = "", eager = false }: { post: { image?: string }; className?: string; eager?: boolean }) {
  if (!post.image) return <div className={`h-full w-full bg-[var(--bg)] ${className}`} />;
  return (
    <img
      src={post.image}
      alt=""
      width={1200}
      height={760}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      className={`sb-img ${className}`}
    />
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="sb-card sb-post flex h-full flex-col">
      <div className="overflow-hidden rounded-t-[16px]">
        <span className="block aspect-[449/220] w-full overflow-hidden">
          <Thumb post={post} />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-[25px]">
        <span className="sb-meta">
          {catLabel(post.category)} · {post.readTime} read
        </span>
        <h3 className="mt-3 text-[26px] leading-[1.14] tracking-[-0.025em] text-[var(--ink)]">
          <Link href={`/blog/${post.slug}/`} className="sb-title-link sb-stretch">
            {post.title}
          </Link>
        </h3>
        <p className="mt-[14px] line-clamp-3 text-[13px] leading-[1.5] text-[var(--muted)]">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-6">
          <Author small detail={`Posted ${fmtDate(post.date)}`} />
          <Link href={`/blog/${post.slug}/`} className="sb-arrow" aria-label={`Read ${post.title}`}>
            <ChevronRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
