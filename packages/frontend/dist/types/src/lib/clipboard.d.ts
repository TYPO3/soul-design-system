/** How long a button says it worked, in milliseconds. Long enough to be read
    where a reader was looking somewhere else when they pressed. */
export declare const SAID = 1600;
/**
 * Write, and say whether it happened.
 *
 * Two ways, because one of them is not always there: `navigator.clipboard`
 * exists only in a secure context, and a design system is looked at over http
 * on a LAN address or a `.test` domain as often as on localhost. Asking whether
 * it exists and drawing no button when it does not is what this used to do —
 * which left no icon, no press and no hover on exactly the surfaces it is
 * reviewed on, and looked like the component was broken.
 */
export declare function toClipboard(text: string): Promise<boolean>;
