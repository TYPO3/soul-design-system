/** If this system colours that language at all. */
export declare function highlights(lang: string): boolean;
/** The block, as markup with `hljs-` classes. Returns null where the system
    does not colour the language, so the caller can print the text it has
    rather than a guess. */
export declare function highlight(lang: string, source: string): string | null;
