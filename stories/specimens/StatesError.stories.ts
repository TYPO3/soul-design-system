/* Errors and degraded answers, as the States guideline shows them.

   The card was hand-written HTML: three notes, each with its glyph pasted in
   as an SVG path. `sds-note` renders all three now, so what the guideline
   shows is what a product surface gets — and a change to the note arrives
   here without anybody editing this card.

   Not a page. No `autodocs`, so it stands in the sidebar as the still picture
   the guideline embeds rather than as documentation of the note — that is
   `Note.stories.ts`, where the component is read. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/note.ts';
import { type NoteProps } from '../../packages/frontend/src/components/note.ts';
import { dsCard, DIVIDER, part, spec } from '../lib/specimen.ts';

/** Three levels, three colours, one shape. */
const NOTES: readonly NoteProps[] = [
  {
    tone: 'warn',
    heading: 'The installation could not be booted — packages were read instead',
    body: html`Every registry answers with a subset that looks like the whole, so this answer omits anything a running extension would add. <span class="sds-mono">ddev start</span> would fix it.`,
  },
  {
    tone: 'error',
    heading: 'No project found at this working directory',
    body: html`Discovery looked for <span class="sds-mono">composer.json</span> and a TYPO3 package and found neither. Set <span class="sds-mono">TYPO3_SUPPORT_APP_PROJECT</span> to name it explicitly.`,
  },
  {
    tone: 'ok',
    heading: 'Answered from bundled knowledge · 12.4, 13.4',
    body: 'Holds on the lines named and not on 14.3. The version binding is part of the answer, not a footnote.',
  },
];

const note = ({ tone, heading, body }: NoteProps): TemplateResult =>
  html`<sds-note tone="${tone ?? 'info'}" heading="${heading}" .body="${body}"></sds-note>`;

const meta: Meta = {
  title: 'Specimens/States/Errors & degraded answers',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/states-error.card.html',
      group: 'States',
      name: 'Errors & degraded answers',
      subtitle: 'Never a bare failure — say what was reached, what was read instead, and what that leaves out',
      viewport: '700x472',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec(
    [
      ...NOTES.map((n) => part(note(n))),
      `<div class="spec-note" style="${DIVIDER} max-width:72ch;">Three levels, three colours, one shape. Warning is a degraded answer that is still useful. Error is no answer, with the command that would change that. Success is only ever shown when the <em>source</em> matters — never as praise.</div>`,
    ],
    { gap: '12px' },
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
