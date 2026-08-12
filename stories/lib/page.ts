/* What a whole page is, twice.

   In Storybook a page has to be **live** — the tabs switch, the rail folds, the
   field takes typing — because a layout nobody can click through is where a
   broken control hides, and every story is opened by the test suite. In
   `screens/` it has to be **static**: the pane opens those files with no
   JavaScript, and `renderStatic` flattens no element given children.

   So a page is written once, as a function of how it is rendered, and branches
   only where the two genuinely differ: the components that take content. */

/** Which of the two renderings is being asked for. */
export interface PageMode {
  /** True while composing the file under `screens/`. */
  flat?: boolean;
}
