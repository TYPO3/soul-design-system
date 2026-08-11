# Draw a signet to this construction

Everything here is the construction, and it is written to be complete on its
own: it assumes you cannot open a single mark already drawn to it. The only
thing left to invent is the interior.

---

## The prompt

> Draw a signet for `<product>`, which is `<one sentence: what it does, for
> whom>`.
>
> It joins an existing family. Everything structural below is fixed and is not
> yours to change — you are inventing the interior and nothing else. Produce
> three SVG files at the three optical sizes and nothing more.

## The box

- **128 × 100 units**, 5:4. `viewBox="0 0 128 100"` for L and M — the box is
  the viewBox, with no margin around it, because nothing is drawn that would
  need one.
- **S uses `viewBox="0 -14 128 128"`**, a square box, because a favicon slot
  is square and a 5:4 mark letterboxed into one drops under the 16px floor.
  The −14 centres the same 128 × 100 box in the square, and it is the only
  offset in the family: all three sizes are drawn in one coordinate system,
  so the three files can be read against each other line by line.
- Outer corners of the box: **radius 20**.

## The one value everything follows

Pick the stroke, and the rest is decided:

| | L (32px and up) | M (20–31px) | S (16–19px) |
| --- | --- | --- | --- |
| stroke | 7 | 8.5 | 11 |
| rounding | 3.5 | 4.25 | 5.5 |
| minimum gap, ink to ink | 7 | 8.5 | 11 |
| path radius for a 20 outer corner | 16.5 | 15.75 | 14.5 |

- **Rounding is half the stroke, everywhere.** Line ends, the corners of a
  filled shape, the points of a triangle — one radius, no exceptions.
- **Gap is never less than the stroke**, and it is measured ink to ink, not
  path to path. A stroked path's ink reaches half a stroke past its geometry;
  forgetting that is the most common way these drawings go wrong.
- **Nothing leaves the box.** The same half stroke applies outwards: every
  path that draws an outer edge is inset half a stroke, so its ink lands on
  the box and the viewBox needs no margin to keep it. A frame drawn *on* the
  box edge is half a stroke too wide on every side and its corners half a
  stroke too round — beside a sibling drawn to the rule it reads as a
  different size, and it is clipped by its own viewBox.
- **Three optical sizes, redrawn, never scaled.** A heavier stroke eats into
  the interior, so the interior gives ground: shapes shrink, and if something
  stops reading, it is dropped rather than kept small. Scaling one drawing to
  three sizes is the failure this rule exists to prevent.

## Colour

- The ink is a mid warm grey — `#8A8378` light, `#A9A299` dark — switched with
  `@media (prefers-color-scheme: dark)` inside the file. An `<img>` cannot
  inherit `currentColor`, which is why the file carries its own colours.
- The accent is flat **`#FF8700`** in both modes.
- **Orange appears exactly once**, and it appears **in the top-right corner**.
  That position is the family's one shared gene. Nothing else is coloured.

## The interior is yours, under three conditions

1. **One idea, not two.** One sentence about the product, drawn. Three
   interiors built this way, written out because you cannot open them: a
   session ending in an answer — a terminal frame around two muted lines and
   one orange one; the thing you press to start something — a triangle; the
   parts and the frame around them — three unequal blocks between two crop
   marks.
2. **It must survive 16px.** Draw it, render it at 16, and look. Detail that
   turns to mush is detail that has to go.
3. **It must be an idea only this product could have.** The generic readings
   — a terminal, a play triangle, a stack of parts — are the first ones anyone
   reaches for, which is why a sibling is most likely holding them already.
   Put another product's name in front of the sentence the interior draws: if
   it stays true, the mark identifies a category and not a product, and it is
   one nobody can tell from the sibling it lands on.

## Two techniques worth stealing

- **A filled shape that needs the family's rounding**: give it `fill` *and*
  `stroke` in the same colour at the size's stroke width, with
  `stroke-linejoin="round"`. The join produces the rounding, the shape grows
  by half a stroke on every side, and you keep one construction instead of
  two. Growing on every side is also why its geometry stops half a stroke
  short of the box corner while its ink lands on it.
  The corner marker every mark carries is drawn this way, and so is the one
  interior in the family that is a triangle — a triangle's three points come
  out at the family's rounding through the round join, without a second
  construction that would have to be kept in step with the first.
- **An outer corner of radius 20 on a stroked path**: give the path radius
  20 − half the stroke, and the ink lands on 20.

## What to hand back

Three files, named `<product>-signet-l.svg`, `-m.svg`, `-s.svg`, each with a
`<title>` and `role="img" aria-label` naming the product, and a comment saying
what the interior means and what changed at that size. Then render all three
at 120, 40, 24 and 16px, side by side, and look at them — the check is whether
the three read as one mark at every size, and nothing but your own eyes does
it.

## The one deviation, and it is not yours

A product mark **fills** its corner marker. One mark in the family strokes it
instead — the design system's own, which is the frame the others are composed
inside, and a frame that outweighs its contents is the wrong shape. You are
drawing a product mark: fill it.
