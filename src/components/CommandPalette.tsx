"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WORK_INDEX } from "@/data/site";
import { copyPageAsPrompt, toggleTheme } from "@/lib/machine";

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: "work" | "go to" | "actions";
  run: (ctx: { close: () => void; status: (msg: string) => void }) => void;
};

function goTo(hash: string, close: () => void) {
  close();
  const el = document.getElementById(hash);
  if (!el) {
    // Not on the homepage (the palette also lives on /lab and /palette) —
    // navigate there and let the browser handle the fragment.
    window.location.assign(`/#${hash}`);
    return;
  }
  // Closing the dialog restores focus to the trigger, which cancels any
  // in-flight smooth scroll — so wait two frames for the top layer to be
  // fully torn down, then jump precisely and instantly, mirroring the CSS
  // scroll-margin-top (header + 2rem).
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "instant" });
    }),
  );
}

const ITEMS: Item[] = [
  ...WORK_INDEX.map<Item>((w) => ({
    id: w.id,
    label: w.name,
    hint: w.meta,
    group: "work",
    run: ({ close }) => goTo(w.id, close),
  })),
  {
    id: "go-work",
    label: "Selected work",
    group: "go to",
    run: ({ close }) => goTo("work", close),
  },
  {
    id: "go-testimonials",
    label: "Testimonials",
    group: "go to",
    run: ({ close }) => goTo("testimonials", close),
  },
  {
    id: "go-contact",
    label: "Contact",
    group: "go to",
    run: ({ close }) => goTo("contact", close),
  },
  {
    id: "go-lab",
    label: "Lab",
    hint: "/lab",
    group: "go to",
    run: ({ close }) => {
      close();
      window.location.assign("/lab/");
    },
  },
  {
    id: "go-architecture",
    label: "Architecture map",
    hint: "/lab/architecture",
    group: "go to",
    run: ({ close }) => {
      close();
      window.location.assign("/lab/architecture/");
    },
  },
  {
    id: "go-palette",
    label: "Compare accent palettes",
    hint: "/palette",
    group: "go to",
    run: ({ close }) => {
      close();
      window.location.assign("/palette/");
    },
  },
  {
    id: "copy-prompt",
    label: "Copy page as prompt",
    hint: "for Claude / ChatGPT",
    group: "actions",
    run: ({ close, status }) => {
      void copyPageAsPrompt().then((ok) => {
        status(ok ? "prompt copied to clipboard" : "copy failed — open /index.md");
        setTimeout(close, 900);
      });
    },
  },
  {
    id: "open-md",
    label: "Open index.md",
    hint: "markdown twin",
    group: "actions",
    run: ({ close }) => {
      close();
      window.location.assign("/index.md");
    },
  },
  {
    id: "open-llms",
    label: "Open llms.txt",
    group: "actions",
    run: ({ close }) => {
      close();
      window.location.assign("/llms.txt");
    },
  },
  {
    id: "theme",
    label: "Toggle colour theme",
    group: "actions",
    run: ({ close }) => {
      toggleTheme();
      close();
    },
  },
  {
    id: "email",
    label: "Email me",
    hint: "gp@gpcodes.com",
    group: "actions",
    run: ({ close }) => {
      close();
      window.location.assign("mailto:gp@gpcodes.com");
    },
  },
];

const GROUP_ORDER: Item["group"][] = ["work", "go to", "actions"];

export default function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        (i.hint ?? "").toLowerCase().includes(q),
    );
  }, [query]);

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (d && !d.open) {
      setQuery("");
      setActive(0);
      setStatusMsg("");
      d.showModal();
      inputRef.current?.focus();
    }
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) =>
        results.length ? (a - 1 + results.length) % results.length : 0,
      );
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(0, results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run({ close, status: setStatusMsg });
    }
  }

  // Keep the active row visible while arrowing.
  useEffect(() => {
    dialogRef.current
      ?.querySelector(`#palette-opt-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const activeId = results[active] ? `palette-opt-${active}` : undefined;

  return (
    <>
      <button
        type="button"
        className="palette-trigger"
        onClick={open}
        aria-label="Open command palette"
      >
        <kbd>⌘</kbd>
        <kbd>K</kbd>
        <span>index</span>
      </button>

      <dialog
        ref={dialogRef}
        className="palette"
        aria-label="Command palette"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="palette-input-row">
          <span className="prompt-char" aria-hidden="true">
            ›
          </span>
          <input
            ref={inputRef}
            className="palette-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={activeId}
            aria-label="Search projects and actions"
            placeholder="search work, sections, actions…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onListKey}
          />
          <kbd>esc</kbd>
        </div>

        <div className="palette-list" id="palette-listbox" role="listbox">
          {results.length === 0 && (
            <p className="palette-empty">no matches for “{query}”</p>
          )}
          {GROUP_ORDER.map((group) => {
            const rows = results.filter((r) => r.group === group);
            if (rows.length === 0) return null;
            return (
              <div key={group} role="group" aria-label={group}>
                <p className="palette-group-label" aria-hidden="true">
                  {group}
                </p>
                {rows.map((item) => {
                  const i = results.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      id={`palette-opt-${i}`}
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      className="palette-item"
                      onPointerMove={() => setActive(i)}
                      onClick={() => item.run({ close, status: setStatusMsg })}
                    >
                      <span>{item.label}</span>
                      {item.hint && <span className="hint">{item.hint}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="palette-status">
          <span role="status" aria-live="polite">
            {statusMsg || `${results.length} of ${ITEMS.length} entries`}
          </span>
          <span aria-hidden="true">↑↓ navigate · ↵ select</span>
        </div>
      </dialog>
    </>
  );
}
