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

sds-card
========

A way into something: a chapter, a product, a page. A picture at the top, the
row that says what kind of thing it is, the title that goes there, the prose,
and a foot carrying the call to action.

.. code-block:: html

   <sds-card heading="Publishing" href="/guides-theme/publishing"
     label="CHAPTER 03" icon="actions-book" action="Read the chapter">
     <p>The workflow that renders the site and puts it where readers are.</p>
   </sds-card>

**The whole card is the target and the title is the link.** The anchor is
stretched over the frame by the class layer, so the name a reader hears is the
title while the hit area is the card. One link, therefore: the call to action
is words rather than a second anchor to the same place.

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

   The tracked-out line over the title, where a set of cards is named or
   numbered as a set.

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

sds-card-grid
=============

The wall a set of cards is read in. Cards go between the tags, because a card
is content and a grid of two is not a grid of six.

.. code-block:: html

   <sds-card-grid variant="flush">
     <sds-card heading="…" href="…"></sds-card>
     <sds-card heading="…" href="…"></sds-card>
   </sds-card-grid>

.. confval:: variant
   :name: sds-card-grid-variant
   :type: "" | "wide" | "dense" | "flush"
   :default: ""

   How wide the set runs, or whether it runs as a wall at all. ``flush`` is the
   gutter taken out — the cards share a hairline and the set reads as one block.

.. note::

   **No column count.** The grid reflows by a minimum width, so a page says
   what its cards hold and no page names a breakpoint. What the element adds on
   top is evenness: four cards in a three-wide row would wrap as three and one,
   so it lays them out two and two.

sds-teaser
==========

One entry in a list of them: an image where the entry has one, what it is and
when, the headline, and the two lines that decide whether it is opened.

.. code-block:: html

   <sds-teaser heading="Soul 1.4 is out" href="/news/soul-1-4"
     tag="release" meta="12 May 2026" src="/img/1-4.png" alt="">
     <p>The summary, written rather than cut from the first two lines.</p>
   </sds-teaser>

**The title is the link and the card is not.** A card wrapped in one anchor
announces its whole contents as that link's name; it follows on hover instead.

.. confval:: heading
   :name: sds-teaser-heading
   :type: string
   :required: true

.. confval:: body
   :name: sds-teaser-body
   :type: string | markup

   The two lines that decide whether it is opened — a summary is written, not
   cut.

.. confval:: href
   :name: sds-teaser-href
   :type: string

.. confval:: tag
   :name: sds-teaser-tag
   :type: string

   What kind of entry it is. Drawn as a badge with no tone, because it is a
   fact about the entry rather than a result.

.. confval:: meta
   :name: sds-teaser-meta
   :type: string

   When, and anything else that belongs in the label register.

.. confval:: src
   :name: sds-teaser-src
   :type: string

.. confval:: alt
   :name: sds-teaser-alt
   :type: string

.. note::

   ``sds-teaser`` invites and ``sds-result`` answers — an entry in a list and a
   hit in a search are not the same shape; see :doc:`navigation`. And neither is
   ``sds-card``, which is a way into something rather than one of many.

sds-stat
========

A number stated as a fact: the value first and largest, the label under it, and
the line saying what the number is bounded by.

.. code-block:: html

   <sds-stat value="240 ms" label="median answer"
     note="Measured over the last release, on a warm index."></sds-stat>

.. confval:: value
   :name: sds-stat-value
   :type: string
   :required: true

   Concrete — ``5``, ``240 ms``, ``12.4+`` — never "many". Set in sans: mono
   means the machine named the thing, and a count is a fact about the software
   rather than a string it returns.

.. confval:: label
   :name: sds-stat-label
   :type: string
   :required: true

   What was counted, in the label register.

.. confval:: note
   :name: sds-stat-note
   :type: string | markup

   What the figure is bounded by. **Without one the number is a boast** — and
   this is the whole reason the component exists rather than two divs.

sds-quote
=========

A sentence borrowed from somewhere, with where it came from. The attribution is
required, and that is the whole of why this is a component: an unattributed
quotation in a product's own writing reads as the product quoting itself for
emphasis.

.. code-block:: html

   <sds-quote by="The 12.4 release notes" as="changelog"
     href="https://example.org/notes"
     body="Every route resolves to the same tokens."></sds-quote>

.. confval:: body
   :name: sds-quote-body
   :type: string | markup
   :required: true

   Long enough to be worth borrowing, short enough to read at lead size. No
   quotation marks are drawn: the block is set apart by its measure and a rule
   at its start — position rather than ornament.

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

   Where it can be read in full.

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

sds-empty
=========

A boundary, drawn as an answer. **Never "no results".**

.. code-block:: html

   <sds-empty kind="quiet" heading="No icon matches “dashbord”"
     body="The whole set was searched by name and by category."
     action="Clear the filter" meta="TYPO3/TYPO3.Icons"></sds-empty>

An answer carries its source, its bounds and what it leaves out, and an empty
one is still an answer — a page that only says "nothing found" cannot be told
from a failure.

.. confval:: kind
   :name: sds-empty-kind
   :type: "quiet" | "boundary"
   :default: "quiet"

   ``quiet`` is an empty result, and nothing about that is an event.
   ``boundary`` says the question is outside what this source covers, which is
   a deliberate answer. Neither takes a status colour: nothing failed.

.. confval:: heading
   :name: sds-empty-heading
   :type: string
   :required: true

   What happened, as a fact. Not a category.

.. confval:: body
   :name: sds-empty-body
   :type: string | markup
   :required: true

   Which source was asked, what it answered, and what it does not cover.

.. confval:: icon
   :name: sds-empty-icon
   :type: icon id

   Says what was searched. A boundary carries its own on its own.

.. confval:: action
   :name: sds-empty-action
   :type: string

   The nearest real thing to do next. A boundary usually has none, which is why
   it is optional — an offer that leads nowhere is worse than silence.

.. confval:: href
   :name: sds-empty-href
   :type: string

   Where the offer goes. Left empty the offer is a button that emits
   ``sds-action`` instead, because undoing a filter changes this page rather
   than leaving it.

.. confval:: meta
   :name: sds-empty-meta
   :type: string

   The source and scope, in the label register, where naming them in the body
   would make the sentence about the machine.

.. confval:: box-style
   :name: sds-empty-box-style
   :type: string

   Layout for the box, since the host draws nothing.

.. seealso::

   :doc:`/design-system/states` for what an empty, a failed and a loading
   surface each owe the reader, and :doc:`overlays` for the planes these
   blocks float over.
