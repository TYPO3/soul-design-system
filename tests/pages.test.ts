/* The page layouts, at every width they must survive.

   A page is the only place the layout classes meet each other. The ways a
   layout fails are invisible to everything else — `lib/layout.ts` is what they
   are and how each measures. The card diff sees none of them. A card is a
   fragment at a fixed width, and the fit check asks about height at the one
   size a screen declares.

   So the pages measure, at the widths a laptop, a tablet and a phone have,
   and the guarantee is flat: a page never overflows. */

import { afterEach, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import type { Meta } from '@storybook/web-components-vite';
import type { Store_CSFExports } from 'storybook/internal/types';
import type { WebComponentsRenderer } from '@storybook/web-components-vite';
import { pageOverflow, pageOverlaps } from './lib/layout.ts';
import { box, frames, mount, q, qa, shown, sleep, stories } from './lib/frame.ts';
import * as documentation from '../stories/pages/DocumentationPage.stories.ts';
import * as landing from '../stories/pages/LandingScreen.stories.ts';
import * as news from '../stories/pages/NewsPage.stories.ts';
import * as contact from '../stories/pages/ContactPage.stories.ts';
import * as grid from '../stories/components/Grid.stories.ts';

const WIDTHS = [1440, 1280, 1024, 900, 860, 768, 640, 480, 375, 320];
const OVERLAP_WIDTHS = new Set([1440, 1024, 860, 640, 375]);

const Documentation = stories(documentation);
const Landing = stories(landing);
const News = stories(news);
const Contact = stories(contact);
const Grid = stories(grid);

/* Every page story, read out of the files rather than listed here. A list
   kept by hand is one a new page is quietly absent from. */
// biome-ignore lint/suspicious/noExplicitAny: every file's args are its own
const PAGES = Object.values(import.meta.glob<Store_CSFExports<WebComponentsRenderer, any>>('../stories/pages/*.stories.ts', { eager: true }))
  .flatMap((file) => {
    const title = (file.default as Meta).title ?? '';
    return title.startsWith('Pages/') ? Object.values(stories(file)).map((story) => ({ title, story })) : [];
  });

/** A window of this width, and every element's own answer to it. */
async function resize(width: number, height = 900): Promise<void> {
  await page.viewport(width, height);
  await frames();
}

afterEach(() => resize(1280));

expect(PAGES.length, 'there must be page layouts to measure').toBeGreaterThan(1);
for (const { title, story } of PAGES) {
  /* Ten widths of a whole page, each with every element's own answer to
     it. That is more than a test's default on a machine with other work. */
  test(`${title}/${story.storyName} fits without overlap`, { timeout: 60_000 }, async () => {
    /* A story mounts once, then resizes in place. */
    await resize(WIDTHS[0] as number);
    await mount(story);

    for (const width of WIDTHS) {
      await resize(width);
      const over = pageOverflow();
      expect(over, `${title} at ${width}px: ${JSON.stringify(over)}`).toBeNull();

      if (OVERLAP_WIDTHS.has(width)) {
        expect(pageOverlaps(), `${title} at ${width}px`).toEqual([]);
      }
    }
  });
}

/* One button, and everything a reader can want behind it. The page's own rail
   is a column while there is room for one and gone when there is not. What the
   bar opens at that width is the site's whole menu, which holds those pages
   among the rest. */
test('the page rail is a column, and the bar carries the site', async () => {
  const rail = () => q('#page-rail');
  const toggle = () => q('.sds-bar__toggle');

  await resize(1280);
  await mount(Documentation.Page);
  expect(shown(rail())).toBe(true);
  expect(qa('.sds-bar__drawer #page-rail')).toHaveLength(0);

  await resize(760);
  await expect.element(toggle()).toBeVisible();
  /* The column has gone, and the rail did not follow it into the drawer. It is
     the section's list, and what the bar carries is the site's. Here the row
     still holds the sections, so the way anywhere is the marker beside one. */
  expect(shown(rail())).toBe(false);
  expect(qa('.sds-bar__drawer #page-rail')).toHaveLength(0);
  expect(shown(q('.sds-bar__nav .sds-pill'))).toBe(true);

  /* Narrow enough that the sections go too, and the one button holds the whole
     menu: the sections, each with its own pages folded under it. */
  await resize(420);
  await userEvent.click(toggle());
  const drawer = q('.sds-bar__drawer');
  await expect.element(drawer).toHaveStyle({ position: 'absolute' });
  const menu = q('.sds-bar__level', drawer);
  await expect.element(menu).toBeVisible();
  expect(qa('.sds-bar__nav', drawer)).toHaveLength(0);
  /* It opened on the level of the page below it, so the site is one press up.
     There every section carries the way into its own pages. */
  expect(qa('.sds-bar__back', menu)).toHaveLength(1);
  await userEvent.click(q('.sds-bar__back', menu));
  await expect.element(q('.sds-bar__into', menu)).toBeVisible();

  await userEvent.keyboard('{Escape}');
  await expect.element(menu).not.toBeVisible();
  expect(document.activeElement).toBe(toggle());

  /* And the column is back on the way out, where the page put it. The rail
     never travelled, so there is nowhere for it to have stayed. */
  await resize(1280);
  await expect.element(rail()).toBeVisible();
  expect(qa('.sds-body > #page-rail')).toHaveLength(1);
});

/* The width where the column goes, which is the layout's decision and not the
   bar's. The field is behind the button on both sides of it, so nothing in the
   row changes across it. */
test('the rail loses its column at the width the layout stacks', async () => {
  await resize(900);
  await mount(Documentation.Page);
  expect(shown(q('#page-rail'))).toBe(true);
  await resize(856);
  expect(shown(q('#page-rail'))).toBe(false);
  await resize(900);
  expect(shown(q('#page-rail'))).toBe(true);
});

/* The bar's run-width. A measurement decides what it does, so there is no
   number to assert — only the shape of the decision. Wide enough and the
   sections are a row with no button. Narrow enough and they are behind one,
   reachable, which is what a breakpoint that merely hid them never had. */
test('the header navigation folds rather than goes', async () => {
  const nav = () => q('.sds-bar__nav');
  const toggle = () => q('.sds-bar__toggle');

  await resize(1440);
  await mount(Landing.Page);
  expect(shown(nav())).toBe(true);
  expect(shown(document.querySelector('.sds-bar__toggle'))).toBe(false);

  await resize(420);
  await expect.element(toggle()).toBeVisible();
  expect(shown(nav())).toBe(false);

  await userEvent.click(toggle());
  await expect.element(nav()).toBeVisible();
  expect(qa('.sds-pill', nav())).toHaveLength(4);

  /* The drawer is the canvas and it spans the page, so nothing about its own
     surface says it is in front. There are no shadows here to say it with.
     The page under it gets a wash instead, and a press on that wash is a way
     back out. Pressed low, below where the drawer reaches: the point has to be
     the wash and not the panel on it. */
  const wash = q('.sds-bar .sds-overlay');
  expect(shown(wash)).toBe(true);
  await userEvent.click(wash, { position: { x: 8, y: 780 } });
  await expect.element(nav()).not.toBeVisible();

  /* Escape closes it, and the toggle takes the focus back. A panel closed
     with the keyboard that leaves the focus inside it has dropped the reader
     somewhere they cannot see. */
  await userEvent.click(toggle());
  await expect.element(nav()).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await expect.element(nav()).not.toBeVisible();
  expect(document.activeElement).toBe(toggle());
  expect(qa('.sds-bar .sds-overlay')).toHaveLength(0);
});

/* The field goes before the sections do, and it goes whole. A field that
   gives buys the row 100px and leaves a box too narrow to read the typed
   text. A field that leaves the bar on a phone leaves nothing to press in its
   place. */
test('the search field moves into the drawer, and neither shrinks nor goes', async () => {
  await resize(1440);
  await mount(News.Page);
  expect(shown(q('.sds-bar__end .sds-search'))).toBe(true);

  await resize(420);
  expect(qa('.sds-bar__end .sds-search')).toHaveLength(0);
  await userEvent.click(q('.sds-bar__toggle'));
  await expect.element(q('.sds-bar__drawer .sds-search .sds-input')).toBeVisible();
});

/* The bar eases across the step between layout bands and does not jump it.
   Only the gutter animates and never the inset itself. The inset is a `max()`
   of the gutter and the centring, and the centring tracks the window. A page
   that eases after a drag reads as a page that lags behind one.

   Nothing here freezes a transition, so the sample below reads a value that
   belongs to neither state on purpose. */
test('the bar eases across the step between layout bands rather than jumps it', async () => {
  const inset = (): string => getComputedStyle(q('.sds-bar')).paddingLeft;

  await resize(900);
  await mount(Landing.Page);
  expect(inset()).toBe('24px');

  /* Sampled on the transition's own timeline, not the clock. A loaded machine
     is past all 140ms before a `setTimeout` fires, and the value read then is
     the final one, which proves nothing either way. The step stops as it
     starts, holds, and reads at a point that is by construction mid-flight. */
  let crossing: string | undefined;
  const bar = q('.sds-bar');
  bar.addEventListener('transitionrun', (event) => {
    if ((event as TransitionEvent).propertyName !== '--page-gutter') return;
    const step = bar.getAnimations().find((a) => (a as CSSTransition).transitionProperty === '--page-gutter') as Animation;
    step.pause();
    step.currentTime = 40;
    crossing = getComputedStyle(bar).paddingLeft;
    step.play();
  });

  await page.viewport(800, 900);
  await expect.poll(() => crossing, { timeout: 10_000 }).toBeDefined();
  const mid = parseFloat(crossing as string);
  expect(mid).toBeGreaterThan(16);
  expect(mid).toBeLessThan(24);

  await expect.poll(inset).toBe('16px');
});

/* The bar stays at the top of the page as the page moves under it.

   It sticks on the element, not only on the row inside it. A sticky box travels
   inside its parent, and with the row in an element exactly as tall there is
   nothing to travel. Both carry the rule: the element for a page that has one,
   the class for a bar somebody drew. Neither is visible in any markup
   comparison, which is why the measurement is here. */
test('the bar stays at the top while the page scrolls under it', async () => {
  await resize(1440);
  await mount(Landing.Page);

  const top = (): number => box(q('.sds-bar')).top;

  expect(top()).toBeCloseTo(0, 0);
  window.scrollTo(0, 1200);
  await expect.poll(() => window.scrollY).toBeGreaterThan(0);
  expect(top(), 'the bar must still be against the top of the viewport').toBeCloseTo(0, 0);
  window.scrollTo(0, 0);
});

test('the landing story opens with the composed hero', async () => {
  await resize(1440);
  await mount(Landing.Page);

  const hero = q('#overview > .sds-split');
  /* A split holds columns — the half carries a name rather than a shape. */
  const columns = qa(':scope > .sds-column', hero);
  expect(columns).toHaveLength(2);
  const widths = columns.map((node) => box(node).width);
  expect(Math.abs((widths[0] as number) - (widths[1] as number))).toBeLessThan(2);
  expect(q('sds-figure .sds-art', hero).getAttribute('src')).toMatch(/design-system-workbench\.png$/);
  expect(q('sds-figure .sds-art', hero).getAttribute('alt')).toBe('');
});

/* A filter that matches nothing — the state a list page skips, because its
   fixture always had rows. What has to hold is that an answer replaces the
   list and names how much the search covered. And that the offer inside it
   puts the list back rather than merely looks as if it can. */
test('a filter that matches nothing answers, and the answer undoes it', async () => {
  await resize(1440);
  await mount(News.Page);

  /* Counted off the page rather than written here. How many entries the list
     holds is the page's business. A literal fails the day one arrives — a
     test that fails at the one thing it is not about. Two numbers, because the
     page shows one page of the list, and the answer names the second. */
  const entries = () => qa('#entries sds-card');
  const all = entries().length;
  expect(all, 'the list must hold entries to filter').toBeGreaterThan(2);
  const read = Number(q('sds-nav-pagination').getAttribute('count'));
  expect(read, 'the row must say how many there are in all').toBeGreaterThanOrEqual(all);

  const pill = (text: string): HTMLElement => {
    const found = qa('.sds-pills .sds-pill').find((el) => el.textContent?.includes(text));
    if (!found) throw new Error(`no pill reads ${text}`);
    return found;
  };
  await userEvent.click(pill('releases'));
  await expect.poll(() => entries().length).toBeLessThan(all);
  expect(entries().length).toBeGreaterThan(0);

  await userEvent.click(pill('security'));
  await expect.poll(() => entries().length).toBe(0);
  const empty = q('#entries sds-note');
  expect(shown(empty)).toBe(true);
  /* Not "no results": how much the search covered is the part that makes it
     an answer rather than a shrug. */
  expect(empty.textContent).toMatch(new RegExp(`The filter covered all ${read} entries`));

  await userEvent.click(q('button.sds-btn', empty));
  await expect.poll(() => entries().length).toBe(all);
});

/* What a form does when it fails. A submit that finds something has to say
   what, where the reader lands. Marked boxes are no use to a reader who
   cannot take in the whole form. Three things hold together and none shows in
   a screenshot. The summary appears, takes the focus, and each line in it
   reaches the field it names. */
test('a form that fails says what, and sends the reader to it', async () => {
  await resize(1440);
  await mount(Contact.Page);

  expect(qa('.sds-form-errors')).toHaveLength(0);

  /* Empty the two answers the form cannot do without. */
  await userEvent.fill(q('#email'), '');
  await userEvent.fill(q('#message'), '');
  await page.getByRole('button', { name: 'Send the report' }).click();

  const summary = q('.sds-form-errors');
  await expect.element(summary).toBeVisible();
  expect(document.activeElement).toBe(summary);
  expect(qa('a.sds-link', summary)).toHaveLength(2);

  /* The field carries the same sentence as the line about it, so what is
     wrong is legible from either end of the form. */
  expect(q('sds-textarea[field-id="message"] .sds-field-error').textContent).toContain('The message is empty');
  expect(q('#message').getAttribute('aria-invalid')).toBe('true');

  /* Both filled in, it is a form that worked, and the page says what it sent
     rather than thanks anybody. */
  await userEvent.fill(q('#email'), 'you@example.org');
  await userEvent.fill(q('#message'), 'typo3_icon_lookup answered “not registered” for an icon that is.');
  await page.getByRole('button', { name: 'Send the report' }).click();
  await expect.element(q('.sds-note--ok')).toHaveTextContent(/The report went out/);
});

/* A set of cards, at the widths where the row runs out. `auto-fit` fills a row
   and drops the rest onto the next one. So four cards in a three-wide row
   wrap as three and one. That is a card on its own beside two tracks of
   nothing, and in a flush set a bite out of the wall. `sds-grid` measures how many the
   row holds and steps down to a count that divides. No stylesheet can make
   that decision, as it is arithmetic over how many cards there are.

   Asserted as a shape rather than a number, the way the menu's run-width is:
   no row of a wrapped set holds a single card. */
test('a set of cards wraps into even rows, never one on its own', async () => {
  await mount(Grid.Flush);
  const cards = () => qa('.sds-grid--flush .sds-card');
  const count = cards().length;
  expect(count, 'the story must hold a set that wraps').toBeGreaterThan(3);

  for (const width of WIDTHS) {
    await resize(width);
    /* The element measures, so the answer arrives a frame after the resize. */
    await expect.poll(() => cards().length, { timeout: 5_000 }).toBe(count);
    await sleep(120);

    const tally = new Map<number, number>();
    for (const el of cards()) {
      const top = Math.round(box(el).top);
      tally.set(top, (tally.get(top) ?? 0) + 1);
    }
    const rows = [...tally.values()];

    /* The last row against the ones above it. Not "no row holds one card": at
       a phone's width every row holds one, and a single column is as even as
       a set gets. What this refuses is a tail shorter than the courses above
       it by more than one — three and one, five and one. */
    const last = rows[rows.length - 1] as number;
    expect(last, `${width}px wrapped as ${rows.join('+')}`).toBeGreaterThanOrEqual((rows[0] as number) - 1);
  }
});
