/* sds-note — what an answer carries besides the answer.

   Its source, the versions it holds for, and what it leaves out. That is the
   shape: a glyph in the status colour, a title that states the fact, and a
   bounded line of prose under it saying what the fact costs the reader.

   The tones are not four decorations. `ok` names where an answer came from,
   `warn` is a degraded but usable one, `error` is none, and `info` is a fact
   about the surface rather than about a result — and only `warn` tints the
   whole block, because a page of results whose every note is filled reads as
   an alarm about the page.

   A note is one of the few things in this system whose glyph is not optional:
   the tone is a colour, and a colour alone leaves the meaning to anyone who
   can tell the four apart. Same reasoning as `sds-badge`, and the same
   mapping, so a badge and a note about the same result agree.

   `heading` rather than `title`: `title` is a global HTML attribute, and a
   reactive property by that name would set the browser's tooltip on every
   note in the page. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type NoteTone = 'info' | 'ok' | 'warn' | 'error';

export interface NoteProps {
  tone?: NoteTone;
  /** The fact, in a line. Sentence case, and never a category name. */
  heading: string;
  /** What it means for the reader. A template where it names a path or a
      command, which sets in mono inside the sentence. */
  body: string | TemplateResult;
  /** An explicit glyph, where the tone's own says less than the note does. */
  icon?: IconId;
}

export class SdsNote extends SdsElement {
  /** The glyph each tone carries. */
  private static readonly TONE_ICON: Readonly<Record<NoteTone, IconId>> = {
    info: 'actions-info-circle',
    ok: 'actions-check-circle',
    warn: 'actions-exclamation-triangle',
    error: 'actions-exclamation-circle',
  };

  static override properties = {
    tone: { type: String, reflect: true },
    heading: { type: String },
    body: { type: String },
    icon: { type: String },
  };

  declare tone: NoteTone;
  declare heading: string;
  declare body: string | TemplateResult;
  declare icon?: IconId;

  constructor() {
    super();
    this.tone = 'info';
    this.heading = '';
    this.body = '';
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-note sds-note--${this.tone}">
  <span class="sds-note__icon"><sds-icon name="${this.icon ?? SdsNote.TONE_ICON[this.tone]}"></sds-icon></span>
  <div>
    <div class="sds-note__title">${this.heading}</div>
    <div class="sds-note__body">${this.body}</div>
  </div>
</div>`;
  }
}

define('sds-note', SdsNote);
