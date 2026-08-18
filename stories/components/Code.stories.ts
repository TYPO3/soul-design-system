/* The code block.

   The markup lives in `src/components/code.ts`. With the diff it shares the one
   permission the rest of the system does not have: status colour may fill a
   whole line. Everywhere else it marks a badge and never becomes furniture.

   The card shows the block and the diff together, because that permission is
   what it documents; the change is imported from `Diff.stories.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/diff.ts';
import '../../packages/frontend/src/components/icon.ts';
import { type CodeBlockProps } from '../../packages/frontend/src/components/code.ts';
import { type DiffLine } from '../../packages/frontend/src/components/diff.ts';
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

export const sdsCode = ({ lang, body, copy }: CodeBlockProps) =>
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
        'php', 'scss', 'sql', 'text', 'twig', 'typescript', 'typoscript', 'xml', 'yaml',
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
      viewport: '700x355',
    }),
  },
};

export default meta;
type Story = StoryObj<CodeBlockProps>;

/** The `$` prompt carries the accent — one of exactly three places in the
    whole system where `--accent` appears. */
export const Shell: Story = { args: BASH };

/** The form a renderer uses: the body is written between the tags. `.body` is
    data the element turns into spans and renders anywhere, the static export
    included; content between the tags is markup somebody else produced, and the
    element frames it on upgrade. That one is a browser affordance —
    `renderStatic` refuses it rather than exporting an empty frame. */
export const FromContent: Story = {
  render: () => html`<sds-code code-lang="json" copy>${unsafeHTML(
    '{\n  "domains": ["labels", "xlf"],\n  "versions": ["12.4", "13.4", "14.3"]\n}',
  )}</sds-code>`,
};

/** The colour is the component's: a renderer that names a language and leaves
    the block in one grey has done half the job. Only the languages the system
    declares are registered, and the palette is its three syntax colours — a
    language it does not colour prints what was written rather than a guess. */
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

/** The other direction: the colour arrives with the block. A documentation
    build decides it once and ships HTML carrying `hljs-` classes, which are the
    classes `components.css` maps — so the block below is painted by a component
    that highlighted nothing. What it hands back is what it was given, `<code>`
    and all: the wrapper carries which lines are numbered and emphasised. */
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

/** The same caption, written between the tags, which is the form a renderer
    needs: a caption node carries markup where the attribute is a string, and a
    page that has not run the script has markup that already reads. Written in
    the class the component emits, so it stays out of the block, the
    highlighting and the clipboard. */
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
