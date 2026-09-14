/* sds-code — a fenced block, its head and its copy button.

   Everything the machine reads, writes or names sets in Source Code Pro, at
   every size, and nothing in here is title-cased or prettified. No line numbers
   unless something references them: a gutter nobody cites is decoration on the
   surface with the least room for it.

   `components.css` defines every class this frame emits. `_specimen.css`
   is outside the `styles.css` closure, so a class from there renders
   unstyled anywhere that is not a specimen card. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import './icon.ts';
import { highlight } from '../lib/highlight.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';
import { SAID, toClipboard } from '../lib/clipboard.ts';

/** What a line in a code block IS, rather than markup someone assembled.
    `shell` is a command, and its `$` prompt is one of the three places
    `--accent` appears. `ok` is a success line, marked with the mono font's `✓`
    because emoji are forbidden outright. `comment` and `plain` are literal.
    `remark` is a reader's sentence in the run of lines: not code, so not
    mono, and it wraps. */
export type CodeKind = 'plain' | 'shell' | 'comment' | 'ok' | 'remark';

export interface CodeLine {
  kind: CodeKind;
  text: string;
  /** A fragment inside the line set as a command — a path, a flag, a tool
      name. `ok('published 9 skills to', '.agents/skills')` used to be a
      second argument to a free function; it is a field now. */
  code?: string;
}

/** The languages this system supports in a code block. A declaration, not a
    survey. A new one means the highlighter knows the identifier and a
    specimen proves it reads right. `stories/lib/languages.ts` is that
    specimen, typed against this union, so no language exists without one. */
export type CodeLangName =
  | 'bash'
  | 'css'
  | 'diff'
  | 'html'
  | 'javascript'
  | 'json'
  | 'markdown'
  | 'php'
  | 'scss'
  | 'sql'
  | 'text'
  | 'tsconfig'
  | 'twig'
  | 'typescript'
  | 'typoscript'
  | 'xml'
  | 'yaml';

/** The same, open at the edges, because the value arrives from a Markdown
    fence, and a refusal to print a word is not a service. The union catches
    the near miss, `yml` for `yaml`, which a highlighter answers in silence. */
export type CodeLang = CodeLangName | (string & {});

/** A sentence about one line of a block, by whoever reads it: a review's
    finding at the code. `line` counts as the file does, from `start`. The
    block marks that line's number and lists the sentence under itself. */
export interface Remark {
  line: number;
  text: string;
}

export interface CodeBlockProps {
  /** The language, lower case as a fence writes it; the upper case belongs to
      `sds-code__lang`. The attribute is `code-lang` on purpose. `lang` is a
      global attribute for the *human* language. `lang="json"` sends every
      screen reader to a language tag that does not exist, and the whole block
      inherits it. */
  lang?: CodeLang;
  /** An affordance for the head that is not the copy button: a filename, a
      count. For a copy, set `copy` instead; the component owns that. */
  action?: TemplateResult;
  /** What the block is, in a sentence, above it. It can also stand between
      the tags as `<div class="sds-code__caption">`. That is the form for a
      caption with markup, and for a page read before the element upgrades.
      Either way it belongs to the element: see `captioned`. */
  caption?: string;
  /** A block as text, coloured by `lang` exactly as content between the tags
      is. The two are the same block from two kinds of caller. Content for a
      renderer that holds markup, this for one that holds the source. That is
      a story, or a static render, which carries no children at all. */
  source?: string;
  /** The block as lines, each with its own kind — set from script, being a
      list. Content between the tags is the same block from a caller that
      already holds markup. */
  body: readonly CodeLine[];
  /** The button that puts the block on the clipboard. The component owns it:
      an `action` of a caller’s own is for something else. */
  copy?: boolean;
  /** Sentences about lines of the block, for a block that arrives as
      `source` or as text between the tags. They stand under the block, each
      with the number of its line, and the line carries a mark. None goes to
      the clipboard: they are about the block, not part of it. */
  remarks?: readonly Remark[];
  /** The number the first line has in its file. With it the block draws
      the numbers, because something cites them: a caption, a finding. A
      remark cites one too, so remarks draw them from one where there is no
      `start`. Without either there is no gutter, as nothing refers to one. */
  start?: number;
}

/* Highlighted markup as one entry per line. A span the highlighter opened on
   one line closes at the break and opens again on the next. A remark goes
   between two lines, and a span across the break swallows it. */
function perLine(markup: string): string[] {
  const out: string[] = [];
  const open: string[] = [];
  let line = '';
  for (const [token] of markup.matchAll(/<span[^>]*>|<\/span>|\n|[^<\n]+|</g)) {
    if (token === '\n') {
      out.push(line + '</span>'.repeat(open.length));
      line = open.join('');
      continue;
    }
    if (token === '</span>') open.pop();
    else if (token.startsWith('<span')) open.push(token);
    line += token;
  }
  out.push(line + '</span>'.repeat(open.length));
  return out;
}

/** Text as markup: the three characters that read as tags, escaped. */
const escape = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* A caption between the tags, told apart by the class the component emits
   for it. Light DOM has no slot to name it with, and a class the stylesheet
   defines makes the caption read right before the upgrade. Not an element
   of its own: one sentence needs its appearance stated once. `nodeType`
   before `matches`, as in `given`: text nodes are children. */
const isCaption = (node: Node): boolean =>
  node.nodeType === 1 && (node as Element).matches('.sds-code__caption');

export class SdsCode extends SdsElement {
  static override properties = {
    lang: { type: String, reflect: true, attribute: 'code-lang' },
    caption: { type: String },
    source: { type: String },
    /* Styled lines, which no attribute can carry. A shell prompt, a comment
       and a result are three different spans. A flat string throws away the
       only thing the component does. */
    body: { type: Array },
    action: { type: Object },
    copy: { type: Boolean, reflect: true },
    copied: { type: Boolean, state: true },
    remarks: { type: Array },
    start: { type: Number },
  };

  declare lang: CodeLang;
  declare caption: string;
  declare source: string;
  declare body: readonly CodeLine[];
  declare action?: TemplateResult;
  declare copy: boolean;
  declare copied: boolean;
  declare remarks: readonly Remark[];
  declare start: number;

  /* Content between the tags, taken before Lit renders over it. Light DOM
     means `render()` replaces the children, and the children are the whole
     point where a renderer wrote the block. Lifted on connect and handed
     back as nodes. Lit renders a node as a child value, and a re-render
     moves the same nodes and does not copy them. */
  private taken: Node[] | null = null;

  /* The caption, where it too stood between the tags, as nodes. It carries a
     literal, a link or an emphasis, and an attribute flattens all three.
     Inside the element, so the block places it. Beside it, nothing keeps the
     two together. Apart from `taken`, which everything else here reads as
     the block itself. */
  private captioned: Node[] | null = null;

  constructor() {
    super();
    this.lang = '';
    this.caption = '';
    this.source = '';
    this.body = [];
    this.copy = false;
    this.copied = false;
    this.remarks = [];
    this.start = 0;
  }

  override connectedCallback(): void {
    const written = this.lifted();
    const caption = written.filter(isCaption);
    const said = written.filter((node) => !isCaption(node));
    if (caption.length) this.captioned = caption;
    if (said.length) this.taken = said;
    super.connectedCallback();
  }

  /** What the block puts on the clipboard: what it says, and none of its
      frame. Read from the content, not the rendering. In light DOM the
      element's own text is the head too, so a paste starts with the language
      and the word on the button. The `$` goes, for the reason it is a span
      of its own. It is the prompt, and in a shell it is an error. */
  private get text(): string {
    const said = this.taken
      ? this.written
      : this.source || this.body.map(({ text, code }) => (code ? `${text} ${code}` : text)).join('\n');
    return said.replace(/^\n+/, '').replace(/\n+$/, '');
  }

  /** The text between the tags, without the comments, which are not the
      author's. A template that interpolates its content leaves Lit's own
      markers among the children, and `textContent` reads a comment's body
      like any other. */
  private get written(): string {
    return (this.taken ?? [])
      .filter((node) => node.nodeType !== 8)
      .map((node) => node.textContent ?? '')
      .join('');
  }

  private async take(): Promise<void> {
    /* Silence is better than a check mark for something that did not happen.
       But both ways have to have run first. */
    if (!(await toClipboard(this.text))) return;
    this.copied = true;
    setTimeout(() => { this.copied = false; }, SAID);
  }

  /* Always drawn where the block asked for one. A question to the browser
     about its clipboard, with no button on a no, left no button on every
     origin outside a secure context. That is most of the ones a design
     system gets its review on; see `lib/clipboard.ts`. */
  private get copyButton(): TemplateResult | undefined {
    if (!this.copy) return undefined;
    return html`<button type="button" class="sds-code__copy${this.copied ? ' is-copied' : ''}" aria-label="Copy this block" @click="${() => void this.take()}"><span class="sds-code__glyph"><sds-icon name="actions-duplicate"></sds-icon></span><span class="sds-code__copied"><sds-icon name="actions-check"></sds-icon></span><span>${this.copied ? 'copied' : 'copy'}</span></button>`;
  }

  /* The lines the free `comment()`, `shell()` and `ok()` helpers used to
     build. They were three exported functions that assembled markup a caller
     then handed back in. That made the component's own output something any
     caller can half-write. A line is data now, and only this file turns it
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
      case 'remark':
        return html`<span class="sds-code__remark"><span class="sds-code__remark-text">${text}</span></span>`;
      default:
        return html`${text}${tail}`;
    }
  }

  /* If the block arrived with its colour. A build that highlights on its own
     hands in complete markup. A second pass flattens the spans back to text
     and rebuilds them from fewer grammars. `hljs-` is the signal because
     `components.css` maps those classes and nothing else. Wrapper and all:
     the `<code>` holds which lines carry numbers. */
  private get given(): boolean {
    /* Markup handed over as a property is what a renderer wrote, arriving
       where there are no children to read it out of — see `SdsElement`. */
    if (this.content) return true;
    /* `nodeType` and not `instanceof Element`. A static render reaches this
       getter in Node, where that constructor does not exist. */
    return (this.taken ?? []).some((node) => {
      if (node.nodeType !== 1) return false;
      const el = node as Element;
      return el.matches('[class*="hljs-"]') || el.querySelector('[class*="hljs-"]') !== null;
    });
  }

  /* Content between the tags, in the `<code>` a code block has. The element
     renders that wrapper and its `language-` class from `lang`. So a caller
     cannot say the language twice and have the two disagree. One paints the
     head, the other decides the colour. It colours the block too, unless the
     colour arrived with it; see `given`. */
  private get wrapped(): TemplateResult {
    /* `taken` where there was content, the source text where there was not.
       The colour goes onto `text`, which is already whichever of the two this
       block got. */
    const written = this.taken ?? this.content ?? this.text;
    if (this.given) return html`${written}`;
    if (this.remarks.length || this.start) return this.lined;
    if (!this.lang) return html`<code>${written}</code>`;
    const coloured = highlight(this.lang, this.text);
    return coloured === null
      ? html`<code class="language-${this.lang}">${written}</code>`
      : html`<code class="language-${this.lang}">${unsafeHTML(coloured)}</code>`;
  }

  /** Where the block's lines start, as the numbers say: `start`, or one
      where nothing set it and a remark still counts. */
  private get first(): number {
    return this.start || 1;
  }

  /** The row a cited line is, held inside the block. A line the block does
      not have lands at the nearer edge, so a wrong number is a thing a
      reader sees, and not nothing. */
  private rowOf(line: number, rows: number): number {
    return Math.min(Math.max(line - this.first, 0), rows - 1);
  }

  /* The block as numbered lines. Built as markup, because the colour is
     markup and every line has to become a block with its number in front.
     A line a remark cites carries a mark: the number in the page's ink. The
     gutter is as wide as the last number, and the width goes onto the
     element as a property. */
  private get lined(): TemplateResult {
    const coloured = this.lang ? highlight(this.lang, this.text) : null;
    const rows = perLine(coloured ?? escape(this.text));
    const cited = new Set(this.remarks.map(({ line }) => this.rowOf(line, rows.length)));
    const digits = String(this.first + rows.length - 1).length;
    const markup = rows
      .map((row, at) =>
        `<span class="sds-code__row${cited.has(at) ? ' sds-code__row--cited' : ''}">` +
        `<span class="sds-code__no">${this.first + at}</span>${row}</span>`)
      .join('');
    return html`<code class="${this.lang ? `language-${this.lang}` : ''}" style="--sds-code-no-width:${digits}ch">${unsafeHTML(markup)}</code>`;
  }

  /* The remarks under the block, each with the number of its line. Prose,
     and outside the machine's box: the block stays what the machine wrote,
     and the number is the way from the sentence to the line. */
  private get remarked(): TemplateResult | undefined {
    if (!this.remarks.length) return undefined;
    const rows = this.text.split('\n').length;
    return html`<dl class="sds-code__remarks">${this.remarks.map(({ line, text }) => html`
    <dt>${this.first + this.rowOf(line, rows)}</dt>
    <dd>${text}</dd>`)}
  </dl>`;
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
    /* Above the frame and inside the element. A reader meets the caption
       before the block, not in its chrome, but it is the block's, so the
       element places it. Nodes win over the attribute where there are both.
       They are what a renderer wrote, markup and all. */
    const caption = this.captioned
      ? html`${this.captioned}`
      : this.caption
        ? html`<div class="sds-code__caption">${this.caption}</div>`
        : undefined;

    return html`${caption}<div class="sds-code">
  ${head}
  <pre class="sds-code__body">${this.taken || this.content || this.source ? this.wrapped : lines(this.body.map((l) => this.line(l)), 0)}</pre>${this.remarked ? html`
  ${this.remarked}` : ''}
</div>`;
  }
}

define('sds-code', SdsCode);
