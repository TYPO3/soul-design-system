/* sds-diagram — a drawing from the text that describes it, and only that.

   The text stands between the tags, as a `.diagram` file holds it, or in
   `source` from a script. The element draws it inline, so the colours are the page's
   tokens and the drawing turns with the mode. The faces are the page's too.
   A frame and a caption are the figure's: put the element in an
   `sds-figure`. Node renders it before a page ships. A text the grammar
   refuses draws the refusal, with the line it names. */

import { html, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import './lightbox.ts';
import { type DiagramSpec, draw } from '../lib/diagram/draw.ts';
import { parse } from '../lib/diagram/parse.ts';
import { define, SdsElement } from '../lib/element.ts';
import { zoom } from '../lib/zoom.ts';

export interface DiagramProps {
  /** The text of the drawing, in the syntax of a `.diagram` file, for a
      script. A page writes the text between the tags. */
  source?: string;
  /** The prefix of the ids inside the drawing. Two drawings on one page
      with the same text need two names. */
  name?: string;
  /** The room of a slide, `width,height` in its frame's pixels. The text's
      own `slide=` holds otherwise. */
  room?: string;
  /** A press on the drawing opens it at the size of the window, in the
      page's tokens. For a drawing too dense to read in the column. */
  zoomable?: boolean;
}

/* A name from the text itself, so the browser and the prerender give the
   same drawing the same ids. */
const named = (source: string): string => {
  let hash = 5381;
  for (let i = 0; i < source.length; i++) hash = ((hash << 5) + hash + source.charCodeAt(i)) >>> 0;
  return `diagram-${hash.toString(36)}`;
};

/* The indent the whole text shares, gone, so the text can stand indented
   in a page and still read from its first column. */
const dedent = (text: string): string => {
  const lines = text.replace(/\t/g, '  ').split('\n');
  const indents = lines.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(cut)).join('\n').trim();
};

const unescape = (text: string): string =>
  text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

const slideRoom = (room: string): { width: number; height: number } | undefined => {
  const [width = 0, height = 0] = room.split(',').map(Number);
  return width > 0 && height > 0 ? { width, height } : undefined;
};

export class SdsDiagram extends SdsElement {
  static override properties = {
    source: { type: String },
    name: { type: String },
    room: { type: String },
    lent: { type: String, reflect: true },
    zoomable: { type: Boolean, reflect: true },
  };

  declare source: string;
  declare name: string;
  declare room: string;
  /** The room a slide lends the drawing, where the author states none. The
      slide sets it. It stands in the markup, so a prerendered page starts
      with the room it drew for and draws nothing anew. */
  declare lent?: string;
  declare zoomable: boolean;

  /* The text between the tags, taken before Lit renders over it. */
  private written = '';

  /** Lend the drawing a room, `width,height`. A text too dense for it draws
      as on a page instead, and the slide shrinks it as a picture. A room a
      pixel or two off the one it has is the same room, measured again. */
  lend(room: string): boolean {
    const [w = 0, h = 0] = room.split(',').map(Number);
    const [was, had] = (this.lent ?? '').split(',').map(Number);
    if (was !== undefined && had !== undefined && Math.abs(w - was) <= 2 && Math.abs(h - had) <= 2) return false;
    this.lent = room;
    return true;
  }

  /** The room the text needs in the one a slide offers: that room, or the
      same shape larger. A row lends each of its drawings the largest, so
      they share one scale. Reads only. */
  reach(room: string): string {
    try {
      const source = this.text;
      const grown = this.fits(parse(source), this.name || named(source), room);
      return grown ? `${grown.width},${grown.height}` : room;
    } catch {
      return room;
    }
  }

  constructor() {
    super();
    this.source = '';
    this.name = '';
    this.room = '';
    this.zoomable = false;
  }

  override connectedCallback(): void {
    const text = this.lifted()
      .filter((node) => node.nodeType !== 8)
      .map((node) => node.textContent ?? '')
      .join('');
    if (text.trim()) this.written = text;
    super.connectedCallback();
  }

  /** The text to draw: `source`, else what stands between the tags, else
      the same under a prerender, where Node hands it over as markup. */
  private get text(): string {
    if (this.source) return this.source;
    const raw = this.written || unescape((this.authored ?? '').replace(/<[^>]*>/g, ''));
    return dedent(raw);
  }

  protected override render(): TemplateResult {
    const source = this.text;
    const name = this.name || named(source);
    try {
      const spec = parse(source);
      const slide = slideRoom(this.room) ?? (this.lent && !spec.slide ? this.fits(spec, name, this.lent) : undefined);
      const { svg, width } = draw(spec, slide ? { name, slide } : { name });
      /* The drawn width, so the stylesheet stops the shrink where its type
         gets too small. A slide scales as a whole, so it has none. */
      const drawn = slide || spec.slide ? nothing : `--sds-diagram-width: ${width}px`;
      if (!this.zoomable) return html`<div class="sds-diagram" style="${drawn}" tabindex="${drawn === nothing ? nothing : '0'}">${unsafeHTML(svg)}</div>`;
      /* The viewer's drawing needs ids of its own. */
      const large = draw(spec, slide ? { name: `${name}-large`, slide } : { name: `${name}-large` });
      const { trigger, viewer } = zoom(this, html`${unsafeHTML(svg)}`, { src: '', alt: spec.title, caption: spec.title, content: html`${unsafeHTML(large.svg)}` });
      return html`<div class="sds-diagram" style="${drawn}">${trigger}${viewer}</div>`;
    } catch (error) {
      /* The ids' prefix says nothing to the author, the part it names does. */
      const message = (error as Error).message.replace(`${name}: `, '');
      return html`<p class="sds-diagram__error" role="alert">${message}</p>`;
    }
  }

  /* The lent room, or the same shape up to twice as large, where the
     engine draws the text in it. The slide shrinks a larger one whole. */
  private fits(spec: DiagramSpec, name: string, lent: string): { width: number; height: number } | undefined {
    const room = slideRoom(lent);
    if (!room) return undefined;
    for (const scale of [1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.5, 1.6, 1.7, 1.8, 2]) {
      const tried = { width: Math.round(room.width * scale), height: Math.round(room.height * scale) };
      try {
        draw(spec, { name, slide: tried });
        return tried;
      } catch {
        /* The next size. */
      }
    }
    return undefined;
  }
}

define('sds-diagram', SdsDiagram);
