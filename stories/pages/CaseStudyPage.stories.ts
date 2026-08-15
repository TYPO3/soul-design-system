/* One deployment, in full.

   A reference page earns nothing unless a reader can check it, so the two
   things that decide whether this works are near the top: who this was, in
   figures they can compare themselves against, and what it cost — including
   the part that went wrong. A case study with no bad month in it reads as
   marketing, and marketing is what a reader is already discounting.

   The headline is the outcome rather than the name. Somebody scanning a list
   of these is looking for their own situation, and "City of Kastrup adopts
   the Dev Companion" describes nobody's situation but ours.

   Live and static from one composition — see `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/image.ts';
import '../../packages/frontend/src/components/nav-breadcrumb.ts';
import '../../packages/frontend/src/components/nav-pager.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/quote.ts';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/table.ts';
import { buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type Crumb } from '../../packages/frontend/src/components/nav-breadcrumb.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { type StatProps } from '../../packages/frontend/src/components/stat.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';
import { sdsStat } from '../components/Stat.stories.ts';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Who uses it', href: '#' },
  { label: 'Kastrup' },
];

/** The box a reader checks themselves against before reading a word of the
    story. It is a table rather than prose because that is how it gets
    scanned, and because every line in it is a fact somebody could dispute. */
const FACTS_COLUMNS: readonly Column[] = [
  { head: 'What', cls: 'sds-td-name' },
  { head: 'This deployment' },
];

const FACTS: readonly Row[] = [
  { cells: ['Sector', 'Municipal administration'] },
  { cells: ['People affected', '340 editors across 22 departments'] },
  { cells: ['Sites', '1 installation, 14 sites, 3 languages'] },
  { cells: ['Release', 'TYPO3 13.4, upgraded from 11.5'] },
  { cells: ['Agency', 'Nordlys Digital, Aarhus'] },
  { cells: ['Ran from', 'January to July 2026'] },
  { cells: ['What it replaced', 'A wiki and two shared spreadsheets'] },
];

/** The results, each with what it was measured against and over how long. A
    figure with no method beside it is decoration, and a reader who cannot
    reproduce a number stops believing the other three. */
const RESULTS: readonly StatProps[] = [
  {
    value: '4',
    unit: 'h',
    label: 'to answer a naming question',
    icon: 'actions-clock',
    note: 'Down from two days. Measured as the time from question asked in the team channel to a linked answer, over 61 questions between March and June.',
  },
  {
    value: '71',
    unit: '%',
    label: 'of questions answered without a person',
    icon: 'actions-message',
    note: 'The remaining 29% were about this installation’s own conventions, which the tool does not index.',
  },
  {
    value: '0',
    label: 'changes written by the tool',
    icon: 'actions-file-shield',
    note: 'It reads. The audit at the end of the pilot found no write path, which is what the security office needed before the rollout.',
  },
  {
    value: '1',
    of: '3',
    label: 'departments still on the old way',
    icon: 'actions-users',
    note: 'Stated because it is true: the two with their own conventions found the answers less useful and were not pushed.',
  },
];

/** The page. `flat` composes the form a static file can hold. */
export function caseStudyPage({ flat = false }: PageMode = {}): TemplateResult {
  const actions = flat
    ? html`${buttonMarkup({ variant: 'primary' }, 'Find an agency in your sector')}${buttonMarkup(
        { variant: 'secondary' },
        'Read the next one',
      )}`
    : html`<sds-button variant="primary">Find an agency in your sector</sds-button>
      <sds-button variant="secondary">Read the next one</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(4, '#case')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="case">
      <sds-nav-breadcrumb .items="${TRAIL}"></sds-nav-breadcrumb>
      <!-- The outcome, not the name. Somebody scanning a list of these is
           looking for their own situation. -->
      <h1>How 340 editors stopped asking each other what an icon was called</h1>
      <p class="sds-lead">
        A municipal administration with fourteen sites, one installation and
        no shared vocabulary. What changed, what it cost, and the two
        departments it did not work for.
      </p>
    </section>

    <section class="sds-band sds-band--quiet" id="facts">
      <div class="sds-split">
        <div class="sds-column">
          <h2>Whether this is you</h2>
          <p>
            The shape of the deployment before any of the story, so a reader
            can stop here if it is nothing like theirs. Everything in the table
            is a fact somebody at Kastrup could dispute.
          </p>
        </div>
        <div class="sds-column">
          <sds-table density="compact" .columns="${FACTS_COLUMNS}" .rows="${FACTS}"></sds-table>
        </div>
      </div>
    </section>

    <section class="sds-band" id="before">
      <div class="sds-split sds-split--center">
        <div class="sds-column">
          <h2>What it was like before</h2>
          <p>
            Twenty-two departments had each grown their own names for the same
            things. A page-tree icon meant “unpublished” in one and “scheduled”
            in another, and both were right within their own department.
          </p>
          <p>
            The cost was not the confusion — it was the asking. Every new
            editor spent their first month finding out who to ask, and every
            experienced one spent a slice of every week answering.
          </p>
        </div>
        <div class="sds-column">
          <sds-image
            src="../assets/placeholders/community-folders.png"
            alt="Two departments' folder structures side by side, with the same icons used for different states"
            zoomable
          ></sds-image>
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="doubt">
      <div class="sds-stack">
        <!-- The quote goes where the reader's own doubt is, not at the end
             where it reads as a testimonial. -->
        <h2>The objection that nearly stopped it</h2>
        <p>
          The security office had one question, and it was the right one: a
          tool that reads the whole installation is a tool that can leak the
          whole installation.
        </p>
        <sds-quote
          .body="${'We assumed we would spend the pilot arguing about what it sends. We spent twenty minutes reading the source and the rest of the month on whether the answers were any good.'}"
          by="Mette Sørensen"
          as="Head of information security, Kastrup"
          initials="MS"
        ></sds-quote>
      </div>
    </section>

    <section class="sds-band" id="results">
      <div class="sds-stack">
        <h2>What changed, and how it was measured</h2>
        <p>
          Four figures, each with what it was measured against and over how
          long. The fourth is the one that did not go our way, and it is here
          for the same reason the first three are.
        </p>
        ${grid(RESULTS.map(sdsStat), { flat, variant: 'dense' })}
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="cost">
      <div class="sds-split">
        <div class="sds-column">
          <h2>What it took</h2>
          <p>
            Seven months, of which the first three were spent not on the tool
            at all but on agreeing which department’s names were going to win.
            That is the work this makes visible rather than the work it saves.
          </p>
          <sds-note
            tone="warn"
            heading="It does not index your own conventions"
            .body="${html`The two departments it did not help were the two with the most
              local vocabulary. Reading a site package for its own naming is on the
              roadmap${NNBSP}— it was not available here, and this page is not going to
              pretend it was.`}"
          ></sds-note>
        </div>
        <div class="sds-column">
          <sds-quote
            .body="${'The tool was the easy part. Getting twenty-two departments to agree on one word for one thing is the project — everything after that is installation.'}"
            by="Jonas Riis"
            as="Lead integrator, Nordlys Digital"
            initials="JR"
          ></sds-quote>
          <div class="sds-actions">${actions}</div>
        </div>
      </div>
    </section>

    <section class="sds-band" id="next">
      <div class="sds-stack">
        <h2>Other deployments</h2>
        <p>
          Two more, both smaller and neither in public administration. A single
          reference proves a single thing.
        </p>
        <sds-nav-pager
          previous-href="#case" previous-label="A university, 40 editors"
          next-href="#case" next-label="An agency running 60 client sites"
          label="Through the references"
        ></sds-nav-pager>
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
  title: 'Pages/Case study',
  excludeStories: ['caseStudyPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/case-study.html',
      title: 'TYPO3 Dev Companion — one deployment',
      subtitle: 'The outcome as the headline, a facts box to check yourself against, and every figure with its method',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the picture opens at the size it was made, the quote sits
    where the doubt is rather than at the end, and every figure carries the
    method it was measured by. */
export const Page: Story = {
  name: 'Case study',
  render: () => caseStudyPage(),
};

export const screenHtml = (): string => part(caseStudyPage({ flat: true }));
