/* Render every element in a page ahead of the browser.

   This is what lets a component have a contract.

   An element that is addressed — `<sds-teaser heading="…" src="…">` — draws
   itself from those properties, and draws nothing at all until it has
   upgraded. On a documentation site that used to be the end of the argument: a
   card whose title waits for a script is an empty box in a grid of them, and a
   reader with scripting off never gets it back. So the renderer wrote the
   card's own markup instead, the element was left framing it, and every
   internal name of every component became something a template outside this
   repository had to spell correctly. That is the failure the system exists to
   prevent, arriving through the one surface that is supposed to prevent it.

   The way out is not to weaken the contract but to run it earlier. Node can
   build these elements and call their `render()` — `scripts/ssr.ts` proves
   every one of them can — so a page leaves the build with the markup already
   in it, and the element upgrades over its own output instead of creating it.
   The attribute is the whole API again, on both sides of the script.

   **What is written between the tags is the one hard part.** `@lit-labs/ssr`
   builds an element and calls `render()`; it never runs `connectedCallback`,
   and there are no children on the instance — so a component that lifts its
   own content finds nothing there. The content is therefore handed over as a
   property (`content`, on `SdsElement`) and handed back into the page in an
   inert `<template>`, so that the element can tell what a caller wrote from
   what it rendered itself. Without that marker the first upgrade in a browser
   reads the rendered card back as the card's own summary.

   So each element leaves here in three parts:

     <sds-teaser heading="…">        the address, exactly as it arrived
       <template data-sds-content>   what was written between the tags
       …the markup it rendered…      what a reader without a script sees

   Innermost first: an element that composes another has to be handed that
   one's finished markup, not its tag. */

import { html } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { renderUpgradable } from '../../src/lib/render.ts';
import { CONTENT } from '../../src/lib/element.ts';
import { TAGS } from '../../src/index.ts';

/* One of this system's elements, with whatever it was given and whatever was
   written between its tags.

   Built from `TAGS` rather than from `sds-[a-z-]+`: a tag this repository does
   not define is not something to render and quietly swallow — it is something
   to leave exactly as it was found, so that whoever wrote it sees it in the
   output and finds out. The attribute run steps over quoted `>`, which is not
   the end of a tag and would otherwise cut a title in half. */
const element = (tags: readonly string[]): RegExp =>
  new RegExp(`<(${tags.join('|')})((?:"[^"]*"|'[^']*'|[^>"'])*)>([\\s\\S]*?)</\\1>`);

/** What one element becomes, given content that is already finished. */
function one(tag: string, attrs: string, written: string): string {
  const rendered = renderUpgradable(
    /* `unsafeStatic` for the tag and for the attributes, because both are
       values here and a Lit template fixes them at authoring time. Safe by
       construction on the tag, which came out of this repository's own list;
       the attributes are the renderer's own output and are put back exactly as
       they arrived rather than taken apart and spelt again — re-serialising a
       title out of a document is a second chance to get the escaping wrong. */
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

  /* The template first, so a component that reads its children back finds what
     was written before it finds anything else.

     Written even when it is empty, and that is the whole of the marker. An
     element's children after this are its own rendering, and the one question
     it asks on upgrade is what the caller wrote — an empty answer and no
     answer at all are different, and a missing template makes them look the
     same: the element lifts the frame it drew last time and draws a second one
     around it. So the template is always there and says what was written,
     including that nothing was. */
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

    return before + one(tag, attrs, walk(inner).trim()) + walk(after);
  };

  return walk(page);
}
