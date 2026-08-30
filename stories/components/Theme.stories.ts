/* The colour mode switch.

   The markup lives in `src/components/theme.ts`. One press that changes the
   mode, drawn as the system's own icon button: the mark is the mode in force
   and the `title` is what pressing will do, so the sentence reaches a reader
   who cannot see the mark and the one hovering it alike. No `parameters.dsCard`:
   it is drawn on the documentation page. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/theme.ts';

const meta: Meta = {
  title: 'Components/Theme',
  tags: ['autodocs', '!dev'],
};

export default meta;
type Story = StoryObj;

/** One press steps to the next of three: the machine's setting, light, dark,
    and round again. The machine's is the default most readers are on, so it is
    a stop on the way rather than something only a cleared key gives back — a
    control that reaches two of its three states takes the default away from
    whoever tries it once. Storybook's toolbar writes `data-theme` too, so the
    two disagree here. */
export const Default: Story = {
  render: () => html`<sds-theme></sds-theme>`,
};

/** Two products on one origin are two keys. The default is `theme`. */
export const OwnKey: Story = {
  render: () => html`<sds-theme key="companion-theme"></sds-theme>`,
};
