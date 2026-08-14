/* The rendered documentation, opened.

   Everything else in the gate reads sources; nothing opens what came out. That
   decides what belongs here: not "does the page look right", which is a
   screenshot's job, but the findings the theme was written to fix — each one
   repaired in a template or the document layer, with nothing else holding it
   down. `packages/guides-theme/acceptance/` is the subject, rendered by the server this
   suite starts, because a stale render hides the regression this looks for. */

import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

import { ACCEPTANCE_DIR, ACCEPTANCE_URL, SITE_DIR, SITE_URL } from '../playwright.config.ts';
import { pageClipped, pageOverflow, pageOverlaps } from './lib/layout.ts';
import { axeIdle, resizeTo } from './lib/story.ts';

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
        [...document.querySelectorAll('sds-nav-breadcrumb, sds-theme, sds-search, sds-badge')]
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
    /* And the one picture that does not open: it stands beside the claim as
       decoration, where every other picture is something to read closer. */
    await expect(hero.locator('a.sds-zoom')).toHaveCount(0);
    await expect(page.locator('.sds-band').first().locator('.sds-sections > sds-grid > .sds-grid')).toBeVisible();
  });

  test('the community boundary keeps its heading beside a centred picture', async ({ page }) => {
    await page.goto(`${SITE_URL}/index.html`, { waitUntil: 'load' });

    const split = page.locator('#scope .sds-split');
    await expect(split).toHaveClass(/\bsds-split--center\b/);
    const halves = split.locator(':scope > .sds-stack');
    await expect(halves).toHaveCount(2);
    await expect(halves.first().locator(':scope > h2')).toHaveText('Built for community projects');
    await expect(halves.last().locator('sds-figure .sds-art')).toHaveAttribute(
      'src',
      /community-bookshelf\.png$/,
    );

    const centres = await halves.evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return box.top + box.height / 2;
      }),
    );
    expect(Math.abs(centres[0]! - centres[1]!)).toBeLessThan(2);
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

    const foot = page.locator('main.sds-column > sds-nav-pager > nav.sds-pager');
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
       used to be the component layer's 12px — right beside 16px prose, twice
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
    await expect(page.locator('.sds-embed__caption')).toContainText('700x270');
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
    await expect(rail.locator('.sds-rail__fold[open]')).toHaveCount(1);
  });

  test('a page inside a fold is a row of the rail, set in by one step', async ({ page }) => {
    /* The pages of a fold are laid out in the fold's own box rather than in the
       rail, so the column the rail declares never reached them: inline items in
       a block box, flowing as a paragraph, two short page titles to a line.
       Measured rather than asserted about a class, because what broke was the
       layout and not the markup. */
    await page.goto(`${ACCEPTANCE_URL}/depth/group/far.html`, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    const width = await rail.evaluate((el) => el.getBoundingClientRect().width);
    const rows = await rail
      .locator('.sds-rail__fold[open] .sds-rail__item')
      .evaluateAll((items) =>
        items.map((el) => {
          const box = el.getBoundingClientRect();
          return { label: el.textContent?.trim() ?? '', top: Math.round(box.top), width: box.width };
        }),
      );
    /* One is enough: the fold's own page is the row above it now, not a copy
       of that name inside it. */
    expect(rows.length, 'the open fold should hold its pages').toBeGreaterThan(0);

    /* Narrower than the rail by the step, and no narrower: a page in a fold is
       a row and not a footnote. */
    for (const row of rows) {
      expect(row.width, `${row.label} is a row of the rail`).toBeGreaterThan(width * 0.7);
      expect(row.width, `${row.label} is set in from it`).toBeLessThan(width);
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

  test('the rail has one edge, and one step in from it', async ({ page }) => {
    /* Three edges once: the heading and the top-level pages at 9, a group's
       pages indented to 17, and the group's own heading pushed to 33 by the
       chevron in front of it — three starts for one column. What a reader gets
       now is two: everything the section holds on one edge, and what a fold
       holds one step in from it, which is what says it belongs to the fold. */
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
      const rows = [...rail.querySelectorAll(':scope > .sds-label, :scope > .sds-rail__item, :scope > .sds-rail__group > .sds-rail__item')];
      const under = [...rail.querySelectorAll('.sds-rail__fold[open] .sds-rail__item')];
      const at = (el: Element) => ({ label: el.textContent?.trim().slice(0, 24) ?? '', left: text(el) });
      return { rows: rows.map(at), under: under.map(at) };
    });

    expect(edges.rows.length, 'the rail should have a heading, a fold and pages').toBeGreaterThan(3);
    const [first, ...rest] = edges.rows;
    for (const row of rest) {
      expect(row.left, `${row.label} starts where ${first?.label} does`).toBe(first?.left);
    }
    expect(edges.under.length, 'the open fold should hold pages').toBeGreaterThan(0);
    for (const row of edges.under) {
      expect(row.left, `${row.label} is set in from the column`).toBeGreaterThan(first?.left ?? 0);
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
    /* And no button stands in the bar for one. The bar is named a rail or it
       is not: a page rendered with the attribute set to nothing would offer a
       drawer whose only contents were never on the page. */
    await expect(page.locator('.sds-bar__toggle')).toHaveCount(0);
  });

  test('the page a rail is named after is the heading over it', async ({ page }) => {
    /* The heading is the way to the section's own page, as a footer column's
       heading is: the name is written once, and it is a link. */
    await page.goto(`${ACCEPTANCE_URL}/depth/index.html`, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    const head = rail.locator('.sds-rail__heading');
    await expect(head).toHaveText('Depth');
    await expect(head).toHaveAttribute('href', /index\.html$|#/);
    await expect(head).toHaveAttribute('aria-current', 'page');
    /* And the name is written once. */
    await expect(rail.locator('.sds-rail__item', { hasText: /^Depth$/ })).toHaveCount(0);
  });

  test('the page above every section carries no rail, and marks no page', async ({ page }) => {
    /* The root is in no section, so there is no section beside it to list —
       what the bar carries is the whole site, on this page as on every other. */
    await page.goto(FIXTURE, { waitUntil: 'load' });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.sds-rail')).toHaveCount(0);
    /* What it has instead is the bar, and there the root is a front door like
       any other — marked as the page because it is the page. */
    await expect(page.locator('.sds-bar__nav .sds-pill')).not.toHaveCount(0);
    await expect(page.locator('.sds-bar__nav .sds-pill[aria-current="page"]')).toHaveText('Overview');
  });

  test('the menu the bar opens is the whole site, on a page at any depth', async ({ page }) => {
    /* Every section is one press from every page, the landing page included:
       what the one button opens is the site and not the corner of it the
       reader is standing in. */
    const toggle = page.locator('.sds-bar__toggle');
    const drawer = page.locator('.sds-bar__drawer');
    const menu = drawer.locator('.sds-bar__level');

    for (const path of ['/index.html', '/guides-theme/quickstart.html']) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`${SITE_URL}${path}`, { waitUntil: 'load' });

      /* Wide, the row is the menu: the front doors stand in it, each with the
         marker that opens its pages. */
      await expect(page.locator('.sds-bar__nav .sds-pill').first()).toBeVisible();
      await expect(page.locator('.sds-bar__fold > summary').first()).toBeVisible();

      await page.setViewportSize({ width: 420, height: 900 });
      await expect(toggle).toBeVisible();
      await toggle.click();

      /* It opens where the reader is standing, and the site is one press up
         from there however deep that is. */
      const back = menu.locator('.sds-bar__back');
      for (let steps = 0; (await back.count()) && steps < 5; steps += 1) await back.click();

      /* One list, and it is the site's own level: every section, including the
         one the bar never names — `Maintaining` is a section of this site and
         not one of its front doors. */
      await expect(menu).toBeVisible();
      await expect(drawer.locator('.sds-bar__nav')).toHaveCount(0);
      for (const section of ['Design system', 'Maintaining']) {
        await expect(menu.locator('.sds-bar__link', { hasText: section })).toHaveCount(1);
      }
      /* And the pages of a section are behind the way into it rather than
         under it: a phone is a window onto a long list, and the whole tree
         unfolded is forty rows to scroll past to reach the four that are the
         site. */
      await expect(menu.locator('.sds-bar__link', { hasText: 'Quick start' })).toHaveCount(0);
      await menu.locator('.sds-bar__row', { hasText: 'Render guide template' }).locator('.sds-bar__into').click();
      await expect(menu.locator('.sds-bar__link', { hasText: 'Quick start' })).toHaveCount(1);
      await expect(back).toHaveText(/Soul Design System/);
      await back.click();
      await expect(menu.locator('.sds-bar__link', { hasText: 'Maintaining' })).toHaveCount(1);
    }
  });

  test('a section opens its pages under the row, and only one at a time', async ({ page }) => {
    /* The panel is a `<details>` under the section it belongs to, so it works
       before any script and the bar only has to say which one is open. A
       pointer opens it as well as a press — a menu that only answers a press
       asks a reader who is already moving to stop and aim — and two standing
       over one page is a reader working out which of them the bar is
       answering. */
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${SITE_URL}/index.html`, { waitUntil: 'load' });

    const folds = page.locator('.sds-bar__fold');
    await expect(folds.first()).toBeVisible();
    await expect(page.locator('.sds-bar__fold[open]')).toHaveCount(0);

    await folds.first().hover();
    await expect(folds.first()).toHaveAttribute('open', '');
    await expect(folds.first().locator('.sds-bar__panel .sds-bar__link').first()).toBeVisible();
    /* And it says it is in front by standing off the page — the one shadow in
       the system, and not the wash a dialog draws: a panel a pointer opens on
       its way past must not take the page behind it out of use. */
    const lifted = await folds.first().locator('.sds-bar__panel').evaluate((el) => getComputedStyle(el).boxShadow);
    expect(lifted, 'the panel carries a shadow').not.toBe('none');
    await expect(page.locator('sds-overlay')).toHaveCount(0);

    await folds.nth(1).hover();
    await expect(page.locator('.sds-bar__fold[open]')).toHaveCount(1);
    await expect(folds.nth(1)).toHaveAttribute('open', '');

    /* Escape closes it, and the focus goes to the marker that opened it rather
       than to the top of the bar. */
    await folds.nth(1).locator('summary').focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('.sds-bar__fold[open]')).toHaveCount(0);
    await expect(folds.nth(1).locator('summary')).toBeFocused();

    /* And the marker is a control in its own right: a keyboard opens the same
       panel with no pointer anywhere near it. */
    await page.keyboard.press('Enter');
    await expect(folds.nth(1)).toHaveAttribute('open', '');
  });

  test('the drawer opens on the level the reader is standing on', async ({ page }) => {
    /* A menu that always opened at the top would ask somebody three sections
       deep to walk back down to where they already were — and the way up is
       one press, which the way down is not. The page they are on is the marked
       row, quietly: a menu is opened to leave that page. */
    await page.setViewportSize({ width: 420, height: 900 });
    await page.goto(`${SITE_URL}/guides-theme/quickstart.html`, { waitUntil: 'load' });
    await page.locator('.sds-bar__toggle').click();

    const menu = page.locator('.sds-bar__drawer .sds-bar__level');
    await expect(menu.locator('.sds-bar__back')).toHaveText(/Soul Design System/);
    /* The section's own page is the first row inside it. */
    await expect(menu.locator('.sds-bar__link').first()).toHaveText('Render guide template');
    const here = menu.locator('.sds-bar__link.is-active');
    await expect(here).toHaveText('Quick start');
    await expect(here).toHaveAttribute('aria-current', 'page');
    await expect(here).not.toHaveCSS('background-color', 'rgb(255, 135, 0)');
  });

  test('a menu is read with the arrow keys once it is open', async ({ page }) => {
    /* A panel a reader cannot walk into is a list they have to tab through the
       whole of the bar to reach. Down steps in from the marker and along the
       pages; up comes back; neither wraps, because a list that starts over at
       the bottom hides how long it was from whoever cannot see it. */
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${SITE_URL}/index.html`, { waitUntil: 'load' });

    const panel = page.locator('.sds-bar__fold').first().locator('.sds-bar__panel');
    await page.locator('.sds-bar__fold > summary').first().focus();
    await page.keyboard.press('ArrowDown');

    const rows = panel.locator('.sds-bar__link');
    await expect(rows.first()).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(rows.nth(1)).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(rows.first()).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(rows.first()).toBeFocused();
    await page.keyboard.press('End');
    await expect(rows.last()).toBeFocused();

    /* And the same keys in the drawer, which is the same menu at a width where
       the row has none of it — one level at a time, so what the arrows walk is
       the level on screen. */
    await page.setViewportSize({ width: 420, height: 900 });
    await page.locator('.sds-bar__toggle').click();
    const pages = page.locator('.sds-bar__drawer .sds-bar__link');
    await pages.first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(pages.nth(1)).toBeFocused();
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

  test('the note a mark sends the reader to says which one it is', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    const label = page.locator('#footnote-1 > .footnote-label');
    const resting = await label.evaluate((el) => getComputedStyle(el).color);

    /* A stack of notes is a stack of rows that look alike, and the browser
       scrolls to one of them without saying where it stopped. */
    const section = await page.locator('.sds-prose .section[id]').first().getAttribute('id');
    await page.goto(`${FIXTURE}#${section}`, { waitUntil: 'load' });
    const heading = await page
      .locator(`#${section} > :is(h1, h2, h3, h4, h5, h6)`)
      .evaluate((el) => getComputedStyle(el).color);

    await page.goto(`${FIXTURE}#footnote-1`, { waitUntil: 'load' });
    const arrived = await label.evaluate((el) => getComputedStyle(el).color);
    expect(arrived).not.toBe(resting);
    /* And says it the way every other arrival on this page says it. */
    expect(arrived).toBe(heading);
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

  test('a picture that kept its own colours is given a ground drawn for them', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* A drawing that never named `id="art"` is linked, so it keeps whatever
       the exporter baked in — usually dark line art on nothing, which on this
       system's dark ground is a page contradicting the picture it shows. */
    const exported = page.locator('sds-figure[linked] .sds-figure__frame').first();
    await expect(exported).toHaveClass(/sds-figure__frame--exported/);

    /* And the other half: a drawing referenced into the page reads the page's
       tokens, so its frame follows the mode like every other surface. */
    const referenced = page.locator('sds-figure:not([linked]) .sds-figure__frame').first();
    await expect(referenced).not.toHaveClass(/sds-figure__frame--exported/);

    const ground = (of: Locator): Promise<string> =>
      of.evaluate((el) => getComputedStyle(el).backgroundColor);
    const [wasExported, wasReferenced] = [await ground(exported), await ground(referenced)];

    await page.evaluate(() => {
      document.documentElement.dataset['theme'] = 'dark';
    });
    expect(await ground(exported), 'the one surface that does not follow the reader').toBe(wasExported);
    expect(await ground(referenced), 'and every other one still does').not.toBe(wasReferenced);
  });

  test('a plane states in place, and the fill says what kind of thing is on it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The other node an `sds-panel` can be, and the one this component is for:
       a set read across itself rather than a digression in the flow, which
       stays the `aside.topic` the test above holds. Both are on this page. */
    const planes = page.locator('#planes');
    await expect(planes.locator('sds-surface')).toHaveCount(3);
    await expect(planes.locator('a[href$="nodes.html"]')).toHaveCount(1);

    /* Nothing goes anywhere: a plane states, and a frame that is a link is a
       card. The one anchor above is a reference inside a sentence. */
    await expect(planes.locator('.sds-panel > a, .sds-sunken > a')).toHaveCount(0);

    /* Raised is the fill a plane writing none is, and sunken is the ground
       machine output is drawn on — the same plane, the same parts. */
    await expect(planes.locator('.sds-panel')).toHaveCount(2);
    const sunken = planes.locator('.sds-sunken');
    await expect(sunken).toHaveCount(1);
    await expect(sunken.locator('.sds-surface-title')).toHaveText('The reply, as it arrives');

    /* And each option the directive offers reaches the part the element draws
       for it, so a page wanting one never writes a declaration of its own. */
    await expect(planes.locator('.sds-surface-icon .sds-icon')).toHaveCount(1);
    await expect(planes.locator('.sds-label')).toHaveText('Rule 02');
  });

  test('the language is chosen once, and every configuration block follows', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* What `configuration-block` is for, and what `.. tabs::` is not: the same
       setting stated in several places, chosen once. The set whose labels an
       author wrote agrees with nobody, which is why it carries no `sync`. */
    const agreeing = page.locator('sds-tabs[sync]');
    await expect(agreeing).toHaveCount(2);
    const own = page.locator('sds-tabs:not([sync])');
    const current = (set: Locator) => set.locator('button.sds-tab.is-active');

    await agreeing.first().locator('button.sds-tab', { hasText: 'Php' }).click();
    await expect(current(agreeing.nth(1))).toHaveText('Php');
    await expect(current(own), 'a set nobody syncs is left alone').toHaveText('YAML');

    /* By the word rather than the position: the second block offers a third
       language, and choosing it moves nothing, because the first block has no
       such tab and must not fall back to its own first panel. */
    await agreeing.nth(1).locator('button.sds-tab', { hasText: 'Bash' }).click();
    await expect(current(agreeing.first())).toHaveText('Php');

    /* And it outlives the page — a manual is read across ten of them — as an
       order rather than as one word: picking bash where it was offered did not
       stop the reader preferring PHP to YAML in the block that has neither. */
    await page.reload({ waitUntil: 'load' });
    await expect(current(agreeing.nth(1))).toHaveText('Bash');
    await expect(current(agreeing.first())).toHaveText('Php');
  });

  test('a diff is drawn as one, and its rows are coloured by the server', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The language an author already writes, drawn by the other element: same
       frame, same head, and a body where a fill marks the line. */
    const diff = page.locator('sds-diff');
    await expect(diff).toHaveCount(1);
    await expect(diff.locator('.sds-code__path')).toHaveText('composer.json');
    await expect(diff.locator('.sds-diff__line--del')).toContainText('"^12.4"');
    await expect(diff.locator('.sds-diff__line--add')).toContainText('"^13.4"');

    /* The two file headers are context: the head above them already says which
       file this is, and tinting them says a file was added and removed. */
    const headers = diff.locator('.sds-diff__line', { hasText: 'a/composer.json' });
    await expect(headers.locator('.sds-diff__mark')).toHaveCount(0);

    /* And it is not the code block: a diff that fell through would arrive as
       an `sds-code` carrying the same text. */
    await expect(page.locator('sds-code[code-lang="diff"]')).toHaveCount(0);

    /* One frame, not two. The body is a `<pre>` in the prose, where the
       document layer draws every block its own border and sunken plane — so a
       diff the exclusion forgets arrives as a card inside a card, and the tint
       stops short of the edge it is meant to fill. */
    const body = diff.locator('pre.sds-diff');
    await expect(body).toHaveCSS('border-top-width', '0px');
    await expect(body).toHaveCSS('padding-left', '0px');
  });

  test('a borrowed sentence keeps its markup and names where it came from', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The node the parser leaves nothing behind for: an indented block with an
       attribution comes out a definition list, so a manual quotes through this
       directive or not at all. */
    const quotes = page.locator('#borrowed-sentences sds-quote');
    await expect(quotes).toHaveCount(2);

    /* The sentence is markup out of the document, which is why it is written
       between the tags rather than handed over as a property. */
    await expect(quotes.first().locator('.sds-quote__body em')).toHaveText('Not saying');

    /* The attribution is a byline wherever it stands, and the monogram is
       drawn for the person and withheld from the document: initials of a
       filename are a person invented for a source that has none. */
    await expect(quotes.first().locator('.sds-byline__mark')).toHaveText('BK');
    const sourced = quotes.nth(1);
    await expect(sourced.locator('.sds-byline__mark')).toHaveCount(0);
    await expect(sourced.locator('.sds-byline a')).toHaveAttribute('href', /nodes\.html$/);
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
    const entries = page.locator('#cards');
    await expect(entries.locator('sds-card')).toHaveCount(2);
    await expect(entries.locator('.sds-card:not(sds-card > .sds-card)')).toHaveCount(0);

    const full = entries.locator('.sds-card').first();
    await expect(full.locator('.sds-card__media svg use')).toHaveAttribute('href', /#art$/);
    await expect(full.locator('.sds-row .sds-badge')).toHaveText('Reference');
    await expect(full.locator('.sds-row .sds-label')).toHaveText('12 May 2026');
    await expect(full.locator('.sds-card__title a')).toHaveAttribute('href', /nodes\.html$/);

    /* And the other half of the same rule: what nobody wrote is not drawn. A
       row with nothing in it and a ground under a picture that is not there
       are each a hole in a card that sits in a set of them. */
    const bare = entries.locator('.sds-card').nth(1);
    await expect(bare.locator('.sds-card__media')).toHaveCount(0);
    await expect(bare.locator('.sds-row')).toHaveCount(0);
    await expect(bare.locator('.sds-card__title a')).toHaveCount(0);
  });

  test('a card takes its target out of its own title', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* `.. card:: :doc:`nodes`` is how a TYPO3 manual says where a card goes:
       the words of the reference are the heading and the reference itself is
       the link. Nothing resolves it for a template handing a component a
       property, which is what `LinkExtension` is for — so this is the test
       that the two ends of that arrangement still meet. */
    const signposts = page.locator('#how-much-room-one-of-a-set-needs');
    const referenced = signposts.locator('sds-card').first();
    await expect(referenced.locator('.sds-card__title a')).toHaveText('Reference');
    await expect(referenced.locator('.sds-card__title a')).toHaveAttribute('href', /nodes\.html$/);

    /* And the card that carries every option, so a page wanting one of them
       never has to write a declaration of its own. */
    const full = signposts.locator('sds-card').nth(1);
    await expect(full.locator('.sds-card__media svg use')).toHaveAttribute('href', /#art$/);
    await expect(full.locator('.sds-card__icon .sds-icon')).toHaveCount(1);
    await expect(full.locator('.sds-row .sds-badge')).toHaveText('Reference');
    await expect(full.locator('.sds-row .sds-label')).toHaveText('Chapter 02');
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

  test('a press that goes somewhere is a link, and the row of them is one line', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The element and not a `div` wearing `.sds-btn`: the control is drawn in
       one file, so a press a renderer produced cannot drift from one a product
       wrote. */
    const bar = page.locator('#presses .sds-actions').first();
    await expect(bar.locator('sds-button')).toHaveCount(4);
    await expect(page.locator('#presses .sds-btn:not(sds-button .sds-btn)')).toHaveCount(0);

    /* Given somewhere to go the element draws an anchor, and the target came
       out of the label — `.. button:: :doc:`nodes`` says both at once. That is
       what `LinkExtension` is for, and this is the test that the two ends of
       the arrangement still meet. */
    await expect(bar.locator('a.sds-btn').first()).toHaveAttribute('href', /nodes\.html$/);

    /* And with nowhere to go it is a button, which is a control that does
       nothing on a page — so the one in the fixture says it cannot be pressed
       rather than pretending it can. */
    const dead = bar.locator('button.sds-btn');
    await expect(dead).toHaveCount(1);
    await expect(dead).toBeDisabled();

    /* A glyph as the whole label is a square control, and the words that would
       have been the label name it instead. The shape is written by the theme
       because nothing can read a label back out of markup — see the template. */
    const glyph = bar.locator('.sds-btn--icon');
    await expect(glyph).toHaveAttribute('title', 'Copy');
    await expect(glyph).toHaveText('');

    /* One line, because that is the whole of what the row adds — and centred
       rather than stretched, which is why it is the middles that agree: the
       small control and the square are not the height of the others, and a
       link beside a button is neither. */
    const middles = await bar.locator('.sds-btn').evaluateAll((nodes) =>
      nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return box.top + box.height / 2;
      }),
    );
    expect(Math.max(...middles) - Math.min(...middles), 'a row of controls shares one middle').toBeLessThanOrEqual(1);
  });

  test('a picture is framed whether or not there is a claim under it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* `.. figure::` and `.. image::` are the same picture to a reader; only one
       of them says what it is for. The core writes the second as a bare `<img>`
       standing on the page ground, which is a drawing exported on white sitting
       in a hole in dark — so both are the element, and the only picture outside
       a frame is the copy the viewer holds, which stands in a ground of its. */
    await expect(page.locator('.sds-prose img:not(.sds-figure__frame img):not(.sds-lightbox__art img)')).toHaveCount(0);
    const framed = page.locator('.sds-prose sds-figure .sds-figure__frame');
    await expect(framed).toHaveCount(6);

    /* And what separates them: the caption is the claim, so the one picture
       that makes none is drawn without one rather than under an empty line. */
    await expect(page.locator('.sds-prose .sds-figure__caption')).toHaveCount((await framed.count()) - 1);
  });

  test('a picture opens at full size only where the page asked for it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await page.waitForFunction(() => customElements.get('sds-figure') !== undefined, undefined, { timeout: 15_000 });

    /* A picture is drawn at the width of the column it stands in, which is not
       the width a diagram was made for — and `:zoomable:` is how a page says
       this one is worth opening. It is written rather than assumed: a press on
       every picture offers the same answer to a page of them, and most are
       read where they stand. */
    const opened = page.locator('.sds-prose sds-figure[zoomable]');
    await expect(opened).toHaveCount(1);
    await expect(opened.locator('a.sds-zoom')).toHaveCount(1);
    await expect(page.locator('.sds-prose sds-figure:not([zoomable]) a.sds-zoom')).toHaveCount(0);

    /* The viewer is the platform's own modal, so what closes it is the key
       every reader already knows. */
    const viewer = opened.locator('dialog.sds-lightbox');
    await expect(viewer).toBeHidden();
    await opened.locator('a.sds-zoom').click();
    await expect(viewer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(viewer).toBeHidden();
  });

  test('a drawing that was never prepared is shown, not left blank', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* A reference into a file that names no `id="art"` resolves to nothing and
       leaves a hole where the picture was. The finishing step is what has the
       file in front of it: it marks the element `linked`, and the picture
       arrives as an image — in the colours it was exported with, which is the
       whole of what being unprepared costs. */
    const unprepared = page.locator('.sds-prose sds-figure[linked]');
    await expect(unprepared).toHaveCount(2);
    const shown = unprepared.locator('.sds-figure__frame img.sds-art');
    await expect(shown).toHaveCount(await unprepared.count());
    await expect(shown.first()).toHaveAttribute('src', /unprepared\.svg$/);
    /* The second brought no ground of its own, which is the case the frame
       under it answers — see the ground test above. */
    await expect(shown.nth(1)).toHaveAttribute('src', /transparent\.svg$/);

    /* The prepared drawing beside it is still referenced, so the flag is read
       off the file and not written onto every picture in the page. Read in the
       frame, because the viewer holds a second copy of the same drawing and
       its close is a glyph — three references to one picture on the page. */
    const prepared = page.locator('.sds-prose sds-figure:not([linked])').first();
    await expect(prepared.locator('.sds-figure__frame svg use')).toHaveAttribute('href', /#art$/);
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

  test('a link to one answer opens that answer, and the reader lands on the question', async ({ page }) => {
    const fold = page.locator('details.sds-accordion__item:has(> #who-opens)');
    const question = fold.locator('summary');
    /* Arriving is arriving somewhere nameable: an answer whose question is off
       the top of the screen has opened for somebody who cannot see what it
       answers. */
    const landed = () =>
      expect
        .poll(
          () =>
            question.evaluate((el) => {
              const box = el.getBoundingClientRect();
              return box.top >= 0 && box.bottom <= window.innerHeight;
            }),
          { message: 'the question is in the viewport' },
        )
        .toBe(true);

    /* Cold, with the address in the URL. The platform unfolds an answer a
       fragment points into — which is why the address is on the answer and not
       on the question — and the element makes that arrival again, the upgrade
       having written over the node it happened to. */
    await page.goto(`${FIXTURE}#who-opens`, { waitUntil: 'load' });
    await expect(fold).toHaveAttribute('open', '');
    await landed();

    /* And from a link on the page itself, which is the same arrival with the
       document already standing. */
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await expect(fold).not.toHaveAttribute('open', '');
    await page.locator('.sds-prose a[href="#who-opens"]').first().click();
    await expect(fold).toHaveAttribute('open', '');
    await landed();

    /* The fold stays the reader's: nothing holds it open against a press. */
    await question.click();
    await expect(fold).not.toHaveAttribute('open', '');
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

  test('every tab set arrives with its bar, however its labels were said', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* A set rendered before the browser has no children to read its labels
       off, so they are a property — and a template that says them only on the
       panels ships a bar with nothing in it. Silent: the panels are all there
       and open, and only the row of words is missing. */
    const sets = page.locator('sds-tabs');
    expect(await sets.count()).toBeGreaterThan(1);
    for (let i = 0; i < (await sets.count()); i++) {
      await expect(sets.nth(i).locator('.sds-tabs button.sds-tab').first()).toBeVisible();
    }
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
    const card = page.locator('#cards sds-card').first();
    await expect(card.locator('.sds-card__title a')).toBeVisible();
    await expect(card.locator('.sds-card__media svg')).toBeVisible();
    await expect(card.locator('.sds-row .sds-badge')).toBeVisible();

    /* The frame is the card's own and it is on the page already. What the
       document layer owes is the host around it: until the element upgrades
       the host is the cell, and a card that stopped at its content would draw
       frames of three different heights in one row. */
    const frame = await card.evaluate((el) => {
      const drawn = getComputedStyle(el.querySelector('.sds-card') as HTMLElement);
      return {
        display: getComputedStyle(el).display,
        border: parseFloat(drawn.borderTopWidth),
        radius: drawn.borderTopLeftRadius,
      };
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
    /* The sections, written by the server: the bar is handed the site as data
       and renders it before the page is sent, so a reader with no script has
       the row and the pages of a section behind its marker. */
    await expect(page.locator('.sds-bar__nav .sds-pill').first()).toBeVisible();
    await expect(page.locator('.sds-bar__panel .sds-bar__link').first()).toHaveCount(1);
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
    const pills = page.locator('.sds-bar__nav .sds-pill');
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

/* The one part of this suite that does not know what it is looking for.

   Everything above asserts a finding the theme was written to fix, which means
   it can only catch what somebody already thought of. axe reads the rendered
   page as a machine can — the roles, the names, the order, the contrast — over
   every page of the acceptance render and in both modes, because a document
   layer that is right in one is not thereby right in the other. Serious and
   critical only, for the reason `a11y.spec.ts` gives. */
test.describe('what nobody thought to assert', () => {
  /* The pages the renderer wrote. A card under `_cards/` is a copy of a
     specimen put where a parsed page can point at it — it proves nothing about
     the renderer, which is the same reason `make coverage` will not count one,
     and the page that embeds it names it on the frame. */
  const rendered = pages(ACCEPTANCE_DIR).filter((path) => !path.startsWith('_cards/'));

  for (const theme of ['dark', 'light'] as const) {
    test(`every rendered page survives axe in ${theme}`, async ({ page }) => {
      expect(rendered.length, 'the acceptance render should have pages in it').toBeGreaterThan(1);
      test.setTimeout(Math.max(60_000, rendered.length * 10_000));

      const found: string[] = [];
      for (const path of rendered) {
        await page.goto(`${ACCEPTANCE_URL}/${path}`, { waitUntil: 'load' });
        await page.evaluate((mode) => document.documentElement.setAttribute('data-theme', mode), theme);
        await axeIdle(page);

        const results = await new AxeBuilder({ page }).analyze();
        for (const v of results.violations) {
          if (v.impact !== 'serious' && v.impact !== 'critical') continue;
          found.push(`${path}: ${v.id} — ${v.help} (${v.nodes.length} node(s), first: ${v.nodes[0]?.target.join(' ')})`);
        }
      }
      expect(found).toEqual([]);
    });
  }
});

/* And the part a picture would have shown.

   A rendered page is the page layouts with somebody else's markup in them, and
   the ways it can fail are the ones `lib/layout.ts` measures: too wide, on top
   of itself, or a box holding less than it was given. The last one is why this
   is measured rather than photographed — a block cut to a fifth of its height
   draws a page that reads as merely quiet, and a screenshot says so only to
   whoever opens it. */
test.describe('what a page is measured for', () => {
  const rendered = pages(ACCEPTANCE_DIR).filter((path) => !path.startsWith('_cards/'));
  const WIDTHS = [1440, 1024, 640, 375];

  test('every rendered page holds the width it is read at', async ({ page }) => {
    expect(rendered.length, 'the acceptance render should have pages in it').toBeGreaterThan(1);
    test.setTimeout(Math.max(60_000, rendered.length * WIDTHS.length * 4_000));

    for (const path of rendered) {
      await page.goto(`${ACCEPTANCE_URL}/${path}`, { waitUntil: 'load' });
      for (const width of WIDTHS) {
        await resizeTo(page, width);
        const over = await pageOverflow(page);
        expect(over, `${path} at ${width}px: ${JSON.stringify(over)}`).toBeNull();
        /* At the two ends only: the pairs are counted against each other, and
           a manual page is long. What lands on something else does it where
           the column is widest or where it has just folded. */
        if (width === WIDTHS[0] || width === WIDTHS.at(-1)) {
          expect(await pageOverlaps(page), `${path} at ${width}px`).toEqual([]);
        }
      }
    }
  });

  test('nothing on a rendered page is cut off by the box it is in', async ({ page }) => {
    expect(rendered.length, 'the acceptance render should have pages in it').toBeGreaterThan(1);
    test.setTimeout(Math.max(60_000, rendered.length * WIDTHS.length * 2_000));

    for (const path of rendered) {
      await page.goto(`${ACCEPTANCE_URL}/${path}`, { waitUntil: 'load' });
      for (const width of WIDTHS) {
        await resizeTo(page, width);
        expect(await pageClipped(page), `${path} at ${width}px`).toEqual([]);
      }
    }
  });

  test('local contents headings fit their narrow column', async ({ page }) => {
    /* A manual's headings also appear in its 210px local contents. A wrapped
       entry turns the index into prose; the second clause belongs below it. */
    const tooLong: string[] = [];
    for (const path of pages(SITE_DIR).filter((entry) => !entry.includes('_cards/'))) {
      await page.goto(`${SITE_URL}/${path}`, { waitUntil: 'load' });
      const headings = await page.locator('nav.contents a').evaluateAll((links) =>
        links.map((link) => {
          const range = document.createRange();
          range.selectNodeContents(link);
          const lines = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
          return { lines, text: (link.textContent ?? '').trim() };
        }),
      );
      for (const heading of headings.filter(({ lines }) => lines > 1)) {
        tooLong.push(`${path}: ${heading.text} (${heading.lines} lines)`);
      }
    }
    expect(tooLong).toEqual([]);
  });
});
