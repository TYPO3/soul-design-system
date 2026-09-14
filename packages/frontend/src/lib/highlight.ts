/* The colour of a fenced block.

   Only the languages `CodeLang` names register — highlight.js ships nearly two
   hundred, and nobody must download the rest. In the template rather than to
   the DOM afterwards, so it works in Node. A card that ships grey while the
   browser shows colour documents the wrong thing.

   The palette is this system's three colours, mapped in `components.css`.
   Whatever a fourth colours elsewhere reads as ordinary text here. */

import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import scss from 'highlight.js/lib/languages/scss';
import sql from 'highlight.js/lib/languages/sql';
import twig from 'highlight.js/lib/languages/twig';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

import { WRITTEN } from './grammars/index.ts';

/* `html` is xml's grammar and `text` is plaintext's — the fence writes the
   name a person uses, and this is where that becomes a grammar. The ones
   under `grammars/` are this system's own, for the languages highlight.js
   does not ship. They are data, so the server's PHP highlighter reads the
   same file rather than a second grammar that agrees for a while. */
const GRAMMARS: Record<string, LanguageFn> = {
  bash, css, diff, html: xml, javascript, json, markdown,
  php, scss, sql, text: plaintext, twig, typescript, xml, yaml,
  /* A written grammar is the mode tree itself, and highlight.js takes a
     function that returns one. Its aliases are entries of their own rather
     than left to the library. `highlights` answers from this map, and a name
     the highlighter knows and this does not prints a block uncoloured. The
     cast is the whole of what `Mode` gives up — the library types a
     definition against helpers no grammar here uses. */
  ...Object.fromEntries(Object.entries(WRITTEN).flatMap(
    ([name, mode]) => [name, ...(mode.aliases ?? [])].map(
      (as) => [as, (() => mode) as unknown as LanguageFn],
    ),
  )),
};

type LanguageFn = Parameters<typeof hljs.registerLanguage>[1];

for (const [name, grammar] of Object.entries(GRAMMARS)) hljs.registerLanguage(name, grammar);

/** If this system colours that language at all. */
export function highlights(lang: string): boolean {
  return lang in GRAMMARS;
}

/** The block, as markup with `hljs-` classes. Returns null where the system
    does not colour the language, so the caller can print the text it has
    rather than a guess. */
export function highlight(lang: string, source: string): string | null {
  if (!highlights(lang)) return null;
  /* `ignoreIllegals`, because a fenced block in documentation is often a
     fragment. Three lines out of the middle of a file, a command with an
     ellipsis in it. No colour on those is strictly worse than imperfect
     colour. */
  return hljs.highlight(source, { language: lang, ignoreIllegals: true }).value;
}
