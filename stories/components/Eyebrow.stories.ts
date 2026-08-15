/* The line over a title.

   The markup lives in `src/components/eyebrow.ts`. No `parameters.dsCard`:
   what an eyebrow draws is the label register, already on the type cards —
   what it *is* only shows over a heading, and `Pages/Feature` opens with
   one. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/eyebrow.ts';
import { type EyebrowProps } from '../../packages/frontend/src/components/eyebrow.ts';

export const sdsEyebrow = ({ label }: EyebrowProps) =>
  html`<sds-eyebrow label="${label}"></sds-eyebrow>`;

const meta: Meta<EyebrowProps> = {
  title: 'Components/Eyebrow',
  tags: ['autodocs', '!dev'],
  render: (args) => html`${sdsEyebrow(args)}
    <h1 class="sds-h2">Every answer says where it came from</h1>`,
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: 'Feature',
  },
};

export default meta;
type Story = StoryObj<EyebrowProps>;

/** Shown over the heading it belongs to: alone, an eyebrow is a word with
    nothing to say what kind of thing it opens. */
export const Default: Story = {};
