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
import * as report from './lib/report.ts';

const check = process.argv.includes('--check');
const drift: string[] = [];
let cards = 0;
let marks = 0;

report.open('embed', check ? 'the marks beside the documents match the drawings' : 'the cards and marks, beside the documents');

for (const project of PROJECTS) {
  if (!check) {
    const written = embedCards(project.source);
    cards += written;
    report.fact(project.name, `${written} card(s) where its documents can reach them`);
  }
  if (!project.marks) continue;
  marks += Object.keys(project.marks).length;
  drift.push(...embedMarks(project.source, project.marks, check).map((line) => `${project.name}: ${line}`));
}

report.summary(check ? `${marks} marks` : `${cards} cards · ${marks} marks`, drift);
process.exit(check && drift.length ? 1 : 0);
