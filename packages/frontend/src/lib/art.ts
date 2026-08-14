/* The one picture a figure, a viewer, a card or a lockup shows.

   **Every picture is linked.** An `<img>` renders its file in a document of its
   own, where no token is declared, so a drawing arrives in the colours it was
   exported with and stays in them on a page that has gone dark. That is the
   cost, it is paid by every picture equally, and `--surface-art` under it is
   what makes it read.

   The alternative is a reference — `<use>` builds a shadow tree that inherited
   properties cross, so one file takes the mode of whatever it sits in — and it
   is not taken. It resolves only against a fragment naming an `id` inside the
   file, which means every drawing has to be prepared and every renderer has to
   open it to find out whether it was; a file that never paid draws *nothing*,
   silently. SVG 2 removes the fragment and lets a reference name the file, and
   `docs/design-system/artwork.rst` says what has to ship before that is a
   mechanism a site can be built on. Until then a picture that arrives beats a
   picture that follows the mode. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/** The name a drawing gives the part of itself that may be reached — the group
    a drawing under `assets/diagrams/` wraps itself in, and what the card
    generator puts the artwork in place of. No page reads it. */
export const REF = 'soul-ref';

/* A query string or a fragment may follow the extension, and neither makes the
   file something other than an SVG. */
const DRAWING = /\.svg(?:[?#].*)?$/i;

/* A string rather than bindings, because half of these attributes are not
   written. A binding resolving to `nothing` leaves the space in front of it,
   and `tidyTags` cleans the end of a tag but not the middle — so a card would
   ship with a gap per optional attribute. */
const ESCAPE: Readonly<Record<string, string>> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const attr = (name: string, value: string | number | undefined): string =>
  value === undefined || value === '' ? '' : ` ${name}="${String(value).replace(/[&<>"]/g, (c) => ESCAPE[c] as string)}"`;

/** Whether the picture keeps the colours it was exported with, so the ground
    under it has to be one those colours were drawn for. A drawing is such a
    picture; a photograph brought its own ground and never was — `--surface-art`
    in `components.css` is what this decides. */
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
