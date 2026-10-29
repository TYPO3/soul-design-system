import { type Diagram, type DiagramSpec, type Options } from './draw.js';
export * from './draw.js';
export { parse } from './parse.js';
/** The SVG file for a spec. Throws, naming the part, on anything the
    grammar refuses. */
export declare const diagram: (spec: DiagramSpec, options: Options) => Diagram;
