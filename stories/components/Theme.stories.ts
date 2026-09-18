/* The colour mode switch.

   The markup lives in `src/components/theme.ts`. One press that changes the
   mode, drawn as the system's own icon button. The mark is the mode in force
   and the `title` is what a press will do. So the sentence reaches a reader
   who cannot see the mark and the one who hovers it alike. No
   `parameters.dsCard`: it stands on the documentation page. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/theme.ts';

const meta: Meta = {
  title: 'Components/Theme/Theme',
  tags: ['autodocs', '!dev'],
};

export default meta;
type Story = StoryObj;

/** One press steps to the next of three: the machine's setting, light, dark,
    and round again. The machine's is the default most readers are on. So it
    is a stop on the way rather than something only a cleared key gives back.
    A control that reaches two of its three states takes the default away
    from whoever tries it once. Storybook's toolbar writes `data-theme` too,
    so the two disagree here. */
export const Default: Story = {
  render: () => html`<sds-theme></sds-theme>`,
};

/** Two products on one origin are two keys. The default is `theme`. */
export const OwnKey: Story = {
  render: () => html`<sds-theme key="companion-theme"></sds-theme>`,
};
