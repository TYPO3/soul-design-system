/* An answer of more than one line.

   The markup lives in `src/components/textarea.ts`. Its own element and not a
   taller field, for the reason a select is its own element: what it shares with
   a text field is the sunken box, and what it does not share is everything a
   caller writes — lines, a direction it may be dragged in, a value that can
   hold a newline, and nothing a `pattern` or an `inputmode` could mean.

   Type in the one below and drag its corner. It is a real `<textarea>`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/textarea.ts';
import { type TextareaProps } from '../../packages/frontend/src/components/textarea.ts';
import { ifDefined } from 'lit/directives/if-defined.js';

const sdsTextarea = ({ caption, label, name, fieldId, value = '', rows, hint, error, required, disabled, readonly, maxlength, resize, filled, invalid, minWidth }: TextareaProps) =>
  html`<sds-textarea
    caption="${ifDefined(caption)}"
    label="${ifDefined(label)}"
    name="${name ?? ''}"
    field-id="${fieldId ?? ''}"
    value="${value}"
    rows="${rows ?? 4}"
    hint="${hint ?? ''}"
    error="${error ?? ''}"
    resize="${resize ?? 'vertical'}"
    maxlength="${ifDefined(maxlength)}"
    min-width="${minWidth ?? 420}"
    ?required="${required}"
    ?disabled="${disabled}"
    ?readonly="${readonly}"
    ?filled="${filled}"
    ?invalid="${invalid}"
  ></sds-textarea>`;

const meta: Meta<TextareaProps> = {
  title: 'Forms/Textarea',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsTextarea(args),
  argTypes: {
    caption: { control: 'text' },
    label: { control: 'text' },
    value: { control: 'text' },
    rows: { control: { type: 'number', min: 2, max: 20 } },
    hint: { control: 'text' },
    error: { control: 'text' },
    resize: { control: 'inline-radio', options: ['vertical', 'none', 'both'] },
    maxlength: { control: 'number' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    filled: { control: 'boolean' },
  },
  args: {
    caption: 'What did the tool answer, and what should it have answered?',
    fieldId: 'message',
    name: 'message',
    rows: 5,
    value: 'The tool, the question, and what came back.',
    hint: 'The tool name and the question are enough to reproduce it.',
  },
};

export default meta;
type Story = StoryObj<TextareaProps>;

/** The row a form owes it: label above, hint under, error under both. The value
    is a placeholder until something is typed — `filled` is what makes it an
    answer, and typing sets it. */
export const Default: Story = {};

/** The value the markup came with is the element's *default*, which is what a
    reset puts back. Type into it and press reset in a form: what returns is
    this text, not the last thing that was typed. */
export const Filled: Story = {
  args: { value: 'typo3_icon_lookup answered “not registered” for an icon that is.\n\nIt should have resolved the alias first.', filled: true },
};

/** `error` sets the sentence *and* the invalid state, and the browser refuses
    to submit past it. */
export const Invalid: Story = {
  args: { value: '', filled: true, required: true, error: 'Say what the tool answered' },
};

/** Which way the corner drags. A box that widens breaks the column it stands
    in, which is why `vertical` is what a caller gets without asking. */
export const Fixed: Story = {
  args: { caption: 'The exact wording', value: 'Two lines are the whole of it.', filled: true, rows: 3, resize: 'none' },
};

/** Shown and sent, and not editable — the box gives up the sunken fill that
    says *type here* and keeps everything else. */
export const Readonly: Story = {
  args: { caption: 'What was sent', value: 'The report, the versions, and nothing else.', filled: true, rows: 3, readonly: true },
};
