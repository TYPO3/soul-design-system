/* sds-lightbox — a drawing at its own size.

   The behaviour is the platform's `<dialog>`, as `sds-dialog` uses it. The
   surface is not the modal's: a modal stops at `--measure-modal` because a
   reader reads what is inside one, and looks at a drawing.

     <sds-button for="the-drawing">Open the drawing</sds-button>
     <sds-lightbox id="the-drawing" src="…" alt="…"></sds-lightbox>

   `sds-figure` needs none of that: it owns the viewer and calls `show()`. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
/* Type-only, and deliberately so: hearing a command must not drag the element
   that sends one into every page that opens a drawing. */
import type { SdsCommand } from './button.ts';
import { art, exported } from '../lib/art.ts';
import { hold } from '../lib/hold.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface LightboxProps {
  /** The drawing on show. Reached with `zoomable` on a figure or an image
      rather than written by hand. */
  src: string;
  /** What it shows, for a reader who does not get it. */
  alt: string;
  /** What the drawing claims, in the head — the same sentence the figure
      carries, so opening it is not a change of subject. */
  caption?: string;
  /** A drawing in place of the file, for a script: an `sds-diagram` with
      `zoomable` gives its own. It stays in the page's tokens. A function
      draws it only while the viewer stands open. */
  content?: unknown;
  /** If it stands over the page. It is the modal’s behaviour around a
      drawing rather than a question, so it stops at no measure. */
  open?: boolean;
}

/* One press of + or -, the wheel's rate, the bounds, and one arrow key. */
const STEP = 1.25;
const WHEEL = 0.0015;
const LEAST = 0.1;
const MOST = 8;
const PAN = 48;

export class SdsLightbox extends SdsElement {
  static override properties = {
    src: { type: String },
    alt: { type: String },
    caption: { type: String },
    content: { attribute: false },
    open: { type: Boolean, reflect: true },
  };

  declare src: string;
  declare alt: string;
  declare caption: string;
  declare content: unknown;
  declare open: boolean;

  constructor() {
    super();
    this.src = '';
    this.alt = '';
    this.caption = '';
    this.open = false;
  }

  private get dialog(): HTMLDialogElement | null {
    return this.querySelector('dialog');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('sds-command', this.onCommand as EventListener);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('sds-command', this.onCommand as EventListener);
    this.#release?.();
    this.#release = undefined;
    this.watcher?.disconnect();
    this.watcher = null;
    super.disconnectedCallback();
  }

  /* What a button pointed at this one asks for. `sds-figure` opens its own
     viewer with `show()`, because it owns it. Anything else names this
     element by id and sends the command. So markup opens a drawing rather
     than a script that has to find both ends. */
  private readonly onCommand = (event: CustomEvent<SdsCommand>): void => {
    const command = event.detail?.command ?? 'show';
    if (command === 'close') this.close();
    else if (command === 'toggle') (this.open ? this.close() : this.show());
    else this.show();
  };

  show(): void {
    this.open = true;
    void this.updateComplete.then(() => {
      const el = this.dialog;
      if (el && !el.open) el.showModal();
      this.watch();
      void this.ready().then(() => this.fit());
    });
  }

  close(): void {
    this.dialog?.close();
    this.open = false;
  }

  /* The view: how large the drawing stands and where. It opens fitted, and
     stays fitted when the window changes, until the reader zooms or moves. */
  private scale = 1;
  private x = 0;
  private y = 0;
  private fitted = true;
  private watcher: ResizeObserver | null = null;
  private drag: { id: number; x: number; y: number; ox: number; oy: number } | null = null;

  private get stage(): HTMLElement | null {
    return this.querySelector('.sds-lightbox__art');
  }

  private get canvas(): HTMLElement | null {
    return this.querySelector('.sds-lightbox__canvas');
  }

  /** The drawing's own size: the viewBox of an inline drawing, or the
      pixels of a file. */
  private natural(): { width: number; height: number; raster: boolean } | null {
    const picture = this.canvas?.firstElementChild;
    if (picture instanceof SVGSVGElement) {
      const box = picture.viewBox.baseVal;
      const width = box?.width || Number(picture.getAttribute('width')) || 0;
      const height = box?.height || Number(picture.getAttribute('height')) || 0;
      return width && height ? { width, height, raster: false } : null;
    }
    if (picture instanceof HTMLImageElement && picture.naturalWidth) {
      return { width: picture.naturalWidth, height: picture.naturalHeight, raster: !/\.svg(\?|#|$)/.test(picture.src) };
    }
    return null;
  }

  /** A file has its size once it has loaded. */
  private async ready(): Promise<void> {
    const picture = this.canvas?.firstElementChild;
    if (picture instanceof HTMLImageElement && !picture.complete) {
      /* A file that fails ends the wait too, and leaves no listener. */
      await new Promise((done) => {
        const stop = new AbortController();
        const end = (): void => { stop.abort(); done(undefined); };
        picture.addEventListener('load', end, { signal: stop.signal });
        picture.addEventListener('error', end, { signal: stop.signal });
      });
    }
  }

  private watch(): void {
    if (this.watcher || !this.stage) return;
    this.watcher = new ResizeObserver(() => this.fitted && this.fit());
    this.watcher.observe(this.stage);
  }

  private apply(): void {
    const canvas = this.canvas;
    const size = this.natural();
    if (!canvas || !size) return;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    canvas.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
    const shown = this.querySelector('.sds-lightbox__scale');
    if (shown) shown.textContent = `${Math.round(this.scale * 100)} %`;
  }

  /** The whole drawing in the stage, in the middle. A photograph never
      grows past its own pixels, a drawing does. */
  fit(): void {
    const stage = this.stage;
    const size = this.natural();
    if (!stage || !size) return;
    const room = parseFloat(getComputedStyle(stage).paddingInlineStart) || 0;
    const across = Math.max(1, stage.clientWidth - room * 2);
    const down = Math.max(1, stage.clientHeight - room * 2);
    const scale = Math.min(across / size.width, down / size.height);
    this.scale = size.raster ? Math.min(scale, 1) : scale;
    this.x = (stage.clientWidth - size.width * this.scale) / 2;
    this.y = (stage.clientHeight - size.height * this.scale) / 2;
    this.fitted = true;
    this.apply();
  }

  /** Zoom by a factor, about a point of the stage that stays put. */
  zoom(factor: number, at?: { x: number; y: number }): void {
    const stage = this.stage;
    if (!stage || !this.natural()) return;
    const point = at ?? { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
    const scale = Math.min(MOST, Math.max(LEAST, this.scale * factor));
    this.x = point.x - (point.x - this.x) * (scale / this.scale);
    this.y = point.y - (point.y - this.y) * (scale / this.scale);
    this.scale = scale;
    this.fitted = false;
    this.apply();
  }

  private move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
    this.fitted = false;
    this.apply();
  }

  private readonly onWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const box = this.stage!.getBoundingClientRect();
    this.zoom(Math.exp(-event.deltaY * WHEEL), { x: event.clientX - box.left, y: event.clientY - box.top });
  };

  private readonly onDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    this.stage!.setPointerCapture(event.pointerId);
    this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, ox: this.x, oy: this.y };
  };

  private readonly onMove = (event: PointerEvent): void => {
    if (!this.drag || event.pointerId !== this.drag.id) return;
    this.x = this.drag.ox + event.clientX - this.drag.x;
    this.y = this.drag.oy + event.clientY - this.drag.y;
    this.fitted = false;
    this.apply();
  };

  private readonly onUp = (event: PointerEvent): void => {
    if (this.drag?.id === event.pointerId) this.drag = null;
  };

  private readonly onKey = (event: KeyboardEvent): void => {
    const keys: Record<string, () => void> = {
      '+': () => this.zoom(STEP),
      '=': () => this.zoom(STEP),
      '-': () => this.zoom(1 / STEP),
      '0': () => this.fit(),
      ArrowLeft: () => this.move(PAN, 0),
      ArrowRight: () => this.move(-PAN, 0),
      ArrowUp: () => this.move(0, PAN),
      ArrowDown: () => this.move(0, -PAN),
    };
    const act = keys[event.key];
    if (!act) return;
    event.preventDefault();
    act();
  };

  /** Fitted, the drawing at its own size; otherwise fitted again. */
  private readonly onDouble = (event: MouseEvent): void => {
    if (!this.fitted) return this.fit();
    const box = this.stage!.getBoundingClientRect();
    this.zoom(1 / this.scale, { x: event.clientX - box.left, y: event.clientY - box.top });
  };

  /* The page stays still behind an open viewer. */
  #release?: () => void;

  protected override updated(): void {
    if (this.open && this.isConnected) this.#release ??= hold('modal');
    else if (this.#release) {
      this.#release();
      this.#release = undefined;
    }
    const el = this.dialog;
    /* `showModal()` throws on an element that is not in the document yet, and
       an exception here breaks the update cycle and renders nothing at all. */
    if (!el || !this.isConnected) return;
    /* A closed viewer has no stage, and the next one is a new box. */
    if (!this.open) {
      this.watcher?.disconnect();
      this.watcher = null;
    }
    try {
      if (this.open && !el.open) el.showModal();
      if (!this.open && el.open) el.close();
    } catch {
      if (this.open) el.setAttribute('open', '');
    }
  }

  /* What the canvas holds. Content handed over as a function draws only
     while the viewer stands open, so a closed viewer costs nothing. */
  private drawn(): unknown {
    if (typeof this.content === 'function') return this.open ? (this.content as () => unknown)() : nothing;
    return this.content ?? art(this.src, this.alt);
  }

  protected override render(): TemplateResult {
    return html`<dialog
      class="sds-lightbox"
      aria-label="${this.caption || this.alt}"
      @close="${() => {
        this.open = false;
      }}"
    >${this.open ? this.body() : nothing}</dialog>`;
  }

  /* What the viewer shows, drawn only while it stands open. A page of
     zoomable pictures carries one empty dialog for each. */
  private body(): TemplateResult {
    return html`
  <div class="sds-modal__head">
    <span class="sds-modal__title">${this.caption || this.alt}</span>
    <div class="sds-lightbox__tools">
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Zoom out" @click="${() => this.zoom(1 / STEP)}"><sds-icon name="actions-minus"></sds-icon></button>
      <output class="sds-lightbox__scale" aria-live="polite">100 %</output>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Zoom in" @click="${() => this.zoom(STEP)}"><sds-icon name="actions-plus"></sds-icon></button>
      <button class="sds-btn sds-btn--ghost sds-btn--sm" title="Fit the whole drawing" @click="${() => this.fit()}">Fit</button>
      <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon sds-modal__close" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
    </div>
  </div>
  <div
    class="sds-lightbox__art${exported(this.src) ? ' sds-lightbox__art--exported' : ''}"
    tabindex="0"
    aria-label="The drawing. Drag or use the arrow keys to move it, the wheel or plus and minus to zoom, 0 to fit."
    @wheel="${this.onWheel}"
    @pointerdown="${this.onDown}"
    @pointermove="${this.onMove}"
    @pointerup="${this.onUp}"
    @pointercancel="${this.onUp}"
    @keydown="${this.onKey}"
    @dblclick="${this.onDouble}"
  >
    <div class="sds-lightbox__canvas">${this.drawn()}</div>
  </div>`;
  }
}

define('sds-lightbox', SdsLightbox);
