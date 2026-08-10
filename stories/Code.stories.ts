/* Code block and diff.

   The markup lives in `src/components/code.ts`. This is the one place status colour is
   allowed to fill a whole line: `--status-ok` on a result, the tint on a
   diff row. Everywhere else status colour marks a badge or a result row and
   never becomes page furniture. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../src/components/code.ts';
import { type CodeBlockProps, type DiffLine } from '../src/components/code.ts';
import '../src/components/icon.ts';
import { dsCard, part, px, spec, specCap } from './lib/specimen.ts';

const BASH: CodeBlockProps = {
  lang: 'bash',
  copy: true,
  body: [
    { kind: 'comment', text: '# standalone: clone, install once' },
    { kind: 'shell', text: 'composer install' },
    { kind: 'ok', text: 'published 9 task skills to', code: '.agents/skills' },
  ],
};

const DIFF: readonly DiffLine[] = [
  { kind: 'context', text: '"domains": ["labels", "xlf"],' },
  { kind: 'del', text: '"versions": ["12.4"]' },
  { kind: 'add', text: '"versions": ["12.4", "13.4", "14.3"]' },
  { kind: 'context', text: '}' },
];

const sdsCode = ({ lang, body, copy }: CodeBlockProps) =>
  html`<sds-code lang="${lang ?? ''}" ?copy="${copy ?? false}" .body="${body}"></sds-code>`;

const sdsDiff = (path: string, body: readonly DiffLine[]) =>
  html`<sds-diff path="${path}" .body="${body}"></sds-diff>`;

const meta: Meta<CodeBlockProps> = {
  title: 'Components/Code',
  tags: ['autodocs'],
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
  render: () => html`<sds-code lang="json" copy>${unsafeHTML(
    '{\n  "domains": ["labels", "xlf"],\n  "versions": ["12.4", "13.4", "14.3"]\n}',
  )}</sds-code>`,
};

/** No line numbers unless something actually references them. */
export const Diff: Story = {
  render: () => sdsDiff('KNOWLEDGE/HINTS/LABELS.JSON', DIFF),
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
