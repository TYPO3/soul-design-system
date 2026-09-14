/* sds-icon-tile — one glyph in a wall of them.

   Not a card. A reader reads a card: a title, a paragraph, a way on. A wall of
   four hundred cards is four hundred titles to read before the reader reaches
   the one drawing they came for. A reader scans this instead. The glyph fills
   the box and the identifier under it stays quiet. A reader finds a set like
   this by shape, and the name only matters after that.

   The whole tile is one anchor round its own contents, which it can be because
   it holds nothing else pressable. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId, type IconSize } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** How big the glyph draws, and it is not a decision a tile makes. A reader
    scans a wall at one distance. Two sizes in it are two walls, and one tile
    larger than its neighbours is a tile that claims to matter more. On the
    icon scale, like every other glyph on its own in the system. */
const DRAWN: IconSize = 32;

export interface IconTileProps {
  /** Which glyph. `name` because that is what `sds-icon` calls it, and one
      identifier must not have two spellings across two elements. */
  name: IconId;
  /** What stands under it, where the set shows something other than the
      identifier. The identifier otherwise, which is what a reader retypes. */
  caption?: string;
  /** Where the tile goes. Without one it is still a tile: a wall that
      documents a set rather than indexes it presses nowhere. */
  href?: string;
  /** The one fact the drawing cannot show — that it mirrors, that it is new,
      that it is going. One word, in the corner the glyph does not use. */
  tag?: string;
}

export class SdsIconTile extends SdsElement {
  static override properties = {
    name: { type: String, reflect: true },
    caption: { type: String },
    href: { type: String },
    tag: { type: String },
  };

  declare name: IconId;
  declare caption: string;
  declare href: string;
  declare tag: string;

  constructor() {
    super();
    this.caption = '';
    this.href = '';
    this.tag = '';
  }

  protected override render(): TemplateResult {
    /* An empty art box rather than a thrown glyph. The name arrives from a
       catalogue, and a set with one bad row still has to render the rest of
       itself. The icon says loudly enough which identifier it cannot find. */
    const glyph = this.name
      ? html`<sds-icon name="${this.name}" size="${DRAWN}"></sds-icon>`
      : nothing;

    const inside = html`<span class="sds-icon-tile__art">
    ${glyph}
  </span>
  <span class="sds-icon-tile__name">${this.caption || this.name}</span>
  ${this.tag ? html`<span class="sds-icon-tile__tag">${this.tag}</span>` : nothing}`;

    /* An anchor only where it goes somewhere. A link with no target is a thing
       the keyboard stops at and nothing happens, which is worse than a tile
       that was never pressable. */
    return this.href
      ? html`<a class="sds-icon-tile" href="${this.href}">
  ${inside}
</a>`
      : html`<div class="sds-icon-tile">
  ${inside}
</div>`;
  }
}

define('sds-icon-tile', SdsIconTile);
