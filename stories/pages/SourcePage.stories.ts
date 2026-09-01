/* One source, in full — and the only page in this system where work is
   happening while it is read.

   The status page lists the six sources and says which are reachable; this is
   the one behind a row of it. What it has that no other page has is a job in
   flight: a share above and the stops it is going through below, with what each
   one wrote. Every other surface here reports something that has already
   settled, which is why `sds-progress` and `sds-run` had no page until now.

   The run's stops are `Run.stories.ts`'s own, imported rather than copied: a
   second set that said it slightly differently would be a page documenting a
   different job from the component it is showing.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/dialog.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/progress.ts';
import '../../packages/frontend/src/components/run.ts';
import '../../packages/frontend/src/components/icon.ts';
import '../../packages/frontend/src/components/stat.ts';
import { buttonLabel, buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type StatProps } from '../../packages/frontend/src/components/stat.ts';
import { READ, REFUSED, sdsRun } from '../components/Run.stories.ts';
import { sdsStat } from '../components/Stat.stories.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

/** The source this page is about. One constant, because the heading, the trail,
    the run and the dialog all name the same thing. */
const SOURCE = 'docs.typo3.org';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Status', href: '#' },
  { label: SOURCE },
];

/** What the source stands at. Three figures rather than a paragraph of them:
    the number is what a reader came for and the line under it says what the
    number is of. The slow one carries its own note, because a figure that is
    worse than it was is a fact somebody has to be told the shape of. */
const READINGS: readonly StatProps[] = [
  {
    value: '2.4',
    unit: 's',
    label: 'median response',
    note: html`It answered in 310${NNBSP}ms a week ago. Every documentation lookup
      waits for this, and nothing else on the list reads from it.`,
  },
  {
    value: '18,412',
    label: 'pages held',
    note: html`What the last full read put in the index. A page with no title is
      indexed by its path rather than dropped.`,
  },
  {
    value: '41',
    unit: 'min',
    label: 'since the last full read',
    note: html`Read on a schedule and answered from the index — the server never
      fetches while you are waiting for an answer.`,
  },
];

/** What is settled about it. A definition list, because each of these is a term
    and what it is: the shape anything falls into when it names things. */
const FACTS: readonly (readonly [string, TemplateResult])[] = [
  ['Endpoint', html`<span class="sds-mono">https://docs.typo3.org/sitemap.xml</span>`],
  ['Cached at', html`<span class="sds-mono">~/.cache/typo3-dev-companion/docs/</span>`],
  ['Read every', html`Six hours, and whenever you ask for it`],
  ['Answers for', html`<span class="sds-mono">12.4</span>, <span class="sds-mono">13.4</span>,
    <span class="sds-mono">14.3</span> and <span class="sds-mono">main</span>`],
];

/** The read that is going on, as the share and the stops it is made of. The bar
    is the share and the run is the work: a job that could not report a share
    would carry the run alone, which is most of them. */
const inFlight = (): TemplateResult => html`<sds-progress
    caption="Reading ${SOURCE}"
    value="3"
    max="5"
    readout="count"
    unit="steps"
    note="Building the index — 12,880 of 18,412 pages"
    pulsing
  ></sds-progress>
  ${sdsRun({
    heading: `Reading ${SOURCE}`,
    verdict: 'running',
    note: 'Step 3 of 5 · 1m 27s so far',
    open: true,
    steps: READ,
  })}`;

/** What happened before. Folded, because a past run is its verdict and how long
    — the stops are there for whoever asks. */
const earlier = (): TemplateResult => html`${sdsRun({
    heading: `Read ${SOURCE}`,
    verdict: 'done',
    note: 'All 5 steps · 3m 02s · six hours ago',
    steps: READ.map((step) => ({ ...step, state: 'done' as const })),
  })}
  ${sdsRun({
    heading: 'The read stopped',
    verdict: 'failed',
    note: 'Failed at step 2 of 4 · 2m 11s · yesterday, 06:12',
    steps: REFUSED,
  })}`;

/** The page. `flat` composes the form a static file can hold. */
export function sourcePage({ flat = false }: PageMode = {}): TemplateResult {
  /* The one place the two renderings differ: a button's label is content, and
     `renderStatic` flattens no element that was given children. The static form
     loses the press that opens the dialog with it, which is honest — a file
     nothing runs opens nothing. */
  const reread = flat
    ? buttonMarkup(
        { variant: 'primary' },
        html`<sds-icon name="actions-refresh"></sds-icon>${buttonLabel('Read it again')}`,
      )
    : html`<sds-button variant="primary"><sds-icon name="actions-refresh"></sds-icon>Read it again</sds-button>`;
  const stop = flat
    ? buttonMarkup({ variant: 'danger' }, 'Stop reading this source')
    : html`<sds-button variant="danger" for="stop-reading">Stop reading this source</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(-1, '#source')}

  <!-- The sections wrapper and nothing inside it: it is the distance *between*
       sections, and the sections themselves are plain, so the flow contract
       still grades what is in them — a heading close to its own text, a step
       under a block. A stack in here would replace that grading with one gap,
       which is what had four blocks reading as a single column. -->
  <main class="sds-page" id="main-content">
    <div class="sds-sections">
      <section>
        <sds-nav-breadcrumb .items="${TRAIL}"></sds-nav-breadcrumb>

        <div class="sds-row">
          <h1 class="sds-h2"><span class="sds-mono">${SOURCE}</span></h1>
          <!-- No glyph: the one that would mean this is the spinner, and a
               spinner that does not turn says the opposite of what it is. The
               word carries it, and the run below is where the turning is. -->
          <sds-badge label="reading now"></sds-badge>
        </div>

        <p class="sds-lead">
          One of the six sources, and one of the two this server may read over
          the network. It is read on a schedule and answered from the index, so
          a documentation lookup never waits for the site itself.
        </p>

        <!-- What can be done to it. What cannot be taken back stands at the far
             end of the row, away from the press a reader came for. -->
        <div class="sds-actions">
          ${reread}
          <sds-link label="Open the source" href="https://docs.typo3.org" external></sds-link>
          <span class="sds-row__end">${stop}</span>
        </div>

        ${grid(READINGS.map(sdsStat), { flat, variant: 'dense' })}
      </section>

      <section>
        <h2 class="sds-h3">Reading now</h2>
        ${inFlight()}
      </section>

      <section>
        <h2 class="sds-h3">Overview</h2>
        <dl class="sds-facts">
          ${FACTS.map(([term, value]) => html`<dt>${term}</dt><dd>${value}</dd>`)}
        </dl>
      </section>

      <section>
        <h2 class="sds-h3">Earlier reads</h2>
        ${earlier()}

        <sds-note
          tone="info"
          heading="This is a source, not a service"
          .body="${html`Nothing here is hosted for you to depend on. What this page
            can report is what the server reached and when — if ${SOURCE} is slow,
            every tool that declared it falls back to the next source it declared
            and says so in the answer.`}"
        ></sds-note>
      </section>
    </div>
  </main>

  <!-- The question asked before the source is dropped. The surface, the
       opening, the focus and Escape are the platform's own dialog element; what
       it says is this element's, and the button above names it. -->
  <sds-dialog
    id="stop-reading"
    heading="Stop reading ${SOURCE}?"
    body="The index stays until it goes stale, and then documentation lookups start answering from bundled knowledge alone."
    confirm-label="Stop reading it"
    cancel-label="Keep it"
    tone="danger"
  ></sds-dialog>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Source',
  excludeStories: ['sourcePage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/source.html',
      title: 'Dev Companion — one source',
      subtitle: 'The one page with work going on in it — a share, the stops it is made of, and what each one wrote',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the stops fold onto what they wrote and stay where you put
    them, the earlier reads open, and the press that cannot be taken back asks
    first. */
export const Page: Story = {
  name: 'Source',
  render: () => sourcePage(),
};

export const screenHtml = (): string => part(sourcePage({ flat: true }));
