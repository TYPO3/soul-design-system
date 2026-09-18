/* A statement.

   One sentence, centred, and where it is from in the small register under it.
   A statement has no foot. The mark and the count are two more things on a
   slide that says one. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';
import { slide } from '../lib/deck.ts';

export function statementSlide({ flat = false }: PageMode = {}): TemplateResult {
  return slide(
    {
      kind: 'statement',
      heading: 'A shadow says a surface has left the page, and nothing else says it.',
      note: 'Non-negotiable · docs/design-system/index.rst',
    },
    undefined,
    { flat },
  );
}

const meta: Meta = {
  title: 'Slides/Statement',
  excludeStories: ['statementSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-statement.html',
      section: 'Slides',
      title: 'Statement',
      subtitle: 'One sentence, centred, and its source under it',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Statement',
  render: () => statementSlide(),
};

export const screenHtml = (): string => part(statementSlide({ flat: true }));
