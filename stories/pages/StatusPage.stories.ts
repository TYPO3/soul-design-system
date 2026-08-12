/* What is answering, and what is not.

   The page every project puts up after the first outage and nobody designs
   before it. Here nothing is a service the reader depends on being up, so what
   it honestly reports is the *sources* and which are reachable.

   Which makes it the one page where status colours belong on the page rather
   than inside a result — still in badges and result rows, never as furniture.
   No component was added for it: a status page with its own vocabulary is one
   nobody can compare to the rest of the site. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/crumbs.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/table.ts';
import { type BadgeTone } from '../../packages/frontend/src/components/badge.ts';
import { type Crumb } from '../../packages/frontend/src/components/crumbs.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [{ label: 'Overview', href: '#' }, { label: 'Status' }];

const badge = (label: string, tone: BadgeTone): TemplateResult =>
  html`<sds-badge label="${label}" tone="${tone}"></sds-badge>`;

const COLUMNS: readonly Column[] = [
  { head: 'Source', cls: 'sds-td-name' },
  { head: 'What it needs' },
  { head: 'State' },
  { head: 'Last checked', cls: 'sds-td-meta' },
];

const ROWS: readonly Row[] = [
  { cells: ['knowledge', 'Nothing running — it ships with the server', badge('answering', 'ok'), `4${NNBSP}min ago`] },
  { cells: ['checkout', 'Nothing running — the server’s own repository', badge('answering', 'ok'), `4${NNBSP}min ago`] },
  { cells: ['packages', 'Files on disk, on your machine', badge('not ours to report', 'default'), '—'] },
  { cells: ['installation', 'A booted installation, on your machine', badge('not ours to report', 'default'), '—'] },
  {
    cells: [
      'docs.typo3.org',
      'Outbound reach from your machine',
      badge('slow · 2.4 s', 'warn'),
      `4${NNBSP}min ago`,
    ],
  },
  { cells: ['releases.typo3.org', 'Outbound reach from your machine', badge('unreachable', 'error'), `4${NNBSP}min ago`] },
];

const FACTS = [
  {
    value: '2 of 3',
    label: 'network sources answering',
    note: html`One is slow and one is unreachable from the checker. Both are read-only
      and neither stops a tool that does not need them.`,
  },
  {
    value: '0',
    label: 'of your sources here',
    note: 'Packages and the installation are on your machine. Nothing about them is visible to this page, by construction.',
  },
  {
    value: `4${NNBSP}min`,
    label: 'since the last check',
    note: 'Checked every five minutes from one location, which is a claim about that location and not about yours.',
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function statusPage(_: PageMode = {}): TemplateResult {
  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(-1, '#status')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="status">
      <div class="sds-stack">
        <sds-crumbs .items="${TRAIL}"></sds-crumbs>
        <div class="sds-row">
          <h1>Status</h1>
          <sds-badge label="one source degraded" tone="warn"></sds-badge>
        </div>
        <p class="sds-lead">
          Nothing here is a service you depend on being up: the server runs on
          your machine. What this page can report is which of the sources it may
          read are reachable from outside, and one of them is not.
        </p>
        <div class="sds-stats">
          ${FACTS.map(
            (fact) => html`<sds-stat value="${fact.value}" label="${fact.label}" .note="${fact.note}"></sds-stat>`,
          )}
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="sources">
      <div class="sds-stack">
        <h2>The six sources</h2>
        <p>
          Two of them are yours and cannot be reported on from here, which is
          stated in the table rather than left as a blank row.
        </p>
        <sds-table density="medium" scrollable .columns="${COLUMNS}" .rows="${ROWS}"></sds-table>
      </div>
    </section>

    <section class="sds-band" id="what-it-means">
      <div class="sds-split">
        <div class="sds-stack">
          <h2>What a degraded source costs you</h2>
          <p>
            A tool that declared it falls back to the next source it declared and
            says so in the result. Nothing waits, nothing retries silently, and
            no answer arrives without the substitution named in it.
          </p>
          <div class="sds-actions">
            <sds-link label="What a source is" href="#"></sds-link>
            <sds-link label="Report a wrong answer" href="#"></sds-link>
          </div>
        </div>
        <div class="sds-stack">
          <sds-note
            tone="warn"
            heading="docs.typo3.org is answering slowly"
            .body="${html`Documentation lookups take about 2.4${NNBSP}s instead of 300${NNBSP}ms.
              Every other tool is unaffected: nothing else on this list reads from it.`}"
          ></sds-note>
          <sds-note
            tone="error"
            heading="releases.typo3.org is unreachable from the checker"
            .body="${html`Version discovery falls back to what the installation itself
              declares, which is the release you are running rather than the newest
              one that exists.`}"
          ></sds-note>
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="history">
      <div class="sds-stack">
        <h2>What this page is not</h2>
        <sds-note
          heading="It is one location asking, every five minutes"
          .body="${html`A source that answers here may be unreachable from your network, and
            the reverse. The tool’s own result is the authority for the machine it
            ran on — this page is a hint about the sources, not a verdict.`}"
        ></sds-note>
        <sds-note
          heading="There is no incident history, because there is no service"
          .body="${html`Nothing is hosted for you to depend on. What would be an outage
            elsewhere is a degraded answer here, and the answer says so at the moment
            it is given.`}"
        ></sds-note>
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
  title: 'Pages/Status',
  excludeStories: ['statusPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/status.html',
      title: 'TYPO3 Dev Companion — status',
      subtitle: 'The sources rather than a service: what is reachable, what is degraded, and what this cannot report',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** The one page where the status colours carry the subject. They still sit
    only in badges and result rows — never as page furniture. */
export const Page: Story = {
  name: 'Status',
  render: () => statusPage(),
};

export const screenHtml = (): string => part(statusPage({ flat: true }));
