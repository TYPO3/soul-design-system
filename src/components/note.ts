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
   note in the page.

   Two kinds of caller, one component — the shape `sds-code` already has. A
   product surface sets properties: a heading it composed and a line of prose
   under it. A renderer writes markup between the tags, because what a
   documentation generator puts in an admonition is paragraphs, lists and
   whole code blocks, and none of that survives being flattened into an
   attribute. The heading is optional for that caller: twelve admonition types
   arrive carrying no title at all, and printing the category name over each
   one would be exactly the "category name" this component's own heading
   forbids. The word goes to the glyph instead, where it is read out and not
   drawn. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type NoteTone = 'info' | 'ok' | 'warn' | 'error';

export interface NoteProps {
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
  /** What the glyph says out loud.

      The tone is a colour, and four colours cannot be the only carrier of a
      meaning. Each tone names its own word, and a caller may say a truer one:
      a renderer collapsing twelve admonition types onto four tones knows
      which of them this was, so `caution` and `danger` still announce
      themselves apart after both have become `warn`. */
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
  };

  declare tone: NoteTone;
  declare heading: string;
  declare body: string | TemplateResult;
  declare icon?: IconId;
  declare label: string;

  /* What a caller wrote between the tags, taken before Lit renders over it —
     see `SdsElement.lifted()` for why it is asked exactly once. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.tone = 'info';
    this.heading = '';
    this.body = '';
    this.label = '';
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const said = this.label || SdsNote.TONE_LABEL[this.tone];
    return html`<div class="sds-note sds-note--${this.tone}">
  <span class="sds-note__icon"><sds-icon name="${this.icon ?? SdsNote.TONE_ICON[this.tone]}" label="${said}"></sds-icon></span>
  <div class="sds-note__content">
    ${this.heading ? html`<div class="sds-note__title">${this.heading}</div>` : nothing}
    <div class="sds-note__body">${this.taken ?? this.content ?? this.body}</div>
  </div>
</div>`;
  }
}

define('sds-note', SdsNote);
