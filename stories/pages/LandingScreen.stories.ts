/* The landing page.

   A whole surface rather than a component: the first page a project shows,
   with the pitch, who it is for, what it is made of, three components read in
   full, where its rules come from, and how to start. It is a **Starting
   Point** — a consuming project offers these in a picker to seed a new
   design — so it has to be a finished page and not a sketch, and a page that
   stops after the pitch teaches nothing about how the system sets a table, a
   grid of cards, or a section that runs for three screens.

   Live in Storybook and static in `screens/`, from one composition — see
   `lib/page.ts` for why both exist and where they differ. Live is the point:
   every story is opened by the test suite, so a page here is a page under
   test rather than a picture of one.

   It carries no stylesheet of its own and no inline layout. The shell, the
   bar, the page column, the sections, the grids and the two-up row are the
   system's layout classes, and so is where each of them sheds as the screen
   narrows. Anything a page here cannot say in them is a gap in the system,
   and gets fixed there. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../src/components/menu.ts';
import '../../src/components/surface.ts';
import '../../src/components/badge.ts';
import '../../src/components/code.ts';
import '../../src/components/link.ts';
import '../../src/components/table.ts';
import '../../src/components/tabs.ts';
import '../../src/components/tab-item.ts';
import '../../src/components/button.ts';
import '../../src/components/signet.ts';
import '../../src/components/theme.ts';
import { buttonMarkup } from '../../src/components/button.ts';
import { tabsBarMarkup } from '../../src/components/tabs.ts';
import { type CodeLine } from '../../src/components/code.ts';
import { type Column, type Row } from '../../src/components/table.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';

/** The three ways in, as the head of the page offers them. */
const WAYS: readonly { label: string; body: readonly CodeLine[] }[] = [
  {
    label: 'composer',
    body: [
      { kind: 'comment', text: '# a PHP surface writes the classes by hand' },
      { kind: 'shell', text: 'composer require typo3/soul-design-system' },
      { kind: 'ok', text: 'linked two files into', code: 'public/assets' },
    ],
  },
  {
    label: 'npm',
    body: [
      { kind: 'comment', text: '# a surface that runs JavaScript gets the elements too' },
      { kind: 'shell', text: 'npm install @typo3/soul-design-system' },
      { kind: 'ok', text: 'the elements register themselves from', code: 'soul.js' },
    ],
  },
  {
    label: 'drop-in',
    body: [
      { kind: 'comment', text: '# no toolchain at all: copy dist/ and link it' },
      { kind: 'plain', text: '<link rel="stylesheet" href="soul/styles.css">' },
      { kind: 'plain', text: '<script type="module" src="soul/soul.js"></script>' },
    ],
  },
];

const AUDIENCES = [
  {
    label: 'audience 01',
    heading: 'Product designer',
    body: 'Starting points to open, tokens to draw against, and a specimen for every rule — so a decision is looked up rather than remembered.',
  },
  {
    label: 'audience 02',
    heading: 'Interface developer',
    body: 'Custom elements that need no build step and no framework. Light DOM, so the page around them styles them like anything else.',
  },
  {
    label: 'audience 03',
    heading: 'Backend developer',
    body: 'The same class names a template writes by hand. Neither layer is a fallback for the other, and both are checked against the same file.',
  },
];

const LAYERS: { columns: readonly Column[]; rows: readonly Row[] } = {
  columns: [{ head: 'Layer', cls: 'sds-td-name' }, { head: 'Ships as' }, { head: 'Read by', cls: 'sds-td-meta' }],
  rows: [
    { cells: ['tokens', 'tokens.css — custom properties', 'every layer above it, and a design tool'] },
    { cells: ['classes', 'styles.css', 'a Twig or Fluid template, by hand'] },
    { cells: ['elements', 'soul.js — light DOM, no build', 'a surface that runs JavaScript'] },
    { cells: ['specimens', 'generated cards', 'the guidelines, and the pane a design opens in'] },
  ],
};

/** Three components read in full, the way the reference pages read them: what
    it is, what it takes, and the markup that produces it. */
const COMPONENTS: readonly {
  name: string;
  body: string;
  marks: readonly string[];
  columns: readonly Column[];
  rows: readonly Row[];
  source: string;
}[] = [
  {
    name: 'sds-code',
    body: 'A fenced block, its head and its copy button. It highlights what it is given rather than leaving that to the page — fourteen grammars, one of them TYPO3’s own, and a caption where a renderer has one to place.',
    marks: ['element', 'class layer', '14 grammars'],
    columns: [{ head: 'Property', cls: 'sds-td-name' }, { head: 'Required' }, { head: 'Meaning' }],
    rows: [
      { cells: ['lang', 'no', 'The fence’s language. Sets the head and picks the grammar.'] },
      { cells: ['caption', 'no', 'What the block is, in a sentence, above the frame.'] },
      { cells: ['copy', 'no', 'The copy button. It copies what the block says, never its chrome.'] },
      { cells: ['source', 'no', 'The block as text, where the caller holds the source rather than markup.'] },
    ],
    source: '<sds-code lang="bash" caption="Install" copy>\n  <code>composer require typo3/soul-design-system</code>\n</sds-code>',
  },
  {
    name: 'sds-rail',
    body: 'The tool rail: a flat list, or one long enough to need sections. A section is a `details`, so it folds before any script has run and a closed rail is a few lines rather than a screen of them.',
    marks: ['element', 'class layer', 'works unscripted'],
    columns: [{ head: 'Property', cls: 'sds-td-name' }, { head: 'Required' }, { head: 'Meaning' }],
    rows: [
      { cells: ['items', 'yes', 'Labels, or entries with an href, an icon, or a group of their own.'] },
      { cells: ['active', 'no', 'Which item is current. Pressing one moves it and says so.'] },
      { cells: ['open', 'no', 'Per group. A group holding the current item opens regardless.'] },
    ],
    source: '<sds-rail active="1" items=\'[\n  "overview",\n  { "label": "tools", "items": ["typo3_icon_lookup"] }\n]\'></sds-rail>',
  },
  {
    name: 'sds-menu',
    body: 'The navigation in a header, and what it does as the header runs out. Pills while there is room; a toggle and a panel below the bar when there is not — and which of the two is measured, not declared at a breakpoint somebody picked for one page.',
    marks: ['element', 'class layer', 'measures itself'],
    columns: [{ head: 'Property', cls: 'sds-td-name' }, { head: 'Required' }, { head: 'Meaning' }],
    rows: [
      { cells: ['items', 'yes', 'The sections of the site, as labels or as entries with an href.'] },
      { cells: ['active', 'no', 'Which one is current, marked the way every item in this system is.'] },
      { cells: ['label', 'no', 'What the toggle is called for a reader who cannot see it is a menu.'] },
    ],
    source: '<sds-menu label="Sections" items=\'[\n  { "label": "overview", "href": "#overview" },\n  { "label": "install", "href": "#install" }\n]\'></sds-menu>',
  },
];

const SOURCES = [
  {
    label: 'source 01',
    heading: 'The tokens file',
    body: 'One declaration carries both modes. Nothing below it names a colour, so a surface cannot be light-only by accident.',
  },
  {
    label: 'source 02',
    heading: 'The component',
    body: 'A card ships the markup its element renders, from the same function. The documentation cannot drift, because there is nothing for it to drift from.',
  },
  {
    label: 'source 03',
    heading: 'The guidelines',
    body: 'Written pages, drawn from the artwork files themselves — the construction, the sizes and the clear space are measured, not described.',
  },
  {
    label: 'source 04',
    heading: 'The checks',
    body: 'Headers, classes, refs, fit, cards and types, on every change. A rule nothing checks is a preference somebody wrote down.',
  },
];

const PIPELINE = [
  {
    label: 'step 01',
    heading: 'A story is written',
    body: 'The component, with the properties it is being shown at. Nothing is hand-built beside it — a specimen that rebuilds the markup documents the rebuild.',
  },
  {
    label: 'step 02',
    heading: 'The card is rendered',
    body: 'Server-side, to flat HTML at the size it declares, with every element replaced by what it produced.',
  },
  {
    label: 'step 03',
    heading: 'The pane opens it',
    body: 'With styles.css and no JavaScript at all, which is the state that proves the class layer stands on its own.',
  },
  {
    label: 'step 04',
    heading: 'The diff catches the rest',
    body: 'A card that moved is a picture that changed, and it is reviewed as one.',
  },
];

const INSTALL: readonly CodeLine[] = [
  { kind: 'comment', text: '# one command, and the client finds it' },
  { kind: 'shell', text: 'composer require typo3/soul-design-system' },
  { kind: 'ok', text: 'linked two files into', code: 'public/assets' },
];

/** The page. `flat` composes the form a static file can hold. */
export function landingPage({ flat = false }: PageMode = {}): TemplateResult {
  /* The two places the renderings differ, and both for the same reason: a
     button's label and a tab's panel are written between the tags, and
     `renderStatic` flattens no element that was given children. Same
     functions underneath, so the file is the markup the elements render. */
  const start = flat
    ? html`${buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-play"></sds-icon>Start a design`)}${buttonMarkup({ variant: 'secondary' }, 'Browse the components')}`
    : html`<sds-button variant="primary"><sds-icon name="actions-play"></sds-icon>Start a design</sds-button>
        <sds-button variant="secondary">Browse the components</sds-button>`;

  const first = WAYS[0] as (typeof WAYS)[number];
  const ways = flat
    ? html`${tabsBarMarkup(WAYS.map(({ label }) => ({ label })), 0)}<div class="sds-tab__panel"><sds-code lang="bash" .body="${first.body}" copy></sds-code></div>`
    : html`<sds-tabs>
          ${WAYS.map(
            (way) => html`<sds-tab-item label="${way.label}"><sds-code lang="bash" .body="${way.body}" copy></sds-code></sds-tab-item>`,
          )}
        </sds-tabs>`;

  return html`<div class="sds-shell">
  <header class="sds-bar">
    <a class="sds-lockup" href="#overview">
      <sds-signet size="20"></sds-signet>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
    </a>
    <sds-menu label="Sections" .items="${[
      { label: 'overview', href: '#overview' },
      { label: 'foundations', href: '#foundations' },
      { label: 'components', href: '#components' },
      { label: 'install', href: '#install' },
    ]}" active="0"></sds-menu>
    <div class="sds-bar__end">
      <sds-badge label="1.0.0" tone="accent"></sds-badge>
      <sds-theme></sds-theme>
    </div>
  </header>

  <main class="sds-page">
    <div class="sds-sections">

      <section class="sds-split" id="overview">
        <div class="sds-stack">
          <div class="sds-row">
            <sds-badge label="1.0.0" tone="accent"></sds-badge>
            <span class="sds-label">one accent · two modes · no shadows</span>
          </div>
          <h1 class="sds-display">A system, not a stylesheet</h1>
          <p class="sds-lead">
            Tokens, a class layer and the elements over it — one vocabulary,
            whether a surface runs JavaScript or is rendered by PHP. Every rule
            it holds is shown on a card generated from the component that holds
            it.
          </p>
          <div class="sds-actions">${start}</div>
        </div>
        <div class="sds-stack">
          <span class="sds-label">Three ways in</span>
          ${ways}
        </div>
      </section>

      <section class="sds-grid">
        ${AUDIENCES.map(
          (one) => html`<sds-surface plane="panel" label="${one.label}" heading="${one.heading}" body="${one.body}"></sds-surface>`,
        )}
      </section>

      <section class="sds-stack" id="foundations">
        <h2 class="sds-h2">What it is made of</h2>
        <p class="sds-prose">
          Four layers, and each of them is worth having on its own. A surface
          that takes only the tokens still cannot invent a colour; one that
          takes only the classes still gets both modes.
        </p>
        <sds-table density="compact" scrollable .columns="${LAYERS.columns}" .rows="${LAYERS.rows}"></sds-table>
      </section>

      <section class="sds-sections" id="components">
        <div class="sds-stack">
          <h2 class="sds-h2">Three components in full</h2>
          <p class="sds-prose">
            One per plane: a block the machine writes, the navigation beside a
            page, and the navigation above it. Each is documented from the
            element that renders it.
          </p>
        </div>
        ${COMPONENTS.map(
          (one) => html`<article class="sds-stack">
          <h3 class="sds-h3 sds-mono">${one.name}</h3>
          <p class="sds-prose">${one.body}</p>
          <div class="sds-row">
            ${one.marks.map((mark) => html`<sds-badge label="${mark}"></sds-badge>`)}
          </div>
          <sds-table density="compact" scrollable .columns="${one.columns}" .rows="${one.rows}"></sds-table>
          <sds-code lang="html" source="${one.source}" copy></sds-code>
        </article>`,
        )}
      </section>

      <section class="sds-stack" id="sources">
        <h2 class="sds-h2">Where a rule comes from</h2>
        <p class="sds-prose">
          Four places, and every one of them is a file rather than a habit.
        </p>
        <div class="sds-grid">
          ${SOURCES.map(
            (one) => html`<sds-surface label="${one.label}" heading="${one.heading}" body="${one.body}"></sds-surface>`,
          )}
        </div>
      </section>

      <section class="sds-stack" id="pipeline">
        <h2 class="sds-h2">How a specimen gets made</h2>
        <p class="sds-prose">
          The documentation is generated from the components, in four steps
          that run on every change.
        </p>
        <div class="sds-grid">
          ${PIPELINE.map(
            (one) => html`<sds-surface label="${one.label}" heading="${one.heading}" body="${one.body}"></sds-surface>`,
          )}
        </div>
      </section>

      <section class="sds-split" id="install">
        <div class="sds-stack">
          <h2 class="sds-h2">Install</h2>
          <p class="sds-prose">
            Two files, and nothing to configure. The elements register
            themselves and the classes are already in the stylesheet — there is
            no build step to add and no framework to be on.
          </p>
          <div class="sds-actions">${start}</div>
        </div>
        <div class="sds-stack">
          <span class="sds-label">Install</span>
          <sds-code lang="bash" .body="${INSTALL}" copy></sds-code>
          <p class="sds-prose">
            Pin a version where you depend on it. The class layer is the
            contract; the elements are how a page that runs JavaScript gets it
            without writing the markup out.
          </p>
        </div>
      </section>

    </div>
  </main>

  <footer class="sds-foot">
    <span class="sds-label">Soul Design System</span>
    <sds-link label="docs.typo3.org" href="https://docs.typo3.org" external></sds-link>
    <sds-link label="Contribute an icon" href="#"></sds-link>
  </footer>
</div>`;
}

/* No generated page in front of this one — the deliberate exception to the
   `['autodocs', '!dev']` every component here carries.

   A component's page earns its place: it collects the variants, the controls
   and the prose into something to read. A whole layout has none of that to
   collect. It is one story, and what it documents is what it does at a given
   width — which is exactly what a docs page cannot show, because the viewport
   tool renders in the story view and nowhere else. So the one entry a reader
   could reach was the one place the widths were unreachable.

   Untagged, the story itself is what the sidebar lists, and it is a single
   leaf rather than something to unfold: a component with one story whose name
   matches its own is hoisted, which is what `name` below is for. The export
   keeps its own name, because the story id is what the suite addresses. */
const meta: Meta = {
  title: 'Pages/Landing',
  excludeStories: ['landingPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/landing.html',
      title: 'Soul Design System',
      subtitle: 'The first page: the pitch, who it is for, what it is made of, and how to start',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the menu collapses when the header runs out and opens
    where it did, the install block switches, a table scrolls rather than
    widening the page, and the mode switch moves all of it. */
export const Page: Story = {
  name: 'Landing',
  render: () => landingPage(),
};

export const screenHtml = (): string => part(landingPage({ flat: true }));
