/* How the signet is built.

   The grid, the stroke, the rounding and the marker, at the size the
   construction is legible — one rounding throughout, half the stroke, which
   is the single rule the whole drawing follows.

   The artwork is the specimen: the geometry is the subject, so every comparison
   is the mark with one value swapped, and no component could produce it.
   Composed from one function rather than copies, or the card carries the
   construction many times over and all but one go stale. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

const INK = 'var(--text-secondary)';
const LINE = 'var(--text-muted)';
const ACC = 'var(--accent)';

/** The mark as it is drawn, in the box it is drawn in: 32 units, one per
    pixel. Every comparison below passes one of these and nothing else. */
const FRAME = 'M31 20V24A3 3 0 0 1 28 27H4A3 3 0 0 1 1 24V8A3 3 0 0 1 4 5H19';
const MARKER = 'M23 5H28A3 3 0 0 1 31 8V16Z';

interface Mark {
  frame?: string;
  marker?: string;
  /** The stroke, which the rounding and the lines' weight both follow. */
  stroke?: number;
  /** The marker's own stroke, for the one comparison that varies only its
      rounding and has to leave the frame beside it alone. */
  markerStroke?: number;
  /** The three session lines, by length. */
  lines?: readonly [number, number, number];
}

const mark = (size: number, o: Mark = {}): string => {
  const s = o.stroke ?? 2;
  const [a, b, c] = o.lines ?? [14, 9, 16];
  return `<svg viewBox="0 0 32 32" width="${size}" height="${size}" class="sds-signet">
<path d="${o.frame ?? FRAME}" fill="none" stroke="${INK}" stroke-width="${s}" stroke-linejoin="round" stroke-linecap="round" />
<rect x="6" y="10" width="${a}" height="${s}" rx="${s / 2}" fill="${LINE}" /><rect x="6" y="15" width="${b}" height="${s}" rx="${s / 2}" fill="${LINE}" opacity="0.55" /><rect x="6" y="20" width="${c}" height="${s}" rx="${s / 2}" fill="${ACC}" />
<path d="${o.marker ?? MARKER}" fill="${ACC}" stroke="${ACC}" stroke-width="${o.markerStroke ?? s}" stroke-linejoin="round" stroke-linecap="round" />
</svg>`;
};

/** One comparison: the same mark at two sizes, with a verdict under it. */
const panel = (chosen: boolean, value: string, note: string, o: Mark): string =>
  `<div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--${chosen ? 'accent' : 'border-subtle'}); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;">${mark(64, o)}${mark(32, o)}</div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--${chosen ? 'text-accent-quiet' : 'text-muted'});">${value}</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">${note}</div></div>
    </div>`;

const group = (title: string, aside: string, panels: string): string =>
  `<div>
    <div style="display:flex; align-items:baseline; gap:12px; padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid var(--border-subtle);">
      <span style="font-size:14px; font-weight:600;">${title}</span><span style="font-size:12px; color:var(--text-muted);">${aside}</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">${panels}</div>
  </div>`;

/** The card, as it is drawn. */
const CARD = `<div class="spec" style="--spec-gap:22px">

  <div class="sds-note sds-note--info">
    <span class="sds-note__icon"><svg class="sds-icon" viewBox="0 0 16 16"><g fill="currentColor"><path d="M8,2c3.3000002,0,6,2.6999998,6,6s-2.6999998,6-6,6s-6-2.6999998-6-6S4.6999998,2,8,2 M8,1C4.0999999,1,1,4.0999999,1,8s3.0999999,7,7,7s7-3.1000004,7-7S11.8999996,1,8,1L8,1z"></path><path d="M7,4.999999C7,4.4477148,7.4477148,4,7.999999,4H8.000001C8.5522852,4,9,4.4477148,9,4.999999V5.000001C9,5.5522852,8.5522852,6,8.000001,6H7.999999C7.4477148,6,7,5.5522852,7,5.000001V4.999999z"></path><path d="M7,7.999999C7,7.4477148,7.4477148,7,7.999999,7H8.000001C8.5522852,7,9,7.4477148,9,7.999999v3.0000019C9,11.5522852,8.5522852,12,8.000001,12H7.999999C7.4477148,12,7,11.5522852,7,11.000001V7.999999z"></path></g></svg></span>
    <div>
      <div class="sds-note__title">The rules are the deliverable, not this drawing</div>
      <div class="sds-note__body">
        The mark below is one worked example of them, carried over from the Dev&nbsp;Companion
        prototype &#8212; a reference implementation, not an approved product mark. A product
        adopting this system draws its own signet to the same construction. A second
        worked example, for TYPO3&nbsp;Tryout, is at the foot of this card: same frame,
        same marker, same rounding, a different word inside.
      </div>
    </div>
  </div>

  <div style="display:flex; align-items:center; gap:34px; flex-wrap:wrap;">
    ${mark(96)}
    <div style="display:flex; flex-direction:column; gap:7px;">
      <div class="sds-mono">DRAWN AT 32, ONE UNIT PER PIXEL</div>
      <div class="spec-cap">box &#183; 32 across, 24 down, centred in a square viewBox</div>
      <div class="spec-cap">stroke &#183; 2 units, round caps and round joins</div>
      <div class="spec-cap">rounding &#183; <span style="color:var(--text-accent-quiet);">1 unit everywhere</span> &#8212; half the stroke. Frame caps, line ends and the marker&#8217;s three points are one radius</div>
      <div class="spec-cap">gap &#183; 2 units, ink to ink, never less than the stroke</div>
      <div class="spec-cap">marker &#183; 10 across, 13 down &#8212; taller than wide, like the Soul</div>
      <div class="spec-cap">corner radius &#183; 4 units, shared by frame and marker</div>
      <div class="spec-cap">session lines &#183; 14 / 9 / 16 units, the last one accent</div>
      <div class="sds-mono" style="color:var(--text-secondary);">the frame is one open path &#8212; both ends are caps, not cuts</div>
      <div class="sds-mono" style="color:var(--text-secondary);">the frame path stops gap + stroke short, because both caps reach half a stroke further</div>
      <div class="sds-mono" style="color:var(--text-secondary);">every straight edge is a whole unit, so every straight edge is a whole pixel</div>
    </div>
    <div style="display:flex; align-items:center; gap:11px;"><svg viewBox="0 0 32 32" width="32" height="32" class="sds-signet">
<path d="M14 27H4A3 3 0 0 1 1 24V15" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<rect x="8" y="11" width="3" height="10" rx="1" fill="var(--text-muted)" /><rect x="13" y="11" width="6" height="10" rx="1" fill="var(--text-muted)" /><rect x="21" y="11" width="3" height="10" rx="1" fill="var(--text-muted)" />
<path d="M18 5H28A3 3 0 0 1 31 8V17" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:9.9px; font-size:22px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:2px; height:19px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></div>
  </div>

  ${group(
    'Marker rounding',
    'it has to be the radius the rest of the mark already uses',
    panel(false, '0.5 &#183; its own value', 'Sharper than the caps beside it. Two rounding systems in one mark, and the eye catches it.', {
      markerStroke: 1,
      marker: 'M22.5 4.5H28.5A3.5 3.5 0 0 1 31.5 8V16.5Z',
    }) +
      panel(true, '1 &#183; chosen, = &#189; stroke', 'The same radius as the frame caps and the line ends. One rule for the whole mark.', {}) +
      panel(false, '2 &#183; softer than the caps', 'Rounder than everything around it; the diagonal stops being a cut.', {
        markerStroke: 4,
        marker: 'M24 6H28A2 2 0 0 1 30 8V15Z',
      }),
  )}

  ${group(
    'Marker height',
    'how far it runs down the right edge',
    panel(false, '9 down', 'Nearly square. Reads as a corner, not as a form with a direction.', {
      marker: 'M23 5H28A3 3 0 0 1 31 8V12Z',
    }) +
      panel(true, '13 down &#183; chosen', 'A 1 : 1.3 form &#8212; close to the Soul&#8217;s own proportion, and the diagonal gets a real slope.', {}) +
      panel(false, '18 down', 'Long. Strong reference, but it eats the frame&#8217;s right side and crowds the accent line.', {
        marker: 'M23 5H28A3 3 0 0 1 31 8V21Z',
      }),
  )}

  ${group(
    'Marker width',
    'across the top edge',
    panel(false, '7 across', 'Narrow and steep. Sharpest silhouette, weakest at 16&#8239;px.', {
      frame: 'M31 20V24A3 3 0 0 1 28 27H4A3 3 0 0 1 1 24V8A3 3 0 0 1 4 5H22',
      marker: 'M26 5H28A3 3 0 0 1 31 8V16Z',
    }) +
      panel(true, '10 across &#183; chosen', 'The width chosen, with the added drop.', {}) +
      panel(false, '13 across', 'Wide enough that the marker stops being a corner and becomes a lid.', {
        frame: 'M31 20V24A3 3 0 0 1 28 27H4A3 3 0 0 1 1 24V8A3 3 0 0 1 4 5H16',
        marker: 'M20 5H28A3 3 0 0 1 31 8V16Z',
      }),
  )}

  ${group(
    'Stroke weight',
    'the gap and the rounding both follow it',
    panel(false, '1 unit', 'Finer frame, more air. Goes weak below 32&#8239;px, which is where this drawing is for.', {
      stroke: 1,
      frame: 'M31.5 20V24A3.5 3.5 0 0 1 28 27.5H4A3.5 3.5 0 0 1 0.5 24V8A3.5 3.5 0 0 1 4 4.5H19',
      marker: 'M23 4.5H28.5A3.5 3.5 0 0 1 31.5 8V16.5Z',
    }) +
      panel(true, '2 units &#183; chosen', 'Two device pixels at 32, and the same weight as the session lines.', {}) +
      panel(false, '4 units', 'Heavy. The interior closes up and the lines lose their separation.', {
        stroke: 4,
        frame: 'M30 20V24A2 2 0 0 1 28 26H4A2 2 0 0 1 2 24V8A2 2 0 0 1 4 6H19',
        marker: 'M24 6H28A2 2 0 0 1 30 8V15Z',
      }),
  )}

  <div class="spec-cap">A SECOND PRODUCT, THE SAME CONSTRUCTION</div>

  <div style="display:flex; gap:30px; align-items:flex-start;">
    <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; flex:none;">
      ${mark(96)}
      <div class="spec-cap">DEV COMPANION</div>
      <div class="spec-note" style="max-width:20ch;">A session ending in one answer.</div>
    </div>
    <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; flex:none;">
      <svg viewBox="0 0 32 32" width="96" height="96" class="sds-signet">
<path d="${FRAME}" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<path d="M10 11L10 21L19 16Z" fill="${ACC}" stroke="${ACC}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<path d="${MARKER}" fill="${ACC}" stroke="${ACC}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg>
      <div class="spec-cap">TRYOUT</div>
      <div class="spec-note" style="max-width:20ch;">Clone, <span class="sds-mono" style="white-space:nowrap;">ddev start</span>, done.</div>
    </div>
    <div class="spec-note" style="flex:1; min-width:0;">
      Everything structural is shared and not up for redrawing: the frame path, the
      marker at 10&#8239;&#215;&#8239;13, stroke 2, the 1-unit rounding, the 2-unit gap. What a
      product owns is the interior, and it gets exactly one idea there.
      <br /><br />
      The triangle is filled <em>and</em> stroked at the same weight, the way the corner
      marker is. That is not a shortcut: it makes the round join do the rounding, so its
      three points come out at 1 like every other corner in the mark, without a second
      construction to keep in step. Its base is the one edge a screen can hold, so the
      base is what sits on a whole unit; the two diagonals never land on a pixel and are
      not asked to.
    </div>
  </div>

  <div style="display:flex; gap:30px; align-items:flex-start;">
    <div style="display:flex; align-items:flex-end; gap:20px; flex:none; padding-top:6px;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:7px;"><svg class="sds-signet" width="32" height="32" aria-hidden="true"><use href="../assets/tryout-signet-l.svg#art"></use></svg><span class="spec-cap">L &#183; 32</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:7px;"><svg class="sds-signet" width="24" height="24" aria-hidden="true"><use href="../assets/tryout-signet-m.svg#art"></use></svg><span class="spec-cap">M &#183; 24</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:7px;"><svg class="sds-signet" width="16" height="16" aria-hidden="true"><use href="../assets/tryout-signet-s.svg#art"></use></svg><span class="spec-cap">S &#183; 16</span></div>
    </div>
    <div class="spec-note" style="flex:1; min-width:0;">
      Three files again, each drawn in a box of its own size: <span class="sds-mono">tryout-signet-l.svg</span>
      is 32 units, <span class="sds-mono">-m.svg</span> is 24 and <span class="sds-mono">-s.svg</span> is 16.
      One unit is one pixel in every one of them, which is what makes a drawing true at the size it
      is for and at every multiple of it. A heavier stroke inflates the triangle by half a stroke on
      every side, so its vertices move inward at each step to hold the inked size still.
    </div>
  </div>

</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Signet — construction',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-signet-construction.card.html',
      group: 'Brand',
      name: 'Signet — construction',
      subtitle: 'How a signet is built for this system — one rounding throughout: half the stroke',
      viewport: '700x2087',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string => CARD;

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
