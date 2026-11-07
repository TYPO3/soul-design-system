/* A wall of marks: the marks survive the upgrade, and each keeps its name. */

import { beforeEach, expect, test } from 'vitest';
import { box, q, write } from './lib/frame.ts';

const PAGE = `
  <sds-logos id="wall" label="Used by">
    <img src="assets/typo3-logo.svg" alt="TYPO3" />
    <a href="#tryout"><img src="assets/tryout-signet-m.svg" alt="Tryout" /></a>
  </sds-logos>
  <sds-logos id="bare"><img src="assets/typo3-logo.svg" alt="TYPO3" /></sds-logos>`;

beforeEach(async () => {
  await write(PAGE);
});

test('the marks stand directly in the list, each with its name', () => {
  const list = q('#wall .sds-logos__list');
  expect(list.querySelector(':scope > img')?.getAttribute('alt')).toBe('TYPO3');
  expect(list.querySelector(':scope > a > img')?.getAttribute('alt')).toBe('Tryout');
});

test('a mark stands free, in an ink that follows the mode', async () => {
  const mark = (): CSSStyleDeclaration => getComputedStyle(q('#wall .sds-logos__list > img'));
  await write(PAGE, { theme: 'light' });
  const light = mark().filter;
  expect(mark().backgroundColor).toBe('rgba(0, 0, 0, 0)');
  await write(PAGE, { theme: 'dark' });
  expect(mark().filter).not.toBe(light);
  expect(mark().filter).toContain('invert');
});

const many = (width: number): string =>
  `<div style="width:${width}px"><sds-logos id="many">${
    Array.from({ length: 15 }, (_, i) => `<img src="assets/typo3-logo.svg" alt="Project ${i + 1}" />`).join('')
  }</sds-logos></div>`;

test.each([1000, 600, 200])('many marks at %i px: one tile width, straight columns, nothing runs out', async (width) => {
  await write(many(width));
  const list = q('#many .sds-logos__list');
  const tiles = [...list.children].map((tile) => box(tile));
  expect(new Set(tiles.map((tile) => Math.round(tile.width))).size, 'every tile, the last row too').toBe(1);
  const across = tiles.filter((tile) => Math.round(tile.top) === Math.round(tiles[0]!.top)).length;
  expect(new Set(tiles.map((tile) => Math.round(tile.left))).size, 'the columns stay straight').toBe(across);
  expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
});

test('with no label no line stands over the wall', () => {
  expect(document.querySelector('#bare .sds-eyebrow')).toBeNull();
  expect(q('#wall .sds-eyebrow').textContent).toBe('Used by');
});
