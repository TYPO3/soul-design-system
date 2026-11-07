/* A wall of marks.

   The markup lives in `src/components/logos.ts`. The story uses the marks of
   this system, because a mark of somebody else is a licence question. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/logos.ts';
import { type LogosProps } from '../../packages/frontend/src/components/logos.ts';
import { dsCard, DIVIDER, part, spec, specCap } from '../lib/specimen.ts';

const MARKS = html`<img src="assets/typo3-logo.svg" alt="TYPO3" />
  <img src="assets/design-system-signet-m.svg" alt="Soul Design System" />
  <a href="#companion"><img src="assets/dev-companion-signet-m.svg" alt="Dev Companion" /></a>
  <img src="assets/tryout-signet-m.svg" alt="Tryout" />`;

/* A wall of marks that runs over rows. The marks repeat, because this system
   has only these few of its own. */
const FILES = ['typo3-logo', 'design-system-signet-m', 'dev-companion-signet-m', 'tryout-signet-m'];
const MANY = html`${Array.from({ length: 15 }, (_, i) => html`<img src="assets/${FILES[i % FILES.length]}.svg" alt="Project ${i + 1}" />`)}`;

const meta: Meta<LogosProps> = {
  title: 'Components/Content/Logos',
  tags: ['autodocs', '!dev'],
  excludeStories: ['specimenHtml'],
  render: ({ label }) => html`<sds-logos label="${label ?? ''}">${MARKS}</sds-logos>`,
  argTypes: { label: { control: 'text' } },
  args: { label: 'Used by' },
  parameters: {
    dsCard: dsCard({
      path: 'components/content/logos.card.html',
      name: 'Logos',
      subtitle: 'A wall of marks, each in the ink of the page',
      viewport: '700x620',
    }),
  },
};

export default meta;
type Story = StoryObj<LogosProps>;

/** With the line that says what the marks have in common. */
export const Default: Story = {};

/** No label, where the heading above already says it. */
export const NoLabel: Story = { name: 'No label', args: { label: '' } };

/** Many marks. The wall grows by rows. Every cell keeps one width, and a short
    last row keeps it too, so the columns stay straight. */
export const Many: Story = {
  render: () => html`<sds-logos label="Used by">${MANY}</sds-logos>`,
};

/** Many marks in a narrow box. Fewer stand across, and none runs out. */
export const ManyInANarrowBox: Story = {
  name: 'Many, in a narrow box',
  render: () => html`<div style="max-width:320px"><sds-logos label="Used by">${MANY}</sds-logos></div>`,
};

export const specimenHtml = (): string =>
  spec([
    part(html`<sds-logos label="Used by">${MARKS}</sds-logos>`),
    specCap('A MARK IS A PICTURE · IT TAKES THE INK OF THE PAGE IN BOTH MODES · ALT IS ITS NAME'),
    part(html`<sds-logos label="Used by">${MANY}</sds-logos>`),
    specCap('MANY MARKS · THE WALL GROWS BY ROWS · A SHORT LAST ROW KEEPS THE WIDTH OF THE CELLS', DIVIDER),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
