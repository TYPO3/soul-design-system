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

/* Shut down when told to.

   The Playwright runner starts this as its `webServer` and sends SIGTERM when
   the suite is over. Node's default is to exit on that, which ends the process
   and leaves whatever was mid-flight to the kernel — good enough until a
   request is still streaming a font, and then the run's last output is a
   broken pipe from a server that was already going away.

   `closeAllConnections` is the part that matters: without it a keep-alive
   socket holds the server open, `close()` never resolves, and the runner waits
   out its grace period and kills it. */
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.closeAllConnections();
    server.close(() => process.exit(0));
  });
}
