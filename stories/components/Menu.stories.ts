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
import '../../src/components/image.ts';
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
      <sds-image class="sds-signet" src="../assets/design-system-signet-m.svg" alt="" width="24" height="24"></sds-image>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
    </a>
    <sds-menu label="Sections" .items="${SECTIONS}" active="0"></sds-menu>
    <div class="sds-bar__end">
      <sds-badge label="1.0.0" tone="accent"></sds-badge>
      <sds-theme></sds-theme>
    </div>
  </header>`,
};

/** The same row, written by a server instead of passed as a property.

    A rendered site resolves its own links before the page is sent — where each
    one points from this page, and which one the reader is on — so it writes
    the pills and the element takes them over. Without the script they are
    still a row of links; with it they collapse like any other. Nothing here is
    a second way to say what a pill is: it is the same class the element emits.
  */
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
