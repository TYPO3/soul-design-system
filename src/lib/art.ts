/* The one picture a figure, a viewer, a teaser or a lockup shows.

   One file, in both modes. There is no light copy and no dark copy: a drawing
   is written in the tokens and takes the mode of wherever it is placed, and a
   photograph is a photograph in either. A pair of files could not be that —
   it had to be told which mode it was in, so every surface that showed one
   carried the switch, and a drawing shown in a card with a mode forced on it
   was showing whichever file the page had guessed.

   Which means a drawing cannot be linked. An `<img>` renders its file in a
   document of its own, where `--text-primary` is not declared and the fill
   falls back to the light hex — the same reason `sds-icon` is a `<use>` and
   not an image. So a drawing is referenced into this document instead: the
   shapes carry `fill="var(--token, #light)"`, inherited properties cross into
   the shadow tree `<use>` builds, and the drawing arrives in the mode of the
   thing it sits in. The hex fallback is not dead weight — it is what the file
   renders as on its own, in a README or a tab, where there are no tokens.

   **Every SVG is referenced, not only the ones this repository ships.** The
   file a project configures as its signet is a drawing in exactly the same
   sense, and it is the case that matters: a mark linked as an image is a mark
   that cannot take the page's ink, which is the whole reason this system used
   to carry a signet component with the drawing pasted into it. What it takes
   to be referenced is one line in the file — `id="art"` on the root `<svg>` —
   and `docs/guidelines/artwork.rst` is that written down for whoever draws
   one. A raster file is still linked: there is nothing in a photograph for a
   mode to change.

   What `<use>` will not carry across is the size, so the coordinate system has
   to come from somewhere. A file that names its root is already the answer —
   the root carries the `viewBox`, and the reference scales into whatever
   width and height the wrapper was given. The drawings under `assets/diagrams/`
   name a `<g>` instead, which carries none, so `scripts/diagrams.ts` reads
   their coordinate systems out of the files and the wrapper states one. A
   caller never names it either way: a caller naming a number that is already
   in the file is a number that can be wrong. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { DIAGRAM_VIEWBOX } from '../components/diagrams.generated.ts';

/** What the reference points at — the root of the file, or the group a drawing
    under `assets/diagrams/` wraps itself in. Every file names it the same. */
const GROUP = 'art';

/* A query string or a fragment may follow the extension, and neither makes the
   file something other than an SVG. */
const DRAWING = /\.svg(?:[?#].*)?$/i;

/* A file on somebody else's server. Linked whatever it is, for the reason
   above: a reference reads the file itself, and a browser will not do that
   across origins — so a drawing referenced from another host arrives as
   nothing at all. Knowing this belongs here rather than in each surface that
   points at a file; the Guides theme used to decide it a second time, in a
   template, and a surface that forgot to would have shown an empty box. */
const ELSEWHERE = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;

/* Composed as a string rather than as bindings, because half of these
   attributes are not written at all. A binding that resolves to `nothing`
   removes its attribute and leaves the space in front of it, and a specimen
   card is a file people read: an element with four optional attributes would
   ship with four gaps in the tag. `tidyTags` in the renderer cleans the end of
   a tag and cannot clean the middle of one. */
const ESCAPE: Readonly<Record<string, string>> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const attr = (name: string, value: string | number | undefined): string =>
  value === undefined || value === '' ? '' : ` ${name}="${String(value).replace(/[&<>"]/g, (c) => ESCAPE[c] as string)}"`;

/**
 * The picture, as whatever it has to be to arrive in the right mode.
 *
 * @param cls    the class the surface hangs its own sizing on, `sds-art` alone
 *               unless a surface needs more.
 * @param width  a size in pixels, for a picture the stylesheet does not size —
 *               a mark in a bar. A figure passes neither and fills its column.
 * @param height
 */
export function art(
  src: string,
  alt: string,
  cls = 'sds-art',
  width?: number,
  height?: number,
): TemplateResult {
  /* `aria-label` on the wrapper rather than the `<title>` inside the file:
     only one of the two would be read, and the one the author wrote beside the
     picture is the one that describes why it is there. Empty says decorative,
     which is what a mark beside a wordmark that already spells the name is —
     and hidden is not the same as left unnamed. */
  const name = alt ? attr('role', 'img') + attr('aria-label', alt) : attr('aria-hidden', 'true');
  const size = attr('width', width) + attr('height', height);

  if (!DRAWING.test(src) || ELSEWHERE.test(src)) {
    /* `alt` is written even when it is empty: on an image that is the whole
       difference between decorative and unlabelled, and the two are read out
       very differently. */
    const escaped = alt.replace(/[&<>"]/g, (c) => ESCAPE[c] as string);
    return html`${unsafeHTML(`<img${attr('class', cls)} src="${src}" alt="${escaped}"${size}>`)}`;
  }

  const viewBox = DIAGRAM_VIEWBOX[src.split('/').pop()?.replace(DRAWING, '') ?? ''];
  return html`${unsafeHTML(
    `<svg${attr('class', cls)}${attr('viewBox', viewBox)}${size}${name}>` +
      `<use href="${src}#${GROUP}"></use></svg>`,
  )}`;
}
