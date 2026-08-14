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

.. _component-sds-surface:

sds-surface
===========

A filled plane holding a statement.

.. code-block:: html

   <sds-surface plane="sunken" label="SOURCE 01" icon="actions-database"
     heading="The package index" body="Answered in 240 ms."></sds-surface>

.. confval:: plane
   :name: sds-surface-plane
   :type: "raised" | "sunken"
   :default: "raised"

   Named for the fill each one is. ``raised`` sits on the canvas and has to
   read as a plane; ``sunken`` is machine output — code, logs, structured
   content.

   The plane with *no* fill is not one of its answers: an unfilled hairline
   plane carrying a title and prose is ``sds-card``, down to the class it
   writes.

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
   :default: "flex:1; min-width:200px"

   Layout for the plane. The host draws nothing, so this is what reaches the
   element that is actually laid out.

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
