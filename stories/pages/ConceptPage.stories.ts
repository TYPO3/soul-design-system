/* A concept paper.

   The document that asks for a decision. What the thing is, where it
   stands, what the evidence says, what the paper proposes, what that costs,
   and the question at the end. A document on its own, with no bar and no
   footer. Its frame is the panel beside it: the head, the numbered outline
   and the state of the draft. The panel stands the height of the window, so
   a reader of the ninth part still sees the first.

   Two screenshots of the pages as they stand, a test with readers, the
   findings as a register, three options weighed. One drawing under the
   diagram rule. The readers and the numbers are fiction. Live and static
   from one composition: `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/accordion.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/byline.ts';
import '../../packages/frontend/src/components/card.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/compare.ts';
import '../../packages/frontend/src/components/confval.ts';
import '../../packages/frontend/src/components/deck.ts';
import '../../packages/frontend/src/components/decision.ts';
import '../../packages/frontend/src/components/diff.ts';
import '../../packages/frontend/src/components/entry.ts';
import '../../packages/frontend/src/components/eyebrow.ts';
import '../../packages/frontend/src/components/facts.ts';
import '../../packages/frontend/src/components/figure.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/nav-outline.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/quote.ts';
import '../../packages/frontend/src/components/register.ts';
import '../../packages/frontend/src/components/slide.ts';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/steps.ts';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/table.ts';
import '../../packages/frontend/src/components/tabs.ts';
import '../../packages/frontend/src/components/timeline.ts';
import '../../packages/frontend/src/components/tree.ts';
import { type Entry } from '../../packages/frontend/src/components/accordion.ts';
import { type DiffLine } from '../../packages/frontend/src/components/diff.ts';
import { type EntryProps } from '../../packages/frontend/src/components/entry.ts';
import { type FactsEntry } from '../../packages/frontend/src/components/facts.ts';
import { type RegisterGroup } from '../../packages/frontend/src/components/register.ts';
import { type Step } from '../../packages/frontend/src/components/steps.ts';
import { type SlideProps } from '../../packages/frontend/src/components/slide.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { tabsBarMarkup } from '../../packages/frontend/src/components/tabs.ts';
import { type TreeEntry } from '../../packages/frontend/src/components/tree.ts';
import { PAGES, sdsCompare } from '../components/Compare.stories.ts';
import { ANSWERS, sdsDecision, sdsDecisionFlat } from '../components/Decision.stories.ts';
import { PLAN, sdsTimeline, sdsTimelineFlat } from '../components/Timeline.stories.ts';
import { DECK } from '../lib/deck.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode } from '../lib/page.ts';

const mono = (text: string): TemplateResult => html`<span class="sds-mono">${text}</span>`;

/* The verdicts the rows repeat. A result carries a colour and a glyph
   everywhere else in this system, so it does here too. */
const done = (label: string): TemplateResult => html`<sds-badge label="${label}" tone="ok"></sds-badge>`;
const partly = (label: string): TemplateResult => html`<sds-badge label="${label}" tone="warn"></sds-badge>`;
const failed = (label: string): TemplateResult => html`<sds-badge label="${label}" tone="error"></sds-badge>`;

/** What the paper is, as the head states it. */
const FACTS: readonly FactsEntry[] = [
  { term: 'State', value: html`<span class="sds-row"><sds-badge label="draft for discussion" tone="warn"></sds-badge><span>not a decision</span></span>` },
  { term: 'Date', value: mono('2026-09-15') },
  { term: 'Audience', value: 'The maintainers of the server, the writers of the status pages' },
  { term: 'Subject', value: html`The status page and the page of a source in ${mono('dev-companion 1.4')}` },
  { term: 'Decision by', value: html`${mono('2026-09-30')}, at the maintainers’ call` },
];

/* ------------------------------------------------------------ tables -- */

const ROW_COLUMNS: readonly Column[] = [
  { head: 'The row says' },
  { head: 'The reader asks' },
  { head: 'Answered' },
];

const ROW: readonly Row[] = [
  { cells: ['The state of the source, as a badge', 'Is it answering right now?', done('yes')] },
  { cells: ['When the checker last asked', 'Did the check run?', done('yes')] },
  { cells: ['Nothing about the check before this one', 'Since when has it been like this?', failed('no')] },
  { cells: ['Nothing about how often', 'Is it always this slow?', failed('no')] },
];

const PAGE_COLUMNS: readonly Column[] = [
  { head: 'The page shows' },
  { head: 'How far back' },
  { head: 'Enough for' },
];

const PAGE: readonly Row[] = [
  { cells: ['The read in flight, stop by stop', 'now', 'a reader who waits for it'] },
  { cells: ['The last read that ended', 'six hours', 'a reader who wants the last verdict'] },
  { cells: ['The read that stopped', 'a day', 'a reader who asks what went wrong once'] },
  { cells: ['Nothing before those', '—', html`${failed('nobody')} who asks how often, or since when`] },
];

const QUESTIONS_COLUMNS: readonly Column[] = [
  { head: 'Question, as it arrived' },
  { head: 'Times', cls: 'sds-td-meta' },
  { head: 'Where' },
  { head: 'The page can answer it' },
];

const QUESTIONS: readonly Row[] = [
  { cells: [html`Since when is ${mono('releases.typo3.org')} unreachable?`, '11', 'chat, the issue tracker', failed('no')] },
  { cells: [html`Is ${mono('docs.typo3.org')} always this slow, or only today?`, '6', 'chat', failed('no')] },
  { cells: ['Did the read run tonight?', '4', 'the issue tracker', partly('for the last read')] },
  { cells: ['How long has a full read taken lately?', '3', 'chat', partly('for the last read')] },
];

const TASK_COLUMNS: readonly Column[] = [
  { head: 'Task' },
  { head: 'Done', cls: 'sds-td-meta' },
  { head: 'Median', cls: 'sds-td-meta' },
  { head: 'What happened' },
];

const TASKS: readonly Row[] = [
  { cells: ['T1 · Say if the last read of docs.typo3.org ended well', `8${NNBSP}of${NNBSP}8`, `12${NNBSP}s`, done('the page answers it')] },
  { cells: ['T2 · Find the read that stopped yesterday', `7${NNBSP}of${NNBSP}8`, `31${NNBSP}s`, done('one reader opened the wrong source')] },
  { cells: ['T3 · Say since when releases.typo3.org has been unreachable', `3${NNBSP}of${NNBSP}8`, `2${NNBSP}min${NNBSP}40${NNBSP}s`, failed('five gave up; the three guessed from the two reads')] },
  { cells: ['T4 · Say how often docs.typo3.org was slow this week', `0${NNBSP}of${NNBSP}8`, '—', failed('nothing on the page holds a week')] },
];

const FIELD_COLUMNS: readonly Column[] = [
  { head: 'Field', cls: 'sds-td-name' },
  { head: 'Holds' },
  { head: 'Why' },
];

const FIELDS: readonly Row[] = [
  { cells: [mono('started'), 'when the read began, on this machine’s clock', 'the answer to since when'] },
  { cells: [mono('verdict'), html`${mono('read')}, ${mono('slow')} or ${mono('stopped')}`, 'the word the row already uses'] },
  { cells: [mono('took'), 'how long, or at which stop it ended', 'the answer to how long lately'] },
  { cells: [mono('pages'), 'what the read put in the index', 'a read that ended well but read nothing is a stopped one'] },
];

const MARKS_COLUMNS: readonly Column[] = [
  { head: 'Source', cls: 'sds-td-name' },
  { head: 'State' },
  { head: 'Last five reads' },
];

const five = (marks: readonly TemplateResult[]): TemplateResult => html`<span class="sds-row">${marks}</span>`;

const MARKS: readonly Row[] = [
  { cells: [mono('knowledge'), done('answering'), five([done('read'), done('read'), done('read'), done('read'), done('read')])] },
  { cells: [mono('docs.typo3.org'), partly('slow · 2.4 s'), five([done('read'), done('read'), partly('slow'), done('read'), partly('slow')])] },
  { cells: [mono('releases.typo3.org'), failed('unreachable'), five([done('read'), failed('stopped'), failed('stopped'), failed('stopped'), failed('stopped')])] },
];

const OPTION_COLUMNS: readonly Column[] = [
  { head: 'Asks' },
  { head: 'A · The record on the page of the source' },
  { head: 'B · A page of its own, with a chart' },
  { head: 'C · Marks in the row only' },
];

const OPTIONS: readonly Row[] = [
  { cells: ['Answers since when', done('yes'), done('yes'), partly('for five reads')] },
  { cells: ['Answers how often', done('for thirty reads'), done('for a year'), failed('no')] },
  { cells: ['Reads with no sight', done('a list'), partly('a chart needs a table beside it'), done('a colour and a name')] },
  { cells: ['New surface', done('none'), failed('one page, one chart'), done('none')] },
  { cells: ['Stays a record, not a history', done('thirty reads'), failed('a year is a history'), done('five reads')] },
  { cells: ['Cost', mono('6 days'), mono('14 days'), mono('2 days')] },
];

const WORK_COLUMNS: readonly Column[] = [
  { head: 'Package', cls: 'sds-td-name' },
  { head: 'What it does' },
  { head: 'Cost', cls: 'sds-td-meta' },
  { head: 'Needs' },
];

const WORK: readonly Row[] = [
  { cells: ['W1', 'The server keeps the last thirty reads of a source in one file beside its cache', `2${NNBSP}days`, '—'] },
  { cells: ['W2', 'The page of a source shows the record under the read in flight', `2${NNBSP}days`, 'W1'] },
  { cells: ['W3', 'The status row carries the last five reads as marks', `1${NNBSP}day`, 'W1'] },
  { cells: ['W4', html`${mono('dev-companion status <source>')} prints the record as one line`, `½${NNBSP}day`, 'W1'] },
  { cells: ['W5', 'The manual says what the record is and what it is not', `½${NNBSP}day`, 'W2, W3'] },
];

/** The cache of one source, with the record beside the index. */
const CACHE: readonly TreeEntry[] = [
  { label: 'typo3-dev-companion/', note: 'the server’s cache, under ~/.cache', items: [
    { label: 'docs/', note: 'one directory per source', items: [
      { label: 'index/', note: 'what the last read put there' },
      { label: 'reads.json', note: 'the record: the last thirty reads, oldest dropped first' },
    ] },
    { label: 'releases/', items: [
      { label: 'index/' },
      { label: 'reads.json' },
    ] },
  ] },
];

/** The sentence the note at the foot of the status page grows. */
const NOTE: readonly DiffLine[] = [
  { kind: 'context', text: 'There is no incident history, because there is no service.' },
  { kind: 'context', text: '…' },
  { kind: 'add', text: 'What the page of a source keeps is a record of the reads this' },
  { kind: 'add', text: 'server made from this machine, and nothing about the source' },
  { kind: 'add', text: 'seen from anywhere else.' },
];

/** The terminal, in two forms: the count, and the record in full. */
const TERMINAL = [
  { label: 'The count', body: [
    { kind: 'shell' as const, text: 'dev-companion status docs' },
    { kind: 'plain' as const, text: 'docs.typo3.org · 30 reads · 27 read · 2 slow · 1 stopped · last 06:00 today' },
  ] },
  { label: 'The record', body: [
    { kind: 'shell' as const, text: 'dev-companion status docs --reads' },
    { kind: 'plain' as const, text: '2026-09-15 06:00  read     3m 02s  18,412 pages' },
    { kind: 'plain' as const, text: '2026-09-14 06:12  stopped  2m 11s  at step 2' },
    { kind: 'plain' as const, text: '2026-09-14 00:00  read     2m 58s  18,410 pages' },
    { kind: 'plain' as const, text: '…' },
  ] },
];

/** The three options, each in short. */
const WAYS = [
  { label: 'Option A', heading: 'The record on the page of the source', icon: 'actions-document' as const, footer: '6 days · recommended',
    body: 'Thirty reads in a list under the read in flight. Five marks in the row, one line in the terminal. A record of this machine, on the page that already says what it is.' },
  { label: 'Option B', heading: 'A page of its own, with a chart', icon: 'actions-calendar' as const, footer: '14 days',
    body: 'A year of reads, drawn. It answers every question, and it reads as a service somebody watched, which the pages refuse on purpose.' },
  { label: 'Option C', heading: 'Marks in the row only', icon: 'actions-viewmode-list' as const, footer: '2 days · the fallback',
    body: 'Five marks at the end of the row and nothing else. It answers since when for five reads and how often for none.' },
];

/* ---------------------------------------------------------- findings -- */

/** The groups of a concept’s findings. What stands in the way of the goal,
    what costs the reader, and what already does its job. */
const GROUPS: readonly RegisterGroup[] = [
  { key: 'gap', heading: 'A gap', label: 'gap', tone: 'error' },
  { key: 'cost', heading: 'Costs the reader', label: 'costs', tone: 'warn' },
  { key: 'keep', heading: 'Works as it stands', label: 'keep', tone: 'ok' },
];

const FINDINGS: readonly EntryProps[] = [
  {
    heading: 'Nothing on either page says since when',
    group: 'gap',
    origin: 'from the questions and from T3',
    todo: 'Keep the reads before the last two, and show them where the reader asks: on the page of the source.',
    body: html`<p>Eleven of the twenty-four questions ask since when a source has failed, and it is
      the one question both pages cannot answer. The row says what the source does now. The
      page of the source keeps two reads. A source that stopped four days ago looks like one
      that stopped this morning.</p>`,
  },
  {
    heading: 'Nothing holds a week, so nobody can say how often',
    group: 'gap',
    origin: 'from T4',
    todo: 'Thirty reads, which is five days at the schedule, and a count of the verdicts over them.',
    body: html`<p>Every reader failed T4, and every one of them tried the same thing: they opened the
      two reads and looked for a third. A count over thirty reads answers "how often" for the
      week the question is about.</p>`,
  },
  {
    heading: 'A reader who found the answer read it off the wrong page',
    group: 'cost',
    origin: 'from T3',
    todo: 'The record on the page of the source, so the answer stands where the question starts.',
    body: html`<p>The three readers who answered T3 guessed the day from the two reads on the page and
      gave the guess as the answer. A guess a page invites is a wrong answer the page gave.</p>`,
  },
  {
    heading: 'The row cannot carry a record, and the reader looks there first',
    group: 'cost',
    origin: 'from the test, all four tasks',
    todo: 'Five marks at the end of the row: a glance, and the page for the rest.',
    body: html`<p>Every reader started on the status page and read the row before they opened the
      source. A row has room for a glance and no more. Five marks say "this happened before"
      and not when, and the page under the row says the rest.</p>`,
  },
  {
    heading: 'Readers find the read that stopped',
    group: 'keep',
    origin: 'from T2',
    body: html`<p>Seven of eight readers found it, in half a minute. The fold under "Earlier reads" is
      the right shape for one read, and the record keeps it.</p>`,
  },
  {
    heading: 'The pages say what they are not, and the readers read it',
    group: 'keep',
    origin: 'from the interviews',
    body: html`<p>Six of eight readers named the note at the foot of the status page unasked. "It is
      not a service" reached them. So a record of the server’s own reads does not read as a
      promise about the source, as long as the page says so.</p>`,
  },
];

/** The order of the work, after the decision. */
const STEPS: readonly Step[] = [
  { heading: 'Decide', body: 'The maintainers answer the question in part 8 by 2026-09-30. Nothing below starts before that.' },
  { heading: 'Keep the record', body: html`W1. One file per source, thirty reads, oldest dropped first. The file is the contract; every surface below reads it. Merged behind a flag, on by default in ${mono('1.5')}.` },
  { heading: 'Show it on the page of the source', body: 'W2. Under the read in flight, above the overview. The two reads the page keeps today become the first two rows of the record.' },
  { heading: 'Marks in the row, the line in the terminal', body: 'W3 and W4, in either order. Both read the same file.' },
  { heading: 'Say what it is', body: 'W5. The manual and the note on the status page say what it is: reads from this machine, not a history.' },
];

/** What stays out of the way. */
const APPENDIX: readonly Entry[] = [
  {
    question: 'A.1 · The test, as it ran',
    answer: html`<p>Eight readers, each alone, each with the two pages open in a browser and a
      timer beside them. Four tasks, read out one at a time. A task ends when the reader gives
      an answer or gives up. The median is over the readers who finished.</p>
      <sds-code code-lang="text" source="${'T1  Say if the last read of docs.typo3.org ended well.\nT2  Find the read that stopped yesterday.\nT3  Say since when releases.typo3.org has been unreachable.\nT4  Say how often docs.typo3.org was slow this week.'}"></sds-code>`,
  },
  {
    question: 'A.2 · The record, as a file',
    answer: html`<sds-code code-lang="json" caption="~/.cache/typo3-dev-companion/docs/reads.json" source="${'[\n  { "started": "2026-09-15T06:00:11Z", "verdict": "read", "took": 182, "pages": 18412 },\n  { "started": "2026-09-14T06:12:04Z", "verdict": "stopped", "took": 131, "at": 2 },\n  { "started": "2026-09-14T00:00:09Z", "verdict": "read", "took": 178, "pages": 18410 }\n]'}"></sds-code>`,
  },
  {
    question: 'A.3 · The questions, in full',
    answer: html`<p>Twenty-four questions from chat and the issue tracker between 2026-08-15 and
      2026-09-14, each with the source it names. The table in 3.1 groups them by what they
      ask. The list stays out of this paper: it names people.</p>`,
  },
];

/** The parts of the paper, and the sections in each. The outline numbers
    them, and the page numbers its headings by the same count. */
const SECTIONS = [
  { label: 'Purpose', href: '#purpose', items: [
    { label: 'What this paper decides', href: '#decides' },
    { label: 'What it leaves out', href: '#leaves-out' },
  ] },
  { label: 'Where it stands', href: '#stands', items: [
    { label: 'The two pages', href: '#two-pages' },
    { label: 'What the row says', href: '#status-page' },
    { label: 'What the page keeps', href: '#source-page' },
    { label: 'What the pages say on purpose', href: '#on-purpose' },
  ] },
  { label: 'What readers asked', href: '#asked', items: [
    { label: 'The questions that arrived', href: '#questions' },
    { label: 'A test with eight readers', href: '#test' },
    { label: 'What they said', href: '#said' },
  ] },
  /* No sections under the findings: the register groups its entries in
     sections of its own, and those carry the register's numbers. */
  { label: 'Findings', href: '#findings' },
  { label: 'The proposal', href: '#proposal', items: [
    { label: 'A record, not a history', href: '#record' },
    { label: 'What the record holds', href: '#holds' },
    { label: 'Where it shows', href: '#shows' },
    { label: 'The row on the status page', href: '#row' },
    { label: 'In the terminal', href: '#terminal' },
    { label: 'The setting', href: '#setting' },
    { label: 'What the note says', href: '#note' },
  ] },
  { label: 'Options weighed', href: '#options', items: [
    { label: 'The three, in short', href: '#in-short' },
    { label: 'Side by side', href: '#side-by-side' },
    { label: 'Why not the chart', href: '#not-chart' },
  ] },
  { label: 'What it costs', href: '#costs', items: [
    { label: 'Work packages', href: '#work' },
    { label: 'The order', href: '#order' },
    { label: 'The dates', href: '#dates' },
    { label: 'Risks', href: '#risks' },
  ] },
  { label: 'Decision', href: '#decision', items: [
    { label: 'Open questions', href: '#open' },
    { label: 'Sources', href: '#sources' },
  ] },
  { label: 'Appendix', href: '#appendix' },
];

/** The page. `flat` composes the form a static file can hold. */
export function conceptPage({ flat = false, slides = false }: PageMode & { slides?: boolean } = {}): TemplateResult {
  /* With slides the paper stops after its third part. The whole paper with
     its slides takes longer than the runner gives one story. Three parts
     show every way a slide sums a part up. */
  const whole = !slides || flat;
  /* The slides of one section, where the section starts. Live only: a
     static file has no script to fit a frame into its column. */
  const sums = (id: string): TemplateResult | typeof nothing =>
    slides && !flat
      ? html`${(SLIDES[id] ?? []).map(({ body, ...one }) => html`<sds-slide
          kind="${one.kind ?? 'content'}"
          ground="${one.ground ?? 'paper'}"
          eyebrow="${one.eyebrow ?? ''}"
          heading="${one.heading ?? ''}"
          lead="${one.lead ?? ''}"
          note="${one.note ?? ''}"
        >${body ?? ''}</sds-slide>`)}`
      : nothing;
  /* Where the two renderings differ: what stands between an element's tags,
     because `renderStatic` flattens no element with children. Flat, the
     same blocks go over as the property. */
  const summary = html`<p>
      The status page says which sources answer, and the page of a source shows the read in
      flight and the two before it. Readers ask a question neither page can answer: since
      when, and how often. Twenty-four times in thirty days, and five of eight readers in a
      test.
    </p>
    <p>
      <strong>Recommendation:</strong> option A. The server keeps the last thirty reads of
      every source in one file, the page of the source shows them as a list under the read in
      flight, the status row carries the last five as marks, and the terminal prints the
      count. Six days in five packages. It stays a record of this machine’s own reads, which
      is what the pages already promise, and not a history of a service, which they refuse
      on purpose.
    </p>`;
  const facts = flat
    ? html`<sds-facts .entries="${FACTS}"></sds-facts>`
    : html`<sds-facts>${FACTS.map(({ term, value }) => html`<dt>${term}</dt><dd>${value}</dd>`)}</sds-facts>`;
  const opener = flat
    ? html`<sds-surface plane="raised" heading="Summary" .body="${summary}"></sds-surface>`
    : html`<sds-surface plane="raised" heading="Summary">${summary}</sds-surface>`;
  const findings = flat
    ? html`<sds-register name="findings" prefix="F" todo-prefix="W" .groups="${GROUPS}" .entries="${FINDINGS}"></sds-register>`
    : html`<sds-register name="findings" prefix="F" todo-prefix="W" .groups="${GROUPS}">${FINDINGS.map((f) =>
        html`<sds-entry heading="${f.heading}" group="${f.group ?? ''}" origin="${f.origin ?? ''}" todo="${f.todo ?? ''}">${f.body}</sds-entry>`)}</sds-register>`;
  const asked = {
    question: 'Does the server keep a record of its own reads, and show it?',
    answers: ANSWERS,
    by: 'the maintainers',
    due: '2026-09-30',
    lead: 'Until the maintainers answer, this paper is a draft and the pages stay as they are. The three answers are part 6 in short; the cost of each is part 7.',
  };
  const decision = flat ? sdsDecisionFlat(asked) : sdsDecision(asked);
  const ways = grid(
    WAYS.map((way) => html`<sds-card label="${way.label}" heading="${way.heading}" body="${way.body}" icon="${way.icon}" footer="${way.footer}"></sds-card>`),
    { flat },
  );
  /* The static file holds the first tab's panel alone; the live page holds
     both and switches. */
  const first = TERMINAL[0] as (typeof TERMINAL)[number];
  const terminal = flat
    ? html`${tabsBarMarkup(TERMINAL.map(({ label }) => ({ label })), 0)}<div class="sds-tab__panel"><sds-code code-lang="bash" .body="${first.body}"></sds-code></div>`
    : html`<sds-tabs>${TERMINAL.map((one) => html`<sds-tab-item label="${one.label}"><sds-code code-lang="bash" .body="${one.body}"></sds-code></sds-tab-item>`)}</sds-tabs>`;

  /* What a slide in each part shows: the part's own material, read from the
     data the page reads. A slide that sums up a table shows that table. */
  const SLIDES: Record<string, readonly (SlideProps & { body?: TemplateResult })[]> = {
    paper: [{
      kind: 'cover',
      ground: 'terminal',
      eyebrow: 'Concept paper · draft 2',
      heading: 'A record of reads for every source',
      lead: 'Readers ask since when a source has failed, and how often. Neither page can say. The paper recommends option A.',
    }],
    purpose: [{
      kind: 'statement',
      heading: 'If the server keeps a record of its own reads, how long it is, and where it shows.',
      note: '1 · What this paper decides',
    }],
    stands: [{
      kind: 'figure',
      eyebrow: '2 · Where it stands',
      heading: 'The two pages, as a reader sees them',
      body: sdsCompare(PAGES),
    }],
    asked: [
      {
        kind: 'figure',
        eyebrow: '3 · What readers asked',
        heading: 'Four tasks, eight readers',
        body: html`<sds-table density="compact" .columns="${TASK_COLUMNS}" .rows="${TASKS}"></sds-table>`,
      },
      {
        kind: 'statement',
        body: html`<sds-quote
          body="I can see that it stopped yesterday. I cannot see if yesterday was the first time."
          by="Reader 3"
          as="runs the server for two agencies"
        ></sds-quote>`,
      },
    ],
  };

  return html`<div class="sds-shell">
  <div class="sds-paper">
    <!-- The panel is the document's frame. No bar and no footer: nothing here
         leads anywhere else. The head says what the reader has open, the
         outline says where they are in it, and the foot says what state the
         draft is in. It stands the height of the window and the list
         scrolls on its own. Under 860px it is the page's head, and the
         outline folds behind the press in it. -->
    <aside class="sds-paper__panel">
      <div class="sds-paper__head">
        <sds-eyebrow label="Concept paper · draft 2"></sds-eyebrow>
        <p class="sds-paper__title">A record of reads for every source</p>
        ${slides && !flat
          ? html`<sds-button variant="secondary" size="sm" for="concept-deck"><sds-icon name="actions-play"></sds-icon>Click through the slides</sds-button>
            <sds-deck
              id="concept-deck"
              from="main-content"
              label="A record of reads · slides"
              brand="${DECK.brand}"
              product="${DECK.product}"
              signet="${DECK.signet}"
              signet-large="${DECK.signetLarge}"
              numbered
            ></sds-deck>`
          : nothing}
      </div>
      <sds-nav-outline label="Contents" numbered .entries="${whole ? SECTIONS : SECTIONS.slice(0, 3)}"></sds-nav-outline>
      <div class="sds-paper__foot">
        <p>Draft 2, for discussion</p>
        <p>Decision by 2026‑09‑30</p>
      </div>
    </aside>

    <main class="sds-paper__main" id="main-content">
      <!-- Every titled part is a section, nested as the headings nest. The
           document numbers them in the heading, a part 4 and a section in
           it 4.2, and the panel counts the same places by their order. -->
      <article class="sds-prose">
        <section class="sds-section" id="paper">
          <sds-eyebrow label="Concept paper · dev-companion · draft 2"></sds-eyebrow>
          <h1>A record of reads for every source</h1>
          <p class="sds-lead">
            What the status page must keep about its own reads, for the reader who asks since
            when a source has failed. The pages as they stand, what readers asked, three options
            weighed, and the one this paper recommends.
          </p>
          ${sums('paper')}
          <sds-byline name="Mara Lindqvist" as="for the status pages" meta="draft 2 · 2026-09-15"></sds-byline>

          ${facts}

          ${opener}
        </section>

        <section class="sds-section" id="purpose">
          <h2><span class="sds-section__number">1</span> Purpose</h2>
          ${sums('purpose')}
          <p>
            One question, and the evidence behind it. The pages report the moment. Readers ask
            about the days before it. This paper says what the server must keep so the pages
            can answer, and what it must not become on the way.
          </p>

          <section class="sds-section" id="decides">
            <h3><span class="sds-section__number">1.1</span> What this paper decides</h3>
            <p>
              If the server keeps a record of its own reads, how long that record is, and
              where it shows. Three options stand in part 6, and part 8 asks the maintainers
              for one of them. Everything before that is what the decision rests on.
            </p>
            <sds-note
              tone="info"
              heading="The path through the paper"
              body="Part 2 is the pages as they stand. Part 3 is what readers asked and what a test showed. Part 4 names the findings. Part 5 is the proposal, part 6 the options against it, part 7 the cost. Part 8 is the question. A reader with ten minutes reads the summary, part 6 and part 8."
            ></sds-note>
          </section>

          <section class="sds-section" id="leaves-out">
            <h3><span class="sds-section__number">1.2</span> What it leaves out</h3>
            <ul>
              <li>
                <strong>A history of the source itself.</strong> If docs.typo3.org was up is a
                question about a service, and the status page refuses it on purpose. This
                paper keeps that refusal; see 2.3.
              </li>
              <li>
                <strong>Alerts.</strong> A read that stops tells nobody. A record makes that
                visible after the fact, which is a different thing from a message at the time,
                and a paper of its own.
              </li>
              <li>
                <strong>The other four sources.</strong> The two on this machine and the two
                that ship with the server never fail a read. The record applies to them and
                stays empty of anything but "read".
              </li>
            </ul>
          </section>
        </section>

        <section class="sds-section" id="stands">
          <h2><span class="sds-section__number">2</span> Where it stands</h2>
          ${sums('stands')}
          <p>
            The two pages, as a reader sees them in <span class="sds-mono">1.4</span>, read
            against each other. Then a table for each: what the page says, and what a reader
            asks of it.
          </p>

          <section class="sds-section" id="two-pages">
            <h3><span class="sds-section__number">2.1</span> The two pages</h3>
            <p>
              The status page has six rows, one per source: the state now, when the checker last
              asked, and the way into the source. The page behind a row shows the read in flight,
              the overview, and "Earlier reads": the last read that ended and the one that
              stopped. It keeps those two and no more.
            </p>
            ${sdsCompare(PAGES)}
          </section>

          <section class="sds-section" id="status-page">
            <h3><span class="sds-section__number">2.2</span> What the row says</h3>
            <sds-table scrollable density="compact" .columns="${ROW_COLUMNS}" .rows="${ROW}"></sds-table>
          </section>

          <section class="sds-section" id="source-page">
            <h3><span class="sds-section__number">2.3</span> What the page keeps</h3>
            <sds-table scrollable density="compact" .columns="${PAGE_COLUMNS}" .rows="${PAGE}"></sds-table>
          </section>

          <section class="sds-section" id="on-purpose">
            <h3><span class="sds-section__number">2.4</span> What the pages say on purpose</h3>
            <p>
              The status page ends on a note, and the note is a decision. This paper does not
              argue with it. It asks if a record of the server’s own reads is the history
              the note refuses, and finds it is not: the note is about the source, seen from
              anywhere, and the record is about this machine, and only that.
            </p>
            <sds-quote
              body="There is no incident history, because there is no service. Nothing is hosted for you to depend on. What would be an outage elsewhere is a degraded answer here, and the answer says so at the moment it is given."
              by="The status page"
              as="the note at its foot"
              meta="dev-companion 1.4"
            ></sds-quote>
          </section>
        </section>

        <section class="sds-section" id="asked">
          <h2><span class="sds-section__number">3</span> What readers asked</h2>
          ${sums('asked')}
          <p>
            Two kinds of evidence. The questions that arrived on their own, over thirty days,
            and a test that put eight readers in front of the pages with four tasks.
          </p>

          <section class="sds-section" id="questions">
            <h3><span class="sds-section__number">3.1</span> The questions that arrived</h3>
            <p>
              Every question about the status pages in chat and in the issue tracker between
              2026-08-15 and 2026-09-14, grouped by what it asks. The list itself is A.3.
            </p>
            <sds-table scrollable density="compact" .columns="${QUESTIONS_COLUMNS}" .rows="${QUESTIONS}"></sds-table>
          </section>

          <section class="sds-section" id="test">
            <h3><span class="sds-section__number">3.2</span> A test with eight readers</h3>
            <p>
              Eight people who run the server for their own projects, each alone with the two
              pages and four tasks, on 2026-09-08 and 2026-09-09. The script is A.1. A task
              counts as done when the answer is right, and a guess that was right counts as a
              guess.
            </p>
            <sds-table scrollable density="compact" .columns="${TASK_COLUMNS}" .rows="${TASKS}"></sds-table>
            <p>
              The two tasks the pages hold an answer for went well. The two that ask about the
              days before went badly, and in the same way: every reader opened the two earlier
              reads and looked under them for a third.
            </p>
          </section>

          <section class="sds-section" id="said">
            <h3><span class="sds-section__number">3.3</span> What they said</h3>
            <p>Two sentences from the interviews after the tasks, each said in some form by more
              than one reader.</p>
            <sds-quote
              body="I can see that it stopped yesterday. I cannot see if yesterday was the first time."
              by="Reader 3"
              as="runs the server for two agencies"
            ></sds-quote>
            <sds-quote
              body="The note says it is not a service, and that is fine. I still want to know what my own machine did last week."
              by="Reader 7"
              as="runs it on a laptop"
            ></sds-quote>
          </section>
        </section>

        ${whole
          ? html`<section class="sds-section" id="findings">
          <h2><span class="sds-section__number">4</span> Findings</h2>
          <p>
            What the evidence says, in three groups: what stands in the way of the goal, what
            costs the reader, and what already does its job and must stay.
            Every finding in one table first, each row a jump to its entry, and the work they
            ask for in a second.
          </p>
          ${findings}
        </section>

        <section class="sds-section" id="proposal">
          <h2><span class="sds-section__number">5</span> The proposal</h2>
          <p>
            The server keeps a record of its own reads, and every surface that shows the reads
            reads that record. Three surfaces, one file, and a name for what it is.
          </p>

          <section class="sds-section" id="record">
            <h3><span class="sds-section__number">5.1</span> A record, not a history</h3>
            <ul>
              <li>
                <strong>It is about this machine.</strong> A read the server made from here,
                with the verdict it reached here. Nothing about the source seen from anywhere
                else, and no claim that it was up or down.
              </li>
              <li>
                <strong>It is short.</strong> Thirty reads, which is five days at the schedule
                of six hours. The thirty-first drops the first. A year of reads is a history,
                and part 6 says why that is the wrong thing.
              </li>
              <li>
                <strong>It says so.</strong> The note at the foot of the status page grows one
                sentence, and the record’s own heading names it: "Reads from this machine".
              </li>
            </ul>
          </section>

          <section class="sds-section" id="holds">
            <h3><span class="sds-section__number">5.2</span> What the record holds</h3>
            <p>One entry per read. Four fields, each the answer to a question from 3.1.</p>
            <sds-table scrollable density="compact" .columns="${FIELD_COLUMNS}" .rows="${FIELDS}"></sds-table>
            <p>
              The record is one file per source, beside the index the reads fill. It lives where
              the cache lives, so a reinstall keeps it and a cleared cache takes it.
            </p>
            <sds-tree level="2" .entries="${CACHE}"></sds-tree>
          </section>

          <section class="sds-section" id="shows">
            <h3><span class="sds-section__number">5.3</span> Where it shows</h3>
            <p>
              Three places, from a glance to a sentence. The page of the source carries the
              record in full, because that is where the question starts (F2.1).
            </p>
            <sds-figure
              src="assets/diagrams/record-of-reads.svg"
              alt="Three boxes side by side. The row on the status page: the source name and five small coloured marks. The page of the source, drawn in the accent: four rows, each a mark, a date, a verdict and a duration. The terminal: a dark box with one command and its two-line answer. Under them, one sentence: a record of the server’s own reads, not a history of a service."
              caption="One record, three places it shows. The page of the source carries all thirty reads; the row carries five as marks; the terminal counts them."
              zoomable
            ></sds-figure>
            <p>
              On the page of the source the record stands under the read in flight and above the
              overview, where "Earlier reads" stands today. The two folds the page keeps become
              the first two rows. Nothing above them moves.
            </p>
            <ol>
              <li>The read in flight stays first. A reader who came to wait for it waits there.</li>
              <li>"Reads from this machine" replaces "Earlier reads": thirty rows, newest first. Each row is a mark, a time, a verdict and a duration. A stopped read keeps its fold, and the fold keeps what the stop wrote.</li>
              <li>The overview moves below the record. It changes once a year; the record changes four times a day.</li>
              <li>The note at the foot grows one sentence: what the record is a record of.</li>
            </ol>
          </section>

          <section class="sds-section" id="row">
            <h3><span class="sds-section__number">5.4</span> The row on the status page</h3>
            <p>
              Five marks at the end of the row, oldest first, one per read. A mark is a colour
              and a word, as every result in the system is, so the row reads without sight. A
              row of five green marks says "as always". A row that turns red at the third says
              "since the day before yesterday", with no number in it.
            </p>
            <sds-table scrollable density="compact" .columns="${MARKS_COLUMNS}" .rows="${MARKS}"></sds-table>
          </section>

          <section class="sds-section" id="terminal">
            <h3><span class="sds-section__number">5.5</span> In the terminal</h3>
            <p>
              For the reader who asks from a shell and never opens a page: one line per source,
              the count over the record and when the last read ended.
            </p>
            ${terminal}
          </section>

          <section class="sds-section" id="setting">
            <h3><span class="sds-section__number">5.6</span> The setting</h3>
            <p>
              One value decides how long the record is. It counts reads and not days, because
              the schedule is a setting too; part 7 names the risk.
            </p>
            <sds-confval
              name="reads.keep"
              type="integer"
              default="30"
              .facts="${[{ label: 'Set in', value: 'settings.yaml, per installation' }, { label: 'Applies to', value: 'every source' }]}"
              .body="${html`<p>How many reads of a source the server keeps. The thirty-first drops the first.
                Thirty is five days at the default schedule of six hours. A value of zero keeps the two
                reads the page keeps today, which is the state before this paper.</p>`}"
            ></sds-confval>
          </section>

          <section class="sds-section" id="note">
            <h3><span class="sds-section__number">5.7</span> What the note says</h3>
            <p>
              The note at the foot of the status page grows one sentence, so the record never reads
              as the history the note refuses. The four lines before it stay as they are.
            </p>
            <sds-diff path="Resources/Private/Templates/Status.html" .body="${NOTE}"></sds-diff>
          </section>
        </section>

        <section class="sds-section" id="options">
          <h2><span class="sds-section__number">6</span> Options weighed</h2>
          <p>
            Three ways to answer the two questions, against what the findings ask. The
            recommendation is the first column. The third is the fallback if six days is too
            many.
          </p>

          <section class="sds-section" id="in-short">
            <h3><span class="sds-section__number">6.1</span> The three, in short</h3>
            ${ways}
          </section>

          <section class="sds-section" id="side-by-side">
            <h3><span class="sds-section__number">6.2</span> Side by side</h3>
            <sds-table scrollable density="compact" .columns="${OPTION_COLUMNS}" .rows="${OPTIONS}"></sds-table>
          </section>

          <section class="sds-section" id="not-chart">
            <h3><span class="sds-section__number">6.3</span> Why not the chart</h3>
            <p>
              Option B answers every question and costs twice as much. It fails on the one
              thing the pages refuse: a year of reads on a page of its own, with a chart, is an
              incident history with another name. A reader who sees it reads a service.
            </p>
            <sds-note
              tone="warn"
              heading="A chart of a year is a promise"
              body="The pages promise nothing about the source. A page that draws a year of its verdicts promises that somebody watched. Option A keeps five days, on the page that already says what it is."
            ></sds-note>
          </section>
        </section>

        <section class="sds-section" id="costs">
          <h2><span class="sds-section__number">7</span> What it costs</h2>
          <p>Five packages, six days, one order. And what can go wrong on the way.</p>

          <section class="sds-section" id="work">
            <h3><span class="sds-section__number">7.1</span> Work packages</h3>
            <sds-table scrollable density="compact" .columns="${WORK_COLUMNS}" .rows="${WORK}"></sds-table>
          </section>

          <section class="sds-section" id="order">
            <h3><span class="sds-section__number">7.2</span> The order</h3>
            <sds-steps .steps="${STEPS}"></sds-steps>
          </section>

          <section class="sds-section" id="dates">
            <h3><span class="sds-section__number">7.3</span> The dates</h3>
            <p>The same order on the calendar, and where it stands today.</p>
            ${flat ? sdsTimelineFlat({ entries: PLAN }) : sdsTimeline({ entries: PLAN })}
          </section>

          <section class="sds-section" id="risks">
            <h3><span class="sds-section__number">7.4</span> Risks</h3>
            <sds-note
              tone="warn"
              heading="R1 · A record on a laptop that sleeps is a record with holes"
              body="A machine that was off made no reads. The record says nothing for that time, and a reader can read the gap as a failure. The list marks a gap of more than twelve hours as its own row, with the words: no read, the server was not running."
            ></sds-note>
            <sds-note
              tone="warn"
              heading="R2 · Thirty reads of a source read every hour is one day"
              body="The schedule is a setting. A reader who reads every hour keeps a day and not five. The record counts reads and not days on purpose, and the manual says which it is."
            ></sds-note>
          </section>
        </section>

        <section class="sds-section" id="decision">
          <h2><span class="sds-section__number">8</span> Decision</h2>
          ${decision}

          <section class="sds-section" id="open">
            <h3><span class="sds-section__number">8.1</span> Open questions</h3>
            <ul>
              <li>
                <strong>Does the record survive a reinstall?</strong> It lives beside the cache,
                which a reinstall keeps. The paper assumes yes and W1 confirms it.
              </li>
              <li>
                <strong>Does the row carry five marks on a phone?</strong> The table drops the
                marks where it drops the "last checked" column. To confirm in W3.
              </li>
              <li>
                <strong>Is thirty the number?</strong> Five days at the default schedule. The
                maintainers can set another before W1; the file format does not care.
              </li>
            </ul>
          </section>

          <section class="sds-section" id="sources">
            <h3><span class="sds-section__number">8.2</span> Sources</h3>
            <ul>
              <li><sds-link href="#status-page" label="The status page and the page of a source"></sds-link> in <span class="sds-mono">dev-companion 1.4</span>, as shipped.</li>
              <li>The chat and the issue tracker, 2026-08-15 to 2026-09-14; the list is <sds-link href="#appendix" label="A.3"></sds-link>.</li>
              <li>The test of 2026-09-08 and 2026-09-09, eight readers; the script is <sds-link href="#appendix" label="A.1"></sds-link>.</li>
              <li><sds-link href="#" label="The manual, “What a source is”" external></sds-link>, for the sentence the record must not contradict.</li>
            </ul>
          </section>
        </section>

        <section class="sds-section" id="appendix">
          <h2><span class="sds-section__number">9</span> Appendix</h2>
          <sds-accordion name="appendix" .entries="${APPENDIX}"></sds-accordion>
        </section>`
          : nothing}
      </article>
    </main>
  </div>
</div>`;
}

/* Untagged for the reason `LandingScreen.stories.ts` gives. A whole layout
   has no variants to collect, and the widths it documents are reachable only
   in the story view. */
const meta: Meta = {
  title: 'Pages/Paper/Concept',
  excludeStories: ['conceptPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/concept.html',
      section: 'Paper',
      title: 'Soul Design System — concept',
      subtitle: 'A concept paper stands beside its panel: the numbered contents, folded to the part the reader is in',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the mark in the panel follows the scroll, and on a
    phone the outline folds behind the press in the head. The appendix folds,
    and the tables scroll rather than widen the page. */
export const Page: Story = {
  name: 'Concept',
  render: () => conceptPage(),
};

/** The paper's first three parts, with the slides they provide. Each slide
    stands at the start of its part, a picture at the column's width. The
    press in the panel runs through all of them at the window's size. */
export const WithSlides: Story = {
  name: 'Concept with slides',
  render: () => conceptPage({ slides: true }),
};

export const screenHtml = (): string => part(conceptPage({ flat: true }));
