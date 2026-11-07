:navigation-title: Figures

=======
Figures
=======

A figure slide shows a picture: a drawing, a screenshot, a matrix. The
picture stands in the ``figure`` region, ``<sds-image slot="figure">`` or a
drawing inline, and takes the room its layout leaves. ``src`` and ``alt``
are the short form. **It grows or shrinks whole into that room.** A picture
scales as a picture does. Text
does not: what stands between the tags keeps its register, and only
shrinks when it does not fit.

The head and the foot stand where a content slide has them. Only the
picture takes more room: nearly the whole frame under ``full``, and the
edges of the frame under ``bleed``. Under ``full`` nobody sees the head,
and the lockup goes. The count stays at its place, on a plate.

A drawing in a row can carry a ``caption``: what it shows, in a line or
two under it. The caption is text in the page's small register. It reads
at the size of every other small line and never shrinks with the picture.
With ``framed`` each drawing stands on a plane with a hairline, its caption
inside. That is for a sketch of an interface, which has no edge of its own.

**A drawing's key can stand in the head.** ``legend`` sets it at the
right of the title, on its line: ``■ MVP | □ First version | ID later``.
The drawing then leaves its own legend out, and the room under the head
is the drawing's.

**The drawings of a row share one scale.** Each drawing from a text takes
the room the densest of the row needs. So a label is one size across the
row, and the keys under the frames line up.

.. list-table::
   :header-rows: 1

   * - Layout
     - Room
     - Ratio
     - For
   * - ``wide``
     - 877 × 354
     - 2.5 : 1
     - A drawing under the head and its note. The default
   * - ``full``
     - 925 × 505
     - 1.83 : 1
     - A view that needs the whole frame: an interface, an architecture.
       Only the count shows, and the head stays for a reader who hears it
   * - ``headed``
     - 877 × 354
     - 2.5 : 1
     - A view that needs the frame, under a short head and a rule. The
       eyebrow takes the accent in the dark, and the quiet accent ink on
       paper. The foot is the count alone
   * - ``row`` × 2
     - 422 × 313
     - 1.35 : 1
     - Two pictures side by side, each under its word, in ``drawings``.
       The room is each one's
   * - ``row`` × 3
     - 238 × 240
     - 1 : 1
     - Three sketches side by side, each on its plane with its caption
       under it. ``framed`` draws the planes
   * - ``text-start``
     - 519 × 401
     - 1.29 : 1
     - A column of text at the start and the picture beside it. The text
       stands in the middle of the column under the title, a step larger
   * - ``bleed``
     - 559 × 538
     - 1.04 : 1
     - Beside the text, a screenshot that fills its column to the edges of
       the frame. It keeps its top left corner, and the rest runs over

**The room is the format.** It is in the frame's own pixels, 960 × 540,
and the slide draws at twice that. The figures hold for a title of one
line. A note of one line under it takes 32 from the height, and so does a
second line of the title. A picture of that ratio fills
its room. A narrower one leaves the sides empty, and a flatter one the top
and the bottom.

Regions
=======

What a slide shows goes between its tags, into named regions. What sets
it up stays an attribute: its kind, its layout, its ground, its count.

Every kind takes the lines of its head as regions: ``eyebrow``,
``heading``, ``lead`` and ``note``. A line in its region keeps its markup,
an ``<em>`` or a ``<code>``, and wins over the attribute of its name. The
attribute stays as the short form for a line of plain text.

.. code-block:: html

   <sds-slide kind="figure" layout="text-start">
     <span slot="eyebrow">02 · What it consists of</span>
     <h2 slot="heading">One key for <em>two</em> languages</h2>
     <p>The German call fills the slot.</p>
     <svg slot="figure" viewBox="0 0 877 354">…</svg>
   </sds-slide>

.. list-table::
   :header-rows: 1

   * - Layout
     - Regions
   * - ``content``
     - ``text``, the one a child without a ``slot`` goes to
   * - ``figure``, ``wide``, ``full`` and ``headed``
     - ``figure``
   * - ``figure``, ``row``
     - ``figure``, once for each drawing
   * - ``figure``, ``text-start``
     - ``text`` and ``figure``
   * - ``speaker``
     - ``text`` and ``portrait``

The ``figure`` region takes any markup. **A drawing inline reads the
page's tokens and faces**, so it keeps the system's type and turns with the
mode. A drawing alone in the region fills the room as a picture does.
Other markup shrinks until it fits. ``<figure slot="figure">`` brings its
word as ``data-label`` and what it shows as its ``<figcaption>``. A static
render takes the same through the ``drawings`` property, with ``content``
in place of ``src``.

**Take an element before you draw.** Most figures of a paper are one of a
few kinds, and the system has an element for each. Such a figure is markup
between the tags of the slide, in the system's type, and a reader can copy
its words:

.. list-table::
   :header-rows: 1

   * - The figure
     - What it is on a slide
   * - Things against criteria, a sign in every cell
     - ``sds-table`` with an ``sds-icon`` and its ``label`` in each cell,
       under ``sds-td-sign``. The legend is the caption
   * - Figures, each with its sentence
     - ``sds-stat`` in ``sds-grid``
   * - Boxes that each say a thing, in no order
     - ``sds-card`` or ``sds-surface`` in ``sds-grid``
   * - Three screens or sketches side by side
     - Three drawings in ``row``, each drawn at its own room. Never one
       drawing with three panels in it
   * - One screen, whole
     - One drawing under ``full``

Only what has lines between its parts is a drawing: a flow with branches,
an architecture, a sketch of an interface.

A drawing for a slide is its own file:

- **No head and no foot of its own.** The slide's title is its title. The
  note under it is optional, and says the finding where the drawing does
  not. A drawing for a page carries both, and on a slide says them twice.
  A fragment of the file cannot cut them off: an image shows the whole file.
- **No margin of its own.** The slide's margin is its margin, so it starts
  at the edge the title starts at.
- **Each part says what it is.** A drawing in parts gives each part a
  plane. Over what the part shows stand its heading and a line of context,
  and its consequence stands under it.
- **Drawn at its room,** in the frame's pixels: its canvas is the room in
  the table above, ``viewBox="0 0 877 354"`` for ``wide``. A label at 13
  there is 13 in the frame and 26 on the room's screen. A canvas 1200 wide
  shrinks with the room. In a row of three, nobody in a room reads its
  labels.
- **One claim.** A drawing that needs more than its room has more than one
  claim, and is two slides.

.. specimen:: screens/slide-figure.html
   :viewport: 1920x1080
   :title: Figure

.. literalinclude:: _slides/slide-figure.html
   :language: html
   :caption: Figure, as a deck holds it

.. specimen:: screens/slide-figure-full.html
   :viewport: 1920x1080
   :title: Figure, full

.. literalinclude:: _slides/slide-figure-full.html
   :language: html
   :caption: Figure, full, as a deck holds it

.. specimen:: screens/slide-figure-pair.html
   :viewport: 1920x1080
   :title: Figure, pair

.. literalinclude:: _slides/slide-figure-pair.html
   :language: html
   :caption: Figure, pair, as a deck holds it

.. specimen:: screens/slide-figure-row.html
   :viewport: 1920x1080
   :title: Figure, row

.. literalinclude:: _slides/slide-figure-row.html
   :language: html
   :caption: Figure, row, as a deck holds it

.. specimen:: screens/slide-figure-slots.html
   :viewport: 1920x1080
   :title: Figure, slots

.. literalinclude:: _slides/slide-figure-slots.html
   :language: html
   :caption: Figure, slots, as a deck holds it

.. specimen:: screens/slide-figure-text.html
   :viewport: 1920x1080
   :title: Figure, text

.. literalinclude:: _slides/slide-figure-text.html
   :language: html
   :caption: Figure, text, as a deck holds it

.. specimen:: screens/slide-figure-bleed.html
   :viewport: 1920x1080
   :title: Figure, bleed

.. literalinclude:: _slides/slide-figure-bleed.html
   :language: html
   :caption: Figure, bleed, as a deck holds it
