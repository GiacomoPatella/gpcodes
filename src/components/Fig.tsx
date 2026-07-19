import IMAGES from "@/lib/images.json";

type Entry = { w: number; h: number; zoom?: { w: number; h: number }; unverified?: boolean };
const MAP = IMAGES as Record<string, Entry>;

/**
 * The one image primitive on the site. Every figure goes through here, which is
 * what makes "zoomable by default" true by construction rather than by
 * remembering to opt each image in.
 *
 * Dimensions come from src/lib/images.json, written by scripts/images.mjs from
 * the real files. They used to be hand-typed `aspectRatio` strings in page.tsx,
 * and one had already drifted from its file after a re-crop.
 *
 * The frame is a <button>, not a div with a click handler: zoom has to be
 * reachable by keyboard. The architecture map is already logged as
 * pointer-only debt and this should not add more of the same.
 */
export default function Fig({
  src,
  alt,
  caption,
  showPath = false,
  priority = false,
  ratio,
  objectPosition,
  className,
}: {
  src: string;
  alt: string;
  caption: string;
  /** Print the file path alongside the caption, the machine-surface tic. */
  showPath?: boolean;
  /** Eager-load. Set on the first image only; everything else stays lazy. */
  priority?: boolean;
  /**
   * A deliberate crop, e.g. "16 / 10", overriding the file's real ratio.
   *
   * This exists because several figures crop on purpose rather than by
   * accident: the PwC frames carry Lorem ipsum, so they are cropped to
   * interaction detail and the caption says so. Feeding those the true ratio
   * would un-crop them and show the placeholder copy the crop exists to hide.
   * Pair with objectPosition to choose which part survives.
   *
   * The manifest stays the default. Only pass this when the crop is an
   * editorial decision you could defend out loud.
   */
  ratio?: string;
  /** Which part of a cropped image to keep, e.g. "top". */
  objectPosition?: string;
  className?: string;
}) {
  const meta = MAP[src];
  if (!meta) {
    // Loud on purpose: a missing entry means the pipeline never saw this file,
    // so it is probably a hand-dropped asset of unknown provenance.
    throw new Error(`Fig: no manifest entry for ${src}. Run scripts/images.mjs.`);
  }

  // Falls back to the display image when the source had nothing more to give,
  // so the dialog always opens even where no zoom variant exists.
  const zoomSrc = meta.zoom ? src.replace(/\.jpg$/, "-zoom.jpg") : src;
  const zoom = meta.zoom ?? { w: meta.w, h: meta.h };

  // A crop is a layout decision only: it shapes the frame on the page and
  // stops there. The lightbox always opens the whole image, because a phone
  // screen shown as a short window here is exactly the one you want to read
  // end to end there.

  return (
    <figure className={className ? `fig ${className}` : "fig"}>
      <button
        type="button"
        className="fig-frame"
        style={{ aspectRatio: ratio ?? `${meta.w} / ${meta.h}` }}
        data-zoom={zoomSrc}
        data-zoom-w={zoom.w}
        data-zoom-h={zoom.h}
        data-zoom-alt={alt}
        data-zoom-caption={caption}
        aria-label={`Enlarge: ${caption}`}
      >
        <img
          src={src}
          alt={alt}
          width={meta.w}
          height={meta.h}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          {...(priority ? { fetchPriority: "high" as const } : {})}
          style={objectPosition ? { objectPosition } : undefined}
        />
      </button>
      <figcaption>
        <span>{caption}</span>
        {showPath && <span className="path">{src.replace(/^\//, "")}</span>}
      </figcaption>
    </figure>
  );
}
