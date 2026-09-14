/* A block of facts, scanned down the terms.

   The markup lives in `src/components/facts.ts`. No `parameters.dsCard`. The
   block stands on the source page and the review, and the Copy card draws
   its class beside the values a reader takes away. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/facts.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/link.ts';
import { type FactsEntry, type FactsProps } from '../../packages/frontend/src/components/facts.ts';

const CHANGE: readonly FactsEntry[] = [
  { term: 'Change', value: html`<sds-link href="#change-1482" label="1482 · [BUGFIX] Cache label lookups for the length of a request"></sds-link>` },
  { term: 'Patch set', value: html`2 · <span class="sds-mono">3f9c2e1a7d0</span> · 3 files, +64 −9` },
  { term: 'Target', value: html`<span class="sds-mono">main</span> · <span class="sds-mono">2.4</span>` },
  { term: 'State', value: html`<sds-badge label="mergeable" tone="ok"></sds-badge>`, note: 'no votes, no comments, no chain' },
];

/** The block as a page writes it: the pairs between the tags. */
export const sdsFacts = (entries: readonly FactsEntry[]) =>
  html`<sds-facts>${entries.map(({ term, value, note }) =>
    html`<dt>${term}</dt><dd>${value}${note ? html`<span class="sds-facts__note">${note}</span>` : ''}</dd>`)}</sds-facts>`;

const meta: Meta<FactsProps> = {
  title: 'Components/Facts',
  tags: ['autodocs', '!dev'],
  excludeStories: ['sdsFacts'],
  render: ({ entries }) => html`<sds-facts .entries="${entries ?? []}"></sds-facts>`,
  args: { entries: CHANGE },
};

export default meta;
type Story = StoryObj<FactsProps>;

/** The pairs as data. A value that is only a string, a value with markup,
    and one with the line about it that is not part of it. */
export const Entries: Story = {};

/** The same block written out, which is the form a value with a link, a
    badge or a literal takes on a page. */
export const Written: Story = {
  render: () => sdsFacts(CHANGE),
};
