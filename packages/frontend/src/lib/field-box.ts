/* The sunken box a field, a select and a search all draw.

   One rectangle at one of three heights, carrying the states a still render has
   to hold. Its own module, so a control that draws the box does not drag in the
   row a form puts round it — and the row's error message with it. */

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
export function fieldBox({ focused, invalid, filled, disabled, readonly, error, size = 'md' }: FieldBox): string {
  const cls = ['sds-field'];
  /* Spelled out rather than interpolated: the size arrives as an attribute,
     and a word this layer does not have would become a class nothing draws. */
  if (size === 'sm') cls.push('sds-field--sm');
  else if (size === 'lg') cls.push('sds-field--lg');
  if (focused) cls.push('is-focused');
  /* An error message and the invalid state are the same fact, so one sets the
     other: a control that says what is wrong and is not marked wrong is two
     halves of a state, and the halves drift. */
  if (invalid || error) cls.push('is-invalid');
  if (filled) cls.push('is-filled');
  if (disabled) cls.push('is-disabled');
  /* Written as a class rather than left to `:has(:read-only)`: a `<select>`
     matches that pseudo-class always, readonly being an attribute it does not
     take, so the box would go flat for every select in the system. */
  if (readonly) cls.push('is-readonly');
  return cls.join(' ');
}

