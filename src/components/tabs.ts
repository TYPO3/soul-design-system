/* sds-tabs — switching the content of a panel rather than the page.

   The active item is a filled block, never a tint: a tint reads as "hovered"
   or "disabled" depending on what is under it, and this system already
   spends hover on a colour change. The accent marks the active item — one of
   the exactly three places `--accent` may appear at all.

   A tab is a label and a panel, and the component holds the two together:

     <sds-tabs>
       <sds-tab-item label="standalone">…</sds-tab-item>
       <sds-tab-item label="as a dependency">…</sds-tab-item>
     </sds-tabs>

   There is no other form. Written apart — a list of strings here, a switch
   over an index there — keeping the two in step is the caller's problem and
   the component is a row of words. The items are lifted out on connect, the
   same way `sds-code` keeps a fenced block, and handed back below the bar.

   This is a real tablist, so each tab names the panel it controls and the
   arrow keys move between them: that is what a screen reader user expects the
   moment `role="tab"` is on the page.

   `tabsBarMarkup` is the bar itself, exported for the specimen card — which
   is written by `renderStatic` and can hold no element that was given
   children. One function, two renderers, so the card cannot drift from what
   a browser draws. */

import { html, nothing, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import { define } from '../lib/element.ts';
import { SdsNav, type NavItem } from './nav-base.ts';
import { SdsTabItem } from './tab-item.ts';
import { type IconId } from './icon.ts';

/** One tab in the bar. `tabId` and `panelId` are present where there is a
    panel to point at, which is everywhere except a still picture. */
export interface TabHandle {
  label: string;
  icon?: IconId;
  tabId?: string;
  panelId?: string;
}

/** The bar a set of tabs is. */
export function tabsBarMarkup(
  tabs: readonly TabHandle[],
  active: number,
  pick?: (index: number) => void,
  onKey?: (event: KeyboardEvent) => void,
): TemplateResult {
  const buttons = tabs.map((tab, i) => {
    const cls = i === active ? 'sds-tab is-active' : 'sds-tab';
    const inside = tab.icon ? html`<sds-icon name="${tab.icon}"></sds-icon>${tab.label}` : html`${tab.label}`;
    return html`<button type="button" class="${cls}" role="${tab.panelId ? 'tab' : nothing}" id="${tab.tabId ?? nothing}" aria-controls="${tab.panelId ?? nothing}" aria-selected="${tab.panelId ? String(i === active) : nothing}" tabindex="${tab.panelId ? (i === active ? 0 : -1) : nothing}" @click="${() => pick?.(i)}">${inside}</button>`;
  });

  return html`<div class="sds-tabs" role="${tabs[0]?.panelId ? 'tablist' : nothing}" @keydown="${(e: KeyboardEvent) => onKey?.(e)}">
  ${lines(buttons, 2)}
</div>`;
}

export class SdsTabs extends SdsNav {
  protected override readonly block = 'sds-tabs';
  protected override readonly item = 'sds-tab';

  /** The panels written between the tags. */
  private panels: SdsTabItem[] = [];

  override connectedCallback(): void {
    if (!this.panels.length) {
      this.panels = [...this.children].filter((c): c is SdsTabItem => c.tagName.toLowerCase() === 'sds-tab-item');
      /* Lifted before Lit renders over them, and handed back below. The
         labels come off the items, so a composed set says everything once. */
      this.items = this.panels.map((panel) => {
        const icon = panel.getAttribute('icon');
        const label = panel.getAttribute('label') ?? '';
        return (icon ? { label, icon } : label) as NavItem;
      });
      for (const panel of this.panels) panel.remove();
    }
    super.connectedCallback();
  }

  protected override choose(index: number): void {
    super.choose(index);
    this.show();
  }

  /** Tell each panel whether it is the one. */
  private show(): void {
    this.panels.forEach((panel, i) => { panel.active = i === this.active; });
  }

  /* The arrow keys, because a tablist that only answers the pointer is a
     tablist in name. Home and End are part of the same expectation. */
  private onKey(event: KeyboardEvent): void {
    const last = this.panels.length - 1;
    const to =
      event.key === 'ArrowRight' ? (this.active === last ? 0 : this.active + 1)
      : event.key === 'ArrowLeft' ? (this.active === 0 ? last : this.active - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : -1;
    if (to === -1) return;
    event.preventDefault();
    this.choose(to);
    /* The focus follows the selection, which is what a tablist does — the tab
       that is current is the tab the keyboard is on. */
    void this.updateComplete.then(() => {
      this.querySelectorAll<HTMLButtonElement>('button.sds-tab')[to]?.focus();
    });
  }

  protected override render(): TemplateResult {
    const tabs: TabHandle[] = this.panels.map((panel, i) => {
      const item = this.items[i];
      return {
        label: typeof item === 'string' ? item : (item?.label ?? ''),
        icon: typeof item === 'string' ? undefined : item?.icon,
        tabId: panel.tabId,
        panelId: panel.panelId,
      };
    });

    return html`${tabsBarMarkup(tabs, this.active, (i) => this.choose(i), (e) => this.onKey(e))}${this.panels}`;
  }

  protected override updated(): void {
    this.show();
  }
}

define('sds-tabs', SdsTabs);
