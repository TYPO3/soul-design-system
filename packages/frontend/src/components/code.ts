/* sds-code — a fenced block, its head and its copy button.

   Everything the machine reads, writes or names sets in Source Code Pro, at
   every size, and nothing in here is title-cased or prettified. No line numbers
   unless something references them: a gutter nobody cites is decoration on the
   surface with the least room for it.

   Every class this frame emits is defined in `components.css`. `_specimen.css`
   is outside the `styles.css` closure, so a class borrowed from there renders
   unstyled anywhere that is not a specimen card. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import './icon.ts';
import { highlight } from '../lib/highlight.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';

/** What a line in a code block IS, rather than markup someone assembled.
    `shell` is a command, and its `$` prompt is one of the three places
    `--accent` appears. `ok` is a success line, marked with the mono font's `✓`
    because emoji are forbidden outright. `comment` and `plain` are literal. */
export type CodeKind = 'plain' | 'shell' | 'comment' | 'ok';

export interface CodeLine {
  kind: CodeKind;
  text: string;
  /** A fragment inside the line set as a command — a path, a flag, a tool
      name. `ok('published 9 skills to', '.agents/skills')` used to be a
      second argument to a free function; it is a field now. */
  code?: string;
}

/** The languages this system supports in a code block. Declared, not surveyed:
    adding one means the highlighter knows the identifier and a specimen proves
    it reads right. Open at the edges, because the value arrives from a Markdown
    fence and refusing to print a word is not a service — the union catches the
    near miss, `yml` for `yaml`, which a highlighter answers in silence. */
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
  /** The language, lower case as a fence writes it; the upper case belongs to
      `sds-code__lang`. The attribute is `code-lang` deliberately: `lang` is a
      global attribute naming the *human* language, so `lang="json"` sends every
      screen reader to a language tag that does not exist, and inherits to the
      whole block from there. */
  lang?: CodeLang;
  /** An affordance for the head that is not the copy button — a filename, a
      count. Set `copy` instead for copying; the component owns that. */
  action?: TemplateResult;
  /** What the block is, in a sentence, above it. It may also be written between
      the tags as `<div class="sds-code__caption">` — the form for a caption
      carrying markup, and for a page read before the element upgrades. Either
      way it belongs to the element: see `captioned`. */
  caption?: string;
  /** A block as text, highlighted by `lang` exactly as content between the
      tags is. The two are the same block from two kinds of caller: content
      for a renderer that already holds markup, this for one that holds the
      source — a story, or a page that has to render statically, where
      children are not carried at all. */
  source?: string;
  body: readonly CodeLine[];
  copy?: boolean;
}

/* A caption written between the tags, told apart by the class the component
   would emit for it: light DOM has no slot to name it with, and a class the
   stylesheet defines is what makes the caption read right before the upgrade.
   Not an element of its own — one sentence would need its appearance stated
   twice. `nodeType` before `matches`, as in `given`: text nodes are children. */
const isCaption = (node: Node): boolean =>
  node.nodeType === 1 && (node as Element).matches('.sds-code__caption');

export class SdsCode extends SdsElement {
  static override properties = {
    lang: { type: String, reflect: true, attribute: 'code-lang' },
    caption: { type: String },
    source: { type: String },
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
  declare source: string;
  declare body: readonly CodeLine[];
  declare action?: TemplateResult;
  declare copy: boolean;
  declare copied: boolean;

  /* Content written between the tags, taken before Lit renders over it: light
     DOM means `render()` replaces the children, and the children are the whole
     point where a renderer wrote the block. Lifted on connect and handed back
     as nodes — Lit renders a node as a child value, and re-rendering moves the
     same nodes rather than copying them. */
  private taken: Node[] | null = null;

  /* The caption, where it too was written between the tags — as nodes, because
     it carries a literal, a link or an emphasis and an attribute would flatten
     all three. Inside the element, so the block places it; drawn beside it,
     nothing keeps the two together. Kept apart from `taken`, which everything
     else here reads as the block itself. */
  private captioned: Node[] | null = null;

  constructor() {
    super();
    this.lang = '';
    this.caption = '';
    this.source = '';
    this.body = [];
    this.copy = false;
    this.copied = false;
  }

  override connectedCallback(): void {
    if (typeof navigator !== 'undefined') this.clipboard = Boolean(navigator.clipboard);
    const written = this.lifted();
    const caption = written.filter(isCaption);
    const said = written.filter((node) => !isCaption(node));
    if (caption.length) this.captioned = caption;
    if (said.length) this.taken = said;
    super.connectedCallback();
  }

  /** Whatever the block would put on the clipboard: what it says, and none of
      what frames it. Read from the content, not the rendering — light DOM means
      the element's own text is the head too, so a paste would begin with the
      language and the word on the button. The `$` goes for the same reason it
      is a span of its own: it is the prompt, and in a shell it is an error. */
  private get text(): string {
    const said = this.taken
      ? this.written
      : this.source || this.body.map(({ text, code }) => (code ? `${text} ${code}` : text)).join('\n');
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

  /* A button that cannot do its one job is worse than none, so a browser
     without a clipboard gets none. Decided on connect rather than at render:
     `renderStatic` runs in Node, where a guard on `navigator` itself would drop
     the button from every specimen card. */
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

  /* Whether the block arrived already coloured. A build that highlights on its
     own hands in finished markup, and colouring it again would flatten the
     spans back to text and rebuild them from fewer grammars. `hljs-` is the
     signal because `components.css` maps those classes and nothing else. Kept
     wrapper and all: the `<code>` holds which lines are numbered. */
  private get given(): boolean {
    /* Markup handed over as a property is what a renderer wrote, arriving
       where there are no children to read it out of — see `SdsElement`. */
    if (this.content) return true;
    /* `nodeType` rather than `instanceof Element`: this getter is reached in
       Node when a page renders statically, where the constructor it would be
       compared against does not exist. */
    return (this.taken ?? []).some((node) => {
      if (node.nodeType !== 1) return false;
      const el = node as Element;
      return el.matches('[class*="hljs-"]') || el.querySelector('[class*="hljs-"]') !== null;
    });
  }

  /* Content written between the tags, in the `<code>` a code block is supposed
     to have. The element renders that wrapper and its `language-` class from
     `lang`, so a caller cannot say the language twice and have the two
     disagree — one paints the head, the other decides the highlighting. It
     colours the block too, unless the colour arrived with it; see `given`. */
  private get wrapped(): TemplateResult {
    /* `taken` where there was content, the source text where there was not —
       what is highlighted is `text`, which is already whichever of the two
       this block was given. */
    const written = this.taken ?? this.content ?? this.text;
    if (this.given) return html`${written}`;
    if (!this.lang) return html`<code>${written}</code>`;
    const coloured = highlight(this.lang, this.text);
    return coloured === null
      ? html`<code class="language-${this.lang}">${written}</code>`
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
    /* Above the frame and inside the element: a reader meets the caption before
       the block rather than in its chrome, but it is the block's, so the
       element places it. Nodes win over the attribute where there are both —
       they are what a renderer wrote, markup and all. */
    const caption = this.captioned
      ? html`${this.captioned}`
      : this.caption
        ? html`<div class="sds-code__caption">${this.caption}</div>`
        : undefined;

    return html`${caption}<div class="sds-code">
  ${head}
  <pre class="sds-code__body">${this.taken || this.content || this.source ? this.wrapped : lines(this.body.map((l) => this.line(l)), 0)}</pre>
</div>`;
  }
}

define('sds-code', SdsCode);
