#!/usr/bin/env node
/* What a rendered page actually measures.

   The scale and the grid are read off `:root` in the page itself, so this
   holds no second copy of either and cannot drift from the tokens. Every box
   in the reading column is asked its size and the air above it; a number that
   is not a step is a number somebody typed, and that is the whole report.

   Hosts are skipped rather than measured: an element with `display: contents`
   generates no box, so the thing to measure is what it rendered. */
import { screens, type Screen } from './lib/cards.ts';
import { openCard, withPage } from './lib/browser.ts';

/** What one box reported back. */
interface Box {
  label: string;
  gap: number | null;
  size: number;
  leading: number;
  padY: number;
  padX: number;
}

interface Report {
  scale: number[];
  grid: number[];
  boxes: Box[];
  sizes: { size: number; sample: string }[];
}

const wanted = process.argv[2];
const list = screens().filter((s) => !wanted || s.rel.includes(wanted));
if (!list.length) {
  console.log(`no screen matches ${wanted ?? ''} — screens() found ${screens().length}`);
  process.exit(1);
}

const measured = await withPage(async ({ map }) =>
  map(list, async (page, screen: Screen): Promise<{ screen: Screen; report: Report }> => {
    await openCard(page, screen);
    const report: Report = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const px = (v: string): number => Math.round(parseFloat(v) * 100) / 100;
      const read = (names: string[], prefix: string): number[] =>
        names.map((n) => px(root.getPropertyValue(`${prefix}${n}`))).filter((n) => n > 0);

      const scale = read(
        ['display', 'h1', 'h2', 'h3', 'lead', 'body', 'ui', 'code', 'micro', 'label'],
        '--font-size-',
      );
      const grid = read(
        ['0-5', '1', '1-5', '2', '2-5', '3', '3-5', '4', '5', '6', '8', '10', '12', '16', '19'],
        '--space-',
      );

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
        scale,
        grid,
        boxes,
        sizes: [...seen].sort((a, b) => b[0] - a[0]).map(([size, sample]) => ({ size, sample })),
      };
    });
    return { screen, report };
  }));

/** The nearest step, for saying what a stray value was reaching for. */
const nearest = (v: number, steps: number[]): number =>
  steps.reduce((best, s) => (Math.abs(s - v) < Math.abs(best - v) ? s : best), steps[0] ?? 0);

let off = 0;
for (const { screen, report } of measured) {
  const { scale, grid, boxes, sizes } = report;
  console.log(`\n${screen.rel} — ${screen.width}×${screen.height}`);
  console.log(`  scale ${scale.join(' ')}`);
  console.log(`  grid  ${grid.join(' ')}`);

  console.log('\n  the column, top to bottom');
  for (const b of boxes) {
    const gapOff = b.gap !== null && b.gap > 0.5 && !grid.includes(b.gap);
    const sizeOff = !scale.includes(b.size);
    if (gapOff || sizeOff) off++;
    const gap = b.gap === null ? '     —' : `${b.gap}px`.padStart(6);
    const flag = gapOff ? ` ← gap is not a step (nearest ${nearest(b.gap ?? 0, grid)})` : '';
    const pad = b.padY || b.padX ? `  pad ${b.padY}/${b.padX}` : '';
    console.log(`  ${gap}  ${b.label.padEnd(30)} ${`${b.size}px`.padStart(6)}/${b.leading}${pad}${flag}`);
  }

  /* A fractional size is a relative one — the optical correction mono carries
     beside sans, which is a ratio of its context and cannot land on a step.
     A whole pixel off the scale is a number somebody typed, and only that
     fails: the distinction is the point of measuring rather than grepping. */
  console.log('\n  every size the page sets');
  for (const { size, sample } of sizes) {
    const relative = !Number.isInteger(size);
    const bad = !scale.includes(size) && !relative;
    if (bad) off++;
    const mark = bad ? 'OFF SCALE' : relative ? 'relative' : '';
    console.log(`  ${`${size}px`.padStart(7)}  ${mark.padEnd(9)}  ${sample}`);
  }
}

console.log(`\n${measured.length} screen(s), ${off} value(s) off the scale`);
process.exit(off ? 1 : 0);
