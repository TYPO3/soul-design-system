:navigation-title: Spacing and layout

==================
Spacing and layout
==================

A 210px rail, a 1200px page measure, 48px gutters: ``--width-sidebar``,
``--width-page`` and ``--gutter-page``, so no surface writes a width of its
own. Section boundaries are full-bleed hairlines. The content inside them
keeps the measure.

**1px grid gaps over a** ``--border-subtle`` **background** produce the
hairline-separated card grid. It is the system's signature move, and the
reason nothing on the page needs a shadow to stand apart from its neighbour.

The header is sticky, translucent canvas with an 8px backdrop blur. Nothing
else in the system is sticky, transparent or blurry. It **never wraps**. A
header on two lines moves the sticky offset everything below measures
against, so it sheds as the window narrows. :doc:`/frontend/layout` has the
order and the width of each step, in one table.

Space scale
===========

A 4px base, halved below 16 and sparser above 24. The half steps,
``--space-0-5``, ``--space-1-5``, ``--space-2-5``, ``--space-3-5``, are the
small end of the same grid. A glyph beside a word and a label over its value
sit at distances 4px is too coarse for. A scale with no step there gets a
literal under it. Above 16 nothing has needed one.

Every step stands in ``rem``. So do the type scale, the measures, the
control heights and the widths of the page. The whole grid follows the type
size a reader set in the browser, and a gap grows with the word beside it. A
pixel figure in this manual is what a token draws at the browser's default,
16px to the rem. A pixel stays on what the browser draws rather than sets: a
hairline, a radius, a focus ring, a viewport width a layout changes at.

.. specimen:: guidelines/spacing-scale.card.html
   :viewport: 700x125
   :title: Space scale

A boxed block takes ``--block-pad-y`` by ``--block-pad-x``, and every box
shares the horizontal value. So a card, a note, a modal and a code block
start their text on the same edge, in any stack.

Reading rhythm
==============

A reading column runs on ``--space-4`` between neighbours. A heading adds its
own air above that step: ``--space-10`` above a second level, ``--space-8``
above a third and ``--space-6`` above a fourth. The decreasing air carries
the hierarchy where the heading sizes no longer change.

One flex gap cannot express this. A gap is a minimum between every pair of
children, and it cannot shrink for the quieter step into a paragraph or a
list. So the shared step belongs to the column, and the extra distance
belongs to the heading whose level gives it meaning. A flow where a heading
gets a paragraph's air has no hierarchy, whatever its type size says.

The air is for a heading **on the page**. A ``hidden`` heading, and one in
the ``sds-said-only`` register, heard and not seen, take none with them. The
distance says which level starts, and a gap for a heading nobody sees has no
reason in it.

The lower step follows a different ownership rule, because authored blocks
also appear inside components. :doc:`/frontend/documents` says when the
element keeps that step and when a container with its own gap takes it back.

The scale, enforced
===================

The scale holds by construction, not by measurement. Every component draws
its sizes and gaps through its own property set, derived from the tokens.
``make verify ARGS=sets`` holds that route. A page composes components
without a style of its own. So a value off the scale reaches a surface only
through a token or a set, where review reads it beside its reason.

A fractional computed size can still be right. An ``em`` correction relative
to its context is an optical decision, not a new step. Diagrams carry their
own type rules for the same reason.

Layout frame
============

.. specimen:: guidelines/spacing-layout.card.html
   :viewport: 700x152
   :title: Layout frame

Radius, by role
===============

Radius follows what a thing *is*, not how loud it looks.

.. list-table::
   :header-rows: 1

   * - Role
     - Value
     - Applies to
   * - Structural
     - ``0``
     - section rules, table lines, header underline, hairline grids
   * - Control
     - ``--radius-control`` 4px
     - buttons, fields, selects, tabs, badges, **code blocks**
   * - Container
     - ``--radius-card`` 6px
     - cards, panels, modals

A container must not share its corner with its contents. That is the whole
reason the card is one step larger than the control inside it. Hard edges
stay where they do structural work.
