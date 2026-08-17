:navigation-title: Content

=======
Content
=======

The blocks a page is built out of: a plane, a way into something, an entry in a
list, a figure, a borrowed sentence, and the two that state what an answer
carries besides the answer.

None of them draws a shadow. The system has none: a plane is told apart by its
fill and a hairline, and a container never shares its corner with its contents
— which is why the card radius is one step larger than the control radius, and
why nothing here sets either by hand.

.. _component-sds-eyebrow:

sds-eyebrow
===========

The line over a title, saying what kind of thing it opens — ``FEATURE``,
``STEP 02``, ``THE GLYPH SET``. The label register standing as a block: it
sits flush, the register's own leading being the air, so a hero composes
loose and the eyebrow still hugs its heading.

.. code-block:: html

   <sds-eyebrow label="Feature"></sds-eyebrow>
   <h1 class="sds-display">Every answer says where it came from</h1>

.. confval:: label
   :name: sds-eyebrow-label
   :type: string
   :required: true

   What kind of thing the title opens. It is the whole of the element — there
   is nothing else an eyebrow says.

``sds-label`` stays the word in a line — a stat's caption, a row's tag, a
column heading. What turns the register into an eyebrow is standing over a
title, and that is a thing to say in markup rather than a position to infer.

.. _component-sds-surface:

sds-surface
===========

A plane holding a statement.

.. code-block:: html

   <sds-surface plane="sunken" label="SOURCE 01" icon="actions-database"
     heading="The package index" body="Answered in 240 ms."></sds-surface>

.. confval:: plane
   :name: sds-surface-plane
   :type: "plain" | "raised" | "sunken"
   :default: "raised"

   The filled two are named for their fill: ``raised`` sits on the canvas and
   has to read as a plane; ``sunken`` is machine output — code, logs,
   structured content. ``plain`` is the hairline with no fill, for a statement
   that stands on the canvas without leaving it.

   What tells this element from ``sds-card`` is not the box but where it
   goes: a card is a way into something, a surface stays and states.

.. confval:: heading
   :name: sds-surface-heading
   :type: string

   The statement. ``heading`` and not ``title``, which is a global attribute.

.. confval:: body
   :name: sds-surface-body
   :type: string | markup

   It may also be written **between the tags**, which is the form a document
   uses: a plane on a product surface holds a sentence somebody composed and a
   property carries it, while a passage set beside an argument is paragraphs, a
   list or a block of its own — markup, or nothing.

.. confval:: label
   :name: sds-surface-label
   :type: string

   The tracked-out line **over** the title, where a set of these is numbered or
   named as a set. A title carrying the number reads as part of the sentence.

.. confval:: icon
   :name: sds-surface-icon
   :type: icon id

   A glyph above the label, where a set is told apart before it is read. It
   never stands alone.

.. confval:: box-style
   :name: sds-surface-box-style
   :type: string

   Layout for the one instance that needs its plane sized — the box that
   draws the frame, not the host around it. Nothing is set by default: the
   element fills the cell a wall stretches for it, like every other block.

.. _component-sds-card:

sds-card
========

A way into something: a chapter, a product, a news entry, a page. A picture at
the top, the row saying what kind of thing it is and when, the title that goes
there, the prose, and a foot carrying the call to action.

.. code-block:: html

   <sds-card heading="Publishing" href="/guides-theme/publishing"
     label="CHAPTER 03" icon="actions-book" action="Read the chapter">
     <p>The workflow that renders the site and puts it where readers are.</p>
   </sds-card>

**The whole card is the target and the title is the link.** The anchor is
stretched over the frame by the class layer, so the name a reader hears is the
title while the hit area is the card. One link, therefore: the call to action
is words rather than a second anchor to the same place.

Only a card with that link rises under the pointer or keyboard focus. The 2px
lift, raised fill and light across the top hairline answer that the whole plane
can be opened; a card that goes nowhere stays still. In a flush grid the lift
is removed because moving one tile would tear the shared rules, and reduced
motion removes the travel while preserving the visual response.

.. confval:: heading
   :name: sds-card-heading
   :type: string

   Left empty there is no heading at all — a card holding a byline or a figure
   names itself inside its own body, and an empty heading is a level in the
   document outline with nothing under it.

.. confval:: body
   :name: sds-card-body
   :type: string | markup

   A sentence as a property lands in a paragraph; blocks written between the
   tags land in a container, because a document's summary is paragraphs and
   often a list.

.. confval:: href
   :name: sds-card-href
   :type: string

   Where the card goes. Without one the title is a title and the card is not a
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

   The tracked-out line over the title: what a set of cards is named or
   numbered as, or when the entry is from — the same register and the same
   line.

.. confval:: tag
   :name: sds-card-tag
   :type: string

   What kind of thing it is. Drawn as a badge beside the label, with no tone,
   because it is a fact about the card rather than a result.

.. confval:: icon
   :name: sds-card-icon
   :type: icon id

.. confval:: footer
   :name: sds-card-footer
   :type: string

   One line under a hairline: what the reader gets there, who it is for, what
   state it is in.

.. confval:: action
   :name: sds-card-action
   :type: string

   The call to action, in words. Drawn only where there is an ``href``, since
   it says the card goes there.

.. note::

   ``sds-card`` invites and ``sds-search-result`` answers — a way into something and a
   hit in a search are not the same shape; see :doc:`navigation`. One entry in
   a list of them is this element too, turned down to the badge, the date and
   the two lines that decide whether it is opened.

.. _component-sds-grid:

sds-grid
========

The wall a set is read in. What goes between the tags is whatever is read side
by side — cards, planes, a column of links — because a grid of two is not a
grid of six.

.. code-block:: html

   <sds-grid variant="flush">
     <sds-card heading="…" href="…"></sds-card>
     <sds-card heading="…" href="…"></sds-card>
   </sds-grid>

.. confval:: variant
   :name: sds-grid-variant
   :type: "default" | "wide" | "dense" | "flush"
   :default: "default"

   How wide the set runs, or whether it runs as a wall at all. ``flush`` is the
   gutter taken out — the cards share a hairline and the set reads as one block.

.. note::

   **No column count.** The grid reflows by a minimum width, so a page says
   what its items hold and no page names a breakpoint. What the element adds on
   top is evenness: four items in a three-wide row would wrap as three and one,
   so it lays them out two and two.

.. _component-sds-stat:

sds-stat
========

A number stated as a fact: the value first and largest, the label under it, and
the line saying what the number is bounded by.

.. code-block:: html

   <sds-stat value="240" unit="ms" label="median answer" icon="actions-clock"
     note="Measured over the last release, on a warm index."></sds-stat>

A figure is rarely read alone. A set of them goes into ``sds-grid`` above, like
any other set read side by side — the stat carries the number and the grid
decides how many stand in a row, so four never wrap as three and one.

.. code-block:: html

   <sds-grid variant="dense">
     <sds-stat value="5" label="sources" note="…"></sds-stat>
     <sds-stat value="0" label="writes" note="…"></sds-stat>
   </sds-grid>

``dense`` is the width a figure holds: a number and the line under it stands
four or five across, where a card carrying a paragraph takes the room of two.
Every other width works, and so does ``flush`` — there the figures share a
hairline and the wall gives each one its ground. **The frame is the wall's, not
the stat's**: a figure anywhere else stays bare, so a set of numbers on a page
is not a row of boxes.

.. confval:: value
   :name: sds-stat-value
   :type: string
   :required: true

   Concrete — ``5``, ``240``, ``12.4+`` — never "many". Set in sans: mono
   means the machine named the thing, and a count is a fact about the software
   rather than a string it returns.

.. confval:: unit
   :name: sds-stat-unit
   :type: string

   What the figure is in — ``ms``, ``%``, ``kB``. Its own property rather than
   part of the value: the element sets it a step down and joins it with the
   narrow no-break space a number may not be split from, and a page that has
   to know that codepoint is a page that will forget it.

.. confval:: label
   :name: sds-stat-label
   :type: string
   :required: true

   What was counted, in the label register.

.. confval:: of
   :name: sds-stat-of
   :type: string

   The whole the figure is a part of, said after it — ``2 of 3`` — a step down
   and a shade back, the way a unit is. **Only where the figure really is a
   part**: a measurement is out of nothing. It is words and not a bar, because
   a set of figures is read across its notes, and a drawing under one of them
   pushes that line out of step with the rest.

.. confval:: icon
   :name: sds-stat-icon
   :type: IconId

   A glyph over the figure. Muted and never in a status colour, for the reason
   a card's is: a figure is a subject, not a result.

.. confval:: note
   :name: sds-stat-note
   :type: string | markup

   What the figure is bounded by. **Without one the number is a boast** — and
   this is the whole reason the component exists rather than two divs.

.. _component-sds-swatch:

sds-swatch
==========

One colour, stated as a fact: the chip, what the colour is called, and the
value that name resolves to.

.. code-block:: html

   <sds-swatch value="var(--accent)" name="--accent" resolved="#FF8700"></sds-swatch>

All three, because none of them is enough alone. A chip says nothing a reader
can type. A token name says nothing about what the mode did with it. A hex out
of context says nothing about where the colour may be used. **A swatch missing
one of them documents part of a colour.**

A palette is a set, so it goes into ``sds-grid`` like any other, at ``wide`` —
the width a name with a ``light-dark()`` pair under it holds.

.. code-block:: html

   <sds-grid variant="wide">
     <sds-swatch value="var(--accent)" name="--accent" resolved="#FF8700"></sds-swatch>
     <sds-swatch value="var(--border-subtle)" name="--border-subtle"
       resolved="light-dark(#E3DFD6, #2B2823)" kind="line"></sds-swatch>
   </sds-grid>

.. confval:: value
   :name: sds-swatch-value
   :type: string
   :required: true

   What paints the chip — a token as it is written, or a literal where the
   value belongs to a mode the page is not being read in. **Anything that is
   not a colour is dropped rather than painted**: the value arrives from a
   document somebody else wrote, and a style attribute is not where an element
   finds out what it turns out to be. The name and the value stay readable
   either way, which is what the reader came for.

.. confval:: name
   :name: sds-swatch-name
   :type: string

   What the colour is called. The token where there is one, because that is
   the name a design writes; the human name where the palette has no tokens.

.. confval:: resolved
   :name: sds-swatch-resolved
   :type: string

   What that name resolves to, written out — and a pair is written as the
   pair, ``light-dark(#FFFFFF, #171614)``. Showing one half of a token
   documents one mode and claims to document the system.

.. confval:: kind
   :name: sds-swatch-kind
   :type: string

   ``fill`` or ``line``. A hairline is a colour too and cannot be shown as a
   fill: at one pixel a value is invisible, and filled it is a different job
   being done by the same number. ``line`` makes the chip its own edge, at the
   emphasis width, with the page's own ground standing inside it.

The chip keeps the system's hairline round it whatever it is painted with.
Without that, a swatch the colour of the page it is documented on would be a
missing square rather than a white one — which is the one case a palette has
to be able to draw.

.. _component-sds-icon-tile:

sds-icon-tile
=============

One glyph in a wall of them, with the identifier under it — a set that is
scanned rather than read.

.. code-block:: html

   <sds-grid variant="dense">
     <sds-icon-tile name="actions-check-circle"></sds-icon-tile>
     <sds-icon-tile name="actions-arrow-right" tag="mirrors"></sds-icon-tile>
   </sds-grid>

**Not a card.** A card is read — a title, a paragraph, a way on — and a wall of
four hundred of them is four hundred titles standing between a reader and the
one drawing they came for. Here the glyph fills the box and the name is held
back, because a set like this is found by shape and the name only matters once
the shape has been found.

The glyph is drawn at one size, which is not the tile's decision: a wall is
scanned at one distance, two sizes in it are two walls, and a tile drawn larger
than its neighbours is a tile claiming to matter more.

.. confval:: name
   :name: sds-icon-tile-name
   :type: string
   :required: true

   Which glyph, as ``sds-icon`` spells it — one identifier is not written two
   ways across two elements. An identifier the set does not hold leaves the box
   empty rather than throwing: a wall arrives from a catalogue, and one bad row
   must not take the other rows with it.

.. confval:: caption
   :name: sds-icon-tile-caption
   :type: string

   What is written under the glyph, where the set shows something other than
   the identifier. The identifier otherwise — which is what a reader retypes.

.. confval:: href
   :name: sds-icon-tile-href
   :type: string

   Where the tile goes, and the whole tile is the target. Without one it is
   still a tile: a wall documenting a set rather than indexing it presses
   nowhere, and an anchor with no target is a stop the keyboard makes for
   nothing.

.. confval:: tag
   :name: sds-icon-tile-tag
   :type: string

   The one fact the drawing cannot show — that it mirrors, that it is new, that
   it is going. One word, in the corner the glyph does not use.

.. _component-sds-quote:

sds-quote
=========

A sentence borrowed from somewhere, with where it came from. The attribution is
required, and that is the whole of why this is a component: an unattributed
quotation in a product's own writing reads as the product quoting itself for
emphasis.

The attribution is a ``sds-byline``, not a caption — authorship looks the
same wherever it is claimed, and the source of a borrowed sentence is not a
smaller kind of thing than the author of the page it sits in.

.. code-block:: html

   <sds-quote by="The 12.4 release notes" as="changelog"
     href="https://example.org/notes"
     body="Every route resolves to the same tokens."></sds-quote>

.. confval:: body
   :name: sds-quote-body
   :type: string | markup
   :required: true

   Long enough to be worth borrowing, short enough to stand at heading size:
   a borrowed sentence is a statement and is set like one. No quotation marks
   are drawn — the block is set apart by its measure, its size and a rule at
   its start, which is position rather than ornament.

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

   Where it can be read in full. The attribution carries the link.

.. confval:: meta
   :name: sds-quote-meta
   :type: string

   When, and anything else in the label register: a release, a revision.

.. confval:: initials
   :name: sds-quote-initials
   :type: string

   The mark, drawn only where these are given. A byline derives initials from
   the name because a byline is a person; a quote does not, because half of
   what is worth quoting is a document, and a monogram of a filename is a
   person invented for a source that has none.

.. _component-sds-byline:

sds-byline
==========

Who wrote it, and when — a component rather than a row a page assembles,
because the order is the point: who, then what they are to the subject, then
when. A page that puts the date first has published a date.

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

   When, and anything else in the label register: a release, a reading time, a
   revision.

.. confval:: initials
   :name: sds-byline-initials
   :type: string

   The mark. Taken from the name where it is not given, and two letters at
   most. Never a photograph: a face is a file to fetch, keep in step and hold a
   licence for, and none of that says who is answerable.

.. confval:: href
   :name: sds-byline-href
   :type: string

   Where the name leads — a profile, or the source it is attributed to.

.. confval:: unmarked
   :name: sds-byline-unmarked
   :type: boolean

   No monogram, for an attribution that is not a person: a document, a release
   note, a file. Initials derived from a filename are a person invented for a
   source that has none.

.. _component-sds-steps:
.. _component-sds-step:

sds-steps, sds-step
===================

An instruction read from the top, numbered down one rail.

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

For work that has an order. The numbers are the claim that step two follows
step one, so a set of things to do in any order is a list and not this. They
are the set's own count as well: a stop put in the middle renumbers everything
under it, and nothing writes a figure.

**It is a list said in ARIA rather than in** ``<ol>``. Every element in this
system draws its class box inside itself, which leaves one generic standing
between a list and its items — and that is a list a browser stops counting.
So the set carries ``role="list"``, every stop carries ``role="listitem"``, and
a reader is told how many steps there are and which one this is.

**A stop belongs to a set, and everything a stop draws is scoped to one.** The
disc, the rail and the title register are declared under ``.sds-steps``, so an
``sds-step`` standing on its own is the blocks it holds and nothing else — no
disc and no number, because a number is a place in a set and outside one there
is none to state.

.. confval:: steps
   :name: sds-steps-steps
   :type: "{ heading, body, optional?, anchor? }[]"

   Where a page holds the instruction as data. A stop whose content is blocks —
   what a documentation renderer hands over — goes between the tags as
   ``sds-step`` instead, and then this stays empty.

.. confval:: heading
   :name: sds-steps-heading
   :type: string

   On ``sds-step``. What is done at this stop, in one line. Spelt ``heading``
   like every other title here, and not ``title``, which is the global
   attribute a browser draws as a tooltip. It is not a heading in the outline:
   what says where a reader is in an instruction is the number, and a page whose
   outline is its steps has buried its own sections under them.

.. confval:: optional
   :name: sds-steps-optional
   :type: boolean
   :default: false

   A stop that may be skipped. The disc is left unfilled and the word stands
   beside the title — an unfilled ring says nothing to a reader who cannot see
   it, which is why the drawing is never the whole of the claim.

.. confval:: anchor
   :name: sds-steps-anchor
   :type: string

   The address of this one stop, for a page that links to it. It lands on the
   stop itself: unlike an answer in an accordion, a step is not folded away, so
   there is nothing to open before it can be read.

.. _component-sds-note:

sds-note
========

What an answer carries besides the answer: a glyph in the status colour, a
title that states the fact, and a bounded line of prose saying what the fact
costs the reader.

.. code-block:: html

   <sds-note tone="warn" heading="The index is a day old">
     <p>Pages published since yesterday are not in it yet.</p>
   </sds-note>

.. confval:: tone
   :name: sds-note-tone
   :type: "info" | "ok" | "warn" | "error"
   :default: "info"

   Not decoration: ``ok`` names where an answer came from, ``warn`` a degraded
   one, ``error`` none, ``info`` a fact about the surface. Only ``warn`` tints
   the block.

.. confval:: heading
   :name: sds-note-heading
   :type: string

   The fact, in a line. Sentence case, and never a category name. Optional,
   because a note whose body is a document's own prose has nothing to head it
   with.

.. confval:: body
   :name: sds-note-body
   :type: string | markup

   Or nothing, when the body is written between the tags instead.

.. confval:: icon
   :name: sds-note-icon
   :type: icon id

   An explicit glyph, where the tone's own says less than the note does. The
   glyph is never dropped: a colour alone leaves the meaning to whoever can
   tell the tones apart.

.. confval:: label
   :name: sds-note-label
   :type: string

   What the glyph says out loud. Each tone names its own word, and a caller may
   say a truer one — a renderer collapsing many admonition types onto these
   tones knows which this was, so ``caution`` and ``danger`` stay apart after
   both became ``warn``.

.. seealso::

   :doc:`/design-system/states` for what an empty, a failed and a loading
   surface each owe the reader, and :doc:`overlays` for the planes these
   blocks float over.
