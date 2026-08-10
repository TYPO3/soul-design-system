/* Render a Lit template to the static HTML a specimen card ships.

   The cards under `components/` are opened by the Design System pane with
   `styles.css` and nothing else — no bundle, no module, no custom element
   upgrade. So a card cannot contain `<sds-button>`: it has to contain the
   markup that element *produces*. This is what turns one into the other, at
   build time, in Node.

   That is also why the component templates are plain functions returning a
   `TemplateResult` rather than methods on the element. The function is the
   single source: the element renders it in the browser, and this renders it
   into a file. Nothing is written twice, so nothing can drift.

   Whitespace survives. Lit keeps whatever is inside the template literal, so
   a template written with newlines and indentation produces HTML with the
   same newlines and indentation — which is why the generated cards stay
   diffable line by line instead of arriving as one long string. */

import type { TemplateResult } from 'lit';
import { render } from '@lit-labs/ssr';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';

import { inlineIconRefs } from '../components/icon.static.ts';

/* Lit's SSR emits hydration markers around every binding. They are inert in
   a browser, but a specimen card is never hydrated — nothing on the page
   would ever claim them — and they would be noise in a file people read and
   review. Stripping them is safe precisely because these cards are static
   and stay static. */
const LIT_MARKER = /<!--\/?lit-(?:part|node)[^>]*-->/g;

/* A template whose entire content is bindings — `html\`${icon}${label}\`` —
   makes Lit's SSR close it with a `<?>` child-part marker. Browsers parse
   that as a bogus comment and render nothing, so it is invisible in review
   and harmless at runtime, which is exactly what makes it worth removing
   here rather than in every template: the alternative is a rule every
   component author has to know and none of them can see they broke. */
const LIT_CHILD_MARKER = /<\?>/g;

/* An element as `@lit-labs/ssr` emits it: the tag, a declarative shadow root
   holding what the element rendered, and the closing tag. Non-greedy, so
   repeated application unwraps from the inside out. */
const SSR_ELEMENT = /<(sds-[a-z-]+)\b[^>]*>\s*<template[^>]*>([\s\S]*?)<\/template>\s*<\/\1>/;

/* Replace every element with the markup it rendered.

   The components compose components — a button asks for `<sds-icon>` rather
   than pasting a drawing into its own markup, so changing how an icon is
   built stays one edit in one file. A specimen card cannot carry any of that:
   the Design System pane opens those files with `styles.css` and no
   JavaScript at all, and an unupgraded custom element is an empty box where
   a glyph belongs.

   So composition lives in the source and the export is flat — the same tree,
   printed at two depths. Nothing is reconstructed here: SSR already rendered
   each element, and this only takes it out of its wrapper.

   Note that `ssr` puts the output in a declarative shadow root even for our
   light-DOM elements. That is a detail of how it renders, not of how the
   element behaves in a browser, and unwrapping it is what makes the two
   agree. */
function flattenElements(html: string): string {
  let out = html;
  /* Innermost first, so an element inside an element unwraps too. Bounded
     because every pass removes one tag pair. */
  for (let m = SSR_ELEMENT.exec(out); m; m = SSR_ELEMENT.exec(out)) {
    out = out.slice(0, m.index) + (m[2] ?? '') + out.slice(m.index + m[0].length);
  }
  return out;
}

export function renderStatic(template: TemplateResult): string {
  /* Order matters: unwrap the elements first, because the markers Lit leaves
     inside a shadow root have to go too. */
  let html = flattenElements(collectResultSync(render(template)))
    .replace(LIT_MARKER, '')
    .replace(LIT_CHILD_MARKER, '');

  /* A marker that survived means Lit emitted a shape this does not know
     about, and the card would ship with visible scaffolding in it. Fail
     rather than write the file — `make verify` cannot catch this, because
     an HTML comment is valid HTML and renders as nothing. */
  if (html.includes('<!--lit') || html.includes('<!--/lit')) {
    throw new Error('lit hydration markers survived the strip — check src/lib/render.ts against the installed @lit-labs/ssr');
  }

  /* A card carries no script and no sprite, so a reference resolves to
     nothing. How an icon becomes a glyph is the icon component's business,
     not this file's. */
  html = inlineIconRefs(html);

  /* Nothing that needs upgrading may reach a card. This is the guard, not the
     test suite: a custom element in a static file renders as nothing at all,
     which is invisible in review and blank in the pane. */
  const leaked = /<(sds-[a-z-]+)\b/.exec(html);
  if (leaked) {
    /* Two different faults produce a surviving tag, and telling them apart is
       worth the extra line — one is a bug in this file, the other is the
       caller using a form that cannot be exported at all.

       An element given content between its tags cannot be flattened. Lit's
       SSR renderer emits the element's own template and then the authored
       children after it, and `connectedCallback` never runs in Node — so the
       component never lifts those children into its body, and what comes back
       is a frame with an empty middle and the content stranded beside it.
       There is nothing to unwrap.

       The content form is a browser affordance: a renderer produces the body
       and the element frames it on upgrade. For anything that has to be
       exported — every specimen card — pass the body as a property, which is
       what the stories do. */
    if (/<\/template>\s*\S/.test(html)) {
      throw new Error(
        `<${leaked[1]}> was given content between its tags, and that form cannot be exported. ` +
          'Lit SSR emits authored children beside the element\'s own template rather than inside ' +
          'it, and `connectedCallback` never runs here to move them. Pass the body as a property ' +
          'instead — see the stories. The content form works in a browser, where the element ' +
          'upgrades and takes its children.',
      );
    }
    throw new Error(
      `<${leaked[1]}> reached the static output. A card is opened without JavaScript, so every ` +
        'element has to be flattened to the markup it renders — see flattenElements().',
    );
  }
  return html;
}
