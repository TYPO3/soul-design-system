/* An answer.

   The narrowest whole surface the system has: one question, one answer, and
   everything the answer is bound to. That binding is the page — the source it
   came from, the versions it holds for, what it leaves out, and the state the
   installation was in when it was asked. An answer without those is a guess
   somebody typed confidently.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/diff.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/header.ts';
import { buttonLabel, buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type DiffLine } from '../../packages/frontend/src/components/diff.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { type PageMode, skipLink } from '../lib/page.ts';

/** The change the answer is about. A constant that depended on a value the
    setup defines later now resolves empty, so the dependency is inverted. */
const CHANGE: readonly DiffLine[] = [
  { kind: 'context', text: 'page.10.value = {$site.title}' },
  { kind: 'del', text: 'site.title = {$page.brand}' },
  { kind: 'add', text: 'site.title = TYPO3 Dev Companion' },
  { kind: 'context', text: '}' },
];

/** The page. `flat` composes the form a static file can hold. */
export function answerPage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a button's label is content, and
     `renderStatic` flattens no element that was given children. */
  const copy = flat
    ? buttonMarkup(
        { variant: 'secondary', size: 'sm' },
        html`<sds-icon name="actions-duplicate"></sds-icon>${buttonLabel('Copy answer')}`,
      )
    : html`<sds-button variant="secondary" size="sm"><sds-icon name="actions-duplicate"></sds-icon>Copy answer</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  <sds-header
    home="#answer"
    signet="../assets/design-system-signet-m.svg"
    brand="TYPO3"
    product="Dev Companion"
    version="typo3_changelog_lookup"
    tone="default"
  ></sds-header>

  <main class="sds-page" id="main-content">
    <div class="sds-stack" id="answer">
      <h1 class="sds-h3">Was <span class="sds-mono">TypoScript</span> constant substitution changed in 13.4?</h1>

      <div class="sds-row">
        <sds-badge label="answered" tone="ok"></sds-badge>
        <sds-badge label="bundled knowledge" tone="accent"></sds-badge>
        <sds-badge label="13.4"></sds-badge>
        <span class="sds-label sds-row__end">answered in 240${NNBSP}ms</span>
      </div>

      <sds-note
        tone="ok"
        heading="Answered from bundled knowledge · 13.4"
        .body="${html`Holds on 13.4 and main. It does not hold on 12.4, where the old
          resolution order is still in place, and it says nothing about extensions
          that override the constant handler.`}"
      ></sds-note>

      <p>
        Constants are resolved once, before the setup is parsed, so a constant can
        no longer depend on a value the setup defines later. Where that dependency
        existed, the constant now resolves empty rather than to the stale value.
      </p>

      <sds-diff path="config/sites/main/setup.typoscript" .body="${CHANGE}"></sds-diff>

      <sds-note
        tone="warn"
        heading="Your installation could not be booted — packages were read instead"
        .body="${html`So this answer omits anything a running extension would add to the
          constant handler. <span class="sds-mono">ddev start</span> would close the gap.`}"
      ></sds-note>

      <div class="sds-actions">
        ${copy}
        <sds-link label="Open the changelog entry" href="https://docs.typo3.org" external></sds-link>
      </div>
    </div>
  </main>
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Answer',
  excludeStories: ['answerPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/answer.html',
      title: 'Soul Design System — answer',
      subtitle: 'An answer carries its source, its version binding, and what it leaves out',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the block copies itself, the link says where it goes,
    and the mode switch moves the whole page. */
export const Page: Story = {
  name: 'Answer',
  render: () => answerPage(),
};

export const screenHtml = (): string => part(answerPage({ flat: true }));
