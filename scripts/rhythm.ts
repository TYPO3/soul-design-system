#!/usr/bin/env node
/* What a rendered page actually measures.

   The steps come out of the token files themselves, so this holds no second
   copy of the scale and cannot drift from it. Every box in the reading column
   is then asked its size and the air above it; a number that is not a step is
   a number somebody typed, and that is the whole report.

   Hosts are skipped rather than measured: an element with `display: contents`
   generates no box, so the thing to measure is what it rendered. */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { screens, type Screen } from './lib/cards.ts';
import { openCard, withPage } from './lib/browser.ts';
import * as report from './lib/report.ts';

const TOKENS = 'packages/frontend/src/tokens';

/** Every step a token file declares under a prefix. Read rather than listed:
    a name written into this file would be the second copy of the scale, and
    the one that goes stale the next time a step is renamed. */
function steps(prefix: string): number[] {
  const found = new Set<number>();
  for (const file of readdirSync(TOKENS).filter((f) => f.endsWith('.css'))) {
    const text = readFileSync(join(TOKENS, file), 'utf8');
    for (const m of text.matchAll(new RegExp(`--${prefix}-[a-z0-9-]+:\\s*([\\d.]+)px`, 'g'))) {
      found.add(Number(m[1]));
    }
  }
  return [...found].sort((a, b) => a - b);
}

/** The ratio a mono run is set at, read where it is declared for the reason
    the steps are. A step times this ratio is the optical correction and not a
    number somebody typed — it only reads as typed on the steps where it
    happens to land whole. */
function ratio(name: string): number {
  for (const file of readdirSync(TOKENS).filter((f) => f.endsWith('.css'))) {
    const m = readFileSync(join(TOKENS, file), 'utf8').match(new RegExp(`--${name}:\\s*([\\d.]+)em`));
    if (m) return Number(m[1]);
  }
  throw new Error(`--${name} is declared in no token file`);
}

/** What one box reported back. */
interface Box {
  label: string;
  gap: number | null;
  size: number;
  leading: number;
  padY: number;
  padX: number;
}

/** What the page answers with — the steps are added here, not there. */
interface Measured {
  boxes: Box[];
  sizes: { size: number; sample: string }[];
}

interface Report extends Measured {
  scale: number[];
  grid: number[];
}

const SCALE = steps('font-size');
const GRID = steps('space');
const OPTICAL = new Set(SCALE.map((s) => Math.round(s * ratio('font-mono-optical') * 100) / 100));

const wanted = process.argv[2];
const list = screens().filter((s) => !wanted || s.rel.includes(wanted));
report.open('rhythm', 'every screen sets sizes on the scale and gaps on the grid');
if (!list.length) {
  report.summary(`no screen matches ${wanted ?? ''}`, [`screens() found ${screens().length}, none of them named`]);
  process.exit(1);
}

const measured = await withPage(async ({ map }) =>
  map(list, async (page, screen: Screen): Promise<{ screen: Screen; report: Report }> => {
    await openCard(page, screen);
    const report: Measured = await page.evaluate(() => {
      const px = (v: string): number => Math.round(parseFloat(v) * 100) / 100;

      /* A host renders its children and takes no box of its own, so the
         column's real children are one level down from some of them. */
      const boxed = (el: Element): Element[] => {
        const s = getComputedStyle(el);
        if (s.display === 'contents') return [...el.children].flatMap(boxed);
        return [el];
      };

      const name = (el: Element): string => {
        const cls = [...el.classList].find((c) => c.startsWith('sds-')) ?? '';
        const host = el.parentElement?.tagName.toLowerCase() ?? '';
        const tag = host.startsWith('sds-') ? host : el.tagName.toLowerCase();
        return cls ? `${tag}.${cls}` : tag;
      };

      const column =
        document.querySelector('.sds-column') ??
        document.querySelector('main .sds-stack') ??
        document.querySelector('main');
      const boxes: Box[] = [];
      let prevBottom: number | null = null;
      for (const el of [...(column?.children ?? [])].flatMap(boxed)) {
        const r = el.getBoundingClientRect();
        if (r.height === 0) continue;
        const s = getComputedStyle(el);
        boxes.push({
          label: name(el),
          gap: prevBottom === null ? null : Math.round((r.top - prevBottom) * 100) / 100,
          size: px(s.fontSize),
          leading: px(s.lineHeight),
          padY: px(s.paddingTop),
          padX: px(s.paddingLeft),
        });
        prevBottom = r.bottom;
      }

      /* Every size the page actually sets, with one thing set in it — a size
         off the scale is easier to place when the words are there. */
      const seen = new Map<number, string>();
      for (const el of document.body.querySelectorAll('*')) {
        const text = [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent ?? '')
          .join('')
          .trim();
        if (!text) continue;
        /* A drawing carries its own scale and `SKILL.md` pins it — 36 down to
           a 13px floor. It is reported apart rather than measured against the
           page's, which it was never set to. */
        if (el.closest('svg')) continue;
        const size = px(getComputedStyle(el).fontSize);
        if (!seen.has(size)) seen.set(size, text.replace(/\s+/g, ' ').slice(0, 34));
      }

      return {
        boxes,
        sizes: [...seen].sort((a, b) => b[0] - a[0]).map(([size, sample]) => ({ size, sample })),
      };
    });
    return { screen, report: { ...report, scale: SCALE, grid: GRID } };
  }));

/** The nearest step, for saying what a stray value was reaching for. */
const nearest = (v: number, steps: number[]): number =>
  steps.reduce((best, s) => (Math.abs(s - v) < Math.abs(best - v) ? s : best), steps[0] ?? 0);

/* The tables are the report `make rhythm` is for; under the gate only what
   failed is worth a line, and the gate is what prints it. */
const problems: string[] = [];
for (const { screen, report: measure } of measured) {
  const { scale, grid, boxes, sizes } = measure;
  if (!report.REPORTING) {
    console.log();
    report.fact(`${screen.rel} — ${screen.width}×${screen.height}`);
    report.fact('  scale', scale.join(' '));
    report.fact('  grid', grid.join(' '));
    console.log();
    report.fact('  the column, top to bottom');
  }

  for (const b of boxes) {
    const gapOff = b.gap !== null && b.gap > 0.5 && !grid.includes(b.gap);
    const sizeOff = !scale.includes(b.size);
    if (gapOff) problems.push(`${screen.rel}: ${b.label} sits ${b.gap}px below its neighbour — not a step (nearest ${nearest(b.gap ?? 0, grid)})`);
    if (sizeOff) problems.push(`${screen.rel}: ${b.label} is set at ${b.size}px — not a step (nearest ${nearest(b.size, scale)})`);
    if (report.REPORTING) continue;
    const gap = b.gap === null ? '     —' : `${b.gap}px`.padStart(6);
    const flag = gapOff ? ` ← gap is not a step (nearest ${nearest(b.gap ?? 0, grid)})` : '';
    const pad = b.padY || b.padX ? `  pad ${b.padY}/${b.padX}` : '';
    console.log(`    ${gap}  ${b.label.padEnd(30)} ${`${b.size}px`.padStart(6)}/${b.leading}${pad}${flag}`);
  }

  /* A relative size is the optical correction mono carries beside sans: a
     ratio of its context, so either it lands off the steps entirely or it is a
     step times that one ratio. A whole pixel that is neither is a number
     somebody typed, and only that fails — the distinction is the point of
     measuring rather than grepping. */
  if (!report.REPORTING) {
    console.log();
    report.fact('  every size the page sets');
  }
  for (const { size, sample } of sizes) {
    const relative = !Number.isInteger(size) || OPTICAL.has(size);
    const off = !scale.includes(size) && !relative;
    if (off) problems.push(`${screen.rel}: ${size}px is off the scale — "${sample}"`);
    if (report.REPORTING) continue;
    console.log(`    ${`${size}px`.padStart(7)}  ${(off ? 'OFF SCALE' : relative ? 'relative' : '').padEnd(9)}  ${sample}`);
  }
}

report.summary(`${measured.length} screens · ${problems.length} off the scale`, problems, { shown: false });
process.exit(problems.length ? 1 : 0);
