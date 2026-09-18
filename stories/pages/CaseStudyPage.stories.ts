/* One deployment, in full.

   A reference page earns nothing unless a reader can check it. So the two
   things that decide if this works are near the top. Who this was, in figures
   they can compare themselves against, and what it cost — the part that went
   wrong included. A case study with no bad month in it reads as marketing,
   and a reader already discounts marketing.

   The headline is the outcome rather than the name. Somebody who scans a list
   of these looks for their own situation, and "City of Kastrup adopts the Dev
   Companion" describes nobody's situation but ours.

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

/** The box a reader checks themselves against before they read a word of the
    story. A table rather than prose, because a reader scans it, and because
    every line in it is a fact somebody can dispute. */
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

/** The results, each with its measure and over how long. A figure with no
    method beside it is decoration, and a reader who cannot reproduce a number
    no longer believes the other three. */
const RESULTS: readonly StatProps[] = [
  {
    value: '4',
    unit: 'h',
    label: 'to answer a naming question',
    icon: 'actions-clock',
    note: 'Down from two days. The time from a question in the team channel to a linked answer, over 61 questions between March and June.',
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
    note: 'It reads. The audit at the end of the pilot found no write path. That is what the security office needed before the rollout.',
  },
  {
    value: '1',
    of: '3',
    label: 'departments still on the old way',
    icon: 'actions-users',
    note: 'Stated because it is true: the two with their own conventions found the answers less useful, and nobody pushed them.',
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
      <!-- The outcome, not the name. Somebody who scans a list of these
           looks for their own situation. -->
      <h1>How 340 editors stopped asking each other for the name of an icon</h1>
      <p class="sds-lead">
        A municipal administration with fourteen sites, one installation and
        no shared vocabulary. What changed, what it cost, and the two
        departments it did not work for.
      </p>
    </section>

    <section class="sds-band sds-band--quiet" id="facts">
      <div class="sds-split">
        <div class="sds-column">
          <h2>The starting point</h2>
          <p>
            The shape of the deployment before any of the story, so a reader
            can stop here if it is nothing like theirs. Everything in the table
            is a fact somebody at Kastrup can dispute.
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
          <h2>Before</h2>
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
            src="assets/placeholders/community-folders.png"
            alt="Two departments' folder structures side by side, with the same icons used for different states"
            zoomable
          ></sds-image>
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="doubt">
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
    </section>

    <section class="sds-band" id="results">
      <h2>The change, and its measure</h2>
      <p>
        Four figures, each with its measure and over how long. The fourth is
        the one that did not go our way, and it is here
        for the same reason the first three are.
      </p>
      ${grid(RESULTS.map(sdsStat), { flat, variant: 'dense' })}
    </section>

    <section class="sds-band sds-band--quiet" id="cost">
      <div class="sds-split">
        <div class="sds-column">
          <h2>The effort</h2>
          <p>
            Seven months, of which the first three went not on the tool at
            all but on the question of which department’s names win.
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
    </section>

  </main>

  ${siteFooter()}
</div>`;
}

/* Untagged for the reason `LandingScreen.stories.ts` gives. A whole layout
   has no variants to collect, and the widths it documents are reachable only
   in the story view. */
const meta: Meta = {
  title: 'Pages/Site/Case study',
  excludeStories: ['caseStudyPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/case-study.html',
      section: 'Site',
      title: 'TYPO3 Dev Companion — one deployment',
      subtitle: 'The outcome as the headline, a facts box to check yourself against, and every figure with its method',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it. The picture opens at the size of its construction. The
    quote sits where the doubt is rather than at the end, and every figure
    carries its method. */
export const Page: Story = {
  name: 'Case study',
  render: () => caseStudyPage(),
};

export const screenHtml = (): string => part(caseStudyPage({ flat: true }));
