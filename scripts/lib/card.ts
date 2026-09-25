/* A story as the static markup a card ships, by the road a page takes.

   The story becomes the markup its author wrote, the prerenderer draws every
   element into itself, and the tags come off. So content between the tags,
   and every region with a name, reaches a card as it reaches a page. */

import type { TemplateResult } from 'lit';
import { flattenUpgraded } from '../../packages/frontend/src/lib/render.ts';
import { TAGS } from '../../packages/frontend/src/index.ts';
import { authored } from './authored.ts';
import { prerender } from './prerender.ts';

export function renderCard(template: TemplateResult): string {
  const { html, props } = authored(template);
  return flattenUpgraded(prerender(html, TAGS, props));
}
