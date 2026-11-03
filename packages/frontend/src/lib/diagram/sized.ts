/* The size and the margin an element names, over those of its text. The element
   loads the engine late, and the finish step draws in Node. Both read an
   attribute with this file. */

import type { DiagramSpec } from './draw.ts';

/** The spec with the attributes on it. A slide has its room, so there they say nothing. */
export const sized = (spec: DiagramSpec, canvas = '', margin = ''): DiagramSpec => {
  if (spec.slide || (!canvas && !margin)) return spec;
  const [width, height] = canvas.split(',').map(Number);
  if (canvas && !(Number(width) > 0 && (height === undefined || height > 0))) throw new Error(`canvas="${canvas}": write a width, or a width and a height`);
  const free = Number(margin);
  if (margin && !(free >= 0)) throw new Error(`margin="${margin}": write the free space in units`);
  return {
    ...spec,
    ...(canvas ? { canvas: { width: Number(width), ...(height === undefined ? {} : { height }) } } : {}),
    ...(margin ? { margin: free } : {}),
  };
};
