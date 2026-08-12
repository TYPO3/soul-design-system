/* The end of a site.

   The markup lives in `src/components/footer.ts`. No `parameters.dsCard`: a
   footer is the full width of a page and a card is a fragment at a fixed size,
   so what a card would show is a footer at the wrong measure. `Pages/Feature`
   shows it at the one it is built for.

   `sds-foot` is the other footer, and the difference is not decoration: one
   row is what a single screen owes its reader, and columns are what a site of
   many pages owes. Both are shown here so the choice is made by looking. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/footer.ts';
import '../../packages/frontend/src/components/link.ts';
import { type FooterProps } from '../../packages/frontend/src/components/footer.ts';
import { SITE_GROUPS, SITE_META, SITE_NOTE } from '../lib/site.ts';

const sdsFooter = ({ groups, note, meta: end, signet, brand, product }: FooterProps) =>
  html`<sds-footer .groups="${groups}" note="${note}" .meta="${end ?? []}"
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
    signet: { control: 'text' },
    brand: { control: 'text' },
    product: { control: 'text' },
  },
  args: {
    groups: SITE_GROUPS,
    note: SITE_NOTE,
    meta: SITE_META,
    signet: '/assets/design-system-signet-m.svg',
    brand: 'TYPO3',
    product: 'Dev Companion',
  },
};

export default meta;
type Story = StoryObj<FooterProps>;

/** The site's own columns, and the line under them. They reflow by their own
    minimum, so nothing here decides how many fit on a phone. */
export const Default: Story = {};

/** Two columns. The grid does not stretch them across the measure — a footer
    of two lists set 400px apart reads as two footers. */
export const Few: Story = {
  args: { groups: SITE_GROUPS.slice(0, 2), meta: [] },
};

/** The marks, alone in a column. Each one leads its label and the external
    glyph follows it: the brand says what the link is, `actions-window-open`
    says that pressing it leaves the site. */
export const Marks: Story = {
  args: { groups: SITE_GROUPS.slice(3, 4), meta: [] },
};

/** Without the trailing links. The note stays: it is the one part of this
    component a page may not leave out. */
export const NoteOnly: Story = { args: { meta: [] } };

/** No mark configured. The block is still there and still says what this is —
    a site with no signet is a site, and the sentence is what the reader who
    scrolled this far came for. */
export const Unmarked: Story = { args: { signet: '', brand: '', product: '' } };
