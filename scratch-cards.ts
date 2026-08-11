import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://site:4173/index.html';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

const out = await page.evaluate(() => {
  const rows: string[] = [];
  const grid = document.querySelector('.sds-grid');
  if (!grid) return ['no grid'];
  const walk = (el: Element, depth: number) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    rows.push(
      '  '.repeat(depth) +
        el.tagName.toLowerCase() +
        (typeof el.className === 'string' && el.className.trim()
          ? '.' + el.className.trim().split(/\s+/).join('.')
          : '') +
        ` | box ${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.left)},${Math.round(r.top)}` +
        ` | pad ${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}` +
        ` | mar ${cs.marginTop} ${cs.marginBottom}` +
        ` | disp ${cs.display} | color ${cs.color} | deco ${cs.textDecorationLine}` +
        ` | font ${cs.fontSize}/${cs.lineHeight}`,
    );
    for (const c of Array.from(el.children)) walk(c, depth + 1);
  };
  walk(grid, 0);
  const g = getComputedStyle(grid);
  rows.push(`grid-template-columns: ${g.gridTemplateColumns} gap ${g.gap}`);
  const parent = grid.parentElement!;
  const pr = parent.getBoundingClientRect();
  rows.push(
    `parent: ${parent.tagName.toLowerCase()}.${String(parent.className)} ${Math.round(pr.width)} wide @${Math.round(pr.left)}`,
  );
  return rows;
});
for (const r of out) console.log(r);
await browser.close();
