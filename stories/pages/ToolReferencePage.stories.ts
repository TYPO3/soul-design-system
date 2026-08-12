/* The tool reference.

   Compact density — 30px rows, 13px type — because here the list *is* the work
   and scanning beats reading. Density is a judgement about the reader, and this
   is the surface that judgement was written for.

   Live matters more here than on any other page: the tabs filter the list
   rather than drawing a row of words above a table that never changes. See
   `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/menu.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/image.ts';
import '../../packages/frontend/src/components/table.ts';
import '../../packages/frontend/src/components/tabs.ts';
import '../../packages/frontend/src/components/tab-item.ts';
import '../../packages/frontend/src/components/theme.ts';
import { type BadgeTone } from '../../packages/frontend/src/components/badge.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { tabsBarMarkup } from '../../packages/frontend/src/components/tabs.ts';
import { dsScreen, NNBSP, part, px } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';

/** What a tool is, as the reference reads it: what it is called, what it
    does, where its answers come from, which releases they hold for, and how
    it last answered. */
interface Tool {
  name: string;
  verb: 'lookup' | 'scope';
  source: string;
  versions: string;
  state: { label: string; tone: BadgeTone };
  /** The row the reader came here from. */
  current?: boolean;
}

const TOOLS: readonly Tool[] = [
  { name: 'typo3_rule_lookup', verb: 'lookup', source: 'bundled knowledge', versions: '12.4 · 13.4 · 14.3 · main', state: { label: 'answered', tone: 'ok' } },
  { name: 'typo3_hint_lookup', verb: 'lookup', source: 'bundled knowledge', versions: '12.4 · 13.4 · 14.3 · main', state: { label: 'answered', tone: 'ok' } },
  { name: 'typo3_icon_lookup', verb: 'lookup', source: 'installation', versions: 'follows the installation', state: { label: 'degraded', tone: 'warn' }, current: true },
  { name: 'typo3_label_lookup', verb: 'lookup', source: 'installation', versions: 'follows the installation', state: { label: 'answered', tone: 'ok' } },
  { name: 'typo3_schema_lookup', verb: 'lookup', source: 'installation', versions: 'follows the installation', state: { label: 'not booted', tone: 'error' } },
  { name: 'typo3_changelog_lookup', verb: 'lookup', source: 'installation · docs', versions: 'down to 7.0', state: { label: 'answered', tone: 'ok' } },
  { name: 'typo3_documentation_lookup', verb: 'lookup', source: 'docs.typo3.org', versions: 'requested release', state: { label: 'answered', tone: 'ok' } },
  { name: 'typo3_server_scope', verb: 'scope', source: 'this server', versions: '—', state: { label: 'no source', tone: 'default' } },
];

const COLUMNS: readonly Column[] = [
  { head: 'Tool', cls: 'sds-td-name' },
  { head: 'Verb', cls: 'sds-td-meta' },
  { head: 'Source' },
  { head: 'Versions', cls: 'sds-td-meta' },
  { head: 'State' },
];

/** A row per tool. The state is a badge rather than a word: it is the result
    of the last call, and a result carries a colour and a glyph everywhere
    else in this system. */
const rows = (tools: readonly Tool[]): readonly Row[] =>
  tools.map((tool) => ({
    cells: [
      tool.name,
      tool.verb,
      tool.source,
      tool.versions,
      html`<sds-badge label="${tool.state.label}" tone="${tool.state.tone}"></sds-badge>`,
    ],
    selected: tool.current ?? false,
  }));

const table = (tools: readonly Tool[]): TemplateResult =>
  html`<sds-table density="compact" scrollable .columns="${COLUMNS}" .rows="${rows(tools)}"></sds-table>`;

/** The three ways to read the list: whole, or by what a tool does. */
const VIEWS: readonly { label: string; tools: readonly Tool[] }[] = [
  { label: 'all', tools: TOOLS },
  { label: 'lookup', tools: TOOLS.filter((t) => t.verb === 'lookup') },
  { label: 'scope', tools: TOOLS.filter((t) => t.verb === 'scope') },
];

/** The page. `flat` composes the form a static file can hold. */
export function toolReferencePage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a tab's panel is written between
     the tags, and `renderStatic` flattens no element that was given children.
     Same bar function underneath, so the static file is the markup the
     element renders — and it holds the first view, which is the whole list. */
  const first = VIEWS[0] as (typeof VIEWS)[number];
  const list = flat
    ? html`${tabsBarMarkup(VIEWS.map(({ label }) => ({ label })), 0)}<div class="sds-tab__panel">${table(first.tools)}</div>`
    : html`<sds-tabs>
        ${VIEWS.map((view) => html`<sds-tab-item label="${view.label}">${table(view.tools)}</sds-tab-item>`)}
      </sds-tabs>`;

  return html`<div class="sds-shell">
  <header class="sds-bar">
    <a class="sds-lockup" href="#tools">
      <sds-image class="sds-signet" src="../assets/design-system-signet-m.svg" alt="" width="24" height="24"></sds-image>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Dev Companion</span></span>
    </a>
    <sds-menu label="Sections" .items="${[
      { label: 'overview', href: '#overview' },
      { label: 'tools', href: '#tools' },
      { label: 'knowledge', href: '#knowledge' },
      { label: 'install', href: '#install' },
    ]}" active="1"></sds-menu>
    <div class="sds-bar__end">
      <sds-theme></sds-theme>
    </div>
  </header>

  <main class="sds-page">
    <div class="sds-stack" id="tools">
      <h1 class="sds-h2">Tool surface</h1>
      <p>
        Eight tools. Every one is read-only; none writes to your installation.
      </p>

      <div class="sds-row">
        <sds-field value="Filter by name or source" icon="actions-search" label="Filter the tool list" min-width="280"></sds-field>
        <sds-badge label="readOnlyHint"></sds-badge>
        <sds-badge label="bundled knowledge" tone="accent"></sds-badge>
        <span class="sds-label sds-row__end">Compact${NNBSP}· ${px(30)} rows</span>
      </div>

      ${list}

      <sds-note
        tone="info"
        heading="Three tools need a bootable installation"
        .body="${html`Without one they read the package registry instead, which answers with a
          subset that looks like the whole. <span class="sds-mono">ddev start</span>
          removes the gap.`}"
      ></sds-note>
    </div>
  </main>
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Tool reference',
  excludeStories: ['toolReferencePage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/tool-reference.html',
      title: 'Soul Design System — tool reference',
      subtitle: 'The full tool surface at compact density — the list is the work',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the tabs filter the list, the field takes typing, the
    table scrolls rather than widening the page, and the mode switch moves all
    of it. */
export const Page: Story = {
  name: 'Tool reference',
  render: () => toolReferencePage(),
};

export const screenHtml = (): string => part(toolReferencePage({ flat: true }));
