/* sds-empty — a boundary, drawn as an answer.

   Never "no results". An answer carries its source, its bounds and what it
   leaves out, and an empty one is still an answer — a page that only says
   "nothing found" cannot be told from a failure. So the parts are properties:
   what was asked and answered, what it does not cover, what to do instead.

   `quiet` is an empty result, and nothing about that is an event. `boundary`
   says the question is outside what this server covers, which is a deliberate
   answer. Neither takes a status colour: nothing failed. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import './link.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type EmptyKind = 'quiet' | 'boundary';

export interface EmptyProps {
  kind?: EmptyKind;
  /** What happened, as a fact. Not a category — "No icon matches “dashbord”",
      never "No results". */
  heading: string;
  /** Which source was asked, what it answered, and what it does not cover. */
  body: string | TemplateResult;
  /** The glyph. `boundary` carries `actions-info-circle` on its own; anything
      else says what was searched. */
  icon?: IconId;
  /** The nearest real thing to do next. A boundary usually has none, which is
      why it is optional — an offer that leads nowhere is worse than silence. */
  action?: string;
  /** Where the offer goes. Left empty it is a button that says `sds-action`
      instead: undoing a filter changes this page rather than leaving it, and a
      link to nowhere is the control readers learn to stop pressing. */
  href?: string;
  /** The source and scope, in the label register, where naming them in the
      body would make the sentence about the machine. */
  meta?: string;
  /** Layout for the box, since the host is `display: contents`. */
  boxStyle?: string;
}

export class SdsEmpty extends SdsElement {
  private static readonly KIND_ICON: Readonly<Record<EmptyKind, IconId>> = {
    quiet: 'actions-search',
    boundary: 'actions-info-circle',
  };

  static override properties = {
    kind: { type: String, reflect: true },
    heading: { type: String },
    body: { type: String },
    icon: { type: String },
    action: { type: String },
    href: { type: String },
    meta: { type: String },
    boxStyle: { type: String, attribute: 'box-style' },
  };

  declare kind: EmptyKind;
  declare heading: string;
  declare body: string | TemplateResult;
  declare icon?: IconId;
  declare action: string;
  declare href: string;
  declare meta: string;
  declare boxStyle: string;

  constructor() {
    super();
    this.kind = 'quiet';
    this.heading = '';
    this.body = '';
    this.action = '';
    this.href = '';
    this.meta = '';
    this.boxStyle = '';
  }

  /** Pressed, where the offer changes this page. Composed, because the button
      is inside the element a consumer listens on. */
  private act(): void {
    this.dispatchEvent(new CustomEvent('sds-action', { bubbles: true, composed: true }));
  }

  protected override render(): TemplateResult {
    const glyph = this.icon ?? SdsEmpty.KIND_ICON[this.kind];
    const cls = `sds-empty${this.kind === 'boundary' ? ' sds-empty--boundary' : ''}`;
    /* The arrow follows the label rather than leading it — `sds-link` decides
       that from the glyph, because it is a fact about the glyph. */
    const offer = this.href
      ? html`<sds-link label="${this.action}" href="${this.href}" icon="actions-arrow-right"></sds-link>`
      : html`<button class="sds-link" type="button" @click="${this.act}">${this.action} <sds-icon name="actions-arrow-right"></sds-icon></button>`;
    return html`<div class="${cls}" style="${this.boxStyle}">
  <span class="sds-empty__icon"><sds-icon name="${glyph}" size="24"></sds-icon></span>
  <div class="sds-empty__title">${this.heading}</div>
  <div class="sds-empty__body">${this.body}</div>
  ${this.action ? offer : ''}
  ${this.meta ? html`<span class="sds-label">${this.meta}</span>` : ''}
</div>`;
  }
}

define('sds-empty', SdsEmpty);
