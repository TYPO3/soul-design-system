/* Code block and diff.

   The markup lives in `src/components/code.ts`. This is the one place status colour is
   allowed to fill a whole line: `--status-ok` on a result, the tint on a
   diff row. Everywhere else status colour marks a badge or a result row and
   never becomes page furniture. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../src/components/code.ts';
import { codeMeta, comment, ok, shell, type CodeBlockProps, type DiffLine } from '../src/components/code.ts';
import '../src/components/icon.ts';
import { dsCard, part, px, spec, specCap } from './lib/specimen.ts';

const COPY = codeMeta(html`<sds-icon name="actions-duplicate"></sds-icon>copy`);

const BASH: CodeBlockProps = {
  lang: 'BASH',
  action: COPY,
  body: [
    comment('# standalone: clone, install once'),
    shell('composer install'),
    ok('published 9 task skills to', '.agents/skills'),
  ],
};

const DIFF: readonly DiffLine[] = [
  { kind: 'context', text: '"domains": ["labels", "xlf"],' },
  { kind: 'del', text: '"versions": ["12.4"]' },
  { kind: 'add', text: '"versions": ["12.4", "13.4", "14.3"]' },
  { kind: 'context', text: '}' },
];

const sdsCode = ({ lang, action, body }: CodeBlockProps) =>
  html`<sds-code lang="${lang ?? ''}" .action="${action}" .body="${body}"></sds-code>`;

const sdsDiff = (path: string, body: readonly DiffLine[]) =>
  html`<sds-diff path="${path}" .body="${body}"></sds-diff>`;

const meta: Meta<CodeBlockProps> = {
  title: 'Components/Code',
  tags: ['autodocs'],
  /* Storybook treats every export as a story. These are the helpers the
     card generator and the sibling stories import. */
  excludeStories: ['specimenHtml'],
  render: (args) => sdsCode(args),
  argTypes: { lang: { control: 'text' } },
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
