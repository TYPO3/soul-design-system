/* The specimen stories are the ones the cards come from.

   A file opts in with an export of `specimenHtml`, which `scripts/cards.ts`
   looks for. The story a card is a picture of is the one named `Specimen`.
   So every file that generates a card has one. And every Specimen story
   renders under the contract `preview.ts` holds it to: static markup,
   drawn from the system. Counted against the story files rather than a
   number written here. */

import { expect, test } from 'vitest';

const FILES = import.meta.glob<Record<string, unknown>>('../stories/**/*.stories.ts', { eager: true });

test('every card generator has a specimen story', () => {
  const generators = Object.entries(FILES).filter(([, mod]) => 'specimenHtml' in mod);
  expect(generators.length, 'there must be story files that generate a card').toBeGreaterThan(10);
  const missing = generators.filter(([, mod]) => !('Specimen' in mod)).map(([path]) => path);
  expect(missing, 'each story file that generates a card must export a Specimen story').toEqual([]);
});
