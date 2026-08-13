:navigation-title: Spacing and layout

==================
Spacing and layout
==================

210px tool rail, a 960px page measure, 48px gutters. Section boundaries are
full-bleed hairlines; the content inside them respects the measure.

**1px grid gaps over a** ``--border-subtle`` **background** produce the
hairline-separated card grid — the system's signature move, and the reason
it needs no shadows to separate anything.

The header is sticky, translucent canvas with an 8px backdrop blur. Nothing
else in the system is fixed, transparent or blurred. It **never wraps**: it
sheds in a fixed order, widest first — 1120px mode-switch labels, 1040px
transport line, 820px navigation into a panel, 620px ``Soul Design System``
off the wordmark. A header that wraps to two lines breaks the sticky offset
everything below is measured against.

Space scale
===========

A 4px base, halved below 16 and thinning out above 24. The half-steps —
``--space-0-5``, ``--space-1-5``, ``--space-2-5``, ``--space-3-5`` — are the
small end of the same grid rather than an exception to it: a glyph beside a
word and a label over its value are read at distances 4px is too coarse for,
and a scale with no step there is a scale that gets a literal typed under it.
Above 16 nothing has needed one.

A boxed block takes ``--block-pad-y`` by ``--block-pad-x``, and every box in
the system shares the horizontal value, so a card, a note, a modal and a code
block start their text on the same edge however they are stacked.

.. specimen:: guidelines/spacing-scale.card.html
   :viewport: 700x130
   :title: Space scale

Layout frame
============

.. specimen:: guidelines/spacing-layout.card.html
   :viewport: 700x180
   :title: Layout frame

Radius, by role
===============

Radius follows what a thing *is*, not how loud it should look.

.. list-table::
   :header-rows: 1

   * - Role
     - Value
     - Applies to
   * - Structural
     - ``0``
     - Section rules, table lines, header underline, hairline grids
   * - Control
     - ``--radius-control`` 4px
     - Buttons, fields, selects, tabs, badges, **code blocks**
   * - Container
     - ``--radius-card`` 6px
     - Cards, panels, modals

A container must not share its corner with its contents. That is the whole
reason the card is one step larger than the control inside it.
