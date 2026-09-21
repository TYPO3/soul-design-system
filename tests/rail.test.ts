/* The rail: the pages of a section, and a row with nowhere to go.

   A row with a target is a link, and the platform does the rest. A row
   with none is a choice: pressing it makes it current and says so, for
   whatever stands beside it to follow. A second press on the same row
   says nothing, because nothing changed. */

import { expect, test } from 'vitest';
import { commands, page, userEvent } from 'vitest/browser';
import './lib/commands.d.ts';
import * as rail from '../stories/components/NavRail.stories.ts';
import { frames, mount, q, qa, sleep, stories, write } from './lib/frame.ts';

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

/* The rail stands in a box the page writes, sticky and as tall as the window
   leaves it. With more pages than the box holds it scrolls. At its edge the
   wheel used to run on into the page, so a reader scrolling the rail for a
   page moved the text instead. A box with more rows than it shows keeps the
   wheel; one that holds them whole hands it on. */
test('the wheel over a long rail scrolls the rail, and nothing else', async () => {
  await page.viewport(1280, 600);
  const pages = (n: number) => Array.from({ length: n }, (_, i) => ({ label: `page-${i + 1}`, href: `#page-${i + 1}` }));
  await write(`
    <div class="sds-shell"><div class="sds-body">
      <aside class="sds-body__rail" id="box"><sds-nav-rail id="rail"></sds-nav-rail></aside>
      <main class="sds-body__main"><p style="height:4000px">The text.</p></main>
    </div></div>`, {
    then: () => { (q('#rail') as HTMLElement & { entry: unknown }).entry = { label: 'Pages', items: pages(40) }; },
  });
  await frames();
  await sleep(100);
  const box = q('#box');
  expect(box.scrollHeight - box.clientHeight, 'the fixture must have more rows than the box holds').toBeGreaterThan(40);
  expect(getComputedStyle(box).overscrollBehaviorY).toBe('contain');

  box.scrollTop = box.scrollHeight;
  for (let i = 0; i < 12; i++) await commands.wheel('#box', -200);
  await sleep(200);
  expect(box.scrollTop, 'the rail reached its top').toBe(0);
  expect(window.scrollY, 'the page stood still under the rail').toBe(0);

  (q('#rail') as HTMLElement & { entry: unknown }).entry = { label: 'Pages', items: pages(3) };
  await frames();
  await sleep(100);
  expect(getComputedStyle(box).overscrollBehaviorY, 'a rail the box holds whole hands the wheel on').toBe('auto');
  await commands.wheel('#box', 300);
  await sleep(200);
  expect(window.scrollY, 'the page moved').toBeGreaterThan(0);
});
