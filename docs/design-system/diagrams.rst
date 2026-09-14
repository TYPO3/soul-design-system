:navigation-title: Diagrams

========
Diagrams
========

A diagram carries an explanation that prose alone shows slower, and the set
is the system's visual leitmotif. A shared grammar keeps them from one-off
drawings whose colour, geometry and meaning a reader learns again each time.

**One claim per diagram.** The title states it, the closing line states its
consequence. Two claims are two diagrams.

**If the drawing still works as a bulleted list, it is not a diagram.**
Position, length or alignment carries the meaning. Boxes and arrows are the
last resort, not the first vocabulary.

Solid means there. A dashed outline of the same shape means absent or not yet
reachable, so a shortfall has a *size*, not a sentence. Where the absent part
is a degradation, not a precondition, the dashed outline carries
``--status-warn``.

Orange marks the one thing the diagram is about: exactly one element per
drawing, often a connector, since the claim is usually a relation. When the
drawing is about degradation or failure, status colour replaces the accent
and orange stays out.

The numbers
===========

.. list-table::
   :header-rows: 0

   * - Canvas
     - ``viewBox="0 0 1200 H"``, always 1200 wide, height to fit. No radius,
       shadow, gradient or texture
   * - Margin
     - 60 units every side. Nothing enters it, labels included
   * - Type
     - Source Sans 3; identifiers, paths and flags in Source Code Pro. Title
       36 · lead 17 · node title 16 · node body 14 · label 13. **13 is the
       floor**
   * - Stroke
     - 1 node outline, 1.5 connector or boundary, 2 for the one accented
       connector
   * - Radius
     - 6 node or boundary, 4 bar, 2 unit square. Never above 6
   * - Node
     - ``--surface-raised``, 1px ``--border-subtle``, radius 6. Peers share
       one treatment; their names tell them apart, not their hues
   * - Boundary
     - Hairline only, **no fill**. A filled container makes depth out of
       colour
   * - Connector
     - 1.5px, orthogonal, one arrowhead, ``--text-muted``. No curves. Dashed
       means optional or not yet, and nothing else

.. warning::

   **Colour is an attribute**, never a ``<style>`` block, which GitHub
   strips. Each attribute is the token with the light hex behind it,
   ``fill="var(--text-primary, #1C1A17)"``. The hex is what a page shows, and
   the token is ready for the day a page can read it. Ship that one file and
   wrap its shapes in ``<g id="soul-ref">``, the handle ``make diagrams``
   reads them out from under for the specimen cards. :doc:`artwork` holds
   the whole file contract.

A diagram sits on ``--surface-sunken``. The drawing brings its own canvas,
which makes it read as a figure with clear space. On ``--surface-canvas`` it
dissolves into the page.

Drawing rules
=============

.. specimen:: guidelines/diagrams-rules.card.html
   :viewport: 980x650
   :title: Drawing rules

Worked examples
===============

Different shapes of claim need different structures. The examples below use
an axis, a sequence and containment instead of boxes joined by arrows.

.. specimen:: guidelines/diagrams-overview.card.html
   :viewport: 1400x966
   :title: System overview — a map with no axis

.. specimen:: guidelines/diagrams-example.card.html
   :viewport: 1400x1014
   :title: Worked example

.. specimen:: guidelines/diagrams-fallback.card.html
   :viewport: 1400x1034
   :title: Fallback — a sequence without a flowchart

Another one
===========

The rules above as an instruction for a drawing tool, with the file contract
and the negative constraints. It stands here in full because it is a thing
to hand over. Copy the whole block and replace ``[CLAIM]`` and
``[CONSEQUENCE]``, the only two fields that change. New numbers or new states
start a second grammar, and a set in two grammars costs a reader at every
drawing.

A diagram is the one drawing that does not come back as a picture. The
result is the SVG itself, because its colours are tokens and ``make
diagrams`` reads its shapes out for the cards above.

.. literalinclude:: diagram-prompt.md
   :language: markdown
   :caption: The diagram prompt — replace only the claim and its consequence
