/* The one picture a figure, a viewer, a card or a lockup shows.

   **Every picture is a link.** An `<img>` renders its file in a document of its
   own, where no token exists. So a drawing arrives in its exported colours and
   stays in them on a page that has gone dark. That is the cost, every picture
   pays it equally, and `--surface-art` under it is what makes it read.

   The alternative is a reference, and it is out. `<use>` builds a shadow tree
   that inherited properties cross, so one file takes the mode of whatever it
   sits in. But it resolves only against a fragment that names an `id` inside
   the file. So every drawing needs that group, every renderer has to open it
   to check, and a file that never paid draws *nothing*, in silence.
   `docs/design-system/artwork.rst` says what has to ship before SVG 2 makes
   that a route a site can build on. Until then a picture that arrives beats
   a picture that follows the mode. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/** The name a drawing gives the part of itself a reference can reach. It is
    the group a drawing under `assets/diagrams/` wraps itself in, and what the
    card generator puts the artwork in place of. No page reads it. */
export const REF = 'soul-ref';

/* A query string or a fragment can follow the extension, and neither makes the
   file something other than an SVG. */
const DRAWING = /\.svg(?:[?#].*)?$/i;

/* A string rather than bindings, because half of these attributes stay out.
   A binding that resolves to `nothing` leaves the space in front of it, and
   `tidyTags` cleans the end of a tag but not the middle. So a card ships
   with a gap per optional attribute. */
const ESCAPE: Readonly<Record<string, string>> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const attr = (name: string, value: string | number | undefined): string =>
  value === undefined || value === '' ? '' : ` ${name}="${String(value).replace(/[&<>"]/g, (c) => ESCAPE[c] as string)}"`;

/** If the picture keeps its exported colours, so the ground under it has to
    be the one those colours are for. A drawing is such a picture; a
    photograph brought its own ground and never was. `--surface-art` in
    `components.css` is what this decides. */
export const exported = (src: string): boolean => DRAWING.test(src);

export interface ArtOptions {
  /** What the surface hangs its own sizing on. */
  cls?: string;
  /** For a picture the stylesheet does not size, like a mark in a bar — a
      figure passes neither and fills its column. */
  width?: number;
  height?: number;
}

/** The picture. */
export function art(src: string, alt: string, options: ArtOptions = {}): TemplateResult {
  const { cls = 'sds-art', width, height } = options;
  const size = attr('width', width) + attr('height', height);
  /* Written even when empty: on an image that is the difference between
     decorative and unlabelled. */
  const escaped = alt.replace(/[&<>"]/g, (c) => ESCAPE[c] as string);
  return html`${unsafeHTML(`<img${attr('class', cls)} src="${src}" alt="${escaped}"${size}>`)}`;
}
