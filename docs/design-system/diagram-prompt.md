# Explanatory diagrams

A diagram carries a claim. An illustration only sets a register beside the
heading it stands under, and if position, connection or quantity in the image
does not have to be understood, draw one of those instead —
`docs/design-system/illustration-prompt.md` is that prompt.

Unlike an illustration this is not generated as a picture. It is one SVG file
written to the grammar below and shipped as source, because the colours in it
are tokens a page can reach into and the shapes are read back out for the
specimen cards.

## The fixed language

- **Canvas:** `viewBox="0 0 1200 H"` — always 1200 wide, the height to fit. A
  flat rectangle at `var(--surface-canvas, #FBFAF7)` fills it, with no radius,
  shadow, gradient or texture.
- **Margin:** 60 units every side. Nothing enters it, labels included.
- **Type:** Source Sans 3, with identifiers, paths and flags in Source Code
  Pro. Title 36 · lead 17 · node title 16 · node body 14 · label 13. **13 is
  the floor** — a diagram that needs smaller type is carrying too much.
- **Stroke:** 1 node outline, 1.5 connector or boundary, 2 for the one
  accented connector.
- **Radius:** 6 node or boundary, 4 bar, 2 unit square. Never above 6.
- **The two states:** solid means there; a dashed outline of the same shape in
  the same place means missing or not yet reachable, so a shortfall has a
  *size* rather than a sentence. Dashed means nothing else.
- **Colour:** peers are told apart by their names, never by hue. Exactly one
  element carries the accent, and it is often a connector rather than a box,
  since the claim is usually a relation.
- **Accessibility:** the drawing is the explanation, so it is never
  decorative. The root names a `<title>` carrying the claim and a `<desc>`
  saying what is plotted against what.

## Prompt

Replace `[CLAIM]` and `[CONSEQUENCE]` and leave the rest unchanged:

```text
Use case: explanatory diagram
Asset type: one hand-written SVG file, 1200 units wide, height to fit

Primary request: Draw a diagram that makes this single claim visible:
[CLAIM]. The line it closes on is: [CONSEQUENCE].

Canvas: viewBox="0 0 1200 H", H chosen to fit the drawing. A flat rectangle at
var(--surface-canvas, #FBFAF7) fills it. 60 units of margin on every side, and
nothing enters that margin, labels included. No outer radius, no shadow, no
gradient, no texture anywhere in the file.

Structure: the claim is carried by position, length or alignment — an axis, a
sequence, containment, a span across a scale. Boxes joined by arrows are the
last resort, not the starting vocabulary. If the drawing would still work as a
bulleted list, change the structure rather than adding detail to it.

Frame: an eyebrow in Source Code Pro at 13, uppercase and letter-spaced, in
var(--accent, #FF8700); the title under it at 36 bold in
var(--text-primary, #1C1A17); one lead line at 17 in
var(--text-secondary, #4A453D); a 1-unit rule in
var(--border-subtle, #E3DFD6) across the full width. At the foot, a 1-unit
rule in var(--border-strong, #C9C3B7), the consequence at 16 semibold, and one
line under it at 14.

Type: 'Source Sans 3' with a system-ui fallback for prose, 'Source Code Pro'
with a monospace fallback for identifiers, paths and flags. Node title 16
semibold, node body 14, label 13. 13 is the floor and nothing goes under it.

Shapes: node radius 6, bar radius 4, unit square radius 2, never above 6. A
node is var(--surface-raised, #FFFFFF) behind a 1-unit
var(--border-subtle, #E3DFD6) outline. A boundary is a hairline with no fill —
a filled container makes depth out of colour. A connector is 1.5 units,
orthogonal, one arrowhead, var(--text-muted, #726C63), and never curved.

The two states: a filled shape is what you get. A dashed outline of that same
shape, in that same place, is what is missing or not yet reachable, drawn in
var(--text-muted, #726C63). Dashed carries no other meaning. Where the missing
part is a degradation rather than a precondition, the dashed outline takes
var(--status-warn, #986200) instead.

Colour: peers share one treatment and are distinguished by their names, never
by hue. Ink is var(--text-primary, #1C1A17), a quieter line
var(--text-secondary, #4A453D), a label var(--text-muted, #726C63). Exactly
one element in the whole drawing carries var(--accent, #FF8700), and it is the
one thing the diagram is about. Where the diagram is about degradation or
failure, status colour replaces the accent and orange stays out entirely.

File contract: every colour is a presentation attribute written as a var()
with the light hex behind it. No style block, and no fill or color on the root
element. The root carries role="img" and aria-labelledby pointing at a title
and a desc inside it. Every drawn shape sits inside one group with the id
soul-ref. No comment in the file may contain two dashes in a row: that is
malformed XML, and such a file draws nothing wherever it is fetched.

Constraints: one claim and no second one; no legend repeating what the shapes
already say, no colour key, no hue palette, no icon set, no screenshot of an
interface, no logo, no watermark.

Avoid: flowcharts of everything, decorative or double-headed arrows, curved
connectors, drop shadows, elevation, rounded canvases, multicoloured node
sets, isometric or three-dimensional treatment, clip art, dense small type,
fine hatching and decorative clutter.
```

## Choosing the claim

Write the claim as a sentence before drawing anything. A topic — "how the
sources work" — has nothing to draw yet; a claim — "bundled knowledge is the
only source that spans the whole axis" — decides the structure by itself,
because it names the thing being compared and the scale it is compared along.

The title states the claim and the closing line states its consequence. Two
claims are two diagrams, and a drawing that has to carry both ends up as boxes
joined by arrows, which is the shape a claim takes when it has stopped being
one.

Then pick the structure from the claim rather than from the shapes: a span
along a scale wants an axis, a thing that has to happen before another wants a
sequence, a thing that holds others wants containment. Boxes and arrows are
what is left when none of those fits.

Which drawings a set already holds is a property of that set, not of this
prompt. `packages/frontend/assets/diagrams/` owns that list; copying it here
would turn the instructions for the next drawing into an inventory that can
quietly fall behind the files.

## What to hand back

One file in `packages/frontend/assets/diagrams/`, named after the claim rather
than the drawing. Then `make diagrams`, which reads the shapes out from under
`soul-ref` for the specimen cards and refuses a file that is missing the
group, the `viewBox`, or that carries a malformed comment.

Look at it twice: at 1200 wide, where the type is read, and at the width a
card gives it, where only position, length and alignment survive. If the
second view no longer makes the claim, the claim was in the labels.
