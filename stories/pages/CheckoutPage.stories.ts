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
import { html, nothing, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/copy.ts';
import '../../packages/frontend/src/components/dialog.ts';
import '../../packages/frontend/src/components/icon.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/run.ts';
import '../../packages/frontend/src/components/table.ts';
import { buttonLabel, buttonMarkup, type ButtonProps } from '../../packages/frontend/src/components/button.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type RunStep } from '../../packages/frontend/src/components/run.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { sdsRun } from '../components/Run.stories.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { type PageMode, skipLink } from '../lib/page.ts';

/** The checkout this page is about. One constant: the heading, the trail, the
    addresses and the question before it is dropped all name the same thing. */
const NAME = '14.3-dev';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Checkouts', href: '#' },
  { label: NAME },
];

/** What the checkout is, as an overview is scanned: a name and what it is,
    down one column. The three that change on their own stand first — a reader
    opening this page is asking after those. */
const ABOUT: readonly (readonly [string, TemplateResult])[] = [
  ['Branch', html`<span class="sds-mono">feature/soul</span>`],
  ['Remote', html`In step. The branch moved last on Tuesday and this was on it.`],
  ['Built', html`Two days ago, from <span class="sds-mono">48723bc</span>`],
  ['PHP', html`<span class="sds-mono">8.2</span> — the lowest the branch declares`],
  ['Project type', html`<span class="sds-mono">typo3-app</span>`],
  ['Served from', html`<span class="sds-mono">.build/public</span>`],
];

/** Every address the checkout answers on. A project with more than one site
    configuration serves more than one, and a reader looking for the second one
    has nowhere else to find it: the two doors at the top of the page open the
    first, and this is the list. The term is the site the domain belongs to. */
const DOMAINS: readonly (readonly [string, string])[] = [
  ['main', '14-3-dev.companion.test'],
  ['german', 'de.14-3-dev.companion.test'],
  ['campaign', 'launch.14-3-dev.companion.test'],
];

/** What a reader copies out of this page: four values pasted into a terminal,
    a client or a login, each with the button that takes it. */
const ACCESS: readonly (readonly [string, string, string?])[] = [
  ['Directory', '~/projects/blog/.worktrees/14-3-dev'],
  ['Database', 'companion_14_3_dev'],
  ['Backend user', 'admin'],
  [
    'Backend password',
    'a-development-password',
    'Generated when the checkout is provisioned, and gone when it is. It reaches nothing outside this machine, which is why it can be shown.',
  ],
];

const taken = (label: string, value: string, note?: string): TemplateResult =>
  html`<sds-copy label="${label}" value="${value}"></sds-copy>${
    note ? html`<span class="sds-facts__note">${note}</span>` : nothing
  }`;

/** The log, in the order a git client puts it: the subject is what a reader
    scans, the date and the hash are held to what they are, and what is not
    committed yet stands at the top of the same table rather than in a column
    beside it — it is the newest thing the worktree has and it is read first. */
const COMMITS: readonly Column[] = [
  { head: 'Subject' },
  { head: 'When', cls: 'sds-td-meta', align: 'end', fit: true },
  /* A person's name, in the sentence face and held to itself: a name set in
     the machine's font is a name being read as an identifier. */
  { head: 'Author', fit: true },
  { head: 'Commit', cls: 'sds-td-name', fit: true },
];

/** The hash, as the way to the commit itself. It is set in the link colour
    wherever it stands, and a hash that is not a link is that colour lying. */
const at = (sha: string): TemplateResult =>
  html`<sds-link
    href="https://github.com/typo3/blog/commit/${sha}"
    label="${sha}"
    external
  ></sds-link>`;

const LOG: readonly Row[] = [
  {
    cells: [
      html`Uncommitted changes <span class="sds-warn">4 files</span>`,
      'now',
      'You',
      '—',
    ],
  },
  { cells: ['Remove falsely committed files', `11${NNBSP}days ago`, 'A. Lindqvist', at('48723bc')] },
  { cells: ['Release 14.0.1', `11${NNBSP}days ago`, 'M. Okafor', at('f088fab')] },
  { cells: ['Check for the correct settings uid', `11${NNBSP}days ago`, 'A. Lindqvist', at('1a8ebfc')] },
  { cells: ['Comment form and reCAPTCHA validation', `11${NNBSP}days ago`, 'R. Bhatt', at('348084e')] },
  { cells: ['Escape markup in the JSON-LD output', `11${NNBSP}days ago`, 'M. Okafor', at('25f996d')] },
  { cells: ['Use associative keys in FlexForm items', `11${NNBSP}days ago`, 'R. Bhatt', at('39e8ef3')] },
  { cells: ['Update TypoScript conditions for v14', `12${NNBSP}days ago`, 'A. Lindqvist', at('66243fc')] },
  { cells: ['Update the frontend build to current dependencies', `12${NNBSP}days ago`, 'M. Okafor', at('909b288')] },
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

      <!-- The name, and at the far end of its line the two doors into the
           running site: a reader who came to look at the thing itself came for
           those and not for the presses that change it. A row inside the row,
           so the pair keeps one gap and the page writes no layout. -->
      <div class="sds-row">
        <h1 class="sds-h2"><span class="sds-mono">${NAME}</span></h1>
        <span class="sds-row sds-row__end">
          ${wayIn(flat, 'Open the site', 'https://14-3-dev.companion.test')}
          ${wayIn(flat, 'Backend', 'https://14-3-dev.companion.test/typo3')}
        </span>
      </div>

      <!-- What can be done to it. What cannot be taken back stands at the far
           end of the row, away from the press a reader came for. -->
      <div class="sds-actions">
        ${update}
        ${press(flat, { variant: 'secondary' }, 'Change what it runs')}
        ${press(flat, { variant: 'secondary' }, 'Fetch the data again')}
        ${press(flat, { variant: 'secondary' }, 'Provision it again')}
        <span class="sds-row__end">
          ${press(flat, { variant: 'danger' }, 'Remove this checkout', 'remove-checkout')}
        </span>
      </div>
    </section>

    <section class="sds-band sds-band--quiet">
      <h2 class="sds-h3">Overview</h2>
      <!-- Two lists and no paragraph between them: what each column holds is
           what its terms say, and a screen is entered at the block a reader
           came for rather than read from the top. -->
      <div class="sds-split">
        <div class="sds-column">
          <dl class="sds-facts">
            ${ABOUT.map(([term, said]) => html`<dt>${term}</dt><dd>${said}</dd>`)}
          </dl>
        </div>
        <div class="sds-column">
          <!-- One set holding two lists: the labels stand between them, where a
               definition list cannot carry them, and the values still come to
               rest at one edge because the lists borrow the set's columns. -->
          <div class="sds-facts-set">
            <p class="sds-label">Domains</p>
            <dl class="sds-facts">
              ${DOMAINS.map(([site, host]) => html`<dt>${site}</dt><dd>${taken(site, host)}</dd>`)}
            </dl>
            <p class="sds-label">Access</p>
            <dl class="sds-facts">
              ${ACCESS.map(([term, said, note]) => html`<dt>${term}</dt><dd>${taken(term, said, note)}</dd>`)}
            </dl>
          </div>
        </div>
      </div>
    </section>

    <section class="sds-band">
      <h2 class="sds-h3">Commits</h2>
      <sds-table scrollable .columns="${COMMITS}" .rows="${LOG}"></sds-table>
    </section>

    <section class="sds-band sds-band--quiet">
      <h2 class="sds-h3">History</h2>
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
