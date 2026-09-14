/* sds-entry — one numbered, addressed entry of a register.

   The number in a rail on the left. Beside it, indented as one block: the
   title, the kind with the origin, and what the entry holds as paragraphs,
   evidence, a table. The indent is the scope: a reader sees where an entry
   begins and ends. The kind is the reader's first question. So it stands on
   its own line under the title, as a word and never as a colour alone.

   No box around it, because twenty of these in a row are a list; the line
   between two of them is the register's. A review's finding is one of
   these, and so is the thing to do that it asks for. */

import { html, nothing, type TemplateResult } from 'lit';
import './badge.ts';
import { type BadgeTone } from './badge.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface EntryProps {
  /** Its place in the register, as the register numbers it: `1.1`. In mono,
      because a reader cites it. */
  number?: string;
  /** What stands before the number, `F` for a finding, where a register says
      so. Nothing unless it does. */
  prefix?: string;
  /** The entry, in a line. Sentence case, and never a category name. */
  heading: string;
  /** The kind of entry it is, as the word on its badge: `blocks`,
      `sent back`. A register hands it down from its groups. */
  label?: string;
  /** The tone under that word. */
  tone?: BadgeTone;
  /** The key of the group it belongs to, for the register that groups. */
  group?: string;
  /** Where it came from, in a few words: `introduced by this change`,
      `older than the change`. A fault the change did not make weighs on
      the change differently. */
  origin?: string;
  /** The address of this one entry, so a remark at the code can point at
      it. */
  anchor?: string;
  /** What is to do about it, in one sentence, for whoever acts on it. A
      register collects these into the list of what is to do. An entry with
      none is a fact, and one with one is work. */
  todo?: string;
  /** What stands before the number of that work, `T` where a register says
      so. Nothing unless it does. */
  todoPrefix?: string;
  /** What the entry holds, as prose. Or nothing, when the blocks stand
      between the tags instead: paragraphs, a code block, a table. */
  body?: string | TemplateResult;
}

export class SdsEntry extends SdsElement {
  static override properties = {
    number: { type: String },
    prefix: { type: String },
    heading: { type: String },
    label: { type: String },
    tone: { type: String },
    group: { type: String },
    origin: { type: String },
    anchor: { type: String },
    todo: { type: String },
    todoPrefix: { type: String, attribute: 'todo-prefix' },
    body: { type: String },
  };

  declare number: string;
  declare prefix: string;
  declare heading: string;
  declare label: string;
  declare tone: BadgeTone;
  declare group: string;
  declare origin: string;
  declare anchor: string;
  declare todo: string;
  declare todoPrefix: string;
  declare body: string | TemplateResult;

  /* What a caller wrote between the tags, taken before Lit renders over it —
     see `SdsElement.lifted()` for why the question comes exactly once. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.number = '';
    this.prefix = '';
    this.heading = '';
    this.label = '';
    this.tone = 'default';
    this.group = '';
    this.origin = '';
    this.anchor = '';
    this.todo = '';
    this.todoPrefix = '';
    this.body = '';
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    return html`<article class="sds-entry" id="${this.anchor || nothing}">
  <span class="sds-entry__number">${this.number ? `${this.prefix}${this.number}` : ''}</span>
  <h3 class="sds-entry__title">${this.heading}</h3>
  ${this.label || this.origin
    ? html`<div class="sds-entry__meta">
    ${this.label ? html`<sds-badge label="${this.label}" tone="${this.tone}"></sds-badge>` : nothing}
    ${this.origin ? html`<span class="sds-entry__origin">${this.origin}</span>` : nothing}
  </div>`
    : nothing}
  <div class="sds-entry__body">${this.taken ?? this.content ?? this.body}</div>
  ${this.todo ? html`<p class="sds-entry__todo"><span class="sds-entry__number">${this.number ? `${this.todoPrefix}${this.number}` : ''}</span>${this.todo}</p>` : nothing}
</article>`;
  }
}

define('sds-entry', SdsEntry);
