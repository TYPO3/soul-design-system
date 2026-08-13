/* Empty and not found, as the States guideline shows them.

   One rule, two registers. A page that is not there says it as a page: the
   address that was asked is the headline. A list, a facet or a search drop that
   answered with nothing says it where the list would have been, as a note —
   `info`, because a source answering with nothing is a fact about the surface
   and nothing failed.

   What is not here is a component. An empty answer has no drawing of its own:
   it is the surface's own headline or the surface's own note, and what makes it
   an answer rather than a shrug is the sentences. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/note.ts';
import { dsCard, DIVIDER, part, spec } from '../lib/specimen.ts';

/** The page register: the address is the headline, what answered is the lead
    under it, and the label says which boundary this is. */
const asAPage = (): string =>
  part(html`<div>
  <span class="sds-label">404 · nothing at this address</span>
  <div class="sds-h3">There is no page at this address</div>
  <p>
    <span class="sds-mono">/tools/typo3_label_lookup/v2</span> was read and the site has nothing
    at it. Nothing here was removed — this path has never existed, so it is not a link that
    rotted but one that was never right.
  </p>
</div>`);

/** The in-list register: a source was asked, answered with nothing, and says
    what it does not cover. The glyph is the one the filter carries, so the
    reader is told which question came back empty. */
const inAList = (): string =>
  part(html`<sds-note
  tone="info"
  icon="actions-filter"
  label="Matched nothing"
  heading="Your installation was asked and answered with nothing"
  .body="${html`<p>
    It was reached and searched, and no label in it matches <span class="sds-mono">label</span>.
    Bundled knowledge holds four answers for the same query, which is what the other facets are.
  </p>
  <span class="sds-label">typo3_label_lookup · installation</span>`}"
></sds-note>`);

const meta: Meta = {
  title: 'Specimens/States/Empty & not found',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/states-empty.card.html',
      group: 'States',
      name: 'Empty & not found',
      subtitle: 'A boundary is an answer — say which source was asked and what it does not cover',
      viewport: '700x448',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec(
    [
      asAPage(),
      inAList(),
      `<div class="spec-note" style="${DIVIDER} max-width:72ch;">One rule in two registers. Never <em>no results</em>: name the source that was asked, say it answered, say what it does not cover, and offer the nearest real thing. A stated boundary is a deliberate answer and never takes a status colour — nothing failed.</div>`,
    ],
    { gap: '18px' },
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
