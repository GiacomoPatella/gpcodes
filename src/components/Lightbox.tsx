"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Shot = {
  src: string;
  w: number;
  h: number;
  alt: string;
  caption: string;
  /** Set when the figure crops on purpose; the lightbox keeps that framing. */
  ratio?: string;
  position?: string;
};

/**
 * One dialog for the whole page, opened by delegation from any [data-zoom]
 * trigger that Fig renders. Mounting a dialog per image would put 48 of them in
 * the document for a feature used a handful of times; this way the cost is one
 * element and one listener no matter how many images the page grows.
 *
 * Native <dialog>::backdrop, so no scrim element, no focus-trap library, and
 * focus returns to the trigger on close for free. Without JS the buttons simply
 * do nothing and the display image stays visible, which is an acceptable floor.
 */
export default function Lightbox() {
  const ref = useRef<HTMLDialogElement>(null);
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement | null)?.closest?.("[data-zoom]");
      if (!(trigger instanceof HTMLElement)) return;
      setShot({
        src: trigger.dataset.zoom!,
        w: Number(trigger.dataset.zoomW),
        h: Number(trigger.dataset.zoomH),
        alt: trigger.dataset.zoomAlt ?? "",
        caption: trigger.dataset.zoomCaption ?? "",
        ratio: trigger.dataset.zoomRatio,
        position: trigger.dataset.zoomPosition,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

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
    document.documentElement.style.overflow = "";
    setShot(null);
    const el = ref.current;
    if (el?.open) el.close();
  }, []);

  // Esc. `cancel` is preventable, so we take over the dismissal ourselves
  // rather than letting the default close run without teardown.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      dismiss();
    };
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, [dismiss]);

  return (
    <dialog
      ref={ref}
      className="lb"
      // Clicking the backdrop resolves to the dialog itself, so anything that
      // is not the dialog box is a dismiss.
      onClick={(e) => {
        if (e.target === ref.current) dismiss();
      }}
      aria-label={shot ? `Enlarged: ${shot.caption}` : undefined}
    >
      {shot && (
        <div className="lb-box">
          {shot.ratio ? (
            // Cropped figure: same framing, just bigger. Opening these on the
            // full image would re-frame a shot that was cut deliberately.
            <div
              className="lb-crop"
              style={{ aspectRatio: shot.ratio, maxWidth: `min(100%, ${shot.w}px)` }}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                style={{ objectPosition: shot.position ?? "center" }}
              />
            </div>
          ) : (
            <img
              className="lb-img"
              src={shot.src}
              alt={shot.alt}
              width={shot.w}
              height={shot.h}
              // The honest ceiling. The zoom variant is already capped at the
              // source resolution by the pipeline, and this stops the browser
              // stretching it past that on a large display: several of these
              // sources are genuinely small and scaling them further would only
              // invent blur.
              style={{ maxWidth: `min(100%, ${shot.w}px)` }}
            />
          )}
          <p className="lb-cap">
            <span>{shot.caption}</span>
            <span className="lb-dim">
              {shot.ratio ? `${shot.w} wide, cropped` : `${shot.w} × ${shot.h}`}
            </span>
          </p>
        </div>
      )}
      <button type="button" className="lb-close" onClick={dismiss} aria-label="Close">
        <span aria-hidden="true">esc</span>
      </button>
    </dialog>
  );
}
