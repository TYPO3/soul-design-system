/* The rendered documentation, opened.

   Everything else in the gate reads sources. `make coverage` reads the
   templates and the fixture's own text and answers a bookkeeping question —
   every element has a place in the render, the theme invents no class name.
   Nothing opens what came out. So every claim the theme makes about the
   output has, until here, held exactly as long as somebody remembered looking
   at it, and each one that quietly stopped being true would have stayed that
   way.

   That is the whole reason this file exists, and it decides what belongs in
   it: not "does the page look right", which is a screenshot's job and a
   person's, but the findings the theme was written to fix. Each test below is
   one of them — a thing that was wrong once, was repaired in a template or in
   the document layer, and has nothing else holding it down.

   The fixture is the subject. `guides-theme/acceptance/` carries every node
   kind exactly once with no prose around it, which is what makes it readable
   as a control surface and useless as documentation. It is rendered by the
   server this suite starts, not found lying around: a stale render hides
   precisely the regression this is looking for. */

import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { test, expect, type Page } from '@playwright/test';

import { SITE_URL } from '../playwright.config.ts';

const FIXTURE = `${SITE_URL}/_acceptance/index.html`;
const REFERENCE = `${SITE_URL}/_acceptance/nodes.html`;

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
    const site = pages('site');
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
});

test.describe('what the theme repaired', () => {
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
        caption: px(document.querySelector('figcaption p')),
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

  test('the local contents is a table of contents, not the rail', async ({ page }) => {
    await page.goto(REFERENCE, { waitUntil: 'load' });

    /* The core sends the rail, the printed toctree and `.. contents::`
       through one template, so a theme that overrides that file speaks for
       all three. It did, and the result was a row of rail items each marked
       as the current page and each pointing at `#` — `renderLink` answers `#`
       for the document being rendered, and a section of it is that answer
       plus an anchor. */
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
