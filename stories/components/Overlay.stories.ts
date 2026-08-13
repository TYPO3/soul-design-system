/* The wash a floating surface sits on.

   The markup lives in `src/components/overlay.ts`. No `parameters.dsCard`:
   the wash shares one specimen with the planes, on the card that
   `Surface.stories.ts` generates, because the claim being documented is about
   the pair — a plane and the thing over it — and neither half makes it alone.

   The system has no shadows. That is why an overlay exists at all: without a
   wash and a boundary, a surface over another surface is not over anything. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/overlay.ts';

const meta: Meta = {
  title: 'Components/Overlay',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

/** `--surface-overlay` over whatever it is given, and nothing else. What
    floats on it is a modal, and that is its own element. */
export const Default: Story = {
  render: () => html`<div style="position:relative; height:120px; background:var(--surface-canvas);"><sds-overlay></sds-overlay></div>`,
};
