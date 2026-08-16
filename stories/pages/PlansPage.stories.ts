/* What it costs.

   The page a marketing site gets wrong most reliably, and always in the same
   two ways: the tiers are adjectives instead of what you get, and the question
   every reader actually has — *what happens when I stop paying* — is answered
   nowhere. Both are fixed here by putting the answer on the page rather than
   in a policy somebody has to go and find.

   Three tiers, and the middle one is marked. Not because it is the one to sell
   but because it is the one most readers land on, and a set of three with none
   marked makes every reader do the comparison from scratch.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/accordion.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/eyebrow.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/table.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type Entry } from '../../packages/frontend/src/components/accordion.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

/** One way of having it. The price is a figure and a period, never "from" —
    a price a reader cannot add up is not a price. */
interface Plan {
  name: string;
  price: string;
  period: string;
  /** Who it is for, in one line. Not an adjective: a reader recognises
      themselves in a situation, never in the word "professional". */
  who: string;
  /** What this one adds that the one before it does not. The first states
      what it is rather than what it adds, because there is nothing before it. */
  adds: readonly string[];
  action: string;
  /** The one this page marks. Exactly one, or none. */
  marked?: boolean;
}

const PLANS: readonly Plan[] = [
  {
    name: 'Community',
    price: '€0',
    period: 'and it stays €0',
    who: 'Anyone running a supported release, on their own machine or in CI.',
    adds: [
      'Every tool, every source, no feature held back',
      'Answers for the releases still in active support',
      'Issues answered in the tracker, by whoever gets there first',
    ],
    action: 'Install it',
  },
  {
    name: 'Extended',
    price: '€490',
    period: 'per year, per organisation',
    who: 'Teams still running a release that left active support.',
    adds: [
      'Answers for releases back to 7.0, including the ones nobody else builds for',
      'A named contact, and a reply inside two working days',
      'The bundled index updated on the same schedule as the supported one',
    ],
    action: 'Start a subscription',
    marked: true,
  },
  {
    name: 'Audited',
    price: '€2,900',
    period: 'per year, per organisation',
    who: 'Organisations that have to show where an answer came from.',
    adds: [
      'A signed record of every index build, kept for seven years',
      'The source list fixed by contract rather than by release note',
      'A yearly review of what the tool read and what it never sent',
    ],
    action: 'Talk to us first',
  },
];

/** What differs, as the reader would check it: one row per capability, one
    column per plan, and the answers are words rather than ticks — a tick says
    "yes" and a reader still has to guess what to. */
const COLUMNS: readonly Column[] = [
  { head: 'What you are asking about', cls: 'sds-td-name' },
  { head: 'Community' },
  { head: 'Extended' },
  { head: 'Audited' },
];

const ROWS: readonly Row[] = [
  { cells: ['Tools available', 'all', 'all', 'all'] },
  { cells: ['Releases answered for', 'in active support', 'down to 7.0', 'down to 7.0'] },
  { cells: ['Index rebuilt', 'every release', 'every release', 'every release, signed'] },
  { cells: ['Reply to an issue', 'best effort', 'two working days', 'one working day'] },
  { cells: ['Record of what was read', 'none kept', 'none kept', 'seven years'] },
  { cells: ['Runs offline', 'yes', 'yes', 'yes'] },
  { cells: ['What leaves your machine', 'nothing', 'nothing', 'nothing'] },
];

/** The questions a price raises, answered on the page that raised them. The
    first stands open, because it is the one nobody asks out loud. */
const QUESTIONS: readonly Entry[] = [
  {
    question: 'What happens when I stop paying?',
    answer: html`The tool keeps working, at the Community level: every tool,
      every source, and answers for the releases still in active support. What
      you lose is the answers for releases that have left it, and the reply
      time. Nothing is deleted, nothing is locked, and no record of yours is
      held back — there is nothing of yours on our side to hold.`,
    open: true,
  },
  {
    question: 'Is the paid version a different program?',
    answer: html`No. It is the same binary reading a larger index. That is why
      Community is not a trial and does not expire: there is no second build
      with the features taken out.`,
  },
  {
    question: 'Per organisation — what counts as one?',
    answer: html`Whoever pays the invoice, and everyone who works for them.
      Not per seat, not per machine, and not per project: a licence somebody
      has to count is a licence somebody gets wrong.`,
  },
  {
    question: 'Can I pay for one release only?',
    answer: html`No, and it is worth saying why rather than leaving it as a
      gap: the index is built once for all of them, so a subscription for one
      release would cost us the same and cost you a negotiation.`,
  },
];

/** What a plan says under its name: who it is for, then what it adds. The
    body is a property rather than content between the tags, which is the one
    channel both renderings have — see `lib/page.ts`. */
const planBody = (one: Plan): TemplateResult => html`<p>${one.who}</p>
  <ul class="sds-list">
    ${one.adds.map((line) => html`<li>${line}</li>`)}
  </ul>`;

/** One plan. A card, because the whole of it goes somewhere — and the price
    is in the label register above the name, where a set of them is read down
    one edge rather than compared across three. */
const plan = (one: Plan): TemplateResult => html`<sds-card
  label="${one.price}${NNBSP}· ${one.period}"
  heading="${one.name}"
  tag="${one.marked ? 'where most start' : ''}"
  href="#compare"
  action="${one.action}"
  .body="${planBody(one)}"
></sds-card>`;

/** The page. `flat` composes the form a static file can hold. */
export function plansPage({ flat = false }: PageMode = {}): TemplateResult {
  const start = flat
    ? buttonMarkup({ variant: 'primary', size: 'lg' }, 'Install the free one')
    : html`<sds-button variant="primary" size="lg">Install the free one</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(0, '#plans')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="plans">
      <sds-eyebrow label="what it costs"></sds-eyebrow>
      <h1 class="sds-display">Free, and the paid one is the same program</h1>
      <p class="sds-lead">
        What you pay for is answers about releases nobody else still builds
        for, and somebody answerable when one is wrong. You never pay for a
        tool, a seat, or a feature held back to make a tier look thin.
      </p>
      <div class="sds-actions">${start}</div>
    </section>

    <section class="sds-band sds-band--quiet" id="tiers">
      ${grid(PLANS.map(plan), { flat, variant: 'flush' })}
      <p>
        Prices are per year and exclude VAT. There is no per-seat count and
        no minimum term${NNBSP}— a subscription that lapses becomes the free
        one rather than an expired install.
      </p>
      <!-- Under the prices while they are still on screen, rather than in a
           policy: a reader deciding needs the boundary at the moment they
           are deciding, and a tier list nobody can price out is a tier list
           that gets read as the whole cost. -->
      <h2 class="sds-h3">What none of them include</h2>
      <ul class="sds-list">
        <li>Hosting. It runs on your machine or in your pipeline, and that is where it stays.</li>
        <li>The work of a migration. Whoever does that is a person, not a subscription.</li>
        <li>Training. The manual is free and stays free; a course is somebody's time.</li>
        <li>Anything the free one does not already do. There is no feature behind the price.</li>
      </ul>
    </section>

    <section class="sds-band" id="compare">
      <h2>What actually differs</h2>
      <p>
        Seven questions, answered in words. A column of ticks says “yes” and
        leaves the reader to work out what to — which is how a comparison
        table ends up being the thing nobody trusts.
      </p>
      <sds-table density="medium" scrollable .columns="${COLUMNS}" .rows="${ROWS}"></sds-table>
    </section>

    <section class="sds-band sds-band--quiet" id="questions">
      <div class="sds-split">
        <div class="sds-column">
          <h2>Before you decide</h2>
          <p>
            The four questions a price raises, answered here rather than in a
            policy somebody has to go and find. The first one stands open
            because it is the one nobody asks out loud.
          </p>
          <sds-note
            tone="ok"
            heading="Nothing of yours is on our side"
            .body="${html`The tool reads your installation and answers locally. There is no
              account, no upload and no record of what you asked${NNBSP}— which is also why
              cancelling cannot cost you anything you had.`}"
          ></sds-note>
        </div>
        <div class="sds-column">
          <sds-accordion name="plan-questions" .entries="${QUESTIONS}"></sds-accordion>
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
  title: 'Pages/Plans',
  excludeStories: ['plansPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/plans.html',
      title: 'TYPO3 Dev Companion — what it costs',
      subtitle: 'Three tiers with one marked, a comparison answered in words, and what happens when you stop paying',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the marked tier reads as one of the set rather than as a
    bigger box, the table scrolls rather than widening the page, and the
    answers fold with no script. */
export const Page: Story = {
  name: 'Plans',
  render: () => plansPage(),
};

export const screenHtml = (): string => part(plansPage({ flat: true }));
