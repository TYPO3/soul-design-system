/* What a field says when it is wrong.

   The markup lives in `src/components/field-error.ts`. Under or beside the
   field, never as a tooltip: an error the pointer has to find is an error the
   keyboard never surfaces at all.

   Its own element rather than a slot on the field. Whatever validated the
   value often writes the error, and that is not always what drew the box.
   No `parameters.dsCard`: it stands on the fields card, beside the field it
   belongs to. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/field-error.ts';

const meta: Meta<{ message: string }> = {
  title: 'Components/Forms/Field error',
  tags: ['autodocs', '!dev'],
  render: ({ message }) => html`<sds-field-error message="${message}"></sds-field-error>`,
  argTypes: { message: { control: 'text' } },
  args: { message: 'Not a registered identifier' },
};

export default meta;
type Story = StoryObj<{ message: string }>;

/** It carries its own glyph, because colour alone is not a message. */
export const Default: Story = {};
