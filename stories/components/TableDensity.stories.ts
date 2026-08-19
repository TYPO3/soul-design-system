/* Table density.

   The card's whole claim is that row height is what "compact" means, and it
   can only make that claim if the three tables are otherwise identical.
   Hand-written they were three copies of the same forty lines; this renders
   one dataset through `tableTemplate` three times, so they cannot drift
   apart and quietly turn the comparison into a comparison of something
   else. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/table.ts';
import { type Column, type Density, type Row, type TableProps } from '../../packages/frontend/src/components/table.ts';
import { TOOLS } from './Table.stories.ts';
import { dsCard, esc, indent, part, px, spec } from '../lib/specimen.ts';

const COLUMNS: readonly Column[] = [
  { head: 'Tool', cls: 'sds-td-name' },
  { head: 'Verb', cls: 'sds-td-meta' },
  { head: 'Source' },
  { head: 'Versions', cls: 'sds-td-meta' },
];

const ROWS: readonly Row[] = TOOLS.map((cells) => ({ cells }));

interface DensitySpec {
  density: Density;
  label: string;
  /** Why this density, not just what it measures — the prose is as much the
      specimen here as the tables are. `<em>` is the only emphasis. */
  note: string;
}

export const DENSITIES: readonly DensitySpec[] = [
  {
    density: 'compact',
    label: `COMPACT · ${px(30, 'PX')} ROWS`,
    note: 'Padding 6, text 13. Backend register — about 20 rows above the fold. Scanning beats reading. Right when the list <em>is</em> the work.',
  },
  {
    density: 'medium',
    label: `MEDIUM · ${px(38, 'PX')} ROWS`,
    note: 'Padding 9, text 14. Still a list, but each row is a thing you look at rather than run your eye down.',
  },
  {
    density: 'airy',
    label: `AIRY · ${px(48, 'PX')} ROWS`,
    note: 'Padding 14, text 14. Documentation register — about 8 rows above the fold. Reads as prose set in columns.',
  },
];

const sdsTable = ({ density = 'medium', columns, rows }: TableProps) =>
  html`<sds-table density="${density}" .columns="${columns}" .rows="${rows}"></sds-table>`;

const props = (density: Density): TableProps => ({ density, columns: COLUMNS, rows: ROWS });

/** One density, captioned: the label and its rationale beside the table. */
function densityRow({ density, label, note }: DensitySpec): string {
  return `<div style="display:flex; gap:22px; align-items:flex-start;">
  <div style="width:190px; flex:none;">
    <div style="font-family:var(--font-mono); font-size:10px; letter-spacing:0.1em; color:var(--text-primary);">${esc(label)}</div>
    <div style="font-size:11px; line-height:1.45; color:var(--text-secondary); margin-top:5px;">${note}</div>
  </div>
  <div style="flex:1;">${indent(part(sdsTable(props(density))), 0)}</div>
</div>`;
}

const meta: Meta<TableProps> = {
  title: 'Components/Table density',
  tags: ['autodocs', '!dev'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['DENSITIES', 'specimenHtml'],
  render: (args) => sdsTable({ ...args, columns: COLUMNS, rows: ROWS }),
  argTypes: { density: { control: 'inline-radio', options: ['compact', 'medium', 'airy'] } },
  args: props('compact'),
  parameters: {
    dsCard: dsCard({
      path: 'components/data/density.card.html',
      name: 'Table density',
      subtitle: 'The same four rows at three densities — row height is what “compact” actually means',
      viewport: '700x786',
    }),
  },
};

export default meta;
type Story = StoryObj<TableProps>;

/** 30px rows, 13px type. When the list *is* the work. */
export const Compact: Story = { args: props('compact') };

/** 38px rows. When one density has to serve both readings. */
export const Medium: Story = { args: props('medium') };

/** 48px rows, 14px type. When the rows are read rather than scanned. */
export const Airy: Story = { args: props('airy') };

export const specimenHtml = (): string => spec(DENSITIES.map(densityRow), { gap: '24px' });

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
