/* sds-badge — a small, named piece of state.

   `accent` names the source of an answer; the status tones are the result of
   one. Status colour belongs here, in code output, in result rows and in
   status-about diagrams — never as page furniture, where a colour that means
   "something is wrong" would be saying so about the page itself.

   The three result tones carry a glyph as well as a colour: colour alone
   would leave the meaning to anyone who cannot tell three hues apart. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type BadgeTone = 'default' | 'accent' | 'ok' | 'warn' | 'error';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  /** An explicit glyph, overriding the tone's own. The status tones already
      carry one; `default` and `accent` carry none, because most badges are a
      word and nothing more. Give one where the icon adds a fact the word does
      not — the source an answer came from, the kind of thing being counted. */
  icon?: IconId;
}

export class SdsBadge extends SdsElement {
  /** The glyph each result tone carries. */
  private static readonly TONE_ICON: Partial<Record<BadgeTone, IconId>> = {
    ok: 'actions-check-circle',
    warn: 'actions-exclamation-triangle',
    error: 'actions-exclamation-circle',
  };

  static override properties = {
    label: { type: String },
    tone: { type: String, reflect: true },
    icon: { type: String },
  };

  declare label: string;
  declare tone: BadgeTone;
  declare icon?: IconId;

  constructor() {
    super();
    this.label = '';
    this.tone = 'default';
  }

  protected override render(): TemplateResult {
    const glyph = this.icon ?? SdsBadge.TONE_ICON[this.tone];
    const cls = this.tone === 'default' ? 'sds-badge' : `sds-badge sds-badge--${this.tone}`;
    return glyph
      ? html`<span class="${cls}"><sds-icon name="${glyph}"></sds-icon>${this.label}</span>`
      : html`<span class="${cls}">${this.label}</span>`;
  }
}

define('sds-badge', SdsBadge);
