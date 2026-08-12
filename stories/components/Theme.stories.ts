/* The colour mode switch.

   The markup lives in `src/components/theme.ts`. Two segments with the chosen
   one filled — the same treatment as an active navigation item, because it is
   one. Never a switch and never a moon: a switch says on-or-off about a thing
   with three states, and a moon says either which mode you are in or which one
   you would get. No `parameters.dsCard`: it is drawn on the documentation
   page. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/theme.ts';

const meta: Meta = {
  title: 'Components/Theme',
  tags: ['autodocs', '!dev'],
};

export default meta;
type Story = StoryObj;

/** Press one and the document follows; press the current one and the machine
    gets its say back. That third state is the default most readers are on, and
    a control with no way back to it takes it away. Storybook's toolbar writes
    `data-theme` too, so the two disagree here. */
export const Default: Story = {
  render: () => html`<sds-theme></sds-theme>`,
};

/** Two products on one origin are two keys. The default is `theme`. */
export const OwnKey: Story = {
  render: () => html`<sds-theme key="companion-theme"></sds-theme>`,
};
