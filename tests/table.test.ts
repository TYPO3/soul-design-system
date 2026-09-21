/* The way into a row.

   A list with a detail behind each row carries a control at the end of the
   row, and three things have to hold. It is a link and not a press handler.
   A middle click, a new tab and a copied address are the whole reason for
   the choice, and a handler loses them. It is one keyboard stop per row. And
   it leaves the rest of the row alone. A cell with its own link, a cell with
   a tooltip, and text somebody selects all stay what they were.

   That last one is what a stretched row link takes, and it is why this shape
   won over it. The claim is here so nobody can quietly reverse the trade. */

import { beforeEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { box, q, qa, settle, shown, write } from './lib/frame.ts';

/* Built on the page, so the cells hold real elements rather than the text of
   them. The address is a link of its own and the database name a cell with a
   tooltip. Those are the two things the way in must not swallow. */
const cell = (name: string, i: number): string => `
    <td class="sds-td-name">${name}<span class="sds-td-note">main · clean</span></td>
    <td class="sds-td-meta"><code id="db-${i}" title="db_${name}_full">db_${name}…</code></td>
    <td class="sds-td-meta"><a id="site-${i}" href="#site-${i}">${name}.test</a></td>
    <td class="sds-td-into"><sds-button id="into-${i}" href="#open-${i}"
        variant="secondary" size="sm" title="Open ${name}">Open</sds-button></td>`;

beforeEach(async () => {
  location.hash = '';
  await write('<sds-table id="checkouts"></sds-table>', {
    then: () => {
      const table = q('#checkouts') as HTMLElement & { columns: unknown; rows: unknown };
      table.columns = [
        { head: 'Checkout', cls: 'sds-td-name' },
        { head: 'Database', cls: 'sds-td-meta' },
        { head: 'Address', cls: 'sds-td-meta' },
        { head: '', cls: 'sds-td-into' },
      ];
      table.rows = [];
    },
  });
  q('#checkouts tbody').innerHTML = ['a', 'b', 'c'].map((n, i) => `<tr>${cell(n, i)}</tr>`).join('');
  await settle();
  expect(shown(q('#into-0 a'))).toBe(true);
});

test('the way in is an anchor, not a handler', async () => {
  /* The whole reason for this shape over a press handler on the row. What the
     platform does with a link is what nobody has to build again. */
  const into = q('#into-0 a');
  expect(into.getAttribute('href')).toBe('#open-0');
  expect(into.className).toMatch(/sds-btn/);
  expect(qa('#into-0 button')).toHaveLength(0);

  await userEvent.click(into);
  await expect.poll(() => location.hash).toBe('#open-0');
});

test('the column holds the control and no more', () => {
  const widths = qa('#checkouts tbody tr').map((row) => Math.round(box(row.lastElementChild as HTMLElement).width));
  const head = qa('#checkouts thead th').pop() as HTMLElement;
  const style = getComputedStyle(q('#checkouts .sds-td-into'));
  const nameWidth = Math.round(box(q('#checkouts .sds-td-name')).width);

  /* One width down the column, and the same place in every row. */
  expect(new Set(widths).size).toBe(1);
  /* Held to what the control needs: the name column, which carries the reading,
     keeps the room. */
  expect(widths[0]).toBeLessThan(nameWidth);
  expect((head.textContent ?? '').trim(), 'a head over it names the button rather than a fact').toBe('');
  expect(style.textAlign).toBe('end');
  expect(style.whiteSpace).toBe('nowrap');
});

test('the rest of the row stays as it is', async () => {
  /* Nothing lies over the cells, which is the whole trade against a link
     stretched across the row. What the browser hits in a cell is that cell. */
  const at = (el: Element): string | null => {
    const r = box(el);
    const found = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return found?.id || found?.tagName.toLowerCase() || null;
  };
  expect(at(q('#db-0')), 'the cell with the tooltip is what the pointer finds').toBe('db-0');
  expect(at(q('#site-0')), 'a cell can keep a link to somewhere else entirely').toBe('site-0');
  expect(at(q('#checkouts .sds-td-name')), 'and the name is text a reader can select').toBe('td');

  /* And it still goes where it goes, rather than where the row goes. */
  await userEvent.click(q('#site-0'));
  await expect.poll(() => location.hash).toBe('#site-0');
});

test("one keyboard stop per row, in the row's order", async () => {
  q('#site-0').focus();
  await userEvent.tab();
  expect(document.activeElement, 'the way in comes last in its row').toBe(q('#into-0 a'));
  await userEvent.tab();
  expect(document.activeElement, 'and the next row starts over').toBe(q('#site-1'));
});

test('a column stands at the edge a reader reads it down, head and cells alike', async () => {
  /* A table of its own. The one above got its rows as markup, which is the
     other form and not what a column's options travel through. */
  const table = document.createElement('sds-table') as HTMLElement & { columns: unknown; rows: unknown };
  table.id = 'log';
  table.columns = [
    { head: 'Commit', cls: 'sds-td-name', fit: true },
    { head: 'Subject' },
    { head: 'When', cls: 'sds-td-meta', align: 'end', fit: true },
  ];
  table.rows = [
    { cells: ['48723bc', 'Remove falsely committed files', '11 days ago'] },
    { cells: ['f088fab', 'Release 14.0.1', '11 days ago'] },
  ];
  document.body.append(table);
  await settle();
  expect(qa('#log tbody tr')).toHaveLength(2);

  const at = (sel: string) => {
    const el = q(sel);
    const style = getComputedStyle(el);
    return { align: style.textAlign, figures: style.fontVariantNumeric, width: Math.round(box(el).width) };
  };
  const laid = {
    whenHead: at('#log thead th:nth-child(3)'),
    whenCell: at('#log tbody td:nth-child(3)'),
    hash: at('#log tbody td:nth-child(1)'),
    subject: at('#log tbody td:nth-child(2)'),
  };

  /* The head goes with the cells, or it names the column beside it. */
  expect(laid.whenCell.align).toBe('end');
  expect(laid.whenHead.align, 'a head over a column it does not stand at').toBe('end');
  expect(laid.whenCell.figures, 'the right edge only pays when the digits line up').toContain('tabular-nums');

  /* Held to what they hold, and the reading takes the slack. */
  expect(laid.subject.width).toBeGreaterThan(laid.hash.width + laid.whenCell.width);
});

test('the row still lights up under the pointer, and a selected row still fills', () => {
  const row = q('#checkouts tbody tr');
  const rest = getComputedStyle(row).backgroundColor;
  row.classList.add('is-selected');
  expect(getComputedStyle(row).backgroundColor, 'selection is still the one fill a row gets').not.toBe(rest);
});

test('the caption stands under the last row, or above the head when asked', async () => {
  const table = document.createElement('sds-table') as HTMLElement & { columns: unknown; rows: unknown };
  table.id = 'captioned';
  table.setAttribute('caption', 'Versions as of the last sync.');
  table.columns = [{ head: 'Tool', cls: 'sds-td-name' }, { head: 'Versions' }];
  table.rows = [{ cells: ['typo3_rule_lookup', '12.4 · 13.4 · 14.3 · main'] }];
  document.body.append(table);
  await settle();
  expect(q('#captioned caption').textContent?.trim()).toBe('Versions as of the last sync.');

  const placed = () => ({
    caption: box(q('#captioned caption')),
    head: box(q('#captioned thead')),
    last: box(q('#captioned tbody tr:last-child')),
    first: q('#captioned table').firstElementChild?.tagName,
  });

  const below = placed();
  expect(below.first, 'first in the source, so a reader hears what the table is first').toBe('CAPTION');
  expect(below.caption.top, 'under the last row, with a gap to it').toBeGreaterThan(below.last.bottom);

  q('#captioned').setAttribute('caption-side', 'top');
  await expect.element(q('#captioned table')).toHaveClass(/sds-table--caption-top/);

  const above = placed();
  expect(above.first, 'the side is a matter of layout, and the source order stays').toBe('CAPTION');
  expect(above.caption.bottom).toBeLessThanOrEqual(above.head.top);
  expect(above.caption.height, 'and the caption keeps its size').toBe(below.caption.height);
});

/* The box a wide table scrolls in scrolls sideways and never down. `auto` on
   one axis makes the other `auto` too. At a browser zoom the rows round to a
   pixel more than the box. That pixel is a bar down the whole table with
   nothing to scroll to. Zoom is the browser's and no test can turn it, so
   the test holds the declaration and forces the pixel by hand. */
test('the scroll box of a wide table draws no bar down its side', async () => {
  const table = document.createElement('sds-table') as HTMLElement & { columns: unknown; rows: unknown };
  table.id = 'wide';
  table.setAttribute('scrollable', '');
  table.setAttribute('caption', 'Wider than its column.');
  table.setAttribute('width', '3000px');
  table.columns = Array.from({ length: 12 }, (_, i) => ({ head: `Column ${i + 1}` }));
  table.rows = [{ cells: Array.from({ length: 12 }, (_, i) => `a value in column ${i + 1}`) }];
  document.body.append(table);
  await settle();

  const scroller = q('#wide .sds-table-scroll');
  expect(scroller.scrollWidth - scroller.clientWidth, 'the fixture must be wider than the column').toBeGreaterThan(0);
  expect(getComputedStyle(scroller).overflowY).toBe('hidden');

  /* The rounding, made by hand: a fraction of a pixel under the rows. */
  q('#wide table').style.marginBottom = '0.6px';
  await settle();
  expect(scroller.scrollHeight - scroller.clientHeight, 'nothing to scroll to down the side').toBeLessThanOrEqual(1);
  expect(scroller.clientWidth, 'no bar takes width off the box').toBe(scroller.offsetWidth);
});
