"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VISIBLE_WORK } from "@/data/site";
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
    // Not on the homepage (the palette also lives on /lab and /palette), so
    // navigate there and let the browser handle the fragment.
    window.location.assign(`/#${hash}`);
    return;
  }
  // Closing the dialog restores focus to the trigger, which cancels any
  // in-flight smooth scroll, so wait two frames for the top layer to be
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
  ...VISIBLE_WORK.map<Item>((w) => ({
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
    id: "go-tonic-lab",
    label: "Tonic Lab ↗",
    hint: "toniclab.vercel.app",
    group: "go to",
    run: ({ close }) => {
      close();
      window.location.assign("https://toniclab.vercel.app/");
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
        status(ok ? "prompt copied to clipboard" : "copy failed, open /index.md");
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
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");

  /* Which input last moved the selection. Only the keyboard is allowed to
     scroll the list: a pointer is already looking at the row it is over, so
     scrolling under it is both unnecessary and the start of the feedback loop
     described on onItemPointerMove. */
  const navSource = useRef<"key" | "pointer">("key");
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

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
      navSource.current = "key";
      lastPointer.current = null;
      d.showModal();
      // showModal() does not lock background scroll, so the page moved under an
      // open palette and you lost your place. html carries scrollbar-gutter:
      // stable, so taking the scrollbar away cannot shift the layout.
      document.documentElement.style.overflow = "hidden";
      inputRef.current?.focus();
    }
  }, []);

  /* Every dismissal path funnels through here, for the same reason the lightbox
     does it: a scroll lock released on only some paths is a page that silently
     stops scrolling. */
  const close = useCallback(() => {
    document.documentElement.style.overflow = "";
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

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    /* Esc dismisses a native dialog without going through close(), which would
       leave the scroll lock on and the page frozen. `cancel` is preventable, so
       take the dismissal over rather than letting the default run untorn-down.
       Same trap as the lightbox, and the same fix. */
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, [close]);

  function onListKey(e: React.KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      navSource.current = "key";
    }
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

  /**
   * Keep the active row visible while arrowing, and only while arrowing.
   *
   * This replaces scrollIntoView({ block: "nearest" }), which caused two
   * distinct defects. It scrolls every scrollable ancestor, not just the list,
   * so it could move the page behind the dialog as well as the list inside it.
   * And scrolling the list moves fresh rows under a stationary cursor, which
   * the browser reports as a pointermove: that set active from the pointer,
   * which scrolled again, which fired another pointermove. That loop is the
   * jitter, and the guard in onItemPointerMove is the other half of the fix.
   *
   * Writing list.scrollTop directly cannot touch an ancestor, so the page
   * behind the dialog stays where it was.
   */
  useEffect(() => {
    if (navSource.current !== "key") return;
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`#palette-opt-${active}`);
    if (!list || !el) return;
    const pad = 8; // matches .palette-list padding, so a row never sits flush
    const lr = list.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    if (er.top < lr.top + pad) {
      list.scrollTop -= lr.top + pad - er.top;
    } else if (er.bottom > lr.bottom - pad) {
      list.scrollTop += er.bottom - (lr.bottom - pad);
    }
  }, [active]);

  /**
   * onPointerMove rather than onPointerEnter is the right primitive here: it
   * stops the selection jumping when the list scrolls under a still cursor.
   * But the browser also emits a synthetic pointermove after a scroll, at the
   * same coordinates, precisely so hover states stay correct. Indistinguishable
   * from a real move except by position, so compare positions: an event that
   * has not moved is the scroll talking, not the user, and is ignored.
   */
  const onItemPointerMove = useCallback((e: React.PointerEvent, i: number) => {
    const last = lastPointer.current;
    if (last && last.x === e.clientX && last.y === e.clientY) return;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    navSource.current = "pointer";
    setActive(i);
  }, []);

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
              // Filtering rebuilds the list, so the scroll should return to the
              // top even though the pointer moved last.
              navSource.current = "key";
            }}
            onKeyDown={onListKey}
          />
          <kbd>esc</kbd>
        </div>

        <div className="palette-list" id="palette-listbox" role="listbox" ref={listRef}>
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
                      onPointerMove={(e) => onItemPointerMove(e, i)}
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
