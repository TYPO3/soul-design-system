/* A state icon reports its status in colour, and every other icon follows the
   text. A computed colour says so, and a class on the markup does not. */

import { expect, test } from 'vitest';
import { q, write } from './lib/frame.ts';

const ink = (id: string): string => getComputedStyle(q(`#${id} svg`)).color;

test.each(['ok', 'warn', 'error'])('tone %s draws a colour other than the text', async (tone) => {
  await write(`<p style="color:rgb(1, 2, 3)"><sds-icon id="i" name="actions-check-circle" tone="${tone}" label="x"></sds-icon></p>`);
  expect(ink('i')).not.toBe('rgb(1, 2, 3)');
});

test('with no tone, or a word it does not have, the icon follows the text', async () => {
  await write(`<p style="color:rgb(1, 2, 3)">
    <sds-icon id="a" name="actions-check-circle"></sds-icon>
    <sds-icon id="b" name="actions-check-circle" tone="loud"></sds-icon></p>`);
  expect(ink('a')).toBe('rgb(1, 2, 3)');
  expect(ink('b')).toBe('rgb(1, 2, 3)');
});
