/* Getting it, and knowing what you got.

   The page a project owes anyone who is about to run its code on their own
   machine. It is drawn everywhere as a button and a version number, and what
   it actually has to carry is the three questions a careful reader asks
   before pressing it: which of these is mine, is this the file the project
   published, and what happens if it does not work.

   Hence the checksums in the table and the mono they are set in — they are
   machine-named things, and the whole point of one is that it can be compared
   character for character. Hence too the verification block being a command
   rather than a sentence saying to verify.

   No new components. That is worth saying: a page can be finished without the
   system growing, and this one is tabs, a table, code blocks, notes and the
   site's own chrome. Where a page needs something new, the need is real; where
   it does not, inventing something is how a system gets a second way to draw a
   list.

   Live in Storybook and static in `screens/`, from one composition — see
   `lib/page.ts` for why both exist and where they differ. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../src/components/badge.ts';
import '../../src/components/button.ts';
import '../../src/components/code.ts';
import '../../src/components/crumbs.ts';
import '../../src/components/link.ts';
import '../../src/components/note.ts';
import '../../src/components/table.ts';
import '../../src/components/tabs.ts';
import '../../src/components/tab-item.ts';
import { buttonMarkup } from '../../src/components/button.ts';
import { tabsBarMarkup } from '../../src/components/tabs.ts';
import { type CodeLine } from '../../src/components/code.ts';
import { type Crumb } from '../../src/components/crumbs.ts';
import { type Column, type Row } from '../../src/components/table.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [{ label: 'Overview', href: '#' }, { label: 'Get started' }];

/** The three ways in. Each is a whole way rather than a step of one, so the
    reader picks once and follows it to the end. */
const WAYS: readonly { label: string; body: readonly CodeLine[] }[] = [
  {
    label: 'composer',
    body: [
      { kind: 'comment', text: '# in the project the server should read' },
      { kind: 'shell', text: 'composer require --dev typo3/support-app' },
      { kind: 'ok', text: 'registered 8 tools in', code: '.mcp.json' },
    ],
  },
  {
    label: 'phar',
    body: [
      { kind: 'comment', text: '# one file, no autoloader, nothing to install' },
      { kind: 'shell', text: 'curl -LO https://example.org/typo3-support-app.phar' },
      { kind: 'shell', text: 'php typo3-support-app.phar install' },
      { kind: 'ok', text: 'registered 8 tools in', code: '.mcp.json' },
    ],
  },
  {
    label: 'from source',
    body: [
      { kind: 'comment', text: '# a checkout answers from itself as well' },
      { kind: 'shell', text: 'git clone https://github.com/example/support-app' },
      { kind: 'shell', text: 'composer install --no-dev' },
      { kind: 'ok', text: 'the checkout is now a source', code: 'answeredBy: checkout' },
    ],
  },
];

const FILES: { columns: readonly Column[]; rows: readonly Row[] } = {
  columns: [
    { head: 'File', cls: 'sds-td-name' },
    { head: 'What it is' },
    { head: 'Size', cls: 'sds-td-meta' },
    { head: 'SHA-256', cls: 'sds-td-meta' },
  ],
  rows: [
    {
      cells: [
        'typo3-support-app.phar',
        'The server, self-contained. PHP 8.2+ and nothing else.',
        `4.1${NNBSP}MB`,
        'a3f1…9c2e',
      ],
    },
    {
      cells: [
        'typo3-support-app.phar.asc',
        'The signature over the file above.',
        `833${NNBSP}B`,
        '—',
      ],
    },
    {
      cells: [
        'checksums.txt',
        'Every published file and its hash, signed with the same key.',
        `1.2${NNBSP}kB`,
        '7b04…11af',
      ],
    },
  ],
};

const VERIFY: readonly CodeLine[] = [
  { kind: 'comment', text: '# compare what you got against what was published' },
  { kind: 'shell', text: 'sha256sum -c checksums.txt' },
  { kind: 'ok', text: 'typo3-support-app.phar:', code: 'OK' },
];

/** The page. `flat` composes the form a static file can hold. */
export function downloadPage({ flat = false }: PageMode = {}): TemplateResult {
  /* The two places the renderings differ, and both for the same reason: a
     button's label and a tab's panel are written between the tags, and
     `renderStatic` flattens no element that was given children. */
  const start = flat
    ? html`${buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-download"></sds-icon>Download 1.4.0`)}${buttonMarkup({ variant: 'secondary' }, 'Read the install guide')}`
    : html`<sds-button variant="primary"><sds-icon name="actions-download"></sds-icon>Download 1.4.0</sds-button>
        <sds-button variant="secondary">Read the install guide</sds-button>`;

  const first = WAYS[0] as (typeof WAYS)[number];
  const ways = flat
    ? html`${tabsBarMarkup(WAYS.map(({ label }) => ({ label })), 0)}<div class="sds-tab__panel"><sds-code code-lang="bash" .body="${first.body}" copy></sds-code></div>`
    : html`<sds-tabs>
          ${WAYS.map(
            (way) => html`<sds-tab-item label="${way.label}"><sds-code code-lang="bash" .body="${way.body}" copy></sds-code></sds-tab-item>`,
          )}
        </sds-tabs>`;

  return html`<div class="sds-shell">
  ${siteBar(-1, '#get')}

  <main class="sds-bands">

    <section class="sds-band" id="get">
      <div class="sds-split">
        <div class="sds-stack">
          <sds-crumbs .items="${TRAIL}"></sds-crumbs>
          <h1 class="sds-h1">Get started</h1>
          <p class="sds-lead">
            One local process, started by your client. It needs PHP${NNBSP}8.2 or
            newer and a TYPO3 project it can read — no daemon, no database of its
            own, and no account anywhere.
          </p>
          <div class="sds-row">
            <sds-badge label="1.4.0" tone="accent"></sds-badge>
            <sds-badge label="GPL-2.0-or-later"></sds-badge>
            <sds-badge label="PHP 8.2+"></sds-badge>
          </div>
          <div class="sds-actions">${start}</div>
        </div>
        <div class="sds-stack">
          <span class="sds-label">Three ways in</span>
          ${ways}
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="files">
      <div class="sds-stack">
        <h2 class="sds-h2">What is published</h2>
        <p class="sds-prose">
          Three files, and two of them are only there so the first can be
          checked. The hashes are shortened here and in full in
          <span class="sds-mono">checksums.txt</span>.
        </p>
        <sds-table density="compact" scrollable .columns="${FILES.columns}" .rows="${FILES.rows}"></sds-table>
      </div>
    </section>

    <section class="sds-band" id="verify">
      <div class="sds-split">
        <div class="sds-stack">
          <h2 class="sds-h2">Check what you got</h2>
          <p class="sds-prose">
            One command, and it answers about the file on your disk rather than
            about the page you downloaded it from. A signature is worth more than
            a hash on the same server as the file — the key is published with the
            releases and changes when it is rotated, never quietly.
          </p>
        </div>
        <div class="sds-stack">
          <span class="sds-label">Verify</span>
          <sds-code code-lang="bash" .body="${VERIFY}" copy></sds-code>
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="after">
      <div class="sds-stack">
        <h2 class="sds-h2">When it does not answer</h2>
        <sds-note
          tone="warn"
          heading="The client starts it and nothing appears"
          .body="${html`The server writes what it registered to standard error on start.
            Run <span class="sds-mono">php typo3-support-app.phar scope</span> in the
            project by hand: it prints the same thing without a client in the way.`}"
        ></sds-note>
        <sds-note
          tone="error"
          heading="It starts and every tool says “not booted”"
          .body="${html`The installation cannot be booted from where the server was started.
            It answers from package files meanwhile, and
            <span class="sds-mono">ddev start</span> closes the gap for a DDEV project.`}"
        ></sds-note>
        <p class="sds-prose">
          Neither of those is a bug worth reporting until the scope has been
          read — it says which sources were reachable, and that is the answer to
          both questions.
        </p>
        <div class="sds-actions">
          <sds-link label="Read the install guide" href="#"></sds-link>
          <sds-link label="Report a wrong answer" href="#"></sds-link>
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
  title: 'Pages/Get started',
  excludeStories: ['downloadPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/get-started.html',
      title: 'TYPO3 Dev Companion — get started',
      subtitle: 'Which file is yours, whether it is the published one, and what to do when it does not answer',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the three ways switch, the blocks copy themselves, the
    table scrolls rather than widening the page, and the mode switch moves all
    of it. */
export const Page: Story = {
  name: 'Get started',
  render: () => downloadPage(),
};

export const screenHtml = (): string => part(downloadPage({ flat: true }));
