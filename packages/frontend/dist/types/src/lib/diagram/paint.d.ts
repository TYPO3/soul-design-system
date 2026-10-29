export declare const INK = "var(--text-primary, #1C1A17)";
export declare const SECONDARY = "var(--text-secondary, #4A453D)";
export declare const MUTED = "var(--text-muted, #726C63)";
export declare const CANVAS = "var(--surface-canvas, #FBFAF7)";
export declare const RAISED = "var(--surface-raised, #FFFFFF)";
export declare const SUNKEN = "var(--surface-sunken, #F3F1EC)";
export declare const INSET = "var(--surface-inset, #EFEBE3)";
export declare const SUBTLE = "var(--border-subtle, #E3DFD6)";
export declare const STRONG = "var(--border-strong, #C9C3B7)";
export declare const ACCENT = "var(--accent, #FF8700)";
export declare const OK = "var(--status-ok, #4F7A3A)";
export declare const WARN = "var(--status-warn, #986200)";
export declare const ERROR = "var(--status-error, #A33328)";
export declare const QUIET: Readonly<Record<'ok' | 'warn' | 'error', string>>;
/** The colour a drawing says its one claim in. The accent, or a status
    colour where the drawing is about a failure or a degradation. */
export type Claim = 'accent' | 'error' | 'warn' | 'ok';
export declare const CLAIM: Readonly<Record<Claim, string>>;
/** A tone a part takes for what it means, never to tell peers apart. */
export type Tone = 'ink' | 'muted' | 'ok' | 'warn' | 'error';
export declare const TONE: Readonly<Record<Tone, string>>;
export type Face = 'sans' | 'mono';
export declare const CARRIED: Readonly<Record<Face, string>>;
/** The type sizes of the grammar. 13 is the floor. */
export declare const SIZE: {
    readonly title: 36;
    readonly lead: 17;
    readonly node: 16;
    readonly body: 14;
    readonly label: 13;
};
export declare const FLOOR = 13;
/** One decimal, the precision a drawing at 1200 units needs. */
export declare const fmt: (n: number) => string;
export declare const escape: (s: string) => string;
export interface TextStyle {
    size: number;
    fill?: string;
    face?: Face;
    /** 400 or 600: the two weights a drawing carries. */
    weight?: 400 | 600;
    anchor?: 'start' | 'middle' | 'end';
    /** Letter spacing in units, for the capitals of an eyebrow or a label. */
    spacing?: number;
    /** A ground-coloured edge, so a text over a line stays readable. */
    halo?: boolean;
}
/** The small signs a text can hold, written `{clock}` in its quotes. The
    parser turns each into one private character. It is as wide as the type
    is high, so the measure and the wrap count it as one letter. */
export declare const GLYPHS: readonly ['clock', 'people', 'person', 'lock', 'dot', 'ring', 'plus', 'up', 'down', 'text', 'image', 'media', 'list', 'blocked', 'site', 'page', 'yes', 'no', 'partly'];
export type Glyph = (typeof GLYPHS)[number];
export declare const glyphChar: (name: string) => string | undefined;
export declare const text: (x: number, y: number, content: string, style: TextStyle) => string;
export interface BoxStyle {
    fill?: string;
    stroke?: string;
    width?: number;
    radius?: number;
    dashed?: boolean;
}
export declare const rect: (x: number, y: number, w: number, h: number, style?: BoxStyle) => string;
export declare const line: (x1: number, y1: number, x2: number, y2: number, stroke?: string, width?: number, dashed?: boolean) => string;
export type Point = readonly [number, number];
/** An orthogonal connector with a head at its end, and at its start too
    where it carries a question and its answer. */
export declare const connector: (points: readonly Point[], stroke?: string, width?: number, dashed?: boolean, head?: boolean, tail?: boolean) => string;
/** The head, 9 long and 8 wide, pointing from `from` to `at`. */
export declare const arrowhead: ([x, y]: Point, [fx, fy]: Point, fill?: string) => string;
export declare const circle: (cx: number, cy: number, r: number, fill: string, stroke?: string) => string;
export type Sign = 'yes' | 'partly' | 'no' | 'unknown' | 'dot' | 'ring' | 'page' | 'panel' | 'both' | 'form' | 'bar' | 'nav' | 'docheader' | 'any';
export declare const SIGN_MEANING: Readonly<Record<Sign, string>>;
export declare const sign: (kind: Sign, cx: number, cy: number) => string;
/** The place of a case in the editing interface, at the head of a column.
    The screen has quiet parts, and the part of the case is ink. The parts
    are the head of the module, the navigation, the bar, the page and the
    panel. `any` fills none of them. */
export declare const PLACE: {
    readonly width: 44;
    readonly height: 28;
};
export declare const placeSign: (kind: Sign, x: number, y: number) => string;
/** Diagonal lines across a box, 8 apart: a part that is there for the
    editors and hidden from the visitors. */
export declare const hatch: (x: number, y: number, w: number, h: number, stroke?: string) => string;
/** A numbered step: the ink disc a sequence or a sketch points with. */
export declare const marker: (cx: number, cy: number, label: string) => string;
/** A pointer, its tip at x, y: where a hand rests on a control. */
export declare const pointer: (x: number, y: number) => string;
/** A crossed end: the step that does not get through. */
export declare const cross: (cx: number, cy: number) => string;
/** A person: a head and shoulders, set before the name of a lane or a node. */
export declare const person: (x: number, cy: number, stroke?: string) => string;
/** A store: a cylinder, set before the name of a lane or a node that the
    other parts read and write. */
export declare const store: (x: number, cy: number, stroke?: string) => string;
/** The sign of a shape before a name: a person or a store. A node has none. */
export declare const shapeSign: (shape: 'node' | 'person' | 'store' | undefined, x: number, cy: number, stroke?: string) => string;
