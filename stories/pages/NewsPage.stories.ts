/* The list page.

   The distributor: everything published, newest first, narrowed by kind, with a
   way to page. News, releases, references and search results are the same page
   with different rows, so what it proves is the set and not any one entry.

   The filter is real, and the state it makes reachable is the one a list page
   is usually missing: a filter that matches nothing. Which entries are shown is
   the *page's* state — a component that filtered its own contents would decide
   what a list means. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, render, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/nav-pagination.ts';
import '../../packages/frontend/src/components/nav-pills.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type CardProps } from '../../packages/frontend/src/components/card.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type NavChange } from '../../packages/frontend/src/components/nav-base.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [{ label: 'Overview', href: '#' }, { label: 'News' }];

/** How many entries a page of this list holds. The row of numbers under it is
    told the same figure and divides — nothing here states how many pages that
    comes to. */
const PER_PAGE = 6;

/** An entry, plus the tag the filter reads. */
interface Entry extends CardProps {
  tag: string;
}

const ENTRIES: readonly Entry[] = [
  {
    tag: 'release',
    label: '9 August 2026 · 1.4.0',
    heading: 'Answers now name the source that answered',
    body: 'Every tool declares what it may read, and the result says which of the five reached it — so a partial answer can be told from a complete one without asking twice.',
    src: 'placeholders/tool-source-answer.png',
    alt: '',
  },
  {
    tag: 'guide',
    label: '24 July 2026',
    heading: 'Reading the package registry when the installation will not boot',
    body: 'The fallback returns every declared entry and none of the dynamically registered ones. What makes it usable is that the shortfall travels with the result.',
    src: 'placeholders/tool-package-registry.png',
    alt: '',
  },
  {
    tag: 'project',
    label: '2 July 2026',
    heading: 'One line leaves the machine, and it is drawn as the exception',
    body: 'Everything that answers a question is already on the developer’s disk. The single read-only path to the documentation is in the diagram rather than in a footnote.',
    src: 'placeholders/tool-external-path.png',
    alt: '',
  },
  {
    tag: 'release',
    label: '18 June 2026 · 1.3.0',
    heading: 'Changelog lookups bind down to 7.0',
    body: 'A question about an old installation is answered with what held then, or not at all. Where the bundled knowledge stops, the tool says so instead of answering from the nearest release it has.',
    src: 'placeholders/tool-changelog-history.png',
    alt: '',
  },
  {
    tag: 'guide',
    label: '30 May 2026',
    heading: 'Writing a task skill that fails at registration',
    body: 'A skill declares the sources it needs. One that cannot reach any of them says so when the server starts, which is the difference between a broken setup and a wrong answer.',
    src: 'placeholders/tool-registration.png',
    alt: '',
  },
  {
    tag: 'project',
    label: '12 May 2026',
    heading: 'What is written down, and what is not',
    body: 'The decisions kept in the repository, the ones kept in the knowledge base, and why the two lists are deliberately not the same.',
    src: 'placeholders/tool-written-record.png',
    alt: '',
  },
  {
    tag: 'guide',
    label: '28 April 2026',
    heading: 'Searching all sources without hiding where the answer came from',
    body: 'A broad search may reach several bundled indexes. The result keeps each match beside its source, so overlap can be inspected instead of silently merged away.',
    src: 'placeholders/tool-search.png',
    alt: '',
  },
  {
    tag: 'project',
    label: '15 April 2026',
    heading: 'Comparing two answers without flattening their differences',
    body: 'The comparison holds each result to the release and source that produced it. A missing field remains a gap rather than becoming an empty value that looks equal.',
    src: 'placeholders/tool-compare.png',
    alt: '',
  },
];

/** The ways to narrow the list. `security` is in the row on purpose: a filter
    that matches nothing is a state every list page has and most of them draw
    as a blank column. */
const FILTERS = [
  { label: 'all', tag: '' },
  { label: 'releases', tag: 'release' },
  { label: 'guides', tag: 'guide' },
  { label: 'project', tag: 'project' },
  { label: 'security', tag: 'security' },
];

export interface NewsMode extends PageMode {
  /** Which filter is current, by position in `FILTERS`. */
  filter?: number;
  /** Called when another is chosen. Absent in the static rendering, where
      there is no script to call it. */
  onFilter?: (index: number) => void;
}

/** The page. `flat` composes the form a static file can hold. */
export function newsPage({ flat = false, filter = 0, onFilter }: NewsMode = {}): TemplateResult {
  /* Storybook serves `assets/` at its root; a file under `screens/` reaches
     the same directory one level up. The path is the page's to know. */
  const assets = flat ? '../assets' : '/assets';

  const current = FILTERS[filter] ?? FILTERS[0];
  const shown = current?.tag ? ENTRIES.filter((e) => e.tag === current.tag) : ENTRIES;
  /* The page shows a page of the list, not the list. A row of numbers under
     every entry there is says the second page exists and puts nothing on it,
     and the count the row divides is then a total nothing on the screen
     agrees with. */
  const page = shown.slice(0, PER_PAGE);

  const list = shown.length
    ? html`${grid(
          page.map(
            (entry) => html`<sds-card
              heading="${entry.heading}"
              .body="${entry.body}"
              tag="${entry.tag}"
              label="${entry.label ?? ''}"
              src="${entry.src ? `${assets}/${entry.src}` : ''}"
              alt="${entry.alt ?? ''}"
              href="#"
            ></sds-card>`,
          ),
  { flat },
)}`
    : html`<sds-note
          tone="info"
          icon="actions-filter"
          label="Matched nothing"
          heading="Nothing here is tagged ${current?.label ?? ''}"
          .body="${html`<p>
            All ${ENTRIES.length} entries were read and none carries that tag. Tags
            are applied by hand, so an entry may be about the subject without wearing it.
          </p>
          ${flat
            ? buttonMarkup({ variant: 'ghost', size: 'sm' }, 'Show every entry')
            : html`<sds-button variant="ghost" size="sm" @click="${() => onFilter?.(0)}">Show every entry</sds-button>`}`}"
        ></sds-note>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(4, '#news')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="news">
      <sds-nav-breadcrumb .items="${TRAIL}"></sds-nav-breadcrumb>
      <h1>News</h1>
      <p class="sds-lead">
        Releases, guides, and what the project decided. Every entry says which
        release it holds for; nothing here is a roadmap.
      </p>
    </section>

    <section class="sds-band sds-band--quiet" id="entries">
      <div class="sds-row">
        <sds-nav-pills
          .items="${FILTERS.map(({ label }) => ({ label }))}"
          active="${filter}"
          @sds-change="${(e: CustomEvent<NavChange>) => onFilter?.(e.detail.index)}"
        ></sds-nav-pills>
        <span class="sds-label sds-row__end">${shown.length} of ${ENTRIES.length} entries</span>
      </div>

      ${list}

      ${shown.length
        ? html`<sds-nav-pagination count="${shown.length}" per-page="${PER_PAGE}" current="1" href="#entries-{n}" label="entries"></sds-nav-pagination>`
        : ''}
    </section>

    <section class="sds-band" id="follow">
      <div class="sds-split">
        <div class="sds-column">
          <h2>Follow along</h2>
          <p>
            Releases are announced here and in the repository. The feed carries
            the same entries in the same order, with the release each one holds
            for in its title.
          </p>
          <div class="sds-actions">
            <sds-link label="Repository" href="https://github.com" external icon="actions-brand-github"></sds-link>
            <sds-link label="Feed" href="#" icon="actions-rss"></sds-link>
          </div>
        </div>
        <div class="sds-column">
          <sds-note
            heading="An entry is not a version binding"
            .body="${html`What a release changed is written in the changelog the tools read.
              A post says what it was for; the tool says what it holds for.`}"
          ></sds-note>
        </div>
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
  title: 'Pages/News',
  excludeStories: ['newsPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/news.html',
      title: 'TYPO3 Dev Companion — news',
      subtitle: 'The distributor: entries narrowed by kind, the empty state that follows, and page two',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the filter narrows the list for real, `security` reaches
    the empty state and the offer inside it puts the list back, the drawings
    follow the mode switch, and the row of numbers says where the list
    continues. */
export const Page: Story = {
  name: 'News',
  render: () => {
    /* The page is a function of which filter is current, so pressing one
       re-renders it. A component that filtered its own contents would be a
       component that decided what a list means. */
    const host = document.createElement('div');
    const draw = (filter: number): void => {
      render(newsPage({ filter, onFilter: draw }), host);
    };
    draw(0);
    return html`${host}`;
  },
};

export const screenHtml = (): string => part(newsPage({ flat: true }));
