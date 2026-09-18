/* Links.

   The markup lives in `src/components/link.ts`. No `parameters.dsCard`. Links
   stand on the buttons card, next to the controls they sit among. That is
   the comparison that deserves a document — when a thing is a button and
   when it is a link.

   A link always sets in the type around it. `sds-link` sets colour and
   hover and nothing else. So it reads at 14px among controls and at 16px in
   body copy, and no caller pins a size. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../../packages/frontend/src/components/link.ts';
import { type LinkProps } from '../../packages/frontend/src/components/link.ts';

const meta: Meta<LinkProps> = {
  title: 'Components/Actions/Link',
  tags: ['autodocs', '!dev'],
  render: ({ label, href = '#', external = false, icon, bare = false }) =>
    html`<sds-link label="${label}" href="${href}" ?external="${external}" ?bare="${bare}" icon="${ifDefined(icon)}"></sds-link>`,
  argTypes: {
    label: { control: 'text' },
    href: { control: 'text' },
    external: { control: 'boolean' },
    bare: { control: 'boolean' },
    icon: {
      control: 'select',
      options: [undefined, 'actions-brand-github', 'actions-brand-slack', 'actions-brand-mastodon', 'actions-rss'],
    },
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

/** Away from this surface. It carries `actions-window-open` after the label,
    the one direction icon that follows rather than leads. And it says the
    same thing to the browser with `target` and `rel`. */
export const External: Story = { args: { label: 'docs.typo3.org', href: 'https://docs.typo3.org', external: true } };

/** A mark before the label, for the links a footer is the usual home of — a
    repository, a chat, a feed. The brand glyph leads because it says what the
    link *is*; the direction glyph follows because it says where a press goes.
    In a sentence or a column the label stays: a word a reader reads must not
    be a picture. */
export const WithMark: Story = {
  args: { label: 'Repository', href: 'https://github.com', external: true, icon: 'actions-brand-github' },
};

/** The mark alone, at 24 and with no glyph after it. For the row of accounts
    at the end of a footer, which a reader finds by position rather than
    reads. Its name is still on the element, as `aria-label` and as the
    tooltip a pointer gets. So anybody who needs the picture named can name
    it. */
export const Bare: Story = {
  args: { label: 'Repository', href: 'https://github.com', external: true, icon: 'actions-brand-github', bare: true },
};
