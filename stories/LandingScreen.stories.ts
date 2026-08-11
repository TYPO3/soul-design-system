/* The landing page.

   A whole surface rather than a component: the first page a project shows,
   with the pitch, what it is made of, and how to start. It is a **Starting
   Point** — a consuming project offers these in a picker to seed a new
   design — so it has to be a finished page and not a sketch.

   Live in Storybook and static in `screens/`, from one composition — see
   `lib/page.ts` for why both exist and where they differ. Live is the point:
   every story is opened by the test suite, so a page here is a page under
   test rather than a picture of one.

   It carries no stylesheet of its own: the shell, the bar, the page column and
   the two-up row are the system's layout classes, and so is where each of them
   sheds as the screen narrows.

*/

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

  return html`<div class="sds-shell">
  <header class="sds-bar">
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
    <div class="sds-bar__end">
      <sds-badge label="1.0.0" tone="accent"></sds-badge>
      ${guidelines}
      <sds-theme></sds-theme>
    </div>
  </header>

  <main class="sds-page">
    <div class="sds-page__column">
      <div class="sds-stack">
        <h1 class="sds-display">A system, not a stylesheet</h1>
        <p class="sds-lead">
          Tokens, a class layer and the elements over it — one vocabulary, whether
          a surface runs JavaScript or is rendered by PHP. Every rule it holds is
          shown on a card generated from the component that holds it.
        </p>
        <div class="sds-actions">${start}</div>
      </div>

      <div class="sds-split" style="margin-top:var(--space-12)">
        <div class="sds-stack">
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
      subtitle: 'The first page: the pitch, what it is made of, and how to start',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: a pill answers, the block copies itself, and the mode
    switch moves the whole page. */
export const Page: Story = {
  name: 'Landing',
  render: () => landingPage(),
};

export const screenHtml = (): string => part(landingPage({ flat: true }));
