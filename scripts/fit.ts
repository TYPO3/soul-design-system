#!/usr/bin/env node
/* Does every card fit the viewport its @dsCard line declares?

   The card is rendered at its declared width with the height unconstrained,
   and the document is asked how tall its content actually is. If that
   exceeds the declared height the product card crops it — which is how a
   modal loses its buttons, or a note loses its last line. Too much slack is
   worth knowing too: it shows up as dead space in the pane.

   Height was the only question here for a long time, and it is not the only
   way to lose content. A cell with `overflow: hidden` cuts whatever is wider
   than it, silently, inside a card whose own height is perfectly correct —
   which is how the misuse card came to read "TYPO3 | Soul Desig" after the
   wordmark got longer. So every element that actually clips is asked whether
   anything is being clipped.

   Only elements that clip: `scrollWidth > clientWidth` on an element with
   `overflow: visible` means the content paints outside its box, which is
   ordinary and usually deliberate. Two pixels of slack, because sub-pixel
   layout rounds against images.

     node scripts/fit.ts
*/
import { cards, screens, type Card, type Screen } from './lib/cards.ts';
import { openCard, withPage } from './lib/browser.ts';

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
    /* A screen is a whole page, and a page scrolls: the landing page is four
       screens tall because a landing page is. Height was asked here for a
       while and it only ever meant "this page is longer than one viewport",
       which is not a fault and became one the moment a page was finished.

       Width is the question a screen has to answer. A page wider than the
       screen it declares is broken at that size, and the pages are measured
       at nine more in `tests/pages.spec.ts`. */
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

let cropped = 0;
for (const { card, content, clipped, wide } of results) {
  if (wide) {
    cropped++;
    console.log(`  WIDE    ${card.rel}: declares ${card.viewport}, page is ${card.width + wide}px across (+${wide})`);
  } else if (content > card.height) {
    cropped++;
    console.log(`  CROPPED ${card.rel}: declares ${card.viewport}, content is ${content}px (+${content - card.height})`);
  } else if (content < card.height - SLACK) {
    console.log(`  slack   ${card.rel}: declares ${card.viewport}, content only ${content}px (-${card.height - content})`);
  }
  for (const hit of clipped ?? []) {
    cropped++;
    console.log(`  CLIPPED ${card.rel}: ${hit}`);
  }
}
console.log(`\n${list.length} cards + screens, ${cropped} cropped`);
process.exit(cropped ? 1 : 0);
