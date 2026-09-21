/* The browser commands `vitest.config.ts` defines, as a test sees them. */

declare module 'vitest/browser' {
  interface BrowserCommands {
    /** The pointer down on the element, and held there. */
    hold: (selector: string) => Promise<void>;
    /** The pointer let go. */
    release: () => Promise<void>;
    /** The wheel turned over the element, by that many pixels down. */
    wheel: (selector: string, deltaY: number) => Promise<void>;
    /** The clipboard, held until given back. */
    takeClipboard: () => Promise<void>;
    giveClipboard: () => Promise<void>;
  }
}

export {};
