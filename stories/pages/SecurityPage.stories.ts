/* What it reads, and what it never sends.

   The page procurement reads, and the one place where an open project can be
   more convincing than a hosted one: every claim here can be checked by
   somebody who has the source. So it is built out of things a reader can go
   and verify — a reporting address, a named team, an advisory history, a
   stated retention — and not out of badges.

   The reporting address comes first. On most pages of this kind it is a line
   in the footer, which is where a researcher who found something gives up
   looking; here it is the first thing under the heading, because that is the
   only part of this page with a deadline attached.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/confval.ts';
import '../../packages/frontend/src/components/figure.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/table.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type BadgeTone } from '../../packages/frontend/src/components/badge.ts';
import { type ConfvalProps } from '../../packages/frontend/src/components/confval.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

/** What the tool is allowed to touch, stated as the reference it is: the name
    a reader searches for, the fact a machine would check, and the sentence
    saying what happens either way. */
const BOUNDARIES: readonly ConfvalProps[] = [
  {
    name: 'your project directory',
    type: 'read',
    default: 'never written',
    required: true,
    body: html`Composer files, the package registry, and whatever the
      installation reports about itself. Opened read-only — the process has no
      write path into your tree, which is checkable in the source rather than
      promised here.`,
  },
  {
    name: 'the bundled index',
    type: 'read',
    default: 'ships with the release',
    body: html`Built once per release from public sources and shipped inside
      the package. It is the only thing that answers when nothing else is
      reachable, and it says so in the answer.`,
  },
  {
    name: 'the network',
    type: 'one host',
    default: 'off unless asked',
    body: html`A single tool may fetch a page from
      <span class="sds-mono">docs.typo3.org</span>, and only when that tool is
      the one called. Nothing else leaves, and no telemetry exists to
      disable — there is none to begin with.`,
  },
  {
    name: 'what is kept',
    type: 'nothing',
    default: 'no state between runs',
    body: html`No account, no log of what was asked, no cache of your project.
      This is why there is nothing here to export and nothing to delete: the
      process ends and takes its memory with it.`,
  },
];

/** The advisories, which are the strongest thing this page has: an open
    project can show its whole history, and a reader who sees three of them
    fixed in days believes the fourth will be too. */
const ADVISORY_COLUMNS: readonly Column[] = [
  { head: 'Advisory', cls: 'sds-td-name' },
  { head: 'Affects', cls: 'sds-td-meta' },
  { head: 'Fixed in', cls: 'sds-td-meta' },
  { head: 'Reported to fixed', cls: 'sds-td-meta' },
  { head: 'Severity' },
];

const severity = (label: string, tone: BadgeTone): TemplateResult =>
  html`<sds-badge label="${label}" tone="${tone}"></sds-badge>`;

const ADVISORIES: readonly Row[] = [
  {
    cells: ['SA-2026-003', '1.3.0 – 1.3.2', '1.3.3', '4 days', severity('low', 'default')],
  },
  {
    cells: ['SA-2026-002', '1.2.0 – 1.2.4', '1.2.5', '2 days', severity('moderate', 'warn')],
  },
  {
    cells: ['SA-2025-001', '1.0.0 – 1.1.1', '1.1.2', '9 days', severity('high', 'error')],
  },
];

/** The line a project publishes so a researcher does not have to guess. */
const SECURITY_TXT = `Contact: mailto:security@example.org
Encryption: https://example.org/pgp-key.txt
Preferred-Languages: en, de
Policy: https://example.org/security
Expires: 2027-08-15T00:00:00.000Z`;

/** The page. `flat` composes the form a static file can hold. */
export function securityPage({ flat = false }: PageMode = {}): TemplateResult {
  const report = flat
    ? html`${buttonMarkup({ variant: 'primary', size: 'lg' }, 'Report a vulnerability')}${buttonMarkup(
        { variant: 'secondary', size: 'lg' },
        'Read the disclosure policy',
      )}`
    : html`<sds-button variant="primary" size="lg">Report a vulnerability</sds-button>
      <sds-button variant="secondary" size="lg">Read the disclosure policy</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(1, '#security')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="security">
      <div class="sds-stack">
        <span class="sds-label">for security, data protection and procurement</span>
        <h1 class="sds-display">It reads four things and sends one</h1>
        <p class="sds-lead">
          Every claim on this page can be checked against the source, which is
          the whole argument for an open tool. What follows is the boundary,
          the history, and the way to tell us we got it wrong.
        </p>
      </div>
    </section>

    <!-- First, not in the footer. A researcher who has found something and
         cannot find where to send it is a researcher who posts it instead. -->
    <section class="sds-band sds-band--quiet" id="report">
      <div class="sds-split">
        <div class="sds-column">
          <h2>Found something? Here is where it goes</h2>
          <p>
            A named team reads this address, acknowledges inside one working
            day and agrees a disclosure date with you. We do not ask for
            silence beyond the fix, and we credit you unless you ask us not
            to.
          </p>
          <div class="sds-row">
            <sds-badge label="acknowledged in 1 working day" tone="ok"></sds-badge>
            <sds-badge label="90-day disclosure, negotiable"></sds-badge>
          </div>
          <div class="sds-actions">${report}</div>
        </div>
        <div class="sds-column">
          <sds-code
            code-lang="text"
            caption="/.well-known/security.txt"
            source="${SECURITY_TXT}"
            copy
          ></sds-code>
        </div>
      </div>
    </section>

    <section class="sds-band" id="boundary">
      <div class="sds-stack">
        <h2>What it touches</h2>
        <p>
          Four things, and one of them leaves the machine. Stated as a
          reference rather than as prose, because this is the section somebody
          copies into a procurement questionnaire.
        </p>
        ${BOUNDARIES.map(
          (one) => html`<sds-confval
            name="${one.name}"
            type="${one.type ?? ''}"
            default="${one.default ?? ''}"
            ?required="${one.required ?? false}"
            .body="${one.body}"
          ></sds-confval>`,
        )}
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="path">
      <div class="sds-split sds-split--center">
        <div class="sds-column">
          <h2>The one line that leaves</h2>
          <p>
            Drawn rather than described, because “it only calls out for
            documentation” is the kind of sentence a reader has to take on
            trust. The single outbound path is the exception in the picture,
            and it is read-only.
          </p>
          <sds-note
            tone="ok"
            heading="There is no telemetry to turn off"
            .body="${html`No usage reporting, no crash reporting, no update check. A
              setting to disable one of those would imply there was one${NNBSP}— so instead
              this says there is not.`}"
          ></sds-note>
        </div>
        <div class="sds-column">
          <sds-figure
            src="../assets/diagrams/answer-sources.svg"
            alt="Five sources feeding the server, with one arrow leaving the machine towards the documentation"
            caption="Five sources, four of them on your disk. The one that leaves is drawn as the exception it is."
            zoomable
          ></sds-figure>
        </div>
      </div>
    </section>

    <section class="sds-band" id="advisories">
      <div class="sds-stack">
        <h2>Every advisory, including the slow one</h2>
        <p>
          Three so far, with the time from report to fix beside each. The nine
          days on the first one is in the table for the same reason the other
          two are: a history with the bad entry taken out is not a history.
        </p>
        <sds-table density="medium" scrollable .columns="${ADVISORY_COLUMNS}" .rows="${ADVISORIES}"></sds-table>
        <p>
          Advisories are published after a fix is available and never before.
          Every one of them names the versions affected rather than the ones
          fixed, because a reader is checking what they run.
        </p>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="procurement">
      <div class="sds-stack">
        <h2>For the questionnaire</h2>
        <p>
          The four answers procurement asks for, given here rather than in a
          form somebody has to request. None of them changes per customer,
          which is why none of them is behind a contact form.
        </p>
        ${grid(
          [
            html`<sds-surface
              box-style="min-width:0"
              plane="raised"
              label="hosting"
              heading="There is none"
              .body="${html`<p>
                The tool runs as a subprocess of your editor, on your machine. There is no
                service to host, no region to choose and no subprocessor to name.
              </p>`}"
            ></sds-surface>`,
            html`<sds-surface
              box-style="min-width:0"
              plane="raised"
              label="personal data"
              heading="None is processed"
              .body="${html`<p>
                It reads code and package metadata. Where a project’s own files contain
                personal data, they are read and not retained — nothing is written and
                nothing is sent.
              </p>`}"
            ></sds-surface>`,
            html`<sds-surface
              box-style="min-width:0"
              plane="raised"
              label="retention"
              heading="Nothing is kept"
              .body="${html`<p>
                No state survives the process. There is no log of what was asked, which is
                also why we cannot produce one for an audit.
              </p>`}"
            ></sds-surface>`,
            html`<sds-surface
              box-style="min-width:0"
              plane="raised"
              label="licence"
              heading="MIT, and it stays MIT"
              .body="${html`<p>
                The published source is the source that runs. There is no separate build
                for anyone, and no clause that changes for a paying reader.
              </p>`}"
            ></sds-surface>`,
          ],
          { flat, variant: 'dense' },
        )}
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
  title: 'Pages/Security',
  excludeStories: ['securityPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/security.html',
      title: 'TYPO3 Dev Companion — what it reads and what it sends',
      subtitle: 'The reporting address first, the boundary as a reference, and the advisory history with the slow one left in',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the block copies itself, the drawing opens at the size it
    was made, the table scrolls rather than widening the page, and every
    severity reads without seeing its colour. */
export const Page: Story = {
  name: 'Security',
  render: () => securityPage(),
};

export const screenHtml = (): string => part(securityPage({ flat: true }));
