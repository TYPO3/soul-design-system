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

- **The frame.** 16:9, a margin of ``--space-16`` on every side, one step
  more at the foot where a foot stands. Content between the tags stands in
  the body, the system's elements at the page's size.
- **The ground.** A deck stands on paper, and the slide that opens it stands
  on the terminal. That flip is the emphasis a deck has. So a deck needs no
  accent ground, and the one accent stays where the system keeps it.
  ``ground`` says which. It says ``paper`` unless told, whatever mode the
  page around it is in. A room watches a deck, and a room has no mode.
- **The kinds.** ``cover`` and ``closing`` hold the title up and the lockup
  down. ``section`` holds the deck's outline down, with its own entry
  marked. ``statement`` centres one sentence. ``content`` keeps its title at
  the top margin, so it never hops between slides. ``speaker`` gives the
  name the left column and the portrait the right, edge to edge.
- **The foot.** One row, ``--space-8`` off the bottom edge. The lockup the
  bar and the footer draw, and the count in the label register. A cover and
  a closing end on the lockup alone, one step up.
- **The outline.** On a divider, the deck's sections in a row. The current
  one takes the page's ink and the accent rule under it, the active item of
  a bar.

The accent marks three things on a slide, as it marks three on a page. The
pipe in the lockup, the prompt in a code block, and the rule under the
current entry of the outline. Nothing floats. A plane separates with a
hairline, and the slide itself draws one. So a slide on a page, a deck's
overview or a story's stage, has an edge where its ground is the page's.

The layouts
===========

Every layout is a live page under **Slides** in the sidebar, in the order
a deck runs, and a static screen the documentation embeds. A story opens on a stage, the slide fitted
to the window with air around it. The static file is its own viewport.

The frame
---------

.. specimen:: screens/slide-cover.html
   :viewport: 1920x1080
   :title: Cover

.. specimen:: screens/slide-speaker.html
   :viewport: 1920x1080
   :title: Speaker

.. specimen:: screens/slide-speakers.html
   :viewport: 1920x1080
   :title: Speakers

.. specimen:: screens/slide-section.html
   :viewport: 1920x1080
   :title: Section

.. specimen:: screens/slide-statement.html
   :viewport: 1920x1080
   :title: Statement

.. specimen:: screens/slide-closing.html
   :viewport: 1920x1080
   :title: Closing

The content
-----------

.. specimen:: screens/slide-cards.html
   :viewport: 1920x1080
   :title: Cards

.. specimen:: screens/slide-flow.html
   :viewport: 1920x1080
   :title: Flow

.. specimen:: screens/slide-code.html
   :viewport: 1920x1080
   :title: Code

.. specimen:: screens/slide-table.html
   :viewport: 1920x1080
   :title: Table

.. specimen:: screens/slide-numbers.html
   :viewport: 1920x1080
   :title: Numbers

.. specimen:: screens/slide-quote.html
   :viewport: 1920x1080
   :title: Quote

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
Nothing scales a font, and nothing writes a size.

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
