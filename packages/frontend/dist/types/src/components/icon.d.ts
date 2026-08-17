import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
import { type IconId } from './icons.generated.js';
export type { IconId };
/** The system's size scale: 16, 20, 24 or a whole multiple — never 18 or 22.
    16 is the floor; below it, no icon at all. `em` is the exception: an icon
    written inside text is as big as that text and changes with it, because the
    floor is for a glyph standing on its own. */
export type IconSize = 16 | 20 | 24 | 32 | 48 | 'em';
/** Point the icons at a sprite this build serves somewhere else. */
export declare const setIconSprite: (url: string) => void;
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
    /** Which icon, by its TYPO3 identifier — `actions-play`,
        `actions-chevron-down`. */
    name: IconId;
    /** How big, in pixels. `em` by default, which takes the size of the text
        it stands in and is what a glyph beside words wants. */
    size: IconSize;
    /** What it says, where it stands without words. Without one it is hidden
        from assistive technology rather than read out beside text that already
        says it. */
    label?: string;
    constructor();
    protected render(): TemplateResult;
}
/** Every identifier this system ships — what the icons specimen renders. */
export declare const iconIds: readonly IconId[];
