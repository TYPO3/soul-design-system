/* The one picture a figure, a viewer, a teaser or a lockup shows.

   **Every SVG is referenced, everything else is linked.** An `<img>` renders
   its file in a document of its own, where no token is declared and every fill
   falls back to its light hex; a `<use>` builds a shadow tree that inherited
   properties cross, so one file takes the mode of whatever it sits in. Being
   referenced costs a file one line — `id="art"` on the root.

   `<use>` carries no size across: a file naming its root carries its own
   `viewBox`, and `make diagrams` reads one out of each drawing that does not. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { DIAGRAM_VIEWBOX } from '../components/diagrams.generated.ts';

/** What the reference points at — the root of the file, or the group a drawing
    under `assets/diagrams/` wraps itself in. Every file names it the same. */
const GROUP = 'art';

/* A query string or a fragment may follow the extension, and neither makes the
   file something other than an SVG. */
const DRAWING = /\.svg(?:[?#].*)?$/i;

/* A file on somebody else's server. Linked whatever it is: a reference reads
   the file, and a browser will not do that across origins, so a drawing
   referenced from another host arrives as nothing. Decided here rather than in
   every surface that points at a file. */
const ELSEWHERE = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;

/* A string rather than bindings, because half of these attributes are not
   written. A binding resolving to `nothing` leaves the space in front of it,
   and `tidyTags` cleans the end of a tag but not the middle — so a card would
   ship with a gap per optional attribute. */
const ESCAPE: Readonly<Record<string, string>> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const attr = (name: string, value: string | number | undefined): string =>
  value === undefined || value === '' ? '' : ` ${name}="${String(value).replace(/[&<>"]/g, (c) => ESCAPE[c] as string)}"`;

/** The picture, as whatever it has to be to arrive in the right mode. `cls` is
    what the surface hangs its own sizing on; a width and height are for a
    picture the stylesheet does not size, like a mark in a bar — a figure passes
    neither and fills its column. */
export function art(
  src: string,
  alt: string,
  cls = 'sds-art',
  width?: number,
  height?: number,
): TemplateResult {
  /* `aria-label` on the wrapper, not the `<title>` in the file: only one is
     read, and the author wrote this one beside the picture. Empty says
     decorative, which is not the same as left unnamed. */
  const name = alt ? attr('role', 'img') + attr('aria-label', alt) : attr('aria-hidden', 'true');
  const size = attr('width', width) + attr('height', height);

  if (!DRAWING.test(src) || ELSEWHERE.test(src)) {
    /* Written even when empty: on an image that is the difference between
       decorative and unlabelled. */
    const escaped = alt.replace(/[&<>"]/g, (c) => ESCAPE[c] as string);
    return html`${unsafeHTML(`<img${attr('class', cls)} src="${src}" alt="${escaped}"${size}>`)}`;
  }

  const viewBox = DIAGRAM_VIEWBOX[src.split('/').pop()?.replace(DRAWING, '') ?? ''];
  return html`${unsafeHTML(
    `<svg${attr('class', cls)}${attr('viewBox', viewBox)}${size}${name}>` +
      `<use href="${src}#${GROUP}"></use></svg>`,
  )}`;
}
