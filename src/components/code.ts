/* Code block and diff — the one place status colour may fill a whole line.

   Everything the machine reads, writes or names sets in Source Code Pro, at
   every size. Nothing in here is title-cased or prettified: `composer
   install` and `.agents/skills` are what they are.

   No line numbers unless something actually references them. A gutter of
   numbers nobody cites is decoration on the one surface that has the least
   room for it.

   Note the `spec-cap` on the language label: that class lives in
   `_specimen.css`, which is deliberately NOT part of the `styles.css`
   closure, so a product surface using `sds-code` receives no styling for it.
   Reproduced here as the card had it rather than quietly redesigned — see
   the note in `ARCHITECTURE.md`. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';

/** The muted mono affordance in a code header — `copy`, a filename, a count. */
export const codeMeta = (body: TemplateResult | string): TemplateResult =>
  html`<span style="display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:11px; color:var(--text-muted);">${body}</span>`;

export type CodeLine = TemplateResult;

/** A comment line inside a code block. */
export const comment = (text: string): CodeLine => html`<span class="sds-code__comment">${text}</span>`;

/** A shell line. The `$` is the prompt and carries the accent — one of the
    exactly three places `--accent` appears in this system. */
export const shell = (command: string): CodeLine =>
  html`<span class="sds-code__prompt">$</span> <span class="sds-code__cmd">${command}</span>`;

/** A success line from the machine. `✓` comes from the mono font, never an
    emoji — SKILL.md forbids those outright. */
export const ok = (before: string, code?: string): CodeLine =>
  code
    ? html`<span class="sds-code__ok">✓</span> ${before} <span class="sds-code__cmd">${code}</span>`
    : html`<span class="sds-code__ok">✓</span> ${before}`;

export interface CodeBlockProps {
  /** The language label, upper case. */
  lang?: string;
  /** The affordance on the right of the header — usually `copy`. */
  action?: TemplateResult;
  body: readonly CodeLine[];
}

export type DiffKind = 'context' | 'add' | 'del';

export interface DiffLine {
  kind: DiffKind;
  text: string;
}

export interface DiffProps {
  /** The file the diff is of — a path, so it sets in mono. */
  path: string;
  icon?: IconId;
  body: readonly DiffLine[];
}

export class SdsCode extends SdsElement {
  static override properties = {
    lang: { type: String, reflect: true },
    /* Styled lines, which no attribute can carry — a shell prompt, a comment
       and a result are three different spans, and flattening them to a string
       would throw away the only thing the component does. */
    body: { type: Array },
    action: { type: Object },
  };

  declare lang: string;
  declare body: readonly CodeLine[];
  declare action?: TemplateResult;

  constructor() {
    super();
    this.lang = '';
    this.body = [];
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-code">
  <div class="sds-code__head">
    <span class="spec-cap">${this.lang}</span>
    ${this.action}
  </div>
  <pre class="sds-code__body">${lines(this.body, 0)}</pre>
</div>`;
  }
}

export class SdsDiff extends SdsElement {
  static override properties = {
    path: { type: String, reflect: true },
    icon: { type: String },
    body: { type: Array },
  };

  declare path: string;
  declare icon?: IconId;
  declare body: readonly DiffLine[];

  constructor() {
    super();
    this.path = '';
    this.body = [];
  }

  /* Diff rows carry no newline between them: each `sds-diff__line` is a
     block, so a newline inside the `<pre>` would add an empty line between
     every pair of rows. */
  private line({ kind, text }: DiffLine): TemplateResult {
    if (kind === 'context') return html`<span class="sds-diff__line">   ${text}</span>`;
    const mark = kind === 'add' ? '+' : '-';
    return html`<span class="sds-diff__line sds-diff__line--${kind}"><span class="sds-diff__mark">${mark}</span>  ${text}</span>`;
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-code">
  <div class="sds-code__head" style="justify-content:flex-start"><sds-icon name="${this.icon ?? 'actions-code-compare'}"></sds-icon><span class="spec-cap">${this.path}</span></div>
  <pre class="sds-diff">${this.body.map((l) => this.line(l))}</pre>
</div>`;
  }
}

define('sds-code', SdsCode);
define('sds-diff', SdsDiff);
