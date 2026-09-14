import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
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
/** The languages this system supports in a code block. A declaration, not a
    survey. A new one means the highlighter knows the identifier and a
    specimen proves it reads right. `stories/lib/languages.ts` is that
    specimen, typed against this union, so no language exists without one. */
export type CodeLangName = 'bash' | 'css' | 'diff' | 'html' | 'javascript' | 'json' | 'markdown' | 'php' | 'scss' | 'sql' | 'text' | 'tsconfig' | 'twig' | 'typescript' | 'typoscript' | 'xml' | 'yaml';
/** The same, open at the edges, because the value arrives from a Markdown
    fence, and a refusal to print a word is not a service. The union catches
    the near miss, `yml` for `yaml`, which a highlighter answers in silence. */
export type CodeLang = CodeLangName | (string & {});
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
}
export declare class SdsCode extends SdsElement {
    static properties: {
        lang: {
            type: StringConstructor;
            reflect: boolean;
            attribute: string;
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
    private captioned;
    constructor();
    connectedCallback(): void;
    /** What the block puts on the clipboard: what it says, and none of its
        frame. Read from the content, not the rendering. In light DOM the
        element's own text is the head too, so a paste starts with the language
        and the word on the button. The `$` goes, for the reason it is a span
        of its own. It is the prompt, and in a shell it is an error. */
    private get text();
    /** The text between the tags, without the comments, which are not the
        author's. A template that interpolates its content leaves Lit's own
        markers among the children, and `textContent` reads a comment's body
        like any other. */
    private get written();
    private take;
    private get copyButton();
    private line;
    private get given();
    private get wrapped();
    protected render(): TemplateResult;
}
