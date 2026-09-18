/* The design system's bundle entry: the drop-in's, plus what a preview
   needs. A preview in the artifact runs in a frame that fetches nothing, so
   the glyphs ride in the script rather than in a sprite. And a page there
   carries no module, so `SDS.html` and `SDS.unsafeHTML` are the only way a
   `body` or a cell gets markup after the upgrade. */

import { inlineIcons } from '../../packages/frontend/src/components/icon.ts';
import { ICON_SVG } from '../../packages/frontend/src/components/icons.svg.generated.ts';

export * from '../../packages/frontend/src/index.ts';
export { html, nothing } from 'lit';
export { unsafeHTML } from 'lit/directives/unsafe-html.js';

inlineIcons(ICON_SVG);
