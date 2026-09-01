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
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/icon.ts';
import '../../packages/frontend/src/components/badge.ts';
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

/** What the checkout is, in the groups a reader asks after. Two on each side of
    the split, so neither half ends halfway up the other and the labels mark a
    boundary rather than sitting alone at the top of one column. */
const REPOSITORY: readonly (readonly [string, TemplateResult])[] = [
  ['Branch', html`<span class="sds-mono">feature/soul</span>`],
  ['Checked out', html`<span class="sds-mono">9f21c04</span>, the tip of the branch`],
  ['Remote', html`In step with <span class="sds-mono">origin</span>, fetched an hour ago`],
  [
    'Built',
    html`Two days ago, from <span class="sds-mono">48723bc</span>
      <span class="sds-facts__note">The checkout has moved on twice since.
        Bringing it up to date builds what is here.</span>`,
  ],
];

const RUNTIME: readonly (readonly [string, TemplateResult])[] = [
  ['Disk', html`1.4${NNBSP}GB — the worktree, its vendor tree and the database`],
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
  /* The rail, and no head over it: a heading there would name the drawing. */
  { head: '', cls: 'sds-td-graph' },
  { head: 'Subject' },
  { head: 'When', cls: 'sds-td-meta', align: 'end', fit: true },
  { head: 'Author', fit: true },
  { head: 'Commit', cls: 'sds-td-name', fit: true },
];

/** A node on the rail. Hollow is a place rather than a commit — the working
    copy, and the commit the worktree is standing on. */
const node = (mark?: 'open' | 'current'): TemplateResult =>
  html`<span class="sds-graph${mark ? ` sds-graph--${mark}` : ''}"></span>`;

/** The hash, as the way to the commit itself. It is set in the link colour
    wherever it stands, and a hash that is not a link is that colour lying. */
const at = (sha: string): TemplateResult =>
  html`<sds-link
    href="https://github.com/typo3/blog/commit/${sha}"
    label="${sha}"
    external
  ></sds-link>`;

/** A ref pointing at a commit, before the subject the way a git client puts it:
    it says what this commit *is* to the repository, which is read before what
    it did. Neither is a result, so neither carries a status colour. */
const ref = (label: string, icon: string): TemplateResult =>
  html`<sds-badge label="${label}" icon="${icon}"></sds-badge>`;

const LOG: readonly Row[] = [
  {
    cells: [
      node('open'),
      /* The one row that is not a commit, and the one a reader looks at first:
         it is what they have and have not put anywhere yet. */
      html`<strong>Uncommitted changes <span class="sds-warn">4 files</span></strong>`,
      '1 Sep 2026 13:53',
      '—',
      '—',
    ],
  },
  {
    cells: [
      node('current'),
      /* Where the worktree stands. Bold, like the row above it: what is bold
         here is what is current, and everything older is set as it is read. */
      html`<strong>${ref('feature/soul', 'actions-code-fork')} Add the campaign
        site configuration</strong>`,
      '1 Sep 2026 12:02',
      'R. Bhatt',
      at('9f21c04'),
    ],
  },
  { cells: [node(), 'Fix the reCAPTCHA validation on the contact form', '31 Aug 2026 18:04', 'M. Okafor', at('c77a13e')] },
  {
    cells: [
      node(),
      html`${ref('built', 'actions-package')} Remove falsely committed files`,
      '20 Aug 2026 09:18',
      'A. Lindqvist',
      at('48723bc'),
    ],
  },
  { cells: [node(), 'Release 14.0.1', '20 Aug 2026 08:47', 'M. Okafor', at('f088fab')] },
  { cells: [node(), 'Check for the correct settings uid', '20 Aug 2026 08:12', 'A. Lindqvist', at('1a8ebfc')] },
  { cells: [node(), 'Comment form and reCAPTCHA validation', '19 Aug 2026 17:40', 'R. Bhatt', at('348084e')] },
  { cells: [node(), 'Escape markup in the JSON-LD output', '19 Aug 2026 16:02', 'M. Okafor', at('25f996d')] },
  { cells: [node(), 'Use associative keys in FlexForm items', '19 Aug 2026 11:29', 'A. Lindqvist', at('39e8ef3')] },
];

/** The provision that stopped. A page for managing an instance is opened when
    something did not work, and a history of nothing but successes is a history
    nobody comes for — so the shape of a failure is on the page: where it got
    to, and what the step that failed wrote. */
const REFUSED: readonly RunStep[] = [
  { label: 'Create the worktree', state: 'done', meta: '2s' },
  {
    label: 'Install dependencies',
    state: 'failed',
    meta: '48s',
    output: `→ composer install --no-dev
✗ typo3/cms-core 14.3.0 requires php ^8.3, this checkout runs 8.2
✗ nothing was installed`,
  },
  { label: 'Build the frontend', state: 'ahead' },
  { label: 'Provision the database', state: 'ahead' },
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

      <!-- A state that asks for something carries the press that answers it. A
           mark beside the name says only that something is true, and leaves the
           reader to work out which of the four presses above answers it. -->
      <sds-note
        tone="warn"
        heading="The build is two commits behind the checkout"
        action="Bring it up to date"
        .body="${html`<span class="sds-mono">9f21c04</span> and
          <span class="sds-mono">c77a13e</span> are checked out here and
          are not in the build. Until it is built again the addresses below serve
          the code as it was at <span class="sds-mono">48723bc</span>.`}"
      ></sds-note>
    </section>

    <section class="sds-band sds-band--quiet">
      <h2 class="sds-h3">Overview</h2>
      <!-- One grid and not four lists: the values on a side come to rest at
           one edge, and the rule over a group in the second row stands level
           with the one beside it. Four lists drift apart by what they weigh. -->
      <div class="sds-facts-set">
        <div class="sds-facts-group">
          <p class="sds-label">Repository</p>
          <dl class="sds-facts">
            ${REPOSITORY.map(([term, said]) => html`<dt>${term}</dt><dd>${said}</dd>`)}
          </dl>
        </div>
        <div class="sds-facts-group">
          <p class="sds-label">Domains</p>
          <dl class="sds-facts">
            ${DOMAINS.map(([site, host]) => html`<dt>${site}</dt><dd>${taken(site, host)}</dd>`)}
          </dl>
        </div>
        <div class="sds-facts-group">
          <p class="sds-label">Runtime</p>
          <dl class="sds-facts">
            ${RUNTIME.map(([term, said]) => html`<dt>${term}</dt><dd>${said}</dd>`)}
          </dl>
        </div>
        <div class="sds-facts-group">
          <p class="sds-label">Access</p>
          <dl class="sds-facts">
            ${ACCESS.map(([term, said, note]) => html`<dt>${term}</dt><dd>${taken(term, said, note)}</dd>`)}
          </dl>
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
        heading: 'Provisioning stopped',
        verdict: 'failed',
        note: 'Failed at step 2 of 4 · 50s · an hour ago',
        steps: REFUSED,
      })}
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
