/* Render every element in a page ahead of the browser, which is what lets a
   component have a contract: an addressed element draws nothing until it
   upgrades, and the alternative is a renderer writing the component's own
   markup, making every internal name public API.

   Content between the tags is handed over as the `content` property, since
   `@lit-labs/ssr` never runs `connectedCallback`, and handed back in an inert
   `<template>` — the marker telling what a caller wrote from what the element
   drew. Each leaves here as the address, that template, and the markup, and
   innermost first, so a composing element is handed finished markup. */

import { html } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { renderUpgradable } from '../../src/lib/render.ts';
import { CONTENT } from '../../src/lib/element.ts';
import { TAGS } from '../../src/index.ts';

/* One of this system's elements, with whatever it was given and whatever was
   written between its tags. Built from `TAGS` rather than `sds-[a-z-]+`: a tag
   this repository does not define is left exactly as found, so whoever wrote it
   sees it in the output. The attribute run steps over a quoted `>`, which does
   not end a tag and would otherwise cut a title in half. */
const element = (tags: readonly string[]): RegExp =>
  new RegExp(`<(${tags.join('|')})((?:"[^"]*"|'[^']*'|[^>"'])*)>([\\s\\S]*?)</\\1>`);

/** What one element becomes, given content that is already finished. */
function one(tag: string, attrs: string, written: string): string {
  const rendered = renderUpgradable(
    /* `unsafeStatic` for the tag and the attributes, both being values here
       where a Lit template fixes them at authoring time. The tag came out of
       this repository's own list; the attributes are put back exactly as they
       arrived, re-serialising being a second chance to get escaping wrong. */
    /* Wrapped in a template of its own rather than passed as the directive:
       `unsafeHTML` is a child binding and a property binding is not one, so
       what the element is handed is a one-hole template whose hole is the
       markup — which is exactly what it would have been given by a story. */
    staticHtml`<${unsafeStatic(tag)}${unsafeStatic(attrs)} .content=${
      written ? html`${unsafeHTML(written)}` : undefined
    }></${unsafeStatic(tag)}>`,
  );

  /* SSR renders the element including its own tag, and that tag is the one
     already in the page — kept as it was found, since the attributes on it are
     the renderer's own escaping and re-spelling them is a second chance to get
     it wrong. So what is taken from the rendering is what is inside it. */
  const inside = rendered
    .trim()
    .replace(new RegExp(`^<${tag}\\b[^>]*>`), '')
    .replace(new RegExp(`</${tag}>$`), '');

  /* The template first, so a component reading its children back finds what was
     written before anything else — and written even when empty, which is the
     whole of the marker: an empty answer and no answer are different, and
     without it the element lifts the frame it drew last time and draws a
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

  /* A finished element is put aside and a marker left where it stood.

     SSR renders every tag it can reach, and it reaches into the content a
     parent is handed: a child that arrived already rendered is rendered again
     by each element enclosing it, each time with no content to draw, so a code
     block two elements deep leaves as three empty frames and one full one. The
     parent never sees the tag now, and the markers are filled back in at the
     end, so each element is rendered exactly once. */
  const put: string[] = [];
  const marker = /<!--sds-part:(\d+)-->/g;
  const aside = (markup: string): string => `<!--sds-part:${put.push(markup) - 1}-->`;
  const back = (markup: string): string =>
    markup.replace(marker, (_whole, at: string) => back(put[Number(at)] ?? ''));

  /* Left to right, and down before across: what is inside an element is
     finished before the element is asked to render, and what follows it is
     walked after. Nothing already written is looked at again, which is what
     keeps this from meeting its own output — every element leaves here with
     its tag still on it, and a second pass would render it a second time. */
  const walk = (source: string): string => {
    const found = pattern.exec(source);
    if (!found) return source;

    const [whole, tag = '', attrs = '', inner = ''] = found;
    const before = source.slice(0, found.index);
    const after = source.slice(found.index + whole.length);

    return before + aside(one(tag, attrs, walk(inner).trim())) + walk(after);
  };

  return back(walk(page));
}
