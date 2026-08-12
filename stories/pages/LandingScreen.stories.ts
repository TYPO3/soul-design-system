/* The landing page.

   A whole surface and a **Starting Point** a consuming project seeds a design
   from, so it has to be finished rather than a sketch: a page that stops after
   the pitch teaches nothing about how the system sets a table or a grid.

   It carries no stylesheet of its own and no inline layout: the shell, the bar,
   the bands and the grids are the system's classes, and so is where each sheds.
   Bands rather than one column of sections, because a page that argues needs
   its ground to change. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/accordion.ts';
import '../../packages/frontend/src/components/menu.ts';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/table.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/figure.ts';
import '../../packages/frontend/src/components/image.ts';
import '../../packages/frontend/src/components/theme.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type CodeLine } from '../../packages/frontend/src/components/code.ts';
import { type Entry } from '../../packages/frontend/src/components/accordion.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';

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
    source: '<sds-code code-lang="bash" caption="Install" copy>\n  <code>composer require typo3/soul-design-system</code>\n</sds-code>',
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

/** What a team asks before it takes the system on. Folded, and the first one
    open, so the shape of an answer is visible without pressing anything. */
const ADOPTION: readonly Entry[] = [
  {
    question: 'Do we have to use the web components?',
    answer: html`No. The class layer is the contract and it is the whole
      vocabulary — the elements are how a page that runs JavaScript gets that
      markup without writing it out. A page that renders on a server keeps the
      classes and loses nothing.`,
    open: true,
  },
  {
    question: 'What happens to our own stylesheet?',
    answer: html`It shrinks to what is genuinely yours. Anything you find
      yourself declaring twice is a gap in a component, and closing it there is
      the whole arrangement — a system everybody patches locally is a system
      nobody can change centrally.`,
  },
  {
    question: 'Which framework does it need?',
    answer: 'None. Two files, no build step, and nothing about the page it is on — the elements register themselves and the tokens are custom properties.',
  },
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

  return html`<div class="sds-shell">
  <header class="sds-bar">
    <a class="sds-lockup" href="#overview">
      <sds-image class="sds-signet" src="../assets/design-system-signet-m.svg" alt="" width="24" height="24"></sds-image>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
    </a>
    <sds-menu label="Sections" .items="${[
      { label: 'overview', href: '#overview' },
      { label: 'foundations', href: '#foundations' },
      { label: 'components', href: '#components' },
      { label: 'install', href: '#install' },
    ]}" active="0"></sds-menu>
    <div class="sds-bar__end">
      <sds-badge label="0.1.0-dev" tone="accent"></sds-badge>
      <sds-theme></sds-theme>
    </div>
  </header>

  <main class="sds-bands">

    <section class="sds-band" id="overview">
      <div class="sds-split">
        <div class="sds-stack">
          <div class="sds-row">
            <sds-badge label="0.1.0-dev" tone="accent"></sds-badge>
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
          <sds-figure src="../assets/placeholders/design-system-workbench.png" alt=""></sds-figure>
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="audiences">
      <div class="sds-grid">
        ${AUDIENCES.map(
          (one) => html`<sds-card label="${one.label}" heading="${one.heading}" body="${one.body}"></sds-card>`,
        )}
      </div>
    </section>

    <section class="sds-band" id="foundations">
      <div class="sds-stack">
        <h2>What it is made of</h2>
        <p>
          Four layers, and each of them is worth having on its own. A surface
          that takes only the tokens still cannot invent a colour; one that
          takes only the classes still gets both modes.
        </p>
        <sds-table density="compact" scrollable .columns="${LAYERS.columns}" .rows="${LAYERS.rows}"></sds-table>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="components">
      <div class="sds-sections">
        <div class="sds-stack">
          <h2>Three components in full</h2>
          <p>
            One per plane: a block the machine writes, the navigation beside a
            page, and the navigation above it. Each is documented from the
            element that renders it.
          </p>
        </div>
        ${COMPONENTS.map(
          (one) => html`<article class="sds-stack">
          <h3 class="sds-mono">${one.name}</h3>
          <p>${one.body}</p>
          <div class="sds-row">
            ${one.marks.map((mark) => html`<sds-badge label="${mark}"></sds-badge>`)}
          </div>
          <sds-table density="compact" scrollable .columns="${one.columns}" .rows="${one.rows}"></sds-table>
          <sds-code code-lang="html" source="${one.source}" copy></sds-code>
        </article>`,
        )}
      </div>
    </section>

    <section class="sds-band" id="sources">
      <div class="sds-stack">
        <h2>Where a rule comes from</h2>
        <p>
          Four places, and every one of them is a file rather than a habit.
        </p>
        <div class="sds-grid">
          ${SOURCES.map(
            (one) => html`<sds-surface label="${one.label}" heading="${one.heading}" body="${one.body}"></sds-surface>`,
          )}
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="pipeline">
      <div class="sds-stack">
        <h2>How a specimen gets made</h2>
        <p>
          The documentation is generated from the components, in four steps
          that run on every change.
        </p>
        <div class="sds-grid">
          ${PIPELINE.map(
            (one) => html`<sds-card label="${one.label}" heading="${one.heading}" body="${one.body}"></sds-card>`,
          )}
        </div>
      </div>
    </section>

    <section class="sds-band" id="questions">
      <div class="sds-stack">
        <h2>What is asked before it is adopted</h2>
        <p>
          Three of them, folded: a page that argues has to answer these, and a
          reader who has none of them is already at the install step.
        </p>
        <sds-accordion name="adoption" .entries="${ADOPTION}"></sds-accordion>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="install">
      <div class="sds-split">
        <div class="sds-stack">
          <h2>Install</h2>
          <p>
            Two files, and nothing to configure. The elements register
            themselves and the classes are already in the stylesheet — there is
            no build step to add and no framework to be on.
          </p>
          <div class="sds-actions">${start}</div>
        </div>
        <div class="sds-stack">
          <span class="sds-label">Install</span>
          <sds-code code-lang="bash" .body="${INSTALL}" copy></sds-code>
          <p>
            Pin a version where you depend on it. The class layer is the
            contract; the elements are how a page that runs JavaScript gets it
            without writing the markup out.
          </p>
        </div>
      </div>
    </section>

  </main>

  <footer class="sds-foot">
    <span class="sds-label">Soul Design System</span>
    <sds-link label="docs.typo3.org" href="https://docs.typo3.org" external></sds-link>
    <sds-link label="Contribute an icon" href="#"></sds-link>
  </footer>
</div>`;
}

/* No generated page in front of this one — the exception to the `['autodocs',
   '!dev']` every component carries. What a layout documents is what it does at
   a given width, which a docs page cannot show: the viewport tool renders in
   the story view alone. Untagged, the story itself is what the sidebar lists,
   hoisted to a single leaf by `name` below. */
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
