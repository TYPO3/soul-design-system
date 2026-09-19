/* A set of tabs: a real tablist, and the sets that agree.

   A tablist that only answers the pointer is a tablist in name. The arrow
   keys move between the tabs and wrap at the ends, Home and End go to
   them, and the focus follows the selection. No card shows this either: a
   set with `sync` moves the others that share the word, by the label and
   not by the position. And the choice holds for the next page. */

import { beforeEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as tabs from '../stories/components/Tabs.stories.ts';
import { mount, q, qa, shown, stories } from './lib/frame.ts';

const { Default, Synced } = stories(tabs);

const tab = (i: number, root: ParentNode = document): HTMLButtonElement => qa<HTMLButtonElement>('button.sds-tab', root)[i] as HTMLButtonElement;
const chosen = (root: ParentNode = document): string[] =>
  qa('button.sds-tab', root).filter((b) => b.getAttribute('aria-selected') === 'true').map((b) => b.textContent?.trim() ?? '');
const open = (root: ParentNode = document): string[] =>
  qa('sds-tab-item', root).filter((panel) => shown(panel)).map((panel) => panel.getAttribute('label') ?? '');

beforeEach(() => localStorage.clear());

test('each tab names its panel, one carries the selection, and one panel shows', async () => {
  await mount(Default);

  expect(q('.sds-tabs').getAttribute('role')).toBe('tablist');
  expect(tab(0).getAttribute('role')).toBe('tab');
  const panel = q('sds-tab-item .sds-tab__panel');
  expect(tab(0).getAttribute('aria-controls')).toBe(panel.id);
  expect(panel.getAttribute('aria-labelledby'), 'and the panel names its tab back').toBe(tab(0).id);
  expect(chosen()).toEqual(['standalone']);
  /* One stop in the row: the current tab, and the rest reached by the arrows. */
  expect(qa('button.sds-tab').map((b) => b.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  expect(open()).toEqual(['standalone']);
});

test('a press picks a tab, and its panel is the one that shows', async () => {
  await mount(Default);
  await userEvent.click(tab(2));
  await expect.poll(chosen).toEqual(['ddev']);
  expect(open()).toEqual(['ddev']);
});

test('the arrows walk the row, wrap at the ends, and the focus follows', async () => {
  await mount(Default);
  tab(0).focus();

  await userEvent.keyboard('{ArrowRight}');
  await expect.poll(chosen).toEqual(['as a dependency']);
  await expect.poll(() => document.activeElement).toBe(tab(1));

  await userEvent.keyboard('{ArrowLeft}');
  await userEvent.keyboard('{ArrowLeft}');
  await expect.poll(chosen, { message: 'left from the first wraps to the last' }).toEqual(['ddev']);
  await expect.poll(() => document.activeElement).toBe(tab(2));

  await userEvent.keyboard('{ArrowRight}');
  await expect.poll(chosen, { message: 'right from the last wraps to the first' }).toEqual(['standalone']);

  await userEvent.keyboard('{End}');
  await expect.poll(chosen).toEqual(['ddev']);
  await userEvent.keyboard('{Home}');
  await expect.poll(chosen).toEqual(['standalone']);
  /* And a key that is none of these moves nothing. */
  await userEvent.keyboard('{ArrowDown}');
  expect(chosen()).toEqual(['standalone']);
});

test('sets that share a word move together, by the label, and a set with no word stays', async () => {
  await mount(Synced);
  const sets = qa('sds-tabs');
  const [first, second, alone] = sets as [HTMLElement, HTMLElement, HTMLElement];

  await userEvent.click(tab(1, first));
  await expect.poll(() => chosen(second), { message: 'the second set follows the word' }).toEqual(['PHP']);
  expect(chosen(alone), 'a set with no `sync` is nobody else’s business').toEqual(['YAML']);

  /* By the word and not by the position: a set without it keeps its panel. */
  await userEvent.click(tab(2, second));
  await expect.poll(() => chosen(second)).toEqual(['bash']);
  expect(chosen(first), 'the first set has no bash, so it stays where it was').toEqual(['PHP']);

  /* A preference is an order, most recent first, kept for the next page. */
  expect(JSON.parse(localStorage.getItem('sds-tabs:story') ?? '[]')).toEqual(['bash', 'PHP']);
});

test('the choice from the last page is in force on the next', async () => {
  localStorage.setItem('sds-tabs:story', JSON.stringify(['bash', 'PHP']));
  await mount(Synced);
  const [first, second] = qa('sds-tabs') as [HTMLElement, HTMLElement];
  expect(chosen(second), 'the most recent word it has').toEqual(['bash']);
  expect(chosen(first), 'and the first of the order this set knows').toEqual(['PHP']);

  /* A value somebody else wrote under the key is no reason to break a page. */
  localStorage.setItem('sds-tabs:story', 'PHP');
  await mount(Synced);
  expect(chosen(qa('sds-tabs')[0] as HTMLElement)).toEqual(['PHP']);
});
