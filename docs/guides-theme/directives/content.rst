:navigation-title: Content blocks

==============
Content blocks
==============

One thing a page states, alone or in a set.

card
====

One card: a title that goes somewhere, and what is behind it.

.. example:: One card, carrying everything a card can

   .. card:: :doc:`/guides-theme/installation`
      :label: Chapter
      :icon: actions-book
      :footer: For a desk
      :action: Read it

      What the package needs, and the commands that
      render a project with it.

.. confval:: href
   :name: card-href
   :type: string

   A document, as a ``:doc:`` reference spells it, resolved per page. It is
   the same thing the title's own reference says, for a card whose title is
   plain text. Where both stand, this one wins.

.. confval:: label
   :type: string

   The tracked-out line over the title. The name or number of a set of
   cards, ``CHAPTER 02``, ``FOR EDITORS``, or the date of an entry. The same
   register and the same line.

.. confval:: tag
   :type: string

   What kind of thing the card is, in the badge beside the label. A fact
   about the card, not a result, so it carries no tone and no glyph. The
   row drops where neither this nor the label stands.

.. confval:: icon
   :type: string

   A glyph above the title, for a set a reader tells apart before a read.
   The name is an icon of this system; see :doc:`/design-system/brand-and-imagery/icons`.

.. confval:: sign
   :name: card-sign
   :type: string

   The state of what the card stands for, measured: ``yes``, ``partly``,
   ``no`` or ``unknown``. The element draws the sign the drawings use for
   it, at the end of the line over the title, and says its meaning in words.

.. confval:: src
   :name: card-src
   :type: string

   The picture, flush at the top of the card. The render copies a path in
   the documentation source into the output and resolves it per page. A URL
   somewhere else stays as it is. Either way it is one ``<img>``, so a
   drawing arrives in the colours its file declares.
   :doc:`/design-system/brand-and-imagery/illustrations` says why, and what the file has to be ready
   for.

   The name is ``src`` here and on the element, because everything in this
   system that takes a file has that name.

.. confval:: alt
   :name: card-alt
   :type: string

   What the picture shows, for a reader who cannot see it. Written and
   empty says decorative, a card whose art only repeats the title. Left out
   entirely says nobody decided, which reads very differently.

.. confval:: footer
   :type: string

   One line under a hairline at the foot of the card: what the reader gets
   there, who it is for, what state it is in.

.. confval:: action
   :type: string

   The call to action, in words: ``Read it``. Not a button and not a second
   link. The whole card already goes there, so this is the line that says
   so, and the arrow after it leans out under the pointer. Drawn only where
   the card has somewhere to go.

**The title carries the target.**
``.. card:: :ref:`Introduction <introduction>``` is how a TYPO3 manual writes a card. The words of the
reference become the heading, and the reference becomes where the card
goes. A plain title with ``:href:`` says the same thing the other way round.

**The whole card is the link, and there is exactly one.** The title's anchor
stretches over the frame. So a screen reader announces the title, while a
pointer hits the card. A second anchor inside it is a second destination
under one frame, which is why there is no option for a button. A link in
the prose of a card still works, and is a card that asks to be two cards.

**The options are the properties of** ``sds-card``, **all of them, spelt the way
the element spells them.** A directive that draws a component and answers for
half of it sends the author to their own stylesheet for the other half.
That is the one thing this system exists to prevent.

One that renames what it carries makes them translate a card they have
already read. ``href`` links and
``src`` takes a file here for the reason they do everywhere else. What the
element gains, this gains. Its reference is ``sds-card`` in
:doc:`/frontend/components/content`.

The node is ``sds-card`` itself and not a ``div`` with its classes. The
element is the front door here as everywhere else. So the card draws in one
file, and a rendered page cannot drift from one a product wrote. The template
writes none of the card. It sets the options above and lets the element
draw its own markup, which is what makes the card the component's to
change.

A reader with no JavaScript gets the whole of it anyway. Every element in
the site renders before the publish. So the picture, the row, the title and
the summary are in the document with no script. In a browser the element
upgrades over that rendering. This is the theme-wide arrangement,
not the card's own; see :doc:`/guides-theme/markup`.

stat
====

One number as a fact: the figure, what the count is of, and the line that
bounds it.

.. example:: Two figures, at the width a number holds

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

   The figure, ``5``, ``240``, ``12.4+``, never "many". It is the argument
   and not an option because it is what the line is about.

.. confval:: unit
   :name: stat-unit
   :type: string

   What the figure is in: ``ms``, ``%``, ``kB``. The element sets it a step
   down. It joins it to the number with the narrow no-break space a figure
   must not split from, so no page has to know that character.

.. confval:: label
   :name: stat-label
   :type: string

   What the count is of, under the figure and in the label register.

.. confval:: of
   :name: stat-of
   :type: string

   The whole the figure is a part of, after it: ``2 of 3``. Only where the
   figure is a part. A measurement is out of nothing. It is words and not a
   bar, so every figure in a set keeps the same shape and their notes start
   on one line.

.. confval:: bar
   :name: stat-bar
   :type: flag

   With ``:of:``, the share as a bar under the figure, so the proportion
   reads before the numbers. Give it to every figure of a set or to none,
   so the notes still start on one line.

.. confval:: list
   :name: stat-list
   :type: flag

   With ``:of:``, one share of a list. The label and the count stand on one
   line over the bar, and the body under it. For a set of shares where the
   proportion is the point and the figure only its read-out.

.. confval:: icon
   :name: stat-icon
   :type: string

   A glyph on the figure's line, before the number. Muted and never in a
   status colour, for the reason a card's is. A figure is a subject, not a
   result.

**The body is the bound, and in practice it is mandatory.** "5 sources" says
nothing until it says which five. A figure with no bound is a claim, not a
fact, which is the whole reason ``sds-stat`` is a component. It stands
between the tags, not as an option, because out of a document that line
carries links.

**A set of figures is a set**, so it goes in ``grid`` like any other. At
``dense``, the width a number and the line under it hold. ``flush`` works
too. There the figures share a hairline, and the wall gives each its ground.

The frame in a wall is the wall's. So a figure anywhere else stays bare, and
a row of numbers on a page is not a row of boxes. The element is
``sds-stat`` in :doc:`/frontend/components/content`, beside its grid.

surface
=======

One filled plane, with a statement in place.

.. example:: Two planes, read across each other

   .. grid::

      .. surface:: Read, never write
         :icon: actions-file-shield

         The tool reads every source. It writes nothing back.

      .. surface:: One answer, one origin
         :label: Rule 02

         Their origins tell two answers that disagree
      apart.

.. confval:: the argument
   :name: surface-heading
   :type: string
   :required: true

   The title of the plane, in the quieter register. This is not a
   destination, and a title that looks like one is a promise the box does
   not keep.

.. confval:: plane
   :name: surface-plane
   :type: string

   The fill. ``raised`` sits on the canvas and reads as a plane. ``sunken``
   is machine output: code, logs, structured content. Named for the fill,
   because in a system with no shadows that is what tells two planes apart.
   ``raised`` is the default.

.. confval:: label
   :name: surface-label
   :type: string

   The tracked-out line over the title, where a set has numbers or sources:
   ``AUDIENCE 01``, ``SOURCE``, ``STEP 02``. Over the title, not in it. A
   title with its own number reads as part of the sentence.

.. confval:: icon
   :name: surface-icon
   :type: string

   A glyph above the title, where a reader tells a set apart before a read.
   It stands beside the plane's own title, never alone, and takes the muted
   ink for the reason a card's does. A plane is a subject, not a result.

**A plane states, a card goes somewhere.** That is the whole line between
the two, and it decides which one a page wants. A card's frame is the link
and its title is the anchor, so a set of planes claims nothing to click.
Neither is what ``.. topic::`` is. A digression in the reading flow that the
outline does not list stays an ``<aside>``, and is not one of a set.

**It goes in a** ``grid`` **like any other set**, at the width the
statements hold. A plane on its own is a plane in the flow and renders, but
a single one says nothing the paragraph above it did not. The element is
``sds-surface`` in :doc:`/frontend/components/content`.

quote
=====

A sentence from somewhere else, with its source.

.. example:: A sentence, and who it belongs to

   .. quote:: Benjamin Kott
      :as: maintainer
      :meta: 24 July 2026
      :initials: BK

      The fallback was never the problem. *Not saying*
      it was a fallback was the problem.

.. confval:: the argument
   :name: quote-by
   :type: string
   :required: true

   Who said it: a person, a document, a release note. It is the argument and
   not an option because the element demands it. A quotation with no source
   in a product's own writing reads as the product quoting itself. A
   mandatory thing as an option is a thing authors leave out.

.. confval:: as
   :name: quote-as
   :type: string

   What they are to the subject, where the name alone does not say it: a
   maintainer, a reviewer, the documentation. Spelt ``as`` and not ``role``,
   because ``role`` is the global ARIA attribute and claims a role that does
   not exist.

.. confval:: meta
   :name: quote-meta
   :type: string

   When, and anything else in the label register: a date, a release, a
   revision.

.. confval:: initials
   :name: quote-initials
   :type: string

   Their initials, and the monogram draws only with these given. A byline
   derives them from a name. A quotation does not, because half of what is
   worth a quote is a document. A monogram of a filename is a person
   invented for a source with none.

.. confval:: href
   :name: quote-href
   :type: string

   Where to read it in full. The attribution becomes that link. A target
   outside the site stays as it is, and one inside it resolves like any
   other reference.

**The sentence goes between the tags**, because out of a document it carries
links and emphasis, which an attribute cannot hold. A block quote is the
spelling to reach for, and it is not available. The parser resolves an
indented block with an attribution line into a definition list, so
``<blockquote>`` never reaches a template. This directive is how a manual
quotes anything. The element is ``sds-quote`` in
:doc:`/frontend/components/content`. The attribution it draws is
``sds-byline``, which is why there is no option here for the order of that
row.

byline
======

Who wrote the page, what they are to it, and when. A paper has it under its
title.

.. example:: The author of a paper

   .. byline:: Benjamin Kott
      :as: responsible for the content
      :meta: version 1.0

The name is the argument. The options are the ones ``quote`` has: ``:as:``,
``:meta:``, ``:initials:`` and ``:href:``. The monogram comes
from the name, and ``:initials:`` says it where the name does not. The
element is ``sds-byline`` in :doc:`/frontend/components/content`. The
Markdown twin writes the three parts on one line.

checks
======

A list whose items each carry a check. The glyph is ``actions-check`` of the icon
set. The body is an ordinary list, so a reader with no script gets the same list.

.. example:: The checks in the status green

   .. checks::
      :tone: ok

      - **One overview:** One module shows all applications with access.
      - **Known standards:** The API uses OAuth 2.0 and OpenAPI.

.. confval:: tone
   :name: checks-tone
   :type: ok

   ``ok`` draws the checks in the status green. Without it they take the ink of
   the text.

logos
=====

A wall of marks, with one ``logo`` per mark in the body. Before a mark goes in,
make sure that the licence of the mark lets the page show it.

.. example:: Two marks, the second one a link

   .. logos:: Used by

      .. logo:: /_images/signet.svg
         :alt: Soul

      .. logo:: /_images/signet-l.svg
         :alt: Soul, at the large size
         :href: /design-system/brand-and-imagery/brand

The argument says what the marks have in common, and it is optional. The wall
grows by rows and has no limit. A short last row keeps the width of the cells.

logo
====

One mark of a wall. The argument is the file.

.. confval:: alt
   :name: logo-alt
   :type: string
   :required: true

   The name the mark stands for. A mark says nothing to a reader who cannot
   see it.

.. confval:: href
   :name: logo-href
   :type: string

   Where the mark goes.
