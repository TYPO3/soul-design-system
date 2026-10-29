import { later } from './later.ts';

/* highlight.js and the grammars, for the code block. A page fetches them
   on the first block that arrives without its colour. */
export const highlighter = later(() => import('./highlight.ts'));
