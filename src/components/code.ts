/* sds-code — a fenced block, its head and its copy button.

   Everything the machine reads, writes or names sets in Source Code Pro, at
   every size. Nothing in here is title-cased or prettified: `composer
   install` and `.agents/skills` are what they are.

   No line numbers unless something actually references them. A gutter of
   numbers nobody cites is decoration on the one surface that has the least
   room for it.

   Every class this frame emits is defined in `components.css` — the head's
   language, the diff's path, the copy button. `_specimen.css` is outside the
   `styles.css` closure, so a class borrowed from there renders unstyled on
   every surface that is not a specimen card. Both of these were. */

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
      by `sds-code__lang`, so the upper case is the stylesheet's, not yours.

      The attribute is `code-lang`, and the mismatch is deliberate: `lang` is a
      global HTML attribute naming the *human* language of the content, so
      `lang="json"` told every screen reader to switch to a language tag that
      does not exist — for the whole block, because the host is
      `display: contents` and language inherits regardless. Same collision the
      table's `scrollable` and the note's `heading` were renamed for. */
  lang?: CodeLang;
  /** An affordance for the head that is not the copy button — a filename, a
      count. Set `copy` instead for copying; the component owns that. */
  action?: TemplateResult;
  /** What the block is, in a sentence, above it. A renderer that captions a
      fenced block has somewhere to put it.

      A caption may also be written between the tags, as
      `<div class="sds-code__caption">`, and that is the form for a renderer
      whose caption carries markup — a literal, a link — and for a page that
      has to read before the element upgrades. Either way it belongs to the
      element: see `captioned`. */
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

/* A caption written between the tags, told apart from the block by the class
   the component itself would emit for it.

   There is no slot to name it with — these elements render light DOM — and a
   class the stylesheet already defines is the better marker for it anyway: it
   is what makes the caption read right in the window before the upgrade,
   where an invented attribute would have styled nothing.

   Nor an element of its own, the way `sds-tab-item` is one. `define()` writes
   every registered tag into the `display: contents` host rule, so a
   `sds-code-caption` would be a box that stops existing on upgrade and an
   unknown inline one before it — its appearance would have to be stated
   twice, under two names, for one sentence. An element is what something with
   its own author or its own behaviour gets; see `sds-field-error`. A caption
   that grows behaviour — an anchor, a number, a copy that includes it — earns
   one then.

   `nodeType` before `matches`, as in `given`: text nodes are children too. */
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

  /* Content written between the tags, taken before Lit renders over it.

     The element renders light DOM, so `render()` replaces its children — and
     the children are the whole point when the block comes from a renderer
     rather than from a story:

       <sds-code code-lang="bash" copy><code>…</code></sds-code>

     So they are lifted out on connect and handed back to the template as
     nodes. Lit renders a DOM node as a child value, and re-rendering moves
     the same nodes rather than copying them. */
  private taken: Node[] | null = null;

  /* The caption, where it too was written between the tags.

     A renderer that captions a fenced block holds the caption as nodes rather
     than as a string: it can carry a literal, a link, an emphasis, and the
     `caption` attribute would flatten all three. So it is written inside the
     element, in the class the component itself emits — which is also what a
     page reads before the element upgrades, and on one that runs no
     JavaScript at all. Neither is true of an attribute.

     Inside, and that is what this field is for. The theme drew it *beside*
     the element, which put the one piece of the block the component knows how
     to place outside the component: nothing kept the two together, and the
     caption's spacing was the document's rather than the block's.

     Kept apart from `taken`, because everything else here reads that as the
     block itself — the clipboard would copy the caption, and the highlighter
     would colour it as if it were a line of code. */
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

  /* Whether the block arrived already coloured.

     Two kinds of caller, one component. A story hands in source and the
     highlighter here runs over it; a renderer that highlights on its own —
     a documentation build, where the colour is decided once and shipped as
     HTML — hands in finished markup. Colouring that a second time is not
     wrong so much as wasteful: it would flatten the spans back to text and
     rebuild them from a smaller set of grammars.

     `hljs-` is the signal because it is the contract the two sides already
     share. `components.css` maps those classes and nothing else, so markup
     carrying them is markup this system can paint without being told.

     Kept as it came, wrapper and all: the `<code>` around it holds which
     lines are numbered and which are emphasised, and rewriting it would drop
     both — along with every language a server-side highlighter knows and the
     thirteen registered here do not. */
  private get given(): boolean {
    /* `nodeType` rather than `instanceof Element`: this getter is reached in
       Node when a page renders statically, where the constructor it would be
       compared against does not exist. */
    return (this.taken ?? []).some((node) => {
      if (node.nodeType !== 1) return false;
      const el = node as Element;
      return el.matches('[class*="hljs-"]') || el.querySelector('[class*="hljs-"]') !== null;
    });
  }

  /* Content written between the tags, in the `<code>` a code block is
     supposed to have.

     The element renders that wrapper, and the `language-` class on it, from
     its own `lang`. A caller writing

       <sds-code code-lang="json"><code class="language-json">…</code></sds-code>

     says the language twice, and the two can disagree unnoticed — `lang`
     paints the head, the class decides the highlighting. The component owns
     it, so a caller writes the body and nothing else.

     And it colours it. A renderer that names a language and leaves the block
     in one grey has done half the job, and every surface that used this used
     to finish it — the same highlighter, wired the same way, in each of them.
     It is the component's, so a consumer links two files and gets colour.

     Unless the colour arrived with the block. Then it is kept exactly as it
     came — see `given`.

     Where the system does not colour a language the author's own nodes are
     kept: what was written is better than a guess at what it meant. */
  private get wrapped(): TemplateResult {
    /* `taken` where there was content, the source text where there was not —
       what is highlighted is `text`, which is already whichever of the two
       this block was given. */
    const written = this.taken ?? this.text;
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
    /* Above the frame and inside the element: a caption says what the block
       is, and a reader meets that before the block rather than in its chrome —
       but it is the block's, so it is the element that places it.

       Whichever form it arrived in. The nodes win where there are both: they
       are what a renderer wrote, and the attribute beside them could only be
       the same sentence with its markup taken out. */
    const caption = this.captioned
      ? html`${this.captioned}`
      : this.caption
        ? html`<div class="sds-code__caption">${this.caption}</div>`
        : undefined;

    return html`${caption}<div class="sds-code">
  ${head}
  <pre class="sds-code__body">${this.taken || this.source ? this.wrapped : lines(this.body.map((l) => this.line(l)), 0)}</pre>
</div>`;
  }
}

define('sds-code', SdsCode);
