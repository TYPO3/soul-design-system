/** The three heights a button has, so a control and the button beside it stand
    on one line. `sm` inside another surface, `lg` where the control is what the
    screen is for. A form's controls are `md`. */
export type FieldSize = 'md' | 'sm' | 'lg';
export interface FieldBox {
    size?: FieldSize;
    /** Force the focus state for a still picture. Live focus needs nothing. */
    focused?: boolean;
    /** The box says the value is wrong. */
    invalid?: boolean;
    /** The value is the reader's, not a prompt. */
    filled?: boolean;
    /** Present, and not on offer. */
    disabled?: boolean;
    /** Shown and sent, and not editable. */
    readonly?: boolean;
    /** The message that comes with an invalid value, which sets the state. */
    error?: string;
}
/** The class list of the sunken box. */
export declare function fieldBox({ focused, invalid, filled, disabled, readonly, error, size }: FieldBox): string;
