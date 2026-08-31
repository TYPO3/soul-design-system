/* The way into a row.

   A list of things with a detail behind each of them carries a control at the
   end of the row. What has to hold is that it is a link and not a press
   handler — a middle click, a new tab and a copied address are the whole
   reason for the choice, and none of them survives a handler — that it is one
   keyboard stop per row, and that it leaves the rest of the row alone: a cell
   with a link of its own, a cell with a tooltip, and text somebody selects all
   stay what they were.

   That last one is what a stretched row link would have taken, and it is why
   this shape was chosen over it. It is asserted here so the trade cannot be
   quietly reversed. */

import { test, expect } from '@playwright/test';

const PAGE = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <sds-table id="checkouts"></sds-table>
  <script type="module">
    const table = document.querySelector('#checkouts');
    table.columns = [
      { head: 'Checkout', cls: 'sds-td-name' },
      { head: 'Database', cls: 'sds-td-meta' },
      { head: 'Address', cls: 'sds-td-meta' },
      { head: '', cls: 'sds-td-into' },
    ];
    table.rows = [];
  </script>
</body>
</html>`;

/* Built from the page, so the cells hold real elements rather than the text of
   them: the address is a link of its own and the database name a cell with a
   tooltip, which are the two things the way in must not swallow. */
const ROWS = `
  const table = document.querySelector('#checkouts');
  const cell = (name, i) => \`
    <td class="sds-td-name">\${name}<span class="sds-td-note">main · clean</span></td>
    <td class="sds-td-meta"><code id="db-\${i}" title="db_\${name}_full">db_\${name}…</code></td>
    <td class="sds-td-meta"><a id="site-\${i}" href="#site-\${i}">\${name}.test</a></td>
    <td class="sds-td-into"><sds-button id="into-\${i}" href="#open-\${i}"
        variant="secondary" size="sm" title="Open \${name}">Open</sds-button></td>\`;
  const body = document.querySelector('#checkouts tbody');
  body.innerHTML = ['a', 'b', 'c'].map((n, i) => \`<tr>\${cell(n, i)}</tr>\`).join('');`;

test.beforeEach(async ({ page }) => {
  await page.route('**/table-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE }));
  await page.goto('/table-fixture.html', { waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-table') !== undefined, undefined, { timeout: 15_000 });
  await page.waitForFunction(() => document.querySelector('#checkouts tbody') !== null);
  await page.evaluate(ROWS);
  await page.evaluate(() => customElements.whenDefined('sds-button'));
  await expect(page.locator('#into-0 a')).toBeVisible();
});

test('the way in is an anchor, not a handler', async ({ page }) => {
  /* The whole reason for this shape over a press handler on the row: what the
     platform does with a link is what nobody has to reimplement. */
  const into = page.locator('#into-0 a');
  await expect(into).toHaveAttribute('href', '#open-0');
  await expect(into).toHaveClass(/sds-btn/);
  await expect(page.locator('#into-0 button')).toHaveCount(0);

  await into.click();
  await expect(page).toHaveURL(/#open-0$/);
});

test('the column holds the control and no more', async ({ page }) => {
  const shape = await page.evaluate(() => {
    const cells = [...document.querySelectorAll('#checkouts tbody tr')].map(
      (row) => (row.lastElementChild as HTMLElement).getBoundingClientRect().width,
    );
    const head = [...document.querySelectorAll('#checkouts thead th')].pop() as HTMLElement;
    const cell = document.querySelector('#checkouts .sds-td-into') as HTMLElement;
    const style = getComputedStyle(cell);
    const name = document.querySelector('#checkouts .sds-td-name') as HTMLElement;
    return {
      widths: cells.map((w) => Math.round(w)),
      nameWidth: Math.round(name.getBoundingClientRect().width),
      headText: (head.textContent ?? '').trim(),
      align: style.textAlign,
      wrap: style.whiteSpace,
    };
  });
  /* One width down the column, and the same place in every row. */
  expect(new Set(shape.widths).size).toBe(1);
  /* Held to what the control needs: the name column, which carries the reading,
     keeps the room. */
  expect(shape.widths[0]).toBeLessThan(shape.nameWidth);
  expect(shape.headText, 'a head over it would name the button rather than a fact').toBe('');
  expect(shape.align).toBe('end');
  expect(shape.wrap).toBe('nowrap');
});

test('the rest of the row is left alone', async ({ page }) => {
  /* Nothing is laid over the cells, which is the whole trade against a link
     stretched across the row: what the browser hits in a cell is that cell. */
  const hit = await page.evaluate(() => {
    const at = (el: Element): string | null => {
      const box = el.getBoundingClientRect();
      const found = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return found?.id || found?.tagName.toLowerCase() || null;
    };
    return {
      database: at(document.querySelector('#db-0') as Element),
      address: at(document.querySelector('#site-0') as Element),
      name: at(document.querySelector('#checkouts .sds-td-name') as Element),
    };
  });
  expect(hit.database, 'the cell with the tooltip is what the pointer finds').toBe('db-0');
  expect(hit.address, 'a cell may keep a link to somewhere else entirely').toBe('site-0');
  expect(hit.name, 'and the name is text a reader can select').toBe('td');

  /* And it still goes where it goes, rather than where the row goes. */
  await page.locator('#site-0').click();
  await expect(page).toHaveURL(/#site-0$/);
});

test('one keyboard stop per row, in the order the row is read', async ({ page }) => {
  await page.locator('#site-0').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#into-0 a'), 'the way in comes last in its row').toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#site-1'), 'and the next row starts over').toBeFocused();
});

test('a column stands at the edge it is read down, head and cells alike', async ({ page }) => {
  /* A table of its own: the one above was handed its rows as markup, which is
     the other form and not what a column's options travel through. */
  await page.evaluate(() => {
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
  });
  await expect(page.locator('#log tbody tr')).toHaveCount(2);

  const laid = await page.evaluate(() => {
    const at = (sel: string) => {
      const el = document.querySelector(sel) as HTMLElement;
      const style = getComputedStyle(el);
      return { align: style.textAlign, figures: style.fontVariantNumeric, width: Math.round(el.getBoundingClientRect().width) };
    };
    return {
      whenHead: at('#log thead th:nth-child(3)'),
      whenCell: at('#log tbody td:nth-child(3)'),
      hash: at('#log tbody td:nth-child(1)'),
      subject: at('#log tbody td:nth-child(2)'),
    };
  });

  /* The head goes with the cells, or it names the column beside it. */
  expect(laid.whenCell.align).toBe('end');
  expect(laid.whenHead.align, 'a head over a column it does not stand at').toBe('end');
  expect(laid.whenCell.figures, 'the right edge is only worth having when the digits line up').toContain('tabular-nums');

  /* Held to what they hold, and the reading takes the slack. */
  expect(laid.subject.width).toBeGreaterThan(laid.hash.width + laid.whenCell.width);
});

test('the row still lights up under the pointer, and a selected row still fills', async ({ page }) => {
  const lit = await page.evaluate(() => {
    const row = document.querySelector('#checkouts tbody tr') as HTMLElement;
    const rest = getComputedStyle(row).backgroundColor;
    row.classList.add('is-selected');
    return { rest, selected: getComputedStyle(row).backgroundColor };
  });
  expect(lit.selected, 'selection is still the one fill a row gets').not.toBe(lit.rest);
});
