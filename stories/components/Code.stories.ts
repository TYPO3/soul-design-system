/* The code block.

   The markup lives in `src/components/code.ts`. With the diff it shares the one
   permission the rest of the system does not have: status colour can fill a
   whole line. Everywhere else it marks a badge and never becomes furniture.

   The card shows the block and the diff together, because that permission is
   what it documents; the change comes from `Diff.stories.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/diff.ts';
import '../../packages/frontend/src/components/icon.ts';
import { type CodeBlockProps } from '../../packages/frontend/src/components/code.ts';
import { type DiffLine } from '../../packages/frontend/src/components/diff.ts';
import { DIFF } from './Diff.stories.ts';
import { LANGUAGES, SAMPLES, sampleOf } from '../lib/languages.ts';
import { dsCard, part, spec, specCap } from '../lib/specimen.ts';

const BASH: CodeBlockProps = {
  lang: 'bash',
  copy: true,
  body: [
    { kind: 'comment', text: '# standalone: clone, install once' },
    { kind: 'shell', text: 'composer install' },
    { kind: 'ok', text: 'published 9 task skills to', code: '.agents/skills' },
  ],
};

export const sdsCode = ({ lang, body, source, copy }: CodeBlockProps) =>
  html`<sds-code code-lang="${lang ?? ''}" ?copy="${copy ?? false}" source="${source ?? ''}" .body="${body}"></sds-code>`;

const sdsDiff = (path: string, body: readonly DiffLine[]) =>
  html`<sds-diff path="${path}" .body="${body}"></sds-diff>`;

const meta: Meta<CodeBlockProps> = {
  title: 'Components/Code',
  tags: ['autodocs', '!dev'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['specimenHtml'],
  render: (args) => sdsCode(args),
  argTypes: {
    /* The languages the system declares support for, as a menu. It was a text
       field, which offered no idea that a set exists and let `yml` through
       without a murmur. The type stays open — a fence can say anything. But
       the control shows what stands behind it, read from the samples, so the
       menu cannot offer a language nothing here sets. */
    lang: { control: 'select', options: LANGUAGES },
    copy: { control: 'boolean' },
  },
  args: BASH,
  parameters: {
    dsCard: dsCard({
      path: 'components/code/code.card.html',
      name: 'Code block & diff',
      subtitle: 'The one place status colour can fill a whole line',
      viewport: '700x370',
    }),
  },
};

export default meta;
type Story = StoryObj<CodeBlockProps>;

/** The `$` prompt carries the accent — one of exactly three places in the
    whole system where `--accent` appears. */
export const Shell: Story = { args: BASH };

/** The form a renderer uses: the body stands between the tags. `.body` is
    data the element turns into spans and renders anywhere, the static export
    included. Content between the tags is markup somebody else produced, and
    the element frames it on upgrade. That one is a browser affordance —
    `renderStatic` refuses it rather than exports an empty frame. */
export const FromContent: Story = {
  render: () => html`<sds-code code-lang="json" copy>${unsafeHTML(
    '{\n  "domains": ["labels", "xlf"],\n  "versions": ["12.4", "13.4", "14.3"]\n}',
  )}</sds-code>`,
};

/** The colour is the component's: a renderer that names a language and leaves
    the block in one grey has done half the job. Only the languages the system
    declares register, and the palette is its three syntax colours. A language
    it does not colour prints the text as written rather than a guess. */
export const Highlighted: Story = {
  render: () => html`
    <sds-code code-lang="php" copy>&lt;?php
namespace TYPO3\CMS\Core;

// The scope a question gets its answer in.
final class Version
{
    public function __construct(private readonly string $number) {}
}</sds-code>
    <sds-code code-lang="yaml" copy>versions:
  - "13.4"   # LTS
  - "14.3"
domains: [labels, xlf]</sds-code>
  `,
};

/** The other direction: the colour arrives with the block. A documentation
    build decides it once and ships HTML with `hljs-` classes, which are the
    classes `components.css` maps. So a component that highlighted nothing
    paints the block below. What it hands back is what it got, `<code>` and
    all: the wrapper carries which lines have numbers and emphasis. */
export const AlreadyColoured: Story = {
  render: () => html`<sds-code code-lang="php" copy>${unsafeHTML(
    '<code class="language-php line-numbers" data-start="12">'
    + '<span class="hljs-keyword">final</span> <span class="hljs-keyword">class</span> <span class="hljs-title">Version</span>\n'
    + '{\n'
    + '    <span class="hljs-comment">// Handed over coloured, framed here.</span>\n'
    + '    <span class="hljs-keyword">public</span> <span class="hljs-keyword">function</span> '
    + '<span class="hljs-title">__construct</span>(<span class="hljs-keyword">private</span> '
    + '<span class="hljs-type">string</span> $number) {}\n'
    + '}</code>',
  )}</sds-code>`,
};

/** Every language this system colours, each in a block of its own. The point
    is the palette rather than the languages. The same three colours across
    every grammar, and whatever a fourth marks reads as ordinary code. A block
    that sets in one grey here is a grammar that quietly lost its registration,
    which looks exactly like a language nobody declared.

    Blocks as siblings and no wrapper. The step between them is the element's
    own, and a story that reaches for a gap documents a distance the system
    does not have. */
export const Languages: Story = {
  render: () => html`${LANGUAGES.map(
    (lang) => sdsCode({ lang, source: SAMPLES[lang], body: [], copy: true }),
  )}`,
};

/** One of them at a time, chosen from the toolbar — the same samples, where
    the menu above is the point rather than the set. */
export const Language: Story = {
  args: { lang: 'typoscript', copy: true, body: [] },
  render: ({ lang, copy }) => sdsCode({ lang, source: sampleOf(lang ?? ''), body: [], copy }),
};

/** A caption says what the block is, above it — where a reader meets it
    before the block rather than in the block's own chrome. Above the frame
    and inside the element. Where a caption sits is the block's decision, so
    the block places it, and a page that moves one moves both. */
export const Captioned: Story = {
  render: () => html`<sds-code code-lang="bash" caption="Installing as a dependency of an existing project" copy>composer require typo3/cms-core
vendor/bin/typo3 cache:flush</sds-code>`,
};

/** The same caption between the tags, which is the form a renderer needs. A
    caption node carries markup where the attribute is a string, and a page
    that has not run the script has markup that already reads. In the class
    the component emits, so it stays out of the block, the colour and the
    clipboard. */
export const CaptionedFromContent: Story = {
  render: () => html`<sds-code code-lang="bash" copy><div class="sds-code__caption">As a dependency of an existing <code>composer.json</code></div>composer require typo3/cms-core
vendor/bin/typo3 cache:flush</sds-code>`,
};

/** A reader's sentences about lines of the block: a review's findings
    at the code, ready for the review tool. `start` is the first line's number
    in its file, so a remark counts as the file does. Not code, so not mono,
    and none of it goes to the clipboard. */
export const Remarked: Story = {
  render: () => html`<sds-code
    code-lang="php"
    caption="Classes/Version.php, from line 12"
    source="${`final class Version
{
    public function __construct(private readonly string $number) {}

    public function major(): int
    {
        return (int)explode('.', $this->number)[0];
    }
}`}"
    start="12"
    .remarks="${[
      { line: 14, text: 'A version has a shape, and a string does not check it. Take a value object, or check the number here.' },
      { line: 18, text: 'A string with no dot gives the whole string, and the cast makes a number of it: what the caller wants.' },
    ]}"
    copy
  ></sds-code>`,
};

export const specimenHtml = (): string =>
  spec(
    [
      part(sdsCode(BASH)),
      part(sdsDiff('KNOWLEDGE/HINTS/LABELS.JSON', DIFF)),
      specCap(
        'CODE AND DIFF AT --font-size-small × --font-modifier-mono, --leading-code · ' +
          'DIFF ROWS TINT AT 14% · NO LINE NUMBERS UNLESS THEY ARE REFERENCED',
      ),
    ],
    { gap: '14px' },
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
