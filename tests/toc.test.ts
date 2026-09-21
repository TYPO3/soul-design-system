/* The contents list, and where it says the reader is.

   `sds-nav-toc` is the one navigation whose current entry no renderer can
   name, so it reads the page instead. Past the width that stands it beside
   the column it is a box of its own that scrolls and shows only two levels.
   Both of those can leave the list with a mark on a place the reader cannot
   see. That is a list that says nothing at all and looks exactly like a list
   that works.

   Neither is visible in a screenshot or in the markup. It takes a page long
   enough to scroll and a box too short to hold the list. */

import { beforeEach, expect, test } from 'vitest';
import { commands, page } from 'vitest/browser';
import './lib/commands.d.ts';
import { frames, q, qa, shown, sleep, write } from './lib/frame.ts';

/** Sections enough to outrun the list's own box, each tall enough to scroll
    to on its own. Three levels, because the list beside the column draws two
    and the third is what the page still has headings for. */
const SECTIONS = Array.from({ length: 12 }, (_, i) => ({
  id: `part-${i}`,
  label: `Part ${i + 1}`,
  under: [`part-${i}-a`, `part-${i}-b`],
}));

const body = SECTIONS.map((s) => `
  <h2 class="sds-h3" id="${s.id}">${s.label}</h2>
  <p style="height:340px">Body of ${s.label}.</p>
  <h3 class="sds-h4" id="${s.under[0]}">${s.label} first</h3>
  <p style="height:340px">More.</p>
  <h4 class="sds-h5" id="${s.under[1]}">${s.label} deeper</h4>
  <p style="height:340px">More still.</p>`).join('');

const entries = SECTIONS.map((s) => ({
  label: s.label,
  href: `#${s.id}`,
  items: [{
    label: `${s.label} first`,
    href: `#${s.under[0]}`,
    items: [{ label: `${s.label} deeper`, href: `#${s.under[1]}` }],
  }],
}));

const PAGE = `
  <div class="sds-shell">
    <div class="sds-body">
      <main class="sds-body__main">
        <article class="sds-prose">
          <section class="sds-section">
            <h1>A page with more parts than the list is tall</h1>
            <div class="sds-aside">
              <sds-nav-toc label="On this page" id="toc"></sds-nav-toc>
            </div>
            ${body}
          </section>
        </article>
      </main>
    </div>
  </div>`;

/* Wide enough that the list stands beside the column, and short enough that it
   does not fit in the reserve. That is a laptop, and the state nobody read
   the list in. */
beforeEach(async () => {
  await page.viewport(1440, 700);
  window.scrollTo(0, 0);
  await write(PAGE, { then: () => { (q('#toc') as HTMLElement & { entries: unknown }).entries = entries; } });
  expect(shown(q('.sds-toc__item'))).toBe(true);
});

/** Where the mark is, and if the box it is in shows it. */
const marked = () => {
  const here = document.querySelector<HTMLElement>('.sds-toc__item.is-active');
  if (!here) return null;
  const list = here.closest('.sds-toc') as HTMLElement;
  const edge = list.getBoundingClientRect();
  const row = here.getBoundingClientRect();
  return {
    href: here.getAttribute('href') ?? '',
    inView: row.top >= edge.top - 1 && row.bottom <= edge.bottom + 1,
    tocTop: Math.round(list.scrollTop),
  };
};

test('the list is a box that scrolls, which is the case the rest of this asks about', () => {
  const list = q('.sds-prose .sds-aside .sds-toc');
  const style = getComputedStyle(list);
  expect(style.position, 'the list must rest beside the column').toBe('sticky');
  expect(style.overflowY).toBe('auto');
  expect(list.scrollHeight - list.clientHeight, 'the fixture must have more entries than the box holds').toBeGreaterThan(40);
});

test('the marked entry stays where the reader can see it, all the way down', async () => {
  const height = document.documentElement.scrollHeight;
  const missed: unknown[] = [];
  for (let y = 0; y <= height; y += 250) {
    window.scrollTo(0, y);
    await sleep(40);
    const at = marked();
    if (at && !at.inView) missed.push({ y, href: at.href });
  }
  expect(missed, 'the list marked a section off its own edge').toEqual([]);
});

test('a heading the list does not draw leaves the section it is in marked', async () => {
  /* Beside the column the list draws two levels. The third has a heading on
     the page all the same, and the reader at one is still inside the section
     above it. A list that marks the heading itself marks a row that is not
     there, and every visible entry goes blank. */
  const hidden = qa('.sds-toc__item').filter((row) => !row.getClientRects().length).map((row) => row.getAttribute('href'));
  expect(hidden, 'the fixture must carry a level the list hides').toContain('#part-4-b');

  document.getElementById('part-4-b')?.scrollIntoView();
  await sleep(120);
  const at = marked();
  expect(at, 'no mark while the reader stood at a hidden heading').not.toBeNull();
  expect(at?.href).toBe('#part-4-a');
  expect(at?.inView).toBe(true);
});

/* The reader at the foot, the last section marked and the list scrolled to
   it, turns the wheel over the list to find the first. At the list's top the
   scroll used to run on into the page, the mark moved up, and the list jumped
   after it. A list with more rows than it shows keeps the wheel; one the box
   holds whole hands it on, as any block does. */
test('the wheel over the list scrolls the list, and nothing else', async () => {
  const list = q('.sds-prose .sds-aside .sds-toc');
  window.scrollTo(0, document.documentElement.scrollHeight);
  await sleep(120);
  expect(marked()?.href).toBe('#part-11-a');
  expect(list.scrollTop, 'the fixture must put the mark below the box').toBeGreaterThan(0);
  expect(getComputedStyle(list).overscrollBehaviorY).toBe('contain');

  const pageY = window.scrollY;
  for (let i = 0; i < 12; i++) await commands.wheel('.sds-prose .sds-aside .sds-toc', -200);
  await sleep(200);
  expect(list.scrollTop, 'the list reached its top').toBe(0);
  expect(window.scrollY, 'the page stood still under the list').toBe(pageY);
  expect(marked()?.href, 'the mark stayed where the reader is').toBe('#part-11-a');

  (q('#toc') as HTMLElement & { entries: unknown }).entries = entries.slice(0, 2);
  await frames();
  expect(list.scrollHeight - list.clientHeight, 'the fixture must fit the box').toBeLessThan(2);
  expect(getComputedStyle(list).overscrollBehaviorY).toBe('auto');
});

test('a list already showing its mark stands still', async () => {
  window.scrollTo(0, 0);
  await sleep(60);
  document.getElementById('part-0')?.scrollIntoView();
  await sleep(120);
  expect(marked()?.tocTop, 'the first entries are in view, so the list had no reason to move').toBe(0);
});

test('in the flow the list neither scrolls nor hides a level', async () => {
  await page.viewport(1200, 700);
  await frames();
  await sleep(150);
  const list = q('.sds-prose .sds-aside .sds-toc');
  expect(getComputedStyle(list).position, 'below the width that stands it beside the column it is in the flow').toBe('static');
  expect(qa('.sds-toc__item').filter((row) => !row.getClientRects().length).length, 'in the flow the list keeps every level').toBe(0);

  document.getElementById('part-4-b')?.scrollIntoView();
  await sleep(120);
  expect(marked()?.href, 'the deepest entry draws here, so it is the mark').toBe('#part-4-b');
});
