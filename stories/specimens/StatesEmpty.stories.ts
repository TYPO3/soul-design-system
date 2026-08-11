/* Empty and not-found, as the States guideline shows them.

   Two boundaries that look alike and are not: one where the source was asked
   and answered with nothing, one where the question is outside what this
   server covers at all. Both say which source was reached, because "no
   results" without that is indistinguishable from a failure.

   The glyphs come from the sprite through `sds-icon`; the two boxes are the
   card's own drawing — an empty state is a shape a page composes, not a
   component with properties to vary. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../src/components/icon.ts';
import { type IconId } from '../../src/components/icon.ts';
import { dsCard, indent, part, specPad } from '../lib/specimen.ts';

const BOX =
  'flex:1; min-width:280px; border:1px solid var(--border-subtle); border-radius:var(--radius-card); padding:20px 18px; display:flex; flex-direction:column; gap:10px; align-items:flex-start;';

const icon = (name: IconId, size: 16 | 24 = 16): string =>
  part(html`<sds-icon name="${name}" size="${size}"></sds-icon>`);

/** The identifier does not exist — and the closest one that does. */
const notFound = (): string =>
  `<div style="${BOX}">
  <span style="color:var(--text-muted);">${icon('actions-search', 24)}</span>
  <div style="font-size:16px; font-weight:600;">No icon matches “dashbord”</div>
  <div class="spec-note" style="max-width:40ch;">The installation was asked and answered; the identifier does not exist in it. Closest registered: <span class="sds-mono" style="color:var(--text-link);">actions-dashboard</span>.</div>
  <span style="display:inline-flex; align-items:center; gap:7px; font-size:14px; color:var(--text-link); margin-top:2px;">Search all registered icons ${icon('actions-arrow-right')}</span>
</div>`;

/** The question is outside the server's scope — stated, not left silent. */
const outOfScope = (): string =>
  `<div style="${BOX}">
  <span style="color:var(--text-accent-quiet);">${icon('actions-info-circle', 24)}</span>
  <div style="font-size:16px; font-weight:600;">Outside what this server covers</div>
  <div class="spec-note" style="max-width:40ch;">Frontend rendering has no bundled answer and is not read from the installation. Stated as a boundary rather than left silent.</div>
  <span class="spec-cap" style="margin-top:2px;">typo3_server_scope · BOUNDARIES</span>
</div>`;

const meta: Meta = {
  title: 'Specimens/States/Empty & not found',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/states-empty.card.html',
      group: 'States',
      name: 'Empty & not found',
      subtitle: 'A boundary is an answer — say which source was asked and what it does not cover',
      viewport: '700x240',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad([indent([notFound(), outOfScope()].join('\n'), 0)], 'display:flex; gap:14px; flex-wrap:wrap;');

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
