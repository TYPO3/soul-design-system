/* The elements as a catalogue, in the shape the ecosystem already reads.

   An agent that installs this package greps it, and what a grep answers with
   is `soul.css` — 140 kB of class selectors and no sign that an element
   emitted any of them. So the contract ships as `custom-elements.json`: one
   file, the conventional name, every tag with what it takes and what it says.
   Editors read it for completion; an agent reads it before it invents a
   `<div>`. Compiled from `elements()`, so it cannot drift from the sources. */

import { type ElementDoc } from './elements.ts';

/** The version of the schema this is written to — https://custom-elements-manifest.open-wc.org. */
const SCHEMA = '2.1.1';

/* Where the sources sit for whoever installed the package, which is not where
   they sit here: `packages/frontend/` is this repository's own filing, and the
   manifest is read beside a `node_modules/@typo3/soul-frontend/src/`. */
const packageRelative = (source: string): string => source.replace(/^packages\/frontend\//, '');

/* A property Lit parses out of an attribute is one a server can write; the
   rest are lists and templates, set from script. Both are members, only the
   first are attributes — an agent handed `choices` as an attribute writes JSON
   into quotes and gets a control that draws nothing. */
const WRITABLE = ['string', 'boolean', 'number'];

/* A component's opening line is written to follow its own name — "sds-badge —
   a small, named piece of state" — and a field standing on its own is read
   without it. Only a lowercase letter is lifted: a line opening on `href` is
   naming a property, not starting a sentence. */
const sentence = (s: string): string => s.replace(/^[a-z]/, (c) => c.toUpperCase());

function declaration(e: ElementDoc): object {
  const module = packageRelative(e.source);
  return {
    kind: 'class',
    customElement: true,
    name: e.className,
    tagName: e.tag,
    summary: sentence(e.purpose),
    description: [sentence(e.purpose), ...e.notes].join('\n\n'),
    attributes: e.props.filter((p) => WRITABLE.includes(p.lit)).map((p) => ({
      name: p.attribute,
      description: p.doc,
      type: { text: p.type },
      fieldName: p.name,
    })),
    members: e.props.map((p) => ({
      kind: 'field',
      name: p.name,
      privacy: 'public',
      description: p.doc,
      type: { text: p.type },
      ...(WRITABLE.includes(p.lit) ? { attribute: p.attribute } : {}),
    })),
    events: e.events.map((name) => ({ name, type: { text: 'CustomEvent' } })),
    /* The default slot, named as what it is for: an element takes content
       where an attribute cannot carry it, never structure it already draws. */
    slots: e.takesContent
      ? [{ name: '', description: 'What an attribute cannot carry — prose, a block, a section of a document.' }]
      : [],
  };
}

/** The manifest for every registered tag, in the order the elements are read. */
export function manifest(els: readonly ElementDoc[]): object {
  return {
    schemaVersion: SCHEMA,
    readme: 'README.md',
    modules: els.map((e) => {
      const path = packageRelative(e.source);
      return {
        kind: 'javascript-module',
        path,
        declarations: [declaration(e)],
        exports: [
          { kind: 'js', name: e.className, declaration: { name: e.className, module: path } },
          { kind: 'custom-element-definition', name: e.tag, declaration: { name: e.className, module: path } },
        ],
      };
    }),
  };
}
