/* The documentation page.

   A tool rail, a 1080px column, 48px gutters — the layout where the
   documentation *is* the product presentation: a visitor gets the pitch and
   keeps scrolling into the reference without a seam.

   Live in Storybook and static in `screens/`, from one composition — see
   `lib/page.ts` for why both exist and where they differ. The live one is the
   point of this file: the rail folds, the pills answer, the field takes
   typing, and every story is opened by the test suite, so the layout is under
   test rather than merely drawn.

   The `<style>` block is layout and nothing else. Every painted value is a
   token, which is what makes this a starting point rather than a design. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../src/components/pills.ts';
import '../src/components/rail.ts';
import '../src/components/field.ts';
import '../src/components/code.ts';
import '../src/components/badge.ts';
import '../src/components/button.ts';
import '../src/components/signet.ts';
import '../src/components/theme.ts';
import { buttonMarkup } from '../src/components/button.ts';
import { type CodeLine } from '../src/components/code.ts';
import { type RailEntry } from '../src/components/rail.ts';
import { dsScreen, part } from './lib/specimen.ts';
import { type PageMode } from './lib/page.ts';

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

const STYLE = `
.shell { min-height: 100vh; display: flex; flex-direction: column; }
.head {
  height: var(--height-header);
  display: flex; align-items: center; gap: var(--space-6);
  padding: 0 var(--gutter-page);
  border-bottom: var(--border-hairline) solid var(--border-subtle);
}
.head__end { margin-left: auto; display: flex; align-items: center; gap: var(--space-3); }
.body { flex: 1; display: flex; gap: var(--space-12); padding: var(--space-8) var(--gutter-page); }
.col { flex: 1; max-width: var(--width-content); min-width: 0; display: flex; flex-direction: column; gap: var(--space-5); }
.col h1 {
  margin: 0;
  font-size: var(--font-size-h1);
  line-height: var(--leading-heading);
  letter-spacing: var(--tracking-display);
}
.col h2 { margin: var(--space-6) 0 0; font-size: var(--font-size-h3); }
.col p { margin: 0; }
.lead {
  font-size: var(--font-size-lead);
  line-height: var(--leading-body);
  color: var(--text-secondary);
  max-width: var(--measure-lead);
}
.actions { display: flex; gap: var(--space-3); margin-top: var(--space-4); }
`;

/** The page. `flat` composes the form a static file can hold. */
export function documentationPage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a button's label is content, and
     `renderStatic` flattens no element that was given children. Same function
     underneath, so the static file is the markup the element renders. */
  const actions = flat
    ? html`${buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-play"></sds-icon>Run the checks`)}${buttonMarkup({ variant: 'secondary' }, 'Read the tool surface')}`
    : html`<sds-button variant="primary"><sds-icon name="actions-play"></sds-icon>Run the checks</sds-button>
      <sds-button variant="secondary">Read the tool surface</sds-button>`;

  return html`<div class="shell">
  <header class="head">
    <a class="sds-lockup" href="#overview">
      <sds-signet size="20"></sds-signet>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Dev Companion</span></span>
    </a>
    <sds-pills .items="${[
      { label: 'overview', href: '#overview' },
      { label: 'tools', href: '#tools' },
      { label: 'knowledge', href: '#knowledge' },
      { label: 'install', href: '#install' },
    ]}" active="0"></sds-pills>
    <div class="head__end">
      <sds-field value="Search the documentation" icon="actions-search" label="Search the documentation" min-width="260"></sds-field>
      <sds-badge label="0.4.0" tone="accent"></sds-badge>
      <sds-theme></sds-theme>
    </div>
  </header>

  <div class="body">
    <aside style="width:var(--width-sidebar); flex:none">
      <sds-rail .items="${RAIL}" active="2"></sds-rail>
    </aside>

    <main class="col">
      <h1>It answers before it guesses</h1>
      <p class="lead">
        A local server for the three audiences that do TYPO3 work. Every answer
        names the source it came from and the versions it holds for.
      </p>

      <h2>Install</h2>
      <p class="sds-prose">
        It runs as a subprocess of your client. It needs PHP 8.2 or newer and
        nothing else — no daemon, no database, and no network unless a tool asks
        <span class="sds-mono">docs.typo3.org</span> for a page.
      </p>

      <sds-code lang="bash" .body="${INSTALL}" copy></sds-code>

      <div class="actions">${actions}</div>
    </main>
  </div>
</div>`;
}

const meta: Meta = {
  title: 'Pages/Documentation',
  tags: ['autodocs', '!dev'],
  excludeStories: ['documentationPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/documentation.html',
      title: 'Soul Design System — documentation',
      subtitle: 'Tool rail, 1080px column — the documentation is the product presentation',
      viewport: '1440x900',
      style: STYLE,
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the rail folds, a pill answers, the field takes typing,
    the block copies itself. */
export const Page: Story = {
  render: () => html`<style>${STYLE}</style>${documentationPage()}`,
};

export const screenHtml = (): string => part(documentationPage({ flat: true }));
