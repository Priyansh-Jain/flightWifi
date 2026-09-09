"use client";

import { useEffect, useRef, useState } from "react";

interface Section {
  id: string;
  title: string;
}

const READING_LINE = 130;

export default function ArticleSectionNav({
  sections,
}: {
  sections: Section[];
}) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);
  const locked = useRef(false);
  const release = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (sections.length === 0) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (locked.current) return;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      let current = sections[0].id;
      if (atBottom) {
        current = sections[sections.length - 1].id;
      } else {
        for (const s of sections) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= READING_LINE)
            current = s.id;
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      release.current?.();
    };
  }, [sections]);

  if (sections.length < 2) return null;

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    release.current?.();
    locked.current = true;
    setActive(id);
    let timer = window.setTimeout(finish, 1500);
    function finish() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      locked.current = false;
      release.current = null;
    }
    function onScroll() {
      window.clearTimeout(timer);
      timer = window.setTimeout(finish, 120);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    release.current = finish;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rail-col">
      <nav aria-label="On this page" className="rail">
        <p className="rail-title">On this page</p>
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-current={active === s.id ? "location" : undefined}
                className={`rail-item${active === s.id ? " is-active" : ""}`}
                title={s.title}
              >
                <span className="rail-dash" aria-hidden="true" />
                <span className="rail-label">{s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
