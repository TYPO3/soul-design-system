/* The design system's bundle entry: the drop-in's, plus what a preview
   script needs to set a property that takes a template. A page in the
   artifact carries no module. So `SDS.html` and `SDS.unsafeHTML` are the
   only way a `body` or a cell gets markup after the upgrade. */

export * from '../../packages/frontend/src/index.ts';
export { html, nothing } from 'lit';
export { unsafeHTML } from 'lit/directives/unsafe-html.js';
