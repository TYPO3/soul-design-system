/* The search for a page in a site with no server.

   The index is a file, fetched the first time somebody types, and the hits
   drop from the field. What holds here is the way through it. A typed word
   narrows the list. The arrows walk into the drop and back out, and Escape
   gives the page back. A hit's address resolves against the index's own,
   which is the root. `search.spec.ts` asks the rendered site the last
   question for real; this frame serves an index of its own. */

import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { q, qa, shown, write } from './lib/frame.ts';

const INDEX = [
  { title: 'Installing', url: 'guides/installing.html', text: 'Clone it, install once, then point a project at the binary.' },
  { title: 'Writing a skill', url: 'guides/skill.html', text: 'What a skill is, and where its files go.', image: 'images/skill.png' },
  { title: 'The status page', url: 'status.html', text: 'Which sources answer, and since when.' },
];

beforeEach(async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(INDEX), { headers: { 'content-type': 'application/json' } }));
  await write('<sds-search label="Search the manual" index="site/index.json"></sds-search>');
});

afterEach(() => vi.restoreAllMocks());

const field = (): HTMLInputElement => q<HTMLInputElement>('sds-search input');
const links = (): HTMLAnchorElement[] => qa<HTMLAnchorElement>('.sds-search__panel a');

test('a typed word fetches the index once, and the drop holds what matches', async () => {
  expect(field().getAttribute('role'), 'a box you type in with a list underneath').toBe('combobox');
  expect(field().getAttribute('aria-expanded')).toBe('false');

  await userEvent.type(field(), 'skill');
  await expect.poll(() => qa('.sds-search__panel .sds-result__title').map((h) => h.textContent?.trim())).toEqual(['Writing a skill']);
  expect(field().getAttribute('aria-expanded')).toBe('true');
  expect(shown(q('.sds-search__panel'))).toBe(true);

  await userEvent.type(field(), '{Backspace}{Backspace}{Backspace}{Backspace}{Backspace}in');
  await expect.poll(() => links().length, { message: 'a shorter word widens the list' }).toBe(3);
  expect(fetch, 'fetched on the first keystroke and never again').toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('site/index.json');
});

test('a hit resolves against the index, which is the root, and so does its picture', async () => {
  await userEvent.type(field(), 'skill');
  await expect.poll(() => links().length).toBe(1);
  const root = new URL('site/', location.href).href;
  expect(links()[0]?.href).toBe(`${root}guides/skill.html`);
  expect(q<HTMLImageElement>('.sds-search__panel img').getAttribute('src')).toBe(`${root}images/skill.png`);
});

test('down goes into the drop, the arrows walk it, up from the first comes back, and Escape leaves', async () => {
  await userEvent.type(field(), 'in');
  await expect.poll(() => links().length).toBe(3);

  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(links()[0]);
  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(links()[1]);
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
  expect(document.activeElement, 'the last is where it stops').toBe(links()[2]);
  await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');
  expect(document.activeElement, 'up from the first is the field').toBe(field());

  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{Escape}');
  await expect.poll(() => shown(document.querySelector('.sds-search__panel'))).toBe(false);
  expect(document.activeElement, 'Escape from the drop gives the field back').toBe(field());

  /* The word stays, so the focus alone opens the drop again. */
  field().blur();
  await expect.poll(() => shown(document.querySelector('.sds-search__panel')), { message: 'left, the drop goes' }).toBe(false);
  field().focus();
  await expect.poll(() => shown(document.querySelector('.sds-search__panel'))).toBe(true);
});

test('an index that does not answer is an empty list, not a broken field', async () => {
  vi.mocked(fetch).mockRejectedValue(new Error('offline'));
  await userEvent.type(field(), 'skill');
  await expect.poll(() => field().getAttribute('aria-expanded')).toBe('true');
  expect(links()).toEqual([]);
});
