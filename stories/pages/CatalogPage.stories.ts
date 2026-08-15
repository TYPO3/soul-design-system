/* The catalog page.

   Several hundred small, uniform things a reader arrives at knowing half the
   name of. They are found by shape, so the wall is tiles and not cards: the
   drawing is what the box is made of and the identifier under it is held back
   until the shape has been found. Search is the control the page is built
   around, and the set is paged — a wall of every item is half a megabyte spent
   before the reader has narrowed anything.

   Live and static from one composition — see `lib/page.ts`. The facets narrow
   the wall for real: which items are shown is the page's state, never the
   wall's. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, render, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/nav-pagination.ts';
import '../../packages/frontend/src/components/nav-pills.ts';
import '../../packages/frontend/src/components/nav-rail.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/icon-tile.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type IconId } from '../../packages/frontend/src/components/icon.ts';
import { type MenuEntry, type NavChange } from '../../packages/frontend/src/components/nav-base.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Tools', href: '#' },
  { label: 'Glyphs' },
];

/** How many tiles a page of this catalog holds. The row of numbers under it
    divides the whole count by the same figure, so nothing here says how many
    pages that comes to. */
const PER_PAGE = 24;

/** How many the set holds in all — the figure the pager divides and the count
    line is read against. A catalog showing a page of a set has to say what the
    set is, or the reader cannot tell a filter from an end. */
const IN_ALL = 392;

/** One entry: what it is called, which part of the set it belongs to, and
    whether it turns with the reading direction. No sentence about it — a wall
    is scanned, and prose per tile is what makes it a page of cards. */
interface Glyph {
  name: IconId;
  group: string;
  /** Mirrored in right-to-left, which is the one thing about the drawing a
      reader cannot see by looking at it. */
  bidi?: boolean;
}

const GLYPHS: readonly Glyph[] = [
  { name: 'actions-document-edit', group: 'records' },
  { name: 'actions-document-view', group: 'records' },
  { name: 'actions-document-add', group: 'records' },
  { name: 'actions-document-move', group: 'records' },
  { name: 'actions-document-readonly', group: 'records' },
  { name: 'actions-document-localize', group: 'records' },
  { name: 'actions-document-share', group: 'records' },
  { name: 'actions-document-select', group: 'records' },
  { name: 'actions-file-add', group: 'files' },
  { name: 'actions-file-pdf', group: 'files' },
  { name: 'actions-file-image', group: 'files' },
  { name: 'actions-file-video', group: 'files' },
  { name: 'actions-file-text', group: 'files' },
  { name: 'actions-file-csv', group: 'files' },
  { name: 'actions-folder', group: 'files' },
  { name: 'actions-folder-add', group: 'files' },
  { name: 'actions-code-commit', group: 'history' },
  { name: 'actions-code-merge', group: 'history' },
  { name: 'actions-code-fork', group: 'history' },
  { name: 'actions-code-pull-request', group: 'history' },
  { name: 'actions-code-compare', group: 'history' },
  { name: 'actions-history', group: 'history' },
  { name: 'actions-clock', group: 'history' },
  { name: 'actions-database-reload', group: 'history' },
  { name: 'actions-arrow-end', group: 'direction', bidi: true },
  { name: 'actions-arrow-start', group: 'direction', bidi: true },
  { name: 'actions-arrow-up', group: 'direction' },
  { name: 'actions-arrow-down', group: 'direction' },
  { name: 'actions-chevron-start', group: 'direction', bidi: true },
  { name: 'actions-chevron-double-start', group: 'direction', bidi: true },
  { name: 'actions-panel-expand-start', group: 'direction', bidi: true },
  { name: 'actions-panel-collapse-start', group: 'direction', bidi: true },
];

/** The ways into the set, and the first of them is the whole. */
const FACETS: readonly { label: string; group?: string }[] = [
  { label: 'all' },
  { label: 'records', group: 'records' },
  { label: 'files', group: 'files' },
  { label: 'history', group: 'history' },
  { label: 'direction', group: 'direction' },
];

/** Where this page sits in the manual around it. A catalog is one page of a
    section, not a place of its own. */
const RAIL: readonly MenuEntry[] = [
  { label: 'Overview', href: '#overview' },
  {
    label: 'tools',
    items: [
      { label: 'typo3_icon_lookup', href: '#glyphs', current: true },
      { label: 'typo3_label_lookup', href: '#label' },
      { label: 'typo3_schema_lookup', href: '#schema' },
    ],
  },
  { label: 'Glossary', href: '#glossary' },
];

export interface CatalogPageProps extends PageMode {
  /** Which facet is current, as an index into `FACETS`. */
  facet?: number;
  onFacet?: (index: number) => void;
}

/** The page. `flat` composes the form a static file can hold. */
export function catalogPage({ flat = false, facet = 0, onFacet }: CatalogPageProps = {}): TemplateResult {
  const current = FACETS[facet] ?? FACETS[0];
  const shown = current?.group ? GLYPHS.filter((one) => one.group === current.group) : GLYPHS;

  const tiles = shown.map(
    (one) => html`<sds-icon-tile
      name="${one.name}"
      href="#glyph"
      tag="${one.bidi ? 'BiDi' : ''}"
    ></sds-icon-tile>`,
  );

  const facets = (): TemplateResult =>
    flat
      ? html`<sds-nav-pills .items="${FACETS.map(({ label }) => ({ label }))}" active="${facet}"></sds-nav-pills>`
      : html`<sds-nav-pills
          .items="${FACETS.map(({ label }) => ({ label }))}"
          active="${facet}"
          @sds-change="${(e: CustomEvent<NavChange>) => onFacet?.(e.detail.index)}"
        ></sds-nav-pills>`;

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
        <h1>Glyphs</h1>
        <p class="sds-lead">
          Every mark <span class="sds-mono">typo3_icon_lookup</span> can answer
          with. Type what the thing does, not what it looks like — the drawings
          are indexed by purpose as well as by name.
        </p>
        <!-- The control the page is built around, at the size a field is when
             it is what the screen is for rather than one row of a form. -->
        <sds-field
          size="lg"
          value="Search ${IN_ALL} glyphs by name or purpose"
          icon="actions-search"
          label="Search the glyph set"
          min-width="420"
        ></sds-field>
      </div>

      <div class="sds-row" id="glyphs">
        ${facets()}
        <span class="sds-label sds-row__end">${shown.length} of ${IN_ALL} glyphs</span>
      </div>

      ${grid(tiles, { flat, variant: 'dense' })}

      <sds-nav-pagination
        count="${IN_ALL}"
        per-page="${PER_PAGE}"
        current="1"
        href="#glyphs-{n}"
        label="glyphs"
      ></sds-nav-pagination>

      <sds-note
        tone="info"
        heading="The identifier is the answer"
        .body="${html`A glyph is asked for by name, so the name is on the tile rather than
          under a pointer — a tooltip cannot be reached from a keyboard and cannot be
          found on the page. That is also what makes the wall searchable by the browser's
          own find.`}"
      ></sds-note>
    </main>
  </div>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Catalog',
  excludeStories: ['catalogPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/catalog.html',
      title: 'TYPO3 Dev Companion — glyph catalog',
      subtitle: `A wall found by shape${NNBSP}— the drawing in front, the name under it, the set narrowed and paged`,
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the facets narrow the wall for real, the field takes
    typing, every tile is one target, and the row of numbers says where the set
    continues. */
export const Page: Story = {
  name: 'Catalog',
  render: () => {
    /* The page is a function of which facet is current, so pressing one
       re-renders it. A wall that filtered its own contents would be a
       component deciding what a set means. */
    const host = document.createElement('div');
    const draw = (facet: number): void => {
      render(catalogPage({ facet, onFacet: draw }), host);
    };
    draw(0);
    return html`${host}`;
  },
};

export const screenHtml = (): string => part(catalogPage({ flat: true }));
