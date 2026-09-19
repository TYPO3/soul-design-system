/* The mode the page is in, as one press that changes it.

   One press steps to the next of three: the machine's setting, light,
   dark, and round again. The button watches the document rather than
   owns it, so a choice written by the boot line or by another tab shows
   on it. What it says out loud names the state and where the press goes.
   None of it shows in a picture of a button. */

import { afterEach, beforeEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { q, settle, write } from './lib/frame.ts';

const button = (): HTMLButtonElement => q<HTMLButtonElement>('sds-theme button');
const said = (): string => button().getAttribute('aria-label') ?? '';
const shownMark = (): string =>
  ['machine', 'light', 'dark'].filter((state) => getComputedStyle(q(`.sds-theme__mark--${state}`)).opacity !== '0').join(',');
const heard: (string | null)[] = [];
document.addEventListener('sds-theme-change', (event) => heard.push((event as CustomEvent<{ theme: string | null }>).detail.theme));

beforeEach(() => {
  localStorage.clear();
  heard.length = 0;
});

afterEach(() => {
  document.documentElement.dataset['theme'] = 'dark';
});

test('the button reads the document, and says where it is and where a press goes', async () => {
  await write('<sds-theme></sds-theme>', { theme: 'dark' });
  expect(said()).toBe('Colour mode: dark. Switch to the machine’s setting.');
  expect(button().getAttribute('title'), 'the words under the pointer name the press, not a mode').toBe('Switch colour mode');
  await expect.poll(shownMark, { message: 'the mark is the mode the page is in' }).toBe('dark');

  /* Written by somebody else — the boot line, another tab — it follows. */
  document.documentElement.dataset['theme'] = 'light';
  await expect.poll(said).toBe('Colour mode: light. Switch to dark.');
  await expect.poll(shownMark, { message: 'one mark fades out and the other in' }).toBe('light');
});

test('one press steps round three states, writes the choice, and says so', async () => {
  delete document.documentElement.dataset['theme'];
  await write('<sds-theme></sds-theme>', { theme: 'dark' });
  delete document.documentElement.dataset['theme'];
  await settle();
  await expect.poll(said).toBe('Colour mode: the machine’s setting. Switch to light.');

  await userEvent.click(button());
  expect(document.documentElement.dataset['theme']).toBe('light');
  expect(localStorage.getItem('soul-theme'), 'the choice, under the default key').toBe('light');

  await userEvent.click(button());
  expect(document.documentElement.dataset['theme']).toBe('dark');
  expect(localStorage.getItem('soul-theme')).toBe('dark');

  /* The machine's setting is a stop on the way round, not something only a
     cleared key gives back. */
  await userEvent.click(button());
  expect(document.documentElement.dataset['theme']).toBeUndefined();
  expect(localStorage.getItem('soul-theme'), 'and nothing stored says otherwise').toBeNull();
  await expect.poll(shownMark).toBe('machine');

  expect(heard, 'every press says what it chose, and null for the machine’s').toEqual(['light', 'dark', null]);
});

test('two products on one origin are two keys', async () => {
  await write('<sds-theme key="companion-theme"></sds-theme>', { theme: 'dark' });
  /* From dark the next stop is the machine's, which clears the key; the
     one after is light, which writes it. */
  await userEvent.click(button());
  expect(localStorage.getItem('companion-theme')).toBeNull();
  await userEvent.click(button());
  expect(localStorage.getItem('companion-theme')).toBe('light');
  expect(localStorage.getItem('soul-theme'), 'the default key stays empty').toBeNull();
});
