/* Modal, overlay and drawer — the surfaces that float over a plane.

   The markup lives in `src/components/overlay.ts`. No `parameters.dsCard`
   here: these three share one specimen with the planes, on the card that
   `Card.stories.ts` generates, because the claim being documented is about
   the pair — a plane and the thing over it — and neither half makes it
   alone.

   The system has no shadows. That is why the specimen draws the modal inside
   a bordered box rather than floating it: without a shadow, an overlay needs
   a wash and a boundary to be an overlay *of* something. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../src/components/button.ts';
import '../src/components/overlay.ts';

/** The scene both the modal and the drawer are shown in, and the one the
    card is generated from. Exported so `Card.stories.ts` composes the same
    one rather than keeping a second copy of it. */
export const scene = (): TemplateResult => html`<sds-overlay></sds-overlay>
<sds-modal
  heading="Publish the task skills?"
  .body="${html`This writes into <span class="sds-mono">.agents/skills</span> and records the setup. Nothing else is touched.`}"
  .actions="${[
    html`<sds-button variant="ghost" size="sm" label="Cancel"></sds-button>`,
    html`<sds-button variant="primary" size="sm" label="Publish"></sds-button>`,
  ]}"
></sds-modal>
<sds-drawer .body="${html`<span class=\"spec-cap\">DRAWER</span>`}"></sds-drawer>`;

const meta: Meta = {
  title: 'Components/Overlay',
  tags: ['autodocs', '!dev'],
  excludeStories: ['scene'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

/** The wash a modal or drawer sits on — `--surface-overlay`, never a shadow. */
export const Overlay: Story = {
  render: () => html`<div style="position:relative; height:120px; background:var(--surface-canvas);"><sds-overlay></sds-overlay></div>`,
};

/** Centred, 560px at most, closed by a header X. Ghost action first, primary
    last — the order the rest of the system reads in. */
export const Modal: Story = {
  render: () => html`<div style="position:relative; height:210px; background:var(--surface-canvas);">
    <sds-overlay></sds-overlay>
    <sds-modal
  heading="Publish the task skills?"
  .body="${html`This writes into <span class="sds-mono">.agents/skills</span> and records the setup. Nothing else is touched.`}"
  .actions="${[
    html`<sds-button variant="ghost" size="sm" label="Cancel"></sds-button>`,
    html`<sds-button variant="primary" size="sm" label="Publish"></sds-button>`,
  ]}"
></sds-modal>
  </div>`,
};

/** From the right, full height, and carrying no shadow either. */
export const Drawer: Story = {
  render: () => html`<div style="position:relative; height:210px; background:var(--surface-canvas);">
    <sds-drawer .body="${html`<span class=\"spec-cap\">DRAWER</span>`}"></sds-drawer>
  </div>`,
};

/** All three at once, which is the only way the no-shadow claim can be read. */
export const Together: Story = {
  render: () => html`<div style="position:relative; height:210px; background:var(--surface-canvas);">${scene()}</div>`,
};
