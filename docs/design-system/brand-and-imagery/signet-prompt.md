# Draw a signet to this construction

Everything here is the construction, complete on its own. It assumes you
cannot open a mark already drawn to it. The only thing left to invent is the
interior.

---

## The prompt

> Draw a signet for `<product>`, which is `<one sentence: what it does, for
> whom>`.
>
> It joins an existing family. Everything structural below stays as it is,
> and you must not change it. You invent the interior and nothing else.
> Produce three SVG files, one per drawn size, and nothing more.

## The box

- **A square viewBox at the size the file is for**: `viewBox="0 0 32 32"`,
  `"0 0 24 24"`, `"0 0 16 16"`. No offset, no margin, no negative origin.
- **The construction box is 4:3, centred in it**: 32 × 24, 24 × 18, 16 × 12.
  The mark lives in that box. The strip above and below it is air, and it
  makes the file square.
- Square because every slot a mark lands in is square. A favicon, an avatar,
  an app icon, the mark well in a bar. One number sizes it, and there is no
  aspect to state wrong.
- Outer corners of the construction box: **radius 4 / 3 / 2**.

## One unit is one pixel

This is the rule the three files exist for. Each drawing lives in the box of
its size, so a unit *is* a device pixel there:

- **Every straight edge is a whole number.** Not the geometry, the *ink*. A
  filled shape lands on whole numbers. A stroked path centres on its edge. So
  with an even stroke the centreline is whole: a 2-unit stroke on `x=1` inks
  0 to 2. With a 1-unit stroke it is a half: `x=0.5` inks 0 to 1. Half values
  in a 16 file are the rule at work.
- **Curves are exempt.** An arc, a diagonal, the point of a triangle: no grid
  holds them. Only what a screen can hold straight has to land.
- **A drawing is true at its size and at every whole multiple of it.** The
  large file is true at 32, 64 and 96. The middle at 24, 48 and 72. The
  small at 16, 32 and 48. Between those, every edge falls mid-pixel and
  comes out with one hard edge and one soft one. That is why the link
  chooses the size.

## The one value everything follows

Pick the stroke, and the rest follows:

| | L (32) | M (24) | S (16) |
| --- | --- | --- | --- |
| viewBox | `0 0 32 32` | `0 0 24 24` | `0 0 16 16` |
| construction box | 32 × 24 | 24 × 18 | 16 × 12 |
| stroke | 2 | 2 | 1 |
| rounding | 1 | 1 | 0.5 |
| minimum gap, ink to ink | 2 | 2 | 1 |
| outer corner radius | 4 | 3 | 2 |
| path radius for that corner | 3 | 2 | 1.5 |

- **The rounding is half the stroke, everywhere.** Line ends, the corners of
  a filled shape, the points of a triangle. One radius, no exceptions.
- **The gap is never less than the stroke**, ink to ink, not path to path. A
  stroked path's ink reaches half a stroke past its geometry. A gap under one
  whole pixel separates nothing.
- **Nothing leaves the box.** The same half stroke applies outwards. Inset
  every path that draws an outer edge by half a stroke, so its ink lands on
  the box.
- **Three sizes, drawn, never scaled between.** The stroke does not shrink
  with the box. L and M both carry two pixels of it, so the middle size is
  the heavier mark. At 16 the stroke goes to one pixel, because sixteen pixels
  have no room for two. The interior keeps the ink of the middle size. **The
  box shrinks around the interior; the interior does not shrink with it.**
  Drop what does not read at 16. Do not keep it small.

## Colour

- The ink is a mid warm grey, a token with a hex behind it:
  `fill="var(--text-primary, #8A8378)"`. A page that declares the tokens
  gets its own ink. The file still renders on its own, in the hex.
- The accent is flat `var(--accent, #FF8700)`.
- **Orange appears exactly once, in the top-right corner.** That position is
  the family's one shared gene. Nothing else has colour.
- No `<style>` block and no colour on the root. No comment in the file with a
  double dash: that is not valid XML, and the file then draws nothing.

## The interior is yours, under three conditions

1. **One idea, not two.** One sentence about the product, drawn. Three
   interiors of that kind, spelt out because you cannot open them. A session
   that ends in an answer: a terminal frame around two muted lines and one
   orange one. The thing you press to start something: a triangle. The parts
   and the frame around them: three unequal blocks between two crop marks.
2. **Draw it at 16. Do not shrink it to 16.** Draw the small file on its own
   grid and look at it at 16. Detail that turns to mush has to go, and what
   stays gets the whole pixels it needs.
3. **The idea belongs to this product only.** The generic readings are the
   first ones anyone reaches for: a terminal, a play triangle, a stack of
   parts. A sibling has them already. Put another product's name in front of
   the sentence the interior draws. If it stays true, the mark identifies a
   category, not a product.

## Two techniques

- **A filled shape with the family's rounding.** Give it `fill` *and*
  `stroke` in the same colour at the size's stroke width, with
  `stroke-linejoin="round"`. The join produces the rounding, and the shape
  grows by half a stroke on every side. So its geometry stops half a stroke
  short of the box corner while its ink lands on it. In the 16 file its
  geometry sits on halves, like every other 1-unit stroke. The corner marker
  and the triangle interior use this technique. So a triangle's three points
  get the family's rounding without a second construction.
- **An outer corner of radius R on a stroked path.** Give the path radius
  R − half the stroke, and the ink lands on R.

## What to hand back

Three files, `<product>-signet-l.svg`, `-m.svg`, `-s.svg`. Each has a
`<title>` and `role="img" aria-label` with the product's name. Each has
`id="soul-ref"` on the root, and a comment that says what the interior means
and what changed at that size. Then render each one at its size and at twice
that, side by side, and look. The question is if the three read as one mark, and only your
own eyes answer it.

## The one deviation, and it is not yours

A product mark **fills** its corner marker. One mark in the family strokes it
instead: the design system's own, the frame around the others. A frame that
outweighs its contents is the wrong shape. You draw a product mark: fill it.
