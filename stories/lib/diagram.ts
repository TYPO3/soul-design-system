/* A diagram in a story: the element a page uses, with its text.

   The text stands between the tags, as a page writes it, so the source a
   story shows is the text an author copies. `<sds-diagram>` draws it inline
   in the tokens of the story's mode. A text the grammar refuses draws the
   refusal in the place of the drawing. */

import { html, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/diagram.ts';
import type { DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { DIAGRAM_SOURCES } from '../../packages/frontend/src/components/diagrams.svg.generated.ts';

const escape = (s: string): string => s.replace(/&/g, '&amp;').replace(/<(?=[A-Za-z/!?])/g, '&lt;');

/** The options of the element, as the controls of every story of a drawing. */
export const diagramArgTypes = {
  source: { control: 'text' },
  canvas: { control: 'text' },
  margin: { control: 'text' },
  room: { control: 'text' },
  name: { control: 'text' },
  zoomable: { control: 'boolean' },
} as const;

/** The element alone, from a story's arguments. A slide's room sets the
    width the drawing stands at, because a slide draws at its own pixels. */
export const diagramElement = ({ source = '', room, name, zoomable, canvas, margin }: DiagramProps): TemplateResult => {
  const attrs = [room ? ` room="${room}"` : '', name ? ` name="${name}"` : '', canvas ? ` canvas="${canvas}"` : '', margin ? ` margin="${margin}"` : '', zoomable ? ' zoomable' : ''].join('');
  const element = html`${unsafeHTML(`<sds-diagram${attrs}>\n${escape(source.trim())}\n</sds-diagram>`)}`;
  const width = Number((room ?? '').split(',')[0]);
  return width > 0 ? html`<div style="width:${width}px">${element}</div>` : element;
};

/** A drawing this system ships, by its name, the way a page writes it: the
    text of its `.diagram` file between the tags. Zoomable in a page; in a
    slide's region, where `slot` names one, or in a row, it is not. */
export const shipped = (name: string, { slot, zoomable = !slot }: { slot?: string; zoomable?: boolean } = {}): TemplateResult => {
  const source = DIAGRAM_SOURCES[name];
  if (!source) throw new Error(`${name}: no .diagram text in assets/diagrams/ — run \`make diagrams\``);
  return html`<sds-diagram slot="${slot ?? nothing}" name="${name}" ?zoomable="${zoomable}">${`\n${source.trim()}\n`}</sds-diagram>`;
};
