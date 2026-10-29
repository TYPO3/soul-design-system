import type { DiagramSpec } from './index.js';
/** The spec a text describes. Throws with the line number on anything it
    cannot read. The drawing's own checks run in `diagram()`. */
export declare const parse: (text: string) => DiagramSpec;
