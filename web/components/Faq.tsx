import { JsonLd, type QA } from "@/components/ui";

type Variant = "band" | "page";

export function FaqSection({
  items,
  title = "FAQ",
  id = "faq",
  variant = "band"
}: {
  items: QA[];
  title?: React.ReactNode;
  id?: string;
  variant?: Variant;
}) {
  const band = variant === "band";
  return (
    <>
      <section
        id={id}
        className={
          band
            ? "relative isolate w-full overflow-x-clip border-t border-[var(--line)] py-20 md:py-28 lg:py-32"
            : "relative isolate w-full overflow-x-clip py-10"
        }
      >
        <div
          className={
            band
              ? "mx-auto w-full max-w-[1200px] px-5 sm:px-6 lg:px-8"
              : "mx-auto w-full max-w-5xl px-5"
          }
        >
          <div
            className={`grid gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] ${
              band ? "lg:gap-16 xl:gap-24" : "lg:gap-12"
            }`}
          >
            <div>
              <div className="lg:sticky lg:top-28">
                <h2 className={band ? "fq-title" : "fq-title fq-title-sm"}>{title}</h2>
              </div>
            </div>
            <div className="border-t border-[var(--line)]">
              {items.map((item) => (
                <details key={item.q} name="faq" className="fq border-b border-[var(--line)]">
                  <summary className="fq-sum -mx-3 flex cursor-pointer list-none items-start justify-between gap-3 rounded-xl px-3 py-5 sm:-mx-4 sm:gap-8 sm:px-4 sm:py-6">
                    <h3 className="min-w-0 text-[17px] font-medium leading-snug text-[var(--ink)] sm:text-lg">
                      {item.q}
                    </h3>
                    <span aria-hidden="true" className="fq-btn mt-px grid size-11 shrink-0 place-items-center rounded-full border">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </summary>
                  <div className="pb-6 sm:pb-7 sm:pr-[3.25rem]">
                    <p className="max-w-[62ch] text-base leading-6 text-[var(--muted)]">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
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
