"use client";

import { useRef, useState } from "react";
import { copyPageAsPrompt } from "@/lib/machine";

type CopyState = "idle" | "copied" | "failed";

/**
 * The AI-ready panel. This page ships a Markdown twin (/index.md) and an
 * llms.txt; this control copies the twin wrapped in a short prompt preamble.
 */
export default function Console() {
  const [state, setState] = useState<CopyState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function onCopy() {
    const ok = await copyPageAsPrompt();
    setState(ok ? "copied" : "failed");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 2400);
  }

  return (
    <section className="console" aria-labelledby="console-title">
      <div className="console-head">
        <span className="console-title" id="console-title">
          <span className="console-dot" aria-hidden="true" />
          machine-readable
        </span>
        <span className="mono-label">text/markdown · llms.txt</span>
      </div>
      <div className="console-body">
        <pre aria-label="Terminal example: this site serves an llms.txt">
          <span className="prompt-char">$ </span>
          <span className="cmd">curl gpcodes.com/llms.txt</span>
          {"\n"}
          {"# Giacomo Patella — senior product designer\n"}
          {"# Florence, IT · designs and builds\n"}
          {"# work: passionfruit · hundo · pwc · okappy\n"}
          {"#       octopus · redington · ipc"}
        </pre>
      </div>
      <div className="console-actions">
        <button type="button" className="btn btn-primary" onClick={onCopy}>
          {state === "copied"
            ? "copied to clipboard ✓"
            : state === "failed"
              ? "copy failed — try /index.md"
              : "copy page as prompt"}
        </button>
        <a className="btn" href="/index.md">
          index.md
        </a>
        <a className="btn" href="/llms.txt">
          llms.txt
        </a>
        <span className="console-note" role="status" aria-live="polite">
          {state === "copied"
            ? "paste it into Claude or ChatGPT"
            : "this page is legible to models, too"}
        </span>
      </div>
    </section>
  );
}
