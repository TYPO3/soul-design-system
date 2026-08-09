#!/usr/bin/env node
/* Tile card screenshots into contact sheets for a fast visual pass.

   Reviewing 39 cards one file at a time is how a broken one slips through.
   One tall image per eight cards is not.

     node scripts/sheet.mjs [shotdir] [outdir] [perSheet]
*/
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { PNG } from 'pngjs';

import { ROOT } from './lib/cards.mjs';

const SRC = resolve(process.argv[2] ?? join(ROOT, '.design-sync/.cache/after'));
const OUT = resolve(process.argv[3] ?? join(ROOT, '.design-sync/.cache/sheets'));
const PER = Number(process.argv[4] ?? 8);
const PAD = 14, LABEL = 20, BG = [24, 24, 24];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/* Cards are not lettered onto the sheet — drawing text would mean shipping a
   font rasteriser. `index.json` lists each sheet's cards in the order they
   are tiled, which is enough to name what you are looking at. */
function blit(dst, src, x0, y0) {
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const s = (y * src.width + x) << 2;
      const d = ((y0 + y) * dst.width + (x0 + x)) << 2;
      if (d < 0 || d + 3 >= dst.data.length) continue;
      dst.data[d] = src.data[s];
      dst.data[d + 1] = src.data[s + 1];
      dst.data[d + 2] = src.data[s + 2];
      dst.data[d + 3] = 255;
    }
  }
}
function rule(dst, x0, y0, w, h, rgb) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const d = (y * dst.width + x) << 2;
      if (d < 0 || d + 3 >= dst.data.length) continue;
      [dst.data[d], dst.data[d + 1], dst.data[d + 2], dst.data[d + 3]] = [...rgb, 255];
    }
  }
}

const shots = readdirSync(SRC).filter((n) => n.endsWith('.png')).sort();
const index = [];
for (let i = 0, sheet = 1; i < shots.length; i += PER, sheet++) {
  const batch = shots.slice(i, i + PER).map((n) => ({ n, img: PNG.sync.read(readFileSync(join(SRC, n))) }));
  const width = Math.max(...batch.map((b) => b.img.width)) + 2 * PAD;
  const height = batch.reduce((a, b) => a + b.img.height + LABEL + PAD, PAD);
  const out = new PNG({ width, height });
  for (let p = 0; p < out.data.length; p += 4) {
    [out.data[p], out.data[p + 1], out.data[p + 2], out.data[p + 3]] = [...BG, 255];
  }
  let y = PAD;
  for (const b of batch) {
    y += LABEL;
    blit(out, b.img, PAD, y);
    rule(out, PAD, y - 1, b.img.width, 1, [70, 70, 70]);
    rule(out, PAD, y + b.img.height, b.img.width, 1, [70, 70, 70]);
    y += b.img.height + PAD;
  }
  writeFileSync(join(OUT, `sheet-${sheet}.png`), PNG.sync.write(out));
  index.push({ sheet, cards: batch.map((b) => b.n) });
  console.log(`sheet-${sheet}.png  ${batch.length} cards  ${width}x${height}`);
}
writeFileSync(join(OUT, 'index.json'), JSON.stringify(index, null, 2));
