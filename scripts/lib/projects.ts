/* What this tree renders with the theme, and where each one lands.

   Two readers: `scripts/guides.ts` renders them, and `scripts/embed.ts` puts
   the specimen cards beside their documents first. Written once, because a
   source named in one and forgotten in the other is a page that renders
   against nothing. */
import { join } from 'node:path';

import { GENERATED, ROOT } from './cards.ts';

export interface Project {
  /** Its name in the log. */
  name: string;
  /** The documents, and the `guides.xml` beside them. */
  source: string;
  /** Its own root: a rendered site resolves everything relative to one. */
  out: string;
  /** What that root is, for whoever ran the render. */
  what: string;
  /** The marks its `guides.xml` points at, as `<file in _images/>: <asset>`.
      A signet is crisp only in its own box. So the file a tree names comes
      from the drawing rather than stays beside it by hand. */
  marks?: Readonly<Record<string, string>>;
}

export const PROJECTS: readonly Project[] = [
  /* The manual and the landing page. Renders into the publish root, because
     that is what Pages serves. */
  {
    name: 'docs',
    source: join(ROOT, 'docs'),
    out: join(GENERATED, 'site'),
    what: 'the publish root, and everything in it goes public',
    /* The bar draws at 24 and the two favicon slots are 16 and 32. That is
       why three sizes stand here, and which asset each one is. */
    marks: {
      'signet.svg': 'design-system-signet-m.svg',
      'signet-s.svg': 'design-system-signet-s.svg',
      'signet-l.svg': 'design-system-signet-l.svg',
    },
  },
  /* The acceptance test for the theme: every node the renderer can emit, once,
     where a reader can look at it. A control surface rather than a public one.
     So it is a root of its own beside the publish root and not a directory
     inside it. What goes public is then the whole of what rendered there, with
     nothing to remember to take back out. */
  {
    name: 'acceptance',
    source: join(ROOT, 'packages', 'guides-theme', 'acceptance'),
    out: join(GENERATED, 'acceptance'),
    what: 'the theme\'s control surface, rendered every run and published never',
  },
];
