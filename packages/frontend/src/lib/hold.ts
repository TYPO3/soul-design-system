/* The page held still under a surface that covers it: `data-sds-hold` on
   the root names what holds it. Set by the element that opens, not asked
   of the whole document on every change of style. */
export type Hold = 'deck' | 'modal';

const held = new Map<Hold, number>();

function write(): void {
  const names = [...held].filter(([, count]) => count > 0).map(([name]) => name);
  if (names.length) document.documentElement.setAttribute('data-sds-hold', names.join(' '));
  else document.documentElement.removeAttribute('data-sds-hold');
}

/** Hold the page for one surface. The answer lets it go, once. */
export function hold(name: Hold): () => void {
  held.set(name, (held.get(name) ?? 0) + 1);
  write();
  let done = false;
  return () => {
    if (done) return;
    done = true;
    held.set(name, (held.get(name) ?? 1) - 1);
    write();
  };
}
