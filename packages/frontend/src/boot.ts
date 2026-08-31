/* The mode, before the first paint.

   `sds-theme` reads `data-theme` from the root, so something has to write it —
   and it cannot be a module, which is deferred by definition and would arrive
   as a flash of the other mode. Without this the choice is forgotten on the
   next page, which on a site of many is every click.

     <script src="soul-boot.js"></script>
     <link rel="stylesheet" href="soul.css"> */
const script = document.currentScript as HTMLScriptElement | null;
/* `sds-theme` defaults to this same name, so a page that names neither still
   has both ends reading one key. `data-key` is for the second product on an
   origin, and then the element is given the same one. */
const key = script?.dataset['key'] ?? 'soul-theme';
const root = document.documentElement;

/** The stored choice, or nothing. Storage can be denied, and a page must
    still be a page. */
function chosen(): 'light' | 'dark' | null {
  try {
    const mode = localStorage.getItem(key);
    return mode === 'light' || mode === 'dark' ? mode : null;
  } catch {
    return null;
  }
}

/* The attribute is the choice and nothing else. Absent is the machine's
   setting — a state of its own, which the tokens answer through `light-dark()`
   and the switch draws its own mark for. Resolving it to a concrete mode here
   wrote a decision the reader never made: the switch read it back as a choice,
   so the machine's setting was a stop it could never return to, and on a
   machine set to dark the first press appeared to do nothing at all. */
const stored = chosen();
if (stored) root.dataset['theme'] = stored;
