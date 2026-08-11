import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
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
export type CodeLang = 'bash' | 'css' | 'diff' | 'html' | 'javascript' | 'json' | 'markdown' | 'php' | 'sql' | 'text' | 'twig' | 'typescript' | 'typoscript' | 'xml' | 'yaml' | (string & {});
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
    /** A block as text, highlighted by `lang` exactly as content between the
        tags is. The two are the same block from two kinds of caller: content
        for a renderer that already holds markup, this for one that holds the
        source — a story, or a page that has to render statically, where
        children are not carried at all. */
    source?: string;
    body: readonly CodeLine[];
    copy?: boolean;
}
export declare class SdsCode extends SdsElement {
    static properties: {
        lang: {
            type: StringConstructor;
            reflect: boolean;
        };
        caption: {
            type: StringConstructor;
        };
        source: {
            type: StringConstructor;
        };
        body: {
            type: ArrayConstructor;
        };
        action: {
            type: ObjectConstructor;
        };
        copy: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        copied: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    lang: CodeLang;
    caption: string;
    source: string;
    body: readonly CodeLine[];
    action?: TemplateResult;
    copy: boolean;
    copied: boolean;
    private taken;
    constructor();
    connectedCallback(): void;
    /** Whatever the block would put on the clipboard: what it says, and none of
        what frames it.
  
        Read from the content rather than from the rendering. The element renders
        light DOM, so its own text is the head as well — `bash` and `copy` landed
        on the clipboard ahead of the first line, and a paste into a terminal
        began with the word for the button that had just been pressed.
  
        A `$` is dropped for the same reason it is a span of its own: it is the
        prompt, not the command, and pasted into a shell it is an error on line
        one. Blank lines at either end go the way a shell would not want them. */
    private get text();
    /** The text between the tags. Comments are skipped, and they are not the
        author's: a template that interpolates its content leaves Lit's own
        markers among the children, and `textContent` reads a comment's body
        like any other. */
    private get written();
    private toClipboard;
    private clipboard;
    private get copyButton();
    private line;
    private get wrapped();
    protected render(): TemplateResult;
}
