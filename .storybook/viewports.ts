/* The sizes a page is looked at.

   Ordinary screens with ordinary names, because that is what somebody reaching
   for this menu is thinking: show me the phone. Naming each entry after the
   rule it lands on reads as jargon in a list used ten times an hour.

   What the names cost is the guarantee they used to carry: the `max-width`
   queries cut the scale into bands, and a list missing one makes that state
   unreachable with nothing to say so. `tests/viewports.spec.ts` reads the
   queries out of the stylesheets and holds this list to every band. */

import type { Viewport, ViewportMap } from 'storybook/viewport';

interface Size {
  /* The key, and what a URL carries: `?globals=viewport:phone`. A word rather
     than the width, because a key that reads as an array index is ordered as
     one — `Object.entries` sorts `'1440'` and `'860'` ascending, and the
     toolbar lists the phone first with the whole order upside down. */
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
