/* The colour mode switch.

   The markup lives in `src/components/theme.ts`. Two segments with the chosen
   one filled — the same treatment as an active navigation item, because it is
   one: a set of choices with one of them current.

   Never a switch and never a moon. A switch says on-or-off about a thing that
   has three states, and a moon says either which mode you are in or which one
   you would get, depending on who is reading it.

   No `parameters.dsCard`: it is drawn on the documentation page, in the header
   where it belongs. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/theme.ts';

const meta: Meta = {
  title: 'Components/Theme',
  tags: ['autodocs', '!dev'],
};

export default meta;
type Story = StoryObj;

/** Press one and the document follows; press the one that is current and the
    machine gets its say back. That third state is the default and the one
    most readers are on, and a control with no way back to it takes it away
    the moment anybody presses anything.

    Storybook's own toolbar writes `data-theme` too, so the two will disagree
    here — the toolbar is the harness, this is the page. */
export const Default: Story = {
  render: () => html`<sds-theme></sds-theme>`,
};

/** Two products on one origin are two keys. The default is `theme`. */
export const OwnKey: Story = {
  render: () => html`<sds-theme key="companion-theme"></sds-theme>`,
};
