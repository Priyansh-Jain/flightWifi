import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteNav } from "@/components/chrome";
import { JsonLd } from "@/components/ui";
import { SITE_NAME, SITE_URL, TAGLINE } from "@/lib/site";

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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#org`,
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/logo.png`
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
