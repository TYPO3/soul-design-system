/* Finding a page in a site that has no server.

   The index is a file — a small JSON the build writes, fetched the first time
   somebody types — so the field belongs to sites that have one. There is none
   behind these stories, which is why typing here answers with the sentence a
   search with no hits gives: the one state a specimen can show without a build
   standing behind it.

   Its home is the bar, and `sds-nav-main` puts it there and takes it away again
   as the row runs out of room. No `parameters.dsCard`: what a card would hold
   is an empty text field. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/search.ts';
import '../../packages/frontend/src/components/nav-main.ts';

const meta: Meta = {
  title: 'Components/Search',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

/** The field on its own. It draws the drop under itself rather than under
    whatever box happens to be positioned above it, and the arrows walk the
    hits — a reader who has arrowed to one can open it like any other link. */
export const Field: Story = {
  render: () => html`<sds-search index="_search.json"></sds-search>`,
};

/** The box is `sds-field`, so it takes that element's three heights. `sm` is
    for a search inside another surface — a bar whose other controls are small —
    and the drop keeps the field's width whatever the height is. */
export const Sizes: Story = {
  render: () => html`<div style="display:flex; align-items:center; gap:var(--space-4)">
  <sds-search size="sm" index="_search.json" label="Search"></sds-search>
  <sds-search index="_search.json" label="Search"></sds-search>
  <sds-search size="lg" index="_search.json" label="Search"></sds-search>
</div>`,
};

/** Where it actually stands. The bar measures the row and the field is the
    first thing it can do without: below that width it is in the drawer, whole,
    rather than squeezed to a box too narrow to read what was typed in it. */
export const InTheBar: Story = {
  parameters: { layout: 'fullscreen' },
  /* With room under it: the hits drop over the page, and so does the drawer
     the field goes into. A bar with nothing below it is a panel with nowhere
     to open. */
  render: () => html`<div class="sds-shell" style="min-height: 420px">
  <sds-nav-main
    home="#overview"
    signet="../assets/design-system-signet-m.svg"
    brand="TYPO3"
    product="Soul Design System"
    index="_search.json"
    .items="${[
      { label: 'overview', href: '#overview' },
      { label: 'components', href: '#components' },
    ]}"
    active="0"
  ></sds-nav-main>
  <main class="sds-page" id="main-content">
    <p>Type in the field: with no index behind it the answer is the sentence a search with no hits gives.</p>
  </main>
</div>`,
};
