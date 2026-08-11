/* The landing page.

   A whole surface rather than a component: the first page a project shows,
   with the pitch, what it is made of, and how to start. It is a **Starting
   Point** — a consuming project offers these in a picker to seed a new
   design — so it has to be a finished page and not a sketch.

   Generated, not hand-written. The three screens that came before this were
   written by hand, and every one of them ended up carrying a second copy of
   markup the components already produce: a code block spelled out span by
   span, an icon pasted in as a path. This composes the elements and
   `renderStatic` prints them, exactly as a specimen card is made, so a change
   to a component reaches the page.

   The `<style>` block carries layout and nothing else. Every painted value is
   a token, which is what makes this a starting point rather than a design of
   its own.

   Not a sidebar page: `Screens` documents these, and this file exists to
   generate one. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../src/components/pills.ts';
import '../src/components/surface.ts';
import '../src/components/badge.ts';
import '../src/components/code.ts';
import '../src/components/link.ts';
import { buttonMarkup } from '../src/components/button.ts';
import { type CodeLine } from '../src/components/code.ts';
import { dsScreen, indent, part } from './lib/specimen.ts';

const INSTALL: readonly CodeLine[] = [
  { kind: 'comment', text: '# one command, and the client finds it' },
  { kind: 'shell', text: 'composer require typo3/soul-design-system' },
  { kind: 'ok', text: 'linked two files into', code: 'public/assets' },
];

const PLANES = [
  {
    heading: 'Tokens',
    body: 'One accent, three syntax colours, no shadows anywhere. Both modes ship in one declaration.',
  },
  {
    heading: 'Components',
    body: 'Light-DOM custom elements over the same classes a PHP surface writes by hand. Neither is a fallback for the other.',
  },
  {
    heading: 'Specimens',
    body: 'Every claim on this page is a card generated from the component that makes it, so the documentation cannot drift.',
  },
];

/* Layout the system does not own: the page frame, the hero measure and the
   three-up row. Nothing here paints. */
const STYLE = `
.shell { min-height: 100vh; display: flex; flex-direction: column; }
.head {
  height: var(--height-header);
  display: flex; align-items: center; gap: var(--space-6);
  padding: 0 var(--gutter-page);
  border-bottom: var(--border-hairline) solid var(--border-subtle);
}
.head__end { margin-left: auto; display: flex; align-items: center; gap: var(--space-3); }
.page { flex: 1; padding: var(--space-12) var(--gutter-page) var(--space-10); }
.column { max-width: var(--width-content); margin: 0 auto; }
.hero { display: flex; flex-direction: column; gap: var(--space-5); }
.hero h1 {
  margin: 0;
  max-width: var(--measure-display);
  font-size: var(--font-size-display);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
}
.hero p {
  margin: 0;
  font-size: var(--font-size-lead);
  line-height: var(--leading-body);
  color: var(--text-secondary);
  max-width: var(--measure-lead);
}
.actions { display: flex; gap: var(--space-3); }
.split { display: flex; gap: var(--space-12); align-items: flex-start; margin-top: var(--space-12); }
.split > * { flex: 1; min-width: 0; }
.planes { display: flex; flex-direction: column; gap: var(--space-4); }
.foot {
  border-top: var(--border-hairline) solid var(--border-subtle);
  padding: var(--space-5) var(--gutter-page);
  display: flex; gap: var(--space-6); align-items: center;
}
`;

const meta: Meta = {
  title: 'Specimens/Landing',
  tags: ['!dev'],
  excludeStories: ['screenHtml'],
  parameters: {
    dsScreen: dsScreen({
      path: 'screens/landing.html',
      title: 'Soul Design System',
      subtitle: 'The first page: the pitch, what it is made of, and how to start',
      viewport: '1440x900',
      style: STYLE,
    }),
  },
};

export default meta;
type Story = StoryObj;

const head = (): string => `<header class="head">
${indent(part(html`<span class="sds-lockup"><span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span></span>`), 2)}
${indent(part(html`<sds-pills .items="${[
  { label: 'overview', href: '#overview' },
  { label: 'tokens', href: '#tokens' },
  { label: 'components', href: '#components' },
  { label: 'install', href: '#install' },
]}" active="0"></sds-pills>`), 2)}
  <div class="head__end">
${indent(part(html`<sds-badge label="1.0.0" tone="accent"></sds-badge>`), 4)}
${indent(part(buttonMarkup({ variant: 'secondary', size: 'sm' }, 'Read the guidelines')), 4)}
  </div>
</header>`;

const hero = (): string => `<div class="hero">
    <h1>A system, not a stylesheet</h1>
    <p>
      Tokens, a class layer and the elements over it — one vocabulary, whether a
      surface runs JavaScript or is rendered by PHP. Every rule it holds is shown
      on a card generated from the component that holds it.
    </p>
    <div class="actions">
${indent(part(buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-play"></sds-icon>Start a design`)), 6)}
${indent(part(buttonMarkup({ variant: 'secondary' }, 'Browse the components')), 6)}
    </div>
  </div>`;

const planes = (): string => `<div class="planes">
${PLANES.map((p) =>
  indent(part(html`<sds-surface plane="panel" heading="${p.heading}" body="${p.body}" box-style="flex:1"></sds-surface>`), 4),
).join('\n')}
  </div>`;

const install = (): string => `<div>
    <p class="sds-label" style="margin:0 0 var(--space-3)">Install</p>
${indent(part(html`<sds-code lang="bash" .body="${INSTALL}" copy></sds-code>`), 4)}
    <p class="sds-prose" style="margin:var(--space-4) 0 0">
      Two files, and nothing to configure. The elements register themselves and the
      classes are already in the stylesheet.
    </p>
  </div>`;

const foot = (): string => `<footer class="foot">
${indent(part(html`<span class="sds-label">Soul Design System</span>`), 2)}
${indent(part(html`<sds-link label="docs.typo3.org" href="https://docs.typo3.org" external></sds-link>`), 2)}
${indent(part(html`<sds-link label="Contribute an icon" href="#"></sds-link>`), 2)}
</footer>`;

export const screenHtml = (): string => `<div class="shell">
${indent(head(), 2)}
  <main class="page">
    <div class="column">
      ${hero()}
      <div class="split">
        ${planes()}
        ${install()}
      </div>
    </div>
  </main>
${indent(foot(), 2)}
</div>`;

export const Screen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(screenHtml())}`,
};
