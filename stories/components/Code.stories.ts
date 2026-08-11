/* The code block.

   The markup lives in `src/components/code.ts`. With the diff it shares the
   one permission the rest of the system does not have: status colour may fill
   a whole line — `--status-ok` on a result, the tint on a diff row.
   Everywhere else status colour marks a badge or a result row and never
   becomes page furniture.

   This file generates `components/code/code.card.html`, which shows the block
   and the diff together because that permission is what it documents. The
   diff has its own page in `Diff.stories.ts`; the change it draws is imported
   from there rather than written twice. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../src/components/code.ts';
import '../../src/components/diff.ts';
import '../../src/components/icon.ts';
import { type CodeBlockProps } from '../../src/components/code.ts';
import { type DiffLine } from '../../src/components/diff.ts';
import { DIFF } from './Diff.stories.ts';
import { dsCard, part, px, spec, specCap } from '../lib/specimen.ts';

const BASH: CodeBlockProps = {
  lang: 'bash',
  copy: true,
  body: [
    { kind: 'comment', text: '# standalone: clone, install once' },
    { kind: 'shell', text: 'composer install' },
    { kind: 'ok', text: 'published 9 task skills to', code: '.agents/skills' },
  ],
};

const sdsCode = ({ lang, body, copy }: CodeBlockProps) =>
  html`<sds-code code-lang="${lang ?? ''}" ?copy="${copy ?? false}" .body="${body}"></sds-code>`;

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
       without a murmur. The type stays open — a fence can say anything — but
       the control shows what is stood behind. */
    lang: {
      control: 'select',
      options: [
        'bash', 'css', 'diff', 'html', 'javascript', 'json', 'markdown',
        'php', 'sql', 'text', 'twig', 'typescript', 'typoscript', 'xml', 'yaml',
      ],
    },
    copy: { control: 'boolean' },
  },
  args: BASH,
  parameters: {
    dsCard: dsCard({
      path: 'components/code/code.card.html',
      name: 'Code block & diff',
      subtitle: 'The one place status colour is allowed to fill a whole line',
      viewport: '700x360',
    }),
  },
};

export default meta;
type Story = StoryObj<CodeBlockProps>;

/** The `$` prompt carries the accent — one of exactly three places in the
    whole system where `--accent` appears. */
export const Shell: Story = { args: BASH };

/** The form a renderer uses: the body is written between the tags.

    The two paths are not interchangeable and the difference is worth knowing.
    `.body` is data the element turns into spans — a shell line, a comment, a
    result — and it renders anywhere, including the static export every
    specimen card is made by. Content between the tags is markup somebody else
    produced, here a highlighter's `<code>`, and the element frames it when it
    upgrades — including the `<code class="language-…">` a highlighter looks
    for, which the element writes from its own `lang` so the language is never
    stated twice. That one is a browser affordance: Lit's SSR renderer emits
    authored children beside the element's template rather than inside it, and
    `connectedCallback` never runs in Node to move them, so `renderStatic`
    refuses it outright rather than exporting an empty frame. */
export const FromContent: Story = {
  render: () => html`<sds-code code-lang="json" copy>${unsafeHTML(
    '{\n  "domains": ["labels", "xlf"],\n  "versions": ["12.4", "13.4", "14.3"]\n}',
  )}</sds-code>`,
};

/** The colour is the component's. A renderer that names a language and leaves
    the block in one grey has done half the job, and every surface used to
    finish it with a highlighter of its own — the same one, wired the same way,
    in each of them.

    Only the languages the system declares are registered, and the palette is
    the system's three syntax colours. A language it does not colour prints
    what was written rather than a guess. */
export const Highlighted: Story = {
  render: () => html`
    <sds-code code-lang="php" copy>&lt;?php
namespace TYPO3\CMS\Core;

// The scope a question is answered in.
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

/** The other direction: the colour arrives with the block.

    A documentation build decides the colour once, on a server, and ships HTML
    — `phpdocumentor/guides` does it with a PHP port of the same highlighter,
    so what lands here already carries `hljs-` classes. Those are the classes
    `components.css` maps, which is why the block below is painted by a
    component that did no highlighting at all.

    What it hands back is what it was given, `<code>` and all: the wrapper
    carries which line the block starts at and which lines are emphasised, and
    a highlighter that rebuilt it would drop both — along with every language
    a server knows and the thirteen registered here do not. */
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

/** A caption says what the block is, above it — where a reader meets it
    before the block rather than in the block's own chrome. Above the frame
    and inside the element: where a caption sits is the block's decision, so
    it is the block that places it, and a page that moves one moves both. */
export const Captioned: Story = {
  render: () => html`<sds-code code-lang="bash" caption="Installing as a dependency of an existing project" copy>composer require typo3/cms-core
vendor/bin/typo3 cache:flush</sds-code>`,
};

/** The same caption, written between the tags.

    Which is the form a renderer needs. A caption node carries markup — a
    literal, a link, an emphasis — and the attribute above is a string; and a
    page that has not run the script yet has an attribute that says nothing
    and markup that already reads. So it is written in the class the component
    itself emits, and the component keeps it: out of the block, out of the
    highlighting, and off the clipboard.

    This is what `guides-theme` emits, where the colour arrives with the block
    as well. */
export const CaptionedFromContent: Story = {
  render: () => html`<sds-code code-lang="bash" copy><div class="sds-code__caption">Installing as a dependency of an existing <code>composer.json</code></div>composer require typo3/cms-core
vendor/bin/typo3 cache:flush</sds-code>`,
};

export const specimenHtml = (): string =>
  spec(
    [
      part(sdsCode(BASH)),
      part(sdsDiff('KNOWLEDGE/HINTS/LABELS.JSON', DIFF)),
      specCap(
        `CODE ${px(13, 'PX')} / 1.9 · DIFF ${px(13, 'PX')} / 1.75 · DIFF ROWS TINT AT 14% · ` +
          'NO LINE NUMBERS UNLESS THEY ARE REFERENCED',
      ),
    ],
    { gap: '14px' },
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
