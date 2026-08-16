/* The drawing rules, drawn.

   A node, a connector and the colour rule, each shown as the thing it
   describes rather than stated — a card that explained "peers are told apart
   by their names, never by hue" in words would be the mistake it warns
   against. The three drawings are SVG by hand: they are diagrams *about*
   diagrams, and there is no component for a picture of a rule.

   Every value in them is a token, except the five hues in the colour rule,
   which are literals on purpose: they are the palette being struck out. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, indent, spec, specRule } from '../lib/specimen.ts';

const SVG = '<svg width="100%" height="66" viewBox="0 0 240 66" aria-hidden="true">';

/** A peer node beside the one the diagram is about: same shape, same fill,
    and an accent bar is the entire difference. */
const NODE = `${SVG}
  <rect x="1" y="1" width="112" height="64" rx="6" fill="var(--surface-canvas)" stroke="var(--border-subtle)" />
  <rect x="15" y="16" width="62" height="7" rx="3.5" fill="var(--text-primary)" />
  <rect x="15" y="33" width="84" height="6" rx="3" fill="var(--text-muted)" />
  <rect x="15" y="45" width="52" height="6" rx="3" fill="var(--text-muted)" />
  <rect x="127" y="1" width="112" height="64" rx="6" fill="var(--surface-accent-quiet)" stroke="var(--border-accent-quiet)" stroke-width="1.5" />
  <rect x="127" y="1" width="112" height="3" rx="1.5" fill="var(--accent)" />
  <rect x="141" y="18" width="62" height="7" rx="3.5" fill="var(--text-primary)" />
  <rect x="141" y="35" width="84" height="6" rx="3" fill="var(--text-muted)" />
  <rect x="141" y="47" width="52" height="6" rx="3" fill="var(--text-muted)" />
</svg>`;

/** Orthogonal, one arrowhead, and the dashed line that means "not yet". */
const CONNECTOR = `${SVG}
  <defs><marker id="t" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto"><path d="M0 0.5 7 4 0 7.5Z" fill="var(--text-muted)" /></marker></defs>
  <path d="M10 16 H120 V50 H196" fill="none" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#t)" />
  <path d="M10 50 H70" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="4 4" marker-end="url(#t)" />
</svg>`;

/** The hue palette, struck out, and what replaces it: one accent among peers
    that are identical. */
const HUES = ['#6172f3', '#0ba5ec', '#12b76a', '#ff8700', '#667085'];
const AFTER = ['--surface-inset', '--surface-inset', '--surface-inset', '--accent', '--surface-inset'];
const X = [0, 50, 100, 150, 200];
const W = [42, 42, 42, 42, 40];

const rects = (y: number, paint: (i: number) => string): string =>
  X.map((x, i) => `<rect x="${x}" y="${y}" width="${W[i]}" height="20" rx="4" fill="${paint(i)}" />`).join('');

const COLOUR = `${SVG}
  <g>
    ${rects(6, (i) => HUES[i] as string)}
    <line x1="4" y1="30" x2="236" y2="30" stroke="var(--status-error)" stroke-width="1.5" />
    ${rects(40, (i) => `var(${AFTER[i]})`)}
  </g>
</svg>`;

const BOXES: readonly { heading: string; drawing: string; rule: string }[] = [
  {
    heading: 'Node',
    drawing: NODE,
    rule: '6px radius, hairline, flat fill. The subject of the diagram gets the accent bar — <b>everything else is peer-identical</b>.',
  },
  {
    heading: 'Connector',
    drawing: CONNECTOR,
    rule: '1.5px, orthogonal, one arrowhead. No curves. Dashed means <b>optional or not yet</b> — nothing else.',
  },
  {
    heading: 'Colour',
    drawing: COLOUR,
    rule: 'Peers are told apart by <b>their names, never by hue</b>. Orange marks the one thing the diagram is about. Status colours only in diagrams about status.',
  },
];

/** The six rules, in the order they are decided in: what a shape means, what
    a drawing has to earn, how many claims it may carry, how it ships, how it
    is set, and what it may not have. */
const RULES: readonly string[] = [
  '<b>Solid means there, dashed outline means not there.</b> One vocabulary across the whole set: a filled shape is what you get, a dashed outline of the same shape is what is missing or not yet reachable — <b>the shortfall has a size, not a sentence</b>. Warn colour on the outline where it is a degradation rather than a precondition.',
  '<b>A picture, not a text block in boxes.</b> If the drawing would still work as a bulleted list, it is not a diagram — meaning has to sit in <b>position, length or alignment</b>. Boxes and arrows are the last resort, not the starting vocabulary.',
  '<b>One claim per diagram.</b> The title states it, the closing line states its consequence. If two claims are needed, that is two diagrams.',
  '<b>One file, both modes.</b> Colour is written as attributes, each of them <span class="spec-cap">var(--token, #light)</span>: referenced into a page the drawing takes its tokens, and opened on its own it falls back to the light hex. A <span class="spec-cap">&lt;style&gt;</span> block would be stripped by GitHub, and an <span class="spec-cap">&lt;img&gt;</span> would never see a token at all.',
  '<b>Type.</b> Source Sans 3, with every identifier in Source Code Pro. Floor is 13px at the drawn size — a diagram that needs smaller type is carrying too much.',
  '<b>No shadows, no gradients, no outer radius.</b> Depth is a hairline. The canvas is a flat rectangle at <span class="spec-cap">--surface-canvas</span> with a 60px margin.',
];

const box = ({ heading, drawing, rule }: (typeof BOXES)[number]): string =>
  `<div class="spec-box">
  <div class="spec-h">${heading}</div>
${indent(drawing, 2)}
  ${specRule(rule)}
</div>`;

const meta: Meta = {
  title: 'Specimens/Diagrams/Drawing rules',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/diagrams-rules.card.html',
      group: 'Diagrams',
      name: 'Drawing rules',
      subtitle: 'Flat, hairline, one accent — one file, in both modes',
      viewport: '980x480',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  spec(
    [
      `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px;">\n${indent(BOXES.map(box).join('\n'), 2)}\n</div>`,
      `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px 26px; border-top:1px solid var(--border-subtle); padding-top:14px;">\n${indent(RULES.map(specRule).join('\n'), 2)}\n</div>`,
    ],
    { gap: '18px' },
  );

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
