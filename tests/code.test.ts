/* A code block whose line is longer than its column.

   The line scrolls inside the block rather than widens the column, which
   the cards show. What they cannot show is who can reach the end of it. A
   box that scrolls and takes no focus is one a reader with no pointer never
   scrolls. And axe names it only at a width where a line runs out. */

import { afterEach, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import * as code from '../stories/components/Code.stories.ts';
import { frames, mount, q, stories } from './lib/frame.ts';

const { Languages } = stories(code);

afterEach(() => page.viewport(1280, 900));

test('a block a line runs out of is a keyboard stop, and the keys scroll it', async () => {
  await page.viewport(414, 900);
  await frames();
  await mount(Languages);

  const long = [...document.querySelectorAll<HTMLElement>('.sds-code__body')].find((pre) => pre.scrollWidth > pre.clientWidth);
  expect(long, 'the story must hold a line longer than a phone is wide').toBeDefined();
  const body = long as HTMLElement;

  /* Reached with Tab rather than focused by script: the stop has to be on
     the page's own order. */
  body.previousElementSibling?.querySelector<HTMLElement>('button')?.focus();
  await userEvent.tab();
  expect(document.activeElement, 'the block comes after its head in the order').toBe(body);

  /* And the ring draws inside the frame, which clips what draws outside. */
  expect(parseFloat(getComputedStyle(body).outlineOffset), 'the ring stands inside the box').toBeLessThan(0);

  await userEvent.keyboard('{ArrowRight}');
  await expect.poll(() => body.scrollLeft, { message: 'the keys scroll the line' }).toBeGreaterThan(0);
});

test('a block the column holds whole is a stop as well', async () => {
  await mount(Languages);
  const short = q<HTMLElement>('.sds-code__body');
  expect(short.getAttribute('tabindex'), 'one rule for every block, not a measurement').toBe('0');
});
