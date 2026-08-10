/* sds-button — the action that starts work.

   One primary per view. Everything else is secondary or ghost; a second
   primary makes neither of them mean anything.

   `buttonClass` is exported because the class list *is* the contract with
   `components.css`, and a PHP surface writing plain markup needs it. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Omit for an icon-only button — which then requires `title`, because the
      icon is the whole control and nothing else names it. */
  label?: string;
  /** Sits before the label with the control gap. Direction icons are the one
      exception and follow it. */
  icon?: IconId;
  title?: string;
  disabled?: boolean;
}

export function buttonClass({ variant = 'primary', size = 'md', label = '', disabled = false }: ButtonProps): string {
  const cls = ['sds-btn', `sds-btn--${variant}`];
  if (size === 'sm') cls.push('sds-btn--sm');
  if (!label) cls.push('sds-btn--icon');
  if (disabled) cls.push('is-disabled');
  return cls.join(' ');
}

export class SdsButton extends SdsElement {
  static override properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    label: { type: String },
    icon: { type: String },
    title: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  declare variant: ButtonVariant;
  declare size: ButtonSize;
  declare label: string;
  declare icon?: IconId;
  declare disabled: boolean;

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.label = '';
    this.disabled = false;
  }

  protected override render(): TemplateResult {
    const cls = buttonClass({
      variant: this.variant,
      size: this.size,
      label: this.label,
      disabled: this.disabled,
    });
    const body = html`${this.icon ? html`<sds-icon name="${this.icon}"></sds-icon>` : nothing}${this.label}`;

    /* `title` is branched rather than bound through `ifDefined`: an omitted
       attribute still leaves the space in front of it in Lit's SSR output —
       `<button class="…" >` — and this markup is written to files that have
       to match byte for byte. */
    return this.title
      ? html`<button class="${cls}" title="${this.title}">${body}</button>`
      : html`<button class="${cls}">${body}</button>`;
  }
}

define('sds-button', SdsButton);
