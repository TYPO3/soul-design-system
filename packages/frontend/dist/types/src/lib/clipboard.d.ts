/** How long a button says it worked, in milliseconds. Long enough for a
    reader who looked somewhere else when they pressed. */
export declare const SAID = 1600;
/**
 * Write, and say if it happened.
 *
 * Two ways, because one of them is not always there. `navigator.clipboard`
 * exists only in a secure context. A reader opens a design system over http
 * on a LAN address or a `.test` domain as often as on localhost. A
 * button drawn only where it exists left no button on exactly the surfaces
 * a review happens on.
 */
export declare function toClipboard(text: string): Promise<boolean>;
