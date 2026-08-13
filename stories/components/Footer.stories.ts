/* The end of a page, in the two shapes an ending has.

   The markup lives in `src/components/footer.ts`. No `parameters.dsCard`: a
   footer is the full width of a page and a card is a fragment at a fixed size,
   so what a card would show is a footer at the wrong measure. `Pages/Feature`
   shows it at the one it is built for.

   One shape, and less of it where a page has less to say: the stories below
   are the same element with parts left unset, not variants of it. A screen
   with no site around it sets a name, a sentence and the way out, and what it
   did not set is not there. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/footer.ts';
import '../../packages/frontend/src/components/link.ts';
import { type FooterProps } from '../../packages/frontend/src/components/footer.ts';
import { SITE_GROUPS, SITE_META, SITE_NOTE } from '../lib/site.ts';

/* The same links the `Community` column carries, read out of it rather than
   copied: the two placements are a choice, and a footer that says where the
   site lives twice over has made it twice. */
const SITE_MARKS = SITE_GROUPS.find((group) => group.label === 'Community')?.items ?? [];

const sdsFooter = ({ groups, note, meta: end, marks, copyright, signet, brand, product }: FooterProps) =>
  html`<sds-footer .groups="${groups}" note="${note}" .meta="${end ?? []}" .marks="${marks ?? []}"
    copyright="${copyright ?? ''}"
    signet="${signet ?? ''}" brand="${brand ?? ''}" product="${product ?? ''}"></sds-footer>`;

const meta: Meta<FooterProps> = {
  title: 'Components/Footer',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'fullscreen' },
  render: (args) => sdsFooter(args),
  argTypes: {
    groups: { control: 'object' },
    note: { control: 'text' },
    meta: { control: 'object' },
    marks: { control: 'object' },
    copyright: { control: 'text' },
    signet: { control: 'text' },
    brand: { control: 'text' },
    product: { control: 'text' },
  },
  args: {
    groups: SITE_GROUPS,
    note: SITE_NOTE,
    meta: SITE_META,
    marks: SITE_MARKS,
    copyright: '© 2026 the Dev Companion authors',
    signet: '/assets/design-system-signet-m.svg',
    brand: 'TYPO3',
    product: 'Dev Companion',
  },
};

export default meta;
type Story = StoryObj<FooterProps>;

/** Everything this component places, in the order it places it: the lockup and
    the sentence beside the columns, and under them the closing line — the
    copyright first, the notices that travel with it next, the marks at the far
    end, which is where a reader looks for them by position. The columns reflow
    by their own minimum, so nothing here decides how many fit on a phone. */
export const Default: Story = {};

/** Two columns. The grid does not stretch them across the measure — a footer
    of two lists set 400px apart reads as two footers. */
export const Few: Story = {
  args: { groups: SITE_GROUPS.slice(0, 2), meta: [] },
};

/** The same accounts as a column instead, which is the other place they may
    go — and there they are labelled links: a column is read, where the row at
    the end of the line is looked for. Each glyph leads its label and
    `actions-window-open` follows it, saying the link leaves the site. */
export const MarksAsColumn: Story = {
  args: { groups: SITE_GROUPS.slice(3, 4), meta: [], marks: [] },
};

/** Without the trailing links. The note stays: it is the one part of this
    component a page may not leave out, and the closing line goes with them
    rather than leaving a rule across the page under nothing. */
export const NoteOnly: Story = { args: { meta: [], marks: [], copyright: '' } };

/** No mark configured. The block is still there and still says what this is —
    a site with no signet is a site, and the sentence is what the reader who
    scrolled this far came for. */
export const Unmarked: Story = { args: { signet: '', brand: '', product: '' } };

/** The closing line as the whole footer: whose it is, what has to travel with
    it, and where else it lives. Nothing is set above it, so there is no block
    above it — right for a surface that has already said what it is further up
    the page, and for a site whose sections are in the bar rather than here. */
export const Closing: Story = {
  args: { groups: [], note: '', signet: '', brand: '', product: '' },
};

/** The same line without the notice, for a page that carries its licence
    somewhere a reader can act on it. The marks stay at the far end: there is
    still a line for them to be at the end of. */
export const ClosingUnclaimed: Story = {
  args: { groups: [], note: '', signet: '', brand: '', product: '', copyright: '' },
};

/** The marks with nothing beside them on the line. They sit where the line
    starts rather than at its far end: alone there is nothing to be at the end
    *of*, and a set of marks against the right edge of a footer that says
    nothing else reads as something that lost what it belonged to. */
export const Marks: Story = {
  args: { groups: [], meta: [], copyright: '' },
};

/** A screen with no site around it: what it is, the sentence it owes, and the
    way out. Nothing else is set, so the columns, the mark and the notice are
    not there — the same element, and the ending a landing page gets. */
export const Screen: Story = {
  args: { groups: [], signet: '', brand: '', marks: [], copyright: '' },
};
