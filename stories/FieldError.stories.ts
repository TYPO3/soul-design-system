/* What is said when a field is wrong.

   The markup lives in `src/components/field-error.ts`. Under or beside the
   field, never as a tooltip: an error the pointer has to find is an error the
   keyboard never surfaces at all.

   Its own element rather than a slot on the field, because an error is often
   written by whatever validated the value, which is not always what drew the
   box. No `parameters.dsCard`: it is shown on the fields card, beside the
   field it belongs to. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../src/components/field-error.ts';

const meta: Meta<{ message: string }> = {
  title: 'Components/Field error',
  tags: ['autodocs', '!dev'],
  render: ({ message }) => html`<sds-field-error message="${message}"></sds-field-error>`,
  argTypes: { message: { control: 'text' } },
  args: { message: 'Not a registered identifier' },
};

export default meta;
type Story = StoryObj<{ message: string }>;

/** It carries its own glyph, because colour alone is not a message. */
export const Default: Story = {};
