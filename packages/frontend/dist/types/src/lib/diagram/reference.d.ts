/** The size and the name of a drawing, read off its own markup. */
export interface Drawn {
    width: number;
    height: number;
    title: string;
    desc: string;
}
/** The size, title and description of drawn markup. `undefined` where the
    markup holds no drawing of the engine. */
export declare const drawnOf: (svg: string) => Drawn | undefined;
/** The markup a page keeps for a drawing in the file at `href`. */
export declare const reference: (href: string, drawn: Drawn) => string;
