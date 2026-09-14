/* Render every element in a page ahead of the browser, which is what lets a
   component have a contract. An addressed element draws nothing until it
   upgrades. The alternative is a renderer that writes the component's own
   markup and makes every internal name public API.

   Content between the tags goes over as the `content` property, since
   `@lit-labs/ssr` never runs `connectedCallback`, and comes back in an inert
   `<template>`. The marker tells what a caller wrote from what the element
   drew. Each leaves here as the address, that template, and the markup.
   Innermost first, so an element that composes others gets complete markup. */

import { html } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
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
  new RegExp(`<(${tags.join('|')})(?![-\\w])((?:"[^"]*"|'[^']*'|[^>"'])*)>([\\s\\S]*?)</\\1>`);

/** What one element becomes, with content that is already complete.
    `authored` is the same content as the author wrote it, before anything
    in it rendered. An element that reads its children rather than places
    them renders them itself from that. */
function one(tag: string, attrs: string, written: string, authored: string): string {
  const rendered = renderUpgradable(
    /* `unsafeStatic` for the tag and the attributes, both values here where a
       Lit template fixes them at authoring time. The tag came out of this
       repository's own list. The attributes go back exactly as they arrived,
       as a second serialisation is a second chance to get escaping wrong. */
    /* Wrapped in a template of its own rather than passed as the directive.
       `unsafeHTML` is a child binding and a property binding is not one. So
       the element gets a one-hole template whose hole is the markup, which is
       exactly what a story gives it. */
    staticHtml`<${unsafeStatic(tag)}${unsafeStatic(attrs)} .content=${
      written ? html`${unsafeHTML(written)}` : undefined
    } .authored=${authored || undefined}></${unsafeStatic(tag)}>`,
  );

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
export function prerender(page: string, tags: readonly string[] = TAGS): string {
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

      const [whole, tag = '', attrs = '', inner = ''] = found;
      done += rest.slice(0, found.index) + aside(one(tag, attrs, walk(inner).trim(), inner.trim()));
      rest = rest.slice(found.index + whole.length);
    }
  };

  return back(walk(page));
}
