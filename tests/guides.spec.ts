/* The rendered documentation, opened.

   Everything else in the gate reads sources; nothing opens what came out. That
   decides what belongs here. Not "does the page look right", which is a
   screenshot's job, but the findings the theme exists to fix. Each one has
   its repair in a template or the document layer, with nothing else to hold
   it down. `packages/guides-theme/acceptance/` is the subject, rendered by the server this
   suite starts, because a stale render hides the regression this looks for. */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

import { ACCEPTANCE_DIR, ACCEPTANCE_URL, SITE_DIR, SITE_URL } from '../playwright.config.ts';
import { clippedOf, overflowOf, overlapsOf } from './lib/layout.ts';
import { axeIdle, resizeTo } from './lib/story.ts';

const FIXTURE = `${ACCEPTANCE_URL}/index.html`;
const REFERENCE = `${ACCEPTANCE_URL}/nodes.html`;

/* A wide viewport, because two of the tests below are about width. The
   measure the prose holds and the width the blocks can take. At a narrow one
   both are the column and the difference disappears. */
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
    expect(site.length, 'the site must have pages in it').toBeGreaterThan(1);
    test.setTimeout(Math.max(30_000, site.length * 2_000));

    const bad: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') bad.push(`console: ${m.text()}`);
    });
    page.on('pageerror', (e) => bad.push(`uncaught: ${e.message}`));
    /* An absent asset is the failure this render is most prone to. Every path
       on the page is relative to the publish root, from a renderer that
       decides the depth per page. A page one directory down is where that
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
    /* Lit renders *after* the children it finds and does not empty the
       container. So an element that gets its own prerendered markup keeps it
       and draws a second copy beside it. Silent everywhere else: the page is
       valid, it just says everything twice. */
    /* The copied specimen cards are not pages of the site: they carry no
       bundle, so nothing in them upgrades and nothing here applies. */
    const site = pages(SITE_DIR).filter((path) => !path.includes('_cards/'));
    test.setTimeout(Math.max(60_000, site.length * 3_000));

    for (const path of site) {
      await page.goto(`${SITE_URL}/${path}`, { waitUntil: 'load' });

      /* Whatever upgrades over the marker the build leaves consumes it. One
         still in the document is an element that never cleared its content,
         which is the same thing as an element that shows it twice. */
      await expect(
        page.locator('template[data-sds-content]'),
        `${path}: an element kept the markup it rendered with`,
      ).toHaveCount(0);

      /* And said a second way, on the elements the failure showed on. Each of
         these renders one node and nothing else, so two is the whole symptom.
         The marker above is the general rule and this is the thing a reader
         of the report recognises. */
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

    /* Neither half is a stack: the claim is a flow of blocks that carry their
       own step, and the picture is one thing. What the split lays out is the
       wrapper on one side and, through the host on the other, the figure. */
    const hero = page.locator('.sds-band').first().locator('.sds-sections > .sds-split');
    const halves = hero.locator(':scope > div, :scope > sds-figure > .sds-figure');
    await expect(halves).toHaveCount(2);
    const widths = await halves.evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().width),
    );
    expect(Math.abs(widths[0]! - widths[1]!)).toBeLessThan(2);
    await expect(hero.locator('h1')).toHaveText('One system, from design to delivery');
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
    /* A half is a column of blocks in the rhythm they carry themselves, not a
       stack stating one distance for all of them. */
    const halves = split.locator(':scope > div');
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
    /* The one path no reader ever clicks. A browser fetches a tab icon quietly.
       A wrong one is a site that looks fine everywhere and is blank in the
       one place a reader keeps it. What breaks is the depth, so the read is
       from a page below the root rather than from the index. */
    const below = pages(SITE_DIR).find((path) => path.includes('/') && !path.startsWith('_'));
    expect(below, 'the site must have a page below its root').toBeTruthy();
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

test.describe('the index the search reads', () => {
  test('every entry is the page speaking, not the furniture around it', async ({ page }) => {
    const index = await (await page.request.get(`${SITE_URL}/_search.json`)).json();
    expect(Array.isArray(index) && index.length, 'the build writes one entry per page').toBeTruthy();

    for (const entry of index as { title: string; url: string; text: string }[]) {
      /* The rendered page keeps its own furniture inside the article: what is
         on this page, the way on to the next. The first paragraph in the file
         once made every entry in this index say "On this page". */
      expect(entry.text.trim(), `${entry.url} has an opening line`).not.toBe('');
      expect(entry.text, `${entry.url} quotes the page, not its contents list`).not.toMatch(
        /^On this page/,
      );
      /* And it is text, because that is how a hit draws it. An entity that
         survived the build reaches a reader as its own spelling. */
      expect(entry.text, `${entry.url} carries text, not escaped markup`).not.toMatch(
        /&(amp|lt|gt|quot|nbsp|#0?39);/,
      );
    }
  });
});

test.describe('what the theme repaired', () => {
  test('the first press lands on the way past the chrome', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* Off the top of the page, and reachable there. A link taken out of the
       flow with `display: none` is invisible to the one reader it is for. One
       that stays visible is a control every other reader has to look at. */
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
       core's output joins the two. So every section of every page is a place
       a reader can land on and cannot send anybody to. */
    const marks = await page.evaluate(() =>
      [...document.querySelectorAll('.sds-prose .sds-section')]
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
       define a word and have no way to say where it did. */
    const entries = await page.evaluate(() =>
      [...document.querySelectorAll('#words-this-reference-defines dt[id]')].map((term) => ({
        id: term.id,
        words: (term.firstChild?.textContent ?? '').trim(),
        href: term.querySelector('a.sds-permalink')?.getAttribute('href') ?? null,
        classifier: term.querySelector('.sds-classifier')?.textContent?.trim() ?? null,
      })));

    expect(entries.length).toBeGreaterThan(2);
    expect(entries.filter((e) => e.href !== `#${e.id}`)).toEqual([]);
    /* The id is the term's own words, not its position in the list. A glossary
       that renumbers at every new word breaks every link into it. */
    expect(entries.map((e) => e.id)).toEqual(entries.map((e) => e.words.replace(/\s+/g, '-').toLowerCase()));

    /* And the kind a term can carry arrives with it, in the register of the
       definition rather than of the term. */
    const kinds = entries.filter((e) => e.classifier !== null);
    expect(kinds.length).toBeGreaterThan(0);
    const [dim, term] = await page.evaluate(() => {
      const colour = (el: Element | null): string => (el ? getComputedStyle(el).color : '');
      return [
        colour(document.querySelector('#words-this-reference-defines .sds-classifier')),
        colour(document.querySelector('#words-this-reference-defines dt[id]')),
      ];
    });
    expect(dim).not.toBe(term);
  });

  test('a line block keeps the breaks the author wrote', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const rows = await page.evaluate(() =>
      [...document.querySelectorAll('.sds-prose .line-block .line')].map((line) => {
        const box = line.getBoundingClientRect();
        return { text: (line.textContent ?? '').trim(), top: box.top, left: box.left, height: box.height };
      }));

    /* The break is the content here, so nothing can close one up. Every line
       is a row of its own, in the author's order. */
    expect(rows.length).toBeGreaterThan(3);
    expect(new Set(rows.map((r) => r.top)).size).toBe(rows.length);
    expect(rows.map((r) => r.top)).toEqual([...rows].map((r) => r.top).sort((a, b) => a - b));

    /* A line nobody wrote in is the gap in a stanza, and a `div` with nothing
       in it has no height at all. */
    const blank = rows.filter((r) => r.text === '');
    expect(blank.length).toBeGreaterThan(0);
    expect(Math.min(...blank.map((r) => r.height))).toBeGreaterThan(0);

    /* And an indented run keeps its step. */
    const edge = Math.min(...rows.map((r) => r.left));
    expect(rows.some((r) => r.left > edge)).toBe(true);
  });

  test('a formula shows as the source it arrived as', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The renderer typesets nothing and hands the source through. MathML
       layout drops text outside a token element, so a formula left in that
       layout is a blank space in the sentence. */
    const inline = page.locator('.sds-prose p math').first();
    await expect(inline).toHaveText(/mc\^2/);
    expect((await inline.boundingBox())?.width).toBeGreaterThan(0);

    const block = page.locator('.sds-prose .sds-section > math').first();
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

  test('a class an author wrote travels and means nothing more', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const box = page.locator('.sds-prose .a-class-from-the-source');
    await expect(box, 'the name reaches the markup as the author wrote it').toHaveCount(1);

    /* What is inside is document content and sets like any other. The box is
       not. A rule that matches a name from somebody's source makes every
       author's private vocabulary public API of this system. */
    const [inside, plain, own] = await page.evaluate(() => {
      const size = (el: Element | null): string => (el ? getComputedStyle(el).fontSize : '');
      const container = document.querySelector('.a-class-from-the-source');
      const style = container ? getComputedStyle(container) : null;
      return [
        size(document.querySelector('.a-class-from-the-source p')),
        size(document.querySelector('.sds-prose .sds-section > p')),
        [style?.borderTopWidth, style?.paddingTop, style?.backgroundImage, style?.backgroundColor],
      ];
    });

    expect(inside).toBe(plain);
    expect(own).toEqual(['0px', '0px', 'none', 'rgba(0, 0, 0, 0)']);
  });

  test('a table is the component drawing markup a document wrote', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The cells are the document's, because a cell carries a link or a
       literal and no property can hold one. Everything the table *is* comes
       from the element. So a page here and a page of a product are the same
       table rather than two that resemble each other. */
    const first = page.locator('sds-table').first();
    await expect(first).toHaveCount(1);
    await expect(first.locator('> .sds-table-scroll > table.sds-table')).toHaveCount(1);
    expect(await first.locator('td code').count()).toBeGreaterThan(0);

    /* And no table on the page draws any other way. */
    const loose = await page.locator('.sds-prose table').evaluateAll((tables) =>
      tables.filter((t) => !t.closest('sds-table') && !t.classList.contains('field-list')).length);
    expect(loose).toBe(0);
  });

  test('the way on from a page is the page the tree reads next', async ({ page }) => {
    /* The renderer computes no prev/next, so this is the theme's, and the
       order it offers has to be the order the rail lists. */
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const foot = page.locator('main.sds-body__main > sds-nav-pager > nav.sds-pager');
    await expect(foot).toHaveCount(1);
    /* The first page of a manual has nothing behind it, and it is in the tree
       all the same. A toctree lists what is under a page and never the page it
       stands on. So the root is the one document the walk has to hear about. */
    await expect(foot.locator('a[rel="prev"]')).toHaveCount(0);
    const next = foot.locator('a[rel="next"]');
    /* The direction is on the glyph, so it joins the page title in the name
       instead of replaces it. A name over the whole control says a sentence
       the reader cannot see in place of the one they can. Read in the order
       the two stand in, the arrow after the label. */
    await expect(next).toHaveAccessibleName(/Next page$/);
    expect((await next.innerText()).trim().length).toBeGreaterThan(0);

    /* A press that goes somewhere is a link and looks like a control. That is
       the one place `a:hover` outweighs `.sds-btn`, and the underline it
       brings is invisible in every screenshot and wrong on every button. */
    await next.hover();
    expect(await next.evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe('none');

    /* And it goes there. */
    const onward = (await next.getAttribute('href')) ?? '';
    await next.click();
    await expect(page).toHaveURL(new RegExp(`${onward}$`));

    /* From the second page on, both ways are on offer and the one back is the
       page just left. */
    const back = page.locator('nav.sds-pager a[rel="prev"]');
    await expect(back).toHaveCount(1);
    await back.click();
    await expect(page).toHaveURL(/index\.html$/);
  });

  test('the end of the site says which site it is the end of', async ({ page }) => {
    /* The bar is long gone by the time a reader is down here. A footer that
       opens with a column of links reads as more navigation. The mark and the
       sentence come out of the same settings the bar uses. So the two ends of
       a site cannot name it two different ways. */
    await page.goto(`${SITE_URL}/index.html`, { waitUntil: 'load' });

    const brand = page.locator('sds-footer .sds-footer__brand');
    await expect(brand).toHaveCount(1);
    /* The same name in the same order. Compared with the whitespace taken out.
       The two lockups come from different templates and a flex gap does the
       spacing in both. A space in the markup is not a fact about either of
       them. */
    const named = (text: string): string => text.replace(/\s+/g, '');
    expect(named(await brand.locator('.sds-lockup .sds-wordmark').innerText()))
      .toBe(named(await page.locator('.sds-bar .sds-lockup .sds-wordmark').innerText()));
    await expect(brand.locator('.sds-lockup img.sds-signet')).toHaveAttribute('src', /signet\.svg$/);
    expect((await brand.locator('.sds-footer__note').innerText()).trim().length).toBeGreaterThan(0);

    /* Beside the columns, not above them: one row that wraps where there is no
       room for two, and no breakpoint deciding when. */
    const [markBox, linksBox] = await Promise.all([
      brand.boundingBox(),
      page.locator('sds-footer .sds-footer__groups').boundingBox(),
    ]);
    expect(markBox?.x).toBeLessThan(linksBox?.x ?? 0);
    expect(markBox?.y).toBeCloseTo(linksBox?.y ?? 0, 0);

    /* And whose it is, under all of it and on its own line. The renderer's own
       `copyright`, which the fixture sets and this site does not, so the
       question goes where it stands. */
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await expect(page.locator('sds-footer .sds-footer__end span').first()).toHaveText(/^©/);
  });

  test('a component in the text speaks the size of the text', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The admonition is the paragraph above it with a frame around it, and it
       used to be the component layer's 12px right beside 16px prose. What is a
       caption stays small on purpose, and that is the other half of the rule.
       It has to still be true, or the repair was a global size change with a
       scope for a disguise. */
    const sizes = await page.evaluate(() => {
      const px = (el: Element | null): number => (el ? parseFloat(getComputedStyle(el).fontSize) : NaN);
      return {
        prose: px(document.querySelector('.sds-prose > .sds-section > p')),
        note: px(document.querySelector('sds-note p')),
        caption: px(document.querySelector('figcaption')),
      };
    });

    expect(sizes.note).toBeCloseTo(sizes.prose, 1);
    expect(sizes.caption).toBeLessThan(sizes.prose);
  });

  /* Two sections stand apart by the heading the second one opens.

     A section is a box, and a box takes the margins at its edges back. So a
     heading's own air stops at the section it opens. With the renderer's own
     wrapper in the way, every section ran into the next at the step between
     two paragraphs. The theme draws the section itself now, and the section
     is what carries the distance. */
  test('two sections stand apart by the heading the second opens', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const steps = await page.evaluate(() => {
      const out: Record<string, number[]> = {};
      for (const section of document.querySelectorAll('.sds-prose .sds-section')) {
        const next = section.nextElementSibling;
        if (!next?.classList.contains('sds-section')) continue;
        const heading = next.firstElementChild;
        if (!heading || !/^H[2-6]$/.test(heading.tagName)) continue;
        const step = Math.round(
          heading.getBoundingClientRect().top - section.getBoundingClientRect().bottom,
        );
        (out[heading.tagName] ??= []).push(step);
      }
      return out;
    });

    expect(Object.keys(steps).length, 'the fixture must hold sections at more than one level')
      .toBeGreaterThan(0);
    for (const [level, seen] of Object.entries(steps)) {
      const want = { H2: 48, H3: 48, H4: 48, H5: 48, H6: 48 }[level];
      expect([...new Set(seen)], `every ${level} section must open at one distance`)
        .toEqual([want]);
    }
  });

  test('the measure holds the words and lets the blocks out', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    const widths = await page.evaluate(() => {
      const w = (sel: string): number => document.querySelector(sel)?.getBoundingClientRect().width ?? NaN;
      return {
        column: w('.sds-body__main'),
        paragraph: w('.sds-prose > .sds-section > p'),
        table: w('.sds-prose table'),
        /* The class and not the element: it is the box a page with no
           script gets, and the element is the same box around it. */
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

  test('an embedded document has a frame, and stays at its measured size', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await page.waitForFunction(() => customElements.get('sds-embed') !== undefined, undefined, { timeout: 15_000 });

    /* The node the renderer emits is a bare `<iframe>`: no ground, no corner,
       and the browser's own inset ridge around it. One left outside the
       element is a frame this system never drew. */
    await expect(page.locator('.sds-prose iframe:not(.sds-embed__frame > iframe)')).toHaveCount(0);

    const frame = page.locator('.sds-embed__frame--fixed');
    await expect(frame).toHaveCount(1);
    /* The card is at the viewport its `@dsCard` header declares and the caption
       says so. The number comes off the caption rather than stands here. A
       literal is a second copy of something the story already states. */
    const caption = await page.locator('.sds-embed__caption').innerText();
    const declared = caption.match(/(\d+)x(\d+)/);
    expect(declared, `the caption names a viewport: ${caption}`).not.toBeNull();
    const box = await frame.locator('iframe').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    });
    expect(box).toEqual({ width: Number(declared![1]), height: Number(declared![2]) });
  });

  test('the local contents is a table of contents, not the rail', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* The core sends the rail, the printed toctree and `.. contents::` through
       one template, so a theme that overrides it speaks for all three.
       `renderLink` answers `#` for the document in the render, which is how
       every rail item became the current page with a link to nothing. */
    const toc = page.locator('nav.sds-toc');
    await expect(toc).toBeVisible();
    await expect(toc.locator('.sds-rail__item')).toHaveCount(0);

    const links = toc.locator('a');
    expect(await links.count()).toBeGreaterThan(1);
    for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))) {
      expect(href, 'a section of this page is an anchor on it').toMatch(/^#.+/);
      await expect(page.locator(href), `${href} points at a section that exists`).toHaveCount(1);
    }
  });

  test('the local contents follows the reader down the page', async ({ page }) => {
    /* The one entry in this theme that no renderer can mark: a section is
       current because the reader has scrolled to it. No mark above the first
       heading, which is where a page opens. The entry a press marks has to be
       the entry the scroll marks. Otherwise the two disagree the moment the
       reader lets go of the list. */
    await page.goto(REFERENCE, { waitUntil: 'load' });

    const toc = page.locator('nav.sds-toc');
    const here = toc.locator('.sds-toc__item.is-active');
    await expect(here).toHaveCount(0);

    const entry = toc.locator('.sds-toc__item').nth(1);
    await entry.click();
    await expect(entry).toHaveClass(/is-active/);
    /* `location` and not `page`. Every entry here is the page the reader is
       on, and the mark is the part of it they are at. */
    await expect(entry).toHaveAttribute('aria-current', 'location');
    await expect(here).toHaveCount(1);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(here).toHaveCount(0);
  });

  test('the local contents rests in view while the page scrolls under it', async ({ page }) => {
    /* Sticky is on the list, but the travel is the parent's to give. An
       element exactly as tall as the list it renders leaves it nowhere to
       rest. The contents then leaves with the page — a map the reader has
       only on the first screen. */
    await page.goto(REFERENCE, { waitUntil: 'load' });

    const toc = page.locator('nav.sds-toc');
    await expect(toc).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
    const held = await toc.boundingBox();
    expect(held!.y).toBeGreaterThanOrEqual(0);
    expect(held!.y).toBeLessThan(300);
  });

  test('the rail is the section the page is in, at any depth', async ({ page }) => {
    /* The search for the section once went two levels down, on the link the
       renderer resolves to `#`. From a page below that nothing matched. The
       rail fell back to the list of sections, and the pages around the reader
       went, on every page of a manual that nests. */
    await page.goto(`${ACCEPTANCE_URL}/depth/group/far.html`, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    await expect(rail.locator('.sds-label')).toHaveText('Depth');
    await expect(rail.locator('.sds-rail__item', { hasText: 'Near' })).toHaveCount(1);

    /* And the group is open, because it holds the page the reader is on.
       Three levels from the root, which is the whole point of the fixture. */
    const here = rail.locator('.sds-rail__item.is-active');
    await expect(here).toHaveText('Far');
    await expect(here).toHaveAttribute('aria-current', 'page');
    await expect(rail.locator('.sds-rail__fold[open]')).toHaveCount(1);
  });

  test('a page inside a fold is a row of the rail, set in by one step', async ({ page }) => {
    /* The pages of a fold lay out in the fold's own box rather than in the
       rail. So the column the rail declares never reached them. Inline items
       in a block box flow as a paragraph, two short page titles to a line.
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
    expect(rows.length, 'the open fold must hold its pages').toBeGreaterThan(0);

    /* Narrower than the rail by the step, and no narrower: a page in a fold is
       a row and not a footnote. */
    for (const row of rows) {
      expect(row.width, `${row.label} is a row of the rail`).toBeGreaterThan(width * 0.7);
      expect(row.width, `${row.label} stands in from it`).toBeLessThan(width);
    }
    expect(new Set(rows.map((row) => row.top)).size, 'every page on a line of its own').toBe(rows.length);
  });

  test('the folds of a rail sit under its pages', async ({ page }) => {
    /* A fold between two pages breaks the column a reader scans, and the tree
       follows the reader's order rather than that. The fixture's section
       writes its group before its last page, so the order here is the rail's
       own and not the toctree's. */
    await page.goto(`${ACCEPTANCE_URL}/depth/group/far.html`, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    const order = await rail.evaluate((el) =>
      [...el.querySelectorAll(':scope > .sds-rail__item, .sds-rail__group')].map((row) =>
        row.matches('.sds-rail__group') ? 'fold' : 'page',
      ),
    );
    expect(order, 'a page after a fold in the tree still draws before it').toEqual([
      ...order.filter((row) => row === 'page'),
      ...order.filter((row) => row === 'fold'),
    ]);
    expect(order.filter((row) => row === 'fold').length, 'the section must hold a fold').toBeGreaterThan(0);
    expect(order.filter((row) => row === 'page').length, 'and pages before it').toBeGreaterThan(1);
  });

  test('the rail has one edge, and one step in from it', async ({ page }) => {
    /* Two edges. Everything the section holds on one edge, and what a fold
       holds one step in from it. The step is what says it belongs to the fold.
       A chevron in front of a group's heading once pushed it to a third. */
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

    expect(edges.rows.length, 'the rail must have a heading, a fold and pages').toBeGreaterThan(3);
    const [first, ...rest] = edges.rows;
    for (const row of rest) {
      expect(row.left, `${row.label} starts where ${first?.label} does`).toBe(first?.left);
    }
    expect(edges.under.length, 'the open fold must hold pages').toBeGreaterThan(0);
    for (const row of edges.under) {
      expect(row.left, `${row.label} stands in from the column`).toBeGreaterThan(first?.left ?? 0);
    }
  });

  test('a section that is one page carries no rail, and no button to open one', async ({ page }) => {
    /* Such a page once got the list of sections instead, every one of them
       open. A sitemap hung off a page that belongs to none of it. The rail
       changed shape the moment the reader followed one of those links. The
       bar already says which section they are in. */
    await page.goto(`${ACCEPTANCE_URL}/nodes.html`, { waitUntil: 'load' });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.sds-rail')).toHaveCount(0);
    await expect(page.locator('#page-rail')).toHaveCount(0);
    /* And no button stands in the bar for one. The bar hears of a rail or it
       does not. A page with the attribute set to nothing offers a drawer whose
       only contents were never on the page. */
    await expect(page.locator('.sds-bar__toggle')).toHaveCount(0);
  });

  test('the page a rail takes its name from is the heading over it', async ({ page }) => {
    /* The heading is the way to the section's own page, as a footer column's
       heading is. The name stands once, and it is a link. */
    await page.goto(`${ACCEPTANCE_URL}/depth/index.html`, { waitUntil: 'load' });

    const rail = page.locator('.sds-rail');
    const head = rail.locator('.sds-rail__heading');
    await expect(head).toHaveText('Depth');
    await expect(head).toHaveAttribute('href', /index\.html$|#/);
    await expect(head).toHaveAttribute('aria-current', 'page');
    /* And the name stands once. */
    await expect(rail.locator('.sds-rail__item', { hasText: /^Depth$/ })).toHaveCount(0);
  });

  test('the page above every section carries no rail, and marks no page', async ({ page }) => {
    /* The root is in no section, so there is no section beside it to list.
       What the bar carries is the whole site, on this page as on every other. */
    await page.goto(FIXTURE, { waitUntil: 'load' });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.sds-rail')).toHaveCount(0);
    /* What it has instead is the bar, and there the root is a front door like
       any other. Marked as the page because it is the page. */
    await expect(page.locator('.sds-bar__nav .sds-pill')).not.toHaveCount(0);
    await expect(page.locator('.sds-bar__nav .sds-pill[aria-current="page"]')).toHaveText('Overview');
  });

  test('the menu the bar opens is the whole site, on a page at any depth', async ({ page }) => {
    /* Every section is one press from every page, the landing page included.
       What the one button opens is the site and not the corner of it the
       reader stands in. */
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

      /* It opens where the reader stands, and the site is one press up from
         there at any depth. */
      const back = menu.locator('.sds-bar__back');
      for (let steps = 0; (await back.count()) && steps < 5; steps += 1) await back.click();

      /* One list, and it is the site's own level: every section, the one the
         bar never names included. `Maintaining` is a section of this site and
         not one of its front doors. */
      await expect(menu).toBeVisible();
      await expect(drawer.locator('.sds-bar__nav')).toHaveCount(0);
      for (const section of ['Design system', 'Maintaining']) {
        await expect(menu.locator('.sds-bar__link', { hasText: section })).toHaveCount(1);
      }
      /* And the pages of a section are behind the way into it rather than
         under it. A phone is a window onto a long list. The whole tree
         unfolded is forty rows to scroll past for the four that are the
         site. */
      await expect(menu.locator('.sds-bar__link', { hasText: 'Quick start' })).toHaveCount(0);
      await menu.locator('.sds-bar__row', { hasText: 'Guides theme' }).locator('.sds-bar__into').click();
      await expect(menu.locator('.sds-bar__link', { hasText: 'Quick start' })).toHaveCount(1);
      await expect(back).toHaveText(/Soul Design System/);
      await back.click();
      await expect(menu.locator('.sds-bar__link', { hasText: 'Maintaining' })).toHaveCount(1);
    }
  });

  test('a section opens its pages under the row, and only one at a time', async ({ page }) => {
    /* The panel is a `<details>` under the section it belongs to. So it works
       before any script, and the bar only has to say which one is open. A
       pointer opens it and so does a press. A menu that only answers a press
       asks a reader already in motion to stop and aim. Two over one page is a
       reader who works out which of them the bar answers. */
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${SITE_URL}/index.html`, { waitUntil: 'load' });

    const folds = page.locator('.sds-bar__fold');
    await expect(folds.first()).toBeVisible();
    await expect(page.locator('.sds-bar__fold[open]')).toHaveCount(0);

    await folds.first().hover();
    await expect(folds.first()).toHaveAttribute('open', '');
    await expect(folds.first().locator('.sds-bar__panel .sds-bar__link').first()).toBeVisible();
    /* And it says it is in front because it stands off the page. The one
       shadow in the system, and not the wash a dialog draws. A panel a
       pointer opens on its way past must not take the page behind it out of
       use. */
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

  test('the drawer opens on the level the reader stands on', async ({ page }) => {
    /* A menu that always opens at the top asks somebody three sections deep
       to walk back down to where they already were. The way up is one press,
       which the way down is not. The page they are on is the marked row,
       quietly: a reader opens a menu to leave that page. */
    await page.setViewportSize({ width: 420, height: 900 });
    await page.goto(`${SITE_URL}/guides-theme/quickstart.html`, { waitUntil: 'load' });
    await page.locator('.sds-bar__toggle').click();

    const menu = page.locator('.sds-bar__drawer .sds-bar__level');
    await expect(menu.locator('.sds-bar__back')).toHaveText(/Soul Design System/);
    /* The section's own page is the first row inside it. */
    await expect(menu.locator('.sds-bar__link').first()).toHaveText('Guides theme');
    const here = menu.locator('.sds-bar__link.is-active');
    await expect(here).toHaveText('Quick start');
    await expect(here).toHaveAttribute('aria-current', 'page');
    await expect(here).not.toHaveCSS('background-color', 'rgb(255, 135, 0)');
  });

  test('the arrow keys walk a menu once it is open', async ({ page }) => {
    /* A panel a reader cannot walk into is a list they have to tab through the
       whole of the bar to reach. Down steps in from the marker and along the
       pages; up comes back. Neither wraps, because a list that starts over at
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
       the row has none of it. One level at a time, so what the arrows walk is
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
       exists after the compile, which is why it comes from the target. */
    const marks = page.locator('sup a[href^="#footnote"], sup a[href^="#citation"]');
    expect(await marks.count()).toBeGreaterThan(1);

    for (const href of await marks.evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))) {
      const inline = (await page.locator(`sup a[href="${href}"]`).innerText()).trim();
      const label = (await page.locator(`${href} > .sds-footnote__label`).innerText()).trim();
      expect(label, `the block for ${href}`).toBe(`[${inline}]`);
    }
  });

  test('the note a mark sends the reader to says which one it is', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    const label = page.locator('#footnote-1 > .sds-footnote__label');
    const resting = await label.evaluate((el) => getComputedStyle(el).color);

    /* A stack of notes is a stack of rows that look alike. The browser
       scrolls to one of them and never says where it stopped. */
    const section = await page.locator('.sds-prose .sds-section[id]').first().getAttribute('id');
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
       which in this vocabulary draws it a glyph that says it is a warning.
       It is a digression with a title — a topic, and drawn as one. */
    await expect(page.locator('aside.sds-topic')).toHaveCount(2);

    /* And the general form of the same thing: `admonition` is the core's name
       for a box this system draws as an element. One left in the output is a
       node whose template was never written. */
    await expect(page.locator('.admonition')).toHaveCount(0);
  });

  test('a picture that kept its own colours gets a ground drawn for them', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* A drawing is a link, so it keeps whatever the exporter baked in. Usually
       dark line art on nothing, which on this system's dark ground is a page
       in contradiction with the picture it shows. Every frame around one
       therefore carries the ground drawn for those colours. */
    const frames = page.locator('.sds-prose sds-figure .sds-figure__frame');
    expect(await frames.count()).toBeGreaterThan(0);
    for (const frame of await frames.all()) {
      await expect(frame).toHaveClass(/sds-figure__frame--exported/);
    }

    const exported = frames.first();
    const ground = (of: Locator): Promise<string> =>
      of.evaluate((el) => getComputedStyle(el).backgroundColor);
    /* Read against a surface that does follow, one that paints a ground of its
       own. So the claim is that this one stands rather than that nothing on
       the page moved. */
    const canvas = page.locator('.sds-bar').first();
    const [wasExported, wasCanvas] = [await ground(exported), await ground(canvas)];

    await page.evaluate(() => {
      document.documentElement.dataset['theme'] = 'dark';
    });
    expect(await ground(exported), 'the one surface that does not follow the reader').toBe(wasExported);
    expect(await ground(canvas), 'and every other one still does').not.toBe(wasCanvas);
  });

  test('a plane states in place, and the fill says what kind of thing is on it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The other node an `sds-panel` can be, and the one this component is for.
       A set read across itself rather than a digression in the flow, which
       stays the `aside.sds-topic` the test above holds. Both are on this page. */
    const planes = page.locator('#planes');
    await expect(planes.locator('sds-surface')).toHaveCount(3);
    await expect(planes.locator('a[href$="nodes.html"]')).toHaveCount(1);

    /* Nothing goes anywhere: a plane states, and a frame that is a link is a
       card. The one anchor above is a reference inside a sentence. */
    await expect(planes.locator('.sds-panel > a, .sds-sunken > a')).toHaveCount(0);

    /* Raised is the fill a plane with none gets, and sunken is the ground
       machine output draws on — the same plane, the same parts. */
    await expect(planes.locator('.sds-panel')).toHaveCount(2);
    const sunken = planes.locator('.sds-sunken');
    await expect(sunken).toHaveCount(1);
    await expect(sunken.locator('.sds-surface-title')).toHaveText('The reply, as it arrives');

    /* And each option the directive offers reaches the part the element draws
       for it. A page that wants one never writes a declaration of its own. */
    await expect(planes.locator('.sds-surface-icon .sds-icon')).toHaveCount(1);
    await expect(planes.locator('.sds-label')).toHaveText('Rule 02');
  });

  test('one choice of language, and every configuration block follows', async ({ page }) => {
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
    await expect(current(own), 'a set nobody syncs stays as it is').toHaveText('YAML');

    /* By the word rather than the position. The second block offers a third
       language, and a choice of it moves nothing. The first block has no such
       tab and must not fall back to its own first panel. */
    await agreeing.nth(1).locator('button.sds-tab', { hasText: 'Bash' }).click();
    await expect(current(agreeing.first())).toHaveText('Php');

    /* And it outlives the page, as a reader reads a manual across ten of them.
       As an order rather than as one word. A choice of bash where it was on
       offer did not stop the reader's preference for PHP over YAML in the
       block that has neither. */
    await page.reload({ waitUntil: 'load' });
    await expect(current(agreeing.nth(1))).toHaveText('Bash');
    await expect(current(agreeing.first())).toHaveText('Php');
  });

  test('a diff draws as one, and the server colours its rows', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The language an author already writes, drawn by the other element: same
       frame, same head, and a body where a fill marks the line. */
    const diff = page.locator('sds-diff');
    await expect(diff).toHaveCount(1);
    await expect(diff.locator('.sds-code__path')).toHaveText('composer.json');
    await expect(diff.locator('.sds-diff__line--del')).toContainText('"^12.4"');
    await expect(diff.locator('.sds-diff__line--add')).toContainText('"^13.4"');

    /* The two file headers are context. The head above them already says which
       file this is, and a tint on them says a file came and went. */
    const headers = diff.locator('.sds-diff__line', { hasText: 'a/composer.json' });
    await expect(headers.locator('.sds-diff__mark')).toHaveCount(0);

    /* And it is not the code block: a diff that fell through arrives as an
       `sds-code` with the same text. */
    await expect(page.locator('sds-code[code-lang="diff"]')).toHaveCount(0);

    /* One frame, not two. The body is a `<pre>` in the prose, where the
       document layer draws every block its own border and sunken plane. So a
       diff the exclusion forgets arrives as a card inside a card, and the tint
       stops short of the edge it has to fill. */
    const body = diff.locator('pre.sds-diff');
    await expect(body).toHaveCSS('border-top-width', '0px');
    await expect(body).toHaveCSS('padding-left', '0px');
  });

  test('a borrowed sentence keeps its markup and names where it came from', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The node the parser leaves nothing behind for. An indented block with an
       attribution comes out a definition list, so a manual quotes through this
       directive or not at all. */
    const quotes = page.locator('#borrowed-sentences sds-quote');
    await expect(quotes).toHaveCount(2);

    /* The sentence is markup out of the document, which is why it stands
       between the tags rather than travels as a property. */
    await expect(quotes.first().locator('.sds-quote__body em')).toHaveText('Not saying');

    /* The attribution is a byline wherever it stands. The monogram draws for
       the person and not for the document: initials of a filename are a
       person invented for a source that has none. */
    await expect(quotes.first().locator('.sds-byline__mark')).toHaveText('BK');
    const sourced = quotes.nth(1);
    await expect(sourced.locator('.sds-byline__mark')).toHaveCount(0);
    await expect(sourced.locator('.sds-byline a')).toHaveAttribute('href', /nodes\.html$/);
  });

  test('a directive that draws a component of ours draws the whole of it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* A directive that answers for the title and the link alone leaves a page
       that wants the picture to write a stylesheet of its own. That is the
       failure the class layer exists to prevent. The card the fixture writes
       carries every option, and this is that card. */
    /* And it is the element that draws it, not a `div` with its classes. The
       front door is the same one everywhere, so the card a renderer produces
       cannot drift from the card a product writes. */
    const entries = page.locator('#cards');
    await expect(entries.locator('sds-card')).toHaveCount(2);
    await expect(entries.locator('.sds-card:not(sds-card > .sds-card)')).toHaveCount(0);

    const full = entries.locator('.sds-card').first();
    await expect(full.locator('.sds-card__media img.sds-art')).toHaveAttribute('src', /\.svg$/);
    await expect(full.locator('.sds-row .sds-badge')).toHaveText('Reference');
    await expect(full.locator('.sds-row .sds-label')).toHaveText('12 May 2026');
    await expect(full.locator('.sds-card__title a')).toHaveAttribute('href', /nodes\.html$/);

    /* And the other half of the same rule: what nobody wrote draws nothing. A
       row with nothing in it is a hole in a card that sits in a set of them.
       So is a ground under a picture that is not there. */
    const bare = entries.locator('.sds-card').nth(1);
    await expect(bare.locator('.sds-card__media')).toHaveCount(0);
    await expect(bare.locator('.sds-row')).toHaveCount(0);
    await expect(bare.locator('.sds-card__title a')).toHaveCount(0);
  });

  test('a card takes its target out of its own title', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* `.. card:: :doc:`nodes`` is how a TYPO3 manual says where a card goes.
       The words of the reference are the heading and the reference itself is
       the link. Nothing resolves it for a template that hands a component a
       property, which is what `LinkExtension` is for. So this is the test
       that the two ends of that arrangement still meet. */
    const signposts = page.locator('#how-much-room-one-of-a-set-needs');
    const referenced = signposts.locator('sds-card').first();
    await expect(referenced.locator('.sds-card__title a')).toHaveText('Reference');
    await expect(referenced.locator('.sds-card__title a')).toHaveAttribute('href', /nodes\.html$/);

    /* And the card that carries every option, so a page wanting one of them
       never has to write a declaration of its own. */
    const full = signposts.locator('sds-card').nth(1);
    await expect(full.locator('.sds-card__media img.sds-art')).toHaveAttribute('src', /\.svg$/);
    await expect(full.locator('.sds-card__icon .sds-icon')).toHaveCount(1);
    await expect(full.locator('.sds-row .sds-badge')).toHaveText('Reference');
    await expect(full.locator('.sds-row .sds-label')).toHaveText('Chapter 02');
    await expect(full.locator('.sds-card__note')).toHaveText('Both halves at once');
    await expect(full.locator('.sds-card__action')).toContainText('Read it');

    /* One link and no more: the title's, stretched over the frame by the class
       layer. A second anchor is a second destination under one card. */
    await expect(full.locator('a')).toHaveCount(1);

    /* Nowhere to go, nothing drawn. No link on the title, and no action under
       prose to send the reader somewhere the card does not name. */
    const last = page.locator('sds-card').last();
    await expect(last.locator('.sds-card__title a')).toHaveCount(0);
    await expect(last.locator('.sds-card__action')).toHaveCount(0);
  });

  test('a press that goes somewhere is a link, and the row of them is one line', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The element and not a `div` with `.sds-btn`. The control draws in one
       file, so a press a renderer produced cannot drift from one a product
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
       nothing on a page. So the one in the fixture says it takes no press
       rather than pretends it does. */
    const dead = bar.locator('button.sds-btn');
    await expect(dead).toHaveCount(1);
    await expect(dead).toBeDisabled();

    /* A glyph as the whole label is a square control, and the words that are
       otherwise the label name it instead. The theme writes the shape because
       nothing can read a label back out of markup — see the template. */
    const glyph = bar.locator('.sds-btn--icon');
    await expect(glyph).toHaveAttribute('title', 'Copy');
    await expect(glyph).toHaveText('');

    /* One line, because that is the whole of what the row adds. Centred
       rather than stretched, which is why it is the middles that agree. The
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

  test('a picture has a frame with a claim under it and without', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* `.. figure::` and `.. image::` are the same picture to a reader; only one
       of them says what it is for. The core writes the second as a bare `<img>`
       on the page ground, which is a drawing exported on white in a hole in
       dark. So both are the element. The only pictures outside a frame are a
       card's, which has a ground of its own, and the viewer's copy, which has
       one too. */
    await expect(page.locator('.sds-prose img:not(.sds-figure__frame img):not(.sds-lightbox__art img):not(.sds-card__media img)')).toHaveCount(0);
    const framed = page.locator('.sds-prose sds-figure .sds-figure__frame');
    await expect(framed).toHaveCount(6);

    /* And what separates them. The caption is the claim, so the one picture
       that makes none draws without one rather than under an empty line. */
    await expect(page.locator('.sds-prose .sds-figure__caption')).toHaveCount((await framed.count()) - 1);
  });

  test('a picture opens at full size only where the page asked for it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await page.waitForFunction(() => customElements.get('sds-figure') !== undefined, undefined, { timeout: 15_000 });

    /* A picture draws at the width of the column it stands in, which is not
       a diagram's own width. `:zoomable:` is how a page says this one deserves
       a viewer. Written rather than assumed. A press on every picture offers
       the same answer to a page of them, and a reader reads most where they
       stand. */
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

  test('every drawing on a page shows, whatever is in the file', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* A picture is a link, and nothing about the file decides that. The
       alternative is a reference to part of the file with `<use>`. That draws
       nothing at all where the part is absent or the browser has not shipped
       SVG 2's fragmentless form. A hole is not a failure a reader can see. So
       every picture in the prose is an image, and none is a reference. */
    const pictures = page.locator('.sds-prose sds-figure .sds-figure__frame img.sds-art');
    expect(await pictures.count()).toBeGreaterThan(0);
    /* Scoped to where a picture stands. A glyph inlines into the page and
       reaches its own sprite with `<use>` — the viewer's close is one, inside
       the figure that owns it. That is a different mechanism on a file this
       build wrote. */
    await expect(page.locator('.sds-figure__frame use, .sds-card__media use, .sds-lightbox__art use')).toHaveCount(0);

    /* The one whose file has no group at all included, which is the case
       this used to lose. */
    await expect(page.locator('.sds-prose img.sds-art[src*="unprepared.svg"]')).toHaveCount(1);

    /* And the shape is the file's own. An image lays out by what is in it,
       so nothing has to carry a coordinate system across for it. */
    const drawn = await pictures.first().boundingBox();
    expect((drawn?.width ?? 0) / (drawn?.height ?? 1)).toBeCloseTo(1200 / 500, 1);
  });

  test('the platform folds a set of questions, not a listener', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The group is what makes a set exclusive, and it has to be on every answer
       in it. The set has one name in the source, and the answers hear it. An
       answer that missed it is an answer that closes nothing, which reads as
       correct right up to the moment two are open. */
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
    /* An arrival is an arrival somewhere with a name. An answer whose question
       is off the top of the screen, or behind the bar, has opened for somebody
       who cannot see what it answers. The line is the scroller's offset. */
    const landed = () =>
      expect
        .poll(
          () =>
            question.evaluate((el) => {
              const box = el.getBoundingClientRect();
              const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
              return box.top >= line - 1 && box.bottom <= window.innerHeight;
            }),
          { message: 'the question stands at or under the line' },
        )
        .toBe(true);

    /* Cold, with the address in the URL. The platform unfolds an answer a
       fragment points into, which is why the address is on the answer and not
       on the question. The element makes that arrival again, as the upgrade
       wrote over the node it happened to. */
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
  /* The rule the whole theme rests on — the server writes, the element
     upgrades. It has no other guard. Every other suite runs a browser with
     scripts on, and a page that only works there looks perfect in all of
     them. */
  test.use({ javaScriptEnabled: false });

  const coloured = async (page: Page): Promise<number> =>
    page.locator('sds-code code .hljs-string, sds-code code .hljs-keyword').count();

  test('the server colours the code, so it has colour without a browser', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });
    expect(await coloured(page)).toBeGreaterThan(1);
  });

  /* The languages the highlighter does not ship, which the theme registers
     itself. Asked for by name, because any coloured block on the page answers
     the check above. A grammar that no longer registers leaves these grey and
     everything else exactly as it was. A file left out of the package, a
     service no longer decorated. */
  test('a language the theme taught the highlighter has colour too', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    for (const lang of ['typoscript', 'tsconfig']) {
      const tokens = page.locator(`sds-code[code-lang="${lang}"] code [class^="hljs-"]`);
      expect(await tokens.count(), `${lang} has no colour from the server`).toBeGreaterThan(1);
    }
  });

  test('every tab set arrives with its bar, whatever route its labels took', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* A set rendered before the browser has no children to read its labels
       off, so they are a property. A template that says them only on the
       panels ships a bar with nothing in it. Silent: the panels are all there
       and open, and only the row of words is absent. */
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
       of a button and a listener is a page of headings with the answers
       hidden under them and nothing that opens one. */
    const answers = page.locator('sds-accordion[name="what-it-holds"] details.sds-accordion__item');
    await expect(answers).toHaveCount(2);
    await expect(answers.nth(0).locator('.sds-accordion__body')).toBeVisible();
    await expect(answers.nth(1).locator('.sds-accordion__body')).toBeHidden();

    await answers.nth(1).locator('summary').click();
    await expect(answers.nth(1).locator('.sds-accordion__body')).toBeVisible();
    await expect(answers.nth(0).locator('.sds-accordion__body')).toBeHidden();
  });

  test('an element inside an element draws once', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* SSR reaches into the content a parent gets. So every element around a
       child that arrived rendered renders it again — empty frames above the
       full one. Counted rather than looked at: an empty frame is exactly what
       nobody notices in a screenshot. */
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

    /* The renderer wrote everything in the card, so all of it reads here. A
       card whose title or picture waits for a script is an empty box in a
       grid of them. */
    const card = page.locator('#cards sds-card').first();
    await expect(card.locator('.sds-card__title a')).toBeVisible();
    await expect(card.locator('.sds-card__media img')).toBeVisible();
    await expect(card.locator('.sds-row .sds-badge')).toBeVisible();

    /* The frame is the card's own and it is on the page already. What it owes
       the row is its height. The wall stretches every cell to the tallest card
       in it. A card that stops at its own prose draws frames of three
       different heights in one row. Here, no script will come and correct
       it. */
    const frame = await card.evaluate((el) => {
      const drawn = getComputedStyle(el.querySelector('.sds-card') as HTMLElement);
      return { border: parseFloat(drawn.borderTopWidth), radius: drawn.borderTopLeftRadius };
    });
    expect(frame.border).toBeGreaterThan(0);
    expect(parseFloat(frame.radius)).toBeGreaterThan(0);

    const filled = await page.locator('#cards .sds-grid > sds-card').evaluateAll((hosts) =>
      hosts.map((host) => {
        const box = (el: Element): number => Math.round(el.getBoundingClientRect().height);
        return { cell: box(host), drawn: box(host.querySelector('.sds-card') as HTMLElement) };
      }));
    expect(filled.length).toBeGreaterThan(1);
    for (const one of filled) expect(one.drawn).toBe(one.cell);
  });

  test('the evidence on the page is on it, framed, before anything upgrades', async ({ page }) => {
    /* Narrower than the card it embeds, which is where the difference shows.
       An iframe is as wide as its `width` attribute says and takes the column
       with it. */
    await page.setViewportSize({ width: 520, height: 900 });
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* The frame is the element's own, drawn before the page went public —
       see `scripts/lib/prerender.ts`. That is the whole difference the
       prerender makes, and the check is here because this is the one suite
       that runs with scripts off. */
    const frame = page.locator('.sds-embed__frame--fixed');
    await expect(frame).toBeVisible();
    await expect(frame.locator('iframe')).toBeVisible();

    /* The frame the element draws, and the ground and corner that come with
       it. Not a border the document layer had to put on a bare `<iframe>`
       because there was nothing else on the page to carry one. And held to
       the column rather than out of it at the width its own attribute
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
    /* The sections, from the server. The bar gets the site as data and
       renders it before the page goes out. So a reader with no script has
       the row and the pages of a section behind its marker. */
    await expect(page.locator('.sds-bar__nav .sds-pill').first()).toBeVisible();
    await expect(page.locator('.sds-bar__panel .sds-bar__link').first()).toHaveCount(1);
    /* Not "a stylesheet loaded" — that the one rule the document layer exists
       for arrived. Prose is not the browser's 16px Times across the width of
       the window. */
    const measured = await page.evaluate(() => {
      const p = document.querySelector('.sds-prose > .sds-section > p')!;
      return { family: getComputedStyle(p).fontFamily, width: p.getBoundingClientRect().width };
    });
    expect(measured.family).not.toMatch(/^Times/);
    expect(measured.width).toBeLessThan(900);
  });

  test('the mark starts where the page does, with no toggle standing in front of it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });

    /* Wide enough that the rail is a column, so its toggle draws nothing. An
       undrawn button whose host is still a box is an empty flex item, and an
       empty flex item takes the bar's gap. That put the mark a gap inside the
       inset every other row on the page starts at. The script and the host
       rule then moved it back. */
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
       only where an element can lift them, they were a `<template>` nobody
       can see and a bar with no navigation in it. */
    const pills = page.locator('.sds-bar__nav .sds-pill');
    expect(await pills.count()).toBeGreaterThan(1);
    await expect(pills.first()).toBeVisible();

    /* And the width they need: the row folds into the drawer rather than the
       page runs out sideways under it. Polled, because the fold is what the
       element measures for. A synchronous read after a resize can land in the
       frame before it has. The bar wraps there and the claim is about where
       it comes to rest. */
    await page.setViewportSize({ width: 380, height: 900 });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
      .toBeLessThanOrEqual(0);
  });
});

test.describe('the colour the server already wrote', () => {
  test('survives the element upgrading around it', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    await page.waitForFunction(() => customElements.get('sds-code') !== undefined, undefined, { timeout: 15_000 });

    /* `sds-code` colours what it gets, unless what it gets already has
       colour. A second pass costs the languages the browser bundle does not
       register, the start line and the emphasised lines. And it reads as a
       component that works, because the text is still there. */
    await expect(page.locator('sds-code code .hljs-string').first()).toBeVisible();
    await expect(page.locator('sds-code .sds-code__copy').first()).toBeVisible();

    const kept = await page.locator('sds-code code[data-start]').first();
    await expect(kept).toHaveAttribute('data-start', /\d+/);
  });
});

/* The one part of this suite that does not know what it looks for.

   Everything above asserts a finding the theme exists to fix. So it can only
   catch what somebody already thought of. Axe reads the rendered page as a
   machine can — the roles, the names, the order, the contrast. Over every
   page of the acceptance render and in both modes. A document layer that is
   right in one is not thereby right in the other. Serious and critical only,
   for the reason `a11y.spec.ts` gives. */
test.describe('what nobody thought to assert', () => {
  /* The pages the renderer wrote. A card under `_cards/` is a copy of a
     specimen, there so a parsed page can point at it. It proves nothing about
     the renderer, which is the same reason `make coverage` will not count one.
     The page that embeds it names it on the frame. */
  const rendered = pages(ACCEPTANCE_DIR).filter((path) => !path.startsWith('_cards/'));

  for (const theme of ['dark', 'light'] as const) {
    test(`every rendered page survives axe in ${theme}`, async ({ page }) => {
      expect(rendered.length, 'the acceptance render must have pages in it').toBeGreaterThan(1);
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

/* And the part a picture shows.

   A rendered page is the page layouts with somebody else's markup in them. The
   ways it can fail are the ones `lib/layout.ts` measures: too wide, on top of
   itself, or a box that holds less than it got. The last one is why this is a
   measurement rather than a photograph. A block cut to a fifth of its height
   draws a page that reads as merely quiet. A screenshot says so only to
   whoever opens it. */
test.describe('what a page measures for', () => {
  const rendered = pages(ACCEPTANCE_DIR).filter((path) => !path.startsWith('_cards/'));
  const WIDTHS = [1440, 1024, 640, 375];

  test('every rendered page holds its reading width', async ({ page }) => {
    expect(rendered.length, 'the acceptance render must have pages in it').toBeGreaterThan(1);
    test.setTimeout(Math.max(60_000, rendered.length * WIDTHS.length * 4_000));

    for (const path of rendered) {
      await page.goto(`${ACCEPTANCE_URL}/${path}`, { waitUntil: 'load' });
      for (const width of WIDTHS) {
        await resizeTo(page, width);
        const over = await overflowOf(page);
        expect(over, `${path} at ${width}px: ${JSON.stringify(over)}`).toBeNull();
        /* At the two ends only: the pairs count against each other, and a
           manual page is long. What lands on something else does it where
           the column is widest or where it has just folded. */
        if (width === WIDTHS[0] || width === WIDTHS.at(-1)) {
          expect(await overlapsOf(page), `${path} at ${width}px`).toEqual([]);
        }
      }
    }
  });

  test('no box on a rendered page cuts off what is in it', async ({ page }) => {
    expect(rendered.length, 'the acceptance render must have pages in it').toBeGreaterThan(1);
    test.setTimeout(Math.max(60_000, rendered.length * WIDTHS.length * 2_000));

    for (const path of rendered) {
      await page.goto(`${ACCEPTANCE_URL}/${path}`, { waitUntil: 'load' });
      for (const width of WIDTHS) {
        await resizeTo(page, width);
        expect(await clippedOf(page), `${path} at ${width}px`).toEqual([]);
      }
    }
  });

  test('local contents headings fit their narrow column', async ({ page }) => {
    /* A manual's headings also appear in its 210px local contents. A wrapped
       entry turns the index into prose; the second clause belongs below it. */
    const tooLong: string[] = [];
    for (const path of pages(SITE_DIR).filter((entry) => !entry.includes('_cards/'))) {
      await page.goto(`${SITE_URL}/${path}`, { waitUntil: 'load' });
      const headings = await page.locator('nav.sds-toc a').evaluateAll((links) =>
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

/* The twin — the same document written a second time as Markdown, which the
   theme registers as an output format of its own.

   What can go wrong is never the shape of one file: it is the pair. A page
   whose alternate points at nothing, a twin that lost its document, a link
   inside one that leads back into the HTML. Each of those is a reader that is
   a program, and it follows a link into nothing. */
test.describe('the markdown twin', () => {
  const rendered = pages(SITE_DIR).filter((path) => !path.startsWith('_cards/'));
  const twin = (path: string): string => path.replace(/\.html$/, '.md');
  const read = (dir: string, path: string): string => readFileSync(join(dir, path), 'utf8');

  /* The two halves of a twin. The front matter it opens with, read as its
     `key: value` lines (a quoted value is a JSON string), and the document
     under it. */
  const halves = (markdown: string): { fields: Record<string, string>; body: string } => {
    const match = /^---\n([\s\S]*?)\n---\n/.exec(markdown);
    if (!match) return { fields: {}, body: markdown };
    const fields: Record<string, string> = {};
    for (const line of (match[1] as string).split('\n')) {
      const [, key, value] = /^([^:]+): (.*)$/.exec(line) ?? [];
      if (key !== undefined) fields[key] = value?.startsWith('"') ? (JSON.parse(value) as string) : (value as string);
    }
    return { fields, body: markdown.slice(match[0].length) };
  };

  test('every page names its twin, and the twin holds the same document', () => {
    expect(rendered.length, 'the site must have pages in it').toBeGreaterThan(1);

    const wrong: string[] = [];
    for (const path of rendered) {
      const html = read(SITE_DIR, path);
      const alternate = /<link rel="alternate" type="text\/markdown" href="([^"]+)"/.exec(html)?.[1];
      const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
      const name = path.split('/').at(-1) as string;
      if (alternate !== twin(name)) wrong.push(`${path}: alternate is ${alternate}`);
      if (canonical !== name) wrong.push(`${path}: canonical is ${canonical}`);

      let markdown = '';
      try {
        markdown = read(SITE_DIR, twin(path));
      } catch {
        wrong.push(`${path}: no twin at ${twin(path)}`);
        continue;
      }

      /* The page's own title, as the twin's first heading. A twin that came
         out empty, or that starts somewhere other than the document, is a
         file nothing notices is wrong. */
      const heading = /^#\s+(.+)$/m.exec(markdown)?.[1]?.trim();
      const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1]
        ?.replace(/<a class="sds-permalink"[\s\S]*?<\/a>/, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&#0?39;/g, "'")
        .replace(/&amp;/g, '&')
        .trim();
      if (!heading) wrong.push(`${twin(path)}: no heading`);
      else if (h1 && heading.replace(/\\/g, '') !== h1) wrong.push(`${twin(path)}: "${heading}" is not "${h1}"`);
    }
    expect(wrong).toEqual([]);
  });

  /* Every Markdown template turns Twig's HTML escaping off, because a twin is
     not a page and nothing in it needs an escape for a browser. One that
     forgets says `&amp;` where the document said `&`, a file that still reads
     almost right. So the check is on the run rather than the templates. */
  test('nothing in a twin carries an escape for a browser', () => {
    const escaped: string[] = [];
    for (const path of rendered.map(twin)) {
      /* Code is not prose. A block that shows HTML carries `&amp;` because
         the page it shows has to, and a twin that reproduces it is right. */
      const prose = read(SITE_DIR, path).replace(/^```[\s\S]*?^```/gm, '').replace(/`[^`\n]*`/g, '');
      const found = [...prose.matchAll(/&(amp|lt|gt|quot|#0?39|nbsp);/g)];
      if (found.length) escaped.push(`${path}: ${found.map(([whole]) => whole).join(' ')}`);
    }
    expect(escaped).toEqual([]);
  });

  /* The container separates every block in a twin, not the template that
     wrote it. One that forgets leaves a heading, a fence or a rule on the
     line under a sentence. That is a heading a parser reads as text, a fence
     that never opens, and a rule that turns the line above it into a heading
     it never was. */
  test('a block in a twin stands apart from the one before it', () => {
    const glued: string[] = [];
    for (const path of rendered.map(twin)) {
      const lines = halves(read(SITE_DIR, path)).body.split('\n');
      /* The rail of the open block, because a block closes on one at least
         as long as the one that opened it. A prompt handed over whole carries
         fences of its own, and the block around it is longer. */
      let rail = 0;
      lines.forEach((line, at) => {
        const fence = /^(`{3,})/.exec(line)?.[1]?.length ?? 0;
        if (rail) {
          if (fence >= rail) rail = 0;
          return;
        }
        if (at > 0 && lines[at - 1]?.trim() !== '' && /^(#{1,6} |`{3,}|---$)/.test(line)) {
          glued.push(`${path}:${at + 1}: ${line.slice(0, 40)}`);
        }
        if (fence) rail = fence;
      });
    }
    expect(glued).toEqual([]);
  });

  /* The one failure this format has that reads as no failure at all: a node
     renders through the mapping of a class it inherits from — every kind of
     link and both marks are compound inline nodes — and the twin comes out
     with every word in it and none of its marks. */
  test('a twin keeps the marks the document was written with', () => {
    const written = readFileSync(join(ACCEPTANCE_DIR, 'index.md'), 'utf8');
    const marks = [
      '*emphasis*',
      '**strong emphasis**',
      '`an inline literal`',
      '[link to the renderer](https://docs.phpdoc.org/components/guides/guides/)',
    ];
    expect(marks.filter((mark) => !written.includes(mark))).toEqual([]);
  });

  /* What the page carries in its head, the twin carries as front matter — and
     it is the first byte of the file, because that is the only place front
     matter is read as such. A twin that dropped it is still a document; one
     that names the wrong page is a reader sent to a page that is not the one
     it was reading. */
  test('a twin opens with what the page says about itself', () => {
    const wrong: string[] = [];
    const llms = read(SITE_DIR, 'llms.txt');
    for (const path of rendered) {
      const html = read(SITE_DIR, path);
      const markdown = read(SITE_DIR, twin(path));
      const { fields } = halves(markdown);
      if (!markdown.startsWith('---\n')) wrong.push(`${twin(path)}: no front matter`);

      const name = path.split('/').at(-1) as string;
      const title = /<title>([^<]*?)(?: — [^<]*)?<\/title>/.exec(html)?.[1]?.replace(/&#0?39;/g, "'").replace(/&amp;/g, '&');
      if (fields.title !== title) wrong.push(`${twin(path)}: title is "${fields.title}", the page's is "${title}"`);
      if (fields.canonical !== name) wrong.push(`${twin(path)}: canonical is ${fields.canonical}`);

      /* The line under the page in llms.txt is the same sentence, read by
         the same code. A reader who follows one to the other finds one page
         with one description. */
      const listed = new RegExp(`\\]\\(${twin(path).replace(/[.]/g, '\\.')}\\): (.*)$`, 'm').exec(llms)?.[1]?.replace(/\\(.)/g, '$1');
      if (listed !== undefined && listed !== fields.description) {
        wrong.push(`${twin(path)}: description is "${fields.description}", llms.txt says "${listed}"`);
      }
    }
    expect(wrong).toEqual([]);
  });

  /* Every field the author wrote above the title reaches the front matter
     under its own name. One the page carries only for the renderer lands
     nowhere. Where it stands in the menu is a fact about the page; if a
     search can index it is not. */
  test('the fields an author wrote above the title reach its front matter', () => {
    const { fields } = halves(readFileSync(join(ACCEPTANCE_DIR, 'nodes.md'), 'utf8'));
    expect(fields).toEqual({
      title: 'Reference',
      description: 'The nodes that appear only in software documentation, each one rendered as a page and as a twin.',
      canonical: 'nodes.html',
      'navigation-title': 'Reference',
      author: "The theme's own suite",
      date: '2026-09-14',
      keywords: 'reference, confval, option, tabs',
    });
  });

  /* The way in for a reader that arrived with no navigation: the site's own
     table of contents at the publish root, naming the twins. */
  test('the publish root carries a table of contents of the twins', () => {
    const llms = read(SITE_DIR, 'llms.txt');
    expect(llms.startsWith('# '), 'llms.txt opens with the project name').toBe(true);
    expect(llms, 'llms.txt says what the project is').toMatch(/^> \S/m);

    const wrong: string[] = [];
    const links = [...llms.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map(([, href]) => href as string);
    expect(links.length, 'llms.txt lists the pages').toBeGreaterThan(1);
    for (const href of links) {
      if (!href.endsWith('.md')) wrong.push(`llms.txt → ${href} (not a twin)`);
      else if (!existsSync(resolve(SITE_DIR, href))) wrong.push(`llms.txt → ${href}`);
    }
    expect(wrong).toEqual([]);
  });

  /* A fragment is where a reference lands, and a twin has to be a place. The
     document's own anchors stand in it, the labels it declared and the
     heading of every section. Nobody has to derive them from the words.
     Every reader derives them differently: one apostrophe in a
     heading and the link is nowhere. */
  test('every fragment a twin points at is a place in the twin it points to', () => {
    const wrong: string[] = [];
    const anchors = (text: string): string[] => [...text.matchAll(/<a id="([^"]+)"><\/a>/g)].map(([, id]) => id as string);

    for (const path of rendered.map(twin)) {
      const markdown = read(SITE_DIR, path);
      for (const [, href] of markdown.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
        const [target, fragment] = (href as string).split('#');
        if (fragment === undefined || /^(https?:|mailto:)/.test(href as string)) continue;
        const at = target ? resolve(SITE_DIR, dirname(path), target) : join(SITE_DIR, path);
        if (!existsSync(at)) continue;
        if (!anchors(readFileSync(at, 'utf8')).includes(fragment)) wrong.push(`${path} → ${href}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  test('a link inside a twin leads to another twin', () => {
    const wrong: string[] = [];
    for (const path of rendered.map(twin)) {
      const markdown = read(SITE_DIR, path);
      /* Links, and not the pictures written the same way with a `!` in
         front: a picture is an asset of the site and stays one. */
      for (const [, mark, href] of markdown.matchAll(/(!?)\[[^\]]*\]\(([^)\s]+)\)/g)) {
        if (mark === '!' || /^(https?:|mailto:|#)/.test(href ?? '')) continue;
        const target = (href as string).split('#')[0] as string;
        if (!target) continue;
        /* A rendered specimen card is the one thing a twin points at that
           is not a document. It is a picture of one, and it has no twin
           because there is nothing in it to write down. */
        if (!target.endsWith('.md') && !target.includes('_cards/')) {
          wrong.push(`${path} → ${href} (leaves the twin)`);
          continue;
        }
        if (!existsSync(resolve(SITE_DIR, dirname(path), target))) wrong.push(`${path} → ${href}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});
