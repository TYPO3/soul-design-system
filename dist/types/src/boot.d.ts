declare const script: HTMLScriptElement | null;
declare const key: string;
declare const root: HTMLElement;
/** The stored choice, or nothing. Storage can be denied, and a page must
    still be a page. */
declare function chosen(): 'light' | 'dark' | null;
declare const query: MediaQueryList;
declare function follow(): void;
declare const stored: "dark" | "light" | null;
