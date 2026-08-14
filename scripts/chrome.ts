#!/usr/bin/env node
/* The chrome the specimen cards are drawn with, into a rendered root.

     make chrome ARGS=.out/site

   Its own task for the same reason `make embed` is one: it copies two things
   this site has and a reader's project does not, it generates nothing, and the
   job that publishes the site installs nothing. */
import { resolve } from 'node:path';

import { cardChrome, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

report.open('chrome', 'the specimen chrome, into a rendered root');

const root = process.argv[2];
if (!root) {
  report.summary('which root?', ['node scripts/chrome.ts <directory>']);
  process.exit(1);
}

cardChrome(resolve(ROOT, root));
report.summary(`copied beside ${root}`);
