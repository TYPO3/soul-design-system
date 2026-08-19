import { type TemplateResult } from 'lit';
import { type FieldSize } from '../lib/field-box.js';
import { SdsFormElement } from '../lib/form-element.js';
import './icon.ts';
/** One entry. A bare string is the label and the value at once, which is what
    most lists are; the object carries the three things a string cannot. */
export interface SelectOption {
    label: string;
    /** What it sends, where that is not the label. */
    value?: string;
    /** On the list and not on offer — a release out of support, a plan this
        account cannot reach. The reader sees why the answer is not there. */
    disabled?: boolean;
    /** The heading it stands under. Consecutive entries naming the same one
        become a single group, so the order of the list is the grouping. */
    group?: string;
}
export interface SelectProps {
    /** The visible label, which turns this into a control in a *form*: label
        above, hint under, error under both. Without one it is the bare box —
        right in a header or a filter row, where the surface says what it is for. */
    caption?: string;
    /** What the control is called for anything that cannot see what it sits
        beside. A select with no visible label of its own owes one here. */
    label?: string;
    /** What the answer is called when the form is sent. */
    name?: string;
    /** The control's id, so the label points at it and an error summary can. */
    fieldId?: string;
    /** The chosen value — or, while nothing is chosen, what the closed box says
        instead. That entry is on the list and disabled, so it is what the reader
        sees and never what they can pick. */
    value?: string;
    /** The list. */
    options?: readonly (string | SelectOption)[];
    /** What the answer has to be, under the control. Never inside it. */
    hint?: string;
    /** What is wrong with what is chosen. Sets the invalid state with it, and the
        browser refuses to submit past it. */
    error?: string;
    /** Something has to be chosen. Said in words beside the label. */
    required?: boolean;
    /** Present, and not on offer. */
    disabled?: boolean;
    /** The three heights a button has. */
    size?: FieldSize;
    /** The width it asks for, in pixels — and what it gets is that or the room
        there is. The attribute is `min-width`. */
    minWidth?: number;
    /** Something has been chosen. Choosing sets it. */
    filled?: boolean;
    /** Force the focus state for a still picture. */
    focused?: boolean;
    /** The box says the answer is wrong, with no sentence of its own. */
    invalid?: boolean;
    /** The list, drawn standing open, for a card — which is a picture and runs
        no script, so it can neither press the button nor hold a popover. Never
        set on a page: what opens the list there is the reader. */
    open?: boolean;
}
export declare class SdsSelect extends SdsFormElement {
    #private;
    static properties: {
        caption: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        fieldId: {
            type: StringConstructor;
            attribute: string;
        };
        value: {
            type: StringConstructor;
        };
        options: {
            type: ArrayConstructor;
        };
        hint: {
            type: StringConstructor;
        };
        error: {
            type: StringConstructor;
        };
        required: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        minWidth: {
            type: NumberConstructor;
            attribute: string;
        };
        filled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        focused: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        invalid: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /** Whether the popover is showing — read back from the browser, which owns
            that. Kept apart from `open`, which is a still picture's state and takes
            the popover away: one property doing both would re-add the attribute the
            moment the list opened, and close it again. */
        shown: {
            type: BooleanConstructor;
            state: boolean;
        };
        /** Which entry the keys are on while the list is open. Not the chosen one:
            a reader walking the list has moved nothing until they say so. */
        active: {
            type: NumberConstructor;
            state: boolean;
        };
    };
    caption: string;
    label?: string;
    name: string;
    fieldId: string;
    value: string;
    options: readonly (string | SelectOption)[];
    hint: string;
    error: string;
    required: boolean;
    disabled: boolean;
    size: FieldSize;
    minWidth: number;
    filled: boolean;
    focused: boolean;
    invalid: boolean;
    open: boolean;
    shown: boolean;
    active: number;
    private readonly listId;
    /** The anchor the list is placed against, named per instance. One name shared
        by every select on a page resolves to whichever the browser met last. */
    private readonly anchor;
    /** What stops the placement this element made, where it made one. */
    private following?;
    constructor();
    protected willUpdate(): void;
    protected restore(): void;
    disconnectedCallback(): void;
    /** The list as entries, each with where it sits: one flat run, because the
        keys walk the answers and never the headings. */
    private get entries();
    /** Which entries a key may land on. A disabled one is read out and stepped
        over, the way the platform steps over one. */
    private get reachable();
    /** What an entry sends. Not `valueOf`, which every object already has. */
    private sends;
    /** What the closed box says. The chosen entry's *label*, which is not always
        its value — and the prompt while nothing is chosen. */
    private get says();
    /** Whether the list is in front of the reader, however it got there: opened
        by them, or drawn open by a card that can press nothing. */
    private get listed();
    private get list();
    private get button();
    protected updated(): void;
    /** Where the keys start: on whatever is chosen, or on the first answer there
        is. A list that opens at the top every time makes a reader find their own
        answer again before they can move off it. */
    private aim;
    /** What the browser did, read back rather than assumed. Light dismiss and
        Escape are the platform's, so a press outside or a key this element never
        saw still arrives as a state change — and so does a press on the button,
        which opens the popover through `popovertarget` and never comes past
        `show`. */
    private readonly onToggle;
    private show;
    private hide;
    /** Move the keys `step` entries along, stopping at the ends. A list that
        starts over at the bottom hides how long it was from whoever cannot see
        it. */
    private step;
    private typeahead;
    private onKey;
    /** Take whatever the keys are on, and close. */
    private commit;
    private choose;
    /** The `<select>` the form actually submits, and the whole control on a page
        that runs no script. The stylesheet hides it once this element upgrades. */
    private native;
    /** The drawn list: headings as groups the keys walk past, answers as options
        the keys land on. */
    private drawn;
    protected render(): TemplateResult;
}
