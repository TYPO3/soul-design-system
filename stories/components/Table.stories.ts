/* Table, badges and status.

   The markup lives in `src/components/table.ts`. `tableTemplate` is also what
   `TableDensity.stories.ts` renders three times — the density card exists to
   compare row heights, so it must be the same table each time or it compares
   nothing at all. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/table.ts';
import { type Column, type TableProps } from '../../packages/frontend/src/components/table.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/select.ts';
import { BADGES } from './Badge.stories.ts';
import { DIVIDER, dsCard, part, px, spec, specCap, specRow } from '../lib/specimen.ts';

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
    { cells: ['typo3_icon_lookup', 'installation', 'follows the installation'], selected: true },
    { cells: ['typo3_documentation_lookup', 'docs.typo3.org', 'requested release'] },
  ],
};

export const sdsTable = ({ density = 'medium', columns, rows, loading, loadingRows }: TableProps) =>
  html`<sds-table
    density="${density}"
    ?loading="${loading}"
    loading-rows="${ifDefined(loadingRows)}"
    .columns="${columns}"
    .rows="${rows}"
  ></sds-table>`;

const sdsBadge = ({ label, tone = 'default' }: { label: string; tone?: string }) =>
  html`<sds-badge label="${label}" tone="${tone}"></sds-badge>`;

const meta: Meta<TableProps> = {
  title: 'Components/Table',
  tags: ['autodocs', '!dev'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['TOOLS', 'specimenHtml'],
  render: (args) => sdsTable(args),
  argTypes: {
    density: { control: 'inline-radio', options: ['compact', 'medium', 'airy'] },
    columns: { control: 'object' },
    rows: { control: 'object' },
    loading: { control: 'boolean' },
    loadingRows: { control: 'number' },
  },
  args: CARD_TABLE,
  parameters: {
    dsCard: dsCard({
      path: 'components/data/data.card.html',
      name: 'Table, badges & status',
      subtitle: 'Long technical lists — compact rows, mono for anything the machine named',
      viewport: '700x282',
    }),
  },
};

export default meta;
type Story = StoryObj<TableProps>;

/** The filled row is a selected one, not every other one. Never zebra
    stripes: a background that changes for no reason means nothing when it
    changes for a reason. */
export const Default: Story = {};

/** Waiting for the answer. The head is the columns — known before the rows
    are — and the body is bars at the height the rows will have, so nothing
    moves when it arrives. Nothing under 200ms: a flash of skeleton reads as a
    state change rather than as work in flight. */
export const Loading: Story = {
  args: { ...CARD_TABLE, rows: [], loading: true, loadingRows: 4 },
};

/** A row somebody acts on. The cells carry what they have to — a name with
    the button that acts on it, the version as the control that changes it, the
    address as a real link — and the identity carries its own second line, so
    what is true about a checkout right now stands under its name instead of
    taking a column whose head would have to name a relationship.

    The controls are the system's own at the size a row has room for: a select
    in a cell states `label` rather than a caption, and asks for the width the
    column can give it. */
export const Managed: Story = {
  render: () =>
    sdsTable({
      columns: [
        { head: 'Checkout', cls: 'sds-td-name' },
        { head: 'PHP' },
        { head: 'Database' },
        { head: 'Address', cls: 'sds-td-meta' },
      ],
      rows: [
        {
          selected: true,
          cells: [
            {
              value: html`13.4-lts
                <sds-button variant="ghost" size="sm">Open</sds-button>`,
              note: 'main · 2 uncommitted changes',
            },
            '8.4',
            'project database',
            html`<sds-link href="https://13-4-lts.typo3.test" label="13-4-lts.typo3.test"></sds-link>`,
          ],
        },
        {
          cells: [
            {
              value: html`14.3-dev
                <sds-button variant="ghost" size="sm">Open</sds-button>`,
              note: 'feature/soul · 7 uncommitted changes',
            },
            html`<sds-select
              label="PHP for 14.3-dev"
              size="sm"
              min-width="88"
              value="8.4"
              .options="${['8.2', '8.3', '8.4']}"
            ></sds-select>`,
            html`<sds-select
              label="Database for 14.3-dev"
              size="sm"
              min-width="180"
              value="project database"
              .options="${['project database', 'a copy of it']}"
            ></sds-select>`,
            html`<sds-link href="https://14-3-dev.typo3.test" label="14-3-dev.typo3.test"></sds-link>`,
          ],
        },
      ],
    }),
};

export const Compact: Story = { args: { ...CARD_TABLE, density: 'compact' } };
export const Airy: Story = { args: { ...CARD_TABLE, density: 'airy' } };

/** The form a renderer uses: the table's own children between the tags. A cell
    of a document carries a link, a literal or an emphasis, `colspan` and a
    caption have no property at all, and a page has to hold the rows before any
    script runs. What the table *is* — the class, the density, the box it
    scrolls in — stays the element's either way. */
const GIVEN_ROWS = `<caption>What each lookup answers with, and where it reads it.</caption>
<thead>
  <tr><th>Tool</th><th>Source</th><th>Versions</th></tr>
</thead>
<tbody>
  <tr>
    <td class="sds-td-name"><code>typo3_rule_lookup</code></td>
    <td>bundled knowledge</td>
    <td class="sds-td-meta">12.4 · 13.4 · 14.3 · main</td>
  </tr>
  <tr>
    <td class="sds-td-name"><code>typo3_icon_lookup</code></td>
    <td colspan="2">the installation, and <em>only</em> the installation</td>
  </tr>
</tbody>`;

export const FromContent: Story = {
  render: () => html`<sds-table scrollable .content="${html`${unsafeHTML(GIVEN_ROWS)}`}"></sds-table>`,
};

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
