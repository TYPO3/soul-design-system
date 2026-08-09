#!/usr/bin/env node
/* A static file server for local development — no dependency, no config.

     npm run dev     # regenerates the gallery, then serves the repo
     npm run serve   # serves what is already there

   Serves the repo root so the cards resolve ../styles.css and ../assets/…
   exactly as they will once uploaded. Pass a port as the first argument. */
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

import { buildGallery } from './gallery.mjs';
import { ROOT } from './lib/cards.mjs';

const PORT = Number(process.argv[2] ?? 4173);
const DIR = resolve(process.argv[3] ?? ROOT);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
};

createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  // normalize + prefix check: a request for ../../etc/passwd must not escape DIR
  const path = resolve(join(DIR, normalize(url)));
  if (!path.startsWith(DIR)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  let target = path;
  try {
    if (statSync(target).isDirectory()) target = join(target, 'gallery.html');
    /* The gallery bakes each card's declared viewport into its iframe, so a
       card edit makes it stale. Rebuilding per request costs milliseconds
       and removes a step nobody would remember. */
    if (target === join(DIR, 'gallery.html')) buildGallery();
    statSync(target);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end(`not found: ${url}`);
    return;
  }
  res.writeHead(200, {
    'content-type': TYPES[extname(target)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  createReadStream(target).pipe(res);
}).listen(PORT, () => {
  console.log(`serving ${DIR}`);
  console.log(`  http://localhost:${PORT}/gallery.html`);
});
