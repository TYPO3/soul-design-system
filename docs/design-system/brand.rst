:navigation-title: Brand

=====
Brand
=====

**The signet is a construction, not a fixed drawing.** This system fixes
*how* to build one. The mark in ``packages/frontend/assets/`` is a worked
example of the rules, the reference implementation, not an approved product
mark. A product that adopts this system draws its own to the same
construction.

The family under ``packages/frontend/assets/*-signet-{l,m,s}.svg`` makes the
claim checkable. The examples share the box, the outer radius, the stroke,
the rounding, the gap and the single orange in the top-right corner. Only the
interior differs, and it carries one idea.

The system's own mark has no window, and its accent is a stroke, both on
purpose. A frame reads as a terminal, and a terminal is what the products
are, not what the system is. The construction stands further down this page
as an instruction. Give it to an agent with a product name, and it produces
a mark of the family.

.. warning::

   The TYPO3 Soul is not in use, and a footer says what the product is,
   never whose it is.

``TYPO3`` in the wordmark names the domain the system serves, not the owner
of the system. So this mark neither nests nor crops the Association's asset.
Nested, it becomes the mark and erases the product. Cropped, it is an altered
asset that is not ours. Where co-branding is necessary, the marks
sit beside one another.

How to draw one
===============

Everything follows the stroke: stroke 2 → rounding 1 (half the stroke, on
frame caps, line ends and the marker's points) → gap ≥ 2, ink to ink. A
32 × 24 box centred in a square viewBox, corner radius 4 for frame and
marker. The frame is one open path, both ends caps, and it stops gap + stroke
short, because each cap reaches half a stroke further. The marker sits on
the frame's **outer** edge, not on the box.

Those are units of the file, and a unit is a pixel. The drawing lives in the
box it is for, so every straight edge lands on a whole device pixel.

.. specimen:: guidelines/brand-signet-construction.card.html
   :viewport: 700x2193
   :title: Signet — construction

Optical sizes and their boxes
=============================

The optical files use ``viewBox="0 0 32 32"``, ``0 0 24 24`` and
``0 0 16 16``. One unit is one pixel at the size the file is for, so a
drawing is true at that size and at every multiple. That is 32, 64 and 96
for the large one, 24 and 48 for the middle, 16, 32 and 48 for the small.
Between those the edges go grey.

32 takes stroke 2 and three lines. 24 keeps stroke 2 in a smaller box, a
heavier mark, and drops the faint middle line. 16 takes stroke 1, because
sixteen pixels have no room for two, and keeps the ink of the middle size.
So the mark gets heavier as the box shrinks, not fainter. Pick the file at
the link, because a media query inside an SVG only sees its own viewport.

Every box is square, the shape of every slot a mark lands in: a favicon, an
avatar, an app icon, a bar. One number sizes it.

A signet is not an icon
=======================

Never put ``.sds-icon`` on a signet. Icon rules size a glyph from the text
around it, while each signet file fits one pixel box. The icon class erases
that choice and renders every optical file at the same size.

``.sds-signet`` sets display and flow, and no dimensions. The element or
lockup that places the mark states its width and height, and chooses the
matching file. So the size stands where the box is certain, and a brand mark
does not become a UI glyph.

.. specimen:: guidelines/brand-signet-sizes.card.html
   :viewport: 700x1016
   :title: Signet — sizes

.. specimen:: guidelines/brand-signet-modes.card.html
   :viewport: 700x666
   :title: Signet — modes & context

The family
==========

One construction, distinct interiors. Shared: the square box, the 4:3
construction inside it, the outer radius, the stroke with its rounding and
gap. And the single orange in the top-right corner. Not shared: the
interior, one idea per product.

.. specimen:: guidelines/brand-signet-family.card.html
   :viewport: 700x716
   :title: Signet — the family

A new one
=========

Everything above, as an instruction. It stands here in full because it is a
thing to hand over, not a thing to read. Copy the whole block, name the
product, and the result belongs to the family. Half of it gives a mark that
shares a colour and nothing else: every number follows from the stroke.

.. literalinclude:: signet-prompt.md
   :language: markdown
   :caption: The signet construction, as a prompt

Lockup
======

``TYPO3`` at 600, an orange pipe, ``Soul Design System`` at 300. The pipe is
separator and caret at once, and the only colour in the mark. The signet is
1.36 × the type size, the gap 0.5 ×, the clear space half the signet height.

A site with no brand draws the product name alone, at 700. There is no quiet
half to read it against, so the whole mark carries the weight of the first
word. The bar at its narrowest hides the brand and the pipe and arrives at
the same place.

.. specimen:: guidelines/brand-lockup.card.html
   :viewport: 700x213
   :title: Primary lockup

.. specimen:: guidelines/brand-lockup-light.card.html
   :viewport: 700x155
   :title: Primary lockup — light

.. specimen:: guidelines/brand-lockup-stacked.card.html
   :viewport: 700x169
   :title: Stacked lockup & app icon

Clear space, edges, motion
==========================

.. specimen:: guidelines/brand-clearspace.card.html
   :viewport: 700x203
   :title: Clear space & minimum size

.. specimen:: guidelines/brand-edges.card.html
   :viewport: 700x172
   :title: Edges & radii

.. specimen:: guidelines/brand-motion.card.html
   :viewport: 700x76
   :title: States & motion

Never
=====

- a second colour in the mark;
- equal weights on the two words;
- a stretch;
- an orange fill behind it;
- the large drawing at a small size;
- the marker in anything but orange.

.. specimen:: guidelines/brand-misuse.card.html
   :viewport: 700x259
   :title: Misuse
