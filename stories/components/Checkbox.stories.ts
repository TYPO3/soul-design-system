/* One thing that is either so or not.

   The markup lives in `src/components/checkbox.ts`. No `parameters.dsCard`: the
   control is the browser's own, and a card of it is a picture of Chrome at
   16px. The two decisions worth documenting are in the stories — the label is
   part of the target, and the tick is `--text-primary`, because the accent
   marks three things and a form of ticked boxes is not one. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/checkbox.ts';
import { type CheckboxProps } from '../../packages/frontend/src/components/checkbox.ts';

const sdsCheckbox = ({ label, hint, checked = false, name, required, disabled }: CheckboxProps) =>
  html`<sds-checkbox
    label="${label}"
    hint="${hint ?? ''}"
    ?checked="${checked}"
    name="${name ?? ''}"
    ?required="${required ?? false}"
    ?disabled="${disabled ?? false}"
  ></sds-checkbox>`;

const meta: Meta<CheckboxProps> = {
  title: 'Components/Checkbox',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsCheckbox(args),
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    checked: { control: 'boolean' },
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

/** Not available. The browser draws the state and takes the control out of
    the tab order with it. */
export const Disabled: Story = {
  args: { label: 'Attach the installation log', hint: 'Available once an installation has been reached.', disabled: true },
};
