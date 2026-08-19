/* The bar at the top of a page, and its run-width.

   The markup lives in `src/components/header.ts`. A row while there is room for
   one; a button and a drawer holding what there was not — decided by measuring
   rather than by a breakpoint set for every surface at once.

   Drag the canvas narrower and watch it change its mind: the mode pair drops
   its words first, then the field goes, then the sections — and what the drawer
   opens is the whole menu, not the row it could not hold. No
   `parameters.dsCard`: a card is a still picture, and the whole of this is what
   happens between two widths. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/nav-main.ts';
import { type MenuEntry } from '../../packages/frontend/src/components/nav-base.ts';

const SIGNET = '../assets/design-system-signet-m.svg';

const SECTIONS = [
  { label: 'overview', href: '#overview' },
  { label: 'foundations', href: '#foundations' },
  { label: 'components', href: '#components' },
  { label: 'install', href: '#install' },
];

/* The same sections, as the site: one entry with everything under it, which is
   what a rendered page hands its bar. */
const MENU: MenuEntry = {
  label: 'Soul Design System',
  items: [
    { label: 'overview', href: '#overview' },
    {
      label: 'foundations',
      href: '#foundations',
      items: [
        { label: 'Colours', href: '#colours' },
        { label: 'Type', href: '#type' },
        { label: 'Spacing and layout', href: '#spacing' },
      ],
    },
    {
      label: 'components',
      href: '#components',
      here: true,
      items: [
        { label: 'sds-badge', href: '#badge' },
        { label: 'sds-button', href: '#button' },
        { label: 'sds-nav-main', href: '#header', current: true },
        { label: 'sds-nav-rail', href: '#rail' },
      ],
    },
    { label: 'install', href: '#install' },
  ],
};

/* A bar with nothing under it is half a specimen: the drawer opens over the
   page, so a story with no page is a panel that has nowhere to go and a box
   that scrolls instead. The height is the drawer's room, and it is written
   here rather than in the system — no page owes a header a minimum. */
const under = (bar: TemplateResult, body: TemplateResult): TemplateResult =>
  html`<div class="sds-shell" style="min-height: 420px">
  ${bar}
  ${body}
</div>`;

const sentence = html`<main class="sds-page" id="main-content">
    <h1 class="sds-h3">A page under the bar</h1>
    <p>Narrow the canvas until the button appears, then press it: what the row could not hold is in one drawer over this page.</p>
  </main>`;

const meta: Meta = {
  title: 'Components/Nav main',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

/** Everything a bar carries: the mark, the sections, the version of what is
    being read, a search and the mode pair. What the row cannot hold goes into
    the drawer in that order — the field before the sections, because a field
    squeezed to a stub is a control that is there and cannot be used. */
export const Bar: Story = {
  render: () => under(
    html`<sds-nav-main
    home="#overview"
    signet="${SIGNET}"
    brand="TYPO3"
    product="Soul Design System"
    search
    .items="${SECTIONS}"
    active="0"
  ></sds-nav-main>`,
    sentence,
  ),
};

/** The bar above with no brand set. One name is the whole mark, so it takes the
    mark's full weight rather than the quiet weight a product carries beside a
    brand — and there is no pipe, the accent rule having nothing to separate.
    The bar at its narrowest hides the brand and lands on this same lockup. */
export const NoBrand: Story = {
  render: () => under(
    html`<sds-nav-main
    home="#overview"
    signet="${SIGNET}"
    product="Soul Design System"
    search
    .items="${SECTIONS}"
    active="0"
  ></sds-nav-main>`,
    sentence,
  ),
};

/** The same row, written by a server instead of passed as a property. A
    rendered site resolves its own links before the page is sent, so it writes
    the pills and the element takes them over: without the script they are still
    a row of links, with it they fold like any other. Same class either way. */
export const WrittenByAServer: Story = {
  render: () => under(
    html`<sds-nav-main home="#overview" signet="${SIGNET}" brand="TYPO3" product="Soul Design System">
    <a class="sds-pill" href="#overview">overview</a>
    <a class="sds-pill" href="#foundations">foundations</a>
    <a class="sds-pill is-active" href="#components" aria-current="page">components</a>
    <a class="sds-pill" href="#install">install</a>
  </sds-nav-main>`,
    sentence,
  ),
};

/** Eleven sections rather than four. Nothing about the fold is declared, so a
    longer set simply folds sooner. */
export const ManySections: Story = {
  render: () => under(
    html`<sds-nav-main
    home="#overview"
    signet="${SIGNET}"
    brand="TYPO3"
    product="Soul Design System"
    .items="${['overview', 'tokens', 'type', 'colours', 'icons', 'spacing', 'components', 'patterns', 'pages', 'decisions', 'install']}"
    active="0"
  ></sds-nav-main>`,
    sentence,
  ),
};

/** Given the site rather than a row of links: one entry with its sections
    under it, each with its own pages. A section that holds pages carries the
    marker that opens them under the row, and the same entry is the whole tree
    the drawer opens once the row has given the sections up — the bar draws as
    much of the one list as the width allows. */
export const WithAMenu: Story = {
  render: () => under(
    html`<sds-nav-main
    home="#overview"
    signet="${SIGNET}"
    brand="TYPO3"
    product="Soul Design System"
    search
    .menu="${MENU}"
  ></sds-nav-main>`,
    html`<main class="sds-page" id="main-content">
    <h1 class="sds-h3">sds-header</h1>
    <p>Press the marker beside a section to open its pages, then narrow the canvas until the one button is all that is left.</p>
  </main>`,
  ),
};
