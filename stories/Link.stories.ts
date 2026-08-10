/* Links.

   The markup lives in `src/components/link.ts`. No `parameters.dsCard`:
   links are shown on the buttons card, next to the controls they sit among,
   because that is the comparison worth documenting — when a thing is a
   button and when it is a link.

   A link always sets in the type around it. `sds-link` sets colour and
   hover and nothing else, so it reads at 15px among controls and at 17px in
   body copy without any caller pinning a size. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../src/components/link.ts';
import { type LinkProps } from '../src/components/link.ts';

const meta: Meta<LinkProps> = {
  title: 'Components/Link',
  tags: ['autodocs'],
  render: ({ label, href = '#', external = false }) =>
    html`<sds-link label="${label}" href="${href}" ?external="${external}"></sds-link>`,
  argTypes: {
    label: { control: 'text' },
    href: { control: 'text' },
    external: { control: 'boolean' },
  },
  args: { label: 'typo3_server_scope', href: '#', external: false },
};

export default meta;
type Story = StoryObj<LinkProps>;

/** A tool name is a machine-named thing, so it sets in mono wherever it
    appears — including inside a link. */
export const Default: Story = { args: { label: 'typo3_server_scope' } };

/* No `Hovered` story. The state exists under the pointer — hover the link
   above and it is there. The specimen card paints it instead, because a card
   is a still picture; that painting lives in `_specimen.css` and not in the
   component. */

/** Away from this surface. It carries `actions-window-open` after the label
    — the one direction icon that follows rather than leads — and says the
    same thing to the browser with `target` and `rel`. */
export const External: Story = { args: { label: 'docs.typo3.org', href: 'https://docs.typo3.org', external: true } };
