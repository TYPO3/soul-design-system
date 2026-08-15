/* The page layouts, at every width they are meant to survive.

   A page is the only place the layout classes meet each other, and the ways a
   layout fails are invisible to everything else — `lib/layout.ts` is what they
   are and how each is measured. The card diff sees none of them: a card is a
   fragment at a fixed width, and the fit check asks about height at the one
   size a screen declares.

   So the pages are measured, at the widths a laptop, a tablet and a phone
   actually are, and the guarantee is flat: a page never overflows. */

import { test, expect } from '@playwright/test';
import { pageOverflow, pageOverlaps } from './lib/layout.ts';
import { gotoStory, resizeTo } from './lib/story.ts';

const WIDTHS = [1440, 1280, 1024, 900, 860, 768, 640, 480, 375, 320];
const OVERLAP_WIDTHS = new Set([1440, 1024, 860, 640, 375]);
const PAGE_SHARDS = 6;

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

for (let shard = 0; shard < PAGE_SHARDS; shard++) {
  test(`every page fits without overlap, shard ${shard + 1}`, async ({ page, request }) => {
    const pages = await pageStories(request);
    expect(pages.length, 'there should be page layouts to measure').toBeGreaterThan(1);
    const assigned = pages.filter((_, index) => index % PAGE_SHARDS === shard);

    /* A story is loaded once, then resized in place. Fixed shards let each
       worker share the sweep while the timeout follows the live page index. */
    test.setTimeout(Math.max(30_000, assigned.length * WIDTHS.length * 700));

    for (const story of assigned) {
      await page.setViewportSize({ width: WIDTHS[0]!, height: 900 });
      await gotoStory(page, story.id);

      for (const width of WIDTHS) {
        await resizeTo(page, width);
        const over = await pageOverflow(page);
        expect(over, `${story.title} at ${width}px: ${JSON.stringify(over)}`).toBeNull();

        if (OVERLAP_WIDTHS.has(width)) {
          const hits = await pageOverlaps(page);
          expect(hits, `${story.title} at ${width}px`).toEqual([]);
        }
      }
    }
  });
}

/* One button, and everything a reader could want behind it. The page's own rail
   is a column while there is room for one and gone when there is not — what the
   bar opens at that width is the site's whole menu, which holds those pages
   among the rest. */
test('the page rail is a column, and the bar carries the site', async ({ page }) => {
  const rail = page.locator('#page-rail');
  const drawer = page.locator('.sds-bar__drawer');
  const toggle = page.locator('.sds-bar__toggle');

  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoStory(page, 'pages-documentation--page');
  await expect(rail).toBeVisible();
  await expect(drawer.locator('#page-rail')).toHaveCount(0);

  await page.setViewportSize({ width: 760, height: 900 });
  await expect(toggle).toBeVisible();
  /* The column is gone, and the rail did not follow it into the drawer: it is
     the section's list, and what the bar carries is the site's. Here the row
     still holds the sections, so the way anywhere is the marker beside one. */
  await expect(rail).toBeHidden();
  await expect(drawer.locator('#page-rail')).toHaveCount(0);
  await expect(page.locator('.sds-bar__nav .sds-pill').first()).toBeVisible();

  /* Narrow enough that the sections go too, and the one button holds the whole
     menu: the sections, each with its own pages folded under it. */
  await page.setViewportSize({ width: 420, height: 900 });
  await toggle.click();
  await expect(drawer).toHaveCSS('position', 'absolute');
  const menu = drawer.locator('.sds-bar__level');
  await expect(menu).toBeVisible();
  await expect(drawer.locator('.sds-bar__nav')).toHaveCount(0);
  /* It opened on the level of the page below it, so the site is one press up —
     and there every section carries the way into its own pages. */
  await expect(menu.locator('.sds-bar__back')).toHaveCount(1);
  await menu.locator('.sds-bar__back').click();
  await expect(menu.locator('.sds-bar__into').first()).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();

  /* And the column is back on the way out, where the page put it — the rail
     never travelled, so there is nowhere for it to have been left. */
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(rail).toBeVisible();
  await expect(page.locator('.sds-body > #page-rail')).toHaveCount(1);
});

/* The width where the column goes, which is the layout's decision and not the
   bar's: the field is behind the button on both sides of it, so nothing in the
   row changes as it is crossed. */
test('the rail loses its column at the width the layout stacks', async ({ page }) => {
  const rail = page.locator('#page-rail');

  await page.setViewportSize({ width: 900, height: 900 });
  await gotoStory(page, 'pages-documentation--page');
  await expect(rail).toBeVisible();
  await page.setViewportSize({ width: 856, height: 900 });
  await expect(rail).toBeHidden();
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(rail).toBeVisible();
});

/* The bar's run-width. What it does is decided by measurement, so there is no
   number to assert — only the shape of the decision: wide enough and the
   sections are a row with no button; narrow enough and they are behind one,
   reachable, which is what a breakpoint that merely hid them never had. */
test('the header navigation folds rather than disappearing', async ({ page }) => {
  const nav = page.locator('.sds-bar__nav');
  const toggle = page.locator('.sds-bar__toggle');

  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoStory(page, 'pages-landing--page');
  await expect(nav).toBeVisible();
  await expect(toggle).toBeHidden();

  await page.setViewportSize({ width: 420, height: 900 });
  await expect(toggle).toBeVisible();
  await expect(nav).toBeHidden();

  await toggle.click();
  await expect(nav).toBeVisible();
  await expect(nav.locator('.sds-pill')).toHaveCount(4);

  /* The drawer is the canvas and it spans the page, so nothing about its own
     surface says it is in front — and there are no shadows here to say it
     with. The page under it is washed instead, and pressing that wash is a way
     back out. Pressed low, below where the drawer reaches: the point has to be
     the wash and not the panel standing on it. */
  const wash = page.locator('.sds-bar .sds-overlay');
  await expect(wash).toBeVisible();
  await wash.click({ position: { x: 8, y: 780 } });
  await expect(nav).toBeHidden();

  /* Escape closes it, and the toggle takes the focus back — a panel dismissed
     with the keyboard that leaves the focus inside it has dropped the reader
     somewhere they cannot see. */
  await toggle.click();
  await expect(nav).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(wash).toHaveCount(0);
});

/* The field goes before the sections do, and it goes whole. It used to be the
   one thing that gave, which bought the row 100px and left a box too narrow to
   read what had been typed into it; on a phone it left the bar entirely and
   there was nothing to press in its place. */
test('the search field moves into the drawer rather than shrinking or leaving', async ({ page }) => {
  const inRow = page.locator('.sds-bar__end .sds-search');
  const inDrawer = page.locator('.sds-bar__drawer .sds-search');
  const toggle = page.locator('.sds-bar__toggle');

  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoStory(page, 'pages-news--page');
  await expect(inRow).toBeVisible();

  await page.setViewportSize({ width: 420, height: 900 });
  await expect(inRow).toHaveCount(0);
  await toggle.click();
  await expect(inDrawer.locator('.sds-input')).toBeVisible();
});

/* The step between layout bands is crossed, not jumped. Only the gutter is
   animated and never the inset itself: the inset is a `max()` of the gutter and
   the centring, the centring tracks the window, and a page that eases after a
   drag reads as a page lagging behind one.

   Opened without `gotoStory`, which freezes every transition so that nothing
   else here measures a value belonging to neither state. */
interface WindowWithCrossing extends Window {
  crossing?: string;
}

test('the bar crosses the step between layout bands rather than jumping it', async ({ page }) => {
  const inset = (): Promise<string> =>
    page.evaluate(() => getComputedStyle(document.querySelector('.sds-bar')!).paddingLeft);

  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/iframe.html?id=pages-landing--page&viewMode=story');
  await page.waitForSelector('.sds-bar', { state: 'attached', timeout: 15_000 });
  expect(await inset()).toBe('24px');

  /* Sampled on the transition's own timeline, not the clock: a loaded machine
     is past all 140ms before a `setTimeout` fires, and the value read then is
     the finished one, which proves nothing either way. The step is caught as it
     starts, held, and read at a point that is by construction mid-flight. */
  await page.evaluate(() => {
    const bar = document.querySelector('.sds-bar')!;
    bar.addEventListener('transitionrun', (event) => {
      if ((event as TransitionEvent).propertyName !== '--page-gutter') return;
      const step = bar.getAnimations()
        .find((a) => (a as CSSTransition).transitionProperty === '--page-gutter')!;
      step.pause();
      step.currentTime = 40;
      (window as WindowWithCrossing).crossing = getComputedStyle(bar).paddingLeft;
      step.play();
    });
  });

  await page.setViewportSize({ width: 800, height: 900 });
  const held = await page.waitForFunction(
    () => (window as WindowWithCrossing).crossing,
    undefined,
    { timeout: 5_000 },
  );
  const crossing = parseFloat((await held.jsonValue())!);
  expect(crossing).toBeGreaterThan(16);
  expect(crossing).toBeLessThan(24);

  await expect.poll(inset).toBe('16px');
});

/* The bar stays at the top of the page as the page moves under it.

   It sticks on the element, not only on the row inside it: a sticky box travels
   inside its parent, and with the row in an element exactly as tall there is
   nothing to travel. Both carry the rule — the element for a page that has one,
   the class for a bar somebody drew — and neither is visible in any markup
   comparison, which is why it is measured here. */
test('the bar stays at the top while the page scrolls under it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/iframe.html?id=pages-landing--page&viewMode=story');
  await page.waitForSelector('.sds-bar', { state: 'attached', timeout: 15_000 });

  const top = (): Promise<number> =>
    page.evaluate(() => document.querySelector('.sds-bar')!.getBoundingClientRect().top);

  expect(await top()).toBeCloseTo(0, 0);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect(await top(), 'the bar should still be against the top of the viewport').toBeCloseTo(0, 0);
});

test('the landing story opens with the composed hero', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoStory(page, 'pages-landing--page');

  const hero = page.locator('#overview > .sds-split');
  /* A split holds columns — the half is named rather than recognised. */
  const columns = hero.locator(':scope > .sds-column');
  await expect(columns).toHaveCount(2);
  const widths = await columns.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
  expect(Math.abs(widths[0]! - widths[1]!)).toBeLessThan(2);
  await expect(hero.locator('sds-figure .sds-art')).toHaveAttribute('src', /design-system-workbench\.png$/);
  await expect(hero.locator('sds-figure .sds-art')).toHaveAttribute('alt', '');
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
  const entries = page.locator('#entries sds-card');
  const all = await entries.count();
  expect(all, 'the list should hold entries to filter').toBeGreaterThan(2);
  const read = Number(await page.locator('sds-nav-pagination').getAttribute('count'));
  expect(read, 'the row should say how many there are in all').toBeGreaterThanOrEqual(all);

  await page.locator('.sds-pills .sds-pill', { hasText: 'releases' }).click();
  const some = await entries.count();
  expect(some).toBeGreaterThan(0);
  expect(some, 'a filter should narrow the list').toBeLessThan(all);

  await page.locator('.sds-pills .sds-pill', { hasText: 'security' }).click();
  await expect(entries).toHaveCount(0);
  const empty = page.locator('#entries sds-note');
  await expect(empty).toBeVisible();
  /* Not "no results": how much was read is the part that makes it an answer
     rather than a shrug. */
  await expect(empty).toContainText(new RegExp(`All ${read} entries were read`));

  await empty.locator('button.sds-btn').click();
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
   in a flush set a bite out of the wall. `sds-grid` measures how many the
   row holds and steps down to a count that divides, which is a decision no
   stylesheet can make: it is arithmetic over how many cards there are.

   Asserted as a shape rather than a number, the way the menu's run-width is:
   no row of a wrapped set holds a single card. */
test('a set of cards wraps into even rows, never one on its own', async ({ page }) => {
  await gotoStory(page, 'components-grid--flush');
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
