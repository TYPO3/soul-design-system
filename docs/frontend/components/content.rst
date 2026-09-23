:navigation-title: Content

=======
Content
=======

The blocks of a page. A plane, a way into something, an entry in a list, a
figure, a borrowed sentence. And the two that state what an answer carries
besides the answer.

None of them draws a shadow. The system has none. A fill and a hairline
tell a plane apart, and a container never shares its corner with its
contents. That is why the card radius is one step larger than the control
radius, and why nothing here sets either by hand.

.. _component-sds-eyebrow:

sds-eyebrow
===========

The line over a title, which says what kind of thing it opens: ``FEATURE``,
``STEP 02``, ``THE GLYPH SET``. The label register as a block. It sits
flush, with the register's own leading as the air, so a hero composes loose
and the eyebrow still hugs its heading.

.. code-block:: html

   <sds-eyebrow label="Feature"></sds-eyebrow>
   <h1 class="sds-display">Every answer says where it came from</h1>

.. confval:: label
   :name: sds-eyebrow-label
   :type: string
   :required: true

   What kind of thing the title opens. It is the whole of the element. An
   eyebrow says nothing else.

``sds-label`` stays the word in a line: a stat's caption, a row's tag, a
column heading. Its place over a title turns the register into an eyebrow.
That is a thing to say in markup, not a position to infer.

.. _component-sds-surface:

sds-surface
===========

A plane that holds a statement.

.. code-block:: html

   <sds-surface plane="sunken" label="SOURCE 01" icon="actions-database"
     heading="The package index" body="Answered in 240 ms."></sds-surface>

.. confval:: plane
   :name: sds-surface-plane
   :type: "plain" | "raised" | "sunken"
   :default: "raised"

   The filled two take the name of their fill. ``raised`` sits on the canvas
   and has to read as a plane. ``sunken`` is machine output: code, logs,
   structured content. ``plain`` is the hairline with no fill, for a
   statement on the canvas that does not leave it.

   Not the box but the destination tells this element from ``sds-card``. A
   card is a way into something; a surface stays and states.

.. confval:: heading
   :name: sds-surface-heading
   :type: string

   The statement. ``heading`` and not ``title``, which is a global attribute.

.. confval:: body
   :name: sds-surface-body
   :type: string | markup

   It can also stand **between the tags**, which is the form a document
   uses. A plane on a product surface holds one composed sentence, and a
   property carries it. A passage beside an argument is paragraphs, a list
   or a block of its own: markup, or nothing.

.. confval:: label
   :name: sds-surface-label
   :type: string

   The tracked-out line **over** the title, where a set of these has numbers
   or names. A title that carries the number reads as part of the sentence.

.. confval:: icon
   :name: sds-surface-icon
   :type: icon id

   A glyph above the label, where a reader tells a set apart before they
   read it. It never stands alone.

.. confval:: box-style
   :name: sds-surface-box-style
   :type: string

   Layout for the one instance that needs a sized plane: the box that draws
   the frame, not the host around it. It has no default. The element fills
   the cell a wall stretches for it, like every other block.

.. _component-sds-card:

sds-card
========

A way into something: a chapter, a product, a news entry, a page. A picture
at the top, then the row that says what kind of thing it is and when. The
title that goes there, the prose, and a foot with the call to action.

.. code-block:: html

   <sds-card heading="Publishing" href="/guides-theme/publishing"
     label="CHAPTER 03" icon="actions-book" action="Read the chapter">
     <p>The workflow that renders the site and puts it where readers are.</p>
   </sds-card>

**The whole card is the target, and the title is the link.** The class layer
stretches the anchor over the frame, so the name a reader hears is the title
while the hit area is the card. One link, so the call to action is words,
not a second anchor to the same place.

Only a card with that link rises under the pointer or keyboard focus. The
2px lift, the raised fill and the light across the top hairline answer that
the whole plane opens. A card that goes nowhere stays still. In a flush grid
the lift goes, because one moved tile tears the shared rules. Reduced motion
removes the travel and keeps the visual response.

.. confval:: heading
   :name: sds-card-heading
   :type: string

   Empty, there is no heading at all. A card with a byline or a figure names
   itself inside its own body. An empty heading is a level in the outline
   with nothing under it.

.. confval:: body
   :name: sds-card-body
   :type: string | markup

   A sentence as a property lands in a paragraph. Blocks between the tags
   land in a container, because a document's summary is paragraphs and often
   a list.

.. confval:: href
   :name: sds-card-href
   :type: string

   Where the card goes. Without one the title is a title, and the card is no
   target either.

.. confval:: src
   :name: sds-card-src
   :type: string

   The picture. Named ``src`` because everything in this system that takes a
   file names it ``src``.

.. confval:: alt
   :name: sds-card-alt
   :type: string

.. confval:: label
   :name: sds-card-label
   :type: string

   The tracked-out line over the title: the name or number of a set of
   cards, or the date of the entry. The same register and the same line.

.. confval:: tag
   :name: sds-card-tag
   :type: string

   What kind of thing it is. Drawn as a badge beside the label, with no tone,
   because it is a fact about the card, not a result.

.. confval:: icon
   :name: sds-card-icon
   :type: icon id

.. confval:: footer
   :name: sds-card-footer
   :type: string

   One line under a hairline: what the reader gets there, who it is for,
   what state it is in.

.. confval:: action
   :name: sds-card-action
   :type: string

   The call to action, in words. Drawn only with an ``href``, since it says
   the card goes there.

.. note::

   ``sds-card`` invites and ``sds-search-result`` answers. A way into
   something and a hit in a search have different shapes; see
   :doc:`navigation`. One entry in a list of them is this element too, turned
   down to the badge, the date and the two lines that decide the open.

.. _component-sds-grid:

sds-grid
========

The wall a reader reads a set in. Between the tags goes whatever they read
side by side: cards, planes, a column of links. A grid of two is not a grid
of six.

.. code-block:: html

   <sds-grid variant="flush">
     <sds-card heading="…" href="…"></sds-card>
     <sds-card heading="…" href="…"></sds-card>
   </sds-grid>

.. confval:: variant
   :name: sds-grid-variant
   :type: "default" | "wide" | "dense" | "flush"
   :default: "default"

   How wide the set runs, or if it runs as a wall at all. ``flush`` takes the
   gutter out: the cards share a hairline, and the set reads as one block.

.. note::

   **No column count.** The grid reflows by a minimum width, so a page says
   what its items hold and names no breakpoint. The element adds evenness on
   top. Four items in a three-wide row wrap as three and one, so it lays
   them out two and two.

.. _component-sds-slide:

sds-slide
=========

One 16:9 frame of a deck. The frame is 960 × 540 and the stylesheet doubles
it, so a slide renders at 1920 × 1080. Every element between the tags keeps
the set it has on a page. The element owns the frame, the ground, the head,
the foot and the deck's outline. The body is the system's elements.
:doc:`/design-system/slides` has the reason and the layouts.

.. code-block:: html

   <sds-slide kind="content" heading="Three places for every component"
     number="03" signet="signet-m.svg" brand="TYPO3" product="Dev Companion">
     <sds-grid>
       <sds-surface label="Story" heading="Every element has one" body="…"></sds-surface>
     </sds-grid>
   </sds-slide>

.. confval:: kind
   :name: sds-slide-kind
   :type: "cover" | "speaker" | "section" | "statement" | "content" | "closing" | "figure"
   :default: "content"

   What the slide is in the run of a deck. ``cover`` and ``closing`` hold the
   title up and the lockup down. ``section`` holds the outline down.
   ``statement`` centres one sentence. ``content`` keeps its title at the
   top margin, so it never hops between slides. ``speaker`` gives the name
   the left column and the portrait the right, edge to edge.

   ``figure`` shows material from a page: a table, a drawing, a screenshot.
   Its title and its margin are a step smaller, so the material has the
   frame.

.. confval:: ground
   :name: sds-slide-ground
   :type: "paper" | "terminal"
   :default: "paper"

   The ground, whatever mode the page is in. A deck stands on paper and its
   cover on the terminal: the flip is the emphasis, and the one accent stays
   where it is.

.. confval:: eyebrow
   :name: sds-slide-eyebrow
   :type: string

   The line over the title, in the label register: the occasion, the
   section's number, the date.

.. confval:: heading
   :name: sds-slide-heading
   :type: string

   The title. A cover, a divider and a statement set it at the display
   step. A content slide sets it at the h2 step, so the body has room.

.. confval:: lead
   :name: sds-slide-lead
   :type: string

   The sentence under a cover's or a closing's title.

.. confval:: note
   :name: sds-slide-note
   :type: string

   The line under a statement, in the small register: where the sentence
   is from.

.. confval:: number
   :name: sds-slide-number
   :type: string

   The count in the foot. A string, because a deck numbers its slides the
   way it likes: ``03``, ``3 / 12``.

.. confval:: signet, brand, product
   :name: sds-slide-lockup
   :type: string

   The lockup, as ``sds-nav-main`` and ``sds-footer`` take it. On a cover
   and a closing it stands at the foot, at the h3 step with the mark at 32.
   On every other kind it stands in the foot at the page's size. Without a
   product there is no lockup.

.. confval:: sections
   :name: sds-slide-sections
   :type: string[]

   The deck's outline, on a divider: one entry per section, as a JSON
   attribute or the ``.sections`` property.

.. confval:: current
   :name: sds-slide-current
   :type: number
   :default: 0

   Which entry of the outline this section is. It takes the page's ink and
   the accent rule under it, the way a bar marks its active item.

.. confval:: portrait, alt
   :name: sds-slide-portrait
   :type: string

   On a speaker slide: the portrait, and what it shows. A speaker has one.
   It is the deck's own picture, as a product brings its own mark. The one
   the layout shows is a story's fixture under ``assets/portraits/``, drawn
   to the illustration prompt. Without it the column stands empty.

.. confval:: fit
   :name: sds-slide-fit
   :type: boolean

   If the frame scales to the room it has: a stage. The room is the width
   and the height its parent gives it, and no more of the window than stands
   below the parent's top. The element measures and writes the zoom as a
   style, the way ``sds-grid`` writes its columns. Unset, and with no
   ``shrink``, the frame draws at the size the stylesheet states.

.. confval:: shrink
   :name: sds-slide-shrink
   :type: boolean

   If the frame is a picture in a column. It shrinks to a column narrower
   than it, and never grows past the size the stylesheet states. A
   measurement, so a page with no script draws the stated size. A deck sets
   it on every slide it runs through.

   What the body holds fits the body, always. Content taller or wider than
   the room shrinks until it fits, at the width it had, so nothing wraps
   anew. Nothing grows. A slide never cuts off what it holds.

.. confval:: zoomable
   :name: sds-slide-zoomable
   :type: boolean

   If the slide carries a press that opens it at the window's size. A press
   anywhere on the frame does the same, as a press on a picture opens the
   picture. The slide sends ``sds-slide-open``, and the deck that runs
   through it answers. ``sds-deck`` sets it on every slide of the page it
   runs through.

.. confval:: body
   :name: sds-slide-body
   :type: markup

   What the slide shows between its title and its foot. Between the tags, or
   as ``.body`` where a renderer cannot write between them.

   Nothing in it takes a press or a stop of the keyboard. A slide is a
   picture of a part, and the part on the page is where its links and its
   controls work. A reader who hears the page still hears the text.

.. _component-sds-deck:

sds-deck
========

Slides one after the other, at the window's size. It is the platform's
``<dialog>`` with one frame on a stage and the keys to go on. It has a list
of every slide as a picture, and the full screen. The deck holds no copy. It
lends a slide the stage and puts it back where it stood.
:doc:`/design-system/slides` has the reason.

Two ways in. Slides between the tags are a deck of its own. The page shows
the cover, and under it the press that plays the deck and the one that
saves it as a PDF:

.. code-block:: html

   <sds-deck label="The system in front of a room" brand="TYPO3"
     product="Dev Companion" signet="signet-m.svg" signet-large="signet-l.svg" numbered>
     <sds-slide kind="cover" ground="terminal" heading="One system, every surface"></sds-slide>
     <sds-slide heading="Three places for every component">…</sds-slide>
   </sds-deck>

With none between the tags, the deck runs through the slides of the page,
each where its section put it. Every one of them gets a press that opens
the deck there. A button names the deck by id to open it from the start:

.. code-block:: html

   <sds-button for="the-deck">Click through the slides</sds-button>
   <sds-deck id="the-deck" from="main-content" label="A record of reads"></sds-deck>

.. confval:: label
   :name: sds-deck-label
   :type: string
   :default: "Slides"

   The name of the deck, in its head: what the reader has open.

.. confval:: from
   :name: sds-deck-from
   :type: string

   The id of the part of the page whose slides the deck runs through. Empty
   is the whole document. A slide inside another deck belongs to that one,
   and a deck with slides of its own ignores this.

.. confval:: brand, product, signet, signet-large
   :name: sds-deck-lockup
   :type: string

   The lockup, said once for every slide. The deck gives it to each slide
   that says none of its own. A cover and a closing take ``signet-large``,
   the larger mark, and every other kind ``signet``.

.. confval:: numbered
   :name: sds-deck-numbered
   :type: boolean

   If the deck counts its slides in their feet: ``02``, ``03``, by where each
   stands. A cover and a closing carry no count. A slide with a ``number``
   of its own keeps it.

   The deck also gives the dividers their outline. Each ``section`` slide
   with no ``sections`` of its own gets the headings of every divider in the
   deck, and its own place among them.

.. confval:: open
   :name: sds-deck-open
   :type: boolean

   If it stands over the page. ``show(at)``, ``close()``, ``go(index)``,
   ``fullscreen()`` and ``print()`` are the calls behind the presses.

The keys are the arrows, Page Up and Page Down, Home and End, and ``F`` for
the full screen. Escape leaves the full screen first, then the deck. A
finger or a pointer drags the slide: past a part of the stage it turns, and
short of that it goes back. On the full screen the head steps aside, and a
press on the slide turns it. A turn pushes the old slide out, and the next
one comes in from the side the deck moves to. A reader who asks for reduced
motion gets the next slide at once.

The PDF is the browser's print. Every slide stands on a page of its own at
1920 × 1080, with no margin, and the dialog saves it. Text stays text and a
link stays a link. The slides go back when the print is over.

.. _component-sds-stat:

sds-stat
========

A number as a fact: the value first and largest, the label under it, and the
line that says what bounds the number.

.. code-block:: html

   <sds-stat value="240" unit="ms" label="median answer" icon="actions-clock"
     note="Measured over the last release, on a warm index."></sds-stat>

A reader rarely reads a figure alone. A set of them goes into ``sds-grid``
above, like any other set read side by side. The stat carries the number,
and the grid decides how many stand in a row, so four never wrap as three
and one.

.. code-block:: html

   <sds-grid variant="dense">
     <sds-stat value="5" label="sources" note="…"></sds-stat>
     <sds-stat value="0" label="writes" note="…"></sds-stat>
   </sds-grid>

``dense`` is the width a figure holds. A number and the line under it stand
four or five across, where a card with a paragraph takes the room of two.
Every other width works, and so does ``flush``: there the figures share a
hairline, and the wall gives each one its ground. **The frame is the wall's,
not the stat's.** A figure anywhere else stays bare, so a set of numbers on
a page is not a row of boxes.

.. specimen:: components/data/stat.card.html
   :viewport: 700x670
   :title: Figures read as a set

.. confval:: value
   :name: sds-stat-value
   :type: string
   :required: true

   Concrete, ``5``, ``240``, ``12.4+``, never "many". Set in sans. Mono
   means the machine named the thing, and a count is a fact about the
   software, not a string it returns.

.. confval:: unit
   :name: sds-stat-unit
   :type: string

   What the figure is in: ``ms``, ``%``, ``kB``. Its own property, not part
   of the value. The element sets it a step down and joins it with the narrow
   no-break space a number must not split from. A page that has to know that
   codepoint is a page that forgets it.

.. confval:: label
   :name: sds-stat-label
   :type: string
   :required: true

   What the count is of, in the label register.

.. confval:: of
   :name: sds-stat-of
   :type: string

   The whole the figure is a part of, after it, ``2 of 3``, a step down and
   a shade back, the way a unit is. **Only where the figure is a part.** A
   measurement is out of nothing. It is words and not a bar. A reader reads
   a set of figures across its notes, and a drawing under one of them pushes
   that line out of step.

.. confval:: icon
   :name: sds-stat-icon
   :type: IconId

   A glyph on the figure's own line, before the number. Beside it, not over
   it: a glyph on a line of its own floats above the one thing the tile is
   for. Muted and never in a status colour, for the reason a card's is. A
   figure is a subject, not a result.

.. confval:: note
   :name: sds-stat-note
   :type: string | markup

   What bounds the figure. **Without one the number is a boast**, and that
   is the whole reason the component exists.

.. _component-sds-swatch:

sds-swatch
==========

One colour as a fact: the chip, the name of the colour, and the value that
name resolves to.

.. code-block:: html

   <sds-swatch value="var(--accent)" name="--accent" resolved="#FF8700"></sds-swatch>

All three, because none of them is enough alone. A chip says nothing a
reader can type. A token name says nothing about what the mode did with it.
A hex out of context says nothing about where the colour can appear. **A
swatch without one of them documents part of a colour.**

A palette is a set, so it goes into ``sds-grid`` like any other, at the
grid's ordinary minimum. One swatch needs its longest value with the chip
beside it, and a ``light-dark()`` pair is the long one. ``wide`` reserves
more than that and costs a track wherever the column is narrow.

.. code-block:: html

   <sds-grid>
     <sds-swatch value="var(--accent)" name="--accent" resolved="#FF8700"></sds-swatch>
     <sds-swatch value="var(--border-subtle)" name="--border-subtle"
       resolved="light-dark(#E3DFD6, #2B2823)" kind="line"></sds-swatch>
   </sds-grid>

.. confval:: value
   :name: sds-swatch-value
   :type: string
   :required: true

   What paints the chip: a token as written, or a literal where the value
   belongs to a mode the page is not in. **Anything that is not a colour
   drops out, and nothing paints it.** The value arrives from a document somebody else
   wrote, and a style attribute is not where an element finds out what it
   is. The name and the value stay readable either way.

.. confval:: name
   :name: sds-swatch-name
   :type: string

   The name of the colour. The token where there is one, because that is
   the name a design writes. The human name where the palette has no tokens.

.. confval:: resolved
   :name: sds-swatch-resolved
   :type: string

   What that name resolves to, in full. A pair stands as the pair,
   ``light-dark(#FFFFFF, #171614)``. One half of a token documents one mode
   and claims the system.

.. confval:: kind
   :name: sds-swatch-kind
   :type: string

   ``fill`` or ``line``. A hairline is a colour too and cannot show as a
   fill. At one pixel a value is invisible, and as a fill it is a different
   job by the same number. ``line`` makes the chip its own edge, at the
   emphasis width, with the page's own ground inside it.

The chip keeps the system's hairline round it, whatever paints it. Without
that, a swatch in the colour of its page is a missing square, not a white
one. That is the one case a palette has to draw.

.. _component-sds-icon-tile:

sds-icon-tile
=============

One glyph in a wall of them, with the identifier under it. A reader scans a
set like this and does not read it.

.. code-block:: html

   <sds-grid variant="dense">
     <sds-icon-tile name="actions-check-circle"></sds-icon-tile>
     <sds-icon-tile name="actions-arrow-right" tag="mirrors"></sds-icon-tile>
   </sds-grid>

**Not a card.** A reader reads a card: a title, a paragraph, a way on. A
wall of four hundred of them is four hundred titles between a reader and
the one drawing they came for. Here the glyph fills the box and the name
holds back. A reader finds a set like this by shape, and the name matters
only after the shape.

The glyph has one size, and the tile does not decide it. A reader scans a
wall at one distance. Two sizes in it are two walls, and a tile larger than
its neighbours claims to matter more.

.. confval:: name
   :name: sds-icon-tile-name
   :type: string
   :required: true

   Which glyph, as ``sds-icon`` spells it. One identifier has one spelling
   across two elements. An identifier the set does not hold leaves the box
   empty and throws nothing. A wall arrives from a catalogue, and one bad
   row must not take the other rows with it.

.. confval:: caption
   :name: sds-icon-tile-caption
   :type: string

   The text under the glyph, where the set shows something other than the
   identifier. Otherwise the identifier, which is what a reader retypes.

.. confval:: href
   :name: sds-icon-tile-href
   :type: string

   Where the tile goes, and the whole tile is the target. Without one it is
   still a tile. A wall that documents a set presses nowhere, and an anchor
   with no target is a stop the keyboard makes for nothing.

.. confval:: tag
   :name: sds-icon-tile-tag
   :type: string

   The one fact the drawing cannot show: that it mirrors, that it is new,
   that it goes. One word, in the corner the glyph does not use.

.. _component-sds-quote:

sds-quote
=========

A sentence from somewhere else, with its source. The attribution is
mandatory, and that is the whole reason for the component. A quotation with
no source in a product's own writing reads as the product quoting itself.

The attribution is a ``sds-byline``, not a caption. Authorship looks the
same wherever it stands, and the source of a borrowed sentence is not a
smaller thing than the author of the page.

.. code-block:: html

   <sds-quote by="The 12.4 release notes" as="changelog"
     href="https://example.org/notes"
     body="Every route resolves to the same tokens."></sds-quote>

.. confval:: body
   :name: sds-quote-body
   :type: string | markup
   :required: true

   Long enough to be worth the borrow, short enough to stand at heading
   size. A borrowed sentence is a statement and reads like one. No
   quotation marks. Its measure, its size and a rule at its start set the
   block apart, which is position, not ornament.

.. confval:: by
   :name: sds-quote-by
   :type: string
   :required: true

   Who said it: a person, a document, a release note.

.. confval:: as
   :name: sds-quote-as
   :type: string

   What they are to the subject, where the name alone does not say.

.. confval:: href
   :name: sds-quote-href
   :type: string

   Where to read it in full. The attribution carries the link.

.. confval:: meta
   :name: sds-quote-meta
   :type: string

   When, and anything else in the label register: a release, a revision.

.. confval:: initials
   :name: sds-quote-initials
   :type: string

   The mark, drawn only with these given. A byline derives initials from
   the name, because a byline is a person. A quote does not. Half of what is
   worth a quote is a document, and a monogram of a filename is a person
   invented for a source with none.

.. _component-sds-byline:

sds-byline
==========

Who wrote it, and when. A component, not a row a page assembles, because the
order is the point: who, then what they are to the subject, then when. A
page that puts the date first has published a date.

.. code-block:: html

   <sds-byline name="Ada Lovelace" as="maintainer" meta="12 May 2026"></sds-byline>

.. confval:: name
   :name: sds-byline-name
   :type: string
   :required: true

.. confval:: as
   :name: sds-byline-as
   :type: string

.. confval:: meta
   :name: sds-byline-meta
   :type: string

   When, and anything else in the label register: a release, a reading time,
   a revision.

.. confval:: initials
   :name: sds-byline-initials
   :type: string

   The mark. Derived from the name if not given, and two letters at most.
   Never a photograph. A face is a file to fetch, keep in step and licence,
   and none of that says who answers for the page.

.. confval:: href
   :name: sds-byline-href
   :type: string

   Where the name leads: a profile, or the source of the attribution.

.. confval:: unmarked
   :name: sds-byline-unmarked
   :type: boolean

   No monogram, for an attribution that is not a person: a document, a
   release note, a file. Initials from a filename are a person invented for
   a source with none.

.. _component-sds-steps:
.. _component-sds-step:

sds-steps, sds-step
===================

An instruction read from the top, numbered down one rail. Work *to do*: it
renders before the page ships, and nothing about it changes afterwards. Work
**in progress**, stops that arrive one at a time and end on a verdict, is
:ref:`sds-run <component-sds-run>`, an application's component, not a
document's.

.. code-block:: html

   <sds-steps>
     <sds-step heading="Require the package">
       <p>It brings the renderer and the highlighter with it.</p>
       <sds-code code-lang="bash">
         <code>composer require typo3/soul-guides-theme</code>
       </sds-code>
     </sds-step>
     <sds-step heading="Draw the signet" optional anchor="the-signet">
       <p>A project with no mark takes its title in the bar.</p>
     </sds-step>
   </sds-steps>

For work with an order. The numbers claim that step two follows step one,
so a set of things to do in any order is a list and not this. They are the
set's own count as well. A stop in the middle renumbers everything under
it, and nothing writes a figure.

**It is a list in ARIA, not in** ``<ol>``. Every element in this system
draws its class box inside itself. That leaves one generic between a list
and its items, and a browser stops the count at that. So the set carries
``role="list"``, every stop carries ``role="listitem"``, and a reader hears
how many steps there are and which one this is.

**A stop belongs to a set, and everything a stop draws has a set's scope.**
The disc, the rail and the title register stand under ``.sds-steps``. So an
``sds-step`` on its own is the blocks it holds and nothing else. No disc and
no number, because a number is a place in a set.

.. confval:: steps
   :name: sds-steps-steps
   :type: "{ heading, body, optional?, anchor? }[]"

   Where a page holds the instruction as data. A stop with blocks for
   content, what a documentation renderer hands over, goes between the tags
   as ``sds-step`` instead, and then this stays empty.

.. confval:: heading
   :name: sds-steps-heading
   :type: string

   On ``sds-step``. What happens at this stop, in one line. Spelt
   ``heading`` like every other title here, not ``title``, the global
   attribute a browser draws as a tooltip. It is not a heading in the
   outline. The number says where a reader is in an instruction, and a page
   whose outline is its steps has buried its own sections.

.. confval:: optional
   :name: sds-steps-optional
   :type: boolean
   :default: false

   A stop a reader can skip. The disc stays unfilled and the word stands
   beside the title. An unfilled ring says nothing to a reader who cannot
   see it, which is why the drawing is never the whole claim.

.. confval:: anchor
   :name: sds-steps-anchor
   :type: string

   The address of this one stop, for a page that links to it. It lands on
   the stop itself. Unlike an answer in an accordion, a step has no fold,
   so nothing has to open before a read.

.. _component-sds-timeline:

sds-timeline, sds-timeline-stop
===============================

A plan on the calendar: dated stops down one rail, and where the plan
stands among them. For work that has dates. :ref:`sds-steps
<component-sds-steps>` is an instruction, which never changes.
:ref:`sds-run <component-sds-run>` is work in progress, which arrives one
stop at a time. A plan is neither. The author writes it once, with a date
at every stop, and a reader asks one thing of it: how far along is it?

.. code-block:: html

   <sds-timeline>
     <sds-timeline-stop when="2026-09-15" heading="Draft 2 to the maintainers">
       <p>This paper, with the test and the options in it.</p>
     </sds-timeline-stop>
     <sds-timeline-stop when="2026-09-30" heading="Decision" now>
       <p>The maintainers answer the question in part 8.</p>
     </sds-timeline-stop>
     <sds-timeline-stop when="Sprint 1 · 2026-10-05 to 10-16" heading="The record, kept">
       <p>One file per source, thirty reads.</p>
       <sds-timeline-stop when="W1" heading="The server keeps the last thirty reads"></sds-timeline-stop>
     </sds-timeline-stop>
   </sds-timeline>

The pair is the whole component, the way an instruction holds its steps.
A stop's date and title fit in an attribute. What it holds goes between
the tags: a sentence, or the blocks a plan needs. The stops inside it go
there too, as more of these: the packages of a sprint, the steps of a
phase.

One stop says it is ``now``. The plan reads every stop in order, the ones
inside a stop with it, and writes ``state`` onto each. The stops before
that one have ``passed``, and the ones after it lie ``ahead``. A stop
that holds the one marked is at ``now`` too.

Each state has its mark: the glyphs a run gives its stops. The check in
the status colour for a passed stop, because a passed stop is a result. A
filled disc in the primary ink for the one the plan is at, with the word
beside its title. A ring for one ahead, and its title a step quieter.

The rail follows: solid up to now, dashed beyond it. Every mark says its
state out loud, so the colour is never the whole claim. The stops are a
list in ARIA, for the reason ``sds-steps`` gives.

With no stop marked, every stop lies ahead: a plan not yet begun.

.. confval:: entries
   :name: sds-timeline-entries
   :type: "{ when, heading, body?, now?, items? }[]"

   Where a page holds the plan as data. ``items`` are the stops inside
   one. Stops that are blocks go between the tags as ``sds-timeline-stop``
   instead, and then this stays empty.

.. confval:: when
   :name: sds-timeline-when
   :type: string
   :required: true

   On ``sds-timeline-stop``. When, as the plan says it: a day, a week, a
   sprint, a quarter. Nothing parses it.

.. confval:: heading
   :name: sds-timeline-heading
   :type: string
   :required: true

   On ``sds-timeline-stop``. What happens at this stop, in one line.

.. confval:: now
   :name: sds-timeline-now
   :type: boolean
   :default: false

   On ``sds-timeline-stop``. The stop the plan is at. One per plan. On a
   stop inside a stop, the one that holds it is at now too. The stops
   before it in the same one have passed.

.. confval:: state
   :name: sds-timeline-state
   :type: "passed | now | ahead"

   On ``sds-timeline-stop``, and the plan writes it. A stop on its own
   reads as ahead.

.. _component-sds-decision:

sds-decision, sds-answer
========================

The block that puts the question. A concept ends on a decision somebody
else makes, and this is where the paper asks for it. The question in one
line, the answers it can take with the one the paper recommends, who
decides, and by when. On the raised plane, because it is the one block the
reader came for.

.. code-block:: html

   <sds-decision
     question="Does the server keep a record of its own reads, and show it?"
     lead="Until the maintainers answer, this paper is a draft."
     by="the maintainers"
     due="2026-09-30"
   >
     <sds-answer key="A" heading="The record on the page of the source" recommended>
       <p>Thirty reads, on the page of the source. Six days.</p>
     </sds-answer>
     <sds-answer key="B" heading="A page of its own, with a chart">
       <p>A year of reads, drawn. It is a history, and fourteen days.</p>
     </sds-answer>
   </sds-decision>

The pair is the whole component, the way an instruction holds its steps.
An answer's letter and name fit in an attribute; what it means goes between
the tags, a sentence or the blocks a paper needs. The recommended one
carries the word after its name in the quiet accent ink, and nothing else
on its row changes. A recommendation is the paper's claim, and the accent
marks the claim. The answer the decision took
carries ``decided``: its word, its letter on a disc in the ok colour, and
the foot speaks in the past. The answers are a list in ARIA, for the
reason ``sds-steps`` gives.

.. confval:: question
   :name: sds-decision-question
   :type: string
   :required: true

   The question, in one line, and the block's title.

.. confval:: answers
   :name: sds-decision-answers
   :type: "{ key, heading, body?, recommended?, decided? }[]"

   Where a page holds the answers as data. Answers that are blocks go
   between the tags as ``sds-answer`` instead, and then this stays empty.

.. confval:: lead
   :name: sds-decision-lead
   :type: string

   What the paper says about the question, in a sentence before the
   answers.

.. confval:: by
   :name: sds-decision-by
   :type: string

   Who decides. With ``due``, the line at the foot: whose call it is, and
   when it falls due. Once an answer is ``decided``, who decided and on
   which day.

.. confval:: due
   :name: sds-decision-due
   :type: string

   By when, as written: ``2026-09-30``. Once an answer is ``decided``,
   the day the decision fell.

.. confval:: label
   :name: sds-decision-label
   :type: string
   :default: "Decision"

   The word over the block.

.. confval:: key
   :name: sds-decision-key
   :type: string

   On ``sds-answer``. Its letter or number, as the paper cites it.

.. confval:: heading
   :name: sds-decision-heading
   :type: string

   On ``sds-answer``. What the answer is, in one line.

.. confval:: recommended
   :name: sds-decision-recommended
   :type: boolean
   :default: false

   On ``sds-answer``. The one the paper recommends. One per decision, and
   none where the paper lays the answers out and stops.

.. confval:: decided
   :name: sds-decision-decided
   :type: boolean
   :default: false

   On ``sds-answer``. The one the decision took. One per decision, and none
   while the question is open. The block reads it: with one, the foot says
   who decided and on which day.

.. _component-sds-note:

sds-note
========

What an answer carries besides the answer. A glyph in the status colour, a
title that states the fact, and a bounded line that says what the fact
costs the reader.

.. code-block:: html

   <sds-note tone="warn" heading="The index is a day old">
     <p>Pages published since yesterday are not in it yet.</p>
   </sds-note>

   <sds-note body="Two worktrees look finished." action="Clean up"></sds-note>

A press on the action dispatches ``sds-note-action`` with the label, on the
note itself. With ``href`` set there is nothing to announce: the link is the
answer.

.. confval:: tone
   :name: sds-note-tone
   :type: "info" | "ok" | "warn" | "error"
   :default: "info"

   Not decoration. ``ok`` names where an answer came from, ``warn`` a
   degraded one, ``error`` none, ``info`` a fact about the surface. ``warn``
   and ``error`` tint the block; ``ok`` and ``info`` colour the glyph alone.

.. confval:: heading
   :name: sds-note-heading
   :type: string

   The fact, in a line. Sentence case, and never a category name. Optional,
   because a note whose body is a document's own prose has no head for it.

.. confval:: body
   :name: sds-note-body
   :type: string | markup

   Or nothing, when the body stands between the tags instead.

.. confval:: icon
   :name: sds-note-icon
   :type: icon id

   An explicit glyph, where the tone's own says less than the note does. The
   glyph never drops. A colour alone leaves the meaning to whoever can tell
   the tones apart.

.. confval:: action
   :name: sds-note-action
   :type: string

   The one thing to do about what the note says, as the label on a button
   after the sentence. One and no more: a message with two answers is a
   dialog. The button is the note's own, a secondary at ``sm``. So every
   message a surface shows offers its answer as the same control in the same
   place. On a narrow box it goes under the sentence.

.. confval:: href
   :name: sds-note-href
   :type: string

   Where that action goes, where it is a place and not a decision. The
   button renders as a link, with the browser's own middle-click, hover
   target and status line, and a press dispatches nothing.

.. confval:: label
   :name: sds-note-label
   :type: string

   What the glyph says out loud. Each tone names its own word, and a caller
   can say a truer one. A renderer that collapses many admonition types onto
   these tones knows which this was, so ``caution`` and ``danger`` stay
   apart after both became ``warn``.

.. _component-sds-entry:

sds-entry
=========

One numbered, addressed entry of a register. The number in a rail on the
left. Beside it, indented as one block: the title, the kind with the
origin, and what the entry holds as paragraphs, evidence, a table. The
indent is the scope: a reader sees where an entry begins and ends.

.. specimen:: components/content/register.card.html
   :viewport: 700x1673
   :title: Register

.. code-block:: html

   <sds-entry number="1.2" prefix="F" heading="A lookup after a language switch answers in the language before it"
              label="blocks" tone="error" origin="introduced by this change" anchor="findings-1-2"
              todo="Key the cache on the language too." todo-prefix="T">
     <p>The cache keys on the key alone. Probe P2 shows it.</p>
   </sds-entry>

No box around an entry, and alone no rule either. Twenty entries in a row
are a list, and a box round each turns that list into twenty cards. In a
register, a hairline stands between two entries and none above the first
or under the last. Nothing carries a tone. The kind stands in the head as a
word, and a coloured edge is the meaning left to colour. The title is an
entry's, at ``--entry-title-size``, because an entry is where an overview
sends a reader.

A page writes an entry inside a register, which numbers it, addresses it
and hands it the kind. Alone, the entry takes all of that as attributes.

.. confval:: heading
   :name: sds-entry-heading
   :type: string
   :required: true

   The entry, in a line. Sentence case, and never a category name.

.. confval:: number
   :name: sds-entry-number
   :type: string

   Its place, as the register numbers it: ``1.1``. In mono, because a
   reader cites it.

.. confval:: prefix
   :name: sds-entry-prefix
   :type: string

   What stands before the number, ``F`` for a finding, where a register says
   so. Nothing unless it does: an entry is ``1.2`` by itself.

.. confval:: label
   :name: sds-entry-label
   :type: string

   The kind of entry it is, as the word on its badge: ``blocks``, ``sent
   back``. A register hands it down from its groups.

.. confval:: tone
   :name: sds-entry-tone
   :type: "default" | "accent" | "ok" | "warn" | "error"
   :default: "default"

   The tone under that word.

.. confval:: group
   :name: sds-entry-group
   :type: string

   The key of the group it belongs to, for the register that groups.

.. confval:: origin
   :name: sds-entry-origin
   :type: string

   Where it came from, in a few words: ``introduced by this change``,
   ``older than the change``. A fault the change did not make weighs on the
   change differently, and a review says which is which.

.. confval:: anchor
   :name: sds-entry-anchor
   :type: string

   The address of this one entry, so a remark at the code can point at it.
   A register gives one from the number where the entry has none.

.. confval:: todo
   :name: sds-entry-todo
   :type: string

   What is to do about it, in one sentence, for whoever acts on it. It
   stands as the entry's last line with its own number, and a register
   collects these into the list of what is to do. An entry with none is a
   fact, and one with one is work.

.. confval:: todo-prefix
   :name: sds-entry-todo-prefix
   :type: string

   What stands before the number of that work, ``T`` where a register says
   so. So ``F1.2`` is the finding and ``T1.2`` the thing to do.

.. confval:: body
   :name: sds-entry-body
   :type: string | markup

   What the entry holds, as prose. Or nothing, when the blocks stand between
   the tags instead.

.. _component-sds-register:

sds-register
============

A list a reader cites: numbered, addressed, and scanned at a glance before
the entries. The entries stand between its tags, in any order. The register
numbers them by group and place where it has groups, and counts them up
where it has none. It writes every one into one table first, each row a
jump to its entry, and the work the entries ask for into a second. So no
page counts entries or lists work by hand, and no overview can say what an
entry does not.

.. code-block:: html

   <sds-register name="findings" prefix="F" todo-prefix="T"
                 groups='[{ "key": "blocks", "heading": "Blocks submission", "label": "blocks", "tone": "error" }]'>
     <sds-entry heading="The unit suite fails" group="blocks" origin="introduced by this change"
                todo="Adapt the four tests that expect the second read.">
       <p>…</p>
     </sds-entry>
   </sds-register>

The entry becomes ``F1.1``, its work ``T1.1``, and both answer to
``findings-1-1``. Each group is an ``sds-section``, and its address is the
register's ``name`` and the group's key: ``findings-blocks``, so a contents
list can point at it. The list of work is ``findings-todo``.
``FINDING_GROUPS`` exports the four groups of a review's findings: *Blocks
submission*, *Sent back*, *Worth a change*, *Checked and correct*.

Without groups and without a prefix, the entries are ``1``, ``2``, ``3``:
the plain list, with the same overview over it.

Under a prerender the register reads the entries as the author wrote them
and renders each one itself. So a page with no script carries the same
numbers.

.. confval:: groups
   :name: sds-register-groups
   :type: "{ key, heading, label?, tone? }[]"

   The groups, in order. ``key`` is what an entry names in ``group``,
   ``heading`` stands over the group, and ``label`` with ``tone`` is the
   word every entry in it draws. An entry whose group the register does not
   name stands last, in the order written.

.. confval:: prefix
   :name: sds-register-prefix
   :type: string

   What stands before every entry's number. Nothing unless the register
   says so.

.. confval:: todo-prefix
   :name: sds-register-todo-prefix
   :type: string

   What stands before the number of what is to do.

.. confval:: name
   :name: sds-register-name
   :type: string
   :default: "register"

   What the group sections and the entries' addresses start with, so two
   registers on one page keep apart.

.. confval:: entries
   :name: sds-register-entries
   :type: "EntryProps[]"

   The entries as a property, where a static render has no children to take:
   a story, a card. Between the tags otherwise.

.. seealso::

   :doc:`/design-system/screens` for the review these stand in.

.. seealso::

   :doc:`/design-system/states` for what an empty, a failed and a loading
   surface each owe the reader, and :doc:`overlays` for the planes these
   blocks float over.
