#!/usr/bin/env node
/* The specimen cards, beside the documents that embed them.

     make embed

   Its own task twice over. It belongs to the cards rather than to the render,
   and it reads `specimens/` rather than generating anything — so it runs where
   nothing is installed, which is where this site is published from. `make
   cards` ends with it, so a tree that has just generated them is complete. */
import { embedCards } from './lib/cards.ts';
import { PROJECTS } from './lib/projects.ts';

for (const project of PROJECTS) {
  const written = embedCards(project.source);
  console.log(`   ${project.name}: ${written} card(s) where its documents can reach them`);
}
