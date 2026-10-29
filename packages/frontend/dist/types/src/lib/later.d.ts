export interface Later<T> {
    /** The module, once it arrived. */
    readonly now: T | undefined;
    /** The module. The page fetches it once, for every caller. */
    load(): Promise<T>;
}
export declare function later<T>(fetch: () => Promise<T>): Later<T>;
