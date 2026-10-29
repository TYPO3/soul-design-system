type Hear = () => void;
/** Hear every change of `data-theme` on the root. The answer stops it. */
export declare function onWritten(hear: Hear): () => void;
/** If the machine asks for dark, and every change of that. The answer stops it. */
export declare function onMachine(hear: Hear): {
    dark: () => boolean;
    stop: () => void;
};
export {};
