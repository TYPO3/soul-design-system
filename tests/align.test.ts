/* Where a column stands, top to foot. Measured, because a class says what the
   author asks for, and only the box says where it lands. */

import { expect, test } from 'vitest';
import { box, q, write } from './lib/frame.ts';

const TALL = '<div style="height:200px"></div>';
const LOW = '<div style="height:40px"></div>';

const halves = (cls: string, a: string): string => `
  <div id="split" class="sds-split ${cls}" style="--split-min:100px;width:600px">
    <div class="sds-column">${TALL}</div>
    <div id="one" class="sds-column ${a}">${LOW}</div>
  </div>`;

const place = (): number => box(q('#one')).top - box(q('#split')).top;

test.each([
  ['sds-column--start', 0],
  ['sds-column--center', 80],
  ['sds-column--end', 160],
])('one half, %s, stands where it says in a plain split', async (cls, top) => {
  await write(halves('', cls));
  expect(place()).toBeCloseTo(top, 0);
});

test.each([
  ['sds-column--start', 0],
  ['sds-column--end', 160],
])('the same word lands in the same place under leads-end, %s', async (cls, top) => {
  await write(halves('sds-split--leads-end', cls));
  expect(place()).toBeCloseTo(top, 0);
});

test('one half overrides what the split says for the rest', async () => {
  await write(halves('sds-split--center', 'sds-column--end'));
  expect(place()).toBeCloseTo(160, 0);
});

const cells = (attrs: string): string => `
  <sds-grid id="grid" ${attrs} columns="2" style="width:600px">
    <div>${TALL}</div>
    <div id="one">${LOW}</div>
  </sds-grid>`;

const inRow = (): number => box(q('#one')).top - box(q('#grid')).top;

test.each([
  ['start', 0],
  ['center', 80],
  ['end', 160],
])('a shorter item in a grid, %s, stands where it says', async (valign, top) => {
  await write(cells(`valign="${valign}"`));
  expect(inRow()).toBeCloseTo(top, 0);
});

test('with nothing said an item fills its row, and a flush wall stays whole', async () => {
  await write(cells(''));
  expect(box(q('#one')).height).toBeCloseTo(200, 0);
  await write(cells('valign="center" variant="flush"'));
  expect(box(q('#one')).height).toBeCloseTo(200, 0);
});

test('the position moves the box and leaves the text where it was', async () => {
  await write(cells('valign="center"'));
  expect(getComputedStyle(q('#one')).textAlign).toBe('start');
});
