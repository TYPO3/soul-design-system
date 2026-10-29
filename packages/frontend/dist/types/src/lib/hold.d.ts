export type Hold = 'deck' | 'modal';
/** Hold the page for one surface. The answer lets it go, once. */
export declare function hold(name: Hold): () => void;
