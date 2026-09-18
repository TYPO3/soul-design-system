/* Render every element in a page ahead of the browser, which is what lets a
   component have a contract. An addressed element draws nothing until it
   upgrades. The alternative is a renderer that writes the component's own
   markup and makes every internal name public API.

   Content between the tags goes over as the `content` property, since
   `@lit-labs/ssr` never runs `connectedCallback`, and comes back in an inert
   `<template>`. The marker tells what a caller wrote from what the element
   drew. Each leaves here as the address, that template, and the markup.
   Innermost first, so an element that composes others gets complete markup. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { renderUpgradable } from '../../packages/frontend/src/lib/render.ts';
import { CONTENT } from '../../packages/frontend/src/lib/element.ts';
import { TAGS } from '../../packages/frontend/src/index.ts';

/* One of this system's elements, with its attributes and whatever stands
   between its tags. Built from `TAGS` rather than `sds-[a-z-]+`. A tag this
   repository does not define stays exactly as found, so whoever wrote it sees
   it in the output. The attribute run steps over a quoted `>`, which does not
   end a tag and otherwise cuts a title in half. */
/* `(?![-\w])` is the tag ending. One of these names is a prefix of another:
   `sds-field` of `sds-field-error`, `sds-accordion` of `sds-accordion-item`.
   The attribute run happily swallows the rest, so without it
   `<sds-field-error>` reads as an `sds-field` with an attribute called
   `-error`. It renders as the wrong component, children outside it and all. */
const element = (tags: readonly string[]): RegExp =>
  new RegExp(`<(${tags.join('|')})(?![-\\w])((?:"[^"]*"|'[^']*'|[^>"'])*)>`);

/** Where the element open at `from` closes, counted through the ones of
    its own name inside it. A stop of a plan holds stops, so the first close
    after an open is not always its own. `null` for one that never closes,
    which then stays as found. */
function closeOf(source: string, tag: string, from: number): { inner: string; end: number } | null {
  const step = new RegExp(`<${tag}(?![-\\w])(?:"[^"]*"|'[^']*'|[^>"'])*>|</${tag}>`, 'g');
  step.lastIndex = from;
  let depth = 1;
  for (let found = step.exec(source); found; found = step.exec(source)) {
    depth += found[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return { inner: source.slice(from, found.index), end: found.index + found[0].length };
  }
  return null;
}

/** The properties a script sets on an element, keyed by the marker
    `data-sds-prop` carries. A value under `$html` is markup and comes back
    as a template, which is what a `body` or a cell takes. */
export type Props = readonly Record<string, unknown>[];

const MARK = /\bdata-sds-prop="(\d+)"/;

function revive(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(revive);
  if (typeof v === 'object' && v !== null) {
    if ('$html' in v) return html`${unsafeHTML(String((v as { $html: string }).$html))}`;
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, revive(x)]));
  }
  return v;
}

/* A template written by hand, one hole per property. Lit's tag fixes the
   holes at authoring time and a story sets any property it likes, so the
   strings assemble here. The tag came out of this repository's own list.
   The attributes go back exactly as they arrived: a second serialisation
   is a second chance to get escaping wrong. */
function template(tag: string, attrs: string, bound: Record<string, unknown>): TemplateResult {
  const parts = [`<${tag}${attrs} .content=`, ' .authored='];
  const values = Object.values(bound);
  for (const k of Object.keys(bound).slice(2)) parts.push(` .${k}=`);
  parts.push(`></${tag}>`);
  const strings = Object.assign(parts, { raw: [...parts] }) as unknown as TemplateStringsArray;
  return { _$litType$: 1, strings, values } as unknown as TemplateResult;
}

/** What one element becomes, with content that is already complete.
    `authored` is the same content as the author wrote it, before anything
    in it rendered. An element that reads its children rather than places
    them renders them itself from that. `unsafeHTML` is a child binding and
    a property binding is not one. So the content goes over as a one-hole
    template, which is exactly what a story gives it. */
function one(tag: string, attrs: string, written: string, authored: string, props: Props): string {
  const marked = MARK.exec(attrs);
  const rendered = renderUpgradable(template(tag, attrs, {
    content: written ? html`${unsafeHTML(written)}` : undefined,
    authored: authored || undefined,
    ...(marked ? (revive(props[Number(marked[1])] ?? {}) as Record<string, unknown>) : {}),
  }));

  /* SSR renders the element with its own tag, and that tag is the one already
     in the page. Kept as found, since the attributes on it are the renderer's
     own escaping and a second spelling is a second chance to get it wrong. So
     what comes out of the rendering is what is inside it. */
  const inside = rendered
    .trim()
    .replace(new RegExp(`^<${tag}\\b[^>]*>`), '')
    .replace(new RegExp(`</${tag}>$`), '');

  /* The template first, so a component that reads its children back finds the
     written content before anything else. Written even when empty, which is
     the whole of the marker. An empty answer and no answer are different.
     Without it the element lifts the frame it drew last time and draws a
     second one around it. */
  const kept = `<template ${CONTENT}>${written}</template>`;
  return `<${tag}${attrs}>${kept}${inside}</${tag}>`;
}

/**
 * Every element of ours in a page, rendered into itself.
 *
 * Returns the page unchanged where it holds none.
 */
export function prerender(page: string, tags: readonly string[] = TAGS, props: Props = []): string {
  const pattern = element(tags);

  /* A complete element goes aside and a marker stays where it stood. SSR
     reaches into the content a parent gets. So every element around a child
     that arrived rendered renders it again, each time with nothing to draw.
     Behind a marker the parent never sees the tag, and each element renders
     exactly once. */
  const put: string[] = [];
  const marker = /<!--sds-part:(\d+)-->/g;
  const aside = (markup: string): string => `<!--sds-part:${put.push(markup) - 1}-->`;
  const back = (markup: string): string =>
    markup.replace(marker, (_whole, at: string) => back(put[Number(at)] ?? ''));

  /* Left to right, and down before across. What is inside an element is
     complete before the element renders, and what follows it comes after.
     Across is a loop rather than a call, so the stack carries how deep
     elements nest and not how many a page holds. Nothing already written gets
     a second look, which keeps this away from its own output. */
  const walk = (source: string): string => {
    let done = '';
    let rest = source;

    for (;;) {
      const found = pattern.exec(rest);
      if (!found) return done + rest;

      const [whole, tag = '', attrs = ''] = found;
      const open = found.index + whole.length;
      const closed = closeOf(rest, tag, open);
      if (!closed) {
        done += rest.slice(0, open);
        rest = rest.slice(open);
        continue;
      }
      done += rest.slice(0, found.index) + aside(one(tag, attrs, walk(closed.inner).trim(), closed.inner.trim(), props));
      rest = rest.slice(closed.end);
    }
  };

  return back(walk(page));
}
