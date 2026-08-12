/* What this tree renders with the theme, and where each one lands.

   Two readers: `scripts/guides.ts` renders them, and `scripts/embed.ts` puts
   the specimen cards beside their documents first. Written once, because a
   source named in one and forgotten in the other is a page that renders
   against nothing. */
import { join } from 'node:path';

import { GENERATED, ROOT } from './cards.ts';

export interface Project {
  /** What it is called in the log. */
  name: string;
  /** The documents, and the `guides.xml` beside them. */
  source: string;
  /** Its own root: a rendered site resolves everything relative to one. */
  out: string;
}

export const PROJECTS: readonly Project[] = [
  /* The manual and the landing page. Renders into the publish root, because
     that is what Pages serves. */
  { name: 'docs', source: join(ROOT, 'docs'), out: join(GENERATED, 'site') },
  /* The acceptance test for the theme: every node the renderer can emit, once,
     where it can be looked at. A control surface rather than a published one,
     so it is a root of its own beside the publish root and not a directory
     inside it — what is published is then the whole of what was rendered
     there, with nothing to remember to take back out. */
  {
    name: 'acceptance',
    source: join(ROOT, 'packages', 'guides-theme', 'acceptance'),
    out: join(GENERATED, 'acceptance'),
  },
];
