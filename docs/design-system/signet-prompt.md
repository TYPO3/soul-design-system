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
> three SVG files, one per drawn size, and nothing more.

## The box

- **A square viewBox at the size the file is for**: `viewBox="0 0 32 32"`,
  `"0 0 24 24"`, `"0 0 16 16"`. No offset, no margin, no negative origin.
- **The construction box is 4:3, centred in it** — 32 × 24, 24 × 18, 16 × 12.
  The mark is drawn in that box; the strip above and below it is air, and it
  is what makes the file square.
- Square because every slot a mark lands in is square: a favicon, an avatar,
  an app icon, the mark well in a bar. One number sizes it, and a caller
  cannot state the wrong aspect because there is no aspect to state.
- Outer corners of the construction box: **radius 4 / 3 / 2**.

## One unit is one pixel

This is the rule the three files exist for. Each drawing is made in the box of
the size it is for, so a unit *is* a device pixel there:

- **Every straight edge is a whole number.** Not the geometry — the *ink*. A
  filled shape lands on whole numbers directly; a stroked path is centred on
  its edge, so with an even stroke the centreline is whole (a 2-unit stroke on
  `x=1` inks 0 to 2) and with a 1-unit stroke it is a half (`x=0.5` inks 0 to
  1). Half values in a 16 file are the rule working, not an exception to it.
- **Curves are exempt and always were.** An arc, a diagonal, the point of a
  triangle: no grid holds them and none is asked to. Only what a screen can
  hold straight has to land.
- **A drawing is true at its size and at every whole multiple of it** — 32, 64
  and 96 for the large file; 24, 48 and 72 for the middle; 16, 32 and 48 for
  the small. Between those it is a vector like any other, every edge falls
  mid-pixel, and each line comes out with one hard edge and one soft one. That
  is what this construction is built to avoid, and it is why the size is
  chosen at the link.

## The one value everything follows

Pick the stroke, and the rest is decided:

| | L (32) | M (24) | S (16) |
| --- | --- | --- | --- |
| viewBox | `0 0 32 32` | `0 0 24 24` | `0 0 16 16` |
| construction box | 32 × 24 | 24 × 18 | 16 × 12 |
| stroke | 2 | 2 | 1 |
| rounding | 1 | 1 | 0.5 |
| minimum gap, ink to ink | 2 | 2 | 1 |
| outer corner radius | 4 | 3 | 2 |
| path radius for that corner | 3 | 2 | 1.5 |

- **Rounding is half the stroke, everywhere.** Line ends, the corners of a
  filled shape, the points of a triangle — one radius, no exceptions.
- **Gap is never less than the stroke**, and it is measured ink to ink, not
  path to path. A stroked path's ink reaches half a stroke past its geometry;
  forgetting that is the most common way these drawings go wrong. A gap under
  one whole pixel separates nothing, which is the same failure seen from the
  other end.
- **Nothing leaves the box.** The same half stroke applies outwards: every
  path that draws an outer edge is inset half a stroke, so its ink lands on
  the box.
- **Three sizes, drawn, never scaled between.** The stroke does not shrink
  with the box: L and M both carry two pixels of it, so the middle size is the
  heavier mark of the two. At 16 the stroke goes to one pixel — sixteen pixels
  have nowhere to put two — and the interior keeps the ink the middle size is
  drawn with rather than giving ground. **The box shrinks around the interior;
  the interior does not shrink with it.** If something stops reading at 16 it
  is dropped, not kept small.

## Colour

- The ink is a mid warm grey, written as a token with a hex behind it:
  `fill="var(--text-primary, #8A8378)"`. A page that declares the tokens gets
  its own ink; the file still renders on its own, where the hex is what it
  draws as.
- The accent is flat `var(--accent, #FF8700)`.
- **Orange appears exactly once**, and it appears **in the top-right corner**.
  That position is the family's one shared gene. Nothing else is coloured.
- Nothing colours the drawing from a `<style>` block or from the root, and no
  comment in the file may carry a double dash — that is malformed XML, and a
  file with one draws nothing wherever it is fetched.

## The interior is yours, under three conditions

1. **One idea, not two.** One sentence about the product, drawn. Three
   interiors built this way, written out because you cannot open them: a
   session ending in an answer — a terminal frame around two muted lines and
   one orange one; the thing you press to start something — a triangle; the
   parts and the frame around them — three unequal blocks between two crop
   marks.
2. **It must be drawn at 16, not survive being taken there.** Draw the small
   file on its own grid and look at it at 16. Detail that turns to mush is
   detail that has to go, and what stays gets the whole pixels it needs.
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
  short of the box corner while its ink lands on it — and, in the 16 file, why
  its geometry sits on halves like every other 1-unit stroke.
  The corner marker every mark carries is drawn this way, and so is the one
  interior in the family that is a triangle — a triangle's three points come
  out at the family's rounding through the round join, without a second
  construction that would have to be kept in step with the first.
- **An outer corner of radius R on a stroked path**: give the path radius
  R − half the stroke, and the ink lands on R.

## What to hand back

Three files, named `<product>-signet-l.svg`, `-m.svg`, `-s.svg`, each with a
`<title>`, `role="img" aria-label` naming the product, `id="soul-ref"` on the root
so it can be referenced, and a comment saying what the interior means and what
changed at that size. Then render each one at the size it is drawn for and at
twice that, side by side, and look at them — the check is whether the three
read as one mark, and nothing but your own eyes does it.

## The one deviation, and it is not yours

A product mark **fills** its corner marker. One mark in the family strokes it
instead — the design system's own, which is the frame the others are composed
inside, and a frame that outweighs its contents is the wrong shape. You are
drawing a product mark: fill it.
