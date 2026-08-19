/* The one native control that looks like nothing else on a page.

   The markup lives in `src/components/file.ts`. A file input is a button and a
   sentence the browser draws itself, and the picker only opens for a press on
   a real one — so the real one stays and its button is painted through
   `::file-selector-button`.

   What is deliberately not here is a drawn box with a hidden input behind it.
   It photographs well, drops nothing, and loses the keyboard. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/file.ts';
import { type FileProps } from '../../packages/frontend/src/components/file.ts';
import { ifDefined } from 'lit/directives/if-defined.js';

const sdsFile = ({ caption, label, name, accept, multiple, hint, error, required, disabled, fieldId }: FileProps) =>
  html`<sds-file
    caption="${ifDefined(caption)}"
    label="${ifDefined(label)}"
    name="${name ?? ''}"
    accept="${accept ?? ''}"
    hint="${hint ?? ''}"
    error="${error ?? ''}"
    field-id="${fieldId ?? ''}"
    ?multiple="${multiple ?? false}"
    ?required="${required ?? false}"
    ?disabled="${disabled ?? false}"
  ></sds-file>`;

const meta: Meta<FileProps> = {
  title: 'Forms/File',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsFile(args),
  argTypes: {
    caption: { control: 'text' },
    label: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    caption: 'Attach a screenshot',
    fieldId: 'shot',
    name: 'shot',
    accept: 'image/*',
    hint: 'PNG or JPEG, up to 5 MB.',
  },
};

export default meta;
type Story = StoryObj<FileProps>;

/** The button is ours; the sentence beside it is the browser's, in its own
    language, saying what is chosen. */
export const Default: Story = {};

/** More than one at a time. */
export const Multiple: Story = {
  args: {
    caption: 'Attach the logs',
    fieldId: 'logs',
    name: 'logs',
    accept: '.log,.txt',
    multiple: true,
    hint: 'Say what the limits are here, not after the upload failed.',
  },
};

/** What is wrong with what was chosen, under the control. Never a tooltip. */
export const Invalid: Story = {
  args: {
    caption: 'Attach a screenshot',
    fieldId: 'shot',
    name: 'shot',
    accept: 'image/*',
    required: true,
    error: 'That file is 11 MB — the limit is 5 MB',
  },
};

/** Present but not available. */
export const Disabled: Story = {
  args: { caption: 'Attach a screenshot', fieldId: 'shot', hint: 'Sign in to attach files.', disabled: true },
};
