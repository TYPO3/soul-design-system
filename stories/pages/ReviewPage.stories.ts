/* A review of a change.

   The document a reviewer hands back, and a document rather than a page of
   a site: no bar, no rail, nothing to navigate. Its own head instead, the
   facts of the change in a list, and the verdict first, because that is
   what the author came for. Then the context, the mechanism, the error and
   the change with its paths traced. The findings stand by weight, the
   remarks under the code they cite, and the evidence after them:
   probes, suites, coverage. What the review found sound stands in it too,
   and what it raised and dropped. Live and static from one composition —
   `lib/page.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/accordion.ts';
import '../../packages/frontend/src/components/badge.ts';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/diff.ts';
import '../../packages/frontend/src/components/eyebrow.ts';
import '../../packages/frontend/src/components/facts.ts';
import '../../packages/frontend/src/components/figure.ts';
import '../../packages/frontend/src/components/entry.ts';
import '../../packages/frontend/src/components/register.ts';
import '../../packages/frontend/src/components/link.ts';
import '../../packages/frontend/src/components/nav-toc.ts';
import '../../packages/frontend/src/components/note.ts';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/table.ts';
import { type Entry } from '../../packages/frontend/src/components/accordion.ts';
import { type Remark } from '../../packages/frontend/src/components/code.ts';
import { type DiffLine } from '../../packages/frontend/src/components/diff.ts';
import { type EntryProps } from '../../packages/frontend/src/components/entry.ts';
import { type FactsEntry } from '../../packages/frontend/src/components/facts.ts';
import { FINDING_GROUPS } from '../../packages/frontend/src/components/register.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { dsScreen, NNBSP, part } from '../lib/specimen.ts';
import { grid, type PageMode } from '../lib/page.ts';

const mono = (text: string): TemplateResult => html`<span class="sds-mono">${text}</span>`;

/* Three badges the rows repeat. A result carries a colour and a glyph
   everywhere else in this system, so it does here too. */
const ok = html`<sds-badge label="ok" tone="ok"></sds-badge>`;
const fail = html`<sds-badge label="fail" tone="error"></sds-badge>`;
const same = html`<sds-badge label="unchanged"></sds-badge>`;

/** The change under review, as the reviewer read it. */
const CHANGE: readonly DiffLine[] = [
  { kind: 'context', text: '    public function resolve(string $key, string $language): ?string' },
  { kind: 'context', text: '    {' },
  { kind: 'add', text: '        if (isset($this->cache[$key])) {' },
  { kind: 'add', text: '            return $this->cache[$key];' },
  { kind: 'add', text: '        }' },
  { kind: 'context', text: '        $catalogue = $this->reader->read($this->fileFor($key), $language);' },
  { kind: 'del', text: '        return $catalogue->get($key);' },
  { kind: 'add', text: '        return $this->cache[$key] = $catalogue->get($key);' },
  { kind: 'context', text: '    }' },
];

/** The trace that shows the error: one file, read once per label. */
const TRACE = `# typo3_label_lookup · page 12 · 40 labels
read Resources/Private/Language/locallang.xlf (de)   3.1 ms
read Resources/Private/Language/locallang.xlf (de)   3.0 ms
read Resources/Private/Language/locallang.xlf (de)   3.2 ms
…
40 reads · 3 files · 124 ms of a 131 ms answer`;

/** The hunk the findings point at, as the patched file has it. */
const HUNK = `    public function resolve(string $key, string $language): ?string
    {
        if (isset($this->cache[$key])) {
            return $this->cache[$key];
        }
        $catalogue = $this->reader->read($this->fileFor($key), $language);
        return $this->cache[$key] = $catalogue->get($key);
    }`;

/** What the reviewer says over those lines, ready for the review tool. */
const REMARKS: readonly Remark[] = [
  { line: 43, text: 'The key has no language. A lookup after a switch answers in the language before it; probe P2 shows that. Key on both. [F1.2]' },
  { line: 46, text: 'This read runs again for a key with no label: isset() is false for a cached null. The docblock says the opposite; one of the two has to move. [F2.1]' },
  { line: 47, text: 'The one path that changed, and no test fails on it yet. A.1 is one. [F2.2]' },
];

/** The reader, constructed where it is used. */
const READER = `    private function reader(): CatalogueReader
    {
        return new CatalogueReader($this->files);
    }`;

const READER_REMARKS: readonly Remark[] = [
  { line: 62, text: 'A new reader per call, in a service the container holds once. The constructor is the place; the reader carries no state of its own. [F3.1]' },
];

/** The tests the review wrote to hold the change to its claim. */
const TEST = `public function aSecondLookupReadsNoFile(): void
{
    $this->subject->resolve('answer.empty', 'de');
    $this->subject->resolve('answer.empty', 'de');
    self::assertSame(1, $this->reader->reads);
}

public function aLookupAfterALanguageSwitchAnswersInTheNewLanguage(): void
{
    $this->subject->resolve('answer.empty', 'de');
    self::assertSame('Nothing found', $this->subject->resolve('answer.empty', 'en'));
}`;

/** The probe script, run against the parent and against the change. */
const PROBE = `$lookup = $container->get(LabelLookup::class);
$reader = $container->get(CatalogueReader::class);

$lookup->resolve('answer.empty', 'de');
$lookup->resolve('answer.empty', 'de');
printf("P1 reads after two lookups: %d\\n", $reader->reads);

$en = $lookup->resolve('answer.empty', 'en');
printf("P2 after a switch to en: %s\\n", $en);`;

/* ------------------------------------------------------------ tables -- */

const LOOKUPS_COLUMNS: readonly Column[] = [
  { head: 'Tool', cls: 'sds-td-name' },
  { head: 'Reads', cls: 'sds-td-meta' },
  { head: 'Cached where' },
  { head: 'Per request' },
];

const LOOKUPS: readonly Row[] = [
  { cells: [mono('typo3_label_lookup'), 'LabelLookup::resolve()', 'this change', html`<sds-badge label="with the change" tone="ok"></sds-badge>`] },
  { cells: [mono('typo3_icon_lookup'), 'IconLookup::resolve()', html`${mono('IconRegistry')}, since 2.1`, html`<sds-badge label="yes" tone="ok"></sds-badge>`] },
  { cells: [mono('typo3_schema_lookup'), 'SchemaLookup::table()', 'the installation’s own', html`<sds-badge label="yes" tone="ok"></sds-badge>`] },
  { cells: [mono('typo3_hint_lookup'), 'HintLookup::find()', 'a static, per process', html`<sds-badge label="reads once" tone="warn"></sds-badge>`] },
];

const PATHS_COLUMNS: readonly Column[] = [
  { head: 'Scenario' },
  { head: 'Flow' },
  { head: 'Result' },
];

const PATHS: readonly Row[] = [
  { cells: ['First lookup of a key', html`${mono('resolve()')} → ${mono('reader->read()')} → ${mono('get()')} → into the array`, html`<sds-badge label="one read" tone="ok"></sds-badge>`] },
  { cells: ['Second lookup, same key, same language', 'the array answers', html`<sds-badge label="no read" tone="ok"></sds-badge>`] },
  { cells: ['Second lookup, same key, other language', 'the array answers, in the first language', html`<sds-badge label="wrong answer" tone="error"></sds-badge>`] },
  { cells: ['Key with no label', html`${mono('null')} goes into the array; ${mono('isset()')} is false for it`, html`<sds-badge label="reads again" tone="warn"></sds-badge>`] },
  { cells: ['A second request', 'a new service, an empty array', same] },
  { cells: [html`${mono('typo3_icon_lookup')}, ${mono('typo3_schema_lookup')}`, 'not touched', same] },
];

const PROBES_COLUMNS: readonly Column[] = [
  { head: 'Probe' },
  { head: 'Parent', cls: 'sds-td-meta' },
  { head: 'Change', cls: 'sds-td-meta' },
];

const PROBES: readonly Row[] = [
  { cells: [html`P1 · ${mono('resolve()')} twice, one key, one language`, html`${fail} 2 reads`, html`${ok} 1 read`] },
  { cells: [html`P2 · ${mono('resolve()')} twice, ${mono('de')} then ${mono('en')}`, html`${ok} answers in ${mono('en')}`, html`${fail} answers in ${mono('de')}`] },
  { cells: ['P3 · a key with no label, twice', html`${same} 2 reads`, html`${same} 2 reads`] },
  { cells: ['P4 · page 12, 40 labels', html`${fail} 40 reads, 131${NNBSP}ms`, html`${ok} 3 reads, 11${NNBSP}ms`] },
  { cells: ['P5 · two requests in one process', html`${ok} 2 reads`, html`${ok} 2 reads`] },
];

const SUITES_COLUMNS: readonly Column[] = [
  { head: 'Suite', cls: 'sds-td-name' },
  { head: 'Scope' },
  { head: 'Result' },
];

const SUITES: readonly Row[] = [
  { cells: ['unit', mono('tests/Unit/Lookup'), html`<sds-badge label="6 of 41 fail" tone="error"></sds-badge>`] },
  { cells: ['functional', mono('tests/Functional/Tools'), html`<sds-badge label="88 pass" tone="ok"></sds-badge>`] },
  { cells: ['cgl', 'every PHP file', html`<sds-badge label="0 fixable" tone="ok"></sds-badge>`] },
  { cells: ['phpstan', 'level 8, 412 files', html`<sds-badge label="no errors" tone="ok"></sds-badge>`] },
  { cells: ['e2e', '—', html`<sds-badge label="not run"></sds-badge>`] },
];

const COVERAGE_COLUMNS: readonly Column[] = [
  { head: 'Test', cls: 'sds-td-name' },
  { head: 'Claims' },
  { head: 'Checks' },
  { head: '' },
];

const COVERAGE: readonly Row[] = [
  { cells: ['resolveReturnsTheLabel', 'a key resolves', 'one call, one label', html`<sds-badge label="holds" tone="ok"></sds-badge>`] },
  { cells: ['resolveReadsTheCatalogueOnce', 'the cache works', 'nothing: it counts no reads, and passes on the parent too', html`<sds-badge label="claims more" tone="warn"></sds-badge>`] },
  { cells: ['resolveHonoursTheLanguage', 'a switch answers in the new language', 'one lookup per language, on two keys', html`<sds-badge label="misses F1.2" tone="error"></sds-badge>`] },
  { cells: ['—', 'a missing key', 'no test', html`<sds-badge label="none" tone="error"></sds-badge>`] },
];

/** The facts of the change, as the head states them. */
const FACTS: readonly FactsEntry[] = [
  { term: 'Change', value: html`<sds-link href="#change-1482" label="1482 · [BUGFIX] Cache label lookups for the length of a request"></sds-link>` },
  { term: 'Patch set', value: html`2 · ${mono('3f9c2e1a7d0')} · 3 files, +64${NNBSP}−9` },
  { term: 'Issue', value: html`<sds-link href="#issue-2071" label="#2071"></sds-link> · Bug · "a page with forty labels answers in 130${NNBSP}ms"` },
  { term: 'Target', value: html`${mono('main')} · ${mono('2.4')}` },
  { term: 'State', value: html`<span class="sds-row"><sds-badge label="mergeable" tone="ok"></sds-badge><sds-badge label="Verified +1" tone="ok"></sds-badge><span>no votes, no comments, no chain</span></span>` },
  { term: 'Read', value: '2026-09-11 in a worktree of its own, probes on 2026-09-14' },
];

/** What the review ran, and what it did not. */
const SURFACES: readonly FactsEntry[] = [
  { term: 'Worktree', value: html`${mono('review/1482')}, no rebase, 4 commits behind ${mono('origin/main')}` },
  { term: 'Read', value: 'the three changed files, the class’s tests, the changelog entry, the issue' },
  { term: 'Suites', value: html`unit for ${mono('Lookup')}, functional for ${mono('Tools')}, cgl, phpstan` },
  { term: 'Probes', value: 'five, on parent and change, in A.2' },
  { term: 'Not run', value: 'e2e, the full unit suite' },
];

/* ---------------------------------------------------------- findings -- */

const FINDINGS: readonly EntryProps[] = [
  {
    heading: 'The unit suite for the lookup fails: 6 of 41 tests',
    group: 'blocks',
    origin: 'introduced by this change',
    todo: 'Adapt the four tests that expect the second read, and run the suite before the next patch set.',
    body: html`<p>Every case that resolves one key twice fails. The change does not touch the
      suite, so nobody ran it, and the pre-merge pipeline goes red on it.</p>
      <sds-code code-lang="bash" .body="${[
        { kind: 'shell' as const, text: 'vendor/bin/phpunit tests/Unit/Lookup' },
        { kind: 'plain' as const, text: 'Tests: 41, Assertions: 97, Failures: 6.' },
      ]}"></sds-code>
      <p>Four of the six expect the second read the change removes on purpose: adapt those. The
      other two are F1.2.</p>`,
  },
  {
    heading: 'A lookup after a language switch answers in the language before it',
    group: 'blocks',
    origin: 'introduced by this change',
    todo: 'Key the cache on the key and the language, or keep one array per language.',
    body: html`<p>The cache keys on ${mono('$key')} alone. The first answer for a key stays,
      whatever language the next call names. Probe P2 shows it, and the two remaining
      failures in F1.1 are this. Key on the key and the language, or keep one array per
      language.</p>
      <sds-figure
        src="assets/diagrams/cache-key.svg"
        alt="Two calls for the same key, one in German and one in English, both reach the same slot of the array. The German call writes the slot; the English call reads it and answers in German."
        caption="Both calls reach one slot. The German call fills it, and the English call answers from it, in German."
        zoomable
      ></sds-figure>`,
  },
  {
    heading: 'A missing key reads the catalogue on every call',
    group: 'back',
    origin: 'introduced by this change',
    todo: 'Use array_key_exists(), or make the docblock say that a miss reads again.',
    body: html`<p>${mono('isset()')} is false for a cached ${mono('null')}, so a key with no
      label goes to the file each time (probe P3). The docblock says the opposite: that the
      request keeps a miss. ${mono('array_key_exists()')} does what the docblock says. Either
      the code or the sentence moves.</p>`,
  },
  {
    heading: 'No test can fail on what the change claims',
    group: 'back',
    origin: 'introduced by this change',
    todo: 'Bring the two tests in A.1, which fail on the parent.',
    body: html`<p>The coverage table below has the detail. In short: the one test named for
      the cache counts no reads and passes on the parent too, the language test never
      resolves one key twice, and a missing key has no test at all. A.1 is two tests that
      fail on the parent.</p>`,
  },
  {
    heading: 'The reader is a new instance per call',
    group: 'change',
    origin: 'older than the change',
    todo: 'Construct the reader once, in the constructor.',
    body: html`<p>${mono('LabelLookup')} constructs its reader in ${mono('resolve()')}. The
      service is a singleton, and the reader carries no state, so one reader in the
      constructor is the same object with one construction fewer per label.</p>`,
  },
  {
    heading: 'The changelog entry names no visible change',
    group: 'change',
    origin: 'introduced by this change',
    todo: 'Put the number into the entry: 131 ms to 11 ms, forty reads to three.',
    body: html`<p>An answer that took 131${NNBSP}ms takes 11${NNBSP}ms, and a page with forty
      labels reads three files instead of forty. The entry says "performance". The number
      is the sentence a reader of the release page wants.</p>`,
  },
  {
    heading: 'The array has no bound',
    group: 'change',
    origin: 'introduced by this change',
    body: html`<p>One request resolves at most a few hundred keys, so this costs nothing
      today. A sentence in the docblock that says so is enough; a bound is not.</p>`,
  },
  {
    heading: 'Two trailers in the message',
    group: 'change',
    todo: 'Drop the second Signed-off-by trailer.',
    body: html`<p>${mono('Signed-off-by')} stands twice. Nothing reads it twice; one goes.</p>`,
  },
  {
    heading: 'The cache lives exactly one request',
    group: 'ok',
    body: html`<p>The service is request-scoped, and probe P5 shows a second request reads
      again. Nothing survives into the next answer.</p>`,
  },
  {
    heading: 'The other lookups stay as they are',
    group: 'ok',
    body: html`<p>${mono('typo3_icon_lookup')} and ${mono('typo3_schema_lookup')} cache
      already, in the registry and in the installation; the change reads neither. The hint
      lookup is a case of its own: the follow-up under Scope.</p>`,
  },
];

/** What the review keeps out of the way: the tests and the probe. */
const APPENDIX: readonly Entry[] = [
  {
    question: 'A.1 · The two tests, written for this review and removed again',
    answer: html`<sds-code code-lang="php" source="${TEST}"></sds-code>`,
  },
  {
    question: 'A.2 · The probe',
    answer: html`<sds-code code-lang="php" source="${PROBE}"></sds-code>`,
  },
];

/** The parts of the review, and the sections in each. The list nests the way
    the page does, so a reader sees five parts before fourteen headings. Each
    target is a section, so landing on one marks its heading. */
const SECTIONS = [
  { label: 'The change', href: '#change', items: [
    { label: 'Context', href: '#context' },
    { label: 'How a lookup answers', href: '#mechanism' },
    { label: 'The error', href: '#error' },
    { label: 'What it does', href: '#does' },
    { label: 'Paths traced', href: '#paths' },
  ] },
  { label: 'Findings', href: '#findings', items: [
    { label: 'To do', href: '#findings-todo' },
    { label: 'Blocks submission', href: '#findings-blocks' },
    { label: 'Sent back', href: '#findings-back' },
    { label: 'Worth a change', href: '#findings-change' },
    { label: 'Checked and correct', href: '#findings-ok' },
  ] },
  { label: 'Remarks at the code', href: '#remarks' },
  { label: 'Evidence', href: '#evidence', items: [
    { label: 'Probes', href: '#probes' },
    { label: 'Suites', href: '#suites' },
    { label: 'Test coverage', href: '#coverage' },
  ] },
  { label: 'Scope', href: '#scope', items: [
    { label: 'Raised and dropped', href: '#dropped' },
    { label: 'Follow-ups', href: '#follow-ups' },
    { label: 'Surfaces and runs', href: '#surfaces' },
  ] },
  { label: 'Appendix', href: '#appendix' },
];

/** The page. `flat` composes the form a static file can hold. */
export function reviewPage({ flat = false }: PageMode = {}): TemplateResult {
  /* Where the two renderings differ: what stands between an element's tags,
     because `renderStatic` flattens no element with children. Flat, the
     same blocks go over as the property. */
  const summary = html`<p>
      The change fixes a real, measured fault: every label lookup read its catalogue file
      again, and a page with forty labels spent 124 of its 131${NNBSP}ms on the same three
      files. An array on the service, alive for one request, answers the second lookup of a
      key without a read. The idea is right and small.
    </p>
    <p>
      <strong>Recommendation:</strong> not ready to merge. The unit suite for the class fails
      (<a href="#findings-1-1">F1.1</a>), and a lookup after a language switch answers in the
      language before it (<a href="#findings-1-2">F1.2</a>), which no test can see
      (<a href="#findings-2-2">F2.2</a>). Key the cache on the language too, adapt the four
      tests that expect the second read, and bring the two tests in
      <a href="#appendix">A.1</a>. Nothing else in the change stops it.
    </p>`;
  /* The pairs between the tags, or as the property. A value here carries a
     link, a badge, a literal, and a static render cannot see the form that
     holds them. */
  const facts = flat
    ? html`<sds-facts .entries="${FACTS}"></sds-facts>`
    : html`<sds-facts>${FACTS.map(({ term, value }) => html`<dt>${term}</dt><dd>${value}</dd>`)}</sds-facts>`;
  const surfaces = flat
    ? html`<sds-facts .entries="${SURFACES}"></sds-facts>`
    : html`<sds-facts>${SURFACES.map(({ term, value }) => html`<dt>${term}</dt><dd>${value}</dd>`)}</sds-facts>`;

  const opener = flat
    ? html`<sds-surface plane="raised" heading="Summary" .body="${summary}"></sds-surface>`
    : html`<sds-surface plane="raised" heading="Summary">${summary}</sds-surface>`;
  const tile = (label: string, body: TemplateResult): TemplateResult => flat
    ? html`<sds-surface plane="plain" label="${label}" .body="${body}"></sds-surface>`
    : html`<sds-surface plane="plain" label="${label}">${body}</sds-surface>`;
  const tiles = grid(
    [
      tile('Blocks', html`<strong>Two.</strong> A red suite, and a language switch that answers in the old language.`),
      tile('Sent back', html`<strong>Two.</strong> A miss reads again, and no test can fail on the cache.`),
      tile('Worth a change', html`<strong>Four.</strong> In the change; none of them stops it.`),
      tile('Checked', html`<strong>Two.</strong> The cache lives one request, and the other lookups stay as they are.`),
    ],
    { flat, variant: 'dense' },
  );
  const findings = flat
    ? html`<sds-register name="findings" prefix="F" todo-prefix="T" .groups="${FINDING_GROUPS}" .entries="${FINDINGS}"></sds-register>`
    : html`<sds-register name="findings" prefix="F" todo-prefix="T" .groups="${FINDING_GROUPS}">${FINDINGS.map((f) =>
        html`<sds-entry heading="${f.heading}" group="${f.group ?? ''}" origin="${f.origin ?? ''}" todo="${f.todo ?? ''}">${f.body}</sds-entry>`)}</sds-register>`;

  return html`<div class="sds-shell">
  <div class="sds-body">
  <main class="sds-body__main" id="main-content">
    <!-- One document, read from the top. No bar and no rail: nothing here leads
         anywhere else, and the head is the document's own. The contents rest
         beside the column where the page has the room, in the aside a document
         writes; narrower, the list stands where it is written. The flow
         contract carries every step between these blocks, so there is no stack. -->
    <article class="sds-prose">
      <!-- Every titled part is a section, nested as the headings nest, the way a
           rendered document is. A section owns its boundary, so the step between
           two parts is one distance stated once, whatever stands last in either. -->
      <section class="sds-section" id="review">
        <sds-eyebrow label="Extension review · dev-companion · patch set 2"></sds-eyebrow>
        <h1>Label lookups cached for the length of a request</h1>
        <p class="sds-lead">
          A review of change 1482, with an inventory of every lookup that reads a file and
          one question: does the cache survive a language switch?
        </p>

        ${facts}

        ${opener}
        ${tiles}
      </section>

      <!-- After the head and before the parts, which is where the list stands
           on a narrow page. Wide, the box is the column's reserve and the list
           rests beside the column wherever the reader is. Between two sections,
           so no heading loses the step a sibling before it reads. -->
      <div class="sds-aside">
        <sds-nav-toc label="On this page" .entries="${SECTIONS}"></sds-nav-toc>
      </div>

      <section class="sds-section" id="change">
        <h2>The change</h2>
        <p>
          What the change is, where it stands, and how the review read it. Then how the code
          it touches works, what went wrong, and what the change does about it.
        </p>

        <section class="sds-section" id="context">
          <h3>Context</h3>
          <p>
            Issue #2071 came in from a reader of the tool reference: a page that resolves forty
            labels answers in 130${NNBSP}ms, and the trace shows the same file read forty times.
            The change is small on purpose. It adds an array to the lookup service and reads
            from it before it reads from the file.
          </p>
          <p>
            Patch set 2 is a rebase of set 1 with a changelog entry. It stands alone: no chain
            above it, no votes, no comments, and the pipeline reports green. The pipeline runs
            the functional suites and not the unit suite for <span class="sds-mono">Lookup</span>,
            which is where F1.1 comes from.
          </p>
          <p>
            The review read commit <span class="sds-mono">3f9c2e1a7d0</span> in a worktree of its
            own, with no rebase, 4 commits behind <span class="sds-mono">origin/main</span>. Every
            suite result and every probe in this document is against that commit and its parent.
          </p>
        </section>

        <section class="sds-section" id="mechanism">
          <h3>How a lookup answers</h3>
          <p>
            A tool answers from a source, and the source of <span class="sds-mono">typo3_label_lookup</span>
            is the catalogue files of the installation. The service resolves a key to a file,
            reads that file for one language, and returns the label. Nothing between the call
            and the file kept an answer, so every call was a read. The other lookups keep theirs
            somewhere, and where they keep it decides what a change to one of them can touch.
          </p>
          <sds-figure
            src="assets/diagrams/lookup-cache.svg"
            alt="Two rows of the same four stops: the call, the array on the service, the catalogue reader, and the file. The first lookup passes through all four and reads the file. The second hits the array and goes no further."
            caption="The first lookup of a key reads the file; the second stops at the array. Forty labels on a page are three reads, not forty."
            zoomable
          ></sds-figure>
          <sds-table scrollable .columns="${LOOKUPS_COLUMNS}" .rows="${LOOKUPS}"></sds-table>
        </section>

        <section class="sds-section" id="error">
          <h3>The error</h3>
          <p>
            Every call of <span class="sds-mono">typo3_label_lookup</span> reads the catalogue
            again. A page that resolves forty labels reads the same three files forty times, and
            the read is most of the answer.
          </p>
          <sds-code code-lang="text" caption="The trace from the issue" source="${TRACE}"></sds-code>
        </section>

        <section class="sds-section" id="does">
          <h3>What it does</h3>
          <p>
            <span class="sds-mono">resolve()</span> keeps what it answered in an array on the
            service, which lives as long as the request. The second lookup of a key returns from
            there and reads no file.
          </p>
          <sds-diff path="Classes/Lookup/LabelLookup.php" .body="${CHANGE}"></sds-diff>
        </section>

        <section class="sds-section" id="paths">
          <h3>Paths traced</h3>
          <p>Every way through the changed method, followed by hand and then by probe.</p>
          <sds-table scrollable density="compact" .columns="${PATHS_COLUMNS}" .rows="${PATHS}"></sds-table>
        </section>
      </section>

      <section class="sds-section" id="findings">
        <h2>Findings</h2>
        <p>
          By weight, and numbered by it: what stops the change, what goes back to its author,
          what is worth a change, and what the review opened and found sound. Without the
          last group the author cannot tell what a review looked at from what it never
          reached. Every finding in one table first, each row a jump to its entry, and the
          work they ask for in a second.
        </p>
        ${findings}
      </section>

      <section class="sds-section" id="remarks">
        <h2>Remarks at the code</h2>
        <p>
          The hunks the findings point at, with each remark under the block at the line it cites. Line
          numbers are those of the patched file, and each remark goes into the review tool as
          it stands. A number in brackets names the finding.
        </p>
        <sds-code
          code-lang="php"
          caption="Classes/Lookup/LabelLookup.php, from line 41"
          source="${HUNK}"
          start="41"
          .remarks="${REMARKS}"
        ></sds-code>
        <sds-code
          code-lang="php"
          caption="Classes/Lookup/LabelLookup.php, from line 60"
          source="${READER}"
          start="60"
          .remarks="${READER_REMARKS}"
        ></sds-code>
      </section>

      <section class="sds-section" id="evidence">
        <h2>Evidence</h2>
        <p>
          What the review ran, on the change and on its parent, so every finding above has a
          number behind it.
        </p>

        <section class="sds-section" id="probes">
          <h3>Probes, parent against change</h3>
          <p>
            The probe in A.2, run against the change and against its parent. A probe that
            turns green proves the fix; one that turns red is a regression the suites did not
            see.
          </p>
          <sds-table scrollable density="compact" .columns="${PROBES_COLUMNS}" .rows="${PROBES}"></sds-table>
        </section>

        <section class="sds-section" id="suites">
          <h3>Suites on the worktree</h3>
          <p>Commit <span class="sds-mono">3f9c2e1a7d0</span>, every suite from a clean checkout.</p>
          <sds-table scrollable density="compact" .columns="${SUITES_COLUMNS}" .rows="${SUITES}"></sds-table>
        </section>

        <section class="sds-section" id="coverage">
          <h3>Test coverage</h3>
          <p>
            What the tests of the changed class claim, against what each one checks. A test
            that passes on the parent too proves nothing about the change.
          </p>
          <sds-table scrollable density="compact" .columns="${COVERAGE_COLUMNS}" .rows="${COVERAGE}"></sds-table>
        </section>
      </section>

      <section class="sds-section" id="scope">
        <h2>Scope</h2>
        <p>
          What the review considered and set aside, what it leaves for a change of its own,
          and what it ran.
        </p>

        <section class="sds-section" id="dropped">
          <h3>Raised and dropped</h3>
          <ul>
            <li>
              <strong>A cache across requests.</strong> Raised because the files change
              rarely. Dropped: a label edited while the server runs then arrives after a
              restart, which is the fault the follow-up below names in the hint lookup.
            </li>
            <li>
              <strong>The cache in the reader instead of the lookup.</strong> Raised because
              the reader is where the cost is. Dropped: the reader is a new instance per call
              (F3.1), so a cache there lives one call.
            </li>
            <li>
              <strong>A bound on the array.</strong> Raised in F3.3 and dropped there: a
              request resolves a few hundred keys at most.
            </li>
          </ul>
        </section>

        <section class="sds-section" id="follow-ups">
          <h3>Follow-ups, not this change</h3>
          <sds-note
            tone="warn"
            heading="N1 · The hint lookup reads its file once per process, not per request"
            body="HintLookup keeps its catalogue in a static, so a hint edited while the server runs arrives after a restart. Right for a build, wrong for a watch. A change of its own."
          ></sds-note>
        </section>

        <section class="sds-section" id="surfaces">
          <h3>Surfaces and runs</h3>
          ${surfaces}
        </section>
      </section>

      <section class="sds-section" id="appendix">
        <h2>Appendix</h2>
        <sds-accordion name="appendix" .entries="${APPENDIX}"></sds-accordion>
      </section>

    </article>
  </main>
  </div>
</div>`;
}

/* Untagged for the reason `LandingScreen.stories.ts` gives. A whole layout
   has no variants to collect, and the widths it documents are reachable only
   in the story view. */
const meta: Meta = {
  title: 'Pages/Review',
  excludeStories: ['reviewPage', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/review.html',
      title: 'Soul Design System — review',
      subtitle: 'A review carries its verdict first, its findings by weight, and the evidence for each',
      viewport: '1440x900',
    }),
  },
};

export default meta;
type Story = StoryObj;

/** Click through it: the appendix folds, the tables scroll rather than widen
    the page, and the contents list marks the section. */
export const Page: Story = {
  name: 'Review',
  render: () => reviewPage(),
};

export const screenHtml = (): string => part(reviewPage({ flat: true }));
