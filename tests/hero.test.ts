/* The opening of a page: where the `h1` comes from, and which presses draw.

   A card shows a hero that looks right. Only the markup says that a page keeps
   one `h1` when a renderer writes its own. */

import { beforeEach, expect, test } from 'vitest';
import { q, write } from './lib/frame.ts';

const PAGE = `
  <sds-hero id="whole" heading="Start" lead="A line." action="Publish" href="#first" second="Read" second-href="#second" src="assets/typo3-logo.svg"></sds-hero>
  <sds-hero id="alone" heading="Start" action="Publish"></sds-hero>
  <sds-hero id="written" lead="The property" action="Publish" href="#first">
    <h1>The renderer's heading</h1>
  </sds-hero>`;

beforeEach(async () => {
  await write(PAGE);
});

test('the heading is the h1, and the press and the quieter way are links', () => {
  expect(q('#whole h1').textContent).toBe('Start');
  expect(q('#whole .sds-btn--primary').getAttribute('href')).toBe('#first');
  expect(q('#whole .sds-btn--secondary').getAttribute('href')).toBe('#second');
  expect(document.querySelector('#whole sds-figure')).not.toBeNull();
});

test('where the halves stand is not where the text stands', async () => {
  await write('<sds-hero id="low" heading="Start" valign="end"></sds-hero>');
  expect(getComputedStyle(q('#low h1')).textAlign).toBe('start');
  expect(q('#low .sds-hero').classList.contains('sds-split--end')).toBe(true);
});

test('a heading a renderer wrote stands at the display step, as the property does', async () => {
  await write('<sds-hero id="a" heading="Start"></sds-hero><sds-hero id="b"><h1>Start</h1></sds-hero>');
  expect(getComputedStyle(q('#b h1')).fontSize).toBe(getComputedStyle(q('#a h1')).fontSize);
});

test('a picture keeps its frame until the page says plain', async () => {
  await write('<sds-hero id="f" src="a.webp"></sds-hero><sds-hero id="p" plain src="a.webp"></sds-hero>');
  const frame = (id: string): CSSStyleDeclaration => getComputedStyle(q(`#${id} .sds-figure__frame`));
  expect(frame('f').borderTopWidth).not.toBe('0px');
  expect(frame('p').borderTopWidth).toBe('0px');
  expect(frame('p').backgroundColor).toBe('rgba(0, 0, 0, 0)');
});

test('with no picture there is no second half, and with no href no button', () => {
  expect(document.querySelector('#alone sds-figure')).toBeNull();
  expect(document.querySelectorAll('#alone .sds-column')).toHaveLength(1);
  expect(document.querySelector('#alone .sds-btn')).toBeNull();
});

test('blocks between the tags take the place of the lead, and the page keeps one h1', () => {
  expect(document.querySelectorAll('#written h1')).toHaveLength(1);
  expect(q('#written').textContent).not.toContain('The property');
});
