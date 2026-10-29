:navigation-title: Diagrams

========
Diagrams
========

A diagram carries an explanation that prose alone shows slower, and the set
is the system's visual leitmotif. A shared grammar keeps them from one-off
drawings whose colour, geometry and meaning a reader learns again each time.

**One claim per diagram.** The heading of the page states it, and the
caption under the drawing states its consequence. The drawing carries
neither. Two claims are two diagrams.

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
     - Source Sans 3; identifiers, paths and flags in Source Code Pro. The
       value of a tile 36 · node title 16 · node body 14 · label 13. **13 is
       the floor**
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

   **Colour is an attribute**, never a rule in a ``<style>`` block, which
   GitHub strips. Each attribute is the token with the light hex behind it,
   ``fill="var(--text-primary, #1C1A17)"``. The hex is what a page shows, and
   the token is ready for the day a page can read it. Ship that one file and
   wrap its shapes in ``<g id="soul-ref">``, the handle ``make diagrams``
   reads them out from under for the specimen cards. :doc:`/design-system/artwork` holds
   the whole file contract.

A diagram sits on ``--surface-sunken``. The drawing brings its own canvas,
which makes it read as a figure with clear space. On ``--surface-canvas`` it
dissolves into the page.

On a slide
==========

A drawing for a slide keeps the grammar and leaves the frame. It has no
eyebrow, no title and no closing line: the slide's head says them. It has
no margin, as the slide's margin is its margin. Its canvas is the room of
its layout in the frame's pixels, which :doc:`/design-system/slides` states, and not 1200
wide. A drawing in parts is a row of drawings: the slide gives each its
plane, its word and its caption as text. ``slide-lookup.svg`` is one
drawing for ``wide``, the three ``slide-cache-*.svg`` a row.

Two ways to a drawing
=====================

A drawing comes from a text or from a hand. Both follow the grammar on this
page, and both give the same file: an SVG in the tokens, 1200 wide.

- **From a text.** The engine draws a ``.diagram`` text and holds the
  numbers above for the author. :doc:`writing` is the whole of that path:
  where the text goes, its syntax, and a drawing of each layout.
- **By hand.** A drawing the layouts cannot make comes from a hand, in a
  tool or in an editor. The author then holds every number and rule on this
  page. :ref:`diagrams-by-hand` says what the file must be.

Drawn from a text
=================

The engine in ``packages/frontend/src/lib/diagram/`` holds the numbers
above, so a text cannot break them. It refuses a text too wide for its box,
type under 13 and a radius above 6. It also refuses a second emphasis of
another kind and a connector label with no room. The error names the part,
so the author shortens the text or widens the gap.

A flow on a page first
moves room between its columns, then grows up to twice its width. Columns
grow the same way, for a long word or a control that cannot wrap. The
engine refuses only what still does not fit.

The element is the source, and a built page holds the drawing as a file.
``sds-diagram`` draws its text live: in a story, on a card, on a page
written by hand. The finish step of a site draws each one once, into a file
under ``_diagrams/``. The page keeps a small ``svg`` with the title, the
description and a ``use`` of the group ``soul-ref`` in that file. So the
shapes read the page's tokens and turn with its mode, and the browser draws
nothing.

A drawing on a figure slide gets the room the slide gives it. The step
works that room out from the slide's head, with no browser. A deck's stage
can give another room. Then a second drawing stands beside the first, and
the stylesheet shows the one for the place of the slide. A drawing a press
zooms keeps its element, because the viewer is its work.

The text names its layout. Each layout is a shape of claim:

.. list-table::
   :header-rows: 1

   * - Layout
     - The claim it carries
   * - ``flow``
     - nodes on a grid, orthogonal connectors, boundaries around nodes
   * - ``sequence``
     - lanes and numbered steps in phases, time down the page
   * - ``matrix``
     - rows against columns with a sign in each cell, and a legend
   * - ``bars``
     - lengths on one scale, in segments, against a dashed target
   * - ``units``
     - counts as unit squares, a missing part as dashed squares in its place
   * - ``cells``
     - things as cells in named groups, each with its sign
   * - ``chips``
     - identifiers as chips in rows or columns: planned, small, later
   * - ``notes``
     - a numbered list, the sentences behind the markers of a sketch
   * - ``compose``
     - layouts side by side or one under the other, with one emphasis
   * - ``tiles``
     - figures side by side, the value largest
   * - ``columns``
     - the parts of a whole as columns of items
   * - ``sketch``
     - screens as nested regions, with numbered places

Each drawing has one emphasis: one part, or peers of one kind that make the
same claim. ``claim`` sets its colour: the accent, or a
status colour when the drawing is about a failure or a degradation. A part
in the state ``absent`` or ``degraded`` gets the dashed outline of the same
shape.

The signs have one meaning each, in every drawing, by hand or from a text:

- A check in ``--status-ok`` means yes. The check in brackets in
  ``--status-warn`` means in part. A dash in ``--status-error`` means no. A
  question mark in ``--text-muted`` means not known.
- A filled dot means present. A ring means planned.
- A screen with a filled page means in the page. A screen with a filled
  side means in a panel next to the page. Both filled means both. A filled
  top means in the bar over the page. A filled left side means in the
  navigation beside the page. A filled top with a band under it means in
  the head of a module. A sheet with lines means in a form or a dialog. A
  screen with each part in a quiet fill means a place that each case fills
  in.
- A filled chip means part of the plan now. An outlined chip means a small
  first version, and a bare identifier means later. A ring under a chip adds the
  one condition the legend names.
- ``NEW`` above a node is a part that the change adds. ``CHANGED`` in
  ``--status-warn`` is a part that the change alters, and its edge is solid
  in the same colour. A dashed edge in that colour is a degraded part.
- A phase of a sequence is a band. A grey band is a step on the way. A band
  in the quiet wash of a status ends in that status. That is
  ``--surface-error-quiet`` for a failure, ``--surface-ok-quiet`` for the
  result.
- A head and shoulders before a name is a person. A cylinder before a name
  is a store that the other parts read and write.
- An ink disc with a number is a step of a sequence. On a sketch, it is a
  place that the text refers to.

A drawing from a text carries its faces. A picture shown as an image sees no
face of the page. So the file brings a cut of each face and weight that it
sets, in one ``<style>`` block. That block holds faces and nothing else:
every colour stays an attribute. A renderer that drops the block sets the
shipped face or the system's instead. The engine measures every text
against the widest fallback too, so the text still fits its box.

A drawing from a text is the drawing alone. It is 1200 wide, with its margin
and its canvas, and with no eyebrow, title or consequence in it. The page
around it says the claim in its heading and the consequence in the caption
of ``sds-figure``. The title and the description of the text are the
accessible name of the file.

In a page, the drawing takes the width of its column. It shrinks until its
smallest type, 13, stands at 9 pixels, and a narrower column scrolls it. So
a phone shows a part of the drawing at a size a reader can read.

With a slide's room, the engine draws the same text with no margin, at the
room's pixels. It refuses a drawing taller than the room, and says how much
of the room the drawing fills.

In a room that a slide lends, the engine also sets the drawing dense. The
type stays at its sizes, and the controls, rows, pads and gaps are lower.
:doc:`/design-system/diagrams/writing` says when.

.. _diagrams-by-hand:

Drawn by hand
=============

A drawing by hand keeps every number of this page. A reader must not see
which way a drawing came.

- **Canvas and margin.** ``viewBox="0 0 1200 H"``, 60 units free on every
  side. For a slide, the room of its layout and no margin.
- **Colour as an attribute.** Every fill and stroke is the token with the
  light hex behind it, ``fill="var(--text-primary, #1C1A17)"``. No colour
  goes into a ``<style>`` block, and no gradient, shadow or texture goes
  anywhere.
- **The handle.** The shapes stand in ``<g id="soul-ref">``. A page
  references that group, so the drawing reads the page's tokens.
- **Type.** Source Sans 3 and Source Code Pro, 13 at the smallest. Set the
  text in the drawing as ``<text>``, not as paths, so a reader can find it.
- **The name.** ``<title>`` holds the claim and ``<desc>`` what the drawing
  shows, with ``role="img"`` on the root.
- **One emphasis, one meaning per sign.** The signs above, and nothing new
  in their place.

:doc:`/design-system/artwork` holds the whole file contract. The prompt at
the foot of this page gives the same rules to a drawing tool. A file by hand
has no ``.diagram`` beside it, so ``make diagrams`` reads its shapes and
leaves the file as it is.

.. toctree::
   :hidden:

   writing

Drawing rules
=============

.. specimen:: guidelines/diagrams-rules.card.html
   :viewport: 980x674
   :title: Drawing rules

Worked examples
===============

Different shapes of claim need different structures. The examples below use
an axis, a sequence and containment instead of boxes joined by arrows.

.. specimen:: guidelines/diagrams-overview.card.html
   :viewport: 1400x759
   :title: System overview — a map with no axis

.. specimen:: guidelines/diagrams-example.card.html
   :viewport: 1400x683
   :title: Worked example

.. specimen:: guidelines/diagrams-fallback.card.html
   :viewport: 1400x790
   :title: Fallback — a sequence without a flowchart

For a drawing tool
==================

The rules above as an instruction for a drawing tool, with the file contract
and the negative constraints. It stands here in full because it is a thing
to hand over. Copy the whole block and replace ``[CLAIM]`` and
``[CONSEQUENCE]``, the only two fields that change. New numbers or new states
start a second grammar, and a set in two grammars costs a reader at every
drawing.

A diagram is the one drawing that does not come back as a picture. The
result is the SVG itself, because its colours are tokens and ``make
diagrams`` reads its shapes out for the cards above. A drawing that a layout
can make is a ``.diagram`` that the engine draws. The prompt is for a
drawing that no layout makes.

.. literalinclude:: diagram-prompt.md
   :language: markdown
   :caption: The diagram prompt — replace only the claim and its consequence
