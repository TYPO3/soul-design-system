/* sds-code — a fenced block, its head and its copy button.

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
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import './icon.ts';
import { highlight } from '../lib/highlight.ts';
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

    Declared, not surveyed: this says what the system stands behind, not what
    some page happens to contain. TYPO3-shaped on purpose. Adding one means the
    highlighter knows the identifier and a specimen proves it reads right.

    Open at the edges, because the value arrives from a Markdown fence and
    refusing to print a word is not a service. The union catches the near miss
    — `yml` for `yaml` — which a highlighter answers by quietly highlighting
    nothing. `(string & {})` keeps the literals from being swallowed by the
    fallback. */
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
  /** What the block is, in a sentence, above it. A renderer that captions a
      fenced block has somewhere to put it. */
  caption?: string;
  body: readonly CodeLine[];
  copy?: boolean;
}

export class SdsCode extends SdsElement {
  static override properties = {
    lang: { type: String, reflect: true },
    caption: { type: String },
    /* Styled lines, which no attribute can carry — a shell prompt, a comment
       and a result are three different spans, and flattening them to a string
       would throw away the only thing the component does. */
    body: { type: Array },
    action: { type: Object },
    copy: { type: Boolean, reflect: true },
    copied: { type: Boolean, state: true },
  };

  declare lang: CodeLang;
  declare caption: string;
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
    this.caption = '';
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

  /** Whatever the block would put on the clipboard: what it says, and none of
      what frames it.

      Read from the content rather than from the rendering. The element renders
      light DOM, so its own text is the head as well — `bash` and `copy` landed
      on the clipboard ahead of the first line, and a paste into a terminal
      began with the word for the button that had just been pressed.

      A `$` is dropped for the same reason it is a span of its own: it is the
      prompt, not the command, and pasted into a shell it is an error on line
      one. Blank lines at either end go the way a shell would not want them. */
  private get text(): string {
    const said = this.taken
      ? this.written
      : this.body.map(({ text, code }) => (code ? `${text} ${code}` : text)).join('\n');
    return said.replace(/^\n+/, '').replace(/\n+$/, '');
  }

  /** The text between the tags. Comments are skipped, and they are not the
      author's: a template that interpolates its content leaves Lit's own
      markers among the children, and `textContent` reads a comment's body
      like any other. */
  private get written(): string {
    return (this.taken ?? [])
      .filter((node) => node.nodeType !== 8)
      .map((node) => node.textContent ?? '')
      .join('');
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

  /* Content written between the tags, in the `<code>` a code block is
     supposed to have.

     The element renders that wrapper, and the `language-` class on it, from
     its own `lang`. A caller writing

       <sds-code lang="json"><code class="language-json">…</code></sds-code>

     says the language twice, and the two can disagree unnoticed — `lang`
     paints the head, the class decides the highlighting. The component owns
     it, so a caller writes the body and nothing else.

     And it colours it. A renderer that names a language and leaves the block
     in one grey has done half the job, and every surface that used this used
     to finish it — the same highlighter, wired the same way, in each of them.
     It is the component's, so a consumer links two files and gets colour.

     Where the system does not colour a language the author's own nodes are
     kept: what was written is better than a guess at what it meant. */
  private get wrapped(): TemplateResult {
    if (!this.lang) return html`<code>${this.taken}</code>`;
    const coloured = highlight(this.lang, this.text);
    return coloured === null
      ? html`<code class="language-${this.lang}">${this.taken}</code>`
      : html`<code class="language-${this.lang}">${unsafeHTML(coloured)}</code>`;
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
    /* Above the frame, not inside it: a caption says what the block is, and a
       reader meets that before the block rather than in its chrome. */
    const caption = this.caption
      ? html`<div class="sds-code__caption">${this.caption}</div>`
      : undefined;

    return html`${caption}<div class="sds-code">
  ${head}
  <pre class="sds-code__body">${this.taken ? this.wrapped : lines(this.body.map((l) => this.line(l)), 0)}</pre>
</div>`;
  }
}

define('sds-code', SdsCode);
