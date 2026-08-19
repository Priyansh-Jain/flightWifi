import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { airlineSlugs } from "@/lib/slugs";
import { AIRCRAFT, COMPARISONS, PROVIDERS } from "@/lib/derive";
import { ARTICLES } from "@/lib/blog";
import { stats } from "@/lib/extension";
import { schemaDates } from "@/lib/derive";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // must not predate the dateModified the same pages declare in their JSON-LD
  const lastModified = new Date(schemaDates(stats().asOf).dateModified);
  const page = (path: string, priority = 0.6, modified?: string): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: modified ? new Date(modified) : lastModified,
    priority
  });

  return [
    page("/", 1),
    page("/starlink/", 0.9),
    page("/airlines/", 0.9),
    page("/chrome-extension/", 0.8),
    page("/providers/", 0.7),
    page("/aircraft/", 0.7),
    page("/compare/", 0.7),
    page("/blog/", 0.7),
    page("/methodology/", 0.5),
    page("/about/", 0.4),
    page("/contact/", 0.4),
    page("/privacy/", 0.2),
    ...airlineSlugs().map((s) => page(`/airlines/${s}/`, 0.7)),
    ...PROVIDERS.map((p) => page(`/providers/${p.slug}/`, 0.6)),
    ...AIRCRAFT.map((a) => page(`/aircraft/${a.slug}/`, 0.6)),
    ...COMPARISONS.map((c) => page(`/compare/${c.slug}/`, 0.6)),
    ...Object.entries(ARTICLES).map(([slug, a]) => page(`/blog/${slug}/`, 0.8, a.date))
  ];
}
