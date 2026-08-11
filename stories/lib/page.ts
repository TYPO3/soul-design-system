/* What a whole page is, twice.

   A page layout is documented two ways and they are not the same thing.

   In Storybook it has to be **live**: the tabs switch, the rail folds, the
   dialog opens, the field takes typing. A page of static markup proves the
   layout and nothing else, and a layout nobody can click through is where a
   broken control hides — every story is opened by the test suite, so a live
   page is a page under test.

   In `screens/` it has to be **static**: the Design System pane opens those
   files with `styles.css` and no JavaScript at all, and `renderStatic`
   flattens no element that was given children.

   So a page is written once, as a function of how it is being rendered, and
   the branch appears only where the two genuinely differ — which is the
   handful of components that take their content between the tags. Everything
   else is the same element in both: `renderStatic` flattens it, the browser
   upgrades it. */

/** Which of the two renderings is being asked for. */
export interface PageMode {
  /** True while composing the file under `screens/`. */
  flat?: boolean;
}
