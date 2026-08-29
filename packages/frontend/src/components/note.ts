/* sds-note — what an answer carries besides the answer.

   A glyph in the status colour, a title that states the fact, and a bounded
   line of prose saying what the fact costs the reader. The tones are not
   decoration: `ok` names where an answer came from, `warn` a degraded one,
   `error` none, `info` a fact about the surface. Only `warn` tints the block.

   The glyph is not optional, because a colour alone leaves the meaning to
   whoever can tell four apart. `heading` rather than `title`, a global
   attribute that would set a tooltip on every note. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { buttonMarkup } from './button.ts';
import { define, SdsElement } from '../lib/element.ts';

export type NoteTone = 'info' | 'ok' | 'warn' | 'error';

export interface NoteProps {
  /** What kind of aside it is. `info` is a fact worth pulling out, `ok` a
      result, `warn` something to know before acting, `error` something
      already wrong. */
  tone?: NoteTone;
  /** The fact, in a line. Sentence case, and never a category name.

      Optional, because a note whose body is a document's own prose has
      nothing to head it with — see `label`. */
  heading?: string;
  /** What it means for the reader. A template where it names a path or a
      command, which sets in mono inside the sentence.

      Or nothing, when the body is written between the tags instead. */
  body?: string | TemplateResult;
  /** An explicit glyph, where the tone's own says less than the note does. */
  icon?: IconId;
  /** The one thing to do about what the note says, as the label on a button
      after the sentence. One and no more: a message offering two answers is a
      dialog, and a message offering none is the note this was before. */
  action?: string;
  /** Where that action goes, where it is a place rather than a decision. The
      button is drawn as a link and a press announces nothing — the browser's
      own navigation is the whole of it. */
  href?: string;
  /** What the glyph says out loud, because a colour cannot be the only carrier
      of a meaning. Each tone names its own word and a caller may say a truer
      one: a renderer collapsing many admonition types onto four tones knows
      which this was, so `caution` and `danger` stay apart after both are
      `warn`. */
  label?: string;
}

export class SdsNote extends SdsElement {
  /** The glyph each tone carries. */
  private static readonly TONE_ICON: Readonly<Record<NoteTone, IconId>> = {
    info: 'actions-info-circle',
    ok: 'actions-check-circle',
    warn: 'actions-exclamation-triangle',
    error: 'actions-exclamation-circle',
  };

  /** And what it says, for a reader who is not looking at the colour. */
  private static readonly TONE_LABEL: Readonly<Record<NoteTone, string>> = {
    info: 'Note',
    ok: 'Success',
    warn: 'Warning',
    error: 'Error',
  };

  static override properties = {
    tone: { type: String, reflect: true },
    heading: { type: String },
    body: { type: String },
    icon: { type: String },
    label: { type: String },
    action: { type: String },
    href: { type: String },
  };

  declare tone: NoteTone;
  declare heading: string;
  declare body: string | TemplateResult;
  declare icon?: IconId;
  declare label: string;
  declare action: string;
  declare href: string;

  /* What a caller wrote between the tags, taken before Lit renders over it —
     see `SdsElement.lifted()` for why it is asked exactly once. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.tone = 'info';
    this.heading = '';
    this.body = '';
    this.label = '';
    this.action = '';
    this.href = '';
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  /* The press, where the action is a decision rather than a place. It carries
     the label rather than an id: a page listening above several notes reads
     what was pressed without holding a reference to any of them. A link
     navigates, and says nothing here. */
  private readonly onPress = (): void => {
    if (this.href) return;
    this.dispatchEvent(
      new CustomEvent<string>('sds-note-action', { detail: this.action, bubbles: true, composed: true }),
    );
  };

  protected override render(): TemplateResult {
    const said = this.label || SdsNote.TONE_LABEL[this.tone];
    return html`<div class="sds-note sds-note--${this.tone}">
  <span class="sds-note__icon"><sds-icon name="${this.icon ?? SdsNote.TONE_ICON[this.tone]}" label="${said}"></sds-icon></span>
  <div class="sds-note__content">
    ${this.heading ? html`<div class="sds-note__title">${this.heading}</div>` : nothing}
    <div class="sds-note__body">${this.taken ?? this.content ?? this.body}</div>
  </div>${this.action
    ? html`
  <div class="sds-note__action" @click="${this.onPress}">${buttonMarkup({ variant: 'secondary', size: 'sm', href: this.href }, this.action)}</div>`
    : nothing}
</div>`;
  }
}

define('sds-note', SdsNote);
