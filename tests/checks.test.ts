/* A list with checks. A wrapped line does not run under the glyph, and a nested
   list keeps its own mark. */

import { expect, test } from 'vitest';
import { box, q, write } from './lib/frame.ts';

const PAGE = `<div style="width:220px">
  <sds-checks id="plain"><ul><li id="item">A long item that runs over more than one line of its box.<ul id="in"><li>Nested</li></ul></li></ul></sds-checks>
  <sds-checks id="ok" tone="ok"><ul><li id="green">An item</li></ul></sds-checks>
</div>`;

const glyph = (id: string): CSSStyleDeclaration => getComputedStyle(q(`#${id}`), '::before');

test('every item carries the icon as a mask, and no marker of the browser', async () => {
  await write(PAGE);
  expect(glyph('item').maskImage).toContain('svg');
  expect(getComputedStyle(q('#plain ul')).listStyleType).not.toBe('disc');
  expect(q('#plain ul').tagName).toBe('UL');
});

test('the text keeps its indent, so a wrapped line stands under the first', async () => {
  await write(PAGE);
  expect(box(q('#item')).left).toBeGreaterThan(box(q('#plain')).left);
  expect(parseFloat(glyph('item').left)).toBeLessThan(0);
});

test('the tone is the colour of the check and nothing else', async () => {
  await write(PAGE);
  expect(glyph('green').backgroundColor).not.toBe(glyph('item').backgroundColor);
  expect(getComputedStyle(q('#green')).color).toBe(getComputedStyle(q('#item')).color);
});

test('a list inside an item keeps its own mark', async () => {
  await write(PAGE);
  expect(getComputedStyle(q('#in')).listStyleType).toBe('circle');
  expect(glyph('in').content).toBe('none');
});
