/* The mode, before the first paint.

   `sds-theme` reads `data-theme` from the root, so something has to write it.
   That cannot be a module, which defers by definition and arrives as a flash
   of the other mode. Without this the next page forgets the choice, which on a
   site of many is every click.

     <script src="soul-boot.js"></script>
     <link rel="stylesheet" href="soul.css"> */
const script = document.currentScript as HTMLScriptElement | null;
/* `sds-theme` defaults to this same name, so a page that names neither still
   has both ends on one key. `data-key` is for the second product on an
   origin, and then the element gets the same one. */
const key = script?.dataset['key'] ?? 'soul-theme';
const root = document.documentElement;

/** The stored choice, or nothing. A browser can refuse storage, and a page
    must still be a page. */
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
   and the switch draws its own mark for. A concrete mode written here is a
   decision the reader never made. The switch reads it back as a choice, so
   the machine's setting becomes a stop with no way back. */
const stored = chosen();
if (stored) root.dataset['theme'] = stored;
