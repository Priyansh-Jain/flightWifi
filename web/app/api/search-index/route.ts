import { ARTICLES } from "@/lib/blog";
import { CATEGORY_META } from "@/components/blog-ui";
import { directoryRows } from "@/lib/derive";

export const dynamic = "force-static";

const LINK_RX = /\[([^\]]+)\]\([^)]+\)/g;

export function GET() {
  const articles = Object.entries(ARTICLES)
    .map(([slug, a]) => ({
      slug,
      title: a.title,
      category: a.category,
      readTime: a.readTime,
      date: a.date,
      excerpt: a.excerpt,
      body: a.content
        .filter((b) => !b.startsWith("{{"))
        .map((b) => b.replace(/^#{2,3}\s+/, "").replace(/^- /, "").replace(LINK_RX, "$1").replace(/\*\*/g, ""))
        .join(" ")
        .toLowerCase()
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const categories = Object.entries(CATEGORY_META)
    .map(([key, m]) => ({ param: m.param, label: m.label, count: articles.filter((a) => a.category === key).length }))
    .filter((c) => c.count > 0);

  const airlines = directoryRows().map((r) => ({ slug: r.slug, airline: r.airline, code: r.code, label: r.label, cls: r.cls }));

  return Response.json(
    { articles, categories, airlines },
    { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } }
  );
}
