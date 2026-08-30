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

/** The words dropped, the marks left standing. Set by whatever is short of
    room — in a bar that is `sds-nav-main`, which sheds these two words before it
    sheds anything a reader came for. The word is still said to a reader who
    cannot see the mark. */
export const Compact: Story = {
  render: () => html`<sds-theme compact></sds-theme>`,
};
