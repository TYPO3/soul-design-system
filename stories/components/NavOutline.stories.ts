/* The parts of a long document, beside it.

   The markup lives in `src/components/nav-outline.ts`, over the contract
   every navigation in the system shares in `nav-base.ts`. The whole tree of
   a document with more places than a window is tall, in the panel that is
   the document's frame. Each entry numbered from its place. It reads the
   page for where the reader is, as the contents beside a column does.

   No `parameters.dsCard`: the panel is where it does its work, and the
   concept screen under `Pages` shows it there. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/nav-outline.ts';
import { type MenuEntry } from '../../packages/frontend/src/components/nav-base.ts';

interface OutlineArgs {
  label: string;
  numbered: boolean;
  entries: MenuEntry[];
}

const PARTS: MenuEntry[] = [
  { label: 'Purpose', href: '#purpose', items: [
    { label: 'What this paper decides', href: '#decides' },
    { label: 'What it leaves out', href: '#leaves-out' },
  ] },
  { label: 'Where it stands', href: '#stands', current: true, items: [
    { label: 'The status page', href: '#status-page' },
    { label: 'The page of a source', href: '#source-page' },
  ] },
  { label: 'Findings', href: '#findings' },
  { label: 'The proposal', href: '#proposal', items: [
    { label: 'A record, not a history', href: '#record' },
    { label: 'Where it shows', href: '#shows' },
  ] },
  { label: 'Decision', href: '#decision' },
];

const meta: Meta<OutlineArgs> = {
  title: 'Components/Navigation/Nav outline',
  tags: ['autodocs', '!dev'],
  render: ({ label, numbered, entries }) =>
    html`<div style="width:300px"><sds-nav-outline label="${label}" ?numbered="${numbered}" .entries="${entries}"></sds-nav-outline></div>`,
  argTypes: {
    label: { control: 'text' },
    numbered: { control: 'boolean' },
    entries: { control: 'object' },
  },
  args: {
    label: 'Contents',
    numbered: true,
    entries: PARTS,
  },
};

export default meta;
type Story = StoryObj<OutlineArgs>;

/** Every part and every section, each with its number, and the part the
    data marks current. The number is text in the row, so it is in the name
    the row has out loud. */
export const Default: Story = {};

/** The same tree with no numbers: a document that does not count its parts
    still has an outline. */
export const Unnumbered: Story = {
  args: { numbered: false },
};
