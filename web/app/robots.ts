import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Answer engines are the point of this site, so every retrieval bot is allowed explicitly rather
// than only implicitly via "*". The training crawlers are allowed too: for a new domain, being in
// next year's model priors is worth more than withholding an open dataset we already publish.
const AI_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Amzn-SearchBot",
  "meta-externalagent",
  "DuckAssistBot",
  "CCBot",
  "YouBot"
];

// The router's RSC payloads duplicate every page's prose as text/plain, where no canonical tag can
// live. Nothing links them, but they should not be a crawlable duplicate surface either.
const RSC_PAYLOADS = ["/*index.txt$", "/*__next"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: RSC_PAYLOADS },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow: RSC_PAYLOADS }))
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
