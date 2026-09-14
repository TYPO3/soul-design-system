import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** How wide the set runs, or if it runs as a wall at all. `flush` is the
    gutter taken out: the cards share a hairline and the set reads as one
    block. That is a shape rather than a distance, so it is a name here rather
    than a number. `default` is a name too: the width every set gets unless it
    says otherwise is a decision, and nobody can ask for an unnamed one. */
export type GridVariant = 'default' | 'wide' | 'dense' | 'flush';
export interface GridProps {
    /** How much room one item holds. `default` is the reading width. `wide` is
        for cards with a picture, `dense` for a set read as a list, `flush` for
        a wall with no air around it. */
    variant?: GridVariant;
}
/**
 * The columns a count of items can stand in.
 *
 * `auto-fit` fills a row and drops the rest onto the next one. So four items
 * in a three-wide row wrap as three and one. That is one on its own beside two
 * tracks of nothing, and in a flush set a bite out of the wall. A last row is even
 * enough when it is full, or one short of full. Four across three becomes
 * two and two, five across three stays three and two.
 */
export declare function evenColumns(count: number, fits: number): number;
export declare class SdsGrid extends SdsElement {
    static properties: {
        variant: {
            type: StringConstructor;
        };
        /** The columns the last measurement settled on. Zero is "not measured",
            which renders the grid the stylesheet declares. That is the state a
            page arrives in and the only one a reader with no script ever sees. */
        columns: {
            type: NumberConstructor;
            state: boolean;
        };
    };
    variant: GridVariant;
    columns: number;
    private taken;
    private watch?;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** What the sheet draws on its own, and what to draw instead.
  
        The minimum comes off the grid rather than a copy here. The three widths
        differ in exactly that number, and a copy of it in TypeScript is the
        copy that goes stale. */
    private decide;
    protected updated(): void;
    protected render(): TemplateResult;
}
