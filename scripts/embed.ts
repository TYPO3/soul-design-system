#!/usr/bin/env node
/* The specimen cards and the marks, beside the documents that reference them.

     make embed
     make embed ARGS=--check

   Its own task twice over. It belongs to the cards rather than to the render,
   and it reads `specimens/` rather than generating anything — so it runs where
   nothing is installed, which is where this site is published from. `make
   cards` ends with it, so a tree that has just generated them is complete. */
import { embedCards, embedMarks } from './lib/cards.ts';
import { PROJECTS } from './lib/projects.ts';

const check = process.argv.includes('--check');
let stale = 0;

for (const project of PROJECTS) {
  if (!check) {
    const written = embedCards(project.source);
    console.log(`   ${project.name}: ${written} card(s) where its documents can reach them`);
  }
  if (!project.marks) continue;
  const drifted = embedMarks(project.source, project.marks, check);
  for (const line of drifted) console.log(`   ${check ? '✗ ' : ''}${line}`);
  stale += drifted.length;
  if (!drifted.length) console.log(`   ${project.name}: ${Object.keys(project.marks).length} mark(s) match their drawings`);
}

if (check && stale) {
  console.error('✗ a mark beside the documents is not the drawing it was copied from — run `make embed`');
  process.exit(1);
}
