#!/usr/bin/env node
/* A picture for the tree, out of the PNG an image tool hands over.

   An illustration and a portrait ship as WebP at quality 0.86, transparency
   kept, at their own size. This writes the WebP beside each PNG named. The PNG
   stays where it is, so the next step is a look at both and a `git rm`.

     make webp ARGS='packages/frontend/assets/placeholders/new-tool.png'
*/
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { withBrowser } from './lib/browser.ts';
import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

/* The quality `docs/design-system/brand-and-imagery/illustrations.rst` states. */
const QUALITY = 0.86;

report.open('webp', 'turn a PNG into the WebP the tree keeps');

const files = process.argv.slice(2);
const missing = files.filter((file) => !file.endsWith('.png') || !existsSync(join(ROOT, file)));
if (files.length === 0 || missing.length) {
  report.summary(files.length ? 'not every name is a PNG in this tree' : 'which PNG?', [
    ...missing.map((file) => `${file} is no PNG here`),
    'make webp ARGS=\'<file.png> [<file.png> …]\'',
  ]);
  process.exit(1);
}

const kb = (bytes: number): string => `${Math.round(bytes / 1024)} KB`;

await withBrowser(async (browser) => {
  const page = await browser.newPage();
  for (const file of files) {
    const png = readFileSync(join(ROOT, file));
    const drawn = await page.evaluate(
      async ([b64, quality]) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        return { url: canvas.toDataURL('image/webp', quality), width: canvas.width, height: canvas.height };
      },
      [png.toString('base64'), QUALITY] as const,
    );
    if (!drawn.url.startsWith('data:image/webp')) {
      report.summary(`the browser wrote no WebP for ${file}`, ['a Chromium with WebP is what this task needs']);
      process.exit(1);
    }
    const out = file.replace(/\.png$/, '.webp');
    writeFileSync(join(ROOT, out), Buffer.from(drawn.url.split(',')[1] ?? '', 'base64'));
    report.fact(out, `${drawn.width} × ${drawn.height} · ${kb(png.length)} → ${kb(statSync(join(ROOT, out)).size)}`);
  }
});

report.summary(`${files.length} picture(s) written beside their PNG`, []);
