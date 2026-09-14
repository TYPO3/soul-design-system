/* sds-register — a list a reader cites: numbered, addressed, and scanned at
   a glance before the entries.

   The entries stand between the tags. The register numbers them, sorts them
   into their groups where it has any, and writes every one into one table
   first. A row is a jump, with the kind in the word and the tone the entry
   draws. Every entry with a `todo` goes into a second table: the work the
   list asks for, numbered as its entry is. So no page counts entries or
   lists work by hand, and no overview can say what an entry does not.

   The entries arrive three ways, and each gives the same register. Elements
   in a browser; `entries`, where a static render has no children; and the
   markup the author wrote, under a prerender. */

import { html, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import './badge.ts';
import './entry.ts';
import './table.ts';
import { type BadgeTone } from './badge.ts';
import { type CellValue, type Column, type Row } from './table.ts';
import { type EntryProps } from './entry.ts';
import { define, SdsElement } from '../lib/element.ts';

/** One group of a register. Its key, which an entry names in `group`; the
    heading over it; the word and the tone every entry in it draws. */
export interface RegisterGroup {
  key: string;
  heading: string;
  label?: string;
  tone?: BadgeTone;
}

/** The groups of a review's findings, in the order a review reads them.
    `blocks` stops the change, `back` sends it to its author, `change` is
    worth one and stops nothing, `ok` is a thing checked and found sound. */
export const FINDING_GROUPS: readonly RegisterGroup[] = [
  { key: 'blocks', heading: 'Blocks submission', label: 'blocks', tone: 'error' },
  { key: 'back', heading: 'Sent back', label: 'sent back', tone: 'warn' },
  { key: 'change', heading: 'Worth a change', label: 'worth a change', tone: 'default' },
  { key: 'ok', heading: 'Checked and correct', label: 'checked', tone: 'ok' },
];

export interface RegisterProps {
  /** The entries, where a static render has no children to take. Between
      the tags otherwise, as `sds-entry` elements. */
  entries?: readonly EntryProps[];
  /** The groups, in order. With them an entry is `1.1`, its group's place
      and its own; without them the entries count up as written, `1`, `2`. */
  groups?: readonly RegisterGroup[];
  /** The name the group sections and the entries' addresses start with:
      `findings-blocks`, `findings-1-1`. So two registers on one page keep
      apart. */
  name?: string;
  /** What stands before every entry's number, `F` for findings. Nothing
      unless the register says so. */
  prefix?: string;
  /** What stands before the number of what is to do, `T` where the register
      says so. */
  todoPrefix?: string;
}

/** One entry with its place: the number the register gave it, the address
    it answers to, and what the register renders for it. */
interface Placed {
  number: string;
  anchor: string;
  heading: string;
  group: RegisterGroup | null;
  origin: string;
  todo: string;
  out: unknown;
}

/** An entry's facts before the register places it, from whichever form it
    arrived in. */
interface Read {
  heading: string;
  group: string;
  origin: string;
  todo: string;
  anchor: string;
  render: (placed: Omit<Placed, 'out'>, group: RegisterGroup | null) => unknown;
}

/** The facts on an entry's own tag, read back out of its markup. The
    attributes are the author's, escaped the way HTML escapes them. */
const FACT = /\s([\w-]+)="([^"]*)"/g;
const unescape = (text: string): string =>
  text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export class SdsRegister extends SdsElement {
  static override properties = {
    entries: { type: Array },
    groups: { type: Array },
    name: { type: String },
    prefix: { type: String },
    todoPrefix: { type: String, attribute: 'todo-prefix' },
  };

  declare entries: readonly EntryProps[];
  declare groups: readonly RegisterGroup[];
  declare name: string;
  declare prefix: string;
  declare todoPrefix: string;

  /* The entries written between the tags, taken before Lit renders over
     them. Elements, which the register moves into their groups. */
  private taken: Element[] | null = null;

  constructor() {
    super();
    this.entries = [];
    this.groups = [];
    this.name = 'register';
    this.prefix = '';
    this.todoPrefix = '';
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node): node is Element => node.nodeType === 1);
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  private anchorFor(number: string): string {
    return `${this.name}-${number.replace('.', '-')}`;
  }

  /** The attributes an entry gets from its place, for a form that carries
      them as attributes. */
  private facts(placed: Omit<Placed, 'out'>, group: RegisterGroup | null): Record<string, string> {
    return {
      number: placed.number,
      anchor: placed.anchor,
      prefix: this.prefix,
      'todo-prefix': this.todoPrefix,
      label: group?.label ?? '',
      tone: group?.tone ?? 'default',
    };
  }

  /* From elements in a browser. Attributes rather than properties: a child
     has not always upgraded when its parent renders. The place goes back as
     attributes for the same reason. */
  private fromElements(elements: readonly Element[]): Read[] {
    return elements
      .filter((el) => el.tagName.toLowerCase() === 'sds-entry')
      .map((el) => ({
        heading: el.getAttribute('heading') ?? '',
        group: el.getAttribute('group') ?? '',
        origin: el.getAttribute('origin') ?? '',
        todo: el.getAttribute('todo') ?? '',
        anchor: el.getAttribute('anchor') ?? '',
        render: (placed, group) => {
          for (const [key, value] of Object.entries(this.facts(placed, group))) el.setAttribute(key, value);
          return el;
        },
      }));
  }

  /* From the property, where a static render has no children. */
  private fromEntries(entries: readonly EntryProps[]): Read[] {
    return entries.map((e) => ({
      heading: e.heading,
      group: e.group ?? '',
      origin: e.origin ?? '',
      todo: e.todo ?? '',
      anchor: e.anchor ?? '',
      render: (placed, group) => {
        const f = this.facts(placed, group);
        return html`<sds-entry number="${f['number']}" prefix="${f['prefix']}" todo-prefix="${f['todo-prefix']}" label="${f['label']}" tone="${f['tone']}" heading="${e.heading}" group="${e.group ?? ''}" origin="${e.origin ?? ''}" anchor="${f['anchor']}" todo="${e.todo ?? ''}" .body="${e.body ?? ''}"></sds-entry>`;
      },
    }));
  }

  /* From the markup as the author wrote it, under a prerender. Each entry's
     facts stand on its tag, and its content between them. The register
     renders each entry itself, once, with the place it gives it. */
  private fromMarkup(markup: string): Read[] {
    return [...markup.matchAll(/<sds-entry\b([^>]*)>([\s\S]*?)<\/sds-entry>/g)].map(([, tag = '', inner = '']) => {
      const facts: Record<string, string> = {};
      for (const [, key, value] of tag.matchAll(FACT)) facts[key!] = unescape(value!);
      return {
        heading: facts['heading'] ?? '',
        group: facts['group'] ?? '',
        origin: facts['origin'] ?? '',
        todo: facts['todo'] ?? '',
        anchor: facts['anchor'] ?? '',
        render: (placed, group) => {
          const f = this.facts(placed, group);
          return html`<sds-entry number="${f['number']}" prefix="${f['prefix']}" todo-prefix="${f['todo-prefix']}" label="${f['label']}" tone="${f['tone']}" heading="${facts['heading'] ?? ''}" group="${facts['group'] ?? ''}" origin="${facts['origin'] ?? ''}" anchor="${f['anchor']}" todo="${facts['todo'] ?? ''}" .content="${html`${unsafeHTML(inner)}`}"></sds-entry>`;
        },
      };
    });
  }

  private get read(): Read[] {
    if (this.taken) return this.fromElements(this.taken);
    if (this.entries.length) return this.fromEntries(this.entries);
    return this.authored ? this.fromMarkup(this.authored) : [];
  }

  /** Every entry with its place. Grouped, an entry is its group's place
      and its own; an entry whose group the register does not name stands
      last, in the order written. Ungrouped, the entries count up. */
  private get placed(): Placed[] {
    const read = this.read;
    const place = (entries: Read[], group: RegisterGroup | null, at: number): Placed[] =>
      entries.map((e, i) => {
        const number = group ? `${at}.${i + 1}` : `${i + 1}`;
        const anchor = e.anchor || this.anchorFor(number);
        const placed = { number, anchor, heading: e.heading, group, origin: e.origin, todo: e.todo };
        return { ...placed, out: e.render(placed, group) };
      });
    if (!this.groups.length) return place(read, null, 0);
    const known = new Set(this.groups.map((g) => g.key));
    return [
      ...this.groups.flatMap((group, i) => place(read.filter((e) => e.group === group.key), group, i + 1)),
      ...place(read.filter((e) => !known.has(e.group)), null, 0),
    ];
  }

  private badge(group: RegisterGroup | null): CellValue {
    return group?.label ? html`<sds-badge label="${group.label}" tone="${group.tone ?? 'default'}"></sds-badge>` : '';
  }

  private get columns(): Column[] {
    return [
      { head: '', cls: 'sds-td-meta', fit: true },
      { head: 'Entry' },
      ...(this.groups.length ? [{ head: 'Kind', fit: true }] : []),
      { head: 'Origin' },
    ];
  }

  private row(entry: Placed): Row {
    const cells: CellValue[] = [
      `${this.prefix}${entry.number}`,
      html`<a href="#${entry.anchor}">${entry.heading}</a>`,
    ];
    if (this.groups.length) cells.push(this.badge(entry.group));
    cells.push(entry.origin || '—');
    return { cells };
  }

  private get todoColumns(): Column[] {
    return [
      { head: '', cls: 'sds-td-meta', fit: true },
      { head: 'To do' },
      ...(this.groups.length ? [{ head: 'Kind', fit: true }] : []),
    ];
  }

  /** The work an entry asks for, numbered as the entry is, with the prefix
      that tells the two apart. The number is the way back to the entry. */
  private todoRow(entry: Placed): Row {
    const cells: CellValue[] = [
      html`<a href="#${entry.anchor}">${this.todoPrefix}${entry.number}</a>`,
      entry.todo,
    ];
    if (this.groups.length) cells.push(this.badge(entry.group));
    return { cells };
  }

  protected override render(): TemplateResult {
    const placed = this.placed;
    const todos = placed.filter((e) => e.todo);
    const groups: (RegisterGroup | null)[] = this.groups.length ? [...this.groups, null] : [null];
    return html`<div class="sds-register">
  <sds-table density="compact" scrollable .columns="${this.columns}" .rows="${placed.map((e) => this.row(e))}"></sds-table>
  ${todos.length
    ? html`<section class="sds-section" id="${this.name}-todo">
    <h3>To do</h3>
    <sds-table density="compact" scrollable .columns="${this.todoColumns}" .rows="${todos.map((e) => this.todoRow(e))}"></sds-table>
  </section>`
    : nothing}
  ${groups.map((group) => {
    const own = placed.filter((e) => e.group === group);
    if (!own.length) return nothing;
    return group
      ? html`<section class="sds-section" id="${this.name}-${group.key}">
    <h3>${group.heading}</h3>
    ${own.map((e) => e.out)}
  </section>`
      : html`<div class="sds-register__entries">${own.map((e) => e.out)}</div>`;
  })}
</div>`;
  }
}

define('sds-register', SdsRegister);
