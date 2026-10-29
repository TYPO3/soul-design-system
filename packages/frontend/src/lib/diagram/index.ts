/* A diagram from data, as a file: `diagram(spec)` is the SVG file.

   `draw.ts` lays the drawing out in the page's faces. A file shown as an
   image sees no face of the page, so this puts into it the cuts of the
   faces it sets. An element on a page draws with `draw` and carries none. */

import { type Diagram, type DiagramSpec, type Options, draw } from './draw.ts';
import { faces } from './faces.ts';

export * from './draw.ts';
export { parse } from './parse.ts';

/** The SVG file for a spec. Throws, naming the part, on anything the
    grammar refuses. */
export const diagram = (spec: DiagramSpec, options: Options): Diagram => {
  const drawn = draw(spec, options);
  const at = drawn.svg.indexOf('<g id="soul-ref">\n') + '<g id="soul-ref">\n'.length;
  return { ...drawn, svg: `${drawn.svg.slice(0, at)}${faces(drawn.svg)}\n${drawn.svg.slice(at)}` };
};
