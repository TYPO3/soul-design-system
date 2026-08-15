/* The parts, in the three places a part ever stands.

   Beside the containers, and for the same reason: a part is the box the line
   around it lays out, and whether that is true can only be read where nothing
   else varies. A row of controls aligns them on one centre, a sentence gives
   each the height of its line, and a control beside a control makes both the
   same. Anything that disagrees with this card is markup, not the system. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/icon.ts';
import '../../packages/frontend/src/components/link.ts';
import { dsCard, part, spec, specRow } from '../lib/specimen.ts';

const meta: Meta = {
  title: 'Specimens/Spacing/Parts',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/spacing-parts.card.html',
      group: 'Spacing',
      name: 'Parts',
      subtitle: 'A part is the box the line around it lays out',
      viewport: '700x320',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec([
    specRow(
      [
        `<div class="sds-actions">
    ${part(buttonMarkup({ variant: 'primary' }, 'Run the checks'))}
    ${part(buttonMarkup({ variant: 'ghost' }, 'Cancel'))}
    ${part(html`<sds-link href="#" label="what it checks"></sds-link>`)}
    ${part(html`<sds-badge label="18 checks" tone="ok"></sds-badge>`)}
  </div>`,
      ],
      'a row of controls — one centre line, whatever the part is',
      { style: 'flex-direction: column; align-items: stretch;' },
    ),
    specRow(
      [
        `<p>A sentence with a ${part(html`<sds-badge label="draft"></sds-badge>`)} standing in it and a
    ${part(html`<sds-icon name="actions-search" size="16"></sds-icon>`)} in the middle of the line.
    A link belongs here too, and it is the document layer that draws one — see
    the type pages.</p>`,
      ],
      'in a sentence — each takes its line, and the line keeps its height',
      { divided: true, style: 'flex-direction: column; align-items: stretch;' },
    ),
    specRow(
      [
        `<div class="sds-actions">
    ${part(html`<sds-field label="Filter" value="dashboard" filled></sds-field>`)}
    ${part(buttonMarkup({ variant: 'secondary' }, 'Apply'))}
  </div>`,
      ],
      'beside a control — a field and a button are one height',
      { divided: true, style: 'flex-direction: column; align-items: stretch;' },
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
