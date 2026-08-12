/* The modal surface.

   The markup lives in `src/components/modal.ts`. This is the surface alone:
   opening one, making the rest of the page inert and returning the focus is
   `sds-dialog`, which uses the platform's `<dialog>` to get all three.

   No `parameters.dsCard`: it is drawn on the surfaces card, over the plane it
   needs to be a modal *of*. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/modal.ts';
import '../../packages/frontend/src/components/overlay.ts';
import '../../packages/frontend/src/components/button.ts';

const ACTIONS = [
  html`<sds-button variant="ghost" size="sm">Cancel</sds-button>`,
  html`<sds-button variant="primary" size="sm">Publish</sds-button>`,
];

const meta: Meta = {
  title: 'Components/Modal',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'fullscreen' },
  args: { heading: 'Publish the task skills?', width: 330 },
  argTypes: {
    heading: { control: 'text' },
    width: { control: { type: 'number', step: 10 } },
  },
};

export default meta;
type Story = StoryObj;

/** Centred, 560px at most, closed by a header X. Ghost action first, primary
    last — the order the rest of the system reads in. */
export const Default: Story = {
  render: ({ heading, width }) => html`<div style="position:relative; height:210px; background:var(--surface-canvas);">
    <sds-overlay></sds-overlay>
    <sds-modal
      heading="${heading}"
      width="${width ?? 330}"
      .body="${html`This writes into <span class="sds-mono">.agents/skills</span> and records the setup. Nothing else is touched.`}"
      .actions="${ACTIONS}"
    ></sds-modal>
  </div>`,
};
