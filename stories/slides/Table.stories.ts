/* A table.

   `sds-table` at the page's density, which at twice the size is a room's.
   The name column is the machine's and sets in mono; the rest is a sentence
   a reader reads. Hairlines rule it, and no cell has a fill. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/table.ts';
import { type Column, type Row } from '../../packages/frontend/src/components/table.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';
import { slide } from '../lib/deck.ts';

const COLUMNS: readonly Column[] = [{ head: 'Check', cls: 'sds-td-name' }, { head: 'What it holds' }];

const ROWS: readonly Row[] = [
  { cells: ['classes', 'every class in use has a definition in the layer that can load it'] },
  { cells: ['values', 'every figure beside a token is that token’s'] },
  { cells: ['names', 'every sds- name a document writes exists'] },
  { cells: ['ssr', 'every element renders outside a browser'] },
  { cells: ['prose', 'every text against ASD-STE100 and the terse rule'] },
];

export function tableSlide({ flat = false }: PageMode = {}): TemplateResult {
  return slide(
    { heading: 'What the gate holds', number: '07' },
    html`<sds-table .columns="${COLUMNS}" .rows="${ROWS}"></sds-table>`,
    { flat },
  );
}

const meta: Meta = {
  title: 'Slides/Table',
  excludeStories: ['tableSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-table.html',
      section: 'Slides',
      title: 'Table',
      subtitle: 'Five checks by name, the name in mono, the rule in a sentence',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Table',
  render: () => tableSlide(),
};

export const screenHtml = (): string => part(tableSlide({ flat: true }));
