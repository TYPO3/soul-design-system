#!/usr/bin/env node
/* A static file server for local development — no dependency, no config.

     npm run serve   # serves what is already there

   Serves the repo root so the cards resolve ../styles.css and ../assets/…
   exactly as they will once uploaded. Pass a port as the first argument. */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

import { ROOT } from './lib/cards.ts';

const PORT = Number(process.argv[2] ?? 4173);
const DIR = resolve(process.argv[3] ?? ROOT);

const TYPES: Record<string, string> = {
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
  const url = decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/');
  // normalize + prefix check: a request for ../../etc/passwd must not escape DIR
  const path = resolve(join(DIR, normalize(url)));
  if (!path.startsWith(DIR)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  let target = path;

  /* A directory serves its `index.html`. */
  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');

  try {
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
  console.log(`  http://localhost:${PORT}/`);
});
