/* Two speakers.

   Who stands in front of the room, where two do. A person is `sds-byline`:
   the monogram, the name, what they are to the subject, and the line under
   it. A plain plane per speaker, with the one sentence that says what they
   answer for. One speaker takes `Slides/Speaker`, with the room for a
   picture. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/byline.ts';
import '../../packages/frontend/src/components/grid.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid } from '../lib/page.ts';
import { slide, type DeckMode } from '../lib/deck.ts';

const SPEAKERS = [
  {
    label: 'Speaker 01',
    name: 'Benjamin Kott',
    initials: 'BK',
    as: 'maintainer',
    meta: 'Soul Design System',
    body: 'Answers for the tokens, the elements and the gate that holds them together.',
  },
  {
    label: 'Speaker 02',
    name: 'Jonas Riis',
    initials: 'JR',
    as: 'lead integrator',
    meta: 'Nordlys Digital',
    body: 'Answers for the first project that shipped on it, and for what it lacked.',
  },
];

export function speakersSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    { heading: 'Who is speaking', number: '02' },
    grid(
      SPEAKERS.map(
        (one) => html`<sds-surface
          plane="plain"
          label="${one.label}"
          .body="${html`<sds-byline name="${one.name}" initials="${one.initials}" as="${one.as}" meta="${one.meta}"></sds-byline>
            <p>${one.body}</p>`}"
        ></sds-surface>`,
      ),
      { flat },
    ),
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Speakers',
  excludeStories: ['speakersSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-speakers.html',
      section: 'Slides',
      title: 'Speakers',
      subtitle: 'Two in front of the room: a byline per speaker, and what each answers for',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Speakers',
  render: () => speakersSlide(),
};

export const screenHtml = (): string => part(speakersSlide({ flat: true }));
