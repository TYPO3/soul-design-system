/* A code slide.

   The block is `sds-code`, coloured by its own grammar, on the sunken plane.
   The prompt is the one accent on the slide. Beside it, the sentence the
   block proves, on a plain plane so the two read as one row. No copy button:
   nobody copies from a wall. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/code.ts';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/grid.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid, type PageMode } from '../lib/page.ts';
import { slide } from '../lib/deck.ts';

const SOURCE = `<sds-code code-lang="bash">
  <code>make verify ARGS=classes</code>
</sds-code>`;

export function codeSlide({ flat = false }: PageMode = {}): TemplateResult {
  return slide(
    { heading: 'Address a component, never rebuild one', number: '06' },
    grid(
      [
        html`<sds-code code-lang="html" source="${SOURCE}"></sds-code>`,
        html`<sds-surface
          plane="plain"
          heading="The element first"
          body="The classes are the fallback for a surface with no JavaScript, not the front door. Everything that fits in a string is a property. Between the tags goes only content."
        ></sds-surface>`,
      ],
      { flat },
    ),
    { flat },
  );
}

const meta: Meta = {
  title: 'Slides/Code',
  excludeStories: ['codeSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-code.html',
      section: 'Slides',
      title: 'Code',
      subtitle: 'A block coloured by its grammar on the sunken plane, and the sentence it proves beside it',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Code',
  render: () => codeSlide(),
};

export const screenHtml = (): string => part(codeSlide({ flat: true }));
