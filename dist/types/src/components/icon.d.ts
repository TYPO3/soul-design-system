import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
import { type IconId } from '../lib/icons.generated.js';
export type { IconId };
/** The system's size scale: 16, 20, 24 or a whole multiple — never 18 or 22.
    16 is the floor; below it, no icon at all. */
export type IconSize = 16 | 20 | 24 | 32 | 48;
export declare class SdsIcon extends SdsElement {
    static properties: {
        name: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: NumberConstructor;
            reflect: boolean;
        };
        /** Only for an icon that stands without a label. SKILL.md lists the four
            that may: answered, version-bound, not bootable, a stated boundary.
            Everything else sits beside its own text and is hidden from assistive
            tech rather than read out twice. */
        label: {
            type: StringConstructor;
        };
    };
    name: IconId;
    size: IconSize;
    label?: string;
    constructor();
    private inline;
    protected render(): TemplateResult;
}
/** Every identifier this system ships — what the icons specimen renders. */
export declare const iconIds: IconId[];
