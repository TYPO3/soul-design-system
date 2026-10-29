/* Render a Lit template to the static HTML a specimen card ships.

   The Design System pane opens a card with `styles.css` and nothing else. So a
   card cannot contain `<sds-button>`; it has to contain the markup that
   element produces. Component templates are plain functions that return a
   `TemplateResult` for exactly that reason. The element renders one in the
   browser, this renders the same one into a file, and nothing exists twice.

   Lit keeps the whitespace inside a template literal, which is what makes the
   generated cards diffable line by line. */

import type { TemplateResult } from 'lit';
import { render } from '@lit-labs/ssr';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result.js';

import { inlineArtRefs } from '../components/art.static.ts';
import { inlineIconRefs } from '../components/icon.static.ts';

/* Hydration markers Lit's SSR emits around every binding. Nothing here
   hydrates, so they are only noise in a file people read and review. */
const LIT_MARKER = /<!--\/?lit-(?:part|node)[^>]*-->/g;

/* A template whose entire content is bindings — `html\`${icon}${label}\`` —
   ends with a `<?>` child-part marker. It renders as nothing and so is
   invisible in review. That is why it goes here rather than becomes a rule
   every component author has to know. */
const LIT_CHILD_MARKER = /<\?>/g;

/* An element as `@lit-labs/ssr` emits it: the tag, a declarative shadow root
   holding what the element rendered, and the closing tag. Non-greedy, so
   repeated application unwraps from the inside out. */
const SSR_ELEMENT = /<(sds-[a-z-]+)\b[^>]*>\s*<template[^>]*>([\s\S]*?)<\/template>\s*<\/\1>/;

/* Replace every element with the markup it rendered. Components compose
   components and a card can carry none of it: an unupgraded element is an empty
   box where a glyph belongs. Nothing gets rebuilt — SSR rendered each one
   already, into a shadow root this only takes it back out of. */
function flattenElements(html: string): string {
  let out = html;
  /* Innermost first, so an element inside an element unwraps too. Each pass
     unwraps every innermost pair at once, so the passes count the depth. */
  for (let next = out.replace(SSR_ELEMENTS, unwrapOne); next !== out; next = out.replace(SSR_ELEMENTS, unwrapOne)) out = next;
  return out;
}
const SSR_ELEMENTS = new RegExp(SSR_ELEMENT.source, 'g');
const unwrapOne = (_: string, _tag: string, inner: string): string => inner;

/* Whitespace an omitted attribute leaves inside a tag. `<input ... ${cond ?
   attr : nothing}>` keeps the space either way and a browser serialises none,
   so without this every component with an optional attribute fails parity.
   Scanned, because a `>` in a value does not end a tag. */
function tidyTags(html: string): string {
  /* One tag at a time, quotes and all, and only its own end trimmed.
     Newlines too: a tag written one attribute per line otherwise keeps the
     indentation of the omitted attribute. */
  return html.replace(TAG, (tag) => tag.replace(TAG_END, '>'));
}
const TAG = /<(?:"[^"]*"|'[^']*'|[^>"'])*>/g;
const TAG_END = /\s+>$/;

/* Where a declarative shadow root opens. */
const SSR_SHADOW = /<template shadowroot[^>]*>/;
/* And any template at all, counted to find where that one closes. A rendering
   holds templates of its own, so the first `</template>` is somebody else's. */
const ANY_TEMPLATE = /<template\b[^>]*>|<\/template>/g;

/* One walk over every template: the ones `opens` names lose their tags, and
   with `drop` their content too. Pieces collect and join once at the end. */
function untemplate(html: string, opens: (tag: string) => boolean, drop: boolean, fault: string): string {
  const pieces: string[] = [];
  /* For each template open now: does it come off, and where its content starts. */
  const stack: { off: boolean; from: number }[] = [];
  let at = 0;
  let dropping = 0;
  ANY_TEMPLATE.lastIndex = 0;
  for (let m = ANY_TEMPLATE.exec(html); m; m = ANY_TEMPLATE.exec(html)) {
    if (m[0] !== '</template>') {
      const off = !dropping && opens(m[0]);
      if (off) {
        pieces.push(html.slice(at, m.index));
        at = m.index + m[0].length;
        if (drop) dropping = stack.length + 1;
      }
      stack.push({ off, from: m.index });
      continue;
    }
    const top = stack.pop();
    if (!top) continue;
    if (top.off) {
      if (!drop) pieces.push(html.slice(at, m.index));
      at = m.index + m[0].length;
      if (dropping === stack.length + 1) dropping = 0;
    }
  }
  if (stack.some((one) => one.off)) throw new Error(fault);
  pieces.push(html.slice(at));
  return pieces.join('');
}

/** Replace every declarative shadow root with what is inside it. */
function unwrapShadows(html: string): string {
  return untemplate(html, (tag) => SSR_SHADOW.test(tag), false, 'a declarative shadow root never closed — check src/lib/render.ts against the installed @lit-labs/ssr');
}

/** Render a template to markup that still holds this system's elements. A page
    loads the bundle, so its tags have to survive and upgrade. It needs the
    markup only to be there already, for the first frame and for a reader who
    runs no script. Only the declarative shadow root comes off. */
export function renderUpgradable(template: TemplateResult): string {
  let html = unwrapShadows(collectResultSync(render(template)));
  /* `defer-hydration` tells a hydrating client not to upgrade yet. Nothing
     here hydrates — these re-render over their own output — so it is an
     attribute on every element in the site that nothing ever reads. */
  html = html.replace(/ defer-hydration/g, '').replace(LIT_MARKER, '').replace(LIT_CHILD_MARKER, '');
  if (html.includes('<!--lit') || html.includes('<!--/lit')) {
    throw new Error('lit hydration markers survived the strip — check src/lib/render.ts against the installed @lit-labs/ssr');
  }
  /* Glyphs inline and drawings do not. A drawing links by a path in the site
     and resolves as written. A sprite resolves against the module that asked
     for it. In Node that is a path on the build machine, which names nothing
     in the markup written here. */
  return tidyTags(inlineIconRefs(html));
}

/* Where the prerenderer keeps what a caller wrote, and where each such
   template closes, counted through the ones inside it. */
const KEPT = /<template data-sds-content>/;

/** A page whose elements the prerenderer drew in place, as a card. What each
    element drew stays. Its tag and the template of what a caller wrote go.
    So content between the tags reaches a card as it reaches a page. */
export function flattenUpgraded(page: string): string {
  let out = untemplate(page, (tag) => KEPT.test(tag), true, 'a template of written content never closed');
  out = out.replace(/<\/?sds-[a-z-]+(?![-\w])(?:"[^"]*"|'[^']*'|[^>"'])*>/g, '');
  return tidyTags(inlineIconRefs(inlineArtRefs(out)));
}

export function renderStatic(template: TemplateResult): string {
  /* Order matters: unwrap the elements first, because the markers Lit leaves
     inside a shadow root have to go too. */
  let html = flattenElements(collectResultSync(render(template)))
    .replace(LIT_MARKER, '')
    .replace(LIT_CHILD_MARKER, '');

  /* A marker that survived means Lit emitted a shape this does not know
     about, and the card ships with visible scaffolding in it. Fail rather
     than write the file — `make verify` cannot catch this, because an HTML
     comment is valid HTML and renders as nothing. */
  if (html.includes('<!--lit') || html.includes('<!--/lit')) {
    throw new Error('lit hydration markers survived the strip — check src/lib/render.ts against the installed @lit-labs/ssr');
  }

  /* A card carries no script, no sprite and no server, so a reference to
     another file resolves to nothing. The order is load-bearing: a drawing's
     `#soul-ref` has the shape of an icon reference and the lookup takes it for
     one. */
  html = tidyTags(inlineIconRefs(inlineArtRefs(html)));

  /* Nothing that needs an upgrade can reach a card. This is the guard, not the
     test suite. A custom element in a static file renders as nothing at all,
     which is invisible in review and blank in the pane. */
  const leaked = /<(sds-[a-z-]+)\b/.exec(html);
  if (leaked) {
    /* Two faults leave a tag standing, and they deserve two messages. A bug
       in this file, or a caller with a form no export can take. An element
       with content between its tags is the second. SSR emits the authored
       children beside the element's template, and `connectedCallback` never
       runs here to move them, so there is nothing to unwrap. */
    if (/<\/template>\s*\S/.test(html)) {
      throw new Error(
        `<${leaked[1]}> has content between its tags, and no export can take that form. ` +
          'Lit SSR emits authored children beside the element\'s own template rather than inside ' +
          'it, and `connectedCallback` never runs here to move them. Pass the body as a property ' +
          'instead — see the stories. The content form works in a browser, where the element ' +
          'upgrades and takes its children.',
      );
    }
    throw new Error(
      `<${leaked[1]}> reached the static output. A card opens without JavaScript, so every ` +
        'element must flatten to the markup it renders — see flattenElements().',
    );
  }
  return html;
}
