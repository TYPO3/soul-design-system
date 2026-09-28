/* sds-slide — a figure, and the frame around it that never moves.

   A reader goes through a deck one slide after the next. So the head and
   the foot of every layout stand where a content slide has them, to the
   pixel. The drawing takes the room the layout leaves, whole, and the room
   is the one `slides.rst` states. A writer draws for that number. */

import { expect, test } from 'vitest';
import doc from '../docs/design-system/slides.rst?raw';
import * as cards from '../stories/slides/Cards.stories.ts';
import * as speaker from '../stories/slides/Speaker.stories.ts';
import * as speakers from '../stories/slides/Speakers.stories.ts';
import * as section from '../stories/slides/Section.stories.ts';
import * as statement from '../stories/slides/Statement.stories.ts';
import * as flow from '../stories/slides/Flow.stories.ts';
import * as code from '../stories/slides/Code.stories.ts';
import * as table from '../stories/slides/Table.stories.ts';
import * as numbers from '../stories/slides/Numbers.stories.ts';
import * as quote from '../stories/slides/Quote.stories.ts';
import * as figure from '../stories/slides/Figure.stories.ts';
import * as full from '../stories/slides/FigureFull.stories.ts';
import * as pair from '../stories/slides/FigurePair.stories.ts';
import * as row from '../stories/slides/FigureRow.stories.ts';
import * as text from '../stories/slides/FigureText.stories.ts';
import * as bleed from '../stories/slides/FigureBleed.stories.ts';
import { frames, mount, q, qa, sleep, stories, write } from './lib/frame.ts';

const LAYOUTS = {
  wide: stories(figure).Page,
  full: stories(full).Page,
  'row × 2': stories(pair).Page,
  'row × 3': stories(row).Page,
  'text-start': stories(text).Page,
  bleed: stories(bleed).Page,
};

/* A picture loads after the render, and a slide lays out again when it has. */
const rest = async (): Promise<void> => {
  await sleep(100);
  await Promise.all(qa<HTMLImageElement>('.sds-slide img').map((img) => img.decode().catch(() => undefined)));
  await frames();
};

/** A box in the frame's own units: 960 × 540, whatever size it draws at. */
function inFrame(el: Element): { x: number; y: number; w: number; h: number } {
  const frame = q('.sds-slide').getBoundingClientRect();
  const unit = frame.width / 960;
  const box = el.getBoundingClientRect();
  const round = (n: number): number => Math.round(n / unit);
  return { x: round(box.left - frame.left), y: round(box.top - frame.top), w: round(box.width), h: round(box.height) };
}

async function measure(story: (typeof LAYOUTS)[keyof typeof LAYOUTS]) {
  await mount(story);
  await rest();
  return {
    lockup: inFrame(q('.sds-slide__foot .sds-lockup')),
    count: inFrame(q('.sds-slide__count')),
    eyebrow: inFrame(q('.sds-slide__head sds-eyebrow')),
    rooms: qa('.sds-slide__drawing sds-image').map((one) => inFrame(one)),
  };
}

/** The rooms the page states, by layout: `wide` → [w, h], and a row by how
    many stand in it: `row × 3`. */
function stated(): Record<string, [number, number]> {
  const rows = [...doc.matchAll(/^\s+\*\s+-\s+``([a-z-]+)``( × \d)?[\s\S]*?\n\s+-\s+(\d+) × (\d+)/gm)];
  return Object.fromEntries(rows.map(([, name, many, w, h]) => [`${name}${many ?? ''}`, [Number(w), Number(h)]]));
}

/** Every layout with a foot. A cover and a closing end on the lockup
    alone, one step up, and stand outside this. */
const COUNTED = {
  speaker: stories(speaker).Page,
  speakers: stories(speakers).Page,
  section: stories(section).Page,
  statement: stories(statement).Page,
  flow: stories(flow).Page,
  code: stories(code).Page,
  table: stories(table).Page,
  numbers: stories(numbers).Page,
  quote: stories(quote).Page,
  ...LAYOUTS,
};

test('the lockup and the count stand where a content slide has them, on every slide', async () => {
  await mount(stories(cards).Page);
  await rest();
  const lockup = inFrame(q('.sds-slide__foot .sds-lockup'));
  const count = inFrame(q('.sds-slide__count'));
  for (const [name, story] of Object.entries(COUNTED)) {
    await mount(story);
    await rest();
    expect.soft(inFrame(q('.sds-slide__foot .sds-lockup')), `${name}: the lockup`).toEqual(lockup);
    /* A slide that says no count has none, and nothing stands in its place. */
    const own = qa('.sds-slide__count')[0];
    if (own) expect.soft(inFrame(own), `${name}: the count`).toEqual(count);
  }
});

test('the head stands at the margin a content slide keeps', async () => {
  const at = await measure(LAYOUTS.wide);
  for (const name of ['row × 3', 'text-start'] as const) {
    const seen = await measure(LAYOUTS[name]);
    expect({ x: seen.eyebrow.x, y: seen.eyebrow.y }, `${name}: the eyebrow`).toEqual({ x: at.eyebrow.x, y: at.eyebrow.y });
  }
});

test('the drawing takes its room whole, as a picture does', async () => {
  for (const [name, story] of Object.entries(LAYOUTS)) {
    await mount(story);
    await rest();
    for (const image of qa('.sds-slide__drawing sds-image')) {
      const picture = image.querySelector('img') as HTMLImageElement;
      /* Whole in its room, and to the edges where it bleeds. */
      expect(getComputedStyle(picture).objectFit).toBe(name === 'bleed' ? 'cover' : 'contain');
      expect(inFrame(picture), `${name}: the picture fills its room`).toEqual(inFrame(image));
    }
  }
});

test('a row shows every drawing under its word, and a single layout one', async () => {
  await mount(LAYOUTS['row × 2']);
  expect(qa('.sds-slide__drawing')).toHaveLength(2);
  expect(qa('.sds-slide__drawing > .sds-label').map((label) => label.textContent)).toEqual(['Status', 'Source']);
  await mount(LAYOUTS.wide);
  expect(qa('.sds-slide__drawing')).toHaveLength(1);
});

test('a framed row stands each drawing on a plane, with its caption inside', async () => {
  await mount(LAYOUTS['row × 3']);
  await rest();
  const drawings = qa('.sds-slide__drawing');
  expect(drawings).toHaveLength(3);
  for (const one of drawings) {
    expect(getComputedStyle(one).borderTopStyle).toBe('solid');
    const caption = q('.sds-slide__caption', one);
    const plane = inFrame(one);
    const text = inFrame(caption);
    expect(text.y + text.h, 'the caption stands inside the plane').toBeLessThanOrEqual(plane.y + plane.h);
  }
  /* Planes and pictures of one row stand one height, whatever their
     captions say. */
  expect(new Set(drawings.map((one) => inFrame(one).h)).size).toBe(1);
  expect(new Set(qa('.sds-slide__drawing sds-image').map((one) => inFrame(one).h)).size).toBe(1);
});

test('beside the text, the drawing stands on the side the layout leaves it', async () => {
  await mount(LAYOUTS['text-start']);
  await rest();
  expect(inFrame(q('.sds-slide__figure')).x).toBeGreaterThan(inFrame(q('.sds-slide__text')).x);
  await mount(LAYOUTS.bleed);
  await rest();
  const figureBox = inFrame(q('.sds-slide__figure'));
  expect(figureBox.x, 'the text first').toBeGreaterThan(inFrame(q('.sds-slide__text')).x);
  /* The edge is inside the frame's hairline. */
  expect(figureBox.y, 'a bleed runs to the top').toBeLessThanOrEqual(1);
  expect(figureBox.x + figureBox.w, 'and to the side').toBeGreaterThanOrEqual(959);
  expect(getComputedStyle(q('.sds-slide__drawing img')).objectFit, 'a bleed fills its column').toBe('cover');
});

test('every room is the one slides.rst states', async () => {
  const rooms = stated();
  expect(Object.keys(rooms).sort()).toEqual(Object.keys(LAYOUTS).sort());
  for (const [name, story] of Object.entries(LAYOUTS)) {
    const { rooms: seen } = await measure(story);
    const [w, h] = rooms[name] as [number, number];
    /* The stage scales the frame, so a measure rounds a pixel either way. */
    for (const room of seen) {
      expect.soft(Math.abs(room.w - w), `${name}: the room's width, ${room.w}`).toBeLessThanOrEqual(2);
      expect.soft(Math.abs(room.h - h), `${name}: the room's height, ${room.h}`).toBeLessThanOrEqual(2);
    }
  }
});

test('a plain slide leaves the lockup out, and the count stays where it was', async () => {
  await mount(stories(cards).Page);
  await rest();
  const count = inFrame(q('.sds-slide__count'));
  q('sds-slide').setAttribute('plain', '');
  await rest();
  expect(qa('.sds-slide__foot .sds-lockup').filter((mark) => getComputedStyle(mark).visibility === 'visible')).toHaveLength(0);
  expect(inFrame(q('.sds-slide__count'))).toEqual(count);
});

test('a full figure shows the drawing and the count, and keeps its head for the ear', async () => {
  await mount(LAYOUTS.full);
  await rest();
  const room = inFrame(q('.sds-slide__figure'));
  expect(room.w, 'the drawing takes the width').toBeGreaterThanOrEqual(920);
  expect(room.h, 'and the height').toBeGreaterThanOrEqual(500);
  expect(q('.sds-slide__head h2').textContent).toBe('A page of the manual');
  expect(inFrame(q('.sds-slide__head')).w, 'nobody sees the head').toBeLessThanOrEqual(1);
  expect(getComputedStyle(q('.sds-slide__foot .sds-lockup')).visibility).toBe('hidden');
  expect(getComputedStyle(q('.sds-slide__count')).borderTopStyle).toBe('solid');
});

test('a row takes each figure between the tags as a drawing, with its word and its caption', async () => {
  await write(`<sds-slide kind="figure" layout="row" heading="Regions">
    <figure slot="figure" data-label="One"><svg viewBox="0 0 100 50"><rect width="100" height="50"></rect></svg><figcaption>The first</figcaption></figure>
    <figure slot="figure" data-label="Two"><svg viewBox="0 0 100 50"><rect width="100" height="50"></rect></svg><figcaption>The second</figcaption></figure>
  </sds-slide>`);
  await rest();
  const drawings = qa('.sds-slide__drawing');
  expect(drawings).toHaveLength(2);
  expect(drawings.map((one) => q('.sds-label', one).textContent)).toEqual(['One', 'Two']);
  expect(drawings.map((one) => q('.sds-slide__caption', one).textContent)).toEqual(['The first', 'The second']);
  const drawn = q('.sds-slide__drawing svg');
  expect(drawn.getAttribute('preserveAspectRatio')).toBe('xMidYMid meet');
  expect(inFrame(drawn), 'the drawing fills its room').toEqual(inFrame(q('.sds-slide__art')));
  document.body.replaceChildren();
});

test('beside the text, the text region and the figure region each take their place', async () => {
  await write(`<sds-slide kind="figure" layout="text-start" heading="Regions">
    <svg slot="figure" viewBox="0 0 100 100"><rect width="100" height="100"></rect></svg>
    <p slot="text">Text in its region.</p>
    <p>Text without a name.</p>
  </sds-slide>`);
  await rest();
  expect(qa('.sds-slide__text p').map((p) => p.textContent)).toEqual(['Text in its region.', 'Text without a name.']);
  expect(q('.sds-slide__figure svg').getAttribute('preserveAspectRatio')).toBe('xMinYMin meet');
  document.body.replaceChildren();
});

test('markup in the figure region shrinks until it fits, and a speaker takes its portrait region', async () => {
  await write(`<sds-slide kind="figure" heading="Tall"><div slot="figure" style="height: 2000px">Tall</div></sds-slide>`);
  await rest();
  const fit = q<HTMLElement>('.sds-slide__art > .sds-slide__fit');
  expect(Number(fit.style.zoom)).toBeLessThan(1);
  expect(fit.getBoundingClientRect().bottom).toBeLessThanOrEqual(q('.sds-slide__art').getBoundingClientRect().bottom + 0.5);
  document.body.replaceChildren();
  await write(`<sds-slide kind="speaker" heading="Somebody"><img slot="portrait" alt="A face" src="x.png"><p>Says a thing.</p></sds-slide>`);
  await rest();
  expect(q('.sds-slide__portrait img').getAttribute('alt')).toBe('A face');
  expect(q('.sds-slide__page p').textContent).toBe('Says a thing.');
  document.body.replaceChildren();
});

test('the head takes its lines from their regions, markup and all, and a region wins', async () => {
  await write(`<sds-slide heading="Said as an attribute" lead="A lead">
    <span slot="eyebrow">02 · What it is</span>
    <h2 slot="heading">Three <em>places</em></h2>
    <p slot="note">The finding.</p>
    <p>One idea.</p>
  </sds-slide>`);
  await rest();
  expect(q('.sds-slide__head .sds-eyebrow').textContent?.trim()).toBe('02 · What it is');
  expect(q('.sds-slide__head h2').innerHTML.replace(/<!--[^>]*-->/g, '')).toBe('Three <em>places</em>');
  expect(q('.sds-slide__head .sds-lead').textContent).toBe('A lead');
  expect(q('.sds-slide__head .sds-slide__note').textContent).toBe('The finding.');
  expect(q('.sds-slide__body p').textContent).toBe('One idea.');
  document.body.replaceChildren();
});

test('a figure on a content slide takes the display step on its own', async () => {
  await write(`<sds-stat value="4" unit="px" label="Radius"></sds-stat>
    <sds-slide><h2 slot="heading">Values</h2><sds-stat value="16" unit="px" label="Floor"></sds-stat></sds-slide>`);
  await rest();
  const [page, slide] = qa('.sds-stat__value').map((value) => parseFloat(getComputedStyle(value).fontSize));
  const display = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-size-display')) * 16;
  expect(slide, 'on the slide, the display step').toBe(display);
  expect(page, 'on the page, the figure keeps its own').toBeLessThan(display);
  document.body.replaceChildren();
});

test('text too tall for the room keeps the room\'s width and scales until it fits', async () => {
  document.body.replaceChildren();
  const lines = Array.from({ length: 24 }, (_, i) => `<p>Line ${i + 1} of a text that is too long for one slide.</p>`).join('');
  await write(`<sds-slide kind="content" heading="Tall">${lines}</sds-slide>`);
  await rest();
  const body = q('.sds-slide__body').getBoundingClientRect();
  const fit = q<HTMLElement>('.sds-slide__body > .sds-slide__fit');
  expect(Number(fit.style.zoom)).toBeLessThan(1);
  const box = fit.getBoundingClientRect();
  expect(box.bottom, 'nothing over the foot').toBeLessThanOrEqual(body.bottom + 2);
  expect(box.top, 'nothing over the head').toBeGreaterThanOrEqual(body.top - 2);
  expect(box.width, 'the text takes the width of the room').toBeGreaterThan(body.width * 0.95);
  document.body.replaceChildren();
});
