/* What every `.test.ts` frame gets before its first test.

   The system, registered once: the entry defines every element, and the
   stylesheet a consumer links. A test then writes markup into the body, or
   mounts a story into it, and asks the page questions — `frame.ts`. */

import '../../packages/frontend/src/styles/styles.css';
import '../../packages/frontend/src/styles/_specimen.css';
import '../../packages/frontend/src/index.ts';
import { setIconSprites } from '../../packages/frontend/src/components/icon.ts';

/* A test frame's own address is deep under the server root, so the
   relative path the drop-in assumes does not resolve from it. */
setIconSprites('/assets/icons/sprites/');
