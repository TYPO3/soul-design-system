#!/usr/bin/env node
/* Does every card fit the viewport its @dsCard line declares?

   The card is rendered at its declared width with the height unconstrained and
   asked how tall its content is. Over the declared height the product card
   crops it — a modal losing its buttons — and too much slack is dead space.

   Height is not the only way to lose content: a cell with `overflow: hidden`
   silently cuts whatever is wider than it inside a card of correct height. So
   every element that clips is asked whether anything is clipped — only those,
   since content painting outside a `visible` box is ordinary. */
import { cards, screens, type Card, type Screen } from './lib/cards.ts';
import { openCard, withPage } from './lib/browser.ts';
import * as report from './lib/report.ts';

/** A screen declares a `section`; a card declares a `group`. That is the only
    thing that tells them apart here, so it is the discriminator. */
const isScreen = (c: Card | Screen): c is Screen => 'section' in c;

const SLACK = 60;
const list = [...cards(), ...screens()];

const results = await withPage(async ({ map }) =>
  map(list, async (page, card) => {
    /* A card is a fragment: render it tall and ask how much it actually
       fills, so an over-declared height shows up as slack. A screen is a
       whole page, usually with min-height:100vh — measured that way it would
       always report the tall viewport back. For screens the question is
       different anyway: does the page overflow the size it declares? */
    /* A screen is a whole page and a page scrolls, so height here would only
       ever mean "longer than one viewport", which is not a fault. Width is the
       question: a page wider than the screen it declares is broken at that
       size, and `tests/pages.spec.ts` measures the rest. */
    if (isScreen(card)) {
      await openCard(page, card);
      const wide = await page.evaluate(() =>
        Math.max(0, Math.ceil(document.documentElement.scrollWidth - document.documentElement.clientWidth)));
      return { card, content: card.height, wide };
    }
    await openCard(page, card, { height: 2400 });
    const content = await page.evaluate(() => {
      const d = document.documentElement;
      // The tallest painted thing, ignoring the viewport-filling <html>/<body>.
      let bottom = 0;
      for (const el of document.body.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) bottom = Math.max(bottom, r.bottom);
      }
      return Math.ceil(Math.max(bottom, d.scrollHeight === 2400 ? 0 : d.scrollHeight));
    });
    const clipped = await page.evaluate(() => {
      const hits: string[] = [];
      for (const el of document.body.querySelectorAll('*')) {
        const e = el as HTMLElement;
        if (getComputedStyle(e).overflowX === 'visible') continue;
        if (e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2) {
          const text = (e.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40);
          hits.push(`${e.clientWidth}px box holding ${e.scrollWidth}px — "${text}"`);
        }
      }
      return hits;
    });
    return { card, content, clipped };
  }));

report.open('fit', 'every card renders inside the viewport it declares');

const cropped: string[] = [];
let slack = 0;
for (const { card, content, clipped, wide } of results) {
  if (wide) {
    cropped.push(`${card.rel}: declares ${card.viewport}, the page is ${card.width + wide}px across (+${wide})`);
  } else if (content > card.height) {
    cropped.push(`${card.rel}: declares ${card.viewport}, the content is ${content}px (+${content - card.height})`);
  } else if (content < card.height - SLACK) {
    slack++;
    report.note(`${card.rel}: declares ${card.viewport}, the content only reaches ${content}px (-${card.height - content})`);
  }
  for (const hit of clipped ?? []) cropped.push(`${card.rel}: clipped — ${hit}`);
}
report.summary(`${list.length} cards and screens · ${slack} with slack`, cropped);
process.exit(cropped.length ? 1 : 0);
