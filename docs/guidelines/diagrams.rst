:navigation-title: Diagrams

========
Diagrams
========

**One claim per diagram.** The title states it, the closing line states its
consequence. Two claims are two diagrams.

**If the drawing would still work as a bulleted list, it is not a diagram.**
Meaning is carried by position, length or alignment. Boxes and arrows are
the last resort, not the starting vocabulary.

Solid means there; a dashed outline of the same shape means missing or not
yet reachable — so a shortfall has a *size*, not a sentence. Where the
missing part is a degradation rather than a precondition, the dashed outline
carries ``--status-warn``.

Orange marks the one thing the diagram is about — exactly one element per
drawing, and often a connector rather than a box, since the claim is usually
a relation. When the drawing is about degradation or failure, status colour
replaces the accent and orange stays out entirely.

The numbers
===========

.. list-table::
   :header-rows: 0

   * - Canvas
     - ``viewBox="0 0 1200 H"`` — always 1200 wide, height to fit, no radius
   * - Margin
     - 60 units every side. Nothing enters it, labels included
   * - Type
     - Title 36 · lead 17 · node title 16 · node body 14 · label 13. **13 is
       the floor**
   * - Stroke
     - 1 node outline, 1.5 connector or boundary, 2 for the one accented
       connector
   * - Radius
     - 6 node or boundary, 4 bar, 2 unit square. Never above 6
   * - Boundary
     - Hairline only, **no fill** — a filled container makes depth out of
       colour
   * - Connector
     - 1.5px, orthogonal, one arrowhead, ``--text-muted``. No curves

.. warning::

   **Colour is written as attributes**, never a ``<style>`` block — GitHub
   strips those. Each attribute is the token with the light hex behind it,
   ``fill="var(--text-primary, #1C1A17)"``, so one file serves both modes.
   Ship that one file, wrap its shapes in ``<g id="art">``, and reference it
   with ``<use>`` rather than linking it with ``<img>``: a linked file renders
   in a document of its own, where no token is declared.

Diagrams sit on ``--surface-sunken``. The drawing brings its own canvas, and
that is what makes it read as a figure with clear space — put it on
``--surface-canvas`` and it dissolves into the page with no boundary at all.

Drawing rules
=============

.. specimen:: guidelines/diagrams-rules.card.html
   :viewport: 980x510
   :title: Drawing rules

Worked examples
===============

Three shapes of claim, solved three ways — an axis, a sequence, a
containment.

.. specimen:: guidelines/diagrams-overview.card.html
   :viewport: 1400x937
   :title: System overview — a map with no axis

.. specimen:: guidelines/diagrams-example.card.html
   :viewport: 1400x982
   :title: Worked example

.. specimen:: guidelines/diagrams-fallback.card.html
   :viewport: 1400x1022
   :title: Fallback — a sequence without a flowchart
