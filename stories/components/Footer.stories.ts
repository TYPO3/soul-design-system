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
import '../../src/components/footer.ts';
import '../../src/components/link.ts';
import { type FooterGroup, type FooterProps } from '../../src/components/footer.ts';

const sdsFooter = ({ groups, note, meta: end }: FooterProps) =>
  html`<sds-footer .groups="${groups}" note="${note}" .meta="${end ?? []}"></sds-footer>`;

/** The columns the site carries on every page. Exported so a page composes
    these rather than a copy that drifts one link at a time. */
export const SITE_GROUPS: readonly FooterGroup[] = [
  {
    label: 'Product',
    items: [
      { label: 'Overview', href: '#' },
      { label: 'Features', href: '#' },
      { label: 'Tool reference', href: '#' },
      { label: 'Releases', href: '#' },
    ],
  },
  {
    label: 'Documentation',
    items: [
      { label: 'Installing the server', href: '#' },
      { label: 'Writing a task skill', href: '#' },
      { label: 'Sources and preconditions', href: '#' },
      { label: 'docs.typo3.org', href: 'https://docs.typo3.org', external: true },
    ],
  },
  {
    label: 'Project',
    items: [
      { label: 'What is written down', href: '#' },
      { label: 'Reporting a wrong answer', href: '#' },
      { label: 'Contributing', href: '#' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { label: 'Licence', href: '#' },
      { label: 'Imprint', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
];

/** The line that has to be on every page of this site. It says what the
    product is; it never says whose it is. */
export const SITE_NOTE =
  'An independent development tool. Not a product of the TYPO3 Association, and not endorsed by it.';

const meta: Meta<FooterProps> = {
  title: 'Components/Footer',
  tags: ['autodocs', '!dev'],
  excludeStories: ['SITE_GROUPS', 'SITE_NOTE'],
  parameters: { layout: 'fullscreen' },
  render: (args) => sdsFooter(args),
  argTypes: {
    groups: { control: 'object' },
    note: { control: 'text' },
    meta: { control: 'object' },
  },
  args: {
    groups: SITE_GROUPS,
    note: SITE_NOTE,
    meta: [{ label: 'GPL-2.0-or-later', href: '#' }, { label: 'v1.0.0', href: '#' }],
  },
};

export default meta;
type Story = StoryObj<FooterProps>;

/** Four columns, and the line under them. The columns reflow by their own
    minimum, so nothing here decides how many fit on a phone. */
export const Default: Story = {};

/** Two columns. The grid does not stretch them across the measure — a footer
    of two lists set 400px apart reads as two footers. */
export const Few: Story = {
  args: { groups: SITE_GROUPS.slice(0, 2), meta: [] },
};

/** Without the trailing links. The note stays: it is the one part of this
    component a page may not leave out. */
export const NoteOnly: Story = { args: { meta: [] } };
