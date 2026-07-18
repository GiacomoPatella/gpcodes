/**
 * The AI-ready surface: everything needed to hand this page to a model.
 * The canonical machine-readable copies live in /public (index.md, llms.txt);
 * the copy-as-prompt control fetches index.md so the clipboard and the
 * published Markdown twin can never drift apart.
 */

export const PROMPT_PREAMBLE = [
  "You are reading the portfolio of Giacomo Patella, a senior product",
  "designer based in Florence, Italy (gpcodes.com · gp@gpcodes.com).",
  "The Markdown below is the full content of his homepage. Use it to",
  "answer questions about his work, judge fit for a role or project,",
  "or draft an intro email to him.",
].join(" ");

export async function buildPrompt(): Promise<string> {
  const res = await fetch("/index.md");
  if (!res.ok) throw new Error(`index.md → ${res.status}`);
  const md = await res.text();
  return `${PROMPT_PREAMBLE}\n\n---\n\n${md}`;
}

export async function copyPageAsPrompt(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(await buildPrompt());
    return true;
  } catch {
    return false;
  }
}

export function toggleTheme(): void {
  const root = document.documentElement;
  const explicit = root.getAttribute("data-theme");
  const dark = explicit
    ? explicit === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const next = dark ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private mode — theme still applies for this page view */
  }
}
