/* Empty and not-found, as the States guideline shows them.

   Two boundaries that look alike and are not: one where the source was asked
   and answered with nothing, one where the question is outside what this server
   covers. Both say which source was reached, because "no results" without that
   cannot be told from a failure.

   Drawn by `sds-empty` rather than by this file — a filtered list, a search and
   a page that does not exist all need the same box, and the difference between
   the two kinds is one the component has a name for. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/empty.ts';
import { type EmptyProps } from '../../packages/frontend/src/components/empty.ts';
import { dsCard, indent, part, specPad } from '../lib/specimen.ts';

const BOX = 'flex:1; min-width:280px;';

const empty = ({ kind = 'quiet', heading, body, action, href, meta }: EmptyProps): string =>
  part(html`<sds-empty
  kind="${kind}"
  heading="${heading}"
  .body="${body}"
  action="${action ?? ''}"
  href="${href ?? ''}"
  meta="${meta ?? ''}"
  box-style="${BOX}"
></sds-empty>`);

/** The identifier does not exist — and the closest one that does. */
const notFound = (): string =>
  empty({
    kind: 'quiet',
    heading: 'No icon matches “dashbord”',
    body: html`The installation was asked and answered; the identifier does not exist in
      it. Closest registered: <span class="sds-mono">actions-dashboard</span>.`,
    action: 'Search all registered icons',
    href: '#',
  });

/** The question is outside the server's scope — stated, not left silent. */
const outOfScope = (): string =>
  empty({
    kind: 'boundary',
    heading: 'Outside what this server covers',
    body: 'Frontend rendering has no bundled answer and is not read from the installation. Stated as a boundary rather than left silent.',
    meta: 'typo3_server_scope · boundaries',
  });

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
      viewport: '700x276',
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
