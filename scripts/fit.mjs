#!/usr/bin/env node
/* Does every card fit the viewport its @dsCard line declares?

   The card is rendered at its declared width with the height unconstrained,
   and the document is asked how tall its content actually is. If that
   exceeds the declared height the product card crops it — which is how a
   modal loses its buttons, or a note loses its last line. Too much slack is
   worth knowing too: it shows up as dead space in the pane.

     node scripts/fit.mjs
*/
import { cards } from './lib/cards.mjs';
import { openCard, withPage } from './lib/browser.mjs';

const SLACK = 60;
const list = cards();

const results = await withPage(async ({ map }) =>
  map(list, async (page, card) => {
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
    return { card, content };
  }));

let cropped = 0;
for (const { card, content } of results) {
  if (content > card.height) {
    cropped++;
    console.log(`  CROPPED ${card.rel}: declares ${card.viewport}, content is ${content}px (+${content - card.height})`);
  } else if (content < card.height - SLACK) {
    console.log(`  slack   ${card.rel}: declares ${card.viewport}, content only ${content}px (-${card.height - content})`);
  }
}
console.log(`\n${list.length} cards, ${cropped} cropped`);
process.exit(cropped ? 1 : 0);
