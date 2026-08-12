/* sds-tabs — switching the content of a panel rather than the page.

   The active item is a filled block, never a tint: a tint reads as "hovered" or
   "disabled" depending on what is under it. A tab is a label and a panel, and
   `sds-tab-item` holds the two together — written apart, keeping them in step
   is the caller's problem and this is a row of words.

   A real tablist, so each tab names the panel it controls and the arrow keys
   move between them. `tabsBarMarkup` is the bar alone, for the card:
   `renderStatic` can flatten no element that was given children. */

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

  /** Take the items written between the tags, if any are there yet. */
  private lift(): boolean {
    const found = [...this.children].filter((c): c is SdsTabItem => c.tagName.toLowerCase() === 'sds-tab-item');
    if (!found.length) return false;
    this.panels = found;
    /* Lifted before Lit renders over them, and handed back below. The labels
       come off the items, so a composed set says everything once. */
    this.items = this.panels.map((panel) => {
      const icon = panel.getAttribute('icon');
      const label = panel.getAttribute('label') ?? '';
      return (icon ? { label, icon } : label) as NavItem;
    });
    /* Told that something is now deciding which of them is shown. A panel that
       nobody manages draws itself open — see `sds-tab-item` — which is what a
       page rendered ahead of the browser needs and what a set of tabs must
       take over the moment it exists. */
    for (const panel of this.panels) {
      panel.managed = true;
      panel.remove();
    }
    return true;
  }

  /* Children written into a template arrive with it; children produced by a
     `.map()` in the template around this one arrive after it has connected.
     Both are the same set of tabs, so the second is waited for rather than
     rendered as an empty bar — which is what a set of tabs built from data
     used to be. */
  private arriving?: MutationObserver;

  override connectedCallback(): void {
    if (!this.panels.length && !this.lift()) {
      this.arriving = new MutationObserver(() => {
        if (!this.lift()) return;
        this.arriving?.disconnect();
        this.requestUpdate();
      });
      this.arriving.observe(this, { childList: true });
    }
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this.arriving?.disconnect();
    super.disconnectedCallback();
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
    const named = (item: NavItem | undefined) => ({
      label: typeof item === 'string' ? item : (item?.label ?? ''),
      icon: typeof item === 'string' ? undefined : item?.icon,
    });

    /* The bar off the panels where there are panels, and off the labels alone
       where there are not: in Node there are no children to lift, see
       `SdsElement`, so `items` is what says them. What a prerendered set cannot
       have is the wiring — no `tablist`, and buttons that do nothing until it
       upgrades, which is honest, since nothing could switch anyway. */
    const tabs: TabHandle[] = this.panels.length
      ? this.panels.map((panel, i) => ({
          ...named(this.items[i]),
          tabId: panel.tabId,
          panelId: panel.panelId,
        }))
      : this.items.map(named);

    const held = this.panels.length ? this.panels : this.content;
    return html`${tabsBarMarkup(tabs, this.active, (i) => this.choose(i), (e) => this.onKey(e))}${held}`;
  }

  protected override updated(): void {
    this.show();
  }
}

define('sds-tabs', SdsTabs);
