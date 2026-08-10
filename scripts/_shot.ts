import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const out = process.argv[2] ?? 'before';
const pages = [
  ['index', '/site/html/index.html'],
  ['driving-a-session', '/site/html/driving-a-session.html'],
  ['judging', '/site/html/feedback/judging.html'],
];
mkdirSync(`/app/.design-sync/.cache/docs-${out}`, { recursive: true });
const b = await chromium.launch();
for (const theme of ['dark', 'light'] as const) {
  for (const [name, path] of pages) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 1200 }, colorScheme: theme, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto(`file://${path}`, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `/app/.design-sync/.cache/docs-${out}/${name}-${theme}.png`, fullPage: true });
    await ctx.close();
  }
}
await b.close();
console.log(`${out}: ${pages.length * 2} Aufnahmen`);
