/* A flow.

   Work with an order is `sds-steps`, on a slide as on a page: story, card,
   page, down one rail. A drawing of three boxes and two arrows says the same
   thing and carries no number, so the element is the drawing. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/steps.ts';
import { type Step } from '../../packages/frontend/src/components/steps.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';
import { slide } from '../lib/deck.ts';

const STEPS: readonly Step[] = [
  { heading: 'The story', body: 'Under stories/. The one place somebody writes a specimen.' },
  { heading: 'The card', body: 'Under specimens/. A task generates it, and the next generate reverts an edit by hand.' },
  { heading: 'The page', body: 'Under docs/. It embeds the same card the design system photographs into its sections.' },
];

export function flowSlide({ flat = false }: PageMode = {}): TemplateResult {
  return slide(
    { heading: 'Truth runs story → card → page', number: '04' },
    html`<sds-steps .steps="${STEPS}"></sds-steps>`,
    { flat },
  );
}

const meta: Meta = {
  title: 'Slides/Flow',
  excludeStories: ['flowSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-flow.html',
      section: 'Slides',
      title: 'Flow',
      subtitle: 'Work with an order: three stops down one rail, numbered by the set',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Flow',
  render: () => flowSlide(),
};

export const screenHtml = (): string => part(flowSlide({ flat: true }));
