"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Shot = {
  src: string;
  w: number;
  h: number;
  alt: string;
  caption: string;
};

/** Read a trigger element back into a Shot. */
function toShot(el: HTMLElement): Shot {
  return {
    src: el.dataset.zoom!,
    w: Number(el.dataset.zoomW),
    h: Number(el.dataset.zoomH),
    alt: el.dataset.zoomAlt ?? "",
    caption: el.dataset.zoomCaption ?? "",
  };
}

/**
 * One dialog for the whole page, opened by delegation from any [data-zoom]
 * trigger that Fig renders. Mounting a dialog per image would put 47 of them in
 * the document for a feature used a handful of times.
 *
 * Opening an image also opens its group: the surrounding work entry becomes a
 * gallery you can page through with the arrow keys or the on-screen controls,
 * so comparing five Okappy screens does not mean five rounds of Esc and click.
 *
 * Native <dialog>::backdrop, so no scrim element and no focus-trap library, and
 * focus returns to the trigger on close for free. Without JS the buttons simply
 * do nothing and the display image stays visible, which is an acceptable floor.
 */
/** The exit duration, read from the one place it is declared so the JS hold
 *  below cannot drift from the CSS transition it is waiting on.
 *
 *  The unit has to be parsed, not assumed: the build minifies `110ms` to
 *  `.11s`, so reading this as a bare number gave a 0.11ms timeout that fired
 *  on the next frame and emptied the dialog before it had begun to fade. */
function exitMs(): number {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--dur-exit")
    .trim();
  const n = Number.parseFloat(v);
  if (!Number.isFinite(n)) return 110;
  return v.endsWith("ms") ? n : n * 1000;
}

export default function Lightbox() {
  const ref = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [group, setGroup] = useState<Shot[]>([]);
  const [i, setI] = useState(0);
  const shot = group[i];
  /* Clearing the group is what empties the dialog, so it has to wait for the
     exit transition. Held here so a re-open can cancel it: without that,
     opening a new image inside the exit window would be wiped by the timer
     the previous dismissal left running. */
  const clearTimer = useRef<number | null>(null);

  const cancelClear = useCallback(() => {
    if (clearTimer.current !== null) {
      clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }
  }, []);

  useEffect(() => () => cancelClear(), [cancelClear]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement | null)?.closest?.("[data-zoom]");
      if (!(trigger instanceof HTMLElement)) return;
      cancelClear();

      /* The gallery is whatever the image sits in: an explicit [data-gallery]
         if one is set, otherwise the work entry. Grouping by the article means
         each project is its own set without anything being wired up per image,
         and the contact sheet becomes one 11-image gallery for free. */
      const scope =
        trigger.closest("[data-gallery]") ?? trigger.closest("article") ?? document;
      const els = [...scope.querySelectorAll<HTMLElement>("[data-zoom]")];
      setGroup(els.map(toShot));
      setI(Math.max(0, els.indexOf(trigger)));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [cancelClear]);

  // showModal() has to run after the new src is in the DOM, or the dialog opens
  // on the previous image for a frame.
  useEffect(() => {
    const el = ref.current;
    if (!el || !shot) return;
    if (!el.open) el.showModal();
    document.documentElement.style.overflow = "hidden";
  }, [shot]);

  /**
   * Teardown is driven from here rather than from the dialog's `close` event.
   * That event does not bubble, so React's delegated onClose never fires, and
   * it also proved unreliable to observe directly: the symptom was the scroll
   * lock surviving dismissal, leaving the page unscrollable. Every dismissal
   * path funnels through this one function instead, so the lock cannot leak.
   */
  const dismiss = useCallback(() => {
    // The scroll lock is released synchronously, never on the timer: a pending
    // timeout is exactly the kind of thing that leaves the page unscrollable.
    document.documentElement.style.overflow = "";
    const el = ref.current;
    if (el?.open) el.close();
    // close() only drops [open]; CSS holds the dialog in the top layer for the
    // length of the exit. Emptying the group now would fade out a blank box.
    cancelClear();
    clearTimer.current = window.setTimeout(() => {
      clearTimer.current = null;
      setGroup([]);
      setI(0);
    }, exitMs());
  }, [cancelClear]);

  // Kept in a ref so the key handler binds once instead of per navigation.
  // Written in an effect, not during render: refs are not render-time state.
  const groupLenRef = useRef(0);
  useEffect(() => {
    groupLenRef.current = group.length;
  }, [group.length]);

  const step = useCallback((delta: number) => {
    // Wraps, so paging past the end returns to the start rather than
    // dead-ending on a disabled control.
    setI((n) => (n + delta + groupLenRef.current) % groupLenRef.current);
  }, []);

  // A tall screenshot can leave the dialog scrolled far down; the next image
  // should start at its top rather than mid-way through.
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [i]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Esc. `cancel` is preventable, so we take over the dismissal ourselves
    // rather than letting the default close run without teardown.
    const onCancel = (e: Event) => {
      e.preventDefault();
      dismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!groupLenRef.current) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("keydown", onKey);
    };
  }, [dismiss, step]);

  const many = group.length > 1;

  return (
    <dialog
      ref={ref}
      className="lb"
      onClick={(e) => {
        if (e.target === ref.current) dismiss();
      }}
      aria-label={shot ? `Enlarged: ${shot.caption}` : undefined}
    >
      {shot && (
        <div className="lb-scroll" ref={scrollerRef}>
          {/* margin:auto rather than justify-content:center: centred while it
              fits, and no clipped top once a tall screenshot overflows. */}
          <div className="lb-box">
            <img
              className="lb-img"
              src={shot.src}
              alt={shot.alt}
              width={shot.w}
              height={shot.h}
              /* Always the whole image, never the page's crop. A phone screen
                 shown as a short window in the layout is exactly the one you
                 most want to see end to end here, so tall shots render at a
                 legible width and the dialog scrolls. The cap is the image's
                 true pixel width: the pipeline never invents detail and
                 neither does this. */
              style={{ maxWidth: `min(100%, ${shot.w}px)` }}
            />
            <p className="lb-cap">
              <span>{shot.caption}</span>
              <span className="lb-dim">
                {shot.w} × {shot.h}
              </span>
              {many && (
                <span className="lb-count">
                  {i + 1} / {group.length}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {many && (
        <>
          <button
            type="button"
            className="lb-nav lb-prev"
            onClick={() => step(-1)}
            aria-label="Previous image"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="lb-nav lb-next"
            onClick={() => step(1)}
            aria-label="Next image"
          >
            <span aria-hidden="true">→</span>
          </button>
        </>
      )}

      <button type="button" className="lb-close" onClick={dismiss} aria-label="Close">
        <span aria-hidden="true">esc</span>
      </button>
    </dialog>
  );
}
