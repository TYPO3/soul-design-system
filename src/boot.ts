/* The mode, before the first paint.

   `sds-theme` reads `data-theme` from the root, so something has to write it —
   and it cannot be a module, which is deferred by definition and would arrive
   as a flash of the other mode. Without this the choice is forgotten on the
   next page, which on a site of many is every click.

     <script src="soul-boot.js" data-key="soul-theme"></script>
     <link rel="stylesheet" href="soul.css"> */
const script = document.currentScript as HTMLScriptElement | null;
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

/* Always an explicit mode: without `data-theme` the page still renders in the
   reader's setting, but the switch cannot say which and shows neither side
   pressed. Writing it turns a preference into a decision, and a decision does
   not follow the machine at dusk — so the query is kept until somebody
   chooses. */
const query = matchMedia('(prefers-color-scheme: dark)');

function follow(): void {
  if (chosen()) return;
  root.dataset['theme'] = query.matches ? 'dark' : 'light';
}

const stored = chosen();
if (stored) {
  root.dataset['theme'] = stored;
} else {
  follow();
}

query.addEventListener('change', follow);
/* Fired when a reader gives the machine back. */
document.addEventListener('sds-theme-change', (event) => {
  if ((event as CustomEvent<{ theme: string | null }>).detail.theme === null) follow();
});
