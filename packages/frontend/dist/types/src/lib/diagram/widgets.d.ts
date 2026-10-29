import type { Context } from './context.js';
import { type Glyph, type Tone } from './paint.js';
import type { State } from './context.js';
export type Widget = (
/** `small` sets it at the label size: the caption under a sketch. */
{
    w: 'text';
    text: string;
    code?: boolean;
    tone?: 'ink' | 'muted' | 'error';
    strong?: boolean;
    large?: boolean;
    small?: boolean;
    marker?: string;
    chip?: string;
} | {
    w: 'field';
    text?: string;
    /** The text is an address, a path or an identifier: mono, at the size of a label. */
    code?: boolean;
    placeholder?: string;
    cursor?: boolean;
    tag?: string;
    lines?: number;
    focus?: boolean;
    /** The ring in the claim colour: the place the drawing is about, or one of its peers. */
    emphasis?: boolean;
    large?: boolean;
    slim?: boolean;
    strong?: boolean;
    /** A dashed outline with no fill: a place that is still empty. */
    state?: State;
    /** Hatched: there for the editors, hidden from the visitors. */
    hidden?: boolean;
    /** A second outline outside the first: the focus ring of the keyboard. */
    ring?: boolean;
    /** A quiet band with no outline: a part the interface dims. */
    dim?: boolean;
    /** No box: a dashed outline around the text alone, as a text changes in place. */
    inplace?: boolean;
    /** A short text at the right end of a slim field, in muted type. */
    right?: string;
    /** More paragraphs under the text, each on lines of its own. */
    more?: string[];
    /** A dot at the top right: a change that nobody saved or published yet. */
    dot?: boolean;
    /** No box and no line around it: the text in the page as the cursor edits it. */
    bare?: boolean;
    marker?: string;
    chip?: string;
}
/** `round` is a circle as high as a button, a sign in its middle. */
/** `square` is a touch target: 44 on each side, its sign in the middle. */
 | {
    w: 'button';
    text: string;
    strong?: boolean;
    ink?: boolean;
    small?: boolean;
    round?: boolean;
    square?: boolean;
    emphasis?: boolean;
    marker?: string;
    chip?: string;
} | {
    w: 'tabs';
    items: string[];
    active?: number;
    switch?: boolean;
    small?: boolean;
    marker?: string;
    chip?: string;
}
/** An identifier. With a label, a boxed item of a grid: the id, then the label. */
 | {
    w: 'chip';
    text: string;
    label?: string;
    emphasis?: boolean;
    fill?: boolean;
    strong?: boolean;
    marker?: string;
}
/** A count out of a whole: `value` filled dots of `of`. A text puts a head over them. */
 | {
    w: 'dots';
    value: number;
    of: number;
    text?: string;
    marker?: string;
} | {
    w: 'hint';
    text: string;
    right?: string;
    emphasis?: boolean;
    marker?: string;
    chip?: string;
} | {
    w: 'label';
    text: string;
    chip?: string;
    marker?: string;
} | {
    w: 'step';
    text: string;
    chip?: string;
    marker?: string;
}
/** One line of code, or several in a light block that keeps their indent. */
 | {
    w: 'code';
    text?: string;
    lines?: string[];
    strong?: boolean;
    marker?: string;
    chip?: string;
}
/** A state at the right of a head: a short text in a round outline, or filled with `ink`. */
 | {
    w: 'pill';
    text: string;
    ink?: boolean;
    marker?: string;
    chip?: string;
}
/** The name of a type or an element, white on ink. */
 | {
    w: 'tag';
    text: string;
    marker?: string;
    chip?: string;
}
/** A connector down to the next control, with a text beside it. */
 | {
    w: 'arrow';
    text?: string;
    marker?: string;
}
/** How far a run of steps is: an ink share of a track. */
 | {
    w: 'progress';
    value: number;
    marker?: string;
}
/** `dot` marks the element's marker: where the rendered element stands in the page. */
 | {
    w: 'page';
    text: string;
    dot?: boolean;
    marker?: string;
} | {
    w: 'lock';
    text: string;
    strong?: boolean;
    marker?: string;
    chip?: string;
}
/** A picture, the lines of a text beside it. A text names what the picture stands for. */
 | {
    w: 'image';
    text?: string;
    lines?: number;
    marker?: string;
}
/** A small picture over its name: a file, an entry of a library, a layout to choose. */
 | {
    w: 'thumb';
    text?: string;
    show?: 'picture' | 'lines' | 'teaser' | 'page' | 'person';
    split?: number[];
    selected?: boolean;
    state?: State;
    marker?: string;
}
/** A picture with a crop frame, its corner handles and a focus point. */
 | {
    w: 'crop';
    marker?: string;
}
/** A map with two routes and a pin with its name. */
 | {
    w: 'map';
    text?: string;
    marker?: string;
}
/** A switch with its label after it. */
 | {
    w: 'toggle';
    text: string;
    on?: boolean;
    marker?: string;
}
/** The line where a dragged element lands, with a name over its start. */
 | {
    w: 'drop';
    text?: string;
    marker?: string;
}
/** An entry of a library: the sign of its type in a tile, its name, and a line under it. */
 | {
    w: 'entry';
    text: string;
    body?: string;
    sign?: Glyph;
    selected?: boolean;
    state?: State;
    marker?: string;
    chip?: string;
}
/** A dimension: a line with a tick at each end and its size under it. */
 | {
    w: 'span';
    text: string;
    marker?: string;
}
/** The keys of a screen keyboard, three rows of seven. */
 | {
    w: 'keyboard';
    marker?: string;
}
/** An insertion point: a dashed line with a circled plus in its middle,
    filled where the pointer or the focus stands on it. */
 | {
    w: 'insert';
    strong?: boolean;
    marker?: string;
    chip?: string;
} | {
    w: 'tree';
    lines?: number;
    marker?: string;
} | {
    w: 'tools';
    count?: number;
    marker?: string;
} | {
    w: 'lines';
    lines?: number;
    marker?: string;
} | {
    w: 'devices';
    text: string;
    active?: 'phone' | 'tablet' | 'desktop';
    chip?: string;
    marker?: string;
} | {
    w: 'site';
    name: string;
    nav?: string;
    heading?: string;
    cards?: number;
    /** The share of the room the site takes: under 1, a narrow device on a ground. */
    width?: number;
    selected?: boolean;
    cursor?: boolean;
    marker?: string;
} | {
    w: 'keycap';
    text: string;
    marker?: string;
}
/** Buttons with short labels in one bar. `|` divides them, and `active`
    counts the labels from 0. */
 | {
    w: 'toolbar';
    items: string[];
    active?: number[];
    strong?: boolean;
    ink?: boolean;
    marker?: string;
    chip?: string;
}
/** Controls side by side. A control with `push` and those after it stand at the right end.
    `bar` frames them with a hairline: the bar of a screen. */
 | {
    w: 'row';
    items: Widget[];
    bar?: boolean;
}
/** A box that holds controls: a dialog, a popover, a panel or a message. */
 | {
    w: 'frame';
    title?: string;
    close?: boolean;
    tone?: 'ok' | 'warn' | 'error';
    strong?: boolean;
    state?: State;
    hidden?: boolean;
    /** The share of the room the frame takes, centred: a phone in a page. */
    width?: number;
    /** The height of the frames beside it in a row, set by the row. */
    least?: number;
    /** Filled in ink, its text in the ground colour: a tooltip. */
    ink?: boolean;
    /** It stands over the controls after it, at the right: a menu that opens over a page. */
    over?: boolean;
    /** No outline and no pad: controls stacked in a row of controls. */
    bare?: boolean;
    /** A grey plane: a part of the page, where a white frame is a control. */
    fill?: boolean;
    /** A handle at the top edge: a sheet that slides up from the foot of a phone. */
    sheet?: boolean;
    /** The outline of a phone, its controls inside. */
    device?: boolean;
    dot?: boolean;
    chip?: string;
    marker?: string;
    items: Widget[];
}
/** `steps` numbers the rows and joins their numbers with a line. */
 | {
    w: 'list';
    rows: ListRow[];
    handle?: boolean;
    steps?: boolean;
    /** The relative widths of the columns a row's ` | ` divides its label into. */
    columns?: number[];
    /** Each row in a box, a bar of its rendering under its label. */
    rendered?: boolean;
    marker?: string;
} | {
    w: 'rule';
}) & {
    push?: boolean;
    weight?: number;
    /** A name a `join` line starts or ends at. */
    id?: string;
    /** The marker stands on the top right corner, not beside the control. */
    corner?: boolean;
    /** A pointer over the control, near its right end. */
    pointer?: boolean;
};
/** A row of a list: a label, how deep it stands, and what it says at its end. */
export interface ListRow {
    text: string;
    indent?: number;
    selected?: boolean;
    /** A sunken band with no outline: a group, or the open one of its peers. */
    boxed?: boolean;
    muted?: boolean;
    strong?: boolean;
    state?: 'absent' | 'degraded';
    emphasis?: boolean;
    /** A short text at the right end, in muted type. */
    right?: string;
    /** A small button at the right end: the action the row offers. */
    button?: string;
    mark?: Tone;
    chip?: string;
    /** The head of the columns: their names, in muted type. */
    head?: boolean;
    /** A numbered marker at the right end. */
    marker?: string;
    id?: string;
}
export interface Placed {
    svg: string;
    width: number;
    height: number;
}
export declare const plain: (s: string) => string;
/** The natural width of a control in a row, before the row stretches a
    field over the rest of its width. */
export declare const naturalWidth: (w: Widget) => number;
/** The least width a control draws in without a refusal: its longest word
    where it wraps, its widest part where it cannot. A column grows to it. */
export declare const leastWidth: (w: Widget, ctx: Context) => number;
/** Controls one under the other, `gap` apart, as a column and a frame set
    them. A frame `over` the controls after it takes no height of its own.
    It stands at the right, at its share of the width, over them. */
export declare const stack: (items: Widget[], x: number, y: number, width: number, ctx: Context, what: string, gap?: number) => Placed;
/** A control at its place, `width` wide. Throws, naming the control, on a
    text that does not fit. A control with an id keeps its box for a join. */
export declare const widget: (w: Widget, x: number, y: number, width: number, ctx: Context, what: string) => Placed;
