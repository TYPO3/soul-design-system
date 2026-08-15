/* A control and what stands with it, as one thing.

   The markup lives in `src/components/field-group.ts`. No `parameters.dsCard`:
   what the group draws is a field and a row of buttons, both already on
   cards — what it *adds* is the distances between them, and those are read
   beside a title on a page. `Pages/Library` shows it there. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/field-group.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/button.ts';

const meta: Meta = {
  title: 'Components/FieldGroup',
  tags: ['autodocs', '!dev'],
  render: () => html`<sds-field-group>
    <sds-field
      value="Search 392 glyphs by name or purpose"
      icon="actions-search"
      label="Search the glyph set"
      min-width="420"
    ></sds-field>
    <div class="sds-actions">
      <sds-button variant="primary">Browse all 392</sds-button>
      <sds-button variant="secondary">Read the drawing rules</sds-button>
    </div>
  </sds-field-group>`,
};

export default meta;
type Story = StoryObj;

/** The group pays the steps its parts owe: a field and a row of actions each
    carry none of their own, and standing loose they touch. */
export const Default: Story = {};
