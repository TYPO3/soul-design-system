/* The documentation page.

   A tool rail, a 1200px page measure, 48px gutters — the layout where the
   documentation *is* the product presentation: a visitor gets the pitch and
   keeps scrolling into the reference without a seam.

   Live and static from one composition — see `lib/page.ts`. The live one is the
   point of this file: the rail folds, the pills answer, the field takes typing,
   and every story is opened by the test suite. It carries no stylesheet of its
   own, which is what makes it a composition rather than a design. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/accordion.ts';
import '../../packages/frontend/src/components/menu.ts';
import '../../packages/frontend/src/components/rail.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/image.ts';
import '../../packages/frontend/src/components/theme.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/card-grid.ts';
import '../../packages/frontend/src/components/pager.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type Entry } from '../../packages/frontend/src/components/accordion.ts';
import { type CodeLine } from '../../packages/frontend/src/components/code.ts';
import { type IconId } from '../../packages/frontend/src/components/icon.ts';
import { type RailEntry } from '../../packages/frontend/src/components/rail.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode, skipLink } from '../lib/page.ts';
import { SETTINGS, sdsConfval } from '../components/Confval.stories.ts';

const RAIL: readonly RailEntry[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Glossary', href: '#glossary' },
  {
    label: 'clients',
    items: [
      { label: 'Installing the server', href: '#installing' },
      { label: 'Writing a task skill', href: '#skill' },
    ],
  },
  {
    label: 'tools',
    items: [
      { label: 'typo3_icon_lookup', href: '#icon' },
      { label: 'typo3_label_lookup', href: '#label' },
      { label: 'typo3_schema_lookup', href: '#schema' },
    ],
  },
  { label: 'decisions', items: [{ label: 'What is written down', href: '#written' }] },
  { label: 'Settings', href: '#settings' },
];

/** The signpost under the overview, as a wall rather than a set: four ways on
    that a reader picks from by reading down, not by comparing. */
const NEXT: readonly { icon: IconId; heading: string; body: string; action: string }[] = [
  {
    icon: 'actions-book',
    heading: 'The tool surface',
    body: 'Every tool the server registers, what it is asked and what it answers with.',
    action: 'Read the reference',
  },
  {
    icon: 'actions-database',
    heading: 'The bundled knowledge',
    body: 'What ships inside the package, how it is versioned, and what it is not.',
    action: 'See what is in it',
  },
  {
    icon: 'actions-extension',
    heading: 'Writing a task skill',
    body: 'The shape of a skill, and the one rule that decides whether it earns a file.',
    action: 'Write one',
  },
  {
    icon: 'actions-tag',
    heading: 'What is written down',
    body: 'Decisions, requirements and the records that hold them together.',
    action: 'Read the records',
  },
];

const INSTALL: readonly CodeLine[] = [
  { kind: 'comment', text: '# standalone: clone, install once' },
  { kind: 'shell', text: 'composer install' },
  { kind: 'ok', text: 'published 9 task skills to', code: '.agents/skills' },
];

/** What the install step raises, answered where it is raised. The first stands
    open, so the shape of an answer is visible without pressing anything. */
const TROUBLE: readonly Entry[] = [
  {
    question: 'The client starts it and nothing is registered',
    answer: html`The binary ran with a PHP older than 8.2 and exited before it
      announced anything. Run <span class="sds-mono">php -v</span> as the client
      runs it — a shell and a desktop client rarely have the same one.`,
    open: true,
  },
  {
    question: 'It answers, but not about my installation',
    answer: html`Nothing was found to read. The server takes the project root as
      an argument and falls back to bundled knowledge without it, which is the
      answer you are getting.`,
  },
  {
    question: 'A tool says the installation would not boot',
    answer: html`It read the package registry from disk instead, and the answer
      says so rather than looking complete: every declared package is in it and
      none of the dynamically registered ones.`,
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function documentationPage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a button's label is content, and
     `renderStatic` flattens no element that was given children. Same function
     underneath, so the static file is the markup the element renders. */
  /* Same reason as the buttons: the cards are content, and `renderStatic`
     flattens no element that was given children. So the static file hands them
     to the same element as a property, which is the one channel a renderer
     outside a browser has. */
  const cards = NEXT.map(
    (one) => html`<sds-card
      icon="${one.icon}"
      heading="${one.heading}"
      body="${one.body}"
      href="#tools"
      action="${one.action}"
    ></sds-card>`,
  );
  const signposts = flat
    ? html`<sds-card-grid variant="flush" .content="${cards}"></sds-card-grid>`
    : html`<sds-card-grid variant="flush">${cards}</sds-card-grid>`;

  const actions = flat
    ? html`${buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-play"></sds-icon>Run the checks`)}${buttonMarkup({ variant: 'secondary' }, 'Read the tool surface')}`
    : html`<sds-button variant="primary"><sds-icon name="actions-play"></sds-icon>Run the checks</sds-button>
      <sds-button variant="secondary">Read the tool surface</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  <header class="sds-bar">
    <sds-menu for="page-rail" label="Pages"></sds-menu>
    <a class="sds-lockup" href="#overview">
      <sds-image class="sds-signet" src="../assets/design-system-signet-m.svg" alt="" width="24" height="24"></sds-image>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Dev Companion</span></span>
    </a>
    <sds-menu label="Sections" .items="${[
      { label: 'overview', href: '#overview' },
      { label: 'tools', href: '#tools' },
      { label: 'knowledge', href: '#knowledge' },
      { label: 'install', href: '#install' },
    ]}" active="0"></sds-menu>
    <div class="sds-bar__end">
      <sds-field value="Search the documentation" icon="actions-search" label="Search the documentation" min-width="260"></sds-field>
      <sds-badge label="0.4.0" tone="accent"></sds-badge>
      <sds-theme></sds-theme>
    </div>
  </header>

  <div class="sds-body">
    <aside class="sds-body__rail" id="page-rail">
      <sds-rail .items="${RAIL}" active="2"></sds-rail>
    </aside>

    <main class="sds-column" id="main-content">
      <div class="sds-stack sds-stack--tight">
        <h1>It answers before it guesses</h1>
        <p class="sds-lead">
          A local server for the three audiences that do TYPO3 work. Every answer
          names the source it came from and the versions it holds for.
        </p>
      </div>

      <h2 class="sds-h3">Install</h2>
      <p>
        It runs as a subprocess of your client. It needs PHP 8.2 or newer and
        nothing else — no daemon, no database, and no network unless a tool asks
        <span class="sds-mono">docs.typo3.org</span> for a page.
      </p>

      <sds-code code-lang="bash" .body="${INSTALL}" copy></sds-code>

      <div class="sds-actions">${actions}</div>

      <h2 class="sds-h3" id="settings">Settings</h2>
      <p>
        What a project has to set, and what it can leave alone. One entry per
        value: the name it is written under, the facts a machine checks, and a
        sentence saying what happens either way.
      </p>

      ${SETTINGS.map((one) => sdsConfval(one))}

      <h2 class="sds-h3">Before you file an issue</h2>
      <p>
        The three questions the install step raises, kept on the page it raises
        them on. Folded, because a reader who has none of them is reading the
        next section instead of scrolling past three answers.
      </p>

      <sds-accordion name="install-questions" .entries="${TROUBLE}"></sds-accordion>

      <h2 class="sds-h3">Where to go next</h2>
      <p>
        The signpost at the end of an overview, and the one place a card wall
        belongs: four ways on, read down as one block rather than compared as
        four things.
      </p>

      ${signposts}

      <!-- The way on, at the foot of a page that is read in order. The rail
           says where this page sits; this says which page comes next. -->
      <sds-pager
        previous-href="#installing" previous-label="Installing the server"
        next-href="#skill" next-label="Writing a task skill"
      ></sds-pager>
    </main>
  </div>
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Documentation',
  excludeStories: ['documentationPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/documentation.html',
      title: 'Soul Design System — documentation',
      subtitle: 'Tool rail, 1200px measure — the documentation is the product presentation',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the rail folds, a pill answers, the field takes typing,
    the block copies itself. */
export const Page: Story = {
  name: 'Documentation',
  render: () => documentationPage(),
};

export const screenHtml = (): string => part(documentationPage({ flat: true }));
