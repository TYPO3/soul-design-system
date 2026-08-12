/* One thing that is either so or not.

   The markup lives in `src/components/checkbox.ts`. No `parameters.dsCard` of
   its own: the box and its states are drawn in `components.css`, and the form
   card is where they are shown — in the company a checkbox is used in. The two
   decisions are here — the label is part of the target, and the tick is
   `--text-primary`, because the accent marks three things and a form of ticked
   boxes is not one. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/checkbox.ts';
import { type CheckboxProps } from '../../packages/frontend/src/components/checkbox.ts';

const sdsCheckbox = ({ label, hint, checked = false, indeterminate, name, value, required, disabled }: CheckboxProps) =>
  html`<sds-checkbox
    label="${label}"
    hint="${hint ?? ''}"
    ?checked="${checked}"
    ?indeterminate="${indeterminate ?? false}"
    name="${name ?? ''}"
    value="${value ?? ''}"
    ?required="${required ?? false}"
    ?disabled="${disabled ?? false}"
  ></sds-checkbox>`;

const meta: Meta<CheckboxProps> = {
  title: 'Forms/Checkbox',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsCheckbox(args),
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Send me the answer by email', checked: false },
};

export default meta;
type Story = StoryObj<CheckboxProps>;

/** The label is inside the `<label>`, so the words are part of the target. A
    16px box is hard to hit and the sentence beside it is not. */
export const Default: Story = {};

/** Ticked. Not in the accent, which has three jobs already. */
export const Checked: Story = { args: { label: 'Send me the answer by email', checked: true } };

/** What the form receives. These render into the light DOM, so the `<input>`
    is a real descendant of the `<form>` and is submitted with the rest: `name`
    is what it is called there, `value` what it sends when ticked. A box with
    no `value` sends `on` — the platform's answer, not this system's — and an
    unticked box sends nothing at all. */
export const Named: Story = {
  args: { label: 'Attach the server scope', name: 'scope', value: 'server', checked: true },
};

/** A set of them under one question, and no element for it: n boxes are n
    answers that happen to share a heading, where `sds-radio` is one answer and
    has to own the set to keep the name and the chosen value in step. What
    holds these together is the `<fieldset>` — the same `sds-choices` the radio
    draws, addressed here rather than rebuilt. */
export const Group: Story = {
  render: () => html`<fieldset class="sds-choices" name="send">
    <legend class="sds-field-label">What may we send you?</legend>
    <span class="sds-field-hint">Each one is its own answer, and none of them decides another.</span>
    ${[
      { label: 'Release notes', hint: 'When a version ships, and what changed in it.', checked: true },
      { label: 'Security advisories', hint: 'Only what reaches a version you run.', checked: true },
      { label: 'Everything else', hint: 'Events, surveys, and the occasional experiment.' },
    ].map((choice) => sdsCheckbox({ ...choice, name: 'send' }))}
  </fieldset>`,
};

/** Mixed: the box answers for a set only some of which is ticked, and ticking
    it resolves to on. The input has no attribute for this — it is a property
    and nothing else, so a surface running no script shows an empty box. */
export const Mixed: Story = {
  args: { label: 'Attach every source in the scope', indeterminate: true },
};

/** With what ticking it commits to. A consent whose consequence is a line of
    prose somewhere else on the page is a consent nobody read. */
export const WithHint: Story = {
  args: {
    label: 'Attach the server scope to this report',
    hint: 'Sends the versions, the reachable sources and which tools are degraded. No file contents and no credentials.',
    checked: true,
  },
};

/** Required, said in words by the field above it rather than by an asterisk
    this control would have to explain. */
export const Required: Story = {
  args: { label: 'I have read what this sends', required: true },
};

/** Not available. The paint is this system's and the tab order is the
    browser's — a disabled input leaves it either way. */
export const Disabled: Story = {
  args: { label: 'Attach the installation log', hint: 'Available once an installation has been reached.', disabled: true },
};
