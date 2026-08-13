:navigation-title: Spacing and layout

==================
Spacing and layout
==================

A 210px rail, a 1200px page measure, 48px gutters — ``--width-sidebar``,
``--width-page`` and ``--gutter-page``, so no surface writes a width of its
own. Section boundaries are full-bleed hairlines; the content inside them
respects the measure.

**1px grid gaps over a** ``--border-subtle`` **background** produce the
hairline-separated card grid — the system's signature move, and the reason
it needs no shadows to separate anything.

The header is sticky, translucent canvas with an 8px backdrop blur. Nothing
else in the system is fixed, transparent or blurred. It **never wraps**: a
header on two lines moves the sticky offset everything below is measured
against, so as the window narrows it sheds instead. :doc:`/frontend/layout`
has the order it sheds in and the width each step happens at — one table, so
a breakpoint is written down once.

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

Reading rhythm
==============

A reading column runs on ``--space-4`` between neighbouring blocks. A heading
adds its own air above that flow step: ``--space-10`` above a second level,
``--space-8`` above a third and ``--space-6`` above a fourth. The decreasing
purchase carries hierarchy after the heading sizes stop changing.

This cannot be expressed as one flex gap. A gap is a minimum between every
pair of children and cannot be undercut for the quieter transition into a
paragraph or list. The shared flow step therefore belongs to the column and
the additional distance belongs to the heading whose level gives it meaning.
A flow where a heading receives the same air as a paragraph has no hierarchy,
whatever its type size says.

The lower step follows a different ownership rule because authored blocks also
appear inside components. :doc:`/frontend/documents` explains when the element
keeps that step and when a container with its own gap takes it back.

Keeping the scale enforceable
=============================

``make rhythm`` renders the starting points and measures their font sizes,
padding and gaps against the ``--font-size-*`` and ``--space-*`` values read
directly from the token files. The check carries no list of token names, so a
renamed or added step cannot leave a second copy behind.

A whole-pixel font size outside the type scale is a local value that should
have been a role. A fractional computed font size may be an ``em`` correction
relative to its context, so the report identifies it without treating it as a
new scale step. Diagrams carry their own measured type rules and are reported
separately.

A positive layout gap outside the space scale fails the check. That makes the
scale a constraint on rendered relationships rather than merely a palette of
variables a stylesheet may choose to ignore.

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
reason the card is one step larger than the control inside it. Hard edges stay
where they perform structural work rather than becoming a louder version of a
control or container.
