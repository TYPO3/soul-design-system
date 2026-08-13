/* A feature, read in full.

   The page a product site owes each of its claims: what the thing is, how it
   works, what it changes, what it costs, and what it does not do. It decides
   whether a system can hold marketing at all — everything else reports.

   Two rules follow, and both are the system's: a page that argues needs its
   **ground** to change between sections, which is `.sds-band`, and it has to
   end where every other page ends, which is `sds-footer`. Nothing on it is
   written twice. See `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/crumbs.ts';
import '../../packages/frontend/src/components/figure.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/table.ts';
import { buttonLabel, buttonMarkup } from '../../packages/frontend/src/components/button.ts';
import { type CodeLine } from '../../packages/frontend/src/components/code.ts';
import { type Crumb } from '../../packages/frontend/src/components/crumbs.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { SOURCE_FACTS } from '../components/Stat.stories.ts';
import { siteBar, siteFooter } from '../lib/site.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode, skipLink } from '../lib/page.ts';

const TRAIL: readonly Crumb[] = [
  { label: 'Overview', href: '#' },
  { label: 'Features', href: '#' },
  { label: 'Answers carry their source' },
];

const SOURCES: { columns: readonly Column[]; rows: readonly Row[] } = {
  columns: [
    { head: 'Source', cls: 'sds-td-name' },
    { head: 'What it reads' },
    { head: 'Required machine state' },
    { head: 'Versions', cls: 'sds-td-meta' },
  ],
  rows: [
    { cells: ['knowledge', 'Curated rules and hints, shipped with the server', 'nothing running', '12.4 · 13.4 · 14.3 · main'] },
    { cells: ['checkout', 'This server’s own repository', 'nothing running', 'follows the checkout'] },
    { cells: ['packages', 'Files on disk, read and never executed', 'files on disk', 'follows the installation'] },
    { cells: ['installation', 'Assembled runtime state', 'a booted installation', 'follows the installation'] },
    { cells: ['network', 'Official documentation and core services', 'outbound reach', 'requested release'] },
  ],
};

/** What a tool returns beside the answer. The fields are the feature: without
    them a caller cannot tell a complete answer from a partial one. */
const RESULT = `{
  "answeredBy": "packages",
  "declared": ["installation", "packages"],
  "versions": ["13.4", "main"],
  "omitted": "dynamically registered entries, never read"
}`;

const CONSEQUENCES = [
  {
    icon: 'actions-database' as const,
    label: 'in every result',
    heading: 'The source is named, not implied',
    body: 'A tool declares what it may read and returns which of them answered. Two answers that disagree can be told apart by where they came from rather than by which was asked for last.',
  },
  {
    icon: 'actions-circle-half' as const,
    label: 'when it degrades',
    heading: 'A shortfall travels with the result',
    body: 'Where a source is out of reach the next one answers, and the result says what the substitution left out. A partial registry never looks complete.',
  },
  {
    icon: 'actions-tag' as const,
    label: 'across releases',
    heading: 'A binding, or none at all',
    body: 'Every answer holds for named releases. Where a claim cannot be bound to one, it is not returned — an unbounded rule is a rule that is wrong somewhere.',
  },
];

const RELATED = [
  {
    icon: 'actions-list-alternative' as const,
    label: 'reference',
    heading: 'The eight tools',
    body: 'What each one answers from, which releases it holds for, and how it last answered.',
    link: 'Open the tool reference',
  },
  {
    icon: 'actions-book' as const,
    label: 'documentation',
    heading: 'Sources and preconditions',
    body: 'The five sources in full, and what the server does when one of them cannot be reached.',
    link: 'Read the documentation',
  },
  {
    icon: 'actions-terminal' as const,
    label: 'guide',
    heading: 'Writing a task skill',
    body: 'How a skill declares the sources it needs, so it fails at registration rather than mid-answer.',
    link: 'Read the guide',
  },
];

const INSTALL: readonly CodeLine[] = [
  { kind: 'comment', text: '# one command, and the client finds it' },
  { kind: 'shell', text: 'composer require typo3/support-app' },
  { kind: 'ok', text: 'registered 8 tools in', code: '.mcp.json' },
];

/** The page. `flat` composes the form a static file can hold. */
export function featurePage({ flat = false }: PageMode = {}): TemplateResult {
  /* Storybook serves `assets/` at its root; a file under `screens/` reaches
     the same directory one level up. The path is the page's to know — an
     element that guessed it would be wrong on one of the two surfaces. */
  const assets = flat ? '../assets' : '/assets';

  /* The one place the two renderings differ: a button's label is content, and
     `renderStatic` flattens no element that was given children. */
  const start = flat
    ? html`${buttonMarkup({ variant: 'primary' }, html`<sds-icon name="actions-play"></sds-icon>${buttonLabel('Install the server')}`)}${buttonMarkup({ variant: 'secondary' }, 'Open the tool reference')}`
    : html`<sds-button variant="primary"><sds-icon name="actions-play"></sds-icon>Install the server</sds-button>
        <sds-button variant="secondary">Open the tool reference</sds-button>`;

  return html`<div class="sds-shell">
  ${skipLink()}
  ${siteBar(1, '#feature')}

  <main class="sds-bands" id="main-content">

    <section class="sds-band" id="feature">
      <div class="sds-stack">
        <sds-crumbs .items="${TRAIL}"></sds-crumbs>
        <span class="sds-label">Feature</span>
        <h1 class="sds-display">Every answer says where it came from</h1>
        <p class="sds-lead">
          A tool declares the sources it may answer from. The answer carries the
          one that answered, the releases it holds for, and what it leaves out —
          and a result that cannot name its source is not returned at all.
        </p>
        <div class="sds-actions">${start}</div>
        <div class="sds-stats">
          ${SOURCE_FACTS.map(
            (fact) => html`<sds-stat value="${fact.value}" label="${fact.label}" .note="${fact.note ?? ''}"></sds-stat>`,
          )}
        </div>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="preconditions">
      <div class="sds-stack">
        <h2>Every source has a precondition</h2>
        <p>
          The five differ in how much of the machine has to be running before
          they can answer. Bundled knowledge and the server’s own checkout
          answer with nothing running; installed packages need files on disk;
          the installation source needs a booted installation; network sources
          need outbound reach.
        </p>
        <sds-figure
          src="${assets}/diagrams/answer-sources.svg"
          alt="The five sources plotted against how much of the machine has to be running: bundled knowledge and the checkout need nothing running, packages need files on disk, the installation needs a booted installation, and network sources need outbound reach."
          caption="A tool declares its sources, so whether an answer is reachable is known before the question is asked."
          zoomable
        ></sds-figure>
        <sds-note
          heading="A declaration is resolved, not documented"
          .body="${html`The server checks a tool’s declared sources against the machine it
            was started on. One it cannot reach is not offered, so a question is
            never answered by a source that was unavailable when it was asked.`}"
        ></sds-note>
      </div>
    </section>

    <section class="sds-band" id="sources">
      <div class="sds-stack">
        <h2>The five sources</h2>
        <p>
          Named as the result names them. What a tool returns in
          <span class="sds-mono">answeredBy</span> is one of these five strings
          and never a sentence about one.
        </p>
        <sds-table density="compact" scrollable .columns="${SOURCES.columns}" .rows="${SOURCES.rows}"></sds-table>
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="result">
      <div class="sds-split">
        <div class="sds-stack">
          <h2>What a result carries</h2>
          <p>
            Four fields beside the answer, and each of them is there to make a
            claim checkable: which source answered, which were declared, which
            releases it holds for, and what the answer does not cover.
          </p>
          <sds-note
            tone="warn"
            heading="The installation could not be booted — packages were read instead"
            .body="${html`So this result omits anything a running extension would register at
              runtime. <span class="sds-mono">ddev start</span> would close the gap.`}"
          ></sds-note>
        </div>
        <div class="sds-stack">
          <span class="sds-label">A degraded result</span>
          <sds-code code-lang="json" source="${RESULT}" copy></sds-code>
          <p>
            <span class="sds-mono">declared</span> is what the tool was allowed to
            read; <span class="sds-mono">answeredBy</span> is what it reached. The
            two differing is the whole of what “degraded” means here.
          </p>
        </div>
      </div>
    </section>

    <section class="sds-band" id="consequences">
      <div class="sds-stack">
        <h2>Three consequences</h2>
        <p>
          The declaration is one line in a tool. What it buys is spread across
          every answer that tool ever gives.
        </p>
        ${grid(
          CONSEQUENCES.map(
            (one) => html`<sds-surface
              icon="${one.icon}"
              label="${one.label}"
              heading="${one.heading}"
              body="${one.body}"
            ></sds-surface>`,
          ),
          { flat },
        )}
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="limits">
      <div class="sds-stack">
        <h2>What it does not do</h2>
        <p>
          A source is a statement about where an answer came from. It is not a
          statement about whether the answer is right, and the two are worth
          keeping apart.
        </p>
        <sds-note
          heading="It does not rank the sources against each other"
          .body="${html`Where two could answer, the tool’s own order decides — not a score.
            A result names the one that answered so the caller can disagree with
            that order, which is a decision the caller is better placed to make.`}"
        ></sds-note>
        <sds-note
          tone="error"
          heading="It cannot vouch for an extension that overrides core behaviour"
          .body="${html`The installation source reads assembled runtime state, so what an
            extension changed is in the answer without being attributed to it.
            Where that matters, the tool says which releases it checked and stops.`}"
        ></sds-note>
      </div>
    </section>

    <section class="sds-band" id="read-on">
      <div class="sds-stack">
        <h2>Read on</h2>
        ${grid(
          RELATED.map(
            (one) => html`<sds-card
              icon="${one.icon}"
              label="${one.label}"
              heading="${one.heading}"
              body="${one.body}"
              href="#"
              action="${one.link}"
            ></sds-card>`,
          ),
          { flat },
        )}
      </div>
    </section>

    <section class="sds-band sds-band--quiet" id="install">
      <div class="sds-split">
        <div class="sds-stack">
          <h2>Install it</h2>
          <p>
            One command, and the client finds the server. PHP${NNBSP}8.2+, and a
            TYPO3 project it can read — nothing has to be running for the first
            answer to arrive.
          </p>
          <div class="sds-actions">${start}</div>
        </div>
        <div class="sds-stack">
          <span class="sds-label">Install</span>
          <sds-code code-lang="bash" .body="${INSTALL}" copy></sds-code>
          <p>
            The tools register themselves with their declared sources. One that
            cannot reach any of them says so at registration rather than in the
            middle of an answer.
          </p>
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
  title: 'Pages/Feature',
  excludeStories: ['featurePage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/feature.html',
      title: 'TYPO3 Dev Companion — feature',
      subtitle: 'One claim in full: what it is, what it changes in a result, and what it does not do',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the ground changes between sections at the full width of
    the screen while the text stays on one measure, the menu collapses when the
    header runs out, the drawing follows the mode switch, and the table scrolls
    rather than widening the page. */
export const Page: Story = {
  name: 'Feature',
  render: () => featurePage(),
};

export const screenHtml = (): string => part(featurePage({ flat: true }));
