/* The system's own mark.

   The markup lives in `src/components/signet.ts`. It is redrawn per optical
   size rather than scaled: at 16px the crop marks are two thin hooks and the
   three inner parts have to do the recognising, so they are drawn heavier and
   further apart than the large drawing would suggest.

   The element picks the drawing from the size it is asked for. Its ink is
   `currentColor` — the files under `assets/` cannot be, because an `<img>`
   inherits nothing, so each of them carries a `<style>` with two literal greys
   that would leak into any page it was inlined into.

   No `parameters.dsCard`: the mark is documented in Guidelines → Brand, where
   the construction, the sizes and the clear space are drawn from the artwork
   files themselves. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/signet.ts';

const meta: Meta<{ size: number }> = {
  title: 'Components/Signet',
  tags: ['autodocs', '!dev'],
  render: ({ size }) => html`<sds-signet size="${size}" label="Soul Design System"></sds-signet>`,
  argTypes: { size: { control: { type: 'number', step: 4, min: 16 } } },
  args: { size: 32 },
};

export default meta;
type Story = StoryObj<{ size: number }>;

export const Default: Story = {};

/** The three drawings at the sizes they were drawn for. Below 20 the small
    one, to 31 the medium, from 32 the large — the element chooses, and a
    caller says only how big. */
export const OpticalSizes: Story = {
  render: () => html`<div style="display:flex; align-items:flex-end; gap:var(--space-6)">
    ${[16, 20, 24, 32, 48].map(
      (size) => html`<div style="display:flex; flex-direction:column; align-items:center; gap:var(--space-2)">
        <sds-signet size="${size}"></sds-signet>
        <span class="sds-label">${size}</span>
      </div>`,
    )}
  </div>`,
};

/** In a lockup, which is where it nearly always is: signet, wordmark, one
    orange pipe. The lockup carries the page's ink and the signet takes it. */
export const InALockup: Story = {
  render: () => html`<a class="sds-lockup" href="#">
    <sds-signet size="20"></sds-signet>
    <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
  </a>`,
};
