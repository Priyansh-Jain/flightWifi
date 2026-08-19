import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteFooter, SiteNav } from "@/components/chrome";
import { JsonLd } from "@/components/ui";
import { CHROME_STORE_URL, CONTACT_EMAIL, GITHUB_URL, SITE_LAUNCH, SITE_NAME, SITE_URL, TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`
  },
  description:
    "Which airlines have Starlink, which Wi-Fi supports video calls, and which planes have nothing at all. 235 airlines, sourced airline by airline.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    images: ["/og.png"]
  },
  twitter: {
    card: "summary_large_image"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#org`,
                name: SITE_NAME,
                url: SITE_URL,
                logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
                description:
                  "An independent registry of in-flight Wi-Fi across 235 airlines, compiled from airline and connectivity-provider sources and published as open data.",
                foundingDate: SITE_LAUNCH,
                email: CONTACT_EMAIL,
                sameAs: [GITHUB_URL, CHROME_STORE_URL]
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#site`,
                name: SITE_NAME,
                url: SITE_URL,
                publisher: { "@id": `${SITE_URL}/#org` },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE_URL}/airlines/?q={search_term_string}`
                  },
                  "query-input": "required name=search_term_string"
                }
              }
            ]
          }}
        />
      </body>
    </html>
  );
}
