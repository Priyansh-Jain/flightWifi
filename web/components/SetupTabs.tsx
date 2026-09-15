"use client";

import { useState } from "react";

export type Step = {
  title: string;
  body?: string;
  /** Field name and the value to type into it, for a form the reader is filling in. */
  form?: [string, string][];
  code?: string;
};

export type Tab = { label: string; steps: Step[] };

function CodeLine({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className="codeline">
      <pre className="codeline-pre">
        <code>{code}</code>
      </pre>
      <button type="button" onClick={copy} className="codeline-btn" aria-label="Copy to clipboard">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function SetupTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const steps = tabs[active]?.steps ?? [];

  return (
    <div>
      {tabs.length > 1 ? (
        <div className="seg-wrap">
          <div className="seg" role="tablist" aria-label="Setup method">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-pressed={i === active}
                className="seg-btn"
                onClick={() => setActive(i)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s.title} className="step">
            <span className="step-n" aria-hidden="true">
              {i + 1}
            </span>
            <div className="step-body">
              <p className="font-semibold">{s.title}</p>
              {s.body ? <p className="mt-1 text-sm text-[var(--muted)]">{s.body}</p> : null}
              {s.form ? (
                <dl className="step-form">
                  {s.form.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {s.code ? <CodeLine code={s.code} /> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
