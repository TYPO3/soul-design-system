:navigation-title: Directives

==========
Directives
==========

The directives this theme adds to what an author can write, and one document
field. They are registered by the extension, so a project that selected the
theme can use them immediately — there is nothing to add to ``guides.xml`` and
no template to copy.

Some of them build a landing page: a page of a different shape than a manual
page, and the renderer has no vocabulary for it. ``card-grid`` and ``card``
signpost a manual and ``accordion`` folds its answers away, both spelled the
way a TYPO3 manual already spells them. The last embeds a rendered specimen at
the size it was measured at.

layout
======

Not a directive — a field at the top of a document, beside the navigation
title, and it decides which shape the page is built in.

.. code-block:: text

   :navigation-title: Overview
   :layout: marketing

   ================
   What this is for
   ================

.. confval:: layout
   :type: string
   :default: "default"

   ``marketing`` renders the page as a run of full-bleed bands with no rail.
   Anything else — and any page that writes no such field — is the manual
   shape: the toctree in a rail on the left, the trail above the title, the
   text held to sixty-six characters.

Both shapes carry the same bar and the same footer, because a reader must
never have to work out which site they are on. What changes is the body.

.. note::

   A field is only invisible because something claimed it. One nobody claims
   renders as a definition list in the body, which is what a misspelling looks
   like: ``:laoyut: marketing`` prints the word and the value above the title
   of a page that is still a manual.

hero
====

The opening claim of a marketing page, set beside one decorative image. It
goes immediately after the document title so that the title remains the page's
real heading, browser title and source for navigation.

.. code-block:: text

   ======================
   Design and ship as one
   ======================

   .. hero:: /_images/design-system-workbench.png

      The opening summary belongs inside the directive.

      A second paragraph can make the promise concrete.

The argument is the image source. The theme composes the existing split, stack
and figure vocabulary; at a narrow viewport that split becomes a column by the
same rule as every other split in the system. Content that follows the hero
before the next band remains part of the opening section.

.. confval:: alt
   :name: hero-alt
   :type: string
   :default: ""

   What the image shows when it contributes meaning not carried by the copy.
   Leave it out for a decorative illustration whose subject is already named
   beside it.

band
====

A full-bleed section of a landing page: the ground runs edge to edge and the
content inside is held to the page measure.

.. code-block:: text

   .. band:: What it costs
      :quiet:
      :id: pricing

   Everything from here, up to the next band.

   .. band::

   And this is back on the canvas.

**A band does not wrap a page in itself, it opens one.** What follows belongs
to it until the next band starts, and what stands before the first one is a
band as well — a page opens on the canvas. That is the whole of the syntax,
and it has a reason beyond looking tidy in the source: a band is full-bleed and
takes the page inset itself, so a band nested in another indents its text by a
gutter nobody asked for and stops at the width of its parent.

A page that writes no band at all is the single band it looks like.

.. confval:: quiet
   :type: flag

   The second ground. Alternating quiet and plain is what makes a run of bands
   read as a sequence rather than as a wall; two consecutive bands share one
   hairline rather than drawing two.

.. confval:: id
   :type: string

   An anchor, so a link elsewhere on the site can land on this section.

.. confval:: the heading
   :type: string

   The band's argument. It is an option rather than a section heading because a
   section heading inside a directive is not one: reStructuredText parses
   sections at document level, so a line with ``====`` under it written in here
   ships both the line and the equals signs as text.

On a page whose layout is not ``marketing``, a band still renders — it is a
section inside the column, which is what it looks like.

.. band:: This heading is a band, on a manual page
   :quiet:
   :id: a-band

The paragraph you are reading is inside it, and it is inside the column rather
than running edge to edge, because the shape a band takes is the page's to
decide and not the band's. The landing page of :doc:`the example project
<example>` is the same directive where it is at home.

grid
====

A set read side by side, reflowing by its own minimum width.

.. code-block:: text

   .. grid:: dense

      .. card:: What it is
         :href: /overview

         Two sentences.

      .. card:: What it costs
         :href: /pricing

         Two more.

That source, on this page:

.. grid::

   .. card:: What it is
      :href: /guides-theme/index
      :tag: Overview

      Two sentences, a badge above the title, and the whole card lit at the top
      of its frame under the pointer.

   .. card:: What it costs
      :href: /guides-theme/installation
      :tag: Installation

      One Composer package, one copy step, and a document called ``index`` at
      the root.

No column count, and that is the design: three across on a desk, two on a
tablet, one on a phone, decided by how narrow an item may get rather than by a
breakpoint somebody picked. It holds cards, figures, or anything else read as
a set — each item draws itself and the grid only decides how many stand in a
row.

.. confval:: the argument
   :name: grid-variant
   :type: default | wide | dense | flush

   How much room one item needs, said as what the items hold rather than as a
   number: ``wide`` for a card carrying a picture and a paragraph, ``dense``
   for a figure or a name and a glyph, ``flush`` for the gutter taken out so
   the set shares a hairline and reads as one wall. Left off, the set gets the
   width every set gets. A name the element does not define is not an
   invitation to invent one — it falls back rather than passing through.
   ``:variant:`` says the same thing as an option.

.. confval:: class
   :name: grid-class
   :type: string

   Carried onto the element, because an author who wrote it meant it for their
   own stylesheet, and dropping what a theme does not understand is the one
   thing it must not do.

card-grid
=========

The cards a manual is signposted with, in the spelling a TYPO3 manual already
uses — so a documentation set written for the Bootstrap theme renders here
without being rewritten.

.. code-block:: text

   .. card-grid::
      :columns: 1
      :columns-md: 2

      .. card:: :ref:`Introduction <introduction>`

         Written for somebody who has just arrived.

.. confval:: columns
   :type: integer

   How many cards a row was written for. Read together with ``columns-sm``,
   ``columns-md`` and ``columns-lg`` as a single question — how much room does
   a card in here need — and answered with a minimum width instead of a track
   count, so the grid goes on reflowing and no page names a breakpoint.

   Two or fewer is the wide grid, five or more the dense one, and everything
   between is the grid every other set of cards on the site uses. The largest
   of the counts decides, the smaller ones being the same page at a narrower
   width, which the grid already answers on its own.

.. confval:: gap
   :type: integer

   Accepted and dropped. The space between cards is the system's spacing
   scale, and a page that set it would be a page holding an opinion the next
   release of the design system has to honour.

.. confval:: card-height
   :type: integer

   Accepted and dropped: the cards in a row are already the same height, which
   is what a grid row does.

.. confval:: class
   :name: card-grid-class
   :type: string

   Carried onto the grid as it stands. An author who wrote it meant it for
   their own stylesheet, and silently dropping what a theme does not
   understand is the one thing it must not do.

That source, on this page — two across, and the second card carrying
everything a card can:

.. card-grid::
   :columns: 1
   :columns-md: 2

   .. card:: :doc:`installation`

      One Composer package, one copy step, and a document called ``index`` at
      the root.

   .. card:: :doc:`publishing`
      :label: Chapter
      :icon: actions-book
      :footer: Three commands
      :action: Read it

      The job a project runs, command for command, and what each of them
      leaves behind.

card
====

One card: a title that goes somewhere, and what is behind it.

.. code-block:: text

   .. card:: :ref:`Installation <installation>`
      :label: Chapter
      :icon: actions-book
      :footer: Three commands
      :action: Read it

      What the package needs, and the three commands that render a project
      with it.

.. confval:: href
   :name: card-href
   :type: string

   A document, written the way a ``:doc:`` reference is, and resolved per
   page. It is the same thing the title's own reference says, for a card whose
   title is plain text — and where both are written, this one wins.

.. confval:: label
   :type: string

   The tracked-out line over the title: what a set of cards is named or
   numbered as — ``CHAPTER 02``, ``FOR EDITORS`` — or when an entry is from.
   The same register and the same line.

.. confval:: tag
   :type: string

   What kind of thing the card is, in the badge beside the label. A fact about
   the card rather than a result, so it carries no tone and no glyph. The row
   is dropped where neither this nor the label is written.

.. confval:: icon
   :type: string

   A glyph above the label, for a set told apart before it is read. The name
   is an icon of this system — see :doc:`/design-system/icons`.

.. confval:: src
   :name: card-src
   :type: string

   The picture, flush at the top of the card. A path in the documentation
   source is copied into the output and resolved per page; a URL somewhere else
   is linked as it stands. An SVG of this project's own is referenced rather
   than linked, so it takes the page's tokens and follows it into dark — which
   costs the file the one line :doc:`/design-system/artwork` asks for.

   The name is ``src`` here and on the element, because that is what everything
   in this system that takes a file is called.

.. confval:: alt
   :name: card-alt
   :type: string

   What the picture shows, for a reader who cannot see it. Written and empty
   says decorative — a card whose art only repeats the title beside it — and
   left out entirely says nothing was decided, which reads very differently.

.. confval:: footer
   :type: string

   One line under a hairline at the foot of the card: what the reader gets
   there, who it is for, what state it is in.

.. confval:: action
   :type: string

   The call to action, in words — ``Read it``. It is not a button and not a
   second link: the whole card already goes there, so this is the line that
   says so, and the arrow after it leans out when the card is under the
   pointer. Drawn only where the card has somewhere to go.

.. confval:: class
   :name: card-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The title carries the target.** ``.. card:: :ref:`Introduction
<introduction>``` is how a TYPO3 manual writes a card, so the words of the
reference become the heading and the reference itself becomes where the card
goes. A plain title with ``:href:`` says the same thing the other way round.

**The whole card is the link, and there is exactly one.** The title's anchor
is stretched over the frame, so what a screen reader announces is the title
while what a pointer can hit is the card — and a second anchor inside it would
be a second destination under one frame, which is why there is no option for a
button. A link written into the prose of a card still works, and is a card
asking to be two cards.

**The options are ``sds-card``'s properties, all of them, spelt the way the
element spells them.** A directive that draws one of this system's components
and answers for half of it sends the author who wanted the other half to their
own stylesheet, which is the one thing this system exists to prevent — and one
that renames what it does carry makes them translate a card they have already
read. ``href`` links and ``src`` takes a file here for the same reason they do
everywhere else. What the element gains, this gains.

The node is ``sds-card`` itself and not a ``div`` wearing its classes — the
element is the front door here as everywhere else, so the card is drawn in one
file and a rendered page cannot drift from one a product wrote. The template
writes none of the card: it sets the options above and lets the element draw
its own markup, which is what makes the card the component's to change.

A reader with no JavaScript gets the whole of it anyway. Every element in the
site is rendered before the page is published, so the picture, the row, the
title and the summary are in the document with no script involved; in a browser
the element upgrades over that rendering. This is the theme-wide arrangement,
not the card's own — see :doc:`markup`.

stat
====

One number stated as a fact: the figure, what was counted, and the line that
bounds it.

.. code-block:: text

   .. grid:: dense

      .. stat:: 240
         :unit: ms
         :label: median answer
         :icon: actions-clock

         Measured over the last release, on a warm index.

      .. stat:: 2
         :of: 3
         :label: sources answering

         One is slow and one is unreachable from the checker.

That source, on this page:

.. grid:: dense

   .. stat:: 240
      :unit: ms
      :label: median answer
      :icon: actions-clock

      Measured over the last release, on a warm index.

   .. stat:: 2
      :of: 3
      :label: sources answering

      One is slow and one is unreachable from the checker.

.. confval:: the argument
   :name: stat-value
   :type: string
   :required: true

   The figure — ``5``, ``240``, ``12.4+`` — never "many". It is the argument
   rather than an option because it is what the line is about.

.. confval:: unit
   :name: stat-unit
   :type: string

   What the figure is in — ``ms``, ``%``, ``kB``. The element sets it a step
   down and joins it to the number with the narrow no-break space a figure may
   not be split from, so no page has to know that character.

.. confval:: label
   :name: stat-label
   :type: string

   What was counted, under the figure and in the label register.

.. confval:: of
   :name: stat-of
   :type: string

   The whole the figure is a part of, said after it — ``2 of 3``. Only where
   the figure really is a part: a measurement is out of nothing. It is words
   and not a bar, so every figure in a set keeps the same shape and their notes
   start on one line.

.. confval:: icon
   :name: stat-icon
   :type: string

   A glyph on the figure's line, before the number. Muted and never in a
   status colour, for the reason a card's is: a figure is a subject, not a
   result.

.. confval:: class
   :name: stat-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The body is the bound, and it is not optional in practice.** "5 sources"
says nothing until it says which five, and a figure with no bound is a claim
rather than a fact — which is the whole reason ``sds-stat`` is a component and
not two divs. It is written between the tags rather than as an option because
out of a document that line carries links.

**A set of figures is a set**, so it goes in ``grid`` like any other, at
``dense`` — the width a number and the line under it holds. ``flush`` works
too: there the figures share a hairline and the wall gives each its ground.
The frame in a wall is the wall's, so a figure anywhere else stays bare and a
row of numbers on a page is not a row of boxes.

accordion
=========

Questions with their answers folded behind them, in the spelling a TYPO3
manual already uses.

.. code-block:: text

   .. accordion::
      :name: running-it

      .. accordion-item:: What does it need installed?
         :open:

         PHP 8.2 or newer, and a project it can read.

      .. accordion-item:: Can it run in CI?

         Yes, and it answers less there.

.. confval:: name
   :name: accordion-name
   :type: string

   What the set is called. It is the group the answers fold in, so opening one
   closes the last — and a page with two sets gives them different names, or
   one closes the other's answers. A set that writes none is given one.

.. confval:: multiple
   :type: flag

   More than one answer open at a time, for a set whose answers are meant to be
   compared rather than found. Without it a set is exclusive, because a list is
   easier to read than a wall.

.. confval:: class
   :name: accordion-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The fold is a** ``<details>``. It works before any script runs, the keyboard
reaches it, find-in-page opens the answer it lands in, and what closes the
others is the platform rather than a listener — which is why the answers carry
the set's name and why a page never writes one on an item.

accordion-item
==============

One question, and the blocks folded behind it.

.. code-block:: text

   .. accordion-item:: What does it need installed?
      :open:

      PHP 8.2 or newer, and a project it can read. No daemon, and no database
      of its own.

.. confval:: open
   :type: flag

   Standing open. For the first answer on a page of them, usually, so the shape
   of an answer is visible without pressing anything. ``:show:`` is the same
   flag under the name the Bootstrap theme gave it.

.. confval:: header-level
   :name: accordion-item-header-level
   :type: integer

   Accepted and dropped. What a set of questions is folded by is a control and
   not a heading, so it takes no level in the outline.

.. confval:: name
   :name: accordion-item-name
   :type: string

   Accepted and dropped. Where a link into a single answer should land is not
   decided — see ``GAPS.md`` in the package.

.. confval:: class
   :name: accordion-item-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The question is the argument and the answer is what follows it.** That is not
a preference: an answer is paragraphs, lists and code blocks, which is what no
attribute carries. The node is ``sds-accordion-item`` itself and the template
writes none of its markup — the same arrangement as the cards above.

That source, on this page:

.. accordion::
   :name: what-a-theme-answers

   .. accordion-item:: What does it need installed?
      :open:

      PHP 8.2 or newer, and a project it can read — see :doc:`installation`.

   .. accordion-item:: Can it run in CI?

      Yes. :doc:`publishing` is the job, command for command.

specimen
========

A rendered card, embedded at the size it was drawn for.

.. code-block:: text

   .. specimen:: guidelines/colors-surfaces.card.html
      :viewport: 700x270
      :title: Surfaces

And that source, on this page — the same file Storybook opens and the same one
the design pane exports:

.. specimen:: guidelines/colors-surfaces.card.html
   :viewport: 700x270
   :title: Surfaces

.. confval:: the card
   :type: string
   :required: true

   The directive's argument: a path under ``_cards/`` in the documentation
   source. The card is a whole
   document with a stylesheet of its own, so it is embedded in a frame rather
   than inlined — it carries the specimen chrome, which a page must not
   inherit, and it may pin its own mode.

.. confval:: viewport
   :type: string
   :default: "700x260"

   Width by height, in pixels, and it is not decoration. Every card declares
   the size it was measured at in its own ``@dsCard`` header and the gate
   proves it still fits there; a card shown at any other size is a card
   documenting something nobody checked.

.. confval:: title
   :type: string
   :default: "Specimen"

   The caption under the frame, printed beside the viewport. It is also the
   frame's accessible name, which is the only thing a reader who cannot see
   the card is given.

The frame is an ``sds-embed``, fixed at the viewport above: where the column
is narrower it scrolls rather than squeezing the card into a width nothing
ever measured. :doc:`markup` has the other half of that node — a video, which
is the same directive's opposite and fills the column instead.

The cards have to be inside the documentation source, because the renderer
copies an asset it can see a document reach for and nothing else. This
repository's ``make guides`` copies ``specimens/`` into ``docs/_cards/`` before
each render and rewrites the stylesheet links inside each card on the way —
that directory is generated and gitignored.

.. important::

   This directive is for a project that ships rendered cards of its own. It
   is what makes a guideline page show the rule instead of describing it, and
   it is the reason the guidelines in this manual and the specimens in
   Storybook cannot say different things: they are the same file.

.. seealso::

   :doc:`markup` for what the renderer's own directives — admonitions, code
   blocks, tabs, ``confval``, topics — come out as under this theme.
