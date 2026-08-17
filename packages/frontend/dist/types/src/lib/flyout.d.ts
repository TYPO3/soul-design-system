/** Whether the engine places a popover against its anchor on its own. Asked of
    the engine rather than of a version, and read at every open: a page can be
    moved between windows and a test may answer differently on purpose. */
export declare const anchored: () => boolean;
/** Which edge of the anchor the panel lines up with. */
export type Side = 'start' | 'end';
/** Put `panel` under `anchor` and keep it there. Returns what stops it: the
    page moves under a panel that is out of flow, and a listener left behind
    goes on measuring a control that has been taken off the page.

    Scroll is taken in the capture phase, because what scrolls is as often a
    box on the page as the page itself, and `scroll` does not bubble from one. */
export declare function place(panel: HTMLElement, anchor: HTMLElement, side: Side, gapFrom: string): () => void;
