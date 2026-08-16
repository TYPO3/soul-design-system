/* What holds until when.

   The page a self-hosted project cannot do without and that is almost always
   built as a bare table with colours in it. Two things fix most of it: the
   date the page was last true, at the top where a reader meets it, and a
   phase that is a word and a glyph rather than a fill — a support state
   carried by colour alone is a support state half the readers cannot read.

   The order is the reader's, not the release history's: what to run now, then
   how long each release has, then what it needs under it, then what is being
   worked on. The archive is last because it is for an audit rather than for a
   decision.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/eyebrow.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/table.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type BadgeTone } from '../../packages/frontend/src/components/badge.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { type StatProps } from '../../packages/frontend/src/components/stat.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';
import { sdsStat } from '../components/Stat.stories.ts';

/** The date this page was last true. Stated rather than implied: a roadmap
    with no date on it is worse than no roadmap, because a reader cannot tell
    a plan from a leftover. */
const AS_OF = '15 August 2026';

/** The four phases a release passes through, and what each one gets. A phase
    is a word, a glyph and a colour together — the badge carries all three, so
    nothing here is readable only to somebody who can see the fill. */
const PHASES: readonly { label: string; tone: BadgeTone; means: string }[] = [
  { label: 'active', tone: 'ok', means: 'Everything: features, fixes and security. The one to be on.' },
  { label: 'priority fixes', tone: 'default', means: 'No new features. Anything that stops work, and every security fix.' },
  { label: 'security only', tone: 'warn', means: 'Security fixes and nothing else. Plan the upgrade from here.' },
  { label: 'ended', tone: 'error', means: 'Nothing, including security. An install on this is an install at risk.' },
];

/** One release. The dates are the fact; the phase is worked out from them
    rather than kept by hand, which is how a page like this goes stale while
    still looking maintained. */
interface Release {
  version: string;
  released: string;
  activeUntil: string;
  securityUntil: string;
  phase: (typeof PHASES)[number];
}

const RELEASES: readonly Release[] = [
  { version: '14.3', released: 'Apr 2026', activeUntil: 'Oct 2027', securityUntil: 'Apr 2029', phase: PHASES[0] as (typeof PHASES)[number] },
  { version: '13.4', released: 'Oct 2024', activeUntil: 'Apr 2026', securityUntil: 'Oct 2027', phase: PHASES[1] as (typeof PHASES)[number] },
  { version: '12.4', released: 'Apr 2023', activeUntil: 'Oct 2024', securityUntil: 'Apr 2026', phase: PHASES[2] as (typeof PHASES)[number] },
  { version: '11.5', released: 'Oct 2021', activeUntil: 'Apr 2023', securityUntil: 'Oct 2024', phase: PHASES[3] as (typeof PHASES)[number] },
  { version: '10.4', released: 'Apr 2020', activeUntil: 'Oct 2021', securityUntil: 'Apr 2023', phase: PHASES[3] as (typeof PHASES)[number] },
];

const RELEASE_COLUMNS: readonly Column[] = [
  { head: 'Release', cls: 'sds-td-name' },
  { head: 'Phase' },
  { head: 'Released', cls: 'sds-td-meta' },
  { head: 'Active until', cls: 'sds-td-meta' },
  { head: 'Security until', cls: 'sds-td-meta' },
];

const releaseRows = (): readonly Row[] =>
  RELEASES.map((one) => ({
    cells: [
      one.version,
      html`<sds-badge label="${one.phase.label}" tone="${one.phase.tone}"></sds-badge>`,
      one.released,
      one.activeUntil,
      one.securityUntil,
    ],
    selected: one.phase.label === 'active',
  }));

/** What a release needs under it. The second table, because it decides the
    upgrade window as much as the dates do — an install that cannot move its
    PHP cannot move its release either. */
const PHP_COLUMNS: readonly Column[] = [
  { head: 'Release', cls: 'sds-td-name' },
  { head: 'PHP 8.1' },
  { head: 'PHP 8.2' },
  { head: 'PHP 8.3' },
  { head: 'PHP 8.4' },
];

/* Words rather than ticks. A tick says "yes" and leaves the reader to work
   out what to; "tested" and "not supported" say it. */
const PHP_ROWS: readonly Row[] = [
  { cells: ['14.3', 'no', 'no', 'tested', 'tested'] },
  { cells: ['13.4', 'no', 'tested', 'tested', 'tested'] },
  { cells: ['12.4', 'tested', 'tested', 'tested', 'no'] },
  { cells: ['11.5', 'tested', 'no', 'no', 'no'] },
];

/** The three figures a planner is actually after, so they are not left to be
    read out of a table of ten dates. */
const FACTS: readonly StatProps[] = [
  {
    value: '14.3',
    label: 'run this one',
    icon: 'actions-check-circle',
    note: 'In active support until October 2027, then security fixes until April 2029.',
  },
  {
    value: '20',
    unit: 'months',
    label: 'until 13.4 leaves security',
    icon: 'actions-clock',
    note: 'Long enough to plan an upgrade, short enough to start planning it now.',
  },
  {
    value: '2',
    of: '5',
    label: 'releases still getting security fixes',
    icon: 'actions-shield',
    note: '11.5 and 10.4 get nothing, including security. Extended support is a separate arrangement.',
  },
];

/** What is being worked on. Themes and a state — never a date: a date on
    something unbuilt is a promise the page cannot keep, and one broken
    promise costs more than the whole page is worth. */
const COMING: readonly { label: string; tone: BadgeTone; heading: string; body: string }[] = [
  {
    label: 'in development',
    tone: 'ok',
    heading: 'Answers across two releases at once',
    body: 'Asking what changed between 12.4 and 14.3 currently means asking twice and reading both. The work is in joining them into one answer that says which half came from where.',
  },
  {
    label: 'being decided',
    tone: 'default',
    heading: 'Reading a site package for its own conventions',
    body: 'Whether a project’s own naming should be indexed beside the core’s. It answers a real question and it doubles the surface that can be wrong, which is why it is not started.',
  },
  {
    label: 'not planned',
    tone: 'warn',
    heading: 'Writing anything back to an installation',
    body: 'Listed here because it is asked for often. Everything this reads is read-only by design, and a tool that edits is a different tool with a different risk.',
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function releasesPage({ flat = false }: PageMode = {}): TemplateResult {
  const upgrade = flat
    ? buttonMarkup({ variant: 'primary' }, 'Read the upgrade guide')
    : html`<sds-button variant="primary">Read the upgrade guide</sds-button>`;

  const phases = PHASES.map(
    (one) => html`<sds-surface
      plane="raised"
      heading="${one.label}"
      .body="${html`<div class="sds-row">
          <sds-badge label="${one.label}" tone="${one.tone}"></sds-badge>
        </div>
        <p>${one.means}</p>`}"
    ></sds-surface>`,
  );

  const coming = COMING.map(
    (one) => html`<sds-surface
      plane="raised"
      label="${one.label}"
      heading="${one.heading}"
      .body="${html`<p>${one.body}</p>`}"
    ></sds-surface>`,
  );

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(4, '#releases')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="releases">
      <sds-eyebrow label="releases and support"></sds-eyebrow>
      <h1 class="sds-display">What holds, and until when</h1>
      <p class="sds-lead">
        Every release, the phase it is in, and the date it stops getting
        fixes. Dates already reached are facts; everything after the next
        release is a plan, and this page says which is which.
      </p>
      <!-- The date the page was last true, at the top where a reader meets
           it. A roadmap with no date is worse than none: nobody can tell a
           plan from a leftover. -->
      <sds-note
        tone="info"
        heading="As of ${AS_OF}"
        .body="${html`Dates up to the next release are committed. Everything after it is
          an estimate and moves${NNBSP}— it is on this page so you can plan against it,
          not so you can hold us to it.`}"
      ></sds-note>
    </section>

    <section class="sds-band sds-band--quiet" id="now">
      <h2>What to run</h2>
      <p>
        Three figures, so the answer does not have to be read out of a table
        of ten dates.
      </p>
      ${grid(FACTS.map(sdsStat), { flat, variant: 'dense' })}
      <div class="sds-actions">${upgrade}</div>
    </section>

    <section class="sds-band" id="phases">
      <h2>What a phase means</h2>
      <p>
        Four phases, and each is a word, a glyph and a colour together. The
        legend stands above the table rather than under it, because a reader
        meets the marks in the table and needs them explained first.
      </p>
      ${grid(phases, { flat, variant: 'dense' })}
    </section>

    <section class="sds-band sds-band--quiet" id="dates">
      <h2>Every release</h2>
      <p>
        The row in support is marked. Two of these get nothing at all,
        including security — an installation on one of them is an
        installation at risk, and saying so is the point of the table.
      </p>
      <sds-table density="medium" scrollable .columns="${RELEASE_COLUMNS}" .rows="${releaseRows()}"></sds-table>
    </section>

    <section class="sds-band" id="php">
      <h2>What each one runs on</h2>
      <p>
        The upgrade window is set by this as much as by the dates: an install
        that cannot move its PHP cannot move its release either. Answers are
        words rather than ticks, so a cell means something on its own.
      </p>
      <sds-table density="medium" scrollable .columns="${PHP_COLUMNS}" .rows="${PHP_ROWS}"></sds-table>
    </section>

    <section class="sds-band sds-band--quiet" id="coming">
      <h2>What is being worked on</h2>
      <p>
        Themes and a state, and deliberately no dates. A date on something
        unbuilt is a promise this page cannot keep, and one broken promise
        costs more than the whole page is worth. What is <em>not</em> planned
        is here too, because that is also an answer.
      </p>
      ${grid(coming, { flat })}
    </section>

  </main>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason written out in `LandingScreen.stories.ts`: a whole
   layout has no variants to collect, and the widths it is documented at are
   reachable only in the story view. */
const meta: Meta = {
  title: 'Pages/Releases',
  excludeStories: ['releasesPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/releases.html',
      title: 'TYPO3 Dev Companion — releases and support',
      subtitle: 'Dated at the top, phases as word and glyph rather than fill, and what is not planned said out loud',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the supported row is marked rather than coloured, every
    phase reads without seeing its fill, and the tables scroll rather than
    widening the page. */
export const Page: Story = {
  name: 'Releases',
  render: () => releasesPage(),
};

export const screenHtml = (): string => part(releasesPage({ flat: true }));
