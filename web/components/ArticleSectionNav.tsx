"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  title: string;
}

// GetStopover's floating section rail, restyled onto this site's theme tokens: a stack of dashes
// pinned to the right edge that widens for the active section and expands into a full list on
// hover. Hidden below xl because it needs free gutter beside the reading column.
export default function ArticleSectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -78% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <nav
      aria-label="On this page"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      className="group fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative flex w-7 flex-col items-end gap-2.5">
        {/* opacity alone leaves the buttons in the tab order while they are invisible, so the panel
            is also removed from the accessibility tree until it is actually shown */}
        <div
          aria-hidden={!open}
          {...(open ? {} : { inert: "" as unknown as boolean })}
          className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 pr-4 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
        >
          <div className="w-60 rounded-2xl border border-[var(--line)] bg-[var(--bg-raised)] p-2 shadow-xl">
            <ul className="max-h-[70vh] space-y-0.5 overflow-y-auto">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className={`block w-full truncate rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      active === s.id
                        ? "bg-[var(--line)] font-medium text-[var(--ink)]"
                        : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {sections.map((s) => (
          <button key={s.id} type="button" onClick={() => go(s.id)} aria-label={s.title} className="block py-0.5">
            <span
              className={`block h-[3px] rounded-full transition-all duration-200 ${
                active === s.id ? "w-7 bg-[var(--ink)]" : "w-4 bg-[var(--muted)] opacity-50 group-hover:w-5"
              }`}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
