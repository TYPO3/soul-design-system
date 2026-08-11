/* The drawer.

   The markup lives in `src/components/drawer.ts`. From the right, full
   height, and carrying no shadow either — where something is worked on
   beside the page rather than instead of it.

   No `parameters.dsCard`: it is drawn on the surfaces card, beside the modal
   and over the plane both need to be over. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/drawer.ts';

const meta: Meta = {
  title: 'Components/Drawer',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'fullscreen' },
  args: { width: 120 },
  argTypes: { width: { control: { type: 'number', step: 10 } } },
};

export default meta;
type Story = StoryObj;

/** Its width is a property because a drawer is as wide as what it holds — a
    list of identifiers and a form are not the same drawer. */
export const Default: Story = {
  render: ({ width }) => html`<div style="position:relative; height:210px; background:var(--surface-canvas);">
    <sds-drawer width="${width ?? 120}" .body="${html`<span class="spec-cap">DRAWER</span>`}"></sds-drawer>
  </div>`,
};
