/* The page layouts, at every width they are meant to survive.

   A page is the only place the layout classes meet each other, and both ways a
   layout fails are invisible to everything else: the page grows wider than the
   screen, or two things end up in the same place. The card diff sees neither —
   a card is a fragment at a fixed width — and the fit check asks about height
   at the one size a screen declares.

   So the pages are measured, at the widths a laptop, a tablet and a phone
   actually are, and the guarantee is flat: a page never overflows. */

import { test, expect } from '@playwright/test';
import { gotoStory } from './lib/story.ts';

const WIDTHS = [1440, 1280, 1024, 900, 860, 768, 640, 480, 375, 320];

interface StoryEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
}

async function pageStories(request: import('@playwright/test').APIRequestContext): Promise<StoryEntry[]> {
  const index = (await (await request.get('/index.json')).json()) as { entries: Record<string, StoryEntry> };
  return Object.values(index.entries).filter((e) => e.type === 'story' && e.title.startsWith('Pages/'));
}

test('every page fits the screen at every width', async ({ page, request }) => {
  const pages = await pageStories(request);
  expect(pages.length, 'there should be page layouts to measure').toBeGreaterThan(1);

  /* One test opens every page at every width, so its budget is what that
     costs — not a number somebody raises by hand each time a page arrives with
     three states. The default 30s was that number, and it ran out. */
  test.setTimeout(Math.max(30_000, pages.length * WIDTHS.length * 700));

  for (const story of pages) {
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await gotoStory(page, story.id);

      const over = await page.evaluate(() => {
        const d = document.documentElement;
        if (d.scrollWidth <= d.clientWidth + 1) return null;
        /* Which box is doing it, because "the page is 17px too wide" is not
           something you can act on. */
        const widest = [...document.body.querySelectorAll('*')]
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0 && r.right > d.clientWidth + 1)
          .sort((a, b) => b.r.right - a.r.right)[0];
        const e = widest?.el as HTMLElement | undefined;
        return {
          scroll: d.scrollWidth,
          client: d.clientWidth,
          worst: e ? `${e.tagName.toLowerCase()}.${String(e.className).trim().split(/\s+/).join('.')}` : 'unknown',
        };
      });

      expect(over, `${story.title} at ${width}px: ${JSON.stringify(over)}`).toBeNull();
    }
  }
});

/* Nothing on a page may be painted over anything else. Only boxes holding their
   own line are compared: an inline `<span>` in a wrapping paragraph has a rect
   as wide as the paragraph and overlaps every line above it, which is how text
   works. Anything out of flow is left out — an overlay is over the page on
   purpose. */
test('nothing on a page covers anything else', async ({ page, request }) => {
  const pages = await pageStories(request);
  const WIDTHS_HERE = [1440, 1024, 860, 640, 375];

  /* Sized like the sweep above, and for the same reason: this opens every page
     at five widths and compares every pair of boxes on it, so what it costs is
     a function of how many pages exist. */
  test.setTimeout(Math.max(30_000, pages.length * WIDTHS_HERE.length * 700));

  for (const story of pages) {
    for (const width of WIDTHS_HERE) {
      await page.setViewportSize({ width, height: 900 });
      await gotoStory(page, story.id);

      const hits = await page.evaluate(() => {
        const inFlow = (el: Element): boolean => {
          for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
            const position = getComputedStyle(node).position;
            if (position === 'absolute' || position === 'fixed') return false;
          }
          return true;
        };

        const blocks = [...document.body.querySelectorAll<HTMLElement>('*')].filter((el) => {
          if (!el.textContent?.trim()) return false;
          if (!el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true })) return false;
          if (!/^(block|flex|grid|list-item|table)/.test(getComputedStyle(el).display)) return false;
          if (!inFlow(el)) return false;
          /* Leaves only: a section and the heading inside it share their box
             by definition, and `contains` already covers that pair — this
             keeps the comparison to what actually paints. */
          return ![...el.children].some((child) => child.textContent?.trim());
        });

        const named = (el: Element): string =>
          `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/).join('.')}` +
          `"${(el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 30)}"`;

        const out: string[] = [];
        for (let i = 0; i < blocks.length; i++) {
          for (let j = i + 1; j < blocks.length; j++) {
            const a = blocks[i] as HTMLElement;
            const b = blocks[j] as HTMLElement;
            if (a.contains(b) || b.contains(a)) continue;
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            const x = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
            const y = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
            if (x > 2 && y > 2) out.push(`${named(a)} over ${named(b)}`);
          }
        }
        return out.slice(0, 4);
      });

      expect(hits, `${story.title} at ${width}px`).toEqual([]);
    }
  }
});

/* The other navigation, behind the same button. Two things run out of room and
   there is one answer for both, so what is asserted is that the second is wired
   at all: the rail is a column while there is one, and reachable rather than
   gone once there is not. It must also survive having no script — the class
   that lets the layout hide it is written by the element that opens it. */
test('the page rail is a column, then a panel behind the same toggle', async ({ page }) => {
  const rail = page.locator('#page-rail');
  const toggle = page.locator('.sds-menu--for .sds-menu__toggle');

  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoStory(page, 'pages-documentation--page');
  await expect(rail).toBeVisible();
  await expect(toggle).toBeHidden();

  await page.setViewportSize({ width: 760, height: 900 });
  await expect(toggle).toBeVisible();
  await expect(rail).toBeHidden();

  await toggle.click();
  await expect(rail).toBeVisible();
  /* Over the page rather than pushing it: the same drop the sections get. */
  await expect(rail).toHaveCSS('position', 'absolute');

  await page.keyboard.press('Escape');
  await expect(rail).toBeHidden();
  await expect(toggle).toBeFocused();
});

/* The menu's run-width. What it does is decided by measurement, so there is no
   number to assert — only the shape of the decision: wide enough and the items
   are a row with no toggle; narrow enough and they are behind one, reachable,
   which is what a breakpoint that merely hid them never had. */
test('the header navigation collapses rather than disappearing', async ({ page }) => {
  const items = page.locator('.sds-menu__items');
  const toggle = page.locator('.sds-menu__toggle');

  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoStory(page, 'pages-landing--page');
  await expect(items).toBeVisible();
  await expect(toggle).toBeHidden();

  await page.setViewportSize({ width: 420, height: 900 });
  await expect(toggle).toBeVisible();
  await expect(items).toBeHidden();

  await toggle.click();
  await expect(items).toBeVisible();
  await expect(items.locator('.sds-pill')).toHaveCount(4);

  /* Escape closes it, and the toggle takes the focus back — a panel dismissed
     with the keyboard that leaves the focus inside it has dropped the reader
     somewhere they cannot see. */
  await page.keyboard.press('Escape');
  await expect(items).toBeHidden();
  await expect(toggle).toBeFocused();
});

/* A filter that matches nothing — the state a list page skips, because the
   fixture it was built with always had rows. What has to hold is that the list
   is replaced by an answer naming how much was read, and that the offer inside
   it puts the list back rather than merely looking as if it could. */
test('a filter that matches nothing answers, and the answer undoes it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoStory(page, 'pages-news--page');

  /* Counted off the page rather than written here: how many entries the list
     holds is the page's business, and a literal would fail the day one is added
     — a test failing at the one thing it is not about. Two numbers, because the
     page shows one page of the list, and the answer names the second. */
  const entries = page.locator('sds-teaser');
  const all = await entries.count();
  expect(all, 'the list should hold entries to filter').toBeGreaterThan(2);
  const read = Number(await page.locator('sds-pagination').getAttribute('count'));
  expect(read, 'the row should say how many there are in all').toBeGreaterThanOrEqual(all);

  await page.locator('.sds-pills .sds-pill', { hasText: 'releases' }).click();
  const some = await entries.count();
  expect(some).toBeGreaterThan(0);
  expect(some, 'a filter should narrow the list').toBeLessThan(all);

  await page.locator('.sds-pills .sds-pill', { hasText: 'security' }).click();
  await expect(entries).toHaveCount(0);
  const empty = page.locator('.sds-empty');
  await expect(empty).toBeVisible();
  /* Not "no results": how much was read is the part that makes it an answer
     rather than a shrug. */
  await expect(empty).toContainText(new RegExp(`All ${read} entries were read`));

  await empty.locator('button.sds-link').click();
  await expect(entries).toHaveCount(all);
});

/* What a form does when it fails: a submit that finds something has to say
   what, where the reader was sent, rather than only marking boxes nobody sees
   who cannot take in the whole form. Three things hold together and none shows
   in a screenshot — the summary appears, takes the focus, and each line in it
   reaches the field it names. */
test('a form that fails says what, and sends the reader to it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoStory(page, 'pages-contact--page');

  const summary = page.locator('.sds-form-errors');
  await expect(summary).toHaveCount(0);

  /* Empty the two answers the form cannot do without. */
  await page.locator('#email').fill('');
  await page.locator('#message').fill('');
  await page.getByRole('button', { name: 'Send the report' }).click();

  await expect(summary).toBeVisible();
  await expect(summary).toBeFocused();
  const entries = summary.locator('a.sds-link');
  await expect(entries).toHaveCount(2);

  /* The field carries the same sentence as the line about it, so what is
     wrong is legible from either end of the form. */
  await expect(page.locator('sds-field[field-id="message"] .sds-field-error')).toContainText('The message is empty');
  await expect(page.locator('#message')).toHaveAttribute('aria-invalid', 'true');

  /* Filling both in makes it a form that worked, and the page says what it
     sent rather than thanking anybody. */
  await page.locator('#email').fill('you@example.org');
  await page.locator('#message').fill('typo3_icon_lookup answered “not registered” for an icon that is.');
  await page.getByRole('button', { name: 'Send the report' }).click();
  await expect(page.locator('.sds-note--ok')).toContainText('The report was sent');
});

/* A set of cards, at the widths where the row runs out. `auto-fit` fills a row
   and drops the remainder onto the next one, so four cards in a three-wide row
   wrap as three and one — a card on its own beside two tracks of nothing, and
   in a flush set a bite out of the wall. `sds-card-grid` measures how many the
   row holds and steps down to a count that divides, which is a decision no
   stylesheet can make: it is arithmetic over how many cards there are.

   Asserted as a shape rather than a number, the way the menu's run-width is:
   no row of a wrapped set holds a single card. */
test('a set of cards wraps into even rows, never one on its own', async ({ page }) => {
  await gotoStory(page, 'components-card-grid--flush');
  const cards = page.locator('.sds-grid--flush .sds-card');
  const count = await cards.count();
  expect(count, 'the story should hold a set worth wrapping').toBeGreaterThan(3);

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    /* The element measures, so the answer arrives a frame after the resize. */
    await page.waitForFunction(
      (n) => document.querySelectorAll('.sds-grid--flush .sds-card').length === n,
      count,
      { timeout: 5_000 },
    );
    await page.waitForTimeout(120);

    const rows = await cards.evaluateAll((els) => {
      const tally = new Map<number, number>();
      for (const el of els) {
        const top = Math.round(el.getBoundingClientRect().top);
        tally.set(top, (tally.get(top) ?? 0) + 1);
      }
      return [...tally.values()];
    });

    /* The last row against the ones above it. Not "no row holds one card": at
       a phone's width every row holds one, and a single column is as even as
       a set gets. What is being refused is a tail shorter than the courses
       above it by more than one — three and one, five and one. */
    const last = rows[rows.length - 1] as number;
    expect(last, `${width}px wrapped as ${rows.join('+')}`).toBeGreaterThanOrEqual((rows[0] as number) - 1);
  }
});
