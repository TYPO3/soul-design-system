/* The rail: the pages of a section, and a row with nowhere to go.

   A row with a target is a link, and the platform does the rest. A row
   with none is a choice: pressing it makes it current and says so, for
   whatever stands beside it to follow. A second press on the same row
   says nothing, because nothing changed. */

import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as rail from '../stories/components/NavRail.stories.ts';
import { mount, q, qa, stories } from './lib/frame.ts';

const { Default, Grouped } = stories(rail);

test('a row with nowhere to go is a choice, and a press says which', async () => {
  await mount(Default);
  const heard: { index: number; label: string }[] = [];
  q('sds-nav-rail').addEventListener('sds-change', (event) => heard.push((event as CustomEvent<{ index: number; label: string }>).detail));

  const rows = qa<HTMLButtonElement>('button.sds-rail__item');
  expect(rows.length, 'rows with no target are buttons').toBeGreaterThan(1);
  expect(rows[0]?.getAttribute('aria-current'), 'the one the data marked').toBe('true');

  await userEvent.click(rows[2] as HTMLButtonElement);
  await expect.poll(() => rows[2]?.getAttribute('aria-current')).toBe('true');
  expect(rows[0]?.getAttribute('aria-current')).toBeNull();
  expect(heard).toEqual([{ index: 2, label: 'typo3_schema_lookup' }]);

  /* The same row again changes nothing, so it says nothing. */
  await userEvent.click(rows[2] as HTMLButtonElement);
  expect(heard).toHaveLength(1);
});

test('a row with a target is a link, and says it is the page', async () => {
  await mount(Grouped);
  const links = qa<HTMLAnchorElement>('a.sds-rail__item');
  expect(links.length).toBeGreaterThan(1);
  expect(qa('button.sds-rail__item'), 'nothing here is a choice').toHaveLength(0);
  const current = links.filter((a) => a.getAttribute('aria-current') === 'page');
  expect(current, 'one page is the current one').toHaveLength(1);
});
