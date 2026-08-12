/* The breadcrumb trail.

   The markup lives in `src/components/crumbs.ts`. No `parameters.dsCard`: a
   trail is four words and two slashes, and a card of it would show the type
   scale a second time. Where it belongs is above a page title, which is what
   `Pages/Feature` shows it doing.

   The stories worth having are the two edges — a trail one step deep, and one
   deep enough to wrap — because everything between them is the same row. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/crumbs.ts';
import { type Crumb, type CrumbsProps } from '../../packages/frontend/src/components/crumbs.ts';

const sdsCrumbs = ({ items, label }: CrumbsProps) =>
  html`<sds-crumbs .items="${items}" label="${label ?? 'Breadcrumb'}"></sds-crumbs>`;

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Features', href: '#' },
  { label: 'Answers carry their source' },
];

const meta: Meta<CrumbsProps> = {
  title: 'Components/Crumbs',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsCrumbs(args),
  argTypes: {
    items: { control: 'object' },
    label: { control: 'text' },
  },
  args: { items: TRAIL, label: 'Breadcrumb' },
};

export default meta;
type Story = StoryObj<CrumbsProps>;

/** The usual depth. The last entry is the page, so it is text and not a
    link — and it says `aria-current="page"` rather than leaving that to be
    inferred from its position. */
export const Default: Story = { args: { items: TRAIL } };

/** One step up from the front page. A trail this short still earns its place:
    it says which section the page belongs to, which the title alone does not. */
export const Shallow: Story = {
  args: { items: [{ label: 'Overview', href: '#' }, { label: 'Features' }] },
};

/** Deep enough to wrap on a narrow screen — two lines, and nothing clipped. A
    trail that is cut short is a lie about where the reader is. */
export const Deep: Story = {
  args: {
    items: [
      { label: 'Overview', href: '#' },
      { label: 'Features', href: '#' },
      { label: 'Answering', href: '#' },
      { label: 'Sources', href: '#' },
      { label: 'Answers carry their source' },
    ],
  },
};

/** An href a caller left off the last entry is ignored: the end of a trail is
    the page it is on, whatever it was given. */
export const LastIsNeverALink: Story = {
  args: { items: [{ label: 'Overview', href: '#' }, { label: 'Features', href: '#pretend' }] },
};
