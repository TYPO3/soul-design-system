/* The mode, before the first paint.

   `sds-theme` reads what the document already says — `data-theme` on the root
   element — because reading its own idea of it would disagree with what the
   browser has already painted. Something has to write it, and it cannot be
   the element: a module is deferred by definition, so by the time it runs the
   page is on screen and a stored choice arrives as a flash of the other mode.

   So this is the one script in the system that is NOT a module. It is loaded
   without `defer` in the head, runs synchronously before the stylesheets do
   their work, and is four lines long for exactly that reason.

     <script src="soul-boot.js"></script>
     <link rel="stylesheet" href="soul.css">

   Without it a switch still switches, and the choice is still stored — it is
   simply forgotten on the next page, which on a documentation site is every
   click. That is the bug this file exists to prevent.

   The key can be named on the tag, because two products on one origin are two
   keys:

     <script src="soul-boot.js" data-key="handbook-theme"></script>
*/
const script = document.currentScript as HTMLScriptElement | null;
const key = script?.dataset['key'] ?? 'soul-theme';

try {
  const mode = localStorage.getItem(key);
  if (mode === 'light' || mode === 'dark') {
    document.documentElement.dataset['theme'] = mode;
  }
} catch {
  /* Storage denied — private mode, or a policy. The reader's own setting
     stands, which is the default anyway. */
}
