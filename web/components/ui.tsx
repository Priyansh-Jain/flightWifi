import Link from "next/link";
import { CHROME_STORE_URL, SITE_URL } from "@/lib/site";

export function Chip({ cls, label }: { cls: string; label: string }) {
  return <span className={`v v-${cls}`}>{label}</span>;
}

export function Section({
  title,
  children,
  id
}: {
  title?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-5xl px-5 py-10">
      {title ? <h2 className="mb-5 text-xl font-bold tracking-tight">{title}</h2> : null}
      {children}
    </section>
  );
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-5xl px-5 pt-6 text-sm text-[var(--muted)]">
        {crumbs.map((c, i) => (
          <span key={c.href}>
            {i > 0 ? <span className="mx-1.5">/</span> : null}
            {i === crumbs.length - 1 ? (
              <span className="text-[var(--ink)]">{c.name}</span>
            ) : (
              <Link href={c.href}>{c.name}</Link>
            )}
          </span>
        ))}
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `${SITE_URL}${c.href}`
          }))
        }}
      />
    </>
  );
}

export type QA = { q: string; a: string };

export function Faq({ items, title = "Frequently asked questions", id }: { items: QA[]; title?: string; id?: string }) {
  return (
    <>
      <Section title={title} id={id}>
        <div className="card px-5">
          {items.map((item) => (
            <details key={item.q} className="faq">
              <summary>
                <h3>{item.q}</h3>
              </summary>
              <div>{item.a}</div>
            </details>
          ))}
        </div>
      </Section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a }
          }))
        }}
      />
    </>
  );
}

export function Cta({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "mx-auto w-full max-w-5xl px-5 py-10"}>
      <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">See these verdicts while you book</p>
          <p className="text-sm text-[var(--muted)]">
            The free FlightWifi extension shows them inline on Google Flights, Skyscanner and Soar,
            matched to the exact aircraft on your flight.
          </p>
        </div>
        <InstallButton />
      </div>
    </div>
  );
}

// The label promises the extension, so the click should deliver it. Anyone who wants the
// explainer first still reaches /chrome-extension/ from the nav pill and the footer.
export function InstallButton() {
  return (
    <a
      href={CHROME_STORE_URL}
      rel="noopener"
      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 font-semibold text-[var(--accent-ink)] no-underline hover:opacity-90 hover:no-underline"
    >
      Get the free extension
    </a>
  );
}

// A directory index is a collection, not an article. Declaring the items makes the set itself
// machine-readable rather than leaving 235 links as undifferentiated anchors.
export function CollectionJsonLd({
  name,
  description,
  path,
  items
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; href: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url: `${SITE_URL}${path}`,
        isPartOf: { "@id": `${SITE_URL}/#site` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.name,
            url: `${SITE_URL}${it.href}`
          }))
        }
      }}
    />
  );
}
