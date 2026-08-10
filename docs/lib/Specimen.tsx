/* Embed a guideline specimen card in an MDX page.

   The guideline cards are not generated and not components: they document
   the token layer, have no props to vary, and each one is a complete HTML
   document that pins its own theme and declares the exact viewport the
   Design System pane renders it at. Embedding them in an iframe at that
   viewport is not a shortcut — it is the only way this page shows what the
   pane shows. Re-rendering their markup inline would put them on the docs
   page's own theme and width and quietly document something else.

   Storybook's MDX runs on React, which is why this one file is `.tsx`. It is
   the documentation shell, not the design system: nothing under `src/`
   imports React, and nothing ever should. */

import React, { useEffect, useRef } from 'react';

export interface SpecimenProps {
  /** Path from the repo root, e.g. `guidelines/colors-text.card.html`. */
  src: string;
  /** `WxH`, matching the card's own `@dsCard` viewport. */
  viewport: string;
  title: string;
}

/* An iframe does not inherit `data-theme` from the page around it, so the
   toolbar's light/dark switch stops at its edge — which makes the control
   look broken on exactly the pages that are mostly embeds.

   A card that pins **light** means it: `colors-surfaces` proves both modes
   side by side and `brand-lockup-light` exists to show the light one. Those
   are left alone. Everything else carries the dark default, which is a
   default and not a statement, so it follows the toolbar.

   The theme is read from this document's `data-theme`, which
   `.storybook/preview.ts` keeps current for the whole preview — including
   docs pages, where no decorator runs. Storybook's own `useGlobals` is a
   preview hook and throws outside a story, which is exactly what an MDX page
   is.

   The rule about pinned cards is the one the old dev gallery applied; it was
   lost when these pages replaced it, and this is it written down again. */
function useThemeBridge(frame: React.RefObject<HTMLIFrameElement | null>) {
  const pinned = useRef<boolean>(false);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;

    const apply = () => {
      const doc = el.contentDocument;
      if (!doc?.documentElement || pinned.current) return;
      doc.documentElement.dataset['theme'] = document.documentElement.dataset['theme'] ?? 'dark';
    };

    const onLoad = () => {
      const doc = el.contentDocument;
      /* Read the card's own choice once, before overwriting it. */
      pinned.current = doc?.documentElement?.dataset['theme'] === 'light';
      apply();
    };

    el.addEventListener('load', onLoad);
    /* Frames are lazy: one scrolled into view after a switch arrives with its
       own theme, so this runs on every load and not only on the first. */
    if (el.contentDocument?.readyState === 'complete') onLoad();

    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      el.removeEventListener('load', onLoad);
      observer.disconnect();
    };
  }, [frame]);
}

export function Specimen({ src, viewport, title }: SpecimenProps) {
  const [w, h] = viewport.split('x');
  const frame = useRef<HTMLIFrameElement>(null);
  useThemeBridge(frame);

  return (
    <figure style={{ margin: '0 0 28px' }}>
      <iframe
        ref={frame}
        src={`/${src}`}
        width={w}
        height={h}
        title={title}
        loading="lazy"
        style={{
          border: '1px solid var(--border-subtle, #2B2823)',
          borderRadius: 6,
          maxWidth: '100%',
          display: 'block',
          colorScheme: 'normal',
        }}
      />
      <figcaption
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: 11,
          opacity: 0.6,
          marginTop: 8,
        }}
      >
        {title} · {viewport} · <code>{src}</code>
      </figcaption>
    </figure>
  );
}
