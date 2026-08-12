/** Whether this system colours that language at all. */
export declare function highlights(lang: string): boolean;
/** The block, as markup carrying `hljs-` classes. Returns null where the
    language is one the system does not colour, so the caller can print the
    text it was given rather than a guess. */
export declare function highlight(lang: string, source: string): string | null;
