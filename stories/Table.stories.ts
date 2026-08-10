/* Table, badges and status.

   The markup lives in `src/components/table.ts`. `tableTemplate` is also what
   `TableDensity.stories.ts` renders three times — the density card exists to
   compare row heights, so it must be the same table each time or it compares
   nothing at all. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../src/components/table.ts';
import { type Column, type TableProps } from '../src/components/table.ts';
import '../src/components/badge.ts';
import { BADGES } from './Badge.stories.ts';
import { DIVIDER, dsCard, part, px, spec, specCap, specRow } from './lib/specimen.ts';

/** The tool list every table specimen in this system is built from. Real tool
    names, verbatim and in mono — never title-cased or prettified. */
export const TOOLS: readonly (readonly string[])[] = [
  ['typo3_rule_lookup', 'lookup', 'bundled knowledge', '12.4 · 13.4 · 14.3 · main'],
  ['typo3_icon_lookup', 'lookup', 'installation', 'follows the installation'],
  ['typo3_changelog_lookup', 'lookup', 'installation · docs', 'down to 7.0'],
  ['typo3_server_scope', 'scope', 'this server', '—'],
];

const COLUMNS: readonly Column[] = [
  { head: 'Tool', cls: 'sds-td-name' },
  { head: 'Source' },
  { head: 'Versions', cls: 'sds-td-meta' },
];

/* Held as one object so the meta args, the Default story and the specimen
   cannot drift: a CSF story with no args of its own inherits the meta's, but
   `specimenHtml()` is called by the card generator outside Storybook, where
   nothing merges them for it. */
const CARD_TABLE: TableProps = {
  density: 'medium',
  columns: COLUMNS,
  rows: [
    { cells: ['typo3_rule_lookup', 'bundled knowledge', '12.4 · 13.4 · 14.3 · main'] },
    { cells: ['typo3_icon_lookup', 'installation', 'follows the installation'], style: 'background:var(--surface-raised);' },
    { cells: ['typo3_documentation_lookup', 'docs.typo3.org', 'requested release'] },
  ],
};

const sdsTable = ({ density = 'medium', columns, rows }: TableProps) =>
  html`<sds-table density="${density}" .columns="${columns}" .rows="${rows}"></sds-table>`;

const sdsBadge = ({ label, tone = 'default' }: { label: string; tone?: string }) =>
  html`<sds-badge label="${label}" tone="${tone}"></sds-badge>`;

const meta: Meta<TableProps> = {
  title: 'Components/Table',
  tags: ['autodocs'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['TOOLS', 'specimenHtml'],
  render: (args) => sdsTable(args),
  argTypes: {
    density: { control: 'inline-radio', options: ['compact', 'medium', 'airy'] },
    columns: { control: 'object' },
    rows: { control: 'object' },
  },
  args: CARD_TABLE,
  parameters: {
    dsCard: dsCard({
      path: 'components/data/data.card.html',
      name: 'Table, badges & status',
      subtitle: 'Long technical lists — compact rows, mono for anything the machine named',
      viewport: '700x280',
    }),
  },
};

export default meta;
type Story = StoryObj<TableProps>;

/** The filled row is a selected one, not every other one. Never zebra
    stripes: a background that changes for no reason means nothing when it
    changes for a reason. */
export const Default: Story = {};

export const Compact: Story = { args: { ...CARD_TABLE, density: 'compact' } };
export const Airy: Story = { args: { ...CARD_TABLE, density: 'airy' } };

export const specimenHtml = (): string =>
  spec([
    part(sdsTable(CARD_TABLE)),
    specRow(BADGES.map((b) => part(sdsBadge(b)))),
    specCap(
      `ROWS ${px(11, 'PX')} VERTICAL · HEAD RULE --border-strong · ROW RULE --border-subtle · ` +
        'ZEBRA ONLY ON HOVER OR SELECTION, NEVER ALTERNATING',
      DIVIDER,
    ),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
