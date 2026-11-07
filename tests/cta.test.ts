/* A call to action: which presses it draws, and what a press is.

   A card shows a press that looks right. Only the markup says where it goes,
   and that a press with nowhere to go is not there. */

import { beforeEach, expect, test } from 'vitest';
import { q, write } from './lib/frame.ts';

const PAGE = `
  <sds-cta id="both" heading="Start" action="Publish" href="#first" second="Read" second-href="#second"></sds-cta>
  <sds-cta id="nowhere" heading="Start" action="Publish"></sds-cta>
  <sds-cta id="alone" heading="Start" second="Read" second-href="#second"></sds-cta>
  <sds-cta id="written" heading="Start" body="The property" action="Publish" href="#first">
    <p>The <a href="#more">line</a> between the tags.</p>
  </sds-cta>`;

beforeEach(async () => {
  await write(PAGE);
});

test('each press is a link, the first one primary and the second one quieter', () => {
  const first = q('#both .sds-btn--primary') as HTMLAnchorElement;
  const second = q('#both .sds-btn--secondary') as HTMLAnchorElement;
  expect(first.tagName).toBe('A');
  expect(first.getAttribute('href')).toBe('#first');
  expect(second.tagName).toBe('A');
  expect(second.getAttribute('href')).toBe('#second');
});

test('the two presses stand at one height side by side', () => {
  const heights = [...document.querySelectorAll<HTMLElement>('#both .sds-btn')].map((b) => b.getBoundingClientRect().height);
  expect(heights).toHaveLength(2);
  expect(heights[0]).toBe(heights[1]);
});

test('an action with nowhere to go draws no button', () => {
  expect(document.querySelector('#nowhere .sds-btn')).toBeNull();
});

test('a second press with no first draws no button', () => {
  expect(document.querySelector('#alone .sds-btn')).toBeNull();
});

test('the line between the tags wins over the property and keeps its link', () => {
  const body = q('#written .sds-cta__body');
  expect(body.textContent).not.toContain('The property');
  expect(body.querySelector('a')?.getAttribute('href')).toBe('#more');
});
