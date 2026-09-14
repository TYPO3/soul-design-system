/* The colour cards' own scaffolding.

   Most of the colour specimens are the same drawing with different values in
   it. A chip, the token that names it, the hex it resolves to, and the set
   once per mode. Like `specimen.ts`, these compose strings rather than
   templates, so the card stays indented and reviewable. The classes are
   `_specimen.css`'s — annotation, and nothing a product surface inherits. */

import { indent } from './specimen.ts';

/** One chip with its token and the value that token resolves to in this
    mode. The hex stands in full because it is the thing on the page. A
    token name alone says nothing about what the mode does with it. */
export interface Swatch {
  /** The custom property, as CSS spells it. */
  token: string;
  hex: string;
  /** What paints the chip — a fill for a surface, a border for a hairline.
      Both exist because a 1px colour cannot show as a fill. */
  style: string;
  /** The smaller chip the status and syntax colours show at: they are
      never a plane, only a mark on one. */
  small?: boolean;
}

export const swatch = ({ token, hex, style, small }: Swatch): string =>
  `<div class="spec-sw"><div class="spec-chip${small ? ' spec-chip--sm' : ''}" style="${style}"></div>` +
  `<div class="spec-n">${token}</div><div class="spec-hex">${hex}</div></div>`;

/** A surface's fill, with the hairline that keeps a near-canvas plane apart
    from the pane behind it. */
export const fill = (value: string): string => `background:var(${value}); border:1px solid var(--border-subtle);`;

/** A hairline shown as itself: the chip is the border and nothing else. */
export const hairline = (value: string): string => `border:1px solid var(${value});`;

/** The same set in both modes, one pane above the other. The panes carry their
    own `data-theme`, which is the point: a token is a pair of values, and one
    of them documents half the system. Nothing outside them paints, so the
    card's root pins no mode. */
export const modes = (light: readonly string[], dark: readonly string[]): string =>
  `<div style="display:grid; grid-template-rows:1fr 1fr;">
  <div class="spec-pane" data-theme="light">
${indent(light.join('\n'), 4)}
  </div>
  <div class="spec-pane" data-theme="dark">
${indent(dark.join('\n'), 4)}
  </div>
</div>`;
