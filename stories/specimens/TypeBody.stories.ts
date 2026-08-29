/* Body copy and the lead under a heading.

   The body register, held to its measure — which is part of the type, not a
   layout decision made later. The lead is one step up and held shorter, because
   a sentence that introduces a page is read at a glance and a long line in it
   is not glanceable.

   `text-wrap: pretty` on the body paragraph: it is the one place in this
   system where a widow would be visible, because the measure is fixed. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, specCap, specPad } from '../lib/specimen.ts';

const LEAD =
  'font-size:var(--font-size-lead); line-height:var(--leading-body); color:var(--text-secondary); max-width:var(--measure-lead);';
const BODY =
  'font-size:var(--font-size-body); line-height:var(--leading-body); color:var(--text-secondary); max-width:var(--measure-prose); margin-top:10px; text-wrap:pretty;';

const meta: Meta = {
  title: 'Specimens/Type/Body & lead',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/type-body.card.html',
      group: 'Type',
      name: 'Body & lead',
      subtitle: 'The lead and the body register, each held to its measure',
      viewport: '700x223',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad([
    `<div style="${LEAD}">A local MCP server in plain PHP for the three audiences that do TYPO3 work.</div>`,
    `<div style="${BODY}">Almost everything comes from the bundled knowledge files, which are bound to versions: a statement that does not hold on every covered line carries the ones it does.</div>`,
    specCap('--font-size-lead 19 · --font-size-body 16 · --leading-body 1.55 · --measure-prose 620px', 'margin-top:12px;'),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
