/* A diagram in a story: the element a page uses, with its text.

   The text stands between the tags, as a page writes it, so the source a
   story shows is the text an author copies. `<sds-diagram>` draws it inline
   in the tokens of the story's mode. A text the grammar refuses draws the
   refusal in the place of the drawing. Under the drawing, a press saves the
   same text as the SVG file `make diagrams` writes: the asset to keep. The
   source panel leaves that press out. */

import { html, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/button.ts';
import '../../packages/frontend/src/components/diagram.ts';
import '../../packages/frontend/src/components/icon.ts';
import type { DiagramProps } from '../../packages/frontend/src/components/diagram.ts';
import { DIAGRAM_SOURCES } from '../../packages/frontend/src/components/diagrams.svg.generated.ts';
import { diagram, parse } from '../../packages/frontend/src/lib/diagram/index.ts';

const escape = (s: string): string => s.replace(/&/g, '&amp;').replace(/<(?=[A-Za-z/!?])/g, '&lt;');

/* The file name: the name the story gives, or the title as a slug. */
const slug = (title: string): string =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'diagram';

/** The drawing as a file, faces and all. A refused text has no file. */
export const download = ({ source = '', room, name }: DiagramProps): TemplateResult | typeof nothing => {
  try {
    const spec = parse(source.trim());
    const file = name || slug(spec.title);
    const [w = 0, h = 0] = (room ?? '').split(',').map(Number);
    const { svg } = diagram(spec, w > 0 && h > 0 ? { name: file, slide: { width: w, height: h } } : { name: file });
    const href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    return html`<p data-story-chrome style="margin-block-start: var(--space-4)"><sds-button variant="secondary" size="sm" href=${href} download="${file}.svg"
      ><sds-icon name="actions-download"></sds-icon>Download SVG</sds-button
    ></p>`;
  } catch {
    return nothing;
  }
};

/** The element alone, from a story's arguments. A slide's room sets the
    width the drawing stands at, because a slide draws at its own pixels. */
export const diagramElement = ({ source = '', room, name, zoomable }: DiagramProps): TemplateResult => {
  const attrs = [room ? ` room="${room}"` : '', name ? ` name="${name}"` : '', zoomable ? ' zoomable' : ''].join('');
  const element = html`${unsafeHTML(`<sds-diagram${attrs}>\n${escape(source.trim())}\n</sds-diagram>`)}`;
  const width = Number((room ?? '').split(',')[0]);
  return width > 0 ? html`<div style="width:${width}px">${element}</div>` : element;
};

/** The element and the press that saves its file. */
export const sdsDiagram = (args: DiagramProps): TemplateResult => html`${diagramElement(args)}${download(args)}`;

/** A drawing this system ships, by its name, the way a page writes it: the
    text of its `.diagram` file between the tags. Zoomable in a page; in a
    slide's region, where `slot` names one, or in a row, it is not. */
export const shipped = (name: string, { slot, zoomable = !slot }: { slot?: string; zoomable?: boolean } = {}): TemplateResult => {
  const source = DIAGRAM_SOURCES[name];
  if (!source) throw new Error(`${name}: no .diagram text in assets/diagrams/ — run \`make diagrams\``);
  return html`<sds-diagram slot="${slot ?? nothing}" name="${name}" ?zoomable="${zoomable}">${`\n${source.trim()}\n`}</sds-diagram>`;
};
