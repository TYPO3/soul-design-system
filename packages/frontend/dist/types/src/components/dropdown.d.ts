import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
import './icon.ts';
import { type IconId } from './icon.js';
/** One entry of the list. */
export interface DropdownChoice {
    /** What it is called, which is the whole of what a reader picks by. */
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
    /** Its own language, for an entry naming one: a reader is told "Deutsch" in
        German rather than in the voice the page is set in. */
    lang?: string;
    /** Opened away from this page, which is said rather than only styled. */
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
    /** What the control is called, where the label is too short to say it — a
        language code standing in for "Language". It is said in front of the
        label rather than instead of it: an accessible name that drops the word a
        reader can see is a name they cannot ask for by voice. */
    name?: string;
    /** The entries, in the order they are read. */
    choices?: readonly DropdownChoice[];
    /** Which side the panel hangs from. `end` where the button is at the end of
        a row, so the list opens back over the row rather than off the page. */
    align?: 'start' | 'end';
    /** The button's own variant, passed through — the trigger is a real button of
        this system and not a second kind of control that looks like one. */
    variant?: 'primary' | 'secondary' | 'ghost';
    /** The button's size, passed through the same way. */
    size?: 'md' | 'sm' | 'lg';
    /** The label is dropped and the glyph stands alone, which then requires
        `title` on the button — so the accessible name is `label` either way. */
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
    /** The anchor this panel is placed against, named per instance. One name
        shared by every dropdown on a page resolves to whichever one the browser
        met last, so each states its own and reads only that. */
    private readonly anchor;
    /** What stops the placement this element made, where it made one. */
    private following?;
    constructor();
    disconnectedCallback(): void;
    private get panel();
    private get button();
    /** What the browser did, read back rather than assumed. Light dismiss and
        Escape are the platform's here, so a press outside or a key this element
        never saw still arrives as a state change — and `aria-expanded`, the
        marker and the placement all follow this one event. */
    private readonly onToggle;
    /** The whole name, with the label still in it. Dropping the visible word
        would leave a control nobody can ask for by the name they can see. */
    private get called();
    /** Pages or commands. Asked of the entries rather than declared, because a
        caller who has to say which one it is can say the wrong one. */
    private get commands();
    /** The rows a key can move between: what is drawn and not disabled. */
    private rows;
    private onKey;
    /** What a press reports, and what it does not do. An entry with a target is
        a link and stays one — the event is said beside the navigation rather than
        instead of it, so a page that never listens still works. Preventing the
        event is how an app takes the navigation over. */
    private choose;
    private entry;
    protected render(): TemplateResult;
}
