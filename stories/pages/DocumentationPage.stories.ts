/* The documentation page.

   A tool rail, a 1200px page measure, 48px gutters — the layout where the
   documentation *is* the product presentation: a visitor gets the pitch and
   keeps scrolling into the reference without a seam.

   Live in Storybook and static in `screens/`, from one composition — see
   `lib/page.ts` for why both exist and where they differ. The live one is the
   point of this file: the rail folds, the pills answer, the field takes
   typing, and every story is opened by the test suite, so the layout is under
   test rather than merely drawn.

   It carries no stylesheet of its own. A page layout used to be a `<style>`
   block in whichever file drew the page — a shell, a bar, a body, and a set of
   media queries — so every surface wrote its own and the breakpoints
   disagreed. The layout classes are the system's now, which is what makes this
   a composition rather than a design. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../src/components/menu.ts';
import '../../src/components/rail.ts';
import '../../src/components/field.ts';
import '../../src/components/code.ts';
import '../../src/components/badge.ts';
import '../../src/components/button.ts';
import '../../src/components/image.ts';
import '../../src/components/theme.ts';
import { buttonMarkup } from '../../src/components/button.ts';
import { type CodeLine } from '../../src/components/code.ts';
import { type RailEntry } from '../../src/components/rail.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';

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
];

const INSTALL: readonly CodeLine[] = [
  { kind: 'comment', text: '# standalone: clone, install once' },
  { kind: 'shell', text: 'composer install' },
  { kind: 'ok', text: 'published 9 task skills to', code: '.agents/skills' },
];

/** The page. `flat` composes the form a static file can hold. */
export function documentationPage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a button's label is content, and
     `renderStatic` flattens no element that was given children. Same function
     underneath, so the static file is the markup the element renders. */
  const actions = flat
    ? html`${buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-play"></sds-icon>Run the checks`)}${buttonMarkup({ variant: 'secondary' }, 'Read the tool surface')}`
    : html`<sds-button variant="primary"><sds-icon name="actions-play"></sds-icon>Run the checks</sds-button>
      <sds-button variant="secondary">Read the tool surface</sds-button>`;

  return html`<div class="sds-shell">
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

    <main class="sds-column">
      <h1>It answers before it guesses</h1>
      <p class="sds-lead">
        A local server for the three audiences that do TYPO3 work. Every answer
        names the source it came from and the versions it holds for.
      </p>

      <h2 class="sds-h3">Install</h2>
      <p>
        It runs as a subprocess of your client. It needs PHP 8.2 or newer and
        nothing else — no daemon, no database, and no network unless a tool asks
        <span class="sds-mono">docs.typo3.org</span> for a page.
      </p>

      <sds-code code-lang="bash" .body="${INSTALL}" copy></sds-code>

      <div class="sds-actions">${actions}</div>
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
