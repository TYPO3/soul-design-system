type Read = () => (() => void) | undefined;
/** Read in the next frame, with every other element that asks. */
export declare function readSoon(read: Read): void;
/** Drop a reading an element asked for and no longer needs. */
export declare function dropReading(read: Read): void;
export {};
