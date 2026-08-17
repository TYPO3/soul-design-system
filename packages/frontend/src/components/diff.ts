/* sds-diff — a file's changes, and the one place status colour fills a line.

   The tint is 14% so a changed line reads as changed without the row becoming
   the loudest thing on the surface. No line numbers unless something actually
   references them: a gutter of numbers nobody cites is decoration on the one
   surface with the least room for it.

   The frame is the code block's — same border, same head — because a diff is
   machine output like any other. What it does not share is the body, which is
   why it is an element of its own rather than a mode of `sds-code`. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type DiffKind = 'context' | 'add' | 'del';

export interface DiffLine {
  kind: DiffKind;
  text: string;
}

export interface DiffProps {
  /** The file the diff is of — a path, so it sets in mono. */
  path: string;
  /** A glyph beside the path, where the kind of file is worth saying before
      the change is read. */
  icon?: IconId;
  /** The change as lines, each added, removed or unchanged — set from
      script, being a list. */
  body: readonly DiffLine[];
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
  <div class="sds-code__head" style="justify-content:flex-start"><sds-icon name="${this.icon ?? 'actions-code-compare'}"></sds-icon><span class="sds-code__path">${this.path}</span></div>
  <pre class="sds-diff">${this.body.map((l) => this.line(l))}</pre>
</div>`;
  }
}

define('sds-diff', SdsDiff);
