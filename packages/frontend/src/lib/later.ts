/* A module the page fetches on its first use, beside the bundle. The engine
   and the highlighter are half the bundle, and most pages draw and colour
   nothing. A static render loads both first; see `eager.ts`. */
export interface Later<T> {
  /** The module, once it arrived. */
  readonly now: T | undefined;
  /** The module. The page fetches it once, for every caller. */
  load(): Promise<T>;
}

export function later<T>(fetch: () => Promise<T>): Later<T> {
  let got: T | undefined;
  let pending: Promise<T> | undefined;
  return {
    get now() {
      return got;
    },
    load: () => (pending ??= fetch().then((module) => (got = module))),
  };
}
