#!/usr/bin/env node
/* Generate gallery.html — every card and screen on one page, for development.

   Each one is iframed at the exact viewport its marker declares, so what you
   see here is what the Design System pane will show. Because those numbers
   are baked in at generation time, the page goes stale the moment a card
   changes — so the dev server rebuilds it per request rather than leaving
   you to remember. Run directly, it just writes the file.

     npm run dev   # then open http://localhost:4173/gallery.html
*/
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { byGroup, cards, ROOT, screens } from './lib/cards.mjs';

export function buildGallery() {
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const list = [...screens().map((s) => ({ ...s, group: s.section, label: s.name })), ...cards()];
const groups = byGroup(list);

const nav = [...groups].map(([g, v]) =>
  `<a href="#${esc(g)}">${esc(g)} <span>${v.length}</span></a>`).join('\n');

const sections = [...groups].map(([g, items]) => {
  const figs = items.map((c) => `    <figure>
      <figcaption>
        <b>${esc(c.label)}</b>
        <span>${esc(c.subtitle)}</span>
        <code>${c.width}&times;${c.height} &middot; ${esc(c.rel)}</code>
      </figcaption>
      <iframe src="${esc(c.rel)}" width="${c.width}" height="${c.height}"
              loading="lazy" title="${esc(c.label)}"
              data-pins="${c.theme}"></iframe>
    </figure>`).join('\n');
  return `  <section id="${esc(g)}">\n    <h2>${esc(g)} <span>${items.length} cards</span></h2>\n${figs}\n  </section>`;
}).join('\n');

writeFileSync(join(ROOT, 'gallery.html'), `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TYPO3 Support App — design system</title>
<link rel="stylesheet" href="styles.css" />
<style>
  body { margin: 0; font-family: var(--font-sans); background: var(--surface-sunken);
         color: var(--text-primary); display: grid; grid-template-columns: 210px 1fr; }
  nav { position: sticky; top: 0; align-self: start; height: 100vh; overflow: auto;
        padding: 24px 0 24px 24px; border-right: 1px solid var(--border-subtle); }
  nav h1 { font-size: 15px; margin: 0 0 4px; }
  nav p { font-size: 12px; color: var(--text-muted); margin: 0 0 20px; }
  nav a { display: flex; justify-content: space-between; padding: 5px 12px 5px 0;
          font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary);
          text-decoration: none; }
  nav a:hover { color: var(--accent); }
  nav a span { color: var(--text-muted); }
  main { padding: 24px 32px 96px; min-width: 0; }
  h2 { font-size: 20px; margin: 40px 0 4px; display: flex; align-items: baseline; gap: 10px; }
  h2:first-child { margin-top: 0; }
  h2 span { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
            letter-spacing: 0.09em; text-transform: uppercase; }
  figure { margin: 20px 0 0; }
  figcaption { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; padding-bottom: 7px; }
  figcaption b { font-size: 14px; }
  figcaption span { font-size: 12px; color: var(--text-secondary); }
  figcaption code { margin-left: auto; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
  iframe { border: 1px solid var(--border-subtle); border-radius: var(--radius-card);
           background: var(--surface-canvas); max-width: 100%; display: block; }
  .warn { border: 1px solid var(--border-accent-quiet); background: var(--surface-accent-quiet);
          border-radius: var(--radius-card); padding: 13px 15px; margin-bottom: 24px;
          font-size: 13px; line-height: 1.5; color: var(--text-primary); }
  .warn code { font-family: var(--font-mono); font-size: 12px; color: var(--text-accent-quiet); }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  button { font-family: var(--font-mono); font-size: 11px; margin-bottom: 18px;
           background: transparent; color: var(--text-secondary);
           border: 1px solid var(--border-strong); border-radius: var(--radius-control);
           padding: 5px 10px; cursor: pointer; }
</style>
</head>
<body>
<nav>
  <h1>TYPO3 Support App</h1>
  <p>${list.length} specimen cards</p>
  <button id="t">toggle theme</button>
${nav}
</nav>
<main>
${sections}
</main>
<script>
  /* Each card pins its own data-theme, so the toggle has to reach inside the
     iframe — and keep doing it. The frames are lazy, so one scrolled into
     view after a toggle arrives with its own pinned theme and would stay on
     it; applying on every load is what fixes that.

     Two cards pin light because showing the light surface IS their subject.
     Flipping those to dark would destroy the specimen, so anything that pins
     something other than the default is left alone. Cards that show a
     light/dark pair do it on inner subtrees, which the root theme never
     touches. */
  let current = document.documentElement.dataset.theme;
  const frames = [...document.querySelectorAll('iframe')];

  /* Opened from disk, every iframe is a different origin and its
     contentDocument is simply null — it does not throw, so a try/catch
     around it catches nothing and the toggle fails silently. There is no way
     to reach into them from a file:// page, so say so at load rather than
     after a click that does nothing. */
  const offline = location.protocol === 'file:';
  if (offline) {
    const b = document.createElement('div');
    b.className = 'warn';
    b.innerHTML = '<b>Opened from disk.</b> Every preview is then a separate origin, so the ' +
      'theme toggle cannot reach into them — no script can. Run <code>npm run dev</code> and ' +
      'open <code>http://localhost:4173/gallery.html</code> instead. That works from Windows ' +
      'too: WSL forwards localhost.';
    document.querySelector('main').prepend(b);
    document.getElementById('t').disabled = true;
  }

  function apply(frame) {
    // A specimen that pins a mode IS about that mode; leave it alone.
    if (frame.dataset.pins && frame.dataset.pins !== 'dark') return;
    const doc = frame.contentDocument;
    if (doc && doc.documentElement) doc.documentElement.dataset.theme = current;
  }

  // Frames are lazy: one scrolled into view after a toggle arrives with its
  // own pinned theme, so re-apply on every load, not just on click.
  for (const f of frames) f.addEventListener('load', () => apply(f));

  document.getElementById('t').onclick = () => {
    current = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = current;
    for (const f of frames) apply(f);
  };
</script>
</body>
</html>
`);
return { count: list.length, groups: groups.size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const r = buildGallery();
  console.log(`gallery.html — ${r.count} cards and screens in ${r.groups} groups`);
}
