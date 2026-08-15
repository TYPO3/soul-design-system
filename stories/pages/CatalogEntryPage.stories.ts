/* One entry of a catalog, in full.

   What the reader came for is the identifier and the confidence that this is
   the right one — so the name is set as the machine text it is, and the item
   is shown in both modes rather than on two colours somebody typed in. Every
   ground here is the system's own, forced onto a subtree: a page that hardcodes
   `#ffffff` has left the theme and will not follow it when it moves.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/icon.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/nav-pager.ts';
import '../../packages/frontend/src/components/nav-rail.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/table.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type IconSize } from '../../packages/frontend/src/components/icon.ts';
import { type MenuEntry } from '../../packages/frontend/src/components/nav-base.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part, px } from '../lib/specimen.ts';
import { type PageMode, skipLink } from '../lib/page.ts';

/** The entry this page is about. One constant, because every heading, every
    code block and the pager either side of it name the same thing — spelling
    it out per place is how a page ends up documenting two items. */
const GLYPH = 'actions-document-edit';

/* Written as the characters they are, with real newlines: the element takes a
   source verbatim, so an entity here would arrive as an entity. */
const ELEMENT = `<sds-icon name="${GLYPH}"></sds-icon>`;

const RENDERED =
  `<svg class="sds-icon" data-icon="${GLYPH}" aria-hidden="true" viewBox="0 0 16 16">\n` +
  `  <use href="icons/sprites/actions.svg#${GLYPH}"></use>\n` +
  `</svg>`;

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Tools', href: '#' },
  { label: 'Glyphs', href: '#' },
  { label: GLYPH },
];

const RAIL: readonly MenuEntry[] = [
  { label: 'Overview', href: '#overview' },
  {
    label: 'tools',
    items: [
      { label: 'typo3_icon_lookup', href: '#glyphs', here: true, current: true },
      { label: 'typo3_label_lookup', href: '#label' },
      { label: 'typo3_schema_lookup', href: '#schema' },
    ],
  },
  { label: 'Glossary', href: '#glossary' },
];

/** The releases it can be asked for in. Facts about the entry rather than
    results, so no tone — a badge either way, because a version is a thing the
    reader matches against theirs and not a sentence they read. */
const RELEASES: readonly string[] = ['12.4', '13.4', '14.3', 'main'];

/** Every size the system draws a glyph at, and what each one is for. The scale
    is `IconSize`, so a size this page shows is a size the element takes. */
const SIZES: readonly { size: IconSize; label: string; use: string }[] = [
  { size: 'em', label: 'em', use: 'Inside text — as big as the text it stands in, and it moves with it' },
  { size: 16, label: px(16), use: 'The floor. A glyph in a table cell, a badge, a dense row' },
  { size: 20, label: px(20), use: 'A control’s own mark — a button, a field, a rail item' },
  { size: 24, label: px(24), use: 'A glyph standing alone on a line of its own' },
  { size: 32, label: px(32), use: 'A module in a navigation, a card told apart before it is read' },
  { size: 48, label: px(48), use: 'An empty state, or the subject of a page like this one' },
];

const SIZE_COLUMNS: readonly Column[] = [
  { head: 'Drawn' },
  { head: 'Size', cls: 'sds-td-meta' },
  { head: 'Where it is used' },
];

/* The glyph itself in the first cell rather than a strip of samples above a
   table saying the same sizes again. One row, one size, one reason. */
const sizeRows = (): readonly Row[] =>
  SIZES.map(({ size, label, use }) => ({
    cells: [html`<sds-icon name="${GLYPH}" size="${size}"></sds-icon>`, label, use],
  }));

/** The item on one ground, with the mode forced onto that subtree. Both panes
    are the same call: a glyph that reads in one mode and not the other is what
    this pair is here to catch, and neither ground is written as a colour. */
const pane = (theme: 'light' | 'dark'): TemplateResult =>
  html`<sds-surface
    data-theme="${theme}"
    plane="raised"
    label="${theme}"
    heading="On the page’s own ground"
    .body="${html`<div class="sds-row">
      <sds-icon name="${GLYPH}" size="48"></sds-icon>
      <sds-icon name="${GLYPH}" size="24"></sds-icon>
      <sds-icon name="${GLYPH}" size="16"></sds-icon>
    </div>`}"
  ></sds-surface>`;

/** The page. `flat` composes the form a static file can hold. */
export function catalogEntryPage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a pane's body is content, and
     `renderStatic` flattens no element that was given children. The grid takes
     them as a property instead, which is the one channel a renderer outside a
     browser has. */
  const panes = [pane('light'), pane('dark')];
  const modes = flat
    ? html`<sds-grid .content="${panes}"></sds-grid>`
    : html`<sds-grid>${panes}</sds-grid>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(3, '#glyphs')}

  <div class="sds-body">
    <aside class="sds-body__rail" id="page-rail">
      <sds-nav-rail .entry="${{ label: '', items: RAIL }}"></sds-nav-rail>
    </aside>

    <main class="sds-body__main" id="main-content">
      <div class="sds-stack sds-stack--tight">
        <sds-nav-breadcrumb .items="${TRAIL}"></sds-nav-breadcrumb>
        <h1><span class="sds-mono">${GLYPH}</span></h1>
        <p class="sds-lead">
          Open a record for editing. The pencil on a sheet is the backend’s one
          mark for “change this”, and nothing else in the set may wear it.
        </p>
        <div class="sds-row">
          <span class="sds-label">Answers for</span>
          ${RELEASES.map((release) => html`<sds-badge label="${release}"></sds-badge>`)}
          <span class="sds-label sds-row__end">records${NNBSP}· since 1.11.0</span>
        </div>
      </div>

      <h2 class="sds-h3">In both modes</h2>
      <p>
        The same call on either ground, and each pane forces the mode on itself
        rather than painting one. A glyph that goes flat in dark is a glyph
        drawn against one background, and this is where that shows.
      </p>

      ${modes}

      <h2 class="sds-h3">Every size it is drawn at</h2>
      <p>
        The scale is 16, 20, 24 and whole multiples of it — never 18, never 22.
        Below 16 there is no glyph, because a mark nobody can make out is a
        smudge that costs a request.
      </p>

      <sds-table density="medium" .columns="${SIZE_COLUMNS}" .rows="${sizeRows()}"></sds-table>

      <h2 class="sds-h3">Using it</h2>
      <p>
        The element, everywhere. It carries the identifier and nothing else —
        colour follows the text it stands in, which is the whole rule, and a
        size is the exception rather than the habit.
      </p>

      <sds-code code-lang="html" source="${ELEMENT}" copy></sds-code>

      <p>
        Where a surface runs no script, that same tag is rendered ahead of time
        and the glyph is already in the page — the identifier travels with it,
        so a reader of the markup can still tell which mark they have.
      </p>

      <sds-code code-lang="html" source="${RENDERED}" copy></sds-code>

      <sds-note
        tone="info"
        heading="A glyph is asked for by name"
        .body="${html`The identifier is the contract — the drawing behind it may be redrawn
          and the name will not move. Copy the name, never the path to the file it
          happens to live in today.`}"
      ></sds-note>

      <!-- The way on through the set. A catalog entry with no neighbours sends
           the reader back to the wall to find the one next to it. -->
      <sds-nav-pager
        previous-href="#glyph" previous-label="actions-document-add"
        next-href="#glyph" next-label="actions-document-view"
        label="Through the glyph set"
      ></sds-nav-pager>
    </main>
  </div>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Catalog entry',
  excludeStories: ['catalogEntryPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/catalog-entry.html',
      title: 'TYPO3 Dev Companion — one glyph',
      subtitle: 'One item of a set in full — both modes forced on a subtree, every size in one table',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: both panes hold their mode while the switch moves the page
    around them, the block copies itself, and the pager goes on through the
    set. */
export const Page: Story = {
  name: 'Catalog entry',
  render: () => catalogEntryPage(),
};

export const screenHtml = (): string => part(catalogEntryPage({ flat: true }));
