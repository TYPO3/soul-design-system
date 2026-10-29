import { engine } from './diagram/load.ts';
import { highlighter } from './highlighter.ts';

/* A static render in Node draws and colours at once, and has no fetch to
   save. A script that renders imports this first, and every element then
   finds the engine and the highlighter there. */
await Promise.all([engine.load(), highlighter.load()]);
