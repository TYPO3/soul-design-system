/* Colouring a fenced block.

   Only the languages `CodeLang` names are registered — highlight.js ships
   nearly two hundred, and nobody should download the rest. In the template
   rather than to the DOM afterwards, so it works in Node: a card that shipped
   grey while the browser showed colour would document the wrong thing.

   The palette is this system's three colours, mapped in `components.css`.
   Whatever a fourth would have coloured reads as ordinary text. */

import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import sql from 'highlight.js/lib/languages/sql';
import twig from 'highlight.js/lib/languages/twig';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

/* `html` is xml's grammar and `text` is plaintext's — the fence writes the
   name a person uses, and this is where that becomes a grammar. `typoscript`
   is declared and deliberately absent: highlight.js has no grammar for it, so
   a TypoScript block sets in one colour rather than in a wrong one. */
const GRAMMARS: Record<string, LanguageFn> = {
  bash, css, diff, html: xml, javascript, json, markdown,
  php, sql, text: plaintext, twig, typescript, xml, yaml,
};

type LanguageFn = Parameters<typeof hljs.registerLanguage>[1];

for (const [name, grammar] of Object.entries(GRAMMARS)) hljs.registerLanguage(name, grammar);

/** Whether this system colours that language at all. */
export function highlights(lang: string): boolean {
  return lang in GRAMMARS;
}

/** The block, as markup carrying `hljs-` classes. Returns null where the
    language is one the system does not colour, so the caller can print the
    text it was given rather than a guess. */
export function highlight(lang: string, source: string): string | null {
  if (!highlights(lang)) return null;
  /* `ignoreIllegals`, because a fenced block in documentation is often a
     fragment — three lines out of the middle of a file, a command with an
     ellipsis in it. Refusing to colour those would be strictly worse than
     colouring them imperfectly. */
  return hljs.highlight(source, { language: lang, ignoreIllegals: true }).value;
}
