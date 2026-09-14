/* sds-tabs — switching the content of a panel rather than the page.

   The active item is a filled block, never a tint: a tint reads as "hovered" or
   "disabled" depending on what is under it. A tab is a label and a panel, and
   `sds-tab-item` holds the two together. Written apart, the caller has to keep
   them in step and this is a row of words.

   A real tablist, so each tab names the panel it controls and the arrow keys
   move between them. `tabsBarMarkup` is the bar alone, for the card:
   `renderStatic` can flatten no element with children. */

import { html, nothing, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import { define } from '../lib/element.ts';
import { SdsNav, navLabel, type NavItem } from './nav-base.ts';
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
  static override properties = {
    /* Lit merges what a subclass declares with what it inherits; the type
       does not, so the base's stand here again. */
    ...SdsNav.properties,
    /** The word that makes sets follow each other. Named for what it does
        rather than for the set's name. A page that shows one setting in four
        places asks the reader to choose a language once. A set with nothing
        here is a set nobody else moves. */
    sync: { type: String, reflect: true },
  };

  /** A name every set that moves together shares: a tab picked in one picks
      the same label in all of them. Unset rather than empty. `reflect` writes
      `sync=""`, and a set that follows nobody then answers to `[sync]` — for a
      stylesheet, for a test, and for the registry below. */
  declare sync?: string;

  protected override readonly block = 'sds-tabs';
  protected override readonly item = 'sds-tab';

  /* Every set on the page that follows a word, so one of them can reach the
     others. A registry rather than an event on the document: what agrees is
     these elements, and a page can hold sets that agree about nothing. */
  static readonly agreeing = new Set<SdsTabs>();

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
    /* Told that something now decides which of them shows. A panel that nobody
       manages draws itself open — see `sds-tab-item`. That is what a page
       rendered ahead of the browser needs, and what a set of tabs must take
       over the moment it exists. */
    for (const panel of this.panels) {
      panel.managed = true;
      panel.remove();
    }
    return true;
  }

  /* Children written into a template arrive with it; children from a `.map()`
     in the template around this one arrive after it has connected. Both are
     the same set of tabs, so this waits for the second rather than renders an
     empty bar. */
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
    if (this.sync) SdsTabs.agreeing.add(this);
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this.arriving?.disconnect();
    SdsTabs.agreeing.delete(this);
    super.disconnectedCallback();
  }

  protected override choose(index: number): void {
    super.choose(index);
    this.show();
    this.agree();
  }

  /** Where the choice lives. One key per group, so two sets that agree
      about nothing on the same origin do not overwrite each other. */
  private get store(): string {
    return `sds-tabs:${this.sync}`;
  }

  private get labels(): string[] {
    return this.items.map(navLabel);
  }

  /* **A preference is an order, not a word.** A reader who picks bash in the
     one block that offers it still prefers PHP to YAML everywhere else. So
     the store holds every word they chose, most recent first, and a set
     takes the first of them it has. */
  private get preferred(): string[] {
    const kept = localStorage.getItem(this.store);
    if (!kept) return [];
    try {
      return JSON.parse(kept) as string[];
    } catch {
      /* Somebody else's value under our key, or one from a version that wrote
         a bare word. Neither is a reason to break a page. */
      return [kept];
    }
  }

  /* Tell the sets that follow the same word, and remember it for the next
     page. A reader reads a manual across ten of them, and a language chosen
     again on each is the same annoyance one level up. */
  private agree(): void {
    if (!this.sync) return;
    const label = this.labels[this.active];
    if (label === undefined) return;
    localStorage.setItem(this.store, JSON.stringify([label, ...this.preferred.filter((w) => w !== label)]));
    for (const other of SdsTabs.agreeing) {
      if (other !== this && other.sync === this.sync) other.follow(label);
    }
  }

  /* Move because another set did, and do not say it back. By the word and not
     by the position. A block that offers YAML and TypoScript has no PHP. One
     without the word keeps the panel it shows rather than falls back to its
     first. */
  private follow(label: string): boolean {
    const at = this.labels.indexOf(label);
    if (at === -1) return false;
    super.choose(at);
    this.show();
    return true;
  }

  /* The earlier choice, applied once there is something to match it
     against. The items arrive with the markup or a frame later, and a
     question before they are there settles on nothing, in silence. */
  private recalled = false;

  private recall(): void {
    if (this.recalled || !this.sync || !this.items.length) return;
    this.recalled = true;
    for (const label of this.preferred) if (this.follow(label)) return;
  }

  /** Tell each panel if it is the one. */
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
       where there are not. In Node there are no children to lift, see
       `SdsElement`, so `items` says them. What a prerendered set cannot have
       is the wiring: no `tablist`, and buttons that do nothing until it
       upgrades. That is honest, since nothing can switch anyway. */
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
    this.recall();
    this.show();
  }
}

define('sds-tabs', SdsTabs);
