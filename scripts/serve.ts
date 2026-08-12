#!/usr/bin/env node
/* A static file server for local development — no dependency, no config.

     npm run serve   # serves what is already there

   Serves the repo root so the cards resolve ../styles.css and ../assets/…
   exactly as they will once uploaded. Pass a port as the first argument. */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
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

const handler = (req: IncomingMessage, res: ServerResponse): void => {
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
};

const server = createServer(handler).listen(PORT, () => {
  console.log(`serving ${DIR}`);
  console.log(`  http://localhost:${PORT}/`);
});

/* Shut down when told to. Node's default on SIGTERM ends the process and leaves
   whatever was mid-flight to the kernel, which is good enough until a request
   is still streaming a font. `closeAllConnections` is the part that matters:
   without it a keep-alive socket holds the server open, `close()` never
   resolves, and the runner waits out its grace period and kills it. */
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.closeAllConnections();
    server.close(() => process.exit(0));
  });
}

/* And go when whoever started this is gone. A signal covers a run that ends,
   not one that is *killed*, which leaves this bound to the port: the next run
   finds a server answering, reuses it, and is served a stale build. Orphaned
   means re-parented to PID 1, which the container runs, so this is a reliable
   signal rather than a guess. The timer is unref'd. */
const parent = process.ppid;
setInterval(() => {
  if (process.ppid === parent) return;
  server.closeAllConnections();
  server.close(() => process.exit(0));
}, 2_000).unref();
