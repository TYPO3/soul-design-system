#!/usr/bin/env node
/* Every value on every screen and card, against the tokens that declare it.

   Not "did anything move" but "is this value allowed at all" — a measurement
   that asks the first question preserves whatever was already wrong. A finding
   is a fault whether or not it has been there since the first commit.

   Outside the gate: the specimen chrome is deliberately not the system, and
   telling it apart is a judgement rather than a rule. Run it by hand. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { openCard, withPage } from './lib/browser.ts';
import * as report from './lib/report.ts';

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
  const out: { kind: string; what: string; detail: string; who: string; chrome: boolean }[] = [];
  const tag = (el: Element) => `${el.tagName.toLowerCase()}${[...el.classList].map((c) => '.' + c).join('')}`.slice(0, 70);
  /* Which component a fault belongs to: the `sds-` name on the element, or the
     nearest one above it. A fault with no component over it belongs to the
     page, which is what `page` says. */
  const owner = (el: Element): string => {
    for (let at: Element | null = el; at; at = at.parentElement) {
      const own = [...at.classList].find((c) => c.startsWith('sds-'));
      if (own) return own.split('__')[0]!.split('--')[0]!;
    }
    return 'page';
  };
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
    const chrome = !!el.closest('[class*="spec"]') || [...el.classList].some((c) => c.startsWith('spec'));
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.display === 'contents') continue;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;

    if (cs.boxSizing !== 'border-box') out.push({ kind: 'content-box', what: tag(el), detail: cs.boxSizing, who: owner(el), chrome });

    /* A block pushed away from its column by something nobody set. `auto` is a
       decision; a number here is almost always the browser's. */
    for (const [side, prop] of [['marginInlineStart', 'margin-inline-start'], ['marginInlineEnd', 'margin-inline-end']] as const) {
      const v = parseFloat(cs[side]);
      if (v && !near(v, scales.space) && !isAuto(el, prop)) out.push({ kind: 'inline-margin', what: tag(el), detail: `${side}=${cs[side]}`, who: owner(el), chrome });
    }
    for (const [side, prop] of [['marginBlockStart', 'margin-block-start'], ['marginBlockEnd', 'margin-block-end']] as const) {
      const v = parseFloat(cs[side]);
      if (v && !near(v, scales.space) && !isAuto(el, prop)) out.push({ kind: 'off-scale-margin', what: tag(el), detail: `${side}=${cs[side]}`, who: owner(el), chrome });
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
        out.push({ kind: 'off-scale-padding', what: tag(el), detail: `${side}=${cs[side]}`, who: owner(el), chrome });
      }
    }
    /* Where two components were composed into something new. A block carries
       the step it owes a page it stands in; put inside a box that already
       spaces or already ends, that step is a distance nobody chose. Both are
       measured rather than listed, because a seam is made by whoever composes
       and cannot be known in advance. */
    const parent = el.parentElement;
    if (parent) {
      const ps = getComputedStyle(parent);
      const mine = [parseFloat(cs.marginBlockStart), parseFloat(cs.marginBlockEnd)];
      /* Only where the parent stacks: a row's `gap` sets both axes, and a
         margin on the cross axis of a row is centring rather than distance. */
      const stacks = ps.display.includes('grid')
        || (ps.display.includes('flex') && ps.flexDirection.startsWith('column'));
      if (stacks && parseFloat(ps.rowGap) > 0 && mine.some((v) => v > 0)) {
        out.push({ kind: 'gap-and-margin', what: tag(el), detail: `in ${tag(parent)}`, who: owner(el), chrome });
      }
      /* The last thing in a box, with a margin under it and nothing under that:
         the box is taller by exactly the margin and no distance was set. */
      const kids = [...parent.children].filter((k) => {
        const s = getComputedStyle(k);
        return s.display !== 'none' && s.position !== 'absolute' && s.position !== 'fixed';
      });
      const below = parseFloat(cs.marginBlockEnd);
      if (below > 0 && kids[kids.length - 1] === el && !parseFloat(ps.paddingBottom)) {
        out.push({ kind: 'dead-air', what: tag(el), detail: `${below}px under the last thing in ${tag(parent)}`, who: owner(el), chrome });
      }
    }

    for (const g of ['rowGap', 'columnGap'] as const) {
      const v = parseFloat(cs[g]);
      if (v && !near(v, scales.space)) out.push({ kind: 'off-scale-gap', what: tag(el), detail: `${g}=${cs[g]}`, who: owner(el), chrome });
    }
    /* An optical size is written in `em` and lands anywhere; a whole pixel is
       a decision and has to be on the scale. */
    const fs = parseFloat(cs.fontSize);
    if (Number.isInteger(fs) && !near(fs, scales.type)) out.push({ kind: 'off-scale-type', what: tag(el), detail: `${cs.fontSize}`, who: owner(el), chrome });
  }
  return out;
};

type Fault = { kind: string; what: string; detail: string; who: string; chrome: boolean };

const found = new Map<string, { fault: Fault; n: number }>();
report.open('audit', 'every value on every screen and card, against the tokens that declare it');
await withPage(async ({ map }) => {
  await map(files, async (page, file) => {
    /* Through `openCard`, which is what guarantees the page is set in the
       faces it ships: an `em` padding and a `1lh` margin are measured against
       the type, so a fallback face is a wrong number here and not only a wrong
       picture. */
    await openCard(page, { path: resolve(file), width: 1440, height: 900 });
    /* A card is documentation about the system. What it draws with the
       system's own names is the system and is audited; a box it lays out for
       itself is annotation, whether or not it reached for a `spec-` class. A
       screen is product-shaped, so nothing on one is exempt. */
    const card = !file.startsWith('specimens/screens');
    for (const f of (await page.evaluate(probe, { space: SPACE, type: TYPE })) as Fault[]) {
      if (card && f.who === 'page') f.chrome = true;
      const key = `${f.who}\u0000${f.kind}\u0000${f.what}\u0000${f.detail}`;
      const seen = found.get(key) ?? { fault: f, n: 0 };
      seen.n++;
      found.set(key, seen);
    }
  });
});

const system = [...found.values()].filter((f) => !f.fault.chrome);
const chrome = [...found.values()].filter((f) => f.fault.chrome);

/* One row per component, so this is walked the way the components are: the
   card, then the note, then the rail. The chrome is counted apart — the
   specimen layer is documentation about the system rather than the system. */
const byComponent = new Map<string, typeof system>();
for (const f of system) {
  byComponent.set(f.fault.who, [...(byComponent.get(f.fault.who) ?? []), f]);
}

for (const who of [...byComponent.keys()].sort()) {
  const rows = byComponent.get(who) as typeof system;
  const total = rows.reduce((n, r) => n + r.n, 0);
  report.row('bad', who, rows.length === 1 ? '1 value off the scale' : `${rows.length} values off the scale`, `${total} seen`);
  for (const r of rows.sort((a, b) => b.n - a.n)) {
    report.detail(`${r.fault.kind}  ${r.fault.what}  ${r.fault.detail}`);
  }
}

if (!byComponent.size) report.row('ok', 'components', 'every value is one a token declares');
report.fact('chrome', `${chrome.length} distinct in the specimen layer, counted apart`);
report.close(byComponent.size ? 'bad' : 'ok',
  byComponent.size
    ? `${byComponent.size} component(s) carry a value no token declares`
    : `${files.length} pages · every value is one a token declares`);
