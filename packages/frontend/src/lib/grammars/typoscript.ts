/* TypoScript, written as data so two highlighters can read the one grammar.

   highlight.js ships none, and this system colours a block twice: in the
   browser from highlight.js, and on the server from its PHP port, which loads
   a language as JSON. So there is no helper and no function in here, and the
   patterns are strings — a regular expression literal does not survive
   `JSON.stringify`, and a grammar that only one of the two could read would
   ship a page whose colour changed the moment a script ran. */

import type { Mode } from './mode.ts';

/* The three colours this system paints with, said in the highlighter's names:
   `attr` and `built_in` are key, `string` and `meta` are string, `comment` is
   comment. Nothing else is reached for — see `components.css`. */

/** A constant reference, wherever it stands: `{$plugin.tx_x.settings.y}`. It
    reads as ordinary text inside a value that is already coloured, which is
    the contrast a value made of one has. */
const CONSTANT: Mode = { className: 'variable', begin: '\\{\\$[^}\\n]*\\}' };

/** The right-hand side, from the operator to the end of the line. `=`, `:=`
    for a function, `=<` for a reference, `<` for a copy and `>` for an unset —
    everything after one of them is the value, and the operator itself is left
    as the punctuation it is. The lookahead is what keeps an unset and a
    cleared value from opening a span with nothing in it. */
const OPERATOR = '(?::=|=<|=|<|>)(?=[ \\t]*\\S)';

export const TYPOSCRIPT: Mode = {
  /* TSconfig is TypoScript — the same operators, paths and conditions, read
     by the backend rather than the frontend. TYPO3's own documentation
     grammar aliases it the same way. */
  aliases: ['tsconfig'],
  case_insensitive: false,
  contains: [
    { className: 'comment', begin: '/\\*', end: '\\*/' },
    /* Only at the start of a line: TypoScript has no trailing comment, and a
       `#` in the middle of one is a colour in a value. */
    { className: 'comment', begin: '^[ \\t]*(?:#|//).*$' },
    /* A condition, and the `[END]`, `[ELSE]` and `[GLOBAL]` that close one.
       Before the operator below, because a condition is full of them. */
    { className: 'meta', begin: '^[ \\t]*\\[', end: '\\]' },
    { className: 'meta', begin: '^[ \\t]*@import\\b.*$' },
    /* Ahead of the copy operator, which begins on the same character. */
    { className: 'meta', begin: '<INCLUDE_TYPOSCRIPT:', end: '>' },
    /* The object path being assigned to — the whole of it, up to whichever
       operator or brace follows. */
    { className: 'attr', begin: '^[ \\t]*[\\w.-]+(?=[ \\t]*(?::?=<?|<|>|\\{|\\())' },
    /* An object type, which is what an all-caps word standing alone on the
       right of an assignment is: `= PAGE`, `= FLUIDTEMPLATE`. Read from the
       shape rather than from a list of them, because the list is TYPO3's and
       grows a name every release. */
    {
      className: 'built_in',
      begin: '(?::?=)[ \\t]*(?=[A-Z][A-Z0-9_]*[ \\t]*$)',
      excludeBegin: true,
      end: '$',
    },
    {
      className: 'string',
      begin: OPERATOR,
      excludeBegin: true,
      end: '$',
      contains: [CONSTANT],
    },
    /* A value written over several lines, which is the one place a newline is
       part of what was said rather than the end of it. */
    { className: 'string', begin: '\\([ \\t]*$', end: '^[ \\t]*\\)', contains: [CONSTANT] },
    CONSTANT,
  ],
};
