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

/** What a line in a code block IS, rather than markup someone assembled.

    - `shell` — a command. The `$` prompt carries the accent, one of exactly
      three places `--accent` appears in this system.
    - `comment` — a comment.
    - `ok` — a success line from the machine. The `✓` comes from the mono
      font; SKILL.md forbids emoji outright.
    - `plain` — machine output with nothing to mark. */
export type CodeKind = 'plain' | 'shell' | 'comment' | 'ok';

export interface CodeLine {
  kind: CodeKind;
  text: string;
  /** A fragment inside the line set as a command — a path, a flag, a tool
      name. `ok('published 9 skills to', '.agents/skills')` used to be a
      second argument to a free function; it is a field now. */
  code?: string;
}

/** The languages this system supports in a code block.

    Declared, not surveyed. The first version of this list was taken from what
    the Dev Companion documentation happened to contain — 136 JSON blocks, 50
    YAML, 16 shell — which describes one consumer on one day and says nothing
    about what the system will stand behind. This says what it will.

    The set is TYPO3-shaped on purpose: `typoscript` and `php` are the domain,
    `json` and `yaml` are what configures it, `bash` is what runs it, `sql` and
    `xml` are what it stores and ships, `diff` is what a review reads. Adding
    one is a decision with two parts — the highlighter the consumer uses has to
    know the identifier, and a specimen should exist that proves it reads
    right. Both, or neither.

    Not a closed enum, and that is deliberate: the value reaches this component
    from a Markdown fence or an author's hand, and refusing to print a word is
    not a service. What the union buys is the near miss — `yml` for `yaml`,
    `sh` for `bash` — which highlight.js does not know, quietly leaves
    unhighlighted, and leaves looking almost right.

    `(string & {})` is what keeps both halves: a plain `| string` would swallow
    the literals and take the editor's suggestions with them. */
export type CodeLang =
  | 'bash'
  | 'css'
  | 'diff'
  | 'html'
  | 'javascript'
  | 'json'
  | 'markdown'
  | 'php'
  | 'sql'
  | 'text'
  | 'twig'
  | 'typescript'
  | 'typoscript'
  | 'xml'
  | 'yaml'
  | (string & {});

export interface CodeBlockProps {
  /** The language, lower case as a fence writes it. Set in the label register
      by `sds-code__lang`, so the upper case is the stylesheet's, not yours. */
  lang?: CodeLang;
  /** An affordance for the head that is not the copy button — a filename, a
      count. Set `copy` instead for copying; the component owns that. */
  action?: TemplateResult;
  body: readonly CodeLine[];
  copy?: boolean;
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
    copy: { type: Boolean, reflect: true },
    copied: { type: Boolean, state: true },
  };

  declare lang: CodeLang;
  declare body: readonly CodeLine[];
  declare action?: TemplateResult;
  declare copy: boolean;
  declare copied: boolean;

  /* Content written between the tags, taken before Lit renders over it.

     The element renders light DOM, so `render()` replaces its children — and
     the children are the whole point when the block comes from a renderer
     rather than from a story:

       <sds-code lang="bash" copy><code>…</code></sds-code>

     So they are lifted out on connect and handed back to the template as
     nodes. Lit renders a DOM node as a child value, and re-rendering moves
     the same nodes rather than copying them. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.lang = '';
    this.body = [];
    this.copy = false;
    this.copied = false;
  }

  override connectedCallback(): void {
    if (typeof navigator !== 'undefined') this.clipboard = Boolean(navigator.clipboard);
    if (this.taken === null && this.childNodes.length > 0) {
      this.taken = [...this.childNodes];
      /* `ChildNode.remove` rather than `Node.remove`: a text node between the
         tags is a Node and has no `remove` on the type, though every one of
         them here is a ChildNode. */
      for (const node of this.taken) (node as ChildNode).remove();
    }
    super.connectedCallback();
  }

  /** Whatever the block would put on the clipboard: its text, trailing
      blank lines dropped the way a shell would not want them. */
  private get text(): string {
    return (this.textContent ?? '').replace(/\n+$/, '');
  }

  private async toClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.text);
    } catch {
      /* Denied, or no permission in this context. Saying nothing is better
         than a check mark for something that did not happen. */
      return;
    }
    this.copied = true;
    setTimeout(() => { this.copied = false; }, 1600);
  }

  /* A button that cannot do its one job is worse than no button, so a
     browser with no clipboard gets none. That is decided on connect rather
     than at render time: `renderStatic` runs this in Node, where there is no
     `navigator` at all, and a guard on the object itself would silently drop
     the affordance from every specimen card — which is a picture of the
     component and should show what it has. */
  private clipboard = true;

  private get copyButton(): TemplateResult | undefined {
    if (!this.copy || !this.clipboard) return undefined;
    return html`<button type="button" class="sds-code__copy${this.copied ? ' is-copied' : ''}" aria-label="Copy this block" @click="${() => void this.toClipboard()}"><span class="sds-code__glyph"><sds-icon name="actions-duplicate"></sds-icon></span><span class="sds-code__copied"><sds-icon name="actions-check"></sds-icon></span><span>${this.copied ? 'copied' : 'copy'}</span></button>`;
  }

  /* The lines the free `comment()`, `shell()` and `ok()` helpers used to
     build. They were three exported functions that assembled markup a caller
     then handed back in — which made the component's own output something any
     caller could half-write. A line is data now, and only this file turns it
     into spans. */
  private line({ kind, text, code }: CodeLine): TemplateResult {
    const tail = code ? html` <span class="sds-code__cmd">${code}</span>` : undefined;
    switch (kind) {
      case 'shell':
        return html`<span class="sds-code__prompt">$</span> <span class="sds-code__cmd">${text}</span>${tail}`;
      case 'comment':
        return html`<span class="sds-code__comment">${text}</span>${tail}`;
      case 'ok':
        return html`<span class="sds-code__ok">✓</span> ${text}${tail}`;
      default:
        return html`${text}${tail}`;
    }
  }

  protected override render(): TemplateResult {
    const affordance = this.action ?? this.copyButton;
    /* A head with neither a language nor an affordance is an empty bar. */
    const head = this.lang || affordance
      ? html`<div class="sds-code__head">
    <span class="sds-code__lang">${this.lang}</span>
    ${affordance}
  </div>`
      : undefined;
    return html`<div class="sds-code">
  ${head}
  <pre class="sds-code__body">${this.taken ?? lines(this.body.map((l) => this.line(l)), 0)}</pre>
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
