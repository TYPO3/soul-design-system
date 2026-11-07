:navigation-title: Slides

======
Slides
======

A deck is the system in front of a room. It is not a second design. **A
slide is the page at twice the size, read from twice the distance.** The
frame is 960 × 540 and ``sds-slide`` doubles it, so a slide renders at
1920 × 1080. Every register, every component set and every hairline keeps
the value it has on a page.

The display step is a slide's title. **What a room reads stands a step
over the page.** The body of a content slide and the text beside a picture
take the lead step, 19 over 16. A card on a slide stands at that step as
a whole, on the paper white of ``--surface-raised``. Its title takes the
lead step, and its id the text's size.

So the system has no slide palette and no slide components.
It has one element that owns the frame, and the layouts of its own page. Those are
screens like every other page here: **Starting Points** the design system
carries as layouts. They stand live under **Slides** in the Storybook
sidebar and static under ``specimens/screens/``.

.. toctree::
   :titlesonly:
   :hidden:

   layouts
   figures

.. grid::

   .. card:: The layouts
      :href: /design-system/patterns/slides/layouts
      :icon: actions-template

      Every slide a deck runs through, with the markup that draws it.

   .. card:: Figures
      :href: /design-system/patterns/slides/figures
      :icon: actions-image

      A picture on a slide, and the room each layout leaves it.

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
- **The kinds.** A ``cover``, a ``section`` and a ``closing`` stand their
  title in the middle of the height their foot leaves. The cover and the
  closing hold the lockup
  down. ``section`` holds the deck's outline down, with its own entry
  marked. ``statement`` centres one sentence, two thirds of the frame wide. ``content`` keeps its title at
  the top margin, so it never hops between slides. Its body stands in the
  middle of the room under the title. ``speaker`` gives the
  name the left column and the portrait the right, edge to edge.
  ``figure`` shows a drawing or a screenshot. Its head is a content slide's,
  and its ``layout`` says where the picture stands. :doc:`/design-system/patterns/slides/figures` has the
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
current entry of the outline. A ``headed`` slide adds its eyebrow. In the
dark, the eyebrow takes ``--accent`` as ink. On paper, the accent has too
little contrast for text, so the eyebrow takes ``--text-accent-quiet``.

Nothing floats. A plane separates with a hairline, and the slide itself
draws one. So a slide on a page, a deck's overview or a story's stage, has
an edge where its ground is the page's.

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
     - ``--font-size-lead``, 19px
     - What a content slide holds, as a whole: its cards, lists, tables and
       code. The text beside a picture. A figure, ``sds-stat``, stands at
       the display step on its own
   * - The count
     - ``--font-size-body``, 16px
     - The count in the foot
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
until it fits. A picture keeps the width it had. Text keeps the room's
width and wraps anew, so it takes the largest scale where its height fits.
Nothing grows. A summary that cuts off its own end has stopped being a
summary.

A drawing the build put in a file fits by its own frame, with no script.
So it shows fitted from the first paint.

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
of every slide as a picture. A number typed into the count, or typed and
ended with Enter, goes straight to that slide. On the full screen the head
steps aside and a press turns the slide. The PDF is the browser's print: a
page per slide at the frame's size, text as text.

The deck fades in over the page and out of it. A turn pushes the old slide
out and the next one in. A reader who asks for reduced motion gets the deck
and the next slide at once.

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
