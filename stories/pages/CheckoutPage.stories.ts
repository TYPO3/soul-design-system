/* One checkout, in full — the page behind a row of the list.

   `Table.stories.ts` draws the list and gives every row its way in; this is
   what the way in leads to. It is the shape any record's page falls into: what
   it is called, what may be done to it, what it stands at, what it is made of,
   and what has been done to it — in that order, because a reader arrives
   knowing which record and not knowing which of those they came for.

   Nothing here is a class of this page's own. Two things it would have been
   tempting to invent are the ones worth naming: a value somebody copies is an
   `sds-code` block with its term as the caption, and a list of commits is a
   table, because a commit is a row of facts and not a paragraph.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/copy.ts';
import '../../packages/frontend/src/components/dialog.ts';
import '../../packages/frontend/src/components/icon.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/run.ts';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/table.ts';
import { buttonLabel, buttonMarkup, type ButtonProps } from '../../packages/frontend/src/components/button.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type RunStep } from '../../packages/frontend/src/components/run.ts';
import { type StatProps } from '../../packages/frontend/src/components/stat.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { sdsStat } from '../components/Stat.stories.ts';
import { sdsRun } from '../components/Run.stories.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

/** The checkout this page is about. One constant: the heading, the trail, the
    addresses and the question before it is dropped all name the same thing. */
const NAME = '14.3-dev';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Checkouts', href: '#' },
  { label: NAME },
];

/** What it stands at. Three figures and not a paragraph of them: the number is
    what a reader came for and the line under it says what the number is of.
    The one that is not clean carries its own note, because a fact somebody has
    to act on is a fact somebody has to be told the shape of. */
const STANDING: readonly StatProps[] = [
  {
    value: 'in step',
    label: 'with the branch',
    icon: 'actions-refresh',
    note: 'Nothing to bring down. The branch moved last on Tuesday, and this checkout was on it.',
  },
  {
    value: '1',
    label: 'uncommitted change',
    icon: 'actions-file-edit',
    note: html`In <span class="sds-mono">config/sites/main/config.yaml</span>. It
      survives everything on this page except removing the checkout.`,
  },
  {
    value: '2',
    unit: 'days',
    label: 'since it was built',
    icon: 'actions-clock',
    note: 'Dependencies and the frontend build. Bringing it up to date builds it again.',
  },
];

/** What it runs. A definition list, because each of these is a term and what it
    is — the shape anything falls into when it names things. */
const SERVING: readonly (readonly [string, TemplateResult])[] = [
  ['PHP', html`<span class="sds-mono">8.2</span> — the lowest the branch declares`],
  ['Project type', html`<span class="sds-mono">typo3-app</span>`],
  ['Served from', html`<span class="sds-mono">.build/public</span>`],
  ['Built', html`Two days ago, from <span class="sds-mono">48723bc</span>`],
];

/** What a reader copies out of this page. Four values that are pasted into a
    terminal, a client or a login — so each is `sds-copy`: the value in the
    machine's own font with the button that takes it, on one line. A block
    around a single word is a frame around a frame. */
const ACCESS: readonly (readonly [string, string])[] = [
  ['Directory', '~/projects/blog/.worktrees/14-3-dev'],
  ['Database', 'companion_14_3_dev'],
  ['Backend user', 'admin'],
  ['Backend password', 'a-development-password'],
];

const taken = (label: string, value: string): TemplateResult =>
  html`<sds-copy label="${label}" value="${value}"></sds-copy>`;

const COMMITS: readonly Column[] = [
  /* Two columns hold a fixed shape and one holds the reading: the hash and the
     date are held to what they are, and the subject takes everything left. */
  { head: 'Commit', cls: 'sds-td-name', fit: true },
  { head: 'Subject' },
  { head: 'When', cls: 'sds-td-meta', align: 'end', fit: true },
];

/* No way into a row here: a commit on this page is a fact about the checkout
   and not a record with a page of its own. The column at the end is what a
   table gets when there is somewhere to go, and this is what it looks like
   when there is not. */
const LOG: readonly Row[] = [
  { cells: ['48723bc', 'Remove falsely committed files', `11${NNBSP}days ago`] },
  { cells: ['f088fab', 'Release 14.0.1', `11${NNBSP}days ago`] },
  { cells: ['1a8ebfc', 'Check for the correct settings uid', `11${NNBSP}days ago`] },
  { cells: ['348084e', 'Comment form and reCAPTCHA validation', `11${NNBSP}days ago`] },
  { cells: ['25f996d', 'Escape markup in the JSON-LD output', `11${NNBSP}days ago`] },
  { cells: ['39e8ef3', 'Use associative keys in FlexForm items', `11${NNBSP}days ago`] },
  { cells: ['66243fc', 'Update TypoScript conditions for v14', `12${NNBSP}days ago`] },
  { cells: ['909b288', 'Update the frontend build to current dependencies', `12${NNBSP}days ago`] },
];

/** What a fetch goes through. Two of them have happened, so they are written
    once and read twice — a second set that said it slightly differently would
    be a page documenting a different job from the one it is showing. */
const FETCH: readonly RunStep[] = [
  { label: 'Fetch the branch', state: 'done', meta: '3s', output: '→ fetching origin\n✓ 4 objects, 2 refs updated' },
  { label: 'Copy the database', state: 'done', meta: '8s' },
  { label: 'Import the files', state: 'done', meta: '5s' },
];

const CHECKOUT: readonly RunStep[] = [
  { label: 'Create the worktree', state: 'done', meta: '2s' },
  { label: 'Install dependencies', state: 'done', meta: '14s', output: '→ composer install --no-dev\n✓ 128 packages' },
  { label: 'Build the frontend', state: 'done', meta: '6s' },
  { label: 'Provision the database', state: 'done', meta: '2s' },
];

/** A way in, as the control it is: the running site and its backend, at the
    top of the page and at its end, where a reader who came to look at the thing
    itself finds them before the presses that change it. */
const wayIn = (flat: boolean, label: string, href: string): TemplateResult => {
  const body = html`${buttonLabel(label)}<sds-icon name="actions-window-open"></sds-icon>`;
  return flat
    ? buttonMarkup({ variant: 'secondary', href, rel: 'external' }, body)
    : html`<sds-button variant="secondary" href="${href}" rel="external"
        .content="${body}"></sds-button>`;
};

/** A press, in both renderings. A button's label is content, and `renderStatic`
    flattens no element that was given children — so the static form is the
    markup the element would have rendered, and the dialog it cannot open is
    honestly not opened. */
const press = (flat: boolean, props: ButtonProps, label: string, opens?: string): TemplateResult =>
  flat
    ? buttonMarkup(props, label)
    : html`<sds-button
        variant="${props.variant ?? 'primary'}"
        for="${opens ?? ''}"
      >${label}</sds-button>`;

/** The page. `flat` composes the form a static file can hold. */
export function checkoutPage({ flat = false }: PageMode = {}): TemplateResult {
  const update = flat
    ? buttonMarkup(
        { variant: 'primary' },
        html`<sds-icon name="actions-refresh"></sds-icon>${buttonLabel('Bring it up to date')}`,
      )
    : html`<sds-button variant="primary"><sds-icon name="actions-refresh"></sds-icon>Bring it up to date</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(-1, '#checkout')}

  <!-- Bands rather than sections: what this page is made of is four subjects
       and not four paragraphs, and a ground that changes is what says where one
       ends. The bands wrapper replaces the page one: two insets would indent
       the text twice. -->
  <main class="sds-bands" id="main-content">
    <section class="sds-band" id="checkout">
      <sds-nav-breadcrumb .items="${TRAIL}"></sds-nav-breadcrumb>

      <!-- The name, and at the far end of its line the running site: what it is
           doing and the two doors into it, which are one subject and not three
           things hung off the name. A row inside the row, so the group keeps one
           gap and the page writes no layout of its own. -->
      <div class="sds-row">
        <h1 class="sds-h2"><span class="sds-mono">${NAME}</span></h1>
        <span class="sds-row sds-row__end">
          <sds-badge label="serving" tone="ok"></sds-badge>
          ${wayIn(flat, 'Open the site', 'https://14-3-dev.companion.test')}
          ${wayIn(flat, 'Backend', 'https://14-3-dev.companion.test/typo3')}
        </span>
      </div>

      <p class="sds-lead">
        <span class="sds-mono">feature/soul</span>, checked out two days ago
        and served at an address of its own. It is in step with the branch and
        carries one change nobody has committed.
      </p>

      <!-- What can be done to it, and the two ways in. What cannot be taken
           back stands at the far end, away from the press a reader came for. -->
      <div class="sds-actions">
        ${update}
        ${press(flat, { variant: 'secondary' }, 'Change what it runs')}
        ${press(flat, { variant: 'secondary' }, 'Fetch the data again')}
        ${press(flat, { variant: 'secondary' }, 'Provision it again')}
        <span class="sds-row__end">
          ${press(flat, { variant: 'danger' }, 'Remove this checkout', 'remove-checkout')}
        </span>
      </div>

      ${grid(STANDING.map(sdsStat), { flat, variant: 'dense' })}
    </section>

    <section class="sds-band sds-band--quiet">
      <h2 class="sds-h3">What it runs, and how to reach it</h2>
      <p>
        The left half is settled by the branch and changes when the branch
        does. The right half is this checkout's own, and every line of it is a
        value somebody pastes into a terminal or a login — so each carries the
        button that takes it, rather than asking to be read off the screen.
      </p>
      <div class="sds-split">
        <div class="sds-column">
          <dl class="sds-facts">
            ${SERVING.map(([term, said]) => html`<dt>${term}</dt><dd>${said}</dd>`)}
          </dl>
        </div>
        <div class="sds-column">
          <dl class="sds-facts">
            ${ACCESS.map(([term, said]) => html`<dt>${term}</dt><dd>${taken(term, said)}</dd>`)}
          </dl>
        </div>
      </div>
      <sds-note
        tone="info"
        heading="The password is this checkout's, and only this checkout's"
        .body="${html`It is generated when the checkout is provisioned and goes
          when the checkout does. Nothing here reaches anything outside your
          machine, which is why it can be shown rather than hidden behind a
          press.`}"
      ></sds-note>
    </section>

    <section class="sds-band">
      <h2 class="sds-h3">The commits it stands on</h2>
      <p>
        What the branch has that the last build knows about. A commit is a row
        of facts and not a paragraph, so it is a table — and it has no page
        behind it, so the rows carry no way in.
      </p>
      <sds-table scrollable .columns="${COMMITS}" .rows="${LOG}"></sds-table>
    </section>

    <section class="sds-band sds-band--quiet">
      <h2 class="sds-h3">What has been done to it</h2>
      <p>
        Folded to the one line that says what became of each: what it was, how
        long it took and when. The stops are there for whoever asks, and what
        a stop wrote opens with it.
      </p>
      ${sdsRun({
        heading: 'Fetched the data',
        verdict: 'done',
        note: 'All 3 steps · 16s · seven hours ago',
        steps: FETCH,
      })}
      ${sdsRun({
        heading: 'Fetched the data',
        verdict: 'done',
        note: 'All 3 steps · 14s · two days ago',
        steps: FETCH,
      })}
      ${sdsRun({
        heading: 'Checked it out',
        verdict: 'done',
        note: 'All 4 steps · 24s · two days ago',
        steps: CHECKOUT,
      })}
    </section>
  </main>

  <!-- The question asked before the checkout goes. The surface, the opening,
       the focus and Escape are the platform's own dialog element; what it says
       is this element's, and the button above names it. -->
  <sds-dialog
    id="remove-checkout"
    heading="Remove ${NAME}?"
    body="The worktree, its database and its address go. The one uncommitted change goes with them, and the branch itself is untouched."
    confirm-label="Remove it"
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
  title: 'Pages/Checkout',
  excludeStories: ['checkoutPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/checkout.html',
      title: 'Dev Companion — one checkout',
      subtitle: 'The page behind a row: what it is called, what may be done to it, what it stands at, and what has been done to it',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the values copy, the past runs open onto their stops, and
    the press that cannot be taken back asks first. */
export const Page: Story = {
  name: 'Checkout',
  render: () => checkoutPage(),
};

export const screenHtml = (): string => part(checkoutPage({ flat: true }));
