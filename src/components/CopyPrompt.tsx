"use client";

import { useRef, useState } from "react";
import { copyPageAsPrompt } from "@/lib/machine";

type Target = "Claude" | "ChatGPT";

function CopyGlyph() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.25" y="4.25" width="6.5" height="6.5" rx="1.25" />
      <path d="M7.75 2.5v-.25A1.25 1.25 0 0 0 6.5 1h-4A1.25 1.25 0 0 0 1.25 2.25v4A1.25 1.25 0 0 0 2.5 7.5h.25" />
    </svg>
  );
}

/**
 * The demoted machine-readable control: two compact buttons that copy the
 * homepage as a prompt. The prompt is built from the published /index.md at
 * click time, so the clipboard and the Markdown twin cannot drift apart.
 */
export default function CopyPrompt() {
  const [msg, setMsg] = useState("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy(target: Target) {
    const ok = await copyPageAsPrompt();
    setMsg(ok ? `copied, paste into ${target}` : "copy failed, open /index.md");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setMsg(""), 2600);
  }

  return (
    <div className="copy-row">
      <span className="copy-row-label" role="status" aria-live="polite">
        {msg || "copy this page as a prompt:"}
      </span>
      <button
        type="button"
        className="ai-btn"
        onClick={() => copy("Claude")}
        aria-label="Copy this page as a prompt for Claude"
      >
        <CopyGlyph />
        Claude
      </button>
      <button
        type="button"
        className="ai-btn"
        onClick={() => copy("ChatGPT")}
        aria-label="Copy this page as a prompt for ChatGPT"
      >
        <CopyGlyph />
        ChatGPT
      </button>
      <span className="copy-row-links">
        <a href="/index.md">index.md</a> · <a href="/llms.txt">llms.txt</a>
      </span>
    </div>
  );
}
