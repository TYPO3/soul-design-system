/* Every state the layout has is a state you can select.

   The toolbar's entries are ordinary screen sizes, which is what a person
   picking one is thinking about. The stylesheet thinks in something else: four
   `max-width` queries that cut the scale into five bands, each of which draws
   the page differently. The two lists have no reason to agree, and nothing
   makes them — so a size list can quietly miss a band, and then a state of the
   layout exists with no way to look at it. That is the failure this catches,
   and it looks like nothing at all: a menu of six plausible sizes, one of which
   is not there.

   Not a check that the sizes *are* the breakpoints. They are deliberately not;
   naming a menu after the rules it lands on reads as jargon. This asks only
   that the menu reaches everywhere, which stays true however the sizes are
   named and survives a breakpoint moving — until it moves far enough to empty
   a band, which is exactly when somebody should hear about it.

   No browser: both sides are files. */

import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { VIEWPORT_WIDTHS, VIEWPORTS } from '../.storybook/viewports.ts';

const STYLES = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'styles');

function stylesheets(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return stylesheets(path);
    return entry.name.endsWith('.css') ? [path] : [];
  });
}

/** Every width the class layer sheds at, widest first. */
function breakpoints(): number[] {
  const widths = new Set<number>();
  for (const sheet of stylesheets(STYLES)) {
    for (const [, width] of readFileSync(sheet, 'utf8').matchAll(/@media[^{]*?\(\s*max-width:\s*(\d+)px\s*\)/g)) {
      widths.add(Number(width));
    }
  }
  return [...widths].sort((a, b) => b - a);
}

/* Which band a width falls in: 0 above every query, then one per query as they
   start applying. `max-width` includes its own value, so a width equal to a
   breakpoint is already inside it. */
const band = (width: number, folds: readonly number[]): number =>
  folds.filter((fold) => width <= fold).length;

/* Named by the range it covers, because "band 3" is not something anyone can
   act on. */
function bandLabel(index: number, folds: readonly number[]): string {
  const upper = folds[index - 1];
  const lower = folds[index];
  if (upper === undefined) return `wider than ${folds[0]}px`;
  return lower === undefined ? `${upper}px and narrower` : `${upper}px down to ${lower + 1}px`;
}

test('every state of the layout has a size that reaches it', () => {
  const folds = breakpoints();
  expect(folds.length, 'the layout should have breakpoints to cover').toBeGreaterThan(0);

  const reached = new Set(VIEWPORT_WIDTHS.map((width) => band(width, folds)));
  const missing = Array.from({ length: folds.length + 1 }, (_, index) => index)
    .filter((index) => !reached.has(index))
    .map((index) => bandLabel(index, folds));

  expect(missing, 'a width range the layout draws differently, with no viewport that lands in it').toEqual([]);
});

test('the list reads widest first', () => {
  /* Not a formality: the map was first keyed by the widths themselves, and an
     object hands back integer-like keys in ascending order however they went
     in, so the toolbar read bottom-up. Order is a property of the keys here,
     which means it can be lost again by renaming one. */
  expect(Object.values(VIEWPORTS).map((viewport) => viewport.styles.width)).toEqual(
    [...VIEWPORT_WIDTHS].sort((a, b) => b - a).map((width) => `${width}px`),
  );
});
