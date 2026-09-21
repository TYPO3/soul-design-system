/* The outline of a long document, in its panel.

   `sds-nav-outline` lists every part and every section of a document with
   more places than a window is tall. The panel it stands in is the height of
   the window, and the list scrolls inside it. So the mark on the part under
   the reader has to stay where the reader can see it. Every row carries its
   number as text, and the heading it points at carries the same number, so
   the two have to agree. Where the panel has no room beside the page, the
   list folds behind one press in the page's head. A press on a row shuts it
   again. */

import { beforeEach, describe, expect, test } from 'vitest';
import { commands, page, userEvent } from 'vitest/browser';
import './lib/commands.d.ts';
import { frames, q, sleep, write } from './lib/frame.ts';

const PARTS = Array.from({ length: 12 }, (_, i) => ({
  id: `part-${i}`,
  label: `Part ${i + 1}`,
  under: [`part-${i}-a`, `part-${i}-b`],
}));

const body = PARTS.map((s, i) => `
  <section class="sds-section" id="${s.id}">
    <h2><span class="sds-section__number">${i + 1}</span> ${s.label}</h2>
    <p style="height:340px">Body of ${s.label}.</p>
    <section class="sds-section" id="${s.under[0]}">
      <h3><span class="sds-section__number">${i + 1}.1</span> ${s.label} first</h3>
      <p style="height:340px">More.</p>
    </section>
    <section class="sds-section" id="${s.under[1]}">
      <h3><span class="sds-section__number">${i + 1}.2</span> ${s.label} second</h3>
      <p style="height:340px">More still.</p>
    </section>
  </section>`).join('');

const entries = PARTS.map((s) => ({
  label: s.label,
  href: `#${s.id}`,
  items: [
    { label: `${s.label} first`, href: `#${s.under[0]}` },
    { label: `${s.label} second`, href: `#${s.under[1]}` },
  ],
}));

const PAGE = `
  <div class="sds-shell">
    <div class="sds-paper">
      <aside class="sds-paper__panel">
        <div class="sds-paper__head"><p class="sds-paper__title">A paper</p></div>
        <sds-nav-outline label="Contents" numbered id="outline"></sds-nav-outline>
        <div class="sds-paper__foot"><p>Draft</p></div>
      </aside>
      <main class="sds-paper__main">
        <article class="sds-prose">
          <section class="sds-section"><h1>A paper with twelve parts</h1></section>
          ${body}
        </article>
      </main>
    </div>
  </div>`;

/** The page at a width, with the list drawn. Attached, not visible: where the
    list folds, the first row is behind the press. */
async function open(width: number): Promise<void> {
  await page.viewport(width, 700);
  window.scrollTo(0, 0);
  await write(PAGE, { then: () => { (q('#outline') as HTMLElement & { entries: unknown }).entries = entries; } });
  expect(q('.sds-outline__item').isConnected).toBe(true);
  await sleep(100);
}

/** Where the mark is, and if the box it is in shows it. */
const marked = () => {
  const here = document.querySelector<HTMLElement>('.sds-outline__item.is-active');
  if (!here) return null;
  const list = here.closest('.sds-outline') as HTMLElement;
  const edge = list.getBoundingClientRect();
  const row = here.getBoundingClientRect();
  return {
    href: here.getAttribute('href') ?? '',
    inView: row.top >= edge.top - 1 && row.bottom <= edge.bottom + 1,
  };
};

/* Wide enough that the panel stands beside the page, and short enough that
   the list does not fit in it. */
describe('beside the page', () => {
  beforeEach(() => open(1440));

  /* The number is text in the row and in the heading, so it is in the name
     each has out loud. A counter the stylesheet drew is not: the browser
     leaves generated content out of an accessible name. */
  test('the list counts its places, and the headings carry the same numbers', async () => {
    await expect.element(q('.sds-outline__item[href="#part-3"]')).toHaveAccessibleName('4 Part 4');
    await expect.element(q('#part-3 > h2')).toHaveAccessibleName('4 Part 4');
    await expect.element(q('.sds-outline__item[href="#part-3-b"]')).toHaveAccessibleName('4.2 Part 4 second');
    await expect.element(q('#part-3-b > h3')).toHaveAccessibleName('4.2 Part 4 second');
    await expect.element(q('.sds-outline__item[href="#part-11"]')).toHaveAccessibleName('12 Part 12');
  });

  test('the panel stands the height of the window and the list scrolls inside it', () => {
    const panel = q('.sds-paper__panel');
    const list = q('.sds-outline');
    expect(getComputedStyle(panel).position).toBe('sticky');
    expect(Math.round(panel.getBoundingClientRect().height)).toBe(700);
    expect(getComputedStyle(list).overflowY).toBe('auto');
    expect(list.scrollHeight - list.clientHeight, 'the fixture must have more entries than the box holds').toBeGreaterThan(40);
    /* A row's fill bleeds past its text. A box that gives it no room scrolls
       sideways, and draws a bar for it under the list. */
    expect(list.scrollWidth - list.clientWidth, 'the list scrolls sideways').toBe(0);
    expect(q('.sds-outline__toggle').getClientRects().length, 'beside the page nothing folds, so no press draws').toBe(0);
  });

  test('above the first heading nothing has the mark, which is a contents', () => {
    expect(marked()).toBeNull();
  });

  test('the marked entry stays where the reader can see it, all the way down', async () => {
    const height = document.documentElement.scrollHeight;
    const missed: unknown[] = [];
    for (let y = 0; y <= height; y += 250) {
      window.scrollTo(0, y);
      await sleep(60);
      const at = marked();
      if (at && !at.inView) missed.push({ y, href: at.href });
    }
    expect(missed, 'the panel marked a place off its own edge').toEqual([]);
    expect(marked()?.href, 'at the foot the last place is the mark').toBe('#part-11-b');
  });

  /* The reader at the foot, with the last place marked and the list scrolled
     to it. They turn the wheel over the list to find the first part. At the
     list's top the scroll used to run on into the page. The mark moved to a
     part further up, and the list jumped down to it: a list the reader
     cannot scroll. So a list with more rows than it shows keeps the wheel. */
  test('the wheel over the list scrolls the list, and nothing else', async () => {
    const list = q('.sds-outline');
    window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(120);
    expect(marked()?.href).toBe('#part-11-b');
    expect(list.scrollTop, 'the fixture must put the mark below the box').toBeGreaterThan(0);
    expect(getComputedStyle(list).overscrollBehaviorY).toBe('contain');

    const pageY = window.scrollY;
    for (let i = 0; i < 12; i++) await commands.wheel('.sds-outline', -200);
    await sleep(200);
    expect(list.scrollTop, 'the list reached its top').toBe(0);
    expect(window.scrollY, 'the page stood still under the list').toBe(pageY);
    expect(marked()?.href, 'the mark stayed where the reader is').toBe('#part-11-b');
  });

  /* And a list the box holds whole hands the wheel on, as any block does.
     Containment on that box swallows the wheel, and the page stops under it. */
  test('a list with nothing to scroll lets the wheel through to the page', async () => {
    (q('#outline') as HTMLElement & { entries: unknown }).entries = entries.slice(0, 2);
    await frames();
    const list = q('.sds-outline');
    expect(list.scrollHeight - list.clientHeight, 'the fixture must fit the box').toBeLessThan(2);
    expect(getComputedStyle(list).overscrollBehaviorY).toBe('auto');

    await commands.wheel('.sds-outline', 300);
    await sleep(200);
    expect(window.scrollY, 'the page moved').toBeGreaterThan(0);
  });
});

describe('where the panel has no room beside the page', () => {
  beforeEach(() => open(400));

  /** The fold, its press, and what the panel shows. */
  const state = () => {
    const fold = q<HTMLDetailsElement>('.sds-outline__fold');
    const panel = q('.sds-paper__panel');
    const list = q('.sds-outline__fold > .sds-outline__list');
    const foot = q('.sds-paper__foot');
    return {
      open: fold.open,
      press: q('.sds-outline__toggle').getClientRects().length > 0,
      list: list.checkVisibility(),
      foot: foot.checkVisibility(),
      position: getComputedStyle(panel).position,
      top: Math.round(panel.getBoundingClientRect().top),
      height: Math.round(panel.getBoundingClientRect().height),
    };
  };

  test('the list folds behind a press in the head, and the head stays at the top', async () => {
    const shut = state();
    expect(shut.open, 'the script shuts the fold where the press draws').toBe(false);
    expect(shut.press).toBe(true);
    expect(shut.list).toBe(false);
    expect(shut.foot, 'the foot shows with the list').toBe(false);
    expect(shut.position).toBe('sticky');

    window.scrollTo(0, 900);
    await sleep(60);
    expect(state().top, 'the head rests at the top of the window').toBe(0);
  });

  test('the press opens the list, and a press on a row shuts it and goes there', async () => {
    await userEvent.click(q('.sds-outline__toggle'));
    const opened = state();
    expect(opened.open).toBe(true);
    expect(opened.list).toBe(true);
    expect(opened.foot).toBe(true);
    expect(opened.height, 'the drop stays inside the window').toBeLessThan(700);

    await userEvent.click(q('.sds-outline__item[href="#part-5"]'));
    await sleep(120);
    expect(state().open, 'the reader chose a place, and the list has done its work').toBe(false);
    const heading = q('#part-5 > h2').getBoundingClientRect().top;
    const panel = q('.sds-paper__panel').getBoundingClientRect().bottom;
    expect(heading, 'the place arrives under the head, not behind it').toBeGreaterThanOrEqual(panel);
  });

  test('back beside the page, the list opens again', async () => {
    await page.viewport(1440, 700);
    await frames();
    await sleep(150);
    const wide = state();
    expect(wide.open).toBe(true);
    expect(wide.press).toBe(false);
  });
});
