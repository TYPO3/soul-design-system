/* The bar at the top of a page, and its run-width.

   The markup lives in `src/components/header.ts`. A row while there is room for
   one; a button and a drawer holding what there was not — decided by measuring
   rather than by a breakpoint set for every surface at once.

   Drag the canvas narrower and watch it change its mind: the mode pair drops
   its words first, then the field goes, then the sections, and on a page with a
   rail that rail joins them. No `parameters.dsCard`: a card is a still picture,
   and the whole of this is what happens between two widths. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/header.ts';
import '../../packages/frontend/src/components/rail.ts';

const SIGNET = '../assets/design-system-signet-m.svg';

const SECTIONS = [
  { label: 'overview', href: '#overview' },
  { label: 'foundations', href: '#foundations' },
  { label: 'components', href: '#components' },
  { label: 'install', href: '#install' },
];

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
    <div class="sds-stack sds-stack--tight">
      <h1 class="sds-h3">A page under the bar</h1>
      <p>Narrow the canvas until the button appears, then press it: what the row could not hold is in one drawer over this page.</p>
    </div>
  </main>`;

const meta: Meta = {
  title: 'Components/Header',
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
    html`<sds-header
    home="#overview"
    signet="${SIGNET}"
    brand="TYPO3"
    product="Soul Design System"
    version="0.1.0-dev"
    search
    .items="${SECTIONS}"
    active="0"
  ></sds-header>`,
    sentence,
  ),
};

/** The same row, written by a server instead of passed as a property. A
    rendered site resolves its own links before the page is sent, so it writes
    the pills and the element takes them over: without the script they are still
    a row of links, with it they fold like any other. Same class either way. */
export const WrittenByAServer: Story = {
  render: () => under(
    html`<sds-header home="#overview" signet="${SIGNET}" brand="TYPO3" product="Soul Design System" version="0.1.0-dev">
    <a class="sds-pill" href="#overview">overview</a>
    <a class="sds-pill" href="#foundations">foundations</a>
    <a class="sds-pill is-active" href="#components" aria-current="page">components</a>
    <a class="sds-pill" href="#install">install</a>
  </sds-header>`,
    sentence,
  ),
};

/** Eleven sections rather than four. Nothing about the fold is declared, so a
    longer set simply folds sooner. */
export const ManySections: Story = {
  render: () => under(
    html`<sds-header
    home="#overview"
    signet="${SIGNET}"
    brand="TYPO3"
    product="Soul Design System"
    .items="${['overview', 'tokens', 'type', 'colours', 'icons', 'spacing', 'components', 'patterns', 'pages', 'decisions', 'install']}"
    active="0"
  ></sds-header>`,
    sentence,
  ),
};

/** With a page below it that has a rail. The rail is the page's own navigation
    and stands in its column while there is one; below the width where the body
    stacks it moves into the same drawer as the sections — one button, and the
    whole way out of this page behind it. */
export const WithAPageRail: Story = {
  render: () => under(
    html`<sds-header
    home="#overview"
    signet="${SIGNET}"
    brand="TYPO3"
    product="Soul Design System"
    search
    rail="page-rail"
    .items="${SECTIONS}"
    active="2"
  ></sds-header>`,
    html`<div class="sds-body">
    <aside class="sds-body__rail" id="page-rail">
      <sds-rail
        label="Components"
        .items="${['sds-badge', 'sds-button', 'sds-header', { label: 'navigation', items: ['sds-pills', 'sds-rail'] }]}"
        active="2"
      ></sds-rail>
    </aside>
    <main class="sds-column" id="main-content">
      <h1 class="sds-h3">sds-header</h1>
      <p>Narrow the canvas until the rail loses its column, then press the one button in the bar.</p>
    </main>
  </div>`,
  ),
};
