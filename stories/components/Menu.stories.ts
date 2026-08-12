/* The header navigation, and its run-width.

   The markup lives in `src/components/menu.ts`. Pills while the header has room
   for them, a toggle and a panel when it does not — decided by measuring rather
   than by a breakpoint set for every surface at once.

   Drag the canvas narrower and watch it change its mind; the width is not a
   number written anywhere. No `parameters.dsCard`: a card is a still picture,
   and the whole of this is what happens between two widths. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/menu.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/image.ts';
import '../../packages/frontend/src/components/theme.ts';

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
      <sds-image class="sds-signet" src="../assets/design-system-signet-m.svg" alt="" width="24" height="24"></sds-image>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
    </a>
    <sds-menu label="Sections" .items="${SECTIONS}" active="0"></sds-menu>
    <div class="sds-bar__end">
      <sds-badge label="0.1.0-dev" tone="accent"></sds-badge>
      <sds-theme></sds-theme>
    </div>
  </header>`,
};

/** The same row, written by a server instead of passed as a property. A
    rendered site resolves its own links before the page is sent, so it writes
    the pills and the element takes them over: without the script they are still
    a row of links, with it they collapse like any other. Same class either
    way. */
export const WrittenByAServer: Story = {
  render: () => html`<header class="sds-bar">
    <a class="sds-lockup" href="#overview">
      <sds-image class="sds-signet" src="../assets/design-system-signet-m.svg" alt="" width="24" height="24"></sds-image>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
    </a>
    <sds-menu label="Sections">
      <a class="sds-pill" href="#overview">overview</a>
      <a class="sds-pill" href="#foundations">foundations</a>
      <a class="sds-pill is-active" href="#components" aria-current="page">components</a>
      <a class="sds-pill" href="#install">install</a>
    </sds-menu>
    <div class="sds-bar__end">
      <sds-badge label="0.1.0-dev" tone="accent"></sds-badge>
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
      <sds-image class="sds-signet" src="../assets/design-system-signet-m.svg" alt="" width="24" height="24"></sds-image>
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
