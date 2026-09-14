import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
import './icon.ts';
import { type IconId } from './icon.js';
/** One entry of the list. */
export interface DropdownChoice {
    /** Its name, the whole of what a reader picks by. */
    label: string;
    /** Where it goes. An entry that has one is a page and becomes a link; an
        entry with none is a command and reports itself instead. */
    href?: string;
    /** A glyph before the label, where the entry asked for one. */
    icon?: IconId;
    /** The one the reader is on, or the setting that is in force. */
    current?: boolean;
    /** Present but not available — said to everyone, never drawn alone. */
    disabled?: boolean;
    /** Its own language, for an entry that names one. A reader hears "Deutsch"
        in German, not in the voice of the page. */
    lang?: string;
    /** Opens away from this page, in words and not only in style. */
    external?: boolean;
}
/** What `sds-dropdown-choose` carries: the entry, and where it sits. */
export interface DropdownChosen {
    choice: DropdownChoice;
    index: number;
}
export interface DropdownProps {
    /** What the button says. A dropdown whose entries are settings names the
        setting rather than the value, and lets `current` mark the one in force. */
    label?: string;
    /** The control's name, where the label is too short to say it: a language
        code for "Language". It stands in front of the label, not instead of
        it. An accessible name without the word a reader can see is a name they
        cannot ask for by voice. */
    name?: string;
    /** The entries, in the reader's order. */
    choices?: readonly DropdownChoice[];
    /** Which side the panel hangs from. `end` where the button is at the end of
        a row, so the list opens back over the row rather than out from it. A
        side with no room for the panel is the placement's own business. */
    align?: 'start' | 'end';
    /** The button's own variant, passed through. The trigger is a real button
        of this system, not a second kind of control that looks like one. */
    variant?: 'primary' | 'secondary' | 'ghost';
    /** The button's size, passed through the same way. */
    size?: 'md' | 'sm' | 'lg';
    /** The label drops and the glyph stands alone. The button then needs
        `title`, so the accessible name is `label` either way. */
    iconOnly?: boolean;
    /** A glyph on the button itself. */
    icon?: IconId;
}
export declare class SdsDropdown extends SdsElement {
    static properties: {
        label: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        choices: {
            type: ArrayConstructor;
        };
        align: {
            type: StringConstructor;
            reflect: boolean;
        };
        variant: {
            type: StringConstructor;
        };
        size: {
            type: StringConstructor;
        };
        iconOnly: {
            type: BooleanConstructor;
            attribute: string;
        };
        icon: {
            type: StringConstructor;
        };
        open: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    label: string;
    name: string;
    choices: readonly DropdownChoice[];
    align: 'start' | 'end';
    variant: 'primary' | 'secondary' | 'ghost';
    size: 'md' | 'sm' | 'lg';
    iconOnly: boolean;
    icon?: IconId;
    open: boolean;
    private readonly panelId;
    /** The anchor this panel stands against, named per instance. One name for
        every dropdown on a page resolves to whichever the browser met last. So
        each states its own and reads only that. */
    private readonly anchor;
    /** What stops the placement this element made, where it made one. */
    private following?;
    constructor();
    disconnectedCallback(): void;
    private get panel();
    private get button();
    /** What the browser did, read back, not assumed. Light dismiss and Escape
        are the platform's here. So a press outside or a key this element never
        saw still arrives as a state change. `aria-expanded`, the marker and
        the placement all follow this one event. */
    private readonly onToggle;
    /** The whole name, with the label still in it. Without the visible word,
        nobody can ask for the control by the name they can see. */
    private get called();
    /** Pages or commands. Asked of the entries rather than declared, because a
        caller who has to say which one it is can say the wrong one. */
    private get commands();
    /** The rows a key can move between: the drawn ones that take a press. */
    private rows;
    private onKey;
    /** What a press reports, and what it does not do. An entry with a target is
        a link and stays one. The event stands beside the navigation, not
        instead of it, so a page that never listens still works.
        `preventDefault()` is how an app takes the navigation over. */
    private choose;
    private entry;
    protected render(): TemplateResult;
}
