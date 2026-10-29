/* Every `sds-diagram` of a rendered page, turned into the drawing it draws.
   The element is the source. It draws a text live, in a story or on a page
   somebody writes by hand. A built page needs none of that.

   Each drawing goes into a file under `_diagrams/`. The page keeps a
   reference to the group `soul-ref` in it, so the shapes read the page's
   tokens and turn with its mode. A figure slide gets its drawing for the
   room it lends, from `slide-room.ts`. A deck's stage can lend another
   room. Then a second drawing stands beside the first, and the stylesheet
   shows the one for the place of the slide. */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

import { type DiagramSpec, draw } from '../../packages/frontend/src/lib/diagram/draw.ts';
import { parse } from '../../packages/frontend/src/lib/diagram/parse.ts';
import { drawnOf, reference } from '../../packages/frontend/src/lib/diagram/reference.ts';
import { closeOf } from './prerender.ts';
import { artOf, headOf, roomOf } from './slide-room.ts';

/** Where a site keeps its drawings, under its root. */
export const DRAWINGS = '_diagrams';

type Room = { width: number; height: number };

const RUN = `(?:"[^"]*"|'[^']*'|[^>"'])*`;
const unescape = (s: string): string =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, '&');
const attr = (run: string, name: string): string | undefined => {
  const found = new RegExp(`\\s${name}(?:="([^"]*)")?(?=[\\s/>]|$)`).exec(run);
  return found ? unescape(found[1] ?? '') : undefined;
};

/* The indent the whole text shares, gone, as the element reads it. */
const dedent = (text: string): string => {
  const lines = text.replace(/\t/g, '  ').split('\n');
  const indents = lines.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(cut)).join('\n').trim();
};

/** Every element of a tag in the markup, with its attributes and its span. */
const elements = (page: string, tag: string): { at: number; end: number; run: string; inner: string }[] => {
  const out: { at: number; end: number; run: string; inner: string }[] = [];
  for (const open of page.matchAll(new RegExp(`<${tag}(?![-\\w])(${RUN})>`, 'g'))) {
    const at = open.index ?? 0;
    const closed = closeOf(page, tag, at + open[0].length);
    if (closed) out.push({ at, end: closed.end, run: open[1] ?? '', inner: closed.inner });
  }
  return out;
};

/** What an element keeps of its author's content: its first template. */
const keptOf = (inner: string): { text: string; end: number } => {
  const open = /^\s*<template data-sds-content>/.exec(inner);
  if (!open) return { text: '', end: 0 };
  const closed = closeOf(inner, 'template', open[0].length);
  return closed ? { text: closed.inner, end: closed.end } : { text: '', end: 0 };
};

/* The lent room, or the same shape up to twice as large, where the engine
   draws the text in it. As the element works it out. */
const fits = (spec: DiagramSpec, room: Room): Room | undefined => {
  for (const scale of [1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.5, 1.6, 1.7, 1.8, 2]) {
    const tried = { width: Math.round(room.width * scale), height: Math.round(room.height * scale) };
    try {
      draw(spec, { name: 'd', slide: tried });
      return tried;
    } catch {
      /* The next size. */
    }
  }
  return undefined;
};

const roomOfText = (room: string): Room | undefined => {
  const [width = 0, height = 0] = room.split(',').map(Number);
  return width > 0 && height > 0 ? { width, height } : undefined;
};

/** The rooms each figure slide lends, by the slide's own text and the
    drawing's text. A copy of the slide in a template lends the same. */
type Lent = { page: string; stage: string };

const slideRooms = (page: string): Map<string, Map<string, Lent>> => {
  const rooms = new Map<string, Map<string, Lent>>();
  for (const slide of elements(page, 'sds-slide')) {
    const kept = keptOf(slide.inner);
    const drawn = slide.inner.slice(kept.end);
    const art = headOf(drawn);
    if (!art) continue;
    const parts = drawn.split('<div class="sds-slide__drawing">').slice(1);
    const box = artOf(art);
    const stage = artOf(art, true);
    if (!box || !stage) continue;
    /* Each art that holds one drawing with no room of its own lends. */
    const lent = parts
      .map((part) => elements(part.split('<div class="sds-slide__drawing">')[0] ?? part, 'sds-diagram'))
      .filter((found) => found.length === 1 && attr(found[0]?.run ?? '', 'room') === undefined)
      .map((found) => dedent(unescape(keptOf(found[0]?.inner ?? '').text.replace(/<[^>]*>/g, ''))));
    if (!lent.length) continue;
    /* A row lends each drawing the room its densest one needs. */
    const lend = (one: Room): string => {
      if (art.layout !== 'row' || lent.length < 2) return roomOf(one);
      const room = roomOfText(roomOf(one)) as Room;
      const grow = Math.max(...lent.map((text) => {
        try {
          return (fits(parse(text), room)?.width ?? room.width) / room.width;
        } catch {
          return 1;
        }
      }));
      return roomOf(one, grow);
    };
    const room = { page: lend(box), stage: lend(stage) };
    rooms.set(kept.text, new Map(lent.map((text) => [text, room])));
  }
  return rooms;
};

/** The page with every drawing in a file and a reference in its place. */
export function drawings(page: string, file: string, root: string): string {
  if (!page.includes('<sds-diagram')) return page;
  const rooms = slideRooms(page);
  const slides = elements(page, 'sds-slide').map((slide) => ({ ...slide, rooms: rooms.get(keptOf(slide.inner).text) }));
  const edits: { at: number; end: number; markup: string }[] = [];
  for (const one of elements(page, 'sds-diagram')) {
    /* A drawing a press zooms keeps its element: the viewer is its work. */
    if (attr(one.run, 'zoomable') !== undefined || attr(one.run, 'source') !== undefined) continue;
    const text = dedent(unescape(keptOf(one.inner).text.replace(/<[^>]*>/g, '')));
    if (!text) continue;
    let spec: DiagramSpec;
    try {
      spec = parse(text);
    } catch {
      continue;
    }
    /* The innermost slide around the drawing says the room it lends. */
    const around = slides.filter((slide) => slide.at < one.at && one.end <= slide.end).sort((a, b) => b.at - a.at)[0];
    const lent = !spec.slide ? around?.rooms?.get(text) : undefined;
    const stated = roomOfText(attr(one.run, 'room') ?? '');
    const name = attr(one.run, 'name') || 'd';
    /* One drawing in a file, and its reference. */
    const store = (room: Room | undefined): { markup: string; width: number } | undefined => {
      try {
        const { svg, width } = draw(spec, room ? { name, slide: room } : { name });
        const shape = drawnOf(svg);
        if (!shape) return undefined;
        const target = join(root, DRAWINGS, `${createHash('sha1').update(svg).digest('hex').slice(0, 16)}.svg`);
        if (!existsSync(target)) {
          mkdirSync(dirname(target), { recursive: true });
          writeFileSync(target, `${svg}\n`);
        }
        return { markup: reference(relative(dirname(file), target).split(sep).join('/'), shape), width };
      } catch {
        return undefined;
      }
    };
    const room = stated ?? (lent ? fits(spec, roomOfText(lent.page) as Room) : undefined);
    const drawn = store(room);
    if (!drawn) continue;
    let inside = drawn.markup;
    if (lent && !stated && lent.stage !== lent.page) {
      const staged = store(fits(spec, roomOfText(lent.stage) as Room));
      if (staged && staged.markup !== drawn.markup) inside = drawn.markup.replace('<svg ', '<svg data-room="page" ') + staged.markup.replace('<svg ', '<svg data-room="stage" ');
    }
    const placed = room || spec.slide ? '' : ` style="--sds-diagram-width: ${drawn.width}px" tabindex="0"`;
    edits.push({ at: one.at, end: one.end, markup: `<div class="sds-diagram"${placed}>${inside}</div>` });
  }
  let out = page;
  for (const edit of edits.sort((a, b) => b.at - a.at)) out = out.slice(0, edit.at) + edit.markup + out.slice(edit.end);
  return out;
}
