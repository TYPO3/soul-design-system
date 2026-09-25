:navigation-title: Slides

======
Slides
======

A deck is the system in front of a room. It is not a second design. **A
slide is the page at twice the size, read from twice the distance.** The
frame is 960 × 540 and ``sds-slide`` doubles it, so a slide renders at
1920 × 1080. Every register, every component set and every hairline keeps
the value it has on a page.

The display step is a slide's title. The body step is what a room reads. A
card on a slide is ``sds-surface`` with nothing said to it.

So the system has no slide scale, no slide palette and no slide components.
It has one element that owns the frame, and the layouts below. Those are
screens like every other page here: **Starting Points** the design system
carries as layouts. They stand live under **Slides** in the Storybook
sidebar and static under ``specimens/screens/``.

What a slide owns
=================

``sds-slide`` owns what a page has no equivalent for, and nothing else:

- **The frame.** 16:9. A margin of ``--space-10`` at the sides and
  ``--space-8`` at the top. The foot takes a step more. The display
  kinds keep ``--space-12`` at the top, as a title alone needs air. A
  title stands back by its first letter's bearing, so its ink lines up
  with the eyebrow and the lockup. Content between the tags stands in the body, the system's
  elements at the page's size.
- **The ground.** A deck stands on paper, and the slide that opens it stands
  on the terminal. That flip is the emphasis a deck has. So a deck needs no
  accent ground, and the one accent stays where the system keeps it.
  ``ground`` says which. It says ``paper`` unless told, whatever mode the
  page around it is in. A room watches a deck, and a room has no mode.
- **The kinds.** A ``cover`` stands its title in the middle of its height,
  and a ``closing`` holds it up. Both hold the lockup
  down. ``section`` holds the deck's outline down, with its own entry
  marked. ``statement`` centres one sentence, two thirds of the frame wide. ``content`` keeps its title at
  the top margin, so it never hops between slides. Its body stands in the
  middle of the room under the title. ``speaker`` gives the
  name the left column and the portrait the right, edge to edge.
  ``figure`` shows a drawing or a screenshot. Its head is a content slide's,
  and its ``layout`` says where the picture stands. `Figures`_ has the
  layouts and the room each one gives.
- **The foot.** One row, ``--space-8`` off the bottom edge. The lockup the
  bar and the footer draw, and the count in the label register. A cover and
  a closing end on the lockup alone, one step up.
  **The foot never moves.** The lockup and the count keep one place on
  every kind and every layout. A reader who goes through the deck sees them
  hold still. A picture can run under one of them. Then it stands on a
  plate: the slide's ground with a hairline round it. The plate takes its
  room from the margin, so the text stays where it was.
  ``plain`` leaves the lockup out on a slide that needs the corner or no
  mark. The count stays where it stood, and so does the row.
- **The outline.** On a divider, the deck's sections in a row. The current
  one takes the page's ink and the accent rule under it, the active item of
  a bar.

The accent marks three things on a slide, as it marks three on a page. The
pipe in the lockup, the prompt in a code block, and the rule under the
current entry of the outline. Nothing floats. A plane separates with a
hairline, and the slide itself draws one. So a slide on a page, a deck's
overview or a story's stage, has an edge where its ground is the page's.

Type and space
==============

A slide has five type roles, and each is a step of the page's scale. The
frame draws them at twice their size.

.. list-table::
   :header-rows: 1

   * - Role
     - Step
     - Where
   * - The title of a divider
     - ``--font-size-display``, 58px
     - Cover, section, statement, closing, a speaker's name
   * - The title of every other slide
     - ``--font-size-h2``, 34px
     - Content and figure slides, and beside a picture. One step, so no
       title changes its size between slides
   * - The lead
     - ``--font-size-lead``, 19px
     - The sentence under a cover's title, a speaker's role
   * - The body
     - ``--font-size-body``, 16px
     - Cards, lists, tables, and the count in the foot
   * - The note
     - ``--font-size-small``, 14px
     - A figure's finding, a caption, a statement's source

The eyebrow and a label stand in the label register. A title on a slide
sets its lines a step closer than the page does. The display step takes
``--leading-solid``, and every other title ``--leading-display``.

**One rhythm, from ink to ink.** Each line of the head ends at its ink:
the cap height above it, the baseline under it. So a gap is the same
distance whatever the size of the type.

- The eyebrow at ``--space-8``, 32px, from the top. The head starts
  ``--space-6``, 24px, under it.
- Between two lines of the head: ``--space-2``, 8px. A title adds a third
  of its own size under it, so a large title stands further off.
- From the head to what the slide holds: ``--space-6``, 24px.
- From what the slide holds to the foot: the foot's band, the same on
  every slide.

A slide on a page
=================

A long document can carry a slide in each of its parts: what the part says,
in one frame. **The slide stands where its section puts it, as a picture.**
With ``shrink`` it takes the column's width where the column is narrower
than the frame, and never grows past its own size. The deck sets it on
every slide it runs through. Two slides in a row stand the flow's
step apart, like two figures.

A picture takes no press. Nothing in a slide on a page is a link, a control
or a stop for the keyboard. The part on the page is where those work. A
reader who hears the page still hears the text. A press anywhere on the
slide opens the deck at it, as a press on a picture opens the picture.

What a slide holds always fits it. Content taller than the room shrinks
until it fits, at the width it had, so nothing wraps anew. Nothing grows.
A summary that cuts off its own end has stopped being a summary.

The deck
========

``sds-deck`` is the way through the slides, one frame at the window's size.
It has two ways in:

- **A deck of its own.** The slides stand between its tags. The page shows
  the cover and the press that plays the deck. That is a talk inside the
  text that reports on it.
- **The deck over a page.** It runs through the slides the page's sections
  hold, in page order. A long paper reads twice that way: in full, and as
  its summaries, clicked through.

The deck holds no copy of a slide. It lends each one the stage and puts it
back where it stood. So a slide has one set of markup, and the page after
the deck is the page before it.

**What every slide of a deck shares, the deck says once.** The lockup and
the count, and the outline a divider carries. A slide that says its own
keeps it. The count and the outline come from the order, so nobody keeps
either by hand.

**Every slide says where it stands.** Its eyebrow is the section it stands
in, as the outline numbers it: ``02 · What it consists of``. The deck
writes it on each slide that says none. A reader who comes in late knows
the part of the talk at a glance. A cover and a divider say something
else, and a full figure shows no head.

**The eyebrow never moves.** It stands at the top of the frame, at the
margin the lockup keeps, on every slide. The head starts one band under
it. Where a picture runs under the eyebrow, it stands on a plate.

A reader goes on with the keys, with a drag or a swipe, or from the list
of every slide as a picture. On the full screen the head steps aside and a
press turns the slide. A turn pushes the old slide out and the next one
in. A reader who asks for reduced motion gets the next one at once. The PDF is the browser's print: a page per slide at the
frame's size, text as text.

The layouts
===========

Every layout is a live page under **Slides** in the sidebar, in the order
a deck runs, and a static screen the documentation embeds. A story opens on a stage, the slide fitted
to the window with air around it. The static file is its own viewport.

Under each picture stands the markup an author writes for it. It shows
the slide as a deck holds it: the deck says the lockup and the count
once. ``make cards`` writes it from the same story as the picture, so the
two never disagree.

The frame
---------

.. specimen:: screens/slide-cover.html
   :viewport: 1920x1080
   :title: Cover

.. literalinclude:: _slides/slide-cover.html
   :language: html
   :caption: Cover, as a deck holds it

.. specimen:: screens/slide-speaker.html
   :viewport: 1920x1080
   :title: Speaker

.. literalinclude:: _slides/slide-speaker.html
   :language: html
   :caption: Speaker, as a deck holds it

.. specimen:: screens/slide-speakers.html
   :viewport: 1920x1080
   :title: Speakers

.. literalinclude:: _slides/slide-speakers.html
   :language: html
   :caption: Speakers, as a deck holds it

.. specimen:: screens/slide-section.html
   :viewport: 1920x1080
   :title: Section

.. literalinclude:: _slides/slide-section.html
   :language: html
   :caption: Section, as a deck holds it

.. specimen:: screens/slide-statement.html
   :viewport: 1920x1080
   :title: Statement

.. literalinclude:: _slides/slide-statement.html
   :language: html
   :caption: Statement, as a deck holds it

.. specimen:: screens/slide-closing.html
   :viewport: 1920x1080
   :title: Closing

.. literalinclude:: _slides/slide-closing.html
   :language: html
   :caption: Closing, as a deck holds it

The content
-----------

.. specimen:: screens/slide-cards.html
   :viewport: 1920x1080
   :title: Cards

.. literalinclude:: _slides/slide-cards.html
   :language: html
   :caption: Cards, as a deck holds it

.. specimen:: screens/slide-flow.html
   :viewport: 1920x1080
   :title: Flow

.. literalinclude:: _slides/slide-flow.html
   :language: html
   :caption: Flow, as a deck holds it

.. specimen:: screens/slide-code.html
   :viewport: 1920x1080
   :title: Code

.. literalinclude:: _slides/slide-code.html
   :language: html
   :caption: Code, as a deck holds it

.. specimen:: screens/slide-table.html
   :viewport: 1920x1080
   :title: Table

.. literalinclude:: _slides/slide-table.html
   :language: html
   :caption: Table, as a deck holds it

.. specimen:: screens/slide-numbers.html
   :viewport: 1920x1080
   :title: Numbers

.. literalinclude:: _slides/slide-numbers.html
   :language: html
   :caption: Numbers, as a deck holds it

.. specimen:: screens/slide-quote.html
   :viewport: 1920x1080
   :title: Quote

.. literalinclude:: _slides/slide-quote.html
   :language: html
   :caption: Quote, as a deck holds it

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
   * - ``row`` × 2
     - 422 × 317
     - 1.33 : 1
     - Two pictures side by side, each under its word, in ``drawings``.
       The room is each one's
   * - ``row`` × 3
     - 238 × 244
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
-------

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
   * - ``figure``, ``wide`` and ``full``
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

Designing one
=============

Open the story nearest the slide you need and change its content. The
stage scales the frame to the window, so a laptop shows the whole slide.
``fit`` on the element does that, and the static screen leaves it off. The
theme switch in the toolbar moves the stage and nothing on the slide: a
deck has its own ground.

What a slide needs is an element, never a value. A card that has to be
taller, a table that has to be denser, a code block that has to say more.
Each is a property of the element that draws it. Each is a gap in that
element if the property is not there. The page rule holds on a slide.
Nothing writes a size.

One thing scales: what a slide holds, when it does not fit. A slide is a
picture of a part, so it scales as a picture does, the whole of it at once
and never up. A font in a design is still its register. The shrink is the
slide's answer to more than a frame holds, and a slide that shrinks far
says the part needs a second slide.

A deck in the Claude app
========================

The Slides app builds a deck from the design system's README, and it writes
a closed format. Every style inline, every colour a hex, no class and no
``var()``. The README carries this page's rules in that language, the token
values written out beside the token names. So a deck from the app and a
deck from these layouts are the same design. ``.design-sync/conventions.md``
is the source of that section, and ``make design-sync`` carries it across.

What a deck needed
==================

.. list-table::
   :header-rows: 1

   * - The deck needed
     - The system grew
   * - a frame at a room's size
     - ``sds-slide``, which doubles the page rather than scales a font
   * - a ground of its own
     - ``ground`` on the frame, paper unless said, the cover on the terminal
   * - the deck's outline
     - ``sections`` and ``current`` on a divider: the bar's active item
   * - the lockup at a slide's foot
     - nothing new. ``lockup()`` from the bar and the footer, one step up on
       a cover
   * - a card, a table, a code block, a figure, a quote
     - nothing new
   * - who speaks
     - ``kind="speaker"`` with ``portrait``: the one column that runs to the
       edge. A speaker has a portrait, and it is the deck's own picture. The
       layout's follows the illustration prompt, a fixture under
       ``assets/portraits/``. Two speakers are a ``sds-byline`` each on a
       plain plane
   * - material from a page on a slide
     - ``kind="figure"``: a content slide's head, and the picture grows
       into the room its ``layout`` leaves
   * - a picture beside its text
     - ``layout="text-start"``, and ``bleed`` for a
       screenshot to the edge
   * - pictures read against each other
     - ``layout="row"`` with ``drawings``, each under its word
   * - sketches of an interface in a row
     - ``framed``, and a ``caption`` under each drawing
   * - the lockup and the count where the last slide had them
     - one place on every slide, and a plate where a picture runs under
   * - a slide in a long document
     - ``shrink``: the frame is a picture at the column's width, and
       ``zoomable`` opens it
   * - a way through the slides
     - ``sds-deck``, over the page or with slides of its own
   * - the lockup and the count on every slide
     - said once on the deck, and a slide's own wins
