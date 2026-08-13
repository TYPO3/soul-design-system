/* Everything the site has, on one page.

   Usually a generated list nobody reads, and it earns its place for one reason:
   it is the only page showing the shape of the site rather than a path through
   it. A list of everything answers "does this exist at all" and a search box
   does not.

   It is `sds-rail` three times over, groups standing open. A sitemap is the
   same list without a column next to it, and a second component for it would
   fold at a different width. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/crumbs.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/rail.ts';
import { type Crumb } from '../../packages/frontend/src/components/crumbs.ts';
import { type RailEntry } from '../../packages/frontend/src/components/rail.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [{ label: 'Overview', href: '#' }, { label: 'Sitemap' }];

/** The three columns, each a rail whose groups stand open. `open` is set on
    every group here and nowhere else: a rail beside a page folds so a reader
    can see past it, and a sitemap that folds is a sitemap that hides what it
    exists to list. */
const COLUMNS: readonly { title: string; items: readonly RailEntry[] }[] = [
  {
    title: 'The product',
    items: [
      { label: 'Overview', href: '#' },
      {
        label: 'features',
        open: true,
        items: [
          { label: 'Answers carry their source', href: '#' },
          { label: 'Version bindings', href: '#' },
          { label: 'Reading without booting', href: '#' },
        ],
      },
      {
        label: 'getting it',
        open: true,
        items: [
          { label: 'Get started', href: '#' },
          { label: 'Which way to run it', href: '#' },
          { label: 'Releases', href: '#' },
        ],
      },
    ],
  },
  {
    title: 'Reading it',
    items: [
      { label: 'Documentation', href: '#' },
      {
        label: 'tools',
        open: true,
        items: [
          { label: 'Tool reference', href: '#' },
          { label: 'typo3_icon_lookup', href: '#' },
          { label: 'typo3_label_lookup', href: '#' },
          { label: 'typo3_schema_lookup', href: '#' },
          { label: 'typo3_changelog_lookup', href: '#' },
        ],
      },
      {
        label: 'guides',
        open: true,
        items: [
          { label: 'Installing the server', href: '#' },
          { label: 'Writing a task skill', href: '#' },
          { label: 'Sources and preconditions', href: '#' },
        ],
      },
    ],
  },
  {
    title: 'The project',
    items: [
      { label: 'News', href: '#' },
      { label: 'Questions', href: '#' },
      {
        label: 'taking part',
        open: true,
        items: [
          { label: 'Who is behind it', href: '#' },
          { label: 'What is written down', href: '#' },
          { label: 'Report a wrong answer', href: '#' },
          { label: 'Contributing', href: '#' },
        ],
      },
      {
        label: 'legal',
        open: true,
        items: [
          { label: 'Licence', href: '#' },
          { label: 'Imprint', href: '#' },
          { label: 'Privacy', href: '#' },
        ],
      },
    ],
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function sitemapPage({ flat = false }: PageMode = {}): TemplateResult {
  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(-1, '#sitemap')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="sitemap">
      <div class="sds-stack sds-stack--tight">
        <sds-crumbs .items="${TRAIL}"></sds-crumbs>
        <h1>Sitemap</h1>
        <p class="sds-lead">
          Every page, and nothing that is not a page. It answers the question a
          search box cannot: whether the thing you are looking for exists here
          at all.
        </p>
        <sds-field
          caption="Search instead"
          field-id="q"
          name="q"
          value="A tool name, a release, or what you were looking for"
          icon="actions-search"
          min-width="420"
        ></sds-field>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="pages">
      ${grid(
        COLUMNS.map(
          (column) => html`<div class="sds-stack">
          <span class="sds-label">${column.title}</span>
          <sds-rail .items="${column.items}" active="-1"></sds-rail>
        </div>`,
        ),
        { flat },
      )}
    </section>

    <section class="sds-band" id="not-here">
      <div class="sds-stack">
        <h2>What is deliberately not here</h2>
        <sds-note
          heading="The knowledge base has no page per rule"
          .body="${html`What the tools answer from is not a website — it is asked through a
            tool and the answer carries its own binding. A page per rule would be a
            second copy of it, and the copy is the one that goes stale.`}"
        ></sds-note>
        <sds-note
          heading="Nothing about your installation is on this site"
          .body="${html`Everything read from an installation is read on the machine that runs
            it and stays there. There is no account here, so there is nothing here
            to have a page.`}"
        ></sds-note>
      </div>
    </section>

  </main>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Sitemap',
  excludeStories: ['sitemapPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/sitemap.html',
      title: 'TYPO3 Dev Companion — sitemap',
      subtitle: 'The shape of the site rather than a path through it — three rails with their groups open',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** The rail outside the layout it was built for: no column beside it, every
    group open, and nothing marked current — a map has no here on it. */
export const Page: Story = {
  name: 'Sitemap',
  render: () => sitemapPage(),
};

export const screenHtml = (): string => part(sitemapPage({ flat: true }));
