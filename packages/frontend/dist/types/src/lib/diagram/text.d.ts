import type { Face } from './paint.js';
/** The width of a line in units, at a size, a face and a weight. Three
    settings count: the shipped face, its advances rounded to whole pixels,
    and the fallback for a face that does not arrive. The widest wins, so a
    line that fits here fits on every system. */
export declare const measure: (s: string, size: number, face?: Face, weight?: number, spacing?: number) => number;
/** The width the carried face sets a line at. It places what follows the
    text, a cursor or a mark. It never sizes a box that must hold it. */
export declare const measureSet: (s: string, size: number, face?: Face, weight?: number) => number;
export interface Setting {
    size: number;
    face?: Face;
    weight?: number;
    spacing?: number;
}
/** The lines of a text broken only after its separators, or none where a
    part alone has no room or there is no separator. */
export declare const byParts: (s: string, max: number, fits: (t: string, room: number) => boolean) => string[] | undefined;
/** The narrowest box `s` wraps into: its widest piece, where a word
    breaks as `pieces` breaks it. */
export declare const narrowest: (s: string, setting: Setting) => number;
/** The lines of `s` in a box `max` wide, as full as they go. Where the last
    line holds less than a third of the box, the lines even out, so no word
    stands alone under a full line. Throws on a piece that still does not
    fit, and names `what`, so the author knows which text to shorten. */
export declare const wrap: (s: string, max: number, setting: Setting, what: string) => string[];
/** One line that must fit, with no wrap: a label, a value, a name. */
export declare const fit: (s: string, max: number, setting: Setting, what: string) => string;
