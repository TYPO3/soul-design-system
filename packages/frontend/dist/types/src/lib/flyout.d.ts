/** If the engine places a popover against its anchor on its own. Asked of the
    engine rather than of a version, and read at every open. A page can move
    between windows, and a test can answer differently on purpose. */
export declare const anchored: () => boolean;
/** Which edge of the anchor the panel lines up with. */
export type Side = 'start' | 'end';
/** Put `panel` under `anchor` and keep it there. Returns what stops it. The
    page moves under a panel that is out of flow. A listener left behind
    measures a control that is no longer on the page.

    Scroll comes in the capture phase. What scrolls is as often a box on the
    page as the page itself, and `scroll` does not bubble from one. */
export declare function place(panel: HTMLElement, anchor: HTMLElement, side: Side, gapFrom: string): () => void;
