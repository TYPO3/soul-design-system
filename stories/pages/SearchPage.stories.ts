/* The search results.

   The one list page where every rule about answers applies directly: say which
   sources were read, how many were found, and where none were, that the source
   answered rather than that nothing exists.

   So it carries three things most result pages do not. The query stays in the
   field, because a search that clears its own box makes refining it retyping
   it; the facets say how many are behind each; and the empty state is the same
   `sds-empty` the filtered list uses. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, render, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/crumbs.ts';
import '../../packages/frontend/src/components/empty.ts';
import '../../packages/frontend/src/components/field.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/pagination.ts';
import '../../packages/frontend/src/components/pills.ts';
import '../../packages/frontend/src/components/result.ts';
import { type Crumb } from '../../packages/frontend/src/components/crumbs.ts';
import { type NavChange } from '../../packages/frontend/src/components/nav-base.ts';
import { type ResultProps } from '../../packages/frontend/src/components/result.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [{ label: 'Overview', href: '#' }, { label: 'Search' }];

const QUERY = 'label';

const HITS: readonly (ResultProps & { kind: string })[] = [
  {
    kind: 'reference',
    path: 'Documentation · Tools',
    heading: 'typo3_label_lookup',
    snippet:
      'Reads labels from the installation. Where it cannot be booted the tool reads the package files instead and says which labels that leaves out.',
    meta: '13.4 · 14.3',
  },
  {
    kind: 'guide',
    path: 'News · Guides',
    heading: 'Reading the package registry when the installation will not boot',
    snippet:
      'The fallback returns every declared entry — labels among them — and none of the dynamically registered ones. The shortfall travels with the result.',
    meta: '24 July 2026',
  },
  {
    kind: 'changelog',
    path: 'Documentation · Changelog',
    heading: 'Label overrides resolve before the extension is loaded',
    snippet:
      'A label defined in TypoScript and overridden by an extension now resolves in the order the core documents, which changed in 13.4.',
    meta: '13.4',
  },
  {
    kind: 'reference',
    path: 'Documentation · Tools',
    heading: 'typo3_icon_lookup',
    snippet:
      'Returns the identifier the core itself uses. The label of an icon is not part of the answer — identifiers are what the registry holds.',
    meta: 'follows the installation',
  },
];

/** The sources the query was put to, and how many each answered with. A facet
    with no count is a guess the reader has to make. */
const FACETS = [
  { label: `everything${NNBSP}· 4`, kind: '' },
  { label: `reference${NNBSP}· 2`, kind: 'reference' },
  { label: `guides${NNBSP}· 1`, kind: 'guide' },
  { label: `changelog${NNBSP}· 1`, kind: 'changelog' },
  { label: `your installation${NNBSP}· 0`, kind: 'installation' },
];

export interface SearchMode extends PageMode {
  facet?: number;
  onFacet?: (index: number) => void;
}

/** The page. `flat` composes the form a static file can hold. */
export function searchPage({ flat = false, facet = 0, onFacet }: SearchMode = {}): TemplateResult {
  const current = FACETS[facet] ?? FACETS[0];
  const shown = current?.kind ? HITS.filter((hit) => hit.kind === current.kind) : HITS;

  const list = shown.length
    ? html`<div class="sds-stack">
          ${shown.map(
            (hit) => html`<sds-result
              kind="${hit.kind}"
              path="${hit.path ?? ''}"
              heading="${hit.heading}"
              snippet="${hit.snippet ?? ''}"
              match="${QUERY}"
              meta="${hit.meta ?? ''}"
              href="#"
            ></sds-result>`,
          )}
        </div>`
    : html`<sds-empty
          heading="Your installation was asked and answered with nothing"
          .body="${html`It was reached and searched, and no label in it matches
            <span class="sds-mono">${QUERY}</span>. Bundled knowledge holds four
            answers for the same query, which is what the other facets are.`}"
          action="Search everything instead"
          meta="typo3_label_lookup · installation"
        ></sds-empty>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(-1, '#search')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="search">
      <div class="sds-stack sds-stack--tight">
        <sds-crumbs .items="${TRAIL}"></sds-crumbs>
        <h1>Results for <span class="sds-mono">${QUERY}</span></h1>
        <sds-field
          caption="Search"
          field-id="q"
          name="q"
          value="${QUERY}"
          filled
          icon="actions-search"
          min-width="420"
          hint="Searches the documentation, the tool reference, the changelog and the news."
        ></sds-field>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="hits">
      <div class="sds-stack">
        <div class="sds-row">
          <sds-pills
            .items="${FACETS.map(({ label }) => ({ label }))}"
            active="${facet}"
            @sds-change="${(e: CustomEvent<NavChange>) => onFacet?.(e.detail.index)}"
          ></sds-pills>
          <span class="sds-label sds-row__end">${shown.length} of 4 · 240${NNBSP}ms</span>
        </div>

        ${list}

        <sds-pagination count="4" per-page="10" current="1" href="?q=typo3&amp;page={n}" label="results"></sds-pagination>
      </div>
    </section>

    <section class="sds-band" id="scope">
      <div class="sds-split">
        <div class="sds-stack">
          <h2>What was searched</h2>
          <p>
            Four sources, and the last of them is your own installation — which
            is searched only where one has been reached. A facet that says zero
            has been asked; a facet that is missing was never available.
          </p>
        </div>
        <div class="sds-stack">
          <sds-note
            heading="Bundled knowledge is version-bound and your installation is not"
            .body="${html`A result from bundled knowledge names the releases it holds for. One
              from the installation holds for whatever that installation runs, which
              is why the two are never merged into a single ranking.`}"
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
  title: 'Pages/Search',
  excludeStories: ['searchPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/search.html',
      title: 'TYPO3 Dev Companion — search',
      subtitle: 'What was found, what was searched, and what a source answering with nothing looks like',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the facets narrow the list and say how many are behind
    each of them, the query stays in the field so refining it is not retyping
    it, and `your installation · 0` reaches the state where a source was asked
    and answered with nothing. */
export const Page: Story = {
  name: 'Search',
  render: () => {
    const host = document.createElement('div');
    const draw = (facet: number): void => {
      render(searchPage({ facet, onFacet: draw }), host);
    };
    draw(0);
    return html`${host}`;
  },
};

export const screenHtml = (): string => part(searchPage({ flat: true }));
