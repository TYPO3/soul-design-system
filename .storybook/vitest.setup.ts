/* What every story gets before it runs as a test. The console is part of
   the assertion. An unregistered element is silent, and a Lit warning about
   a duplicate registration is the first sign of a bundle imported twice. So
   a warning or an error printed while a story renders fails it. Lit's dev
   build announces itself once per page, and that line is the one expected. */

import { afterEach } from 'vitest';
import { setIconSprites } from '../packages/frontend/src/components/icon.ts';

const EXPECTED = [/Lit is in dev mode/];

/* A test frame's own address is deep under the server root, so the
   relative path `preview.ts` sets does not resolve from it. The plugin
   serves the static directories at their mapped roots. */
setIconSprites('/assets/icons/sprites/');

/* A switch of `data-theme` changes every token at once and several
   components carry `transition: color`. An axe read inside that window
   sees a value that belongs to neither theme. */
const still = document.createElement('style');
still.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
document.head.append(still);

/* Hooked from the frame's first module on. So a warning printed while a
   story file loads lands on the first story in it rather than nowhere. */
const said: string[] = [];
for (const level of ['warn', 'error'] as const) {
  const original = console[level];
  console[level] = (...args: unknown[]) => {
    const line = args.map(String).join(' ');
    if (!EXPECTED.some((rx) => rx.test(line))) said.push(`${level}: ${line.slice(0, 200)}`);
    original(...args);
  };
}

afterEach(() => {
  if (!said.length) return;
  const lines = said.splice(0);
  throw new Error(`the story must render in silence:\n  ${lines.join('\n  ')}`);
});
