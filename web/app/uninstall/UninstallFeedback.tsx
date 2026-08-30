"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

const REASONS = [
  { id: "no-chip", label: "It never showed up on my search" },
  { id: "wrong-verdict", label: "A verdict looked wrong" },
  { id: "missing-airline", label: "My airline was not covered" },
  { id: "one-trip", label: "I only needed it for one trip" },
  { id: "clutter", label: "It cluttered the results" },
  { id: "other", label: "Something else" }
] as const;

const WITH = [
  "Every flight's Wi-Fi, before you book",
  "Starlink or old satellite, named per plane",
  "Whether video calls actually work",
  "Matched to the exact aircraft you fly"
];

const WITHOUT = [
  "A Wi-Fi icon that tells you nothing",
  "Paying for Wi-Fi that cannot hold a call",
  "Finding out once you are already airborne",
  "Guessing from the aircraft type"
];

const DETAIL_MAX = 1000;

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--good)]">
      <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.4 10.3l2.4 2.4 4.8-4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Warn() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bad)]">
      <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5.9v4.9" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="10" cy="13.9" r="1" fill="currentColor" />
    </svg>
  );
}

export default function UninstallFeedback({
  chromeStoreUrl,
  contactEmail,
  feedbackEndpoint,
  year
}: {
  chromeStoreUrl: string;
  contactEmail: string;
  feedbackEndpoint: string;
  year: number;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState<string>("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [submitted, setSubmitted] = useState(false);
  const [mailed, setMailed] = useState(false);
  const [version, setVersion] = useState("");

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v");
    if (v && /^[\d.]{1,12}$/.test(v)) setVersion(v);
  }, []);

  const label = REASONS.find((r) => r.id === reason)?.label ?? "";
  const needsDetail = reason === "other";
  const text = detail.trim();

  function mailtoFor(body: string) {
    return `mailto:${contactEmail}?subject=${encodeURIComponent(
      "FlightWifi uninstall feedback"
    )}&body=${encodeURIComponent(body)}`;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason || status === "sending") return;
    setStatus("sending");

    try {
      track("uninstall_reason", version ? { reason, version } : { reason });
    } catch (err) {}

    if (text) {
      const payload = { reason: label, detail: text, version, source: "uninstall" };
      let posted = false;
      if (feedbackEndpoint) {
        try {
          // text/plain is CORS-safelisted, so this skips the preflight Apps Script cannot answer;
          // no-cors makes the opaque reply acceptable, leaving a network throw as the only failure
          // signal we get.
          await fetch(feedbackEndpoint, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
          });
          posted = true;
        } catch (err) {
          posted = false;
        }
      }
      if (!posted) {
        window.location.href = mailtoFor(
          `Reason: ${label}\n${version ? `Version: ${version}\n` : ""}\n${text}\n`
        );
        setMailed(true);
      }
    }

    setStatus("done");
    setSubmitted(true);
  }

  function openDialog() {
    setStatus("idle");
    setMailed(false);
    dialogRef.current?.showModal();
  }

  return (
    <div
      data-bare
      className="mx-auto flex min-h-[100dvh] w-full max-w-4xl flex-col items-center justify-center px-5 py-14"
    >
      <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-6xl">
        It&rsquo;s hard to say goodbye&hellip;
      </h1>

      <div className="mt-6 text-center text-lg text-[var(--muted)] sm:text-xl">
        {submitted ? (
          <p aria-live="polite">
            Thanks, that helps.
            <br />
            It goes straight into what gets fixed next.
          </p>
        ) : (
          <p>
            Could you tell us the reason?
            <br />
            Your feedback will help us improve.
          </p>
        )}
      </div>

      <div className="mt-12 grid w-full gap-4 sm:grid-cols-2">
        <div className="card p-6 sm:p-7">
          <p className="font-bold">With FlightWifi:</p>
          <ul className="mt-4 grid gap-3.5 text-[0.95rem]">
            {WITH.map((t) => (
              <li key={t} className="flex gap-3">
                <Check />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 sm:p-7">
          <p className="font-bold">Without FlightWifi:</p>
          <ul className="mt-4 grid gap-3.5 text-[0.95rem] text-[var(--muted)]">
            {WITHOUT.map((t) => (
              <li key={t} className="flex gap-3">
                <Warn />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
        <a
          href={chromeStoreUrl}
          rel="noopener"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--accent-ink)] no-underline hover:opacity-90 hover:no-underline"
        >
          Reinstall
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
            <path
              d="M16.2 8.4a6.4 6.4 0 10-.7 5.1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
            <path
              d="M16.6 3.9v4.6h-4.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <button
          type="button"
          onClick={openDialog}
          className="inline-flex items-center justify-center rounded-xl border border-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--accent)] hover:bg-[var(--bg)]"
        >
          {submitted ? "Add more detail" : "Leave feedback"}
        </button>
      </div>

      <p className="mt-12 text-center text-sm text-[var(--muted)]">
        &copy; {year} FlightWifi · <a href="/privacy/">Privacy</a> ·{" "}
        <a href="/airlines/">Browse the registry</a>
      </p>

      <dialog ref={dialogRef} aria-labelledby="fb-title">
        {status === "done" ? (
          <div className="p-6 text-center sm:p-7">
            <h2 id="fb-title" className="text-xl font-bold">
              Thanks for telling us.
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {mailed
                ? "Your mail app should have opened with the note ready to send. Nothing reaches us until you send it."
                : "Logged as “" + label + "”."}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="mt-6 w-full rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-ink)]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 sm:p-7">
            <h2 id="fb-title" className="text-xl font-bold">
              Why did you remove it?
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              One click is enough. Nothing here identifies you.
            </p>

            <fieldset className="mt-5">
              <legend className="sr-only">Reason</legend>
              <div className="grid gap-2">
                {REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[0.95rem] ${
                      reason === r.id
                        ? "border-[var(--accent)] text-[var(--ink)]"
                        : "border-[var(--line)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                      className="h-4 w-4 shrink-0 accent-[var(--accent)]"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {reason ? (
              <div className="mt-4">
                <label htmlFor="fb-detail" className="text-sm font-semibold">
                  {needsDetail ? "What happened?" : "Anything to add? (optional)"}
                </label>
                <textarea
                  id="fb-detail"
                  className="mt-2"
                  rows={4}
                  maxLength={DETAIL_MAX}
                  required={needsDetail}
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder={
                    needsDetail
                      ? "Tell us what went wrong."
                      : "The airline, the aircraft, and what you saw instead."
                  }
                />
              </div>
            ) : null}

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button
                type="submit"
                disabled={!reason || status === "sending"}
                className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-ink)] disabled:opacity-45"
              >
                {status === "sending" ? "Sending…" : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="rounded-xl border border-[var(--line)] px-5 py-3 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
