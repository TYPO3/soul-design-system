/* The header navigation, and its run-width.

   The markup lives in `src/components/menu.ts`. Pills while the header has
   room for them, a toggle and a panel below it when it does not — and the
   element decides which, by measuring, rather than a breakpoint deciding for
   every surface at once.

   Drag the Storybook canvas narrower on the story below and watch it change
   its mind. The width it changes at is not a number written anywhere: it is
   where these four words stop fitting beside this mark and this badge.

   No `parameters.dsCard`: a card is a still picture at a fixed width, and the
   whole of this component is what happens between two widths. It is drawn on
   the landing and documentation pages instead, which are live. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/menu.ts';
import '../../src/components/badge.ts';
import '../../src/components/signet.ts';
import '../../src/components/theme.ts';

const SECTIONS = [
  { label: 'overview', href: '#overview' },
  { label: 'foundations', href: '#foundations' },
  { label: 'components', href: '#components' },
  { label: 'install', href: '#install' },
];

const meta: Meta = {
  title: 'Components/Menu',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

/** In the bar it was made for: a mark on one side, a version and the mode
    switch on the other, and the navigation between them for as long as that
    fits. The panel is positioned against `.sds-bar`, which is why it belongs
    in one. */
export const InAHeader: Story = {
  render: () => html`<header class="sds-bar">
    <a class="sds-lockup" href="#overview">
      <sds-signet size="20"></sds-signet>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
    </a>
    <sds-menu label="Sections" .items="${SECTIONS}" active="0"></sds-menu>
    <div class="sds-bar__end">
      <sds-badge label="1.0.0" tone="accent"></sds-badge>
      <sds-theme></sds-theme>
    </div>
  </header>`,
};

/** The same element with nothing beside it. It stays a row far longer, which
    is the point: what it does depends on the header it is in, and no other
    surface has to be told what this one's header holds. */
export const Alone: Story = {
  render: () => html`<header class="sds-bar">
    <sds-menu label="Sections" .items="${SECTIONS}" active="0"></sds-menu>
  </header>`,
};

/** Eleven sections rather than four. Nothing about the collapse is declared,
    so a longer set simply collapses sooner. */
export const ManySections: Story = {
  render: () => html`<header class="sds-bar">
    <a class="sds-lockup" href="#overview">
      <sds-signet size="20"></sds-signet>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
    </a>
    <sds-menu
      label="Sections"
      .items="${['overview', 'tokens', 'type', 'colours', 'icons', 'spacing', 'components', 'patterns', 'pages', 'decisions', 'install']}"
      active="0"
    ></sds-menu>
    <div class="sds-bar__end">
      <sds-theme></sds-theme>
    </div>
  </header>`,
};
