#!/usr/bin/env node
/* Every value on every screen and card, against the tokens that declare it.

   Not "did anything move" but "is this value allowed at all" — a measurement
   that asks the first question preserves whatever was already wrong. A finding
   is a fault whether or not it has been there since the first commit.

   Outside the gate: the specimen chrome is deliberately not the system, and
   telling it apart is a judgement rather than a rule. Run it by hand. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { withPage } from './lib/browser.ts';

/* The steps, plus the hairline — a gap of one pixel is the border token doing
   the separating, which is a decision and not a stray value. Negatives are the
   same steps pulled the other way. */
/* The steps, the hairline, and every other pixel value a token declares — the
   system's rule is that no value is a literal, so a number that is a token is
   a decision and a number that is not is a stray. */
const SPACE = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 64, 76, ...tokenPixels()];
const TYPE = [58, 44, 34, 20, 19, 16, 14, 13, 12, 11, ...tokenPixels()];

function tokenPixels(): number[] {
  const dir = 'packages/frontend/src/tokens';
  const out = new Set<number>();
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.css')) continue;
    for (const m of readFileSync(join(dir, f), 'utf8').matchAll(/--[\w-]+:\s*(-?\d+(?:\.\d+)?)px/g)) {
      out.add(Math.abs(Number(m[1])));
    }
  }
  /* The optical mono ratio lands wherever the text it sits in does. */
  for (const size of [58, 44, 34, 20, 19, 16, 14, 13, 12, 11]) out.add(Math.round(size * 0.85));
  return [...out];
}

const files: string[] = [];
const walk = (d: string): void => { for (const e of readdirSync(d)) { const p = join(d, e); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } };
for (const r of ['specimens/screens', 'specimens/components', 'specimens/guidelines']) walk(r);

const probe = (scales: { space: number[]; type: number[] }) => {
  const out: { kind: string; what: string; detail: string }[] = [];
  const tag = (el: Element) => `${el.tagName.toLowerCase()}${[...el.classList].map((c) => '.' + c).join('')}`.slice(0, 70);
  const nm = (el: Element) => (el.closest('[class*="spec"]') ? 'CHROME ' : '') + tag(el);
  const near = (v: number, list: number[]) => list.some((s) => Math.abs(s - Math.abs(v)) < 0.51);
  /* `auto` is a decision the computed value hides: the browser resolves it to
     whatever the row happened to be. The typed value still says `auto`. */
  const isAuto = (el: Element, prop: string): boolean => {
    try {
      return String((el as HTMLElement & { computedStyleMap(): { get(p: string): unknown } }).computedStyleMap().get(prop)) === 'auto';
    } catch { return false; }
  };

  for (const el of document.querySelectorAll('body *')) {
    /* Inside a drawing the box model is not the page's — a `path` has no
       padding and never had. */
    if (el.closest('svg')) continue;
    /* The specimen chrome is documentation about the system, deliberately
       outside it. Counted apart so it cannot hide a fault in the product. */
    const _chrome = !!el.closest('[class*="spec"]') || [...el.classList].some((c) => c.startsWith('spec'));
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.display === 'contents') continue;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;

    if (cs.boxSizing !== 'border-box') out.push({ kind: 'content-box', what: nm(el), detail: cs.boxSizing });

    /* A block pushed away from its column by something nobody set. `auto` is a
       decision; a number here is almost always the browser's. */
    for (const [side, prop] of [['marginInlineStart', 'margin-inline-start'], ['marginInlineEnd', 'margin-inline-end']] as const) {
      const v = parseFloat(cs[side]);
      if (v && !near(v, scales.space) && !isAuto(el, prop)) out.push({ kind: 'inline-margin', what: nm(el), detail: `${side}=${cs[side]}` });
    }
    for (const [side, prop] of [['marginBlockStart', 'margin-block-start'], ['marginBlockEnd', 'margin-block-end']] as const) {
      const v = parseFloat(cs[side]);
      if (v && !near(v, scales.space) && !isAuto(el, prop)) out.push({ kind: 'off-scale-margin', what: nm(el), detail: `${side}=${cs[side]}` });
    }
    /* A page inset is `max(gutter, (100% - measure) / 2)` — it centres the
       column and lands wherever the viewport puts it, which is not a step. */
    const inset = el.matches('.sds-band, .sds-page, .sds-bar, .sds-body, .sds-foot, .sds-footer');
    for (const side of ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] as const) {
      if (inset && (side === 'paddingLeft' || side === 'paddingRight')) continue;
      /* A control's padding is measured with its border: the box lands on the
         scale and the padding gives back what the hairline took. */
      const edge = side === 'paddingTop' ? 'borderTopWidth' : side === 'paddingBottom' ? 'borderBottomWidth'
        : side === 'paddingLeft' ? 'borderLeftWidth' : 'borderRightWidth';
      const v = parseFloat(cs[side]);
      const withEdge = v + parseFloat(cs[edge] as 'borderTopWidth');
      if (v && !near(v, scales.space) && !near(withEdge, scales.space)) {
        out.push({ kind: 'off-scale-padding', what: nm(el), detail: `${side}=${cs[side]}` });
      }
    }
    for (const g of ['rowGap', 'columnGap'] as const) {
      const v = parseFloat(cs[g]);
      if (v && !near(v, scales.space)) out.push({ kind: 'off-scale-gap', what: nm(el), detail: `${g}=${cs[g]}` });
    }
    /* An optical size is written in `em` and lands anywhere; a whole pixel is
       a decision and has to be on the scale. */
    const fs = parseFloat(cs.fontSize);
    if (Number.isInteger(fs) && !near(fs, scales.type)) out.push({ kind: 'off-scale-type', what: nm(el), detail: `${cs.fontSize}` });
  }
  return out;
};

const found = new Map<string, { n: number; where: Set<string>; detail: string }>();
await withPage(async ({ map }) => {
  await map(files, async (page, file) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`file://${resolve(file)}`);
    await page.waitForTimeout(200);
    for (const f of await page.evaluate(probe, { space: SPACE, type: TYPE })) {
      const key = `${f.kind}  ${f.what}  ${f.detail}`;
      const e = found.get(key) ?? { n: 0, where: new Set<string>(), detail: f.detail };
      e.n++; e.where.add(file.split('/')[1] as string);
      found.set(key, e);
    }
  });
});

const byKind = new Map<string, number>();
for (const [k, e] of found) byKind.set(k.split('  ')[0] as string, (byKind.get(k.split('  ')[0] as string) ?? 0) + e.n);
console.log('\n=== faults by kind ===');
for (const [k, n] of [...byKind].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(6)}×  ${k}`);
console.log('\n=== distinct faults, most frequent first ===');
for (const [k, e] of [...found].sort((a, b) => b[1].n - a[1].n)) console.log(`  ${String(e.n).padStart(5)}×  ${k}`);
console.log(`\n${found.size} distinct faults across ${files.length} pages`);
