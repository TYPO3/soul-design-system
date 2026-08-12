/* The rendered documentation, opened.

   Everything else in the gate reads sources; nothing opens what came out. That
   decides what belongs here: not "does the page look right", which is a
   screenshot's job, but the findings the theme was written to fix — each one
   repaired in a template or the document layer, with nothing else holding it
   down. `packages/guides-theme/acceptance/` is the subject, rendered by the server this
   suite starts, because a stale render hides the regression this looks for. */

import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { test, expect, type Page } from '@playwright/test';

import { ACCEPTANCE_URL, SITE_DIR, SITE_URL } from '../playwright.config.ts';

const FIXTURE = `${ACCEPTANCE_URL}/index.html`;
const REFERENCE = `${ACCEPTANCE_URL}/nodes.html`;

/* A wide viewport, because two of the tests below are about width: the
   measure the prose holds and the width the blocks are allowed to take. At a
   narrow one both are the column and the difference disappears. */
test.use({ viewport: { width: 1440, height: 1000 } });

function pages(dir: string, root = dir): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...pages(path, root));
    else if (entry.endsWith('.html')) out.push(relative(root, path).split(sep).join('/'));
  }
  return out;
}

test.describe('the render', () => {
  test('every page the renderer wrote loads, and asks for nothing that is not there', async ({ page }) => {
    const site = pages(SITE_DIR);
    expect(site.length, 'the site should have pages in it').toBeGreaterThan(1);
    test.setTimeout(Math.max(30_000, site.length * 2_000));

    const bad: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') bad.push(`console: ${m.text()}`);
    });
    page.on('pageerror', (e) => bad.push(`uncaught: ${e.message}`));
    /* A missing asset is the failure this render is most prone to: every path
       on the page is written relative to the publish root by a renderer that
       decides the depth per page, and a page one directory down is where that
       arithmetic goes wrong. It is also silent — the page still draws, just
       unstyled or unscripted. */
    page.on('response', (r) => {
      if (r.status() >= 400) bad.push(`${r.status()}: ${r.url()}`);
    });

    for (const path of site) {
      bad.length = 0;
      await page.goto(`${SITE_URL}/${path}`, { waitUntil: 'load' });
      expect(bad, `${path}`).toEqual([]);
    }
  });

  test('an element that upgrades replaces the rendering it arrived with', async ({ page }) => {
    /* Lit renders *after* the children it finds rather than emptying the
       container, so an element handed its own prerendered markup keeps it and
       draws a second copy beside it. Silent everywhere else: the page is
       valid, it just says everything twice. */
    /* The copied specimen cards are not pages of the site: they carry no
       bundle, so nothing in them upgrades and nothing here applies. */
    const site = pages(SITE_DIR).filter((path) => !path.includes('_cards/'));
    test.setTimeout(Math.max(60_000, site.length * 3_000));

    for (const path of site) {
      await page.goto(`${SITE_URL}/${path}`, { waitUntil: 'load' });

      /* The marker the build leaves is consumed by whatever upgrades over it.
         One still in the document is an element that never cleared what it was
         given, which is the same thing as an element showing it twice. */
      await expect(
        page.locator('template[data-sds-content]'),
        `${path}: an element kept the markup it was rendered with`,
      ).toHaveCount(0);

      /* And said a second way, on the elements the failure was actually seen
         on: each of these renders one node and nothing else, so two is the
         whole symptom. The marker above is the general rule and this is the
         thing a reader of the report recognises. */
      const doubled = await page.evaluate(() =>
        [...document.querySelectorAll('sds-crumbs, sds-theme, sds-search, sds-badge')]
          .filter((el) => el.children.length > 1)
          .map((el) => `${el.tagName.toLowerCase()} drew ${el.children.length}`),
      );
      expect(doubled, `${path}: an element drew itself more than once`).toEqual([]);
    }
  });

  test('a marketing hero composes the existing layout vocabulary', async ({ page }) => {
    await page.goto(`${SITE_URL}/index.html`, { waitUntil: 'load' });

    const hero = page.locator('.sds-band').first().locator('.sds-sections > .sds-split');
    await expect(hero.locator(':scope > .sds-stack')).toHaveCount(2);
    const widths = await hero.locator(':scope > .sds-stack').evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().width),
    );
    expect(Math.abs(widths[0]! - widths[1]!)).toBeLessThan(2);
    await expect(hero.locator('.sds-stack h1')).toHaveText('One system, from design to delivery');
    await expect(hero.locator('sds-figure .sds-art')).toHaveAttribute('src', /design-system-workbench\.png$/);
    await expect(hero.locator('sds-figure .sds-art')).toHaveAttribute('alt', '');
    await expect(page.locator('.sds-band').first().locator('.sds-sections > sds-card-grid > .sds-grid')).toBeVisible();
  });
});

test.describe('the mark in the tab', () => {
  test('is on a page below the root, and points at a file that is there', async ({ page }) => {
    /* The one path no reader ever clicks: a browser fetches a tab icon quietly,
       so a wrong one is a site that looks fine everywhere and is blank in the
       one place a reader keeps it. What breaks is the depth, so it is read from
       a page below the root rather than from the index. */
    const below = pages(SITE_DIR).find((path) => path.includes('/') && !path.startsWith('_'));
    expect(below, 'the site should have a page below its root').toBeTruthy();
    await page.goto(`${SITE_URL}/${below}`, { waitUntil: 'load' });

    const icons = page.locator('link[rel="icon"]');
    expect(await icons.count(), 'the site has a mark, so its tab carries one').toBeGreaterThan(0);

    for (const href of await icons.evaluateAll((links) => links.map((l) => l.getAttribute('href') ?? ''))) {
      expect(href, 'resolved from the page, not from a domain root').not.toMatch(/^\//);
      const response = await page.request.get(new URL(href, page.url()).toString());
      expect(response.status(), href).toBe(200);
    }
  });
});

test.describe('what the theme repaired', () => {
  test('the first press lands on the way past the chrome', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* Off the top of the page, and reachable there — a link taken out of the
       flow with `display: none` is invisible to the one reader it is for, and
       one that stays visible is a control every other reader has to look at. */
    const skip = page.locator('.sds-skip');
    expect((await skip.boundingBox())?.y).toBeLessThan(0);

    await page.keyboard.press('Tab');
    await expect(skip, 'nothing in the bar comes before it').toBeFocused();
    expect((await skip.boundingBox())?.y).toBeGreaterThanOrEqual(0);

    /* And it goes somewhere: the bar, the rail and the breadcrumbs are what
       stands between the top of the page and the text of it. */
    const target = (await skip.getAttribute('href')) ?? '';
    await expect(page.locator(target)).toHaveCount(1);
    expect(await page.locator(`${target} .sds-prose`).count()).toBe(1);
  });

  test('a heading hands over the place it names', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* The id is on the section, the heading is inside it, and nothing in the
       core's output joins the two — so every section of every page is a place
       a reader can be sent to and cannot send anybody to. */
    const marks = await page.evaluate(() =>
      [...document.querySelectorAll('.sds-prose .section')]
        .map((section) => {
          const heading = section.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
          return {
            id: section.id,
            level: heading?.tagName ?? '',
            href: heading?.querySelector('a.sds-permalink')?.getAttribute('href') ?? null,
          };
        })
        /* The page is a section too, and its heading is the title. */
        .filter((m) => m.level !== 'H1'));

    expect(marks.length).toBeGreaterThan(2);
    expect(marks.filter((m) => m.href !== `#${m.id}`)).toEqual([]);
    for (const { id } of marks) await expect(page.locator(`#${id}`)).toHaveCount(1);

    /* And not on the title: a link to the top of a page is the address the
       reader followed to get here. */
    await expect(page.locator('.sds-prose h1 a.sds-permalink')).toHaveCount(0);
  });

  test('a glossary defines words a sentence elsewhere can point at', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* The core renders a definition list and anchors nothing, so a page can
       define a word and have no way of saying where it did. */
    const entries = await page.evaluate(() =>
      [...document.querySelectorAll('#words-this-reference-defines dt[id]')].map((term) => ({
        id: term.id,
        words: (term.firstChild?.textContent ?? '').trim(),
        href: term.querySelector('a.sds-permalink')?.getAttribute('href') ?? null,
        classifier: term.querySelector('.classifier')?.textContent?.trim() ?? null,
      })));

    expect(entries.length).toBeGreaterThan(2);
    expect(entries.filter((e) => e.href !== `#${e.id}`)).toEqual([]);
    /* The id is the term's own words, not its position in the list: a glossary
       that renumbers when a word is added breaks every link into it. */
    expect(entries.map((e) => e.id)).toEqual(entries.map((e) => e.words.replace(/\s+/g, '-').toLowerCase()));

    /* And the kind a term may be given arrives with it, in the register of the
       definition rather than of the term. */
    const kinds = entries.filter((e) => e.classifier !== null);
    expect(kinds.length).toBeGreaterThan(0);
    const [dim, term] = await page.evaluate(() => {
      const colour = (el: Element | null): string => (el ? getComputedStyle(el).color : '');
      return [
        colour(document.querySelector('#words-this-reference-defines .classifier')),
        colour(document.querySelector('#words-this-reference-defines dt[id]')),
      ];
    });
    expect(dim).not.toBe(term);
  });

  test('a line block keeps the breaks it was written with', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const rows = await page.evaluate(() =>
      [...document.querySelectorAll('.sds-prose .line-block .line')].map((line) => {
        const box = line.getBoundingClientRect();
        return { text: (line.textContent ?? '').trim(), top: box.top, left: box.left, height: box.height };
      }));

    /* The break is the content here, so nothing may close one up: every line
       is a row of its own, in the order it was written. */
    expect(rows.length).toBeGreaterThan(3);
    expect(new Set(rows.map((r) => r.top)).size).toBe(rows.length);
    expect(rows.map((r) => r.top)).toEqual([...rows].map((r) => r.top).sort((a, b) => a - b));

    /* A line nobody wrote in is the gap in a stanza, and a `div` with nothing
       in it has no height at all. */
    const blank = rows.filter((r) => r.text === '');
    expect(blank.length).toBeGreaterThan(0);
    expect(Math.min(...blank.map((r) => r.height))).toBeGreaterThan(0);

    /* And an indented run keeps the step it was indented by. */
    const edge = Math.min(...rows.map((r) => r.left));
    expect(rows.some((r) => r.left > edge)).toBe(true);
  });

  test('a formula is shown as the source it arrived as', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The renderer typesets nothing and hands the source through, and MathML
       layout drops text that is not inside a token element — so a formula left
       in that layout is a blank space in the sentence. */
    const inline = page.locator('.sds-prose p math').first();
    await expect(inline).toHaveText(/mc\^2/);
    expect((await inline.boundingBox())?.width).toBeGreaterThan(0);

    const block = page.locator('.sds-prose .section > math').first();
    await expect(block).toHaveText(/\\frac/);
    expect((await block.boundingBox())?.width).toBeGreaterThan(0);

    /* Both say what they are: a machine's own words, in the register the rest
       of the page keeps for those. */
    const [formula, literal] = await page.evaluate(() => {
      const font = (el: Element | null): string => (el ? getComputedStyle(el).fontFamily : '');
      return [font(document.querySelector('.sds-prose math')), font(document.querySelector('.sds-prose code'))];
    });
    expect(formula).toBe(literal);
  });

  test('a class an author wrote is carried and means nothing more', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const box = page.locator('.sds-prose .a-class-from-the-source');
    await expect(box, 'the name reaches the markup as it was written').toHaveCount(1);

    /* What is inside is document content and is set like any other. The box is
       not: a rule matching a name from somebody's source would make every
       author's private vocabulary public API of this system. */
    const [inside, plain, own] = await page.evaluate(() => {
      const size = (el: Element | null): string => (el ? getComputedStyle(el).fontSize : '');
      const container = document.querySelector('.a-class-from-the-source');
      const style = container ? getComputedStyle(container) : null;
      return [
        size(document.querySelector('.a-class-from-the-source p')),
        size(document.querySelector('.sds-prose .section > p')),
        [style?.borderTopWidth, style?.paddingTop, style?.backgroundImage, style?.backgroundColor],
      ];
    });

    expect(inside).toBe(plain);
    expect(own).toEqual(['0px', '0px', 'none', 'rgba(0, 0, 0, 0)']);
  });

  test('a table is the component drawing markup a document wrote', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The cells are the document's, because a cell carries a link or a
       literal and no property could hold one. Everything the table *is* comes
       from the element, so a page here and a page of a product are the same
       table rather than two that resemble each other. */
    const first = page.locator('sds-table').first();
    await expect(first).toHaveCount(1);
    await expect(first.locator('> .sds-table-scroll > table.sds-table')).toHaveCount(1);
    expect(await first.locator('td code').count()).toBeGreaterThan(0);

    /* And no table on the page is drawn any other way. */
    const loose = await page.locator('.sds-prose table').evaluateAll((tables) =>
      tables.filter((t) => !t.closest('sds-table') && !t.classList.contains('field-list')).length);
    expect(loose).toBe(0);
  });

  test('the way on from a page is the page the tree reads next', async ({ page }) => {
    /* The renderer computes no prev/next — its own block has been commented
       out of the core template for years — so this is the theme's, and the
       order it offers has to be the order the rail lists. */
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const foot = page.locator('main.sds-column > sds-pager > nav.sds-pager');
    await expect(foot).toHaveCount(1);
    /* The first page of a manual has nothing behind it, and it is in the tree
       all the same: a toctree lists what is under a page and never the page it
       is written on, so the root is the one document the walk has to be told
       about. */
    await expect(foot.locator('a[rel="prev"]')).toHaveCount(0);
    const next = foot.locator('a[rel="next"]');
    /* The direction is on the glyph, so it joins the page title in the name
       instead of replacing it: a name written over the whole control would
       have said a sentence the reader cannot see in place of the one they can.
       Read in the order the two stand in, the arrow trailing the label. */
    await expect(next).toHaveAccessibleName(/Next page$/);
    expect((await next.innerText()).trim().length).toBeGreaterThan(0);

    /* A press that goes somewhere is a link and looks like a control, which is
       the one place `a:hover` outweighs `.sds-btn` — the underline it brings
       is invisible in every screenshot and wrong on every button. */
    await next.hover();
    expect(await next.evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe('none');

    /* And it goes there. */
    const onward = (await next.getAttribute('href')) ?? '';
    await next.click();
    await expect(page).toHaveURL(new RegExp(`${onward}$`));

    /* From the second page on, both ways are offered and the one back is the
       page just left. */
    const back = page.locator('nav.sds-pager a[rel="prev"]');
    await expect(back).toHaveCount(1);
    await back.click();
    await expect(page).toHaveURL(/index\.html$/);
  });

  test('the end of the site says which site it is the end of', async ({ page }) => {
    /* The bar is long gone by the time a reader is down here, and a footer
       that opens with a column of links reads as more navigation. The mark and
       the sentence are drawn out of the same settings the bar uses, so the two
       ends of a site cannot name it two different ways. */
    await page.goto(`${SITE_URL}/index.html`, { waitUntil: 'load' });

    const brand = page.locator('sds-footer .sds-footer__brand');
    await expect(brand).toHaveCount(1);
    /* The same name in the same order. Compared with the whitespace taken out:
       the two lockups are written in different templates and a flex gap does
       the spacing in both, so what a space is in the markup is not a fact
       about either of them. */
    const named = (text: string): string => text.replace(/\s+/g, '');
    expect(named(await brand.locator('.sds-lockup .sds-wordmark').innerText()))
      .toBe(named(await page.locator('.sds-bar .sds-lockup .sds-wordmark').innerText()));
    await expect(brand.locator('.sds-lockup svg.sds-signet use')).toHaveAttribute('href', /#art$/);
    expect((await brand.locator('.sds-footer__note').innerText()).trim().length).toBeGreaterThan(0);

    /* Beside the columns, not above them: one row that wraps where there is no
       room for two, and no breakpoint deciding when. */
    const [markBox, linksBox] = await Promise.all([
      brand.boundingBox(),
      page.locator('sds-footer .sds-footer__groups').boundingBox(),
    ]);
    expect(markBox?.x).toBeLessThan(linksBox?.x ?? 0);
    expect(markBox?.y).toBeCloseTo(linksBox?.y ?? 0, 0);

    /* And whose it is, under all of it and on its own line — the renderer's
       own `copyright`, which the fixture sets and this site does not, so it is
       asked for where it was written. */
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await expect(page.locator('sds-footer .sds-footer__end span').first()).toHaveText(/^©/);
  });

  test('a component in the text speaks the size of the text', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The admonition is the paragraph above it with a frame around it, and it
       used to be the component layer's 12px — right beside 17px prose, twice
       on every page of a reference. What is a caption stays small on purpose,
       and that is the other half of the rule: it has to still be true, or the
       repair was a global size change wearing a scope. */
    const sizes = await page.evaluate(() => {
      const px = (el: Element | null): number => (el ? parseFloat(getComputedStyle(el).fontSize) : NaN);
      return {
        prose: px(document.querySelector('.sds-prose > .section > p')),
        note: px(document.querySelector('sds-note p')),
        caption: px(document.querySelector('figcaption')),
      };
    });

    expect(sizes.note).toBeCloseTo(sizes.prose, 1);
    expect(sizes.caption).toBeLessThan(sizes.prose);
  });

  test('the measure holds the words and lets the blocks out', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const widths = await page.evaluate(() => {
      const w = (sel: string): number => document.querySelector(sel)?.getBoundingClientRect().width ?? NaN;
      return {
        column: w('.sds-column'),
        paragraph: w('.sds-prose > .section > p'),
        table: w('.sds-prose table'),
        /* The class and not the element: the host draws nothing and has no
           box of its own — the block is the box the element renders inside
           it, which is also the one a page without scripting gets. */
        code: w('.sds-prose .sds-code'),
      };
    });

    /* Words stop short of the column; a table and a code block do not. Both
       halves matter: prose that runs the full column is unreadable, and a
       reference table folded into 66ch is unusable. */
    expect(widths.paragraph).toBeLessThan(widths.column - 20);
    expect(widths.table).toBeGreaterThan(widths.paragraph);
    expect(widths.code).toBeGreaterThan(widths.paragraph);
  });

  test('an embedded document is framed, and stays the size it was measured at', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await page.waitForFunction(() => customElements.get('sds-embed') !== undefined, undefined, { timeout: 15_000 });

    /* The node the renderer emits is a bare `<iframe>`: no ground, no corner,
       and the browser's own inset ridge around it. One left outside the
       element is a frame this system never drew. */
    await expect(page.locator('.sds-prose iframe:not(.sds-embed__frame > iframe)')).toHaveCount(0);

    const frame = page.locator('.sds-embed__frame--fixed');
    await expect(frame).toHaveCount(1);
    /* The card is at the viewport its `@dsCard` header declares and the
       caption says so — the two are the same number, checked here because
       nothing else compares the page against the card it embeds. */
    const width = await frame.locator('iframe').evaluate((el) => el.getBoundingClientRect().width);
    expect(Math.round(width)).toBe(700);
    await expect(page.locator('.sds-embed__caption')).toContainText('700x260');
  });

  test('the local contents is a table of contents, not the rail', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* The core sends the rail, the printed toctree and `.. contents::` through
       one template, so a theme overriding it speaks for all three. `renderLink`
       answers `#` for the document being rendered, which is how every rail item
       became the current page pointing at nothing. */
    const toc = page.locator('nav.contents');
    await expect(toc).toBeVisible();
    await expect(toc.locator('.sds-rail__item')).toHaveCount(0);

    const links = toc.locator('a');
    expect(await links.count()).toBeGreaterThan(1);
    for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))) {
      expect(href, 'a section of this page is an anchor on it').toMatch(/^#.+/);
      await expect(page.locator(href), `${href} points at a section that exists`).toHaveCount(1);
    }
  });

  test('the rail is the section the page is in, however deep the page sits', async ({ page }) => {
    /* The section used to be looked for two levels down, by matching the link
       the renderer resolves to `#`. From a page below that nothing matched and
       the rail fell back to the list of sections — the pages around the reader
       gone, on every page of a manual that nests. */
    await page.goto(`${ACCEPTANCE_URL}/depth/group/far.html`, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    await expect(rail.locator('.sds-label')).toHaveText('Depth');
    await expect(rail.locator('.sds-rail__item', { hasText: 'Near' })).toHaveCount(1);

    /* And the group is open, because it holds the page the reader is on —
       three levels from the root, which is the whole point of the fixture. */
    const here = rail.locator('.sds-rail__item.is-active');
    await expect(here).toHaveText('Far');
    await expect(here).toHaveAttribute('aria-current', 'page');
    await expect(rail.locator('.sds-rail__group[open]')).toHaveCount(1);
  });

  test('a page inside a group is a row of the rail like any other', async ({ page }) => {
    /* The items of a group are laid out in the fold's own box rather than in the
       rail, so the column the group declared by disappearing never reached them:
       inline items in a block box, flowing as a paragraph, two short page titles
       to a line. Measured rather than asserted about a class, because what broke
       was the layout and not the markup. */
    await page.goto(`${ACCEPTANCE_URL}/depth/group/far.html`, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    const width = await rail.evaluate((el) => el.getBoundingClientRect().width);
    const rows = await rail
      .locator('.sds-rail__group[open] > .sds-rail__item')
      .evaluateAll((items) =>
        items.map((el) => {
          const box = el.getBoundingClientRect();
          return { label: el.textContent?.trim() ?? '', top: Math.round(box.top), width: box.width };
        }),
      );
    expect(rows.length, 'the open group should hold more than one page').toBeGreaterThan(1);

    for (const row of rows) {
      expect(row.width, `${row.label} takes the rail's width`).toBeGreaterThan(width * 0.8);
    }
    expect(new Set(rows.map((row) => row.top)).size, 'every page on a line of its own').toBe(rows.length);
  });

  test('the folds of a rail sit under its pages', async ({ page }) => {
    /* A fold between two pages breaks the column a reader is scanning, and the
       tree is written for reading order rather than for that. The fixture's
       section writes its group before its last page, so the order here is the
       rail's own and not the toctree's. */
    await page.goto(`${ACCEPTANCE_URL}/depth/group/far.html`, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    const order = await rail.evaluate((el) =>
      [...el.querySelectorAll(':scope > .sds-rail__item, .sds-rail__group')].map((row) =>
        row.matches('.sds-rail__group') ? 'fold' : 'page',
      ),
    );
    expect(order, 'a page after a fold in the tree is still drawn before it').toEqual([
      ...order.filter((row) => row === 'page'),
      ...order.filter((row) => row === 'fold'),
    ]);
    expect(order.filter((row) => row === 'fold').length, 'the section should hold a fold').toBeGreaterThan(0);
    expect(order.filter((row) => row === 'page').length, 'and pages before it').toBeGreaterThan(1);
  });

  test('every row of the rail starts on the same edge', async ({ page }) => {
    /* Three edges once: the heading and the top-level pages at 9, a group's pages
       indented to 17, and the group's own heading pushed to 33 by the chevron in
       front of it. The rail is one column of rows, so a reader on a grouped page
       found the filled block of the current one at an edge of its own. */
    await page.goto(`${ACCEPTANCE_URL}/depth/group/far.html`, { waitUntil: 'load' });

    const edges = await page.locator('.sds-rail').evaluate((rail) => {
      /* Where the words start, not where the box does: the chevron used to sit
         inside the heading's box and move nothing but the text. */
      const text = (el: Element): number => {
        const first = [...el.childNodes].find((node) => node.nodeType === 3 && node.textContent?.trim());
        const range = document.createRange();
        range.selectNodeContents(first ?? el);
        return Math.round(range.getBoundingClientRect().left);
      };
      const rows = [...rail.querySelectorAll('.sds-label, .sds-rail__item, .sds-rail__group > summary')];
      return rows.map((el) => ({ label: el.textContent?.trim().slice(0, 24) ?? '', left: text(el) }));
    });

    expect(edges.length, 'the rail should have a heading, a group and pages').toBeGreaterThan(3);
    const [first, ...rest] = edges;
    for (const row of rest) {
      expect(row.left, `${row.label} starts where ${first?.label} does`).toBe(first?.left);
    }
  });

  test('a section that is one page carries no rail, and no button to open one', async ({ page }) => {
    /* Such a page used to get the list of sections instead, every one of them
       folded open — a sitemap hung off a page belonging to none of it, and the
       rail changed shape the moment the reader followed one of those links.
       The bar already says which section they are in. */
    await page.goto(`${ACCEPTANCE_URL}/nodes.html`, { waitUntil: 'load' });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.sds-rail')).toHaveCount(0);
    await expect(page.locator('#page-rail')).toHaveCount(0);
    /* And the toggle goes with it. The element drops itself once it finds no
       target, but it asks a document — so before any script there was a button
       standing in the bar with nothing behind it. */
    await expect(page.locator('.sds-bar .sds-menu--for')).toHaveCount(0);
  });

  test('the page a rail is named after is the first page in it', async ({ page }) => {
    /* The heading over a rail is a heading, not a link, so a section whose rail
       held only its children left the reader standing on the index as the one
       page missing from it — and with nothing marked, since `active` counts
       over pages the rail lists. */
    await page.goto(`${ACCEPTANCE_URL}/depth/index.html`, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    await expect(rail.locator('.sds-label')).toHaveText('Depth');
    await expect(rail.locator('.sds-rail__item').first()).toHaveText('Depth');

    const here = rail.locator('.sds-rail__item.is-active');
    await expect(here).toHaveText('Depth');
    await expect(here).toHaveAttribute('aria-current', 'page');
  });

  test('a rail with no page of its own in it marks none of them', async ({ page }) => {
    /* `active` counts over the flattened rail and the element falls back to
       zero, so a page whose rail does not list it — the root, whose rail is
       the sections — had its first item filled in the accent and announced as
       the page the reader was on. The template writes -1 rather than leaving
       the attribute off. */
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    expect(await rail.locator('.sds-rail__item').count()).toBeGreaterThan(1);
    await expect(rail.locator('.sds-rail__item.is-active')).toHaveCount(0);
    await expect(rail.locator('[aria-current="page"]')).toHaveCount(0);
  });

  test('the inline footnote mark names the number the block carries', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The core prints what the author typed between the brackets, so `[#note]_`
       says `#note` inline while the block below says `[1]`. The number only
       exists after compiling, which is why it comes from the target. */
    const marks = page.locator('sup a[href^="#footnote"], sup a[href^="#citation"]');
    expect(await marks.count()).toBeGreaterThan(1);

    for (const href of await marks.evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))) {
      const inline = (await page.locator(`sup a[href="${href}"]`).innerText()).trim();
      const label = (await page.locator(`${href} > [class$="-label"]`).innerText()).trim();
      expect(label, `the block for ${href}`).toBe(`[${inline}]`);
    }
  });

  test('a sidebar is an aside, and nothing on the page is a bare admonition', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* Out of the core a sidebar arrives as `div.admonition.admonition-sidebar`,
       which in this vocabulary would draw it a glyph saying it is a warning.
       It is a digression with a title — a topic, and drawn as one. */
    await expect(page.locator('aside.topic')).toHaveCount(2);

    /* And the general form of the same thing: `admonition` is the core's name
       for a box this system draws as an element. One left in the output is a
       node whose template was never written. */
    await expect(page.locator('.admonition')).toHaveCount(0);
  });

  test('a directive that draws a component of ours draws the whole of it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* A directive that answers for the title and the link alone leaves a page
       wanting the picture writing declarations into a stylesheet of its own,
       which is the failure the class layer exists to prevent. The card the
       fixture writes carries every option, and this is that card. */
    /* And it is the element that draws it, not a `div` wearing its classes:
       the front door is the same one everywhere, so the card a renderer
       produces cannot drift from the card a product writes. */
    await expect(page.locator('sds-teaser')).toHaveCount(2);
    await expect(page.locator('.sds-teaser:not(sds-teaser > .sds-teaser)')).toHaveCount(0);

    const full = page.locator('.sds-teaser').first();
    await expect(full.locator('.sds-teaser__image svg use')).toHaveAttribute('href', /#art$/);
    await expect(full.locator('.sds-row .sds-badge')).toHaveText('Reference');
    await expect(full.locator('.sds-row .sds-label')).toHaveText('Both halves at once');
    await expect(full.locator('.sds-teaser__title a')).toHaveAttribute('href', /nodes\.html$/);

    /* And the other half of the same rule: what nobody wrote is not drawn. A
       row with nothing in it and a ground under a picture that is not there
       are each a hole in a card that sits in a set of them. */
    const bare = page.locator('.sds-teaser').nth(1);
    await expect(bare.locator('.sds-teaser__image')).toHaveCount(0);
    await expect(bare.locator('.sds-row')).toHaveCount(0);
    await expect(bare.locator('.sds-teaser__title a')).toHaveCount(0);
  });

  test('a card takes its target out of its own title', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* `.. card:: :doc:`nodes`` is how a TYPO3 manual says where a card goes:
       the words of the reference are the heading and the reference itself is
       the link. Nothing resolves it for a template handing a component a
       property, which is what `LinkExtension` is for — so this is the test
       that the two ends of that arrangement still meet. */
    const referenced = page.locator('sds-card').first();
    await expect(referenced.locator('.sds-card__title a')).toHaveText('Reference');
    await expect(referenced.locator('.sds-card__title a')).toHaveAttribute('href', /nodes\.html$/);

    /* And the card that carries every option, so a page wanting one of them
       never has to write a declaration of its own. */
    const full = page.locator('sds-card').nth(1);
    await expect(full.locator('.sds-card__media svg use')).toHaveAttribute('href', /#art$/);
    await expect(full.locator('.sds-card__icon .sds-icon')).toHaveCount(1);
    await expect(full.locator('.sds-label')).toHaveText('Chapter 02');
    await expect(full.locator('.sds-card__note')).toHaveText('Both halves at once');
    await expect(full.locator('.sds-card__action')).toContainText('Read it');

    /* One link and no more: the title's, stretched over the frame by the class
       layer. A second anchor would be a second destination under one card. */
    await expect(full.locator('a')).toHaveCount(1);

    /* Nowhere to go, nothing drawn: no link on the title, and no action under
       prose that would send the reader somewhere the card does not name. */
    const last = page.locator('sds-card').last();
    await expect(last.locator('.sds-card__title a')).toHaveCount(0);
    await expect(last.locator('.sds-card__action')).toHaveCount(0);
  });

  test('a picture is framed whether or not there is a claim under it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* `.. figure::` and `.. image::` are the same picture to a reader; only one
       of them says what it is for. The core writes the second as a bare `<img>`
       standing on the page ground, which is a drawing exported on white sitting
       in a hole in dark — so both are the element, and no picture in the prose
       stands outside a frame the document layer would have to catch. */
    await expect(page.locator('.sds-prose img:not(.sds-figure__frame img)')).toHaveCount(0);
    const framed = page.locator('.sds-prose sds-figure .sds-figure__frame');
    await expect(framed).toHaveCount(3);

    /* And what separates them: the caption is the claim, so the picture that
       makes none is drawn without one rather than under an empty line. */
    await expect(page.locator('.sds-prose .sds-figure__caption')).toHaveCount(2);
  });

  test('a drawing that was never prepared is shown, not left blank', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* A reference into a file that names no `id="art"` resolves to nothing and
       leaves a hole where the picture was. The finishing step is what has the
       file in front of it: it marks the element `linked`, and the picture
       arrives as an image — in the colours it was exported with, which is the
       whole of what being unprepared costs. */
    const unprepared = page.locator('.sds-prose sds-figure[linked]');
    await expect(unprepared).toHaveCount(1);
    await expect(unprepared.locator('img.sds-art')).toBeVisible();
    await expect(unprepared.locator('img.sds-art')).toHaveAttribute('src', /unprepared\.svg$/);

    /* The prepared drawing beside it is still referenced, so the flag is read
       off the file and not written onto every picture in the page. */
    const prepared = page.locator('.sds-prose sds-figure:not([linked])').first();
    await expect(prepared.locator('svg use')).toHaveAttribute('href', /#art$/);
  });

  test('the column counts of a card grid become how much room a card gets', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* A count is a breakpoint somebody picked; the grid reflows by a minimum
       width instead, so the counts are read as which of the three widths was
       meant. Two or fewer is wide, five or more is dense. */
    await expect(page.locator('.sds-grid--wide')).toHaveCount(1);
    await expect(page.locator('.sds-grid--dense')).toHaveCount(1);
  });

  test('a set of questions is folded by the platform, not by a listener', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The group is what makes a set exclusive, and it has to be on every answer
       in it — the set is named once in the source, and the answers were told.
       An answer that missed it is an answer that closes nothing, which reads as
       working right up to the moment two are open. */
    const named = page.locator('sds-accordion[name="what-it-holds"] details.sds-accordion__item');
    await expect(named).toHaveCount(2);
    for (const name of await named.evaluateAll((els) => els.map((el) => el.getAttribute('name')))) {
      expect(name).toBe('what-it-holds');
    }

    /* And the behaviour that follows from it: opening the second closed the
       first, with nothing on the page listening for anything. */
    await named.nth(1).locator('summary').click();
    await expect(named.nth(1)).toHaveAttribute('open', '');
    await expect(named.nth(0)).not.toHaveAttribute('open', '');

    /* `:multiple:` is the same set with the group taken out, so the answers are
       independent and both stay open. */
    const many = page.locator('sds-accordion[multiple] details.sds-accordion__item');
    await expect(many).toHaveCount(2);
    for (const name of await many.evaluateAll((els) => els.map((el) => el.getAttribute('name')))) {
      expect(name).toBeNull();
    }
    await many.nth(0).locator('summary').click();
    await many.nth(1).locator('summary').click();
    await expect(many.nth(0)).toHaveAttribute('open', '');
  });
});

test.describe('what the reader gets before the script does', () => {
  /* The rule the whole theme is built on — the server writes, the element
     upgrades. It has no other guard: every other suite runs a browser with
     scripting on, and a page that only works there looks perfect in all of
     them. */
  test.use({ javaScriptEnabled: false });

  const coloured = async (page: Page): Promise<number> =>
    page.locator('sds-code code .hljs-string, sds-code code .hljs-keyword').count();

  test('the code is coloured by the server, so it is coloured without a browser', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });
    expect(await coloured(page)).toBeGreaterThan(1);
  });

  test('both sides of a tab set are readable when nothing can switch them', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    const items = page.locator('sds-tabs sds-tab-item');
    expect(await items.count()).toBeGreaterThan(1);
    for (let i = 0; i < (await items.count()); i++) {
      await expect(items.nth(i)).toBeVisible();
      expect((await items.nth(i).innerText()).trim().length).toBeGreaterThan(0);
    }
  });

  test('a question folds and an answer reads with no script to fold it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The whole reason the fold is a `<details>`: it works here. An accordion
       built out of a button and a listener is a page of headings with the
       answers hidden under them and nothing that opens one. */
    const answers = page.locator('sds-accordion[name="what-it-holds"] details.sds-accordion__item');
    await expect(answers).toHaveCount(2);
    await expect(answers.nth(0).locator('.sds-accordion__body')).toBeVisible();
    await expect(answers.nth(1).locator('.sds-accordion__body')).toBeHidden();

    await answers.nth(1).locator('summary').click();
    await expect(answers.nth(1).locator('.sds-accordion__body')).toBeVisible();
    await expect(answers.nth(0).locator('.sds-accordion__body')).toBeHidden();
  });

  test('an element inside an element is drawn once', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* SSR reaches into the content a parent is handed, so a child that arrived
       already rendered would be rendered again by every element enclosing it —
       empty frames above the full one. Counted rather than looked at: an empty
       frame is exactly what nobody notices in a screenshot. */
    const panels = page.locator('sds-tabs sds-tab-item .sds-tab__panel');
    expect(await panels.count()).toBe(await page.locator('sds-tabs sds-tab-item').count());

    const blocks = page.locator('sds-tabs sds-code .sds-code');
    expect(await blocks.count()).toBe(await page.locator('sds-tabs sds-code').count());
    for (let i = 0; i < (await blocks.count()); i++) {
      expect((await blocks.nth(i).innerText()).trim().length).toBeGreaterThan(0);
    }
  });

  test('a card is a card with no script to draw it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* Everything in the card was written by the renderer, so all of it reads
       here — a card whose title or picture waited for a script would be an
       empty box in a grid of them. */
    const card = page.locator('sds-teaser').first();
    await expect(card.locator('.sds-teaser__title a')).toBeVisible();
    await expect(card.locator('.sds-teaser__image svg')).toBeVisible();
    await expect(card.locator('.sds-row .sds-badge')).toBeVisible();

    /* What the element owns is the node around them, and the document layer
       draws it until the element exists: without it the parts are loose in
       the grid, one cell each and no card anywhere. */
    const frame = await card.evaluate((el) => {
      const style = getComputedStyle(el);
      return { display: style.display, border: parseFloat(style.borderTopWidth), radius: style.borderTopLeftRadius };
    });
    expect(frame.display).toBe('flex');
    expect(frame.border).toBeGreaterThan(0);
    expect(parseFloat(frame.radius)).toBeGreaterThan(0);
  });

  test('the evidence on the page is on it, framed, before anything upgrades', async ({ page }) => {
    /* Narrower than the card it embeds, which is where the difference shows:
       an iframe is as wide as its `width` attribute says and takes the column
       with it. */
    await page.setViewportSize({ width: 520, height: 900 });
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The frame is the element's own, drawn before the page was published —
       see `scripts/lib/prerender.ts`. That is the whole difference the
       prerender makes, and it is checked here because this is the one suite
       that runs with scripting off. */
    const frame = page.locator('.sds-embed__frame--fixed');
    await expect(frame).toBeVisible();
    await expect(frame.locator('iframe')).toBeVisible();

    /* The frame the element draws, and the ground and corner that come with
       it — not a border the document layer had to put on a bare `<iframe>`
       because there was nothing else on the page to carry one. And held to
       the column rather than running out of it at the width its own attribute
       states. */
    const drawn = await frame.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        border: parseFloat(style.borderTopWidth),
        radius: parseFloat(style.borderTopLeftRadius),
        width: el.getBoundingClientRect().width,
        room: (el.parentElement as HTMLElement).getBoundingClientRect().width,
      };
    });
    expect(drawn.border).toBeGreaterThan(0);
    expect(drawn.radius).toBeGreaterThan(0);
    expect(drawn.width).toBeLessThanOrEqual(drawn.room);
    expect(drawn.width, 'the column is narrower than the card, so the frame is too').toBeLessThan(700);
  });

  test('the page has its text, its navigation and its stylesheet', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.sds-rail__item').first()).toBeVisible();
    /* Not "a stylesheet loaded" — that the one rule the document layer exists
       for arrived: prose is not the browser's 16px Times running the width of
       the window. */
    const measured = await page.evaluate(() => {
      const p = document.querySelector('.sds-prose > .section > p')!;
      return { family: getComputedStyle(p).fontFamily, width: p.getBoundingClientRect().width };
    });
    expect(measured.family).not.toMatch(/^Times/);
    expect(measured.width).toBeLessThan(900);
  });

  test('the mark starts where the page does, with no toggle standing in front of it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* Wide enough that the rail is a column, so its toggle is not drawn. An
       undrawn button whose host is still a box is an empty flex item, and an
       empty flex item takes the bar's gap — which put the mark a gap inside
       the inset every other row on the page starts at, until the script came
       and the host rule moved it back. */
    const bar = await page.evaluate(() => {
      const el = document.querySelector('.sds-bar')!;
      return {
        inset: parseFloat(getComputedStyle(el).paddingLeft),
        mark: document.querySelector('.sds-lockup')!.getBoundingClientRect().x,
      };
    });
    expect(bar.mark).toBeCloseTo(bar.inset, 0);
  });

  test('the sections the server resolved are in the bar, and the bar stays on the page', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The sections are configuration the renderer resolves per page and writes
       between the tags — the element measures them, it does not own them. Kept
       only where an element could lift them, they were a `<template>` nobody
       can see and a bar with no navigation in it. */
    const pills = page.locator('.sds-bar .sds-menu__items .sds-pill');
    expect(await pills.count()).toBeGreaterThan(1);
    await expect(pills.first()).toBeVisible();

    /* And the width they need, at one no measurement can fold them at: nothing
       has measured, so the row wraps and the bar grows instead of the page
       running out sideways under it. */
    await page.setViewportSize({ width: 380, height: 900 });
    const room = await page.evaluate(() => ({
      wide: document.documentElement.scrollWidth,
      window: window.innerWidth,
    }));
    expect(room.wide).toBeLessThanOrEqual(room.window);
  });
});

test.describe('the colour the server already wrote', () => {
  test('survives the element upgrading around it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await page.waitForFunction(() => customElements.get('sds-code') !== undefined, undefined, { timeout: 15_000 });

    /* `sds-code` colours what it is given, unless what it is given is already
       coloured. Re-colouring would cost the languages the browser bundle does
       not register, the start line and the emphasised lines — and it reads as
       a component that works, because the text is still there. */
    await expect(page.locator('sds-code code .hljs-string').first()).toBeVisible();
    await expect(page.locator('sds-code .sds-code__copy').first()).toBeVisible();

    const kept = await page.locator('sds-code code[data-start]').first();
    await expect(kept).toHaveAttribute('data-start', /\d+/);
  });
});
