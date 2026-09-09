"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Article = { slug: string; title: string; category: string; readTime: string; date: string; excerpt: string; body: string };
type Airline = { slug: string; airline: string; code: string; label: string; cls: string };
type Category = { param: string; label: string; count: number };
type Index = { articles: Article[]; categories: Category[]; airlines: Airline[] };

const LABEL: Record<string, string> = { DATA: "Data", GUIDE: "Guides", EXPLAINER: "Explainers" };

let cached: Index | null = null;
let pending: Promise<Index> | null = null;

function loadIndex(): Promise<Index> {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = fetch("/api/search-index/")
      .then((r) => r.json() as Promise<Index>)
      .then((data) => {
        cached = data;
        return data;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Folder() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.2 3.9A2 2 0 0 0 7.5 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

export function BlogSearchButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<Index | null>(cached);
  const inputRef = useRef<HTMLInputElement>(null);

  const show = useCallback(() => {
    setOpen(true);
    loadIndex().then(setIndex).catch(() => setIndex({ articles: [], categories: [], airlines: [] }));
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    setQ("");
  }, []);

  useEffect(() => {
    setOpen(false);
    setQ("");
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) hide();
        else show();
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        show();
      } else if (e.key === "Escape" && open) {
        hide();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, show, hide]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  const needle = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!index) return null;
    const articles = needle
      ? index.articles
          .map((a) => {
            const t = a.title.toLowerCase();
            const score = t.includes(needle) ? 3 : a.excerpt.toLowerCase().includes(needle) ? 2 : a.body.includes(needle) ? 1 : 0;
            return { a, score };
          })
          .filter((x) => x.score > 0)
          .sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date))
          .map((x) => x.a)
      : index.articles;
    const airlines = needle.length >= 2
      ? index.airlines
          .filter((r) => r.airline.toLowerCase().includes(needle) || r.code.toLowerCase() === needle || r.slug.includes(needle.replace(/\s+/g, "-")))
          .sort((x, y) => Number(y.airline.toLowerCase().startsWith(needle)) - Number(x.airline.toLowerCase().startsWith(needle)) || x.airline.localeCompare(y.airline))
          .slice(0, 6)
      : [];
    return { articles, airlines, total: articles.length + airlines.length };
  }, [index, needle]);

  return (
    <>
      <button type="button" className="bs-btn" onClick={show} aria-haspopup="dialog" aria-expanded={open}>
        <SearchIcon />
        <span>Search</span>
      </button>

      {open ? (
        <div className="bs-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) hide(); }}>
          <section className="bs-sheet" role="dialog" aria-modal="true" aria-labelledby="bs-title">
            <header className="bs-head">
              <h2 id="bs-title">Search the FlightWifi blog</h2>
              <button type="button" className="bs-close" onClick={hide} aria-label="Close search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </header>

            <form className="bs-form" role="search" onSubmit={(e) => e.preventDefault()}>
              <span className="bs-form-ico">
                <SearchIcon size={19} />
              </span>
              <input
                ref={inputRef}
                type="search"
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search guides, airlines, or aircraft"
                aria-label="Search the FlightWifi blog"
                autoComplete="off"
                spellCheck={false}
              />
              {q ? (
                <button type="button" className="bs-clear" onClick={() => { setQ(""); inputRef.current?.focus(); }}>
                  Clear
                </button>
              ) : null}
            </form>

            <div className="bs-results" aria-live="polite">
              {!results ? (
                <p className="bs-summary">
                  <span>Loading</span>
                </p>
              ) : (
                <>
                  <p className="bs-summary">
                    <span>{needle ? `Results for “${q.trim()}”` : "Suggested for you"}</span>
                    <span>
                      {results.total} {results.total === 1 ? "match" : "matches"}
                    </span>
                  </p>

                  {results.total === 0 ? (
                    <div className="bs-empty">
                      <span className="bs-empty-ico">
                        <SearchIcon size={20} />
                      </span>
                      <strong>No close matches</strong>
                      <span>Try an airline name, an aircraft, or a topic like Starlink.</span>
                    </div>
                  ) : null}

                  {results.articles.length ? (
                    <section className="bs-section" aria-label="Guides">
                      <h3>Guides</h3>
                      <div className="bs-posts">
                        {results.articles.map((a) => (
                          <Link key={a.slug} href={`/blog/${a.slug}/`} className="bs-card" onClick={hide}>
                            <span className="bs-card-copy">
                              <strong>{a.title}</strong>
                              <small>
                                {LABEL[a.category] ?? a.category} · {a.readTime} read
                              </small>
                            </span>
                            <Chevron />
                          </Link>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {results.airlines.length ? (
                    <section className="bs-section" aria-label="Airlines">
                      <h3>Airlines</h3>
                      <div className="bs-posts">
                        {results.airlines.map((r) => (
                          <Link key={r.code} href={`/airlines/${r.slug}/`} className="bs-card" onClick={hide}>
                            <span className="bs-card-copy">
                              <strong>
                                <span className={`dot dot-${r.cls}`} aria-hidden="true" />
                                {r.airline}
                              </strong>
                              <small>{r.label}</small>
                            </span>
                            <Chevron />
                          </Link>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {!needle && index?.categories.length ? (
                    <section className="bs-section" aria-label="Categories">
                      <h3>Categories</h3>
                      <div className="bs-chips">
                        {index.categories.map((c) => (
                          <Link key={c.param} href={`/blog/?category=${c.param}`} className="bs-chip" onClick={hide}>
                            <Folder />
                            {c.label}
                            <small>{c.count}</small>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
