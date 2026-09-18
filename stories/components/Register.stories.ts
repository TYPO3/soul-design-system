/* A list a reader cites: numbered, addressed, and read at a glance first.

   The markup lives in `src/components/register.ts` and `entry.ts`. The
   register numbers what stands between its tags and sorts it into the
   groups it names. It writes every entry into one table, and lists the
   work the entries ask for. A review's findings are the worked example: four groups,
   `F` before a finding and `T` before the thing to do. Without groups and
   a prefix an entry is `1`, `2`, `3`, and that is the plain list. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/entry.ts';
import '../../packages/frontend/src/components/register.ts';
import '../../packages/frontend/src/components/code.ts';
import { type EntryProps } from '../../packages/frontend/src/components/entry.ts';
import { FINDING_GROUPS, type RegisterGroup } from '../../packages/frontend/src/components/register.ts';
import { dsCard, part, spec, specCap } from '../lib/specimen.ts';

/** An entry as a page writes it: the blocks between the tags. */
export const sdsEntry = ({ number, prefix, heading, label, tone, group, origin, anchor, todo, body }: EntryProps) =>
  html`<sds-entry number="${number ?? ''}" prefix="${prefix ?? ''}" heading="${heading}" label="${label ?? ''}" tone="${tone ?? 'default'}" group="${group ?? ''}" origin="${origin ?? ''}" anchor="${anchor ?? ''}" todo="${todo ?? ''}">${body}</sds-entry>`;

/** A register as a page writes it: the entries between the tags, in any
    order. The register numbers them, groups them and writes the tables. */
export const sdsRegister = (
  entries: readonly EntryProps[],
  { name = 'register', prefix = '', todoPrefix = '', groups = [] as readonly RegisterGroup[] } = {},
) =>
  html`<sds-register name="${name}" prefix="${prefix}" todo-prefix="${todoPrefix}" .groups="${groups}">${entries.map(({ heading, group, origin, todo, body }) =>
    html`<sds-entry heading="${heading}" group="${group ?? ''}" origin="${origin ?? ''}" todo="${todo ?? ''}">${body}</sds-entry>`)}</sds-register>`;

const mono = (text: string): TemplateResult => html`<span class="sds-mono">${text}</span>`;

/** A review's findings, written in the order the reviewer found them. */
const FINDINGS: readonly EntryProps[] = [
  {
    heading: 'The reader is a new instance per call',
    group: 'change',
    origin: 'older than the change',
    todo: 'Construct the reader once, in the constructor.',
    body: html`<p>${mono('LabelLookup')} constructs its reader in ${mono('resolve()')}. The
      service is a singleton, so one reader in the constructor is the same object with one
      construction fewer per label.</p>`,
  },
  {
    heading: 'The unit suite for the lookup fails: 6 of 41 tests',
    group: 'blocks',
    origin: 'introduced by this change',
    todo: 'Adapt the four tests that expect the second read, and run the suite.',
    body: html`<p>Every case that resolves one key twice fails. Four of them expect the second
      read the change removes on purpose. The other two are 1.2.</p>
      <sds-code code-lang="bash" .body="${[
        { kind: 'shell' as const, text: 'vendor/bin/phpunit tests/Unit/Lookup' },
        { kind: 'plain' as const, text: 'Tests: 41, Assertions: 97, Failures: 6.' },
      ]}"></sds-code>`,
  },
  {
    heading: 'A missing key caches null for the whole request',
    group: 'back',
    origin: 'introduced by this change',
    todo: 'Say so in the docblock, or read again on a miss.',
    body: html`<p>The docblock says a lookup reads again. It does not: ${mono('null')} goes into
      the array like any answer. Right for a request, and worth one sentence where the
      docblock says otherwise.</p>`,
  },
  {
    heading: 'The key stays the file’s own identifier',
    group: 'ok',
    body: html`<p>Checked against a catalogue with a dotted key: the cache keys on the string
      the file names, with no normalisation in between.</p>`,
  },
];

/** The plain list: what a reader raised and the review dropped, in order. */
const DROPPED: readonly EntryProps[] = [
  {
    heading: 'A cache across requests',
    origin: 'raised in review',
    body: html`<p>Raised because the files change rarely. Dropped: a label edited while the
      server runs then arrives after a restart.</p>`,
  },
  {
    heading: 'The cache in the reader instead of the lookup',
    origin: 'raised by the author',
    body: html`<p>Raised because the reader is where the cost is. Dropped: the reader is a new
      instance per call, so a cache there lives one call.</p>`,
  },
];

const meta: Meta<EntryProps> = {
  title: 'Components/Content/Register',
  tags: ['autodocs', '!dev'],
  excludeStories: ['sdsEntry', 'sdsRegister', 'specimenHtml'],
  render: (args) => sdsEntry(args),
  argTypes: {
    heading: { control: 'text' },
    label: { control: 'text' },
    tone: { control: 'inline-radio', options: ['default', 'accent', 'ok', 'warn', 'error'] },
    origin: { control: 'text' },
    todo: { control: 'text' },
  },
  args: { ...FINDINGS[1]!, number: '1.1', prefix: 'F', todoPrefix: 'T', label: 'blocks', tone: 'error' },
  parameters: {
    dsCard: dsCard({
      path: 'components/content/register.card.html',
      name: 'Register',
      subtitle: 'A list a reader cites: numbered, addressed, grouped, and the work it asks for',
      viewport: '700x1673',
    }),
  },
};

export default meta;
type Story = StoryObj<EntryProps>;

/** One entry alone, with the place a register gave it. A block of evidence
    stands between the tags, and the thing to do is its last line. */
export const Entry: Story = {};

/** A review's findings: four groups, `F` before a finding, `T` before the
    thing to do. The entries stand in the order found; the register numbers
    them by group and place, and writes the overview and the work first. */
export const Findings: Story = {
  render: () => sdsRegister(FINDINGS, { name: 'findings', prefix: 'F', todoPrefix: 'T', groups: FINDING_GROUPS }),
};

/** No groups and no prefix: the entries count up as written, `1`, `2`, and
    the register still writes the overview. */
export const Plain: Story = {
  render: () => sdsRegister(DROPPED, { name: 'dropped' }),
};

export const specimenHtml = (): string =>
  spec([
    part(html`<sds-register name="findings" prefix="F" todo-prefix="T" .groups="${FINDING_GROUPS}" .entries="${FINDINGS}"></sds-register>`),
    specCap('THE REGISTER NUMBERS AND GROUPS · THE OVERVIEW AND THE WORK ARE TABLES · THE NUMBER IN A RAIL · THE KIND IS A WORD'),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
