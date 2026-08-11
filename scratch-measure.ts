import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://site:4173/index.html';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

const bar = await page.evaluate(() => {
  const bar = document.querySelector('.sds-bar');
  if (!bar) return [];
  const out: { what: string; h: number; top: number }[] = [];
  const walk = (el: Element, depth: number) => {
    const r = el.getBoundingClientRect();
    if (r.height > 0)
      out.push({
        what:
          '  '.repeat(depth) +
          el.tagName.toLowerCase() +
          (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
        h: Math.round(r.height * 100) / 100,
        top: Math.round(r.top * 100) / 100,
      });
    if (depth < 3) for (const c of Array.from(el.children)) walk(c, depth + 1);
  };
  walk(bar, 0);
  return out;
});
console.log('--- bar ---');
for (const r of bar) console.log(String(r.h).padStart(7), String(r.top).padStart(7), ' ', r.what);

const probe = await page.evaluate(() => {
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;top:200px;left:0;display:flex;gap:8px;align-items:center';
  host.innerHTML = `
    <button class="sds-btn sds-btn--primary">Button</button>
    <button class="sds-btn sds-btn--secondary sds-btn--sm">Small</button>
    <button class="sds-btn sds-btn--secondary sds-btn--icon"><span class="sds-icon"></span></button>
    <span class="sds-field"><input class="sds-input" placeholder="field"></span>
    <span class="sds-badge">badge</span>
    <button class="sds-menu__toggle"><span class="sds-icon"></span></button>
    <div class="sds-modes"><button class="sds-mode">light</button><button class="sds-mode is-active">dark</button></div>
  `;
  document.body.append(host);
  const out: { what: string; h: number }[] = [];
  for (const el of Array.from(host.children)) {
    const r = el.getBoundingClientRect();
    out.push({
      what: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : ''),
      h: Math.round(r.height * 100) / 100,
    });
  }
  host.remove();
  return out;
});
console.log('--- controls ---');
for (const r of probe) console.log(String(r.h).padStart(7), ' ', r.what);

await browser.close();
