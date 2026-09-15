"use client";

import { useState } from "react";

// The whole page exists to hand over one string, so copying it should not require selecting text in
// a code block. Falls back to leaving the value selectable when the clipboard API is unavailable,
// which is the case over plain http on a phone.
export function CopyField({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="copyfield">
      {label ? <span className="copyfield-label">{label}</span> : null}
      <code className="copyfield-value">{value}</code>
      <button type="button" onClick={copy} className="copyfield-btn" aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
