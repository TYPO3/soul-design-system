/* The grammars this system wrote itself, because no highlighter ships one.

   Both ends read this map: the browser registers each entry with
   highlight.js, and `make grammars` writes each one out as the JSON the
   Guides theme hands to the PHP port. One source, so a block cannot be
   coloured one way on the server and another in the page. */

import type { Mode } from './mode.ts';
import { TYPOSCRIPT } from './typoscript.ts';

/** Keyed by the name a fence writes. */
export const WRITTEN: Readonly<Record<string, Mode>> = { typoscript: TYPOSCRIPT };
