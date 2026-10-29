/* The page's mode, watched once for every element that follows it. One
   observer on the root and one listener on the machine's setting tell
   every caller in a set. */
type Hear = () => void;

const written = new Set<Hear>();
const machine = new Set<Hear>();
let watch: MutationObserver | null = null;
let dark: MediaQueryList | null = null;

const tell = (who: Set<Hear>) => (): void => {
  for (const hear of [...who]) hear();
};
const toldMachine = tell(machine);

/** Hear every change of `data-theme` on the root. The answer stops it. */
export function onWritten(hear: Hear): () => void {
  written.add(hear);
  if (!watch) {
    watch = new MutationObserver(tell(written));
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
  return () => {
    written.delete(hear);
    if (!written.size) {
      watch?.disconnect();
      watch = null;
    }
  };
}

/** If the machine asks for dark, and every change of that. The answer stops it. */
export function onMachine(hear: Hear): { dark: () => boolean; stop: () => void } {
  machine.add(hear);
  if (!dark) {
    dark = matchMedia('(prefers-color-scheme: dark)');
    dark.addEventListener('change', toldMachine);
  }
  return {
    dark: () => dark?.matches ?? false,
    stop: () => {
      machine.delete(hear);
      if (!machine.size) {
        dark?.removeEventListener('change', toldMachine);
        dark = null;
      }
    },
  };
}
