/* sds-checks — a list whose items each carry a check.

   The list stands between the tags, as a page or a renderer wrote it, so a
   reader with no script gets the same list. The check is `actions-check` of the
   icon set, drawn by the stylesheet. `tone` colours the check and nothing else. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface ChecksProps {
  /** `ok` draws the checks in the status green. Without it they take the ink of
      the text. */
  tone?: 'ok';
}

export class SdsChecks extends SdsElement {
  static override properties = {
    tone: { type: String },
  };

  declare tone?: 'ok';

  /* The list as a caller wrote it, taken before Lit renders over it. */
  private taken: Node[] | null = null;

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-checks${this.tone === 'ok' ? ' sds-checks--ok' : ''}">${this.taken ?? this.content}</div>`;
  }
}

define('sds-checks', SdsChecks);
