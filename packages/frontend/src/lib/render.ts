/* Render a Lit template to the static HTML a specimen card ships.

   The Design System pane opens a card with `styles.css` and nothing else, so a
   card cannot contain `<sds-button>` — it has to contain the markup that
   element produces. Component templates are plain functions returning a
   `TemplateResult` for exactly that reason: the element renders one in the
   browser, this renders the same one into a file, and nothing is written twice.

   Lit keeps the whitespace inside a template literal, which is what makes the
   generated cards diffable line by line. */

import type { TemplateResult } from 'lit';
import { render } from '@lit-labs/ssr';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';

import { inlineArtRefs } from '../components/art.static.ts';
import { inlineIconRefs } from '../components/icon.static.ts';

/* Hydration markers Lit's SSR emits around every binding. Nothing here
   hydrates, so they would only be noise in a file people read and review. */
const LIT_MARKER = /<!--\/?lit-(?:part|node)[^>]*-->/g;

/* A template whose entire content is bindings — `html\`${icon}${label}\`` —
   is closed with a `<?>` child-part marker. It renders as nothing and so is
   invisible in review, which is why it goes here rather than becoming a rule
   every component author has to know. */
const LIT_CHILD_MARKER = /<\?>/g;

/* An element as `@lit-labs/ssr` emits it: the tag, a declarative shadow root
   holding what the element rendered, and the closing tag. Non-greedy, so
   repeated application unwraps from the inside out. */
const SSR_ELEMENT = /<(sds-[a-z-]+)\b[^>]*>\s*<template[^>]*>([\s\S]*?)<\/template>\s*<\/\1>/;

/* Replace every element with the markup it rendered. Components compose
   components and a card can carry none of it: an unupgraded element is an empty
   box where a glyph belongs. Nothing is reconstructed — SSR rendered each one
   already, into a shadow root this only takes it back out of. */
function flattenElements(html: string): string {
  let out = html;
  /* Innermost first, so an element inside an element unwraps too. Bounded
     because every pass removes one tag pair. */
  for (let m = SSR_ELEMENT.exec(out); m; m = SSR_ELEMENT.exec(out)) {
    out = out.slice(0, m.index) + (m[2] ?? '') + out.slice(m.index + m[0].length);
  }
  return out;
}

/* Whitespace left inside a tag by an attribute that was not written:
   `<input ... ${cond ? attr : nothing}>` keeps the space either way and a
   browser serialises none, so without this every component with an optional
   attribute fails parity. Scanned, because a `>` in a value does not end a tag. */
function tidyTags(html: string): string {
  let out = '';
  let inTag = false;
  let quote = '';

  for (const ch of html) {
    if (!inTag) {
      if (ch === '<') inTag = true;
      out += ch;
      continue;
    }
    if (quote) {
      if (ch === quote) quote = '';
      out += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      out += ch;
      continue;
    }
    if (ch === '>') {
      /* Newlines too: a tag written one attribute per line otherwise keeps
         the indentation of the attribute that was not written. */
      out = out.replace(/\s+$/, '');
      inTag = false;
      out += ch;
      continue;
    }
    out += ch;
  }

  return out;
}

/* Where a declarative shadow root opens. */
const SSR_SHADOW = /<template shadowroot[^>]*>/;
/* And any template at all, counted to find where that one closes: a rendering
   holds templates of its own, so the first `</template>` is somebody else's. */
const ANY_TEMPLATE = /<template\b[^>]*>|<\/template>/g;

/** Replace every declarative shadow root with what is inside it. */
function unwrapShadows(html: string): string {
  let out = html;
  for (let open = SSR_SHADOW.exec(out); open; open = SSR_SHADOW.exec(out)) {
    const from = open.index + open[0].length;
    ANY_TEMPLATE.lastIndex = from;
    let depth = 1;
    let close = -1;
    for (let m = ANY_TEMPLATE.exec(out); m; m = ANY_TEMPLATE.exec(out)) {
      depth += m[0] === '</template>' ? -1 : 1;
      if (depth === 0) {
        close = m.index;
        break;
      }
    }
    if (close < 0) {
      throw new Error('a declarative shadow root was never closed — check src/lib/render.ts against the installed @lit-labs/ssr');
    }
    out = out.slice(0, open.index) + out.slice(from, close) + out.slice(close + '</template>'.length);
  }
  return out;
}

/** Render a template to markup that still holds this system's elements. A page
    loads the bundle, so its tags have to survive and upgrade; it needs the
    markup only to be there already, for the first frame and for a reader who
    runs no script. Only the declarative shadow root comes off. */
export function renderUpgradable(template: TemplateResult): string {
  let html = unwrapShadows(collectResultSync(render(template)));
  /* `defer-hydration` tells a hydrating client not to upgrade yet. Nothing
     here hydrates — these re-render over their own output — so it would be an
     attribute on every element in the site that nothing ever reads. */
  html = html.replace(/ defer-hydration/g, '').replace(LIT_MARKER, '').replace(LIT_CHILD_MARKER, '');
  if (html.includes('<!--lit') || html.includes('<!--/lit')) {
    throw new Error('lit hydration markers survived the strip — check src/lib/render.ts against the installed @lit-labs/ssr');
  }
  /* Glyphs are inlined and drawings are not, because a drawing is referenced
     by a path in the site and resolves as written, while a sprite resolves
     against the module that asked for it — in Node, a path on the build
     machine, naming nothing in the markup written here. */
  return tidyTags(inlineIconRefs(html));
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

  /* A card carries no script, no sprite and no server, so a reference to
     another file resolves to nothing. The order is load-bearing: a drawing's
     `#art` has the shape of an icon reference and would be looked up as one. */
  html = tidyTags(inlineIconRefs(inlineArtRefs(html)));

  /* Nothing that needs upgrading may reach a card. This is the guard, not the
     test suite: a custom element in a static file renders as nothing at all,
     which is invisible in review and blank in the pane. */
  const leaked = /<(sds-[a-z-]+)\b/.exec(html);
  if (leaked) {
    /* Two faults leave a tag standing, and they are worth telling apart: a bug
       in this file, or a caller using a form that cannot be exported. An
       element given content between its tags is the second — SSR emits the
       authored children beside the element's template and `connectedCallback`
       never runs here to move them, so there is nothing to unwrap. */
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
