/* The comparison.

   The archetype is drawn everywhere as three columns and a matrix in which
   everything is present somewhere, so nothing looks missing. This one takes the
   opposite position: a comparison is useful only where it says what each side
   **cannot** do, so the gaps are real and are the point.

   The marks carry an accessible name, never a bare glyph — a matrix of ticks
   read out as nothing is one only sighted readers can use, and an absent thing
   is an em dash and a name. Live and static — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/icon.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/table.ts';
import { buttonLabel, buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [{ label: 'Overview', href: '#' }, { label: 'Which way to run it' }];

/** Present, and said so to anything that cannot see the glyph. */
const yes = (what: string): TemplateResult =>
  html`<sds-icon name="actions-check-circle" label="${what}: yes"></sds-icon>`;

/** Absent. An em dash rather than a cross: nothing failed here, the capability
    is simply not part of this way of running it. */
const no = (what: string): TemplateResult =>
  html`<span class="sds-label" aria-label="${what}: no">—</span>`;

const COLUMNS: readonly Column[] = [
  { head: 'What it can answer', cls: 'sds-td-name' },
  { head: 'In your project' },
  { head: 'In CI' },
  { head: 'From a checkout' },
];

const ROWS: readonly Row[] = [
  { cells: ['bundled knowledge', yes('in your project'), yes('in CI'), yes('from a checkout')] },
  { cells: ['package files', yes('in your project'), yes('in CI'), no('from a checkout')] },
  { cells: ['booted installation', yes('in your project'), no('in CI'), no('from a checkout')] },
  { cells: ['dynamic registrations', yes('in your project'), no('in CI'), no('from a checkout')] },
  { cells: ['docs.typo3.org', yes('in your project'), no('in CI'), yes('from a checkout')] },
  { cells: ['this server’s own rules', yes('in your project'), yes('in CI'), yes('from a checkout')] },
];

const WAYS = [
  {
    label: 'the usual one',
    heading: 'In your project',
    body: 'Installed beside the project the questions are about. Every source is reachable, including the runtime state that only exists once something has booted.',
    note: 'Recommended, and the reason is the last two rows of the table rather than a badge.',
  },
  {
    label: 'unattended',
    heading: 'In CI',
    body: 'Nothing boots and nothing leaves the machine. Answers come from bundled knowledge and from files on disk, and every result says which of the two.',
    note: 'Where a check has to be reproducible more than it has to be complete.',
  },
  {
    label: 'no project',
    heading: 'From a checkout',
    body: 'The server answering about itself and about the documentation. No installation is involved, so nothing about one is claimed.',
    note: 'For writing task skills and for reading the rules the server holds.',
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function comparePage({ flat = false }: PageMode = {}): TemplateResult {
  const start = flat
    ? buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-download"></sds-icon>${buttonLabel('Install it in a project')}`)
    : html`<sds-button variant="primary"><sds-icon name="actions-download"></sds-icon>Install it in a project</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(-1, '#compare')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="compare">
      <div class="sds-stack sds-stack--tight">
        <sds-nav-breadcrumb .items="${TRAIL}"></sds-nav-breadcrumb>
        <h1>Which way to run it</h1>
        <p class="sds-lead">
          The same server, started from three places. They differ in what is
          running around it, which is the only thing that decides what it can
          answer — there is no edition, no tier, and nothing to buy.
        </p>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="ways">
      ${grid(
        WAYS.map(
          (way) => html`<sds-card
            label="${way.label}"
            heading="${way.heading}"
            body="${way.body}"
            note="${way.note}"
          ></sds-card>`,
        ),
        { flat },
      )}
    </section>

    <section class="sds-band" id="matrix">
      <h2>What each one can reach</h2>
      <p>
        Six sources, and the gaps are the reason this table exists. A
        comparison in which everything is present somewhere tells the reader
        nothing they could not have guessed.
      </p>
      <sds-table density="airy" scrollable .columns="${COLUMNS}" .rows="${ROWS}"></sds-table>
      <p>
        A dash is not a failure. It is a source that is not reachable from
        there${NNBSP}— and a tool that would need it says so at registration
        rather than answering from the next one down without mentioning it.
      </p>
    </section>

    <section class="sds-band sds-band--quiet" id="pick">
      <div class="sds-split">
        <div class="sds-column">
          <h2>Pick the first one unless you cannot</h2>
          <p>
            The other two exist because a machine sometimes cannot boot a
            TYPO3 installation — a pipeline, a review of a project you do not
            run, a skill being written against nothing in particular. Neither is
            a smaller version of the first; each answers less and says so.
          </p>
          <div class="sds-actions">
            ${start}
            <sds-link label="Read what a source is" href="#"></sds-link>
          </div>
        </div>
        <div class="sds-column">
          <sds-note
            heading="The same binary in all three"
            .body="${html`Nothing is compiled differently and no flag turns a capability on.
              What changes is what the machine around it can be asked, which is why
              this page compares places rather than products.`}"
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
  title: 'Pages/Compare',
  excludeStories: ['comparePage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/compare.html',
      title: 'TYPO3 Dev Companion — which way to run it',
      subtitle: 'A comparison whose gaps are the point, and whose marks are readable without seeing them',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the matrix scrolls rather than widening the page, every
    mark carries the name of the column it is in, and the mode switch moves all
    of it. */
export const Page: Story = {
  name: 'Compare',
  render: () => comparePage(),
};

export const screenHtml = (): string => part(comparePage({ flat: true }));
