/* A drawing from the text that describes it.

   The markup lives in `src/components/diagram.ts`. No `parameters.dsCard`.
   The stories under `Diagrams` document each layout. This documents the
   element: the drawing alone, the refusal, and the drawing in a figure,
   which brings the frame and the caption. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/figure.ts';
import { type DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { diagramElement, download, sdsDiagram } from '../lib/diagram.ts';

/** The text of the shipped drawing `cache-key.diagram`. */
export const CACHE_KEY = `flow claim=error columns=350,560 gap=170,16
title "One slot answers two languages"
description "Two calls for the same key, one in German and one in English, both reach the same slot of the array. The German call writes the slot; the English call reads it and answers in German. The English path is drawn in the error colour."

de \`resolve('answer.empty', 'de')\` ink at=0,0
en \`resolve('answer.empty', 'en')\` ink at=0,2
group "cache[]"
  empty \`answer.empty\` value="Nothing found (de)" at=1,0
  none \`answer.none\` value="—" at=1,1
  tool \`label.tool\` value="Tool (de)" at=1,2

de -> empty "writes"
en => empty "answers in de" via=h bend=0.8
`;

const meta: Meta<DiagramProps> = {
  title: 'Components/Content/Diagram',
  tags: ['autodocs', '!dev'],
  excludeStories: ['CACHE_KEY'],
  render: (args) => sdsDiagram(args),
  argTypes: { source: { control: 'text' }, room: { control: 'text' }, name: { control: 'text' }, zoomable: { control: 'boolean' } },
  args: { source: CACHE_KEY },
};

export default meta;
type Story = StoryObj<DiagramProps>;

/** The drawing alone, inline: its colours are the page's tokens, so it
    turns with the mode. What it claims, the page around it says. */
export const Default: Story = {};

/** In a figure. The figure takes the drawing between its tags and brings
    the frame and the caption, as it does for a picture. */
export const InAFigure: Story = {
  name: 'In a figure',
  render: (args) => html`<sds-figure caption="A lookup after a language switch answers in the language before it."
    >${diagramElement(args)}</sds-figure
  >${download(args)}`,
};

/** A press on the drawing opens it at the size of the window. The large
    drawing is inline too, so it keeps the page's tokens in either mode. */
export const Zoomable: Story = {
  args: { zoomable: true },
  render: (args) => html`<sds-figure caption="A lookup after a language switch answers in the language before it."
    >${diagramElement(args)}</sds-figure
  >${download(args)}`,
};

/** A text the grammar refuses. The refusal stands in the place of the
    drawing, with the line it names, so the author sees it on the page. */
export const Refused: Story = {
  args: {
    source: `flow columns=1
title "A claim"
description "One node."
a "One" at=0,0 emphasis
b "Two" at=0,1 emphasis`,
  },
};
