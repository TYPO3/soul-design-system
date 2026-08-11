:navigation-title: Brand

=====
Brand
=====

**The signet is a construction, not a fixed drawing.** What this system
fixes is *how* one is built. The mark in ``assets/`` came from the Dev
Companion prototype and is a worked example of the rules — the reference
implementation, not an approved product mark. A product adopting this system
draws its own to the same construction.

Three are shipped, so the claim can be checked rather than believed:
``dev-companion-signet-{l,m,s}.svg``, ``tryout-signet-{l,m,s}.svg``, and
``design-system-signet-{l,m,s}.svg`` for the system itself. Box, outer
radius, stroke, rounding, gap and the single orange in the top-right corner
are the same in all three; only the interior differs, and it carries one
idea.

The system's own mark has no window and its accent is a stroke, both on
purpose: a frame reads as a terminal, and a terminal is what the products
are, not what the system is. The construction is written out as something to
act on further down this page — hand it to an agent with a product name and
it should produce a mark that belongs here.

.. warning::

   This is **not** an approved TYPO3 product. The TYPO3 Soul is not used,
   and no surface may imply endorsement — footers say what the product is,
   never whose it is.

How one is drawn
================

Everything follows the stroke: stroke 2 → rounding 1 (half the stroke, on
frame caps, line ends and the marker's points alike) → gap ≥ 2, measured ink
to ink. A 32 × 24 box centred in a square viewBox, corner radius 4 shared by
frame and marker. The frame is one open path — both ends are caps, not
cuts — and it stops gap + stroke short, because each cap reaches half a
stroke further. The marker sits on the frame's **outer** edge, not on the box.

Those are units of the file, and a unit is a pixel: the drawing is made in
the box it is for, so every straight edge is a whole number and lands on a
whole device pixel.

.. specimen:: guidelines/brand-signet-construction.card.html
   :viewport: 700x1961
   :title: Signet — construction

Three sizes, each drawn in its own box
======================================

The three files are ``viewBox="0 0 32 32"``, ``0 0 24 24`` and
``0 0 16 16``: one unit is one pixel at the size the file is for, so a
drawing is true at that size and at every multiple of it — 32, 64, 96 for
the large one, 24 and 48 for the middle, 16, 32 and 48 for the small. Between
those it is a vector like any other and the edges go grey.

32 takes stroke 2 and three lines; 24 keeps stroke 2 in a smaller box, which
is a heavier mark, and drops the faint middle line; 16 takes stroke 1,
because sixteen pixels have nowhere to put two, and keeps the ink of the
middle size so the mark gets heavier as the box shrinks rather than fainter.
Pick the file at the link, because a media query inside an SVG only sees its
own viewport.

Every box is square, which is the shape every slot a mark lands in already
has — a favicon, an avatar, an app icon, a bar. One number sizes it, and
there is no aspect to state twice or to get wrong.

.. specimen:: guidelines/brand-signet-sizes.card.html
   :viewport: 700x922
   :title: Signet — sizes

.. specimen:: guidelines/brand-signet-modes.card.html
   :viewport: 700x619
   :title: Signet — modes & context

The family
==========

Three marks, one construction. What is shared is the square box and the 4:3
construction inside it, the outer radius, the stroke and its two consequences
(rounding, gap), and the single orange in the top-right corner. What is not shared is the interior — one idea per
product.

.. specimen:: guidelines/brand-signet-family.card.html
   :viewport: 700x649
   :title: Signet — the family

Drawing a new one
=================

Everything above, written as something to act on. It is here in full and not
behind a link because it is a thing to hand over rather than a thing to read:
copy the whole block, name the product, and what comes back should belong to
the family without its author having seen a single sibling. Take half of it
and you get a mark that shares a colour and nothing else — every number in it
follows from the stroke, and the rules that keep three sizes reading as one
mark are the ones easiest to leave behind.

.. literalinclude:: signet-prompt.md
   :language: markdown
   :caption: The signet construction, as a prompt

Lockup
======

``TYPO3`` at 600, an orange pipe, ``Soul Design System`` at 300. The pipe is
separator and caret at once, and the only colour in the mark. Signet is
1.36 × the type size, gap 0.5 ×, clear space half the signet height.

.. specimen:: guidelines/brand-lockup.card.html
   :viewport: 700x215
   :title: Primary lockup

.. specimen:: guidelines/brand-lockup-light.card.html
   :viewport: 700x176
   :title: Primary lockup — light

.. specimen:: guidelines/brand-lockup-stacked.card.html
   :viewport: 700x190
   :title: Stacked lockup & app icon

Clear space, edges, motion
==========================

.. specimen:: guidelines/brand-clearspace.card.html
   :viewport: 700x300
   :title: Clear space & minimum size

.. specimen:: guidelines/brand-edges.card.html
   :viewport: 700x180
   :title: Edges & radii

.. specimen:: guidelines/brand-motion.card.html
   :viewport: 700x90
   :title: States & motion

Never
=====

A second colour in the mark. Equal weights on the two words. Stretching. An
orange fill behind it. The large drawing at a small size. The marker in
anything but orange.

.. specimen:: guidelines/brand-misuse.card.html
   :viewport: 700x250
   :title: Misuse
