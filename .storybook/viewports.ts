/* The sizes a page is looked at.

   Ordinary screens with ordinary names, because that is what somebody reaching
   for this menu is thinking: show me the phone. Naming each entry after the
   rule it lands on — "rail folds", "wordmark shortens" — was tried and reads as
   jargon in a list you use ten times an hour.

   What the names cost is the guarantee the names used to carry, and it is
   worth stating because it is easy to lose by editing this list: the four
   `max-width` queries in `components.css` cut the scale into five bands, and
   the layout looks different in each. A list of sizes that misses a band makes
   that state unreachable — no entry to pick, nothing to see, and nothing to say
   so. `tests/viewports.spec.ts` reads the queries back out of the stylesheets
   and holds this list to covering every band, whatever the entries are called.
   That is why 480 is here between the tablet and the phone: without it, the
   width where the search field is gone but the wordmark is still whole cannot
   be selected at all.

   Heights are plausible rather than measured — the pane scrolls, and nothing
   these widths show depends on one. */

import type { Viewport, ViewportMap } from 'storybook/viewport';

interface Size {
  /* The key, and what a URL carries: `?globals=viewport:phone`.

     A word rather than the width, which is what this was first: an object
     keyed `'1440'` and `'860'` comes back out of `Object.entries` sorted
     ascending, because a key that reads as an array index is ordered as one —
     so the toolbar listed the phone first and the desk last, and the reading
     order of the whole list was upside down. */
  key: string;
  name: string;
  width: number;
  height: number;
  type: Viewport['type'];
}

/** Widest first — the order a page sheds in, and the order the menu reads. */
const SIZES: readonly Size[] = [
  { key: 'desktop', name: 'Desktop', width: 1440, height: 900, type: 'desktop' },
  { key: 'laptop', name: 'Laptop', width: 1280, height: 800, type: 'desktop' },
  { key: 'tablet', name: 'Tablet', width: 1024, height: 768, type: 'tablet' },
  { key: 'tablet-portrait', name: 'Tablet portrait', width: 768, height: 1024, type: 'tablet' },
  { key: 'phone-large', name: 'Large phone', width: 480, height: 800, type: 'mobile' },
  { key: 'phone', name: 'Phone', width: 375, height: 812, type: 'mobile' },
];

/** What `tests/viewports.spec.ts` checks the stylesheet's bands against. */
export const VIEWPORT_WIDTHS: readonly number[] = SIZES.map((size) => size.width);

const entry = (size: Size): [string, Viewport] => [
  size.key,
  { name: size.name, type: size.type, styles: { width: `${size.width}px`, height: `${size.height}px` } },
];

export const VIEWPORTS: ViewportMap = Object.fromEntries(SIZES.map(entry));
