# Draw a signet to this construction

Hand this file to an agent, name the product, and it should be able to produce
three SVG files that belong to the family without seeing any of the existing
marks. Everything below is the construction; the only thing left to invent is
the interior.

Three marks already exist and are worth reading first as worked examples:
`assets/design-system-signet-l.svg`, `dev-companion-signet-l.svg`,
`tryout-signet-l.svg`.

---

## The prompt

> Draw a signet for **&lt;product&gt;**, which is **&lt;one sentence: what it
> does, for whom&gt;**.
>
> It joins an existing family. Everything structural below is fixed and is not
> yours to change — you are inventing the interior and nothing else. Produce
> three SVG files at the three optical sizes and nothing more.

## The box

- **128 × 100 units**, 5:4. `viewBox="-6 -6 140 112"` for L and M — the extra
  6 units on each side are for the stroke, which is centred on the path and
  reaches half a stroke beyond it.
- **S uses `viewBox="-6 -20 140 140"`**, a square box, because a favicon slot
  is square and a 5:4 mark letterboxed into one drops under the 16px floor.
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

1. **One idea, not two.** The existing marks say: a session ending in an
   answer; the thing you press; the parts and the frame around them. One
   sentence about the product, drawn.
2. **It must survive 16px.** Draw it, render it at 16, and look. Detail that
   turns to mush is detail that has to go.
3. **It must not repeat a sibling.** Read the three that exist before drawing.

## Two techniques worth stealing

- **A filled shape that needs the family's rounding**: give it `fill` *and*
  `stroke` in the same colour at the size's stroke width, with
  `stroke-linejoin="round"`. The join produces the rounding, the shape grows
  by half a stroke on every side, and you keep one construction instead of two.
  Both the corner marker and Tryout's triangle are drawn this way.
- **An outer corner of radius 20 on a stroked path**: give the path radius
  20 − half the stroke, and the ink lands on 20.

## What to hand back

Three files, named `<product>-signet-l.svg`, `-m.svg`, `-s.svg`, each with a
`<title>` and `role="img" aria-label` naming the product, and a comment saying
what the interior means and what changed at that size. Then render all three
at 120, 40, 24 and 16px next to an existing mark and look at them — the check
is whether they read as siblings, and nothing but your own eyes does it.

## The one licensed deviation

The design system's own mark uses a **stroked** accent where the product marks
fill theirs. It is the frame the others are composed inside, and a frame that
outweighs its contents is the wrong shape. A product mark fills its accent.
