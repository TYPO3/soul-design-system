/* The landing page.

   A whole surface rather than a component: the first page a project shows,
   with the pitch, what it is made of, and how to start. It is a **Starting
   Point** — a consuming project offers these in a picker to seed a new
   design — so it has to be a finished page and not a sketch.

   Live in Storybook and static in `screens/`, from one composition — see
   `lib/page.ts` for why both exist and where they differ. Live is the point:
   every story is opened by the test suite, so a page here is a page under
   test rather than a picture of one.

   The `<style>` block carries layout and nothing else. Every painted value is
   a token, which is what makes this a starting point rather than a design of
   its own.

   The `<style>` is inlined into the story as well as into the file: a page
   layout is layout, and there is nowhere else for it to live. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../src/components/pills.ts';
import '../src/components/surface.ts';
import '../src/components/badge.ts';
import '../src/components/code.ts';
import '../src/components/link.ts';
import '../src/components/button.ts';
import '../src/components/signet.ts';
import '../src/components/theme.ts';
import { buttonMarkup } from '../src/components/button.ts';
import { type CodeLine } from '../src/components/code.ts';
import { dsScreen, part } from './lib/specimen.ts';
import { type PageMode } from './lib/page.ts';

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

/** The page. `flat` composes the form a static file can hold. */
export function landingPage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a button's label is content, and
     `renderStatic` flattens no element that was given children. Same function
     underneath, so the file is the markup the element renders. */
  const start = flat
    ? html`${buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-play"></sds-icon>Start a design`)}${buttonMarkup({ variant: 'secondary' }, 'Browse the components')}`
    : html`<sds-button variant="primary"><sds-icon name="actions-play"></sds-icon>Start a design</sds-button>
        <sds-button variant="secondary">Browse the components</sds-button>`;
  const guidelines = flat
    ? buttonMarkup({ variant: 'secondary', size: 'sm' }, 'Read the guidelines')
    : html`<sds-button variant="secondary" size="sm">Read the guidelines</sds-button>`;

  return html`<div class="shell">
  <header class="head">
    <a class="sds-lockup" href="#overview">
      <sds-signet size="20"></sds-signet>
      <span class="sds-wordmark">TYPO3<span class="sds-wordmark__pipe" aria-hidden="true"></span><span class="sds-wordmark__product">Soul Design System</span></span>
    </a>
    <sds-pills .items="${[
      { label: 'overview', href: '#overview' },
      { label: 'tokens', href: '#tokens' },
      { label: 'components', href: '#components' },
      { label: 'install', href: '#install' },
    ]}" active="0"></sds-pills>
    <div class="head__end">
      <sds-badge label="1.0.0" tone="accent"></sds-badge>
      ${guidelines}
      <sds-theme></sds-theme>
    </div>
  </header>

  <main class="page">
    <div class="column">
      <div class="hero">
        <h1>A system, not a stylesheet</h1>
        <p>
          Tokens, a class layer and the elements over it — one vocabulary, whether
          a surface runs JavaScript or is rendered by PHP. Every rule it holds is
          shown on a card generated from the component that holds it.
        </p>
        <div class="actions">${start}</div>
      </div>

      <div class="split">
        <div class="planes">
          ${PLANES.map(
            (plane) => html`<sds-surface plane="panel" heading="${plane.heading}" body="${plane.body}" box-style="flex:1"></sds-surface>`,
          )}
        </div>
        <div>
          <p class="sds-label" style="margin:0 0 var(--space-3)">Install</p>
          <sds-code lang="bash" .body="${INSTALL}" copy></sds-code>
          <p class="sds-prose" style="margin:var(--space-4) 0 0">
            Two files, and nothing to configure. The elements register themselves
            and the classes are already in the stylesheet.
          </p>
        </div>
      </div>
    </div>
  </main>

  <footer class="foot">
    <span class="sds-label">Soul Design System</span>
    <sds-link label="docs.typo3.org" href="https://docs.typo3.org" external></sds-link>
    <sds-link label="Contribute an icon" href="#"></sds-link>
  </footer>
</div>`;
}

const meta: Meta = {
  title: 'Pages/Landing',
  tags: ['autodocs', '!dev'],
  excludeStories: ['landingPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
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

/** Click through it: a pill answers, the block copies itself, and the mode
    switch moves the whole page. */
export const Page: Story = {
  render: () => html`<style>${STYLE}</style>${landingPage()}`,
};

export const screenHtml = (): string => part(landingPage({ flat: true }));
