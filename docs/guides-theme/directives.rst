:navigation-title: Directives

==========
Directives
==========

The directives this theme adds to what an author can write, and the document
field. The extension registers them, so a project with the theme can use
them at once. There is nothing to add to ``guides.xml`` and no template to
copy.

.. list-table::
   :header-rows: 1

   * - Written
     - What it is for
     - Draws
   * - ``:layout:``
     - a field, not a directive: which of the two shapes the page takes
     - —
   * - ``hero``
     - the opening claim of a landing page, beside one image
     - ``.sds-split`` and ``sds-figure``
   * - ``band``
     - a full-bleed section of a landing page, and everything after it
     - ``.sds-band``
   * - ``grid``
     - a set read side by side, reflowed by its own minimum width
     - ``sds-grid``
   * - ``split``
     - two of anything, side by side until there is no room for two
     - ``.sds-split``
   * - ``half``
     - one side of a split, where that side is several blocks
     - ``.sds-stack``
   * - ``card``
     - a way into something: a title that goes somewhere, and what is
       behind it
     - ``sds-card``
   * - ``stat``
     - one number as a fact
     - ``sds-stat``
   * - ``surface``
     - one filled plane, with a statement in place
     - ``sds-surface``
   * - ``quote``
     - a sentence from somewhere else, with its source
     - ``sds-quote``
   * - ``button``
     - one press, and where it goes
     - ``sds-button``
   * - ``button-bar``
     - the presses of a page, in one row
     - ``.sds-actions``
   * - ``accordion``, ``accordion-item``
     - questions with their answers folded behind them
     - ``sds-accordion``
   * - ``steps``, ``step``
     - an instruction read from the top, numbered down one rail
     - ``sds-steps``
   * - ``facts``
     - a block of facts, scanned down the terms
     - ``sds-facts``
   * - ``register``, ``entry``
     - a list a reader cites: numbered, addressed, and the work it asks for
     - ``sds-register``
   * - ``example``
     - a piece of markup and, under it, what it renders as
     - ``sds-code`` in ``.sds-example``
   * - ``specimen``
     - a rendered card, at the size of its measurement
     - ``sds-embed``

Each of them draws an element of this system and takes that element's own
options, spelt the way the element spells them. So ``href`` links and
``src`` takes a file here as everywhere else, and what a component gains,
the directive gains with it. Every section below names the element it
draws, and :doc:`/frontend/components/index` is that element's reference.

Every example on this page stands once: the block is the body that drew
the thing under it, which is what ``example`` is for.

layout
======

Not a directive. A field at the top of a document, beside the navigation
title, and it decides which shape the page takes.

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
   Anything else, and a page with no such field, is the manual shape. The
   toctree in a rail on the left, the trail above the title, the text held
   to sixty-six characters.

Both shapes carry the same bar and the same footer, because a reader must
never have to work out which site they are on. The body changes.

.. note::

   A field is invisible only because something claimed it. One nobody
   claims renders as a definition list in the body, which is what a
   misspelt field looks like. ``:laoyut: marketing`` prints the word and the
   value above the title of a page that is still a manual.

hero
====

The opening claim of a marketing page, beside one decorative image. It goes
right after the document title, so the title stays the page's real heading,
browser title and source for navigation.

.. example:: The opening claim, beside its one image

   .. hero:: /_images/design-system-workbench.png

      The opening summary belongs inside the directive.

      A second paragraph can make the promise concrete.

The document title stands above it in the source and is not part of it. The
argument is the image source. The theme composes the split, the stack and
the figure it already has. At a narrow viewport that split becomes a column
by the rule of every other split in the system. Content after the hero and
before the next band stays part of the opening section.

.. confval:: alt
   :name: hero-alt
   :type: string
   :default: ""

   What the image shows, when it adds a meaning the copy lacks. Leave it out
   for a decorative illustration whose subject already has its name beside
   it.

band
====

A full-bleed section of a landing page. The ground runs edge to edge, and
the content inside keeps the page measure.

.. example:: A band on a manual page, which is the page you are on

   .. band:: This heading is a band, on a manual page
      :quiet:
      :id: a-band

   And the paragraph after it, beside the section
   rather than inside it. What follows a band
   belongs to it on a page built out of bands.
   This page is not one.

On a page whose layout is not ``marketing``, that is the whole of it: a
section inside the column, not a ground edge to edge. The page decides the
shape a band takes, not the band.

**A band does not wrap a page in itself. It opens one.** What follows belongs
to it until the next band starts. What stands before the first one is a
band as well: a page opens on the canvas. That is the whole syntax, and it
has a reason beyond a tidy source.

A band is full-bleed and takes the page inset itself. So a band inside another indents its text by a gutter nobody
asked for, and stops at the width of its parent.

.. code-block:: text

   .. band:: What it costs
      :quiet:
      :id: pricing

   Everything from here, up to the next band.

   .. band::

   And this is back on the canvas.

That one is a print, not a render, and it is the only source on this page
that is. What a band does with the content after it happens where the page
is bands. Here it renders as two sections with the text loose between them,
which is what the example above shows.

A page with no band at all is the single band it looks like.

.. confval:: quiet
   :type: flag

   The second ground. Quiet and plain in turn make a run of bands read as a
   sequence, not as a wall. Two bands in a row share one hairline.

.. confval:: id
   :type: string

   An anchor, so a link elsewhere on the site can land on this section.

.. confval:: the heading
   :type: string

   The band's argument. It is an option and not a section heading, because
   a section heading inside a directive is not one. reStructuredText parses
   sections at document level. A line with ``====`` under it, written in
   here, ships both the line and the equals signs as text.

The landing page of :doc:`the example project <example>` is the same
directive at home, with the run of them at work.

grid
====

A set read side by side, reflowed by its own minimum width.

.. example:: A set of two, on this page

   .. grid::

      .. card:: What it is
         :href: /guides-theme/index
         :tag: Overview

         A badge above the title, and the whole
         card lit at the top of its frame under
         the pointer. A paragraph long enough to
         decide how tall this row is. That is the
         only thing the card beside it has to
         agree with.

      .. card:: What it costs
         :href: /guides-theme/installation
         :tag: Installation

         One Composer package.

No column count, and that is the design. Three across on a desk, two on a
tablet, one on a phone, from how narrow an item can get, not from a
breakpoint. It holds cards, figures, or anything else read as a set. Each
item draws itself, and the grid decides how many stand in a row.

The two above differ in length on purpose. A set whose items say the same
amount cannot show what the wall does. The short one draws to the row, not
to its own sentence. The element is ``sds-grid`` in
:doc:`/frontend/components/content`.

.. confval:: the argument
   :name: grid-variant
   :type: default | wide | dense | flush

   How much room one item needs, said as what the items hold, not as a
   number. ``wide`` for a card with a picture and a paragraph, ``dense`` for
   a figure or a name and a glyph. ``flush`` takes the gutter out, so the
   set shares a hairline and reads as one wall. Without it the set gets the
   width every set gets. A name the element does not define falls back, and
   does not pass through. ``:variant:`` says the same thing as an option.

.. confval:: class
   :name: grid-class
   :type: string

   Carried onto the element. An author who wrote it meant it for their own
   stylesheet, and a theme must not drop what it does not understand.

split
=====

Two of anything, side by side until there is no room for two.

.. example:: A picture beside the sentences it is of

   .. split::
      :align: center

      A paragraph and a picture are two blocks,
      so they stand as two columns and nothing
      here says which is which.

      .. figure:: /_images/design-system-workbench.png
         :alt: The workbench, beside the paragraph

**Every block in it is a column.** That is the whole rule, and why the
example above needs nothing to mark its halves. A paragraph is one block,
and a figure is another. The moment a side is a heading, its paragraph and
a press, those are three columns, unless something says where the side
ends. ``half`` is that something.

No width and no count anywhere. The halves fold under each other by their
own minimum, the way every set in this system reflows. The class is
``.sds-split`` in :doc:`/frontend/layout`.

.. confval:: align
   :name: split-align
   :type: start | center | end

   Where the shorter half stands against the taller one: at the top, level
   with it, or at the foot. ``start`` is the default, and ``center`` is what
   a line beside a picture usually wants.

.. confval:: leads
   :name: split-leads
   :type: start | end

   Which half comes first once the two have stacked. ``start`` is the
   written order. ``end`` puts the second half above the first. A picture at
   the end of the line on a page, and above the sentence it illustrates on a
   phone. It changes nothing while the two fit side by side. The order a
   reader reads is not the source order at every width, and the layout
   cannot work that one out itself.

.. confval:: class
   :name: split-class
   :type: string

   Carried onto the split, for the reason the grid's is.

half
====

One side of a split: the blocks that stand together as one column.

.. example:: A side of several blocks, beside a side of one

   .. split::
      :leads: end

      .. half:: Two paragraphs, one side

         This is the first of them, and it is not a
         column.

         This is the second. Without the ``half``
         around both, it is one.

      .. half::

         .. figure:: /_images/design-system-workbench.png
            :alt: The workbench, read before the text on a phone

It takes no position of its own. The split decides where a half stands,
because the other half is what it stands against. Anywhere else it is the
blocks it holds, in the rhythm a page keeps between them. Its optional
argument becomes an ``h2`` inside the column. Use it when the heading names
that side, not both sides of the split. A reStructuredText section heading
has no place inside a directive.

.. confval:: class
   :name: half-class
   :type: string

   Carried onto the column, for the reason ``split`` carries it.

card
====

One card: a title that goes somewhere, and what is behind it.

.. example:: One card, carrying everything a card can

   .. card:: :doc:`installation`
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

   A glyph above the label, for a set a reader tells apart before a read.
   The name is an icon of this system; see :doc:`/design-system/icons`.

.. confval:: src
   :name: card-src
   :type: string

   The picture, flush at the top of the card. The render copies a path in
   the documentation source into the output and resolves it per page. A URL
   somewhere else stays as it is. Either way it is one ``<img>``, so a
   drawing arrives in the colours its file declares.
   :doc:`/design-system/artwork` says why, and what the file has to be ready
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

.. confval:: class
   :name: card-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The title carries the target.** ``.. card:: :ref:`Introduction
<introduction>``` is how a TYPO3 manual writes a card. The words of the
reference become the heading, and the reference becomes where the card
goes. A plain title with ``:href:`` says the same thing the other way round.

**The whole card is the link, and there is exactly one.** The title's anchor
stretches over the frame. So a screen reader announces the title, while a
pointer hits the card. A second anchor inside it is a second destination
under one frame, which is why there is no option for a button. A link in
the prose of a card still works, and is a card that asks to be two cards.

**The options are ``sds-card``'s properties, all of them, spelt the way the
element spells them.** A directive that draws a component and answers for
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
not the card's own; see :doc:`markup`.

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

.. confval:: icon
   :name: stat-icon
   :type: string

   A glyph on the figure's line, before the number. Muted and never in a
   status colour, for the reason a card's is. A figure is a subject, not a
   result.

.. confval:: class
   :name: stat-class
   :type: string

   Carried onto the element, for the reason the grid's is.

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

swatch
======

One colour of a palette: the chip, its name, and what it resolves to.

.. example:: A palette, at the width a colour holds

   .. grid:: wide

      .. swatch:: var(--accent)
         :name: --accent
         :resolved: #FF8700

      .. swatch:: var(--text-primary)
         :name: --text-primary
         :resolved: light-dark(#1C1A17, #EDE9E2)

      .. swatch:: var(--border-subtle)
         :name: --border-subtle
         :resolved: light-dark(#E3DFD6, #2B2823)
         :kind: line

.. confval:: the argument
   :name: swatch-value
   :type: string
   :required: true

   What paints the chip: a token as written, ``var(--accent)``, or a literal
   where the value belongs to a mode the page is not in. It is the argument
   because it is what the line is about. **Anything that is not a colour
   drops out, and nothing paints it.** The value arrives from a document,
   and a style attribute is not where a theme finds out what it is.

.. confval:: name
   :name: swatch-name
   :type: string

   The name of the colour. The token where there is one, because that is
   the name a design writes. The human name where the palette has no
   tokens.

.. confval:: resolved
   :name: swatch-resolved
   :type: string

   What that name resolves to, in full. A token alone documents half the
   system. The value is the half that says what the mode did with it, and a
   pair stands as the pair: ``light-dark(#FFFFFF, #171614)``.

.. confval:: kind
   :name: swatch-kind
   :type: string

   ``fill`` (the default) or ``line``. A hairline is a colour too and cannot
   show as a fill. At one pixel a value is invisible, and as a fill it is a
   different job by the same number. ``line`` makes the chip its own edge,
   with the page's ground inside it.

.. confval:: class
   :name: swatch-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**There is no body.** A colour that needs a paragraph carries a rule about
where it can appear. That rule is prose beside the palette, not inside one
entry of it.

**A palette is a set**, so it goes in ``grid`` like any other. At ``wide``,
the width a name and a ``light-dark()`` pair under it hold. The element is
``sds-swatch`` in :doc:`/frontend/components/content`.

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

   A glyph above the label, where a reader tells a set apart before a read.
   It stands beside the plane's own title, never alone, and takes the muted
   ink for the reason a card's does. A plane is a subject, not a result.

.. confval:: class
   :name: surface-class
   :type: string

   Carried onto the element, for the reason the grid's is.

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

.. confval:: class
   :name: quote-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The sentence goes between the tags**, because out of a document it carries
links and emphasis, which an attribute cannot hold. A block quote is the
spelling to reach for, and it is not available. The parser resolves an
indented block with an attribution line into a definition list, so
``<blockquote>`` never reaches a template. This directive is how a manual
quotes anything. The element is ``sds-quote`` in
:doc:`/frontend/components/content`. The attribution it draws is
``sds-byline``, which is why there is no option here for the order of that
row.

button
======

One press, and where it goes.

.. example:: One press on its own, and the one beside it

   .. button:: :doc:`installation`
      :icon: actions-download

   .. button:: The renderer
      :href: https://docs.phpdoc.org/components/guides/guides/
      :variant: secondary
      :rel: external

.. confval:: the argument
   :name: button-label
   :type: string
   :required: true

   The label, and where the press goes with it. As a reference, a ``:doc:``
   or an external link, the words are the label and the reference is the
   target. A card's title carries the same thing. It is the argument
   and not an option because it is what the control says.

.. confval:: href
   :name: button-href
   :type: string

   The target as a path instead, and it wins where both stand.

.. confval:: variant
   :name: button-variant
   :type: string
   :default: "primary"

   ``primary``, ``secondary`` or ``ghost``. One primary per view. A second
   makes neither of them mean anything.

.. confval:: size
   :name: button-size
   :type: string
   :default: "md"

   ``sm`` for the smaller control, a press beside a line of text, not under
   a section. ``lg`` for the one action a page is for. Beside a second large
   button neither is the one, and that is what ``md`` is for.

.. confval:: icon
   :name: button-icon
   :type: string

   A glyph before the label, an icon of this system; see
   :doc:`/design-system/icons`.

.. confval:: icon-only
   :type: flag

   The glyph is the whole control, and the button is a square. It needs a
   name, and the label is it. The words become the control's title and do
   not draw.

.. confval:: title
   :name: button-title
   :type: string

   The control's name where the label does not say it, and what a pointer
   at rest on it reads.

.. confval:: rel
   :name: button-rel
   :type: string

   What the target is to this page: ``external``, ``prev``, ``next``. Only
   with a target, as the anchor's own attribute.

.. confval:: disabled
   :type: flag

   The control is there and takes no press. It drops where the press goes
   somewhere. A link has no disabled state, and a grey one the browser
   follows anyway is worse than none.

.. confval:: class
   :name: button-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**A press on a rendered page is a link.** With somewhere to go, the element
draws an ``<a>``. That gives the reader the middle click, the hover target
and the status line the browser already has. A control with a listener has
none of them.

A button with nowhere to go does nothing on a press. So ``type``, ``for``
and ``command`` are not on offer. A document has no form
to submit and no element to command, and a page that needs them is an
application, not a manual.

**The label is the words, not the markup.** A reference rendered where it
stands puts a link inside the control. The reference becomes the control's
target instead. That is the trade the card makes with its title, and why
both come off the node, not out of a template.

The element is ``sds-button`` in :doc:`/frontend/components/controls`, with
the properties this leaves out and the ones above.

button-bar
==========

The controls of a page, in one row.

.. example:: The presses of a page, on one line

   .. button-bar::

      .. button:: :doc:`installation`

      .. button:: The renderer
         :href: https://docs.phpdoc.org/components/guides/guides/
         :variant: secondary
         :rel: external

.. confval:: class
   :name: button-bar-class
   :type: string

   Carried onto the row, for the reason the grid's is.

Named for what it holds and the shape it holds them in. A row of controls
is layout, not a component, so it has no variant. What stands in it sits on
one line, centred against each other, which is what a link beside a button
needs. It holds whatever a page puts in it, and
one press in it is the primary. It emits ``.sds-actions``, the row in
:doc:`/frontend/layout`, written by the theme the way ``band`` writes its
section.

directory-tree
==============

A directory, in the shape it has on disk, in the spelling a TYPO3 manual
already uses. So a page written for the other theme renders here as it is.

A nested list, because that is what a tree is. **The name is the first
literal in an item, and the rest of the line is what it is for.** A filename
is a literal anyway, and prose after it is prose about it, so there is no
syntax of this directive's own to learn. An item with no literal is a name
and nothing else.

.. example:: What a project renders from, and what it gets back

   .. directory-tree::
      :level: 2

      * ``docs/`` the sources, as a project already writes them

        * ``Index.rst``
        * ``guides.xml`` the theme, the mark and the versions

      * ``site/`` what the render writes, and what is published

        * ``index.html``
        * ``styles/`` the drop-in, copied there by the finishing step

          * ``soul.css``
          * ``soul.js``

The fold is ``<details>``, so it works before a script runs and
find-in-page opens the directory it lands in. This replaces the tree as a
text block with its notes lined up with spaces. That alignment goes wrong
the moment one name changes by a character, and a reader with a narrow
window never sees it straight.

.. confval:: level
   :name: directory-tree-level
   :type: integer
   :default: 2

   How deep it stands **open**. Nothing drops below it. What is deeper
   folds, which a reader can undo. A level past the depth of the tree opens
   the whole of it.

   The theme this spelling comes from stops the *draw* below the level
   instead. That takes away what a reader came for and gives them no way to
   ask for it. A page that set it for that reason still renders here, with
   the deep part folded, not gone.

.. confval:: show-file-icons
   :name: directory-tree-show-file-icons
   :type: flag

   Mark a directory and a file as such. Off by default. The fold says which
   is which wherever there is anything to fold, and a wall of glyphs down a
   short tree is decoration. The slash in its name tells an empty directory
   apart.

.. confval:: class
   :name: directory-tree-class

   Passed to the element, for the surface that has to place one.

accordion
=========

Questions with their answers folded behind them, in the spelling a TYPO3
manual already uses.

.. example:: A set of two, one of them open

   .. accordion::
      :group: what-a-theme-answers

      .. accordion-item:: What does it need installed?
         :open:

         PHP 8.2 or newer, and a project it can read —
         see :doc:`installation`.

      .. accordion-item:: Can it run in CI?

         Yes. :doc:`publishing` is the job, command for command.

.. confval:: group
   :name: accordion-group
   :type: string

   The set's name. It is the group the answers fold in, so one open closes
   the last. A page with two sets gives them different names, or one closes
   the other's answers. A set with none gets one.

   It is ``:group:`` and not ``:name:`` because an answer takes ``:name:``
   in the meaning every other directive gives it: the address of a link.
   One spelling for both is two meanings a page apart.

.. confval:: multiple
   :type: flag

   More than one answer open at a time, for a set whose answers a reader
   compares. Without it a set is exclusive, because a list is easier to read
   than a wall.

.. confval:: class
   :name: accordion-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The fold is a** ``<details>``. It works before a script runs, the keyboard
reaches it, find-in-page opens the answer it lands in, and the platform
closes the others. That is why the answers carry the set's name, and why a
page never writes one on an item. The element is ``sds-accordion`` in
:doc:`/frontend/components/navigation`.

accordion-item
==============

One question, and the blocks folded behind it.

.. example:: One question on its own, standing open

   .. accordion-item:: What does it need installed?
      :open:

      PHP 8.2 or newer, and a project it can read.
      No daemon, and no database of its own.

.. confval:: open
   :type: flag

   Open at the start. For the first answer on a page of them, usually, so
   the shape of an answer shows without a press. ``:show:`` is the same flag
   under the name the Bootstrap theme gave it.

.. confval:: header-level
   :name: accordion-item-header-level
   :type: integer

   Accepted and dropped. A control folds a set of questions, not a heading,
   so it takes no level in the outline.

.. confval:: name
   :name: accordion-item-name
   :type: string

   The address of this one answer, for a page that links to it. It stands
   on the answer, not on the question. The platform opens a fold whose
   content a fragment points into. One a fragment points at stays shut,
   which is why a link that has to show the answer aims inside it. The
   reader still arrives at the question. The answer keeps the head's height
   as scroll margin, so the row stands at the line and not behind the bar.

.. confval:: class
   :name: accordion-item-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The question is the argument, and the answer follows it.** That is not a
preference. An answer is paragraphs, lists and code blocks, which no
attribute carries. The node is ``sds-accordion-item`` itself, and the
template writes none of its markup, the same arrangement as the cards
above.

facts
=====

A block of facts, scanned down the terms. The body is a field list, which
is the shape a name-and-value pair already has in the source.

.. example:: The facts of a change

   .. facts::

      :Change: `1482 <https://example.org/c/1482>`__ · patch set 2
      :Target: ``main`` · ``2.4``
      :Read: 2026-09-11, in a worktree of its own

The field's name is the term and its body the value, and a value carries a
link, a literal or a badge. The element is ``sds-facts`` in
:doc:`/frontend/components/data`.

.. confval:: class
   :name: facts-class
   :type: string

   Carried onto the element, for the reason the grid's is.

register
========

A list a reader cites: numbered, addressed, and scanned at a glance first.
The entries stand in the body in any order. The register numbers them when
the page renders, sorts them into their groups, and writes every one into
one table first. Every entry with a ``:todo:`` goes into a second table, the
work the list asks for. No line of the document says a number.

.. example:: A review's findings, two of them

   .. register::
      :name: findings
      :prefix: F
      :todo-prefix: T
      :findings:

      .. entry:: The unit suite for the lookup fails
         :group: blocks
         :origin: introduced by this change
         :todo: Adapt the four tests that expect the second read.

         Every case that resolves one key twice fails.

      .. entry:: The key stays the file's own identifier
         :group: ok

         Checked against a catalogue with a dotted key.

.. confval:: name
   :name: register-name
   :type: string
   :default: "register"

   What the group sections and the entries' addresses start with,
   ``findings-blocks`` and ``findings-1-1``, so two registers on one page
   keep apart.

.. confval:: prefix
   :name: register-prefix
   :type: string

   What stands before every entry's number, ``F`` for findings. Nothing
   unless the register says so: an entry is ``1.1`` by itself.

.. confval:: todo-prefix
   :name: register-todo-prefix
   :type: string

   What stands before the number of what is to do, ``T`` for the work a
   finding asks for.

.. confval:: findings
   :name: register-findings
   :type: flag

   The four groups of a review's findings, in the order a review reads
   them: *Blocks submission*, *Sent back*, *Worth a change*, *Checked and
   correct*. Their keys are ``blocks``, ``back``, ``change`` and ``ok``.

.. confval:: groups
   :name: register-groups
   :type: string

   Any other set of groups, as the JSON the element takes:
   ``[{ "key": "…", "heading": "…", "label": "…", "tone": "…" }]``. An
   entry whose group the register does not name stands last, in the order
   written. Without groups the entries count up as written.

.. confval:: class
   :name: register-class
   :type: string

   Carried onto the element, for the reason the grid's is.

The element is ``sds-register`` in :doc:`/frontend/components/content`,
which says how it numbers and what it draws.

entry
=====

One entry of a register. Its title is the argument, what it holds the
body, and everything that fits in a string an option.

.. example:: One entry, on its own

   .. entry:: The reader is a new instance per call
      :group: change
      :origin: older than the change
      :todo: Construct the reader once, in the constructor.

      The service is a singleton, so one reader in the constructor is the
      same object with one construction fewer per label.

.. confval:: group
   :name: entry-group
   :type: string

   The key of the group it belongs to, for the register that groups.

.. confval:: origin
   :name: entry-origin
   :type: string

   Where it came from, in a few words: ``introduced by this change``,
   ``older than the change``.

.. confval:: todo
   :name: entry-todo
   :type: string

   What is to do about it, in one sentence. It stands as the entry's last
   line, and the register lists it with the work of the other entries.

.. confval:: name
   :name: entry-name
   :type: string

   The address of this one entry, where the register's own, made from the
   number, is not the one a page wants to cite.

.. confval:: class
   :name: entry-class
   :type: string

   Carried onto the element, for the reason the grid's is.

steps
=====

An instruction read from the top, numbered down one rail.

.. example:: Three stops, one of them skippable

   .. steps::

      .. step:: Require the package

         It brings the renderer, the highlighter and the Markdown parser with
         it, so this one line is all four.

      .. step:: Select the theme

         ``theme="soul"`` in ``guides.xml`` names it, and the ``<extension>``
         element is what makes it exist — see :doc:`installation`.

      .. step:: Draw the signet
         :optional:

         A project with no mark takes its title in the bar, which is where a
         name belongs when there is only one.

.. confval:: class
   :name: steps-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**No option numbers a stop, and there is none to add.** The number is the
set's own count. So a step in the middle renumbers everything under it, and
no page changes in two places. That is the whole reason to write a set, not
four paragraphs with a typed figure each. For the same reason nothing here
says how far along a reader is. A rendered page does not know, and a manual
that guessed is wrong for every reader but one.

Use it where the order is the point. Things to do in any order are a bullet
list. A numbered list from ``#.`` is the right shape for steps of one line
each. This one is for stops with a command, a file to edit and the output
that says it worked. The element is ``sds-steps`` in
:doc:`/frontend/components/content`.

step
====

One stop of an instruction, and the blocks that do it.

.. example:: One stop, with the work under it

   .. steps::

      .. step:: Render the site
         :name: render-the-site

         The first command writes documents; the second turns them into a site.

         .. code-block:: bash

            vendor/bin/guides docs --output=site -c docs --fail-on-error

It stands inside a ``steps``, and that is not a formality. A stop draws a
number, and a number is a place in a set. A step anywhere else is the
blocks it holds, the way a ``half`` outside a ``split`` is the column it
was going to be.

.. confval:: optional
   :type: flag

   A stop a reader can skip. The disc stays unfilled, and the word stands
   beside the title. An unfilled ring says nothing to a reader who cannot
   see it, so the drawing is never the whole claim.

.. confval:: name
   :name: step-name
   :type: string

   The address of this one stop, for a page that links to it, as ``:name:``
   means everywhere else. It lands on the stop itself, and nothing has to
   open first. A step has no fold, which is the one thing that made
   ``accordion-item`` put its address on the answer instead.

.. confval:: class
   :name: step-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The title is the argument, and the work follows it**, for the reason a
question and its answer stand that way. A command, a file to edit and the
line that says it worked are what no attribute carries. The title takes no
heading level either. The number says where a reader is in an instruction,
and a page whose outline is its steps has buried its own sections.

example
=======

What the author wrote, and under it what it renders as, out of one body.

.. example:: An example, shown by an example

   .. example:: A press, and where it goes

      .. button:: :doc:`installation`
         :icon: actions-download

**The block a reader copies is the block that ran.** A page that prints
markup in a ``code-block`` and writes it a second time to render it holds
two copies of one example. The copy nobody checks is the one the reader
takes away. Here the print is the lines the parser got, and the render
comes from those same lines, so the two cannot part. ``specimen`` below
does that for a card, a level up.

.. confval:: the argument
   :name: example-caption
   :type: string

   The caption over the block: what this one shows. Without it the block
   carries nothing but its language and the button that copies it.

.. confval:: language
   :name: example-language
   :type: string
   :default: "text"

   The colour of the print. ``text`` by default, because no highlighter on
   this site knows reStructuredText, and a language the server cannot
   colour is better said than faked. A project whose examples are in
   something it does know says so here.

.. confval:: class
   :name: example-class
   :type: string

   Carried onto the frame the render stands in, for the reason the grid's
   is.

**The frame has a dashed line, the only one in the system.** That is what
it is for. A solid one is a box on the page. What is inside this one is not
part of the page: a thing shown, at the end of a run of things read. It is
``.sds-example``, and it has no fill either. So a card or a surface in it
stands on its real ground, not on a plane the manual put under it.

The options are not in the print, because the parser has taken them off the
body by the time the directive sees it.

**What an example cannot show is a page.** The frame is a box in the column.
So a band inside one is the section a band is on a manual page, not the
full-bleed ground of a marketing one. That is what the band above is in an
example to show.

What follows a band belongs to it only where the page is bands. So a source
that opens two of them renders here as two sections with
the text loose between them. That one stays a ``code-block`` beside prose
that says so. ``:layout:`` is a field, not a directive, and has nowhere to
go in a body.

specimen
========

A rendered card, at the size of its drawing.

.. example:: The same file Storybook opens, and the design pane exports

   .. specimen:: guidelines/colors-surfaces.card.html
      :viewport: 700x277
      :title: Surfaces

.. confval:: the card
   :type: string
   :required: true

   The directive's argument: a path under ``_cards/`` in the documentation
   source. The card is a whole document with a stylesheet of its own, so it
   stands in a frame, not inline. It carries the specimen chrome, which a
   page must not inherit, and it can pin its own mode.

.. confval:: viewport
   :type: string
   :default: "700x260"

   Width by height, in pixels, and it is not decoration. Every card
   declares the size of its measurement in its own ``@dsCard`` header, and
   the gate proves it still fits there. A card at any other size documents
   something nobody checked.

.. confval:: title
   :type: string
   :default: "Specimen"

   The caption under the frame, beside the viewport. It is also the frame's
   accessible name, the only thing a reader who cannot see the card gets.

The frame is an ``sds-embed``, the element in
:doc:`/frontend/components/media`, fixed at the viewport above. Where the
column is narrower it scrolls, and does not squeeze the card into a width
nothing measured. :doc:`markup` has the other half of that node: a video,
the same directive's opposite, which fills the column instead.

The cards have to be inside the documentation source. The renderer copies an
asset a document points at and nothing else. This repository's ``make
guides`` copies ``specimens/`` into ``docs/_cards/`` before each render and
rewrites the stylesheet links inside each card on the way. That directory
is a task's output, and git ignores it.

.. important::

   This directive is for a project that ships rendered cards of its own. It
   makes a guideline page show the rule instead of a description of it. It
   is the reason the guidelines in this manual and the specimens in
   Storybook cannot say different things: they are the same file.

.. seealso::

   :doc:`markup` for what the renderer's own directives, admonitions, code
   blocks, tabs, ``confval``, topics, come out as under this theme.
