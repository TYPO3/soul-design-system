:navigation-title: Directives

==========
Directives
==========

The directives this theme adds to what an author can write, and the document
field. They are registered by the extension, so a project that selected the
theme can use them immediately — there is nothing to add to ``guides.xml`` and
no template to copy.

``layout``, ``hero``, ``band`` and ``grid`` build a landing page: a page of a
different shape than a manual page, and the renderer has no vocabulary for it.
``card`` and ``accordion`` signpost a manual and fold its answers away, each
spelled the way a TYPO3 manual already spells them.
``stat`` states a figure, ``surface`` states a sentence and ``quote`` borrows
one, ``button`` and ``button-bar`` are how a page sends a reader on,
``example`` shows a piece of markup and what it renders as, and ``specimen``
embeds a rendered card at the size it was measured at.

Each of them draws an element of this system and takes that element's own
options, spelt the way the element spells them — so ``href`` links and ``src``
takes a file here as everywhere else, and what a component gains the directive
gains with it. Every section below names the element it draws, and
:doc:`/frontend/components/index` is where that element's own reference is.

Every example on this page is written once: the block is the body that drew
the thing under it, which is what ``example`` is for.

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

.. example:: The opening claim, beside its one image

   .. hero:: /_images/design-system-workbench.png

      The opening summary belongs inside the directive.

      A second paragraph can make the promise concrete.

The document title stands above it in the source and is not part of it. The
argument is the image source. The theme composes the existing split, stack
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

.. example:: A band on a manual page, which is the page you are on

   .. band:: This heading is a band, on a manual page
      :quiet:
      :id: a-band

   And the paragraph after it, beside the section
   rather than inside it: what follows a band
   belongs to it on a page built out of bands,
   and this page is not one.

On a page whose layout is not ``marketing``, that is the whole of it — a
section inside the column rather than a ground running edge to edge, because
the shape a band takes is the page's to decide and not the band's.

**A band does not wrap a page in itself, it opens one.** What follows belongs
to it until the next band starts, and what stands before the first one is a
band as well — a page opens on the canvas. That is the whole of the syntax,
and it has a reason beyond looking tidy in the source: a band is full-bleed and
takes the page inset itself, so a band nested in another indents its text by a
gutter nobody asked for and stops at the width of its parent.

.. code-block:: text

   .. band:: What it costs
      :quiet:
      :id: pricing

   Everything from here, up to the next band.

   .. band::

   And this is back on the canvas.

That one is printed rather than shown, and it is the only source on this page
that is: what a band does with the content after it happens where the page is
built out of bands, so rendered here it would be two sections with the text
loose between them — which is what the example above is showing.

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

The landing page of :doc:`the example project <example>` is the same directive
where it is at home, with the run of them doing what the source says.

grid
====

A set read side by side, reflowing by its own minimum width.

.. example:: A set of two, on this page

   .. grid::

      .. card:: What it is
         :href: /guides-theme/index
         :tag: Overview

         Two sentences, a badge above the title,
         and the whole card lit at the top of its
         frame under the pointer.

      .. card:: What it costs
         :href: /guides-theme/installation
         :tag: Installation

         One Composer package, one copy step, and
         a document called ``index`` at the root.

No column count, and that is the design: three across on a desk, two on a
tablet, one on a phone, decided by how narrow an item may get rather than by a
breakpoint somebody picked. It holds cards, figures, or anything else read as
a set — each item draws itself and the grid only decides how many stand in a
row. The element is ``sds-grid`` in :doc:`/frontend/components/content`.

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
everywhere else. What the element gains, this gains — its reference is
``sds-card`` in :doc:`/frontend/components/content`.

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
row of numbers on a page is not a row of boxes. The element is ``sds-stat``
in :doc:`/frontend/components/content`, beside the grid it stands in.

surface
=======

One filled plane, stating something in place.

.. example:: Two planes, read across each other

   .. grid::

      .. surface:: Read, never write
         :icon: actions-file-shield

         Every source is read. Nothing is written back.

      .. surface:: One answer, one origin
         :label: Rule 02

         Two answers that disagree are told apart by
      where they came from.

.. confval:: the argument
   :name: surface-heading
   :type: string
   :required: true

   The title of the plane, in the quieter register — this is not a
   destination, and a title that looks like one is a promise the box does not
   keep.

.. confval:: plane
   :name: surface-plane
   :type: string

   The fill: ``raised``, which sits on the canvas and reads as a plane, or
   ``sunken``, which is machine output — code, logs, structured content. Named
   for the fill because in a system with no shadows that is what tells two
   planes apart. ``raised`` is what a plane writing nothing is.

.. confval:: label
   :name: surface-label
   :type: string

   The tracked-out line over the title, where a set is numbered or sourced —
   ``AUDIENCE 01``, ``SOURCE``, ``STEP 02``. Over the title rather than in it:
   a title carrying its own number reads as part of the sentence.

.. confval:: icon
   :name: surface-icon
   :type: string

   A glyph above the label, where a set is told apart before it is read. It
   stands beside the plane's own title, never alone, and is muted for the
   reason a card's is: a plane is a subject, not a result.

.. confval:: class
   :name: surface-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**A plane states, a card goes somewhere.** That is the whole line between the
two, and it decides which one a page wants: a card's frame is the link and its
title is the anchor, so a set of planes claims nothing to click. Neither is
what ``.. topic::`` is — a digression in the reading flow that the outline does
not list stays an ``<aside>``, and is not one of a set.

**It goes in a** ``grid`` **like any other set**, at the width the statements
hold. A plane on its own is a plane in the flow and renders, but a single one
says nothing the paragraph above it did not. The element is ``sds-surface`` in
:doc:`/frontend/components/content`.

quote
=====

A sentence borrowed from somewhere, with where it came from.

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

   Who said it — a person, a document, a release note. It is the argument and
   not an option because the element requires it: an unattributed quotation in
   a product's own writing reads as the product quoting itself for emphasis,
   and a required thing said as an option is a thing that gets left out.

.. confval:: as
   :name: quote-as
   :type: string

   What they are to the subject, where the name alone does not say it — a
   maintainer, a reviewer, the documentation. Spelt ``as`` and not ``role``,
   because ``role`` is the global ARIA attribute and would claim a role that
   does not exist.

.. confval:: meta
   :name: quote-meta
   :type: string

   When, and anything else in the label register: a date, a release, a
   revision.

.. confval:: initials
   :name: quote-initials
   :type: string

   Their initials, and the monogram is drawn only where they are given. A
   byline derives them from a name; a quotation does not, because half of what
   is worth quoting is a document — and a monogram of a filename is a person
   invented for a source that has none.

.. confval:: href
   :name: quote-href
   :type: string

   Where it can be read in full; the attribution becomes that link. A target
   pointing out of the site is left as it stands, and one pointing into it is
   resolved like any other reference.

.. confval:: class
   :name: quote-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**The sentence goes between the tags**, because out of a document it carries
links and emphasis, which an attribute cannot hold. A block quote would be the
spelling to reach for and it is not available: the parser resolves an indented
block with an attribution line into a definition list, so ``<blockquote>``
never reaches a template — this directive is how a manual quotes anything at
all. The element is ``sds-quote`` in :doc:`/frontend/components/content`, and
the attribution it draws is ``sds-byline``, which is why there is no option
here for the order of that row.

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

   The label, and where the press goes with it. Written as a reference, a
   ``:doc:`` or an external link, the words are the label and the reference is
   the target — the way a card's title carries the same thing. It is the
   argument rather than an option because it is what the control says.

.. confval:: href
   :name: button-href
   :type: string

   The target said as a path instead, and it wins where both are written.

.. confval:: variant
   :name: button-variant
   :type: string
   :default: "primary"

   ``primary``, ``secondary`` or ``ghost``. One primary per view: a second
   makes neither of them mean anything.

.. confval:: size
   :name: button-size
   :type: string
   :default: "md"

   ``sm`` for the smaller control — a press beside a line of text rather than
   under a section.

.. confval:: icon
   :name: button-icon
   :type: string

   A glyph before the label, and it is an icon of this system — see
   :doc:`/design-system/icons`.

.. confval:: icon-only
   :type: flag

   The glyph is the whole control and the button is a square. It needs a name,
   and the label is it: the words become the control's title instead of being
   drawn.

.. confval:: title
   :name: button-title
   :type: string

   What the control is called where the label does not say it, and what a
   pointer resting on it reads.

.. confval:: rel
   :name: button-rel
   :type: string

   What the target is to this page — ``external``, ``prev``, ``next``. Only
   with a target, being the anchor's own attribute.

.. confval:: disabled
   :type: flag

   The control is there and cannot be pressed. It is dropped where the press
   goes somewhere: a link cannot be disabled, and a grey one the browser
   follows anyway is worse than none.

.. confval:: class
   :name: button-class
   :type: string

   Carried onto the element, for the reason the grid's is.

**A press on a rendered page is a link.** Given somewhere to go the element
draws an ``<a>``, which is what gives the reader the middle click, the hover
target and the status line the browser already has — none of which a control
with a listener on it has. A button with nowhere to go does nothing when
pressed, so ``type``, ``for`` and ``command`` are not offered: a document has
no form to submit and no element to command, and a page that needs them is an
application rather than a manual.

**The label is the words and not the markup.** A reference rendered where it
was written would put a link inside the control; the reference becomes the
control's target instead. That is the same trade the card makes with its
title, and it is why both are read off the node rather than in a template.

The element is ``sds-button`` in :doc:`/frontend/components/controls`, and it
has the properties this leaves out as well as the ones above.

button-bar
==========

The controls of a page, standing in one row.

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

Named for what it holds and the shape it holds them in. A row of controls is layout rather than a component, so it has no variant:
the whole of it is that what stands in it sits on one line, centred against
each other, which is what a link beside a button needs. It holds whatever a
page puts in it, and one press in it is the primary. What it emits is
``.sds-actions`` — the row in :doc:`/frontend/layout`, written by the theme
the way ``band`` writes its section.

accordion
=========

Questions with their answers folded behind them, in the spelling a TYPO3
manual already uses.

.. example:: A set of two, one of them open

   .. accordion::
      :name: what-a-theme-answers

      .. accordion-item:: What does it need installed?
         :open:

         PHP 8.2 or newer, and a project it can read —
         see :doc:`installation`.

      .. accordion-item:: Can it run in CI?

         Yes. :doc:`publishing` is the job, command for command.

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
the set's name and why a page never writes one on an item. The element is
``sds-accordion`` in :doc:`/frontend/components/navigation`.

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

example
=======

What was written, and under it what it renders as — out of the one body.

.. example:: An example, shown by an example

   .. example:: A press, and where it goes

      .. button:: :doc:`installation`
         :icon: actions-download

**The block a reader copies is the block that was run.** A page that prints
markup in a ``code-block`` and then writes it a second time to render it holds
two copies of one example, and the copy nobody checks is the one being taken
away. Here the print is made of the lines the parser was handed and the
rendering is parsed from those same lines, so the two cannot come apart —
which is what ``specimen`` below does for a card, a level up.

.. confval:: the argument
   :name: example-caption
   :type: string

   The caption over the block: what this one shows. Left out, the block
   carries nothing but its language and the button that copies it.

.. confval:: language
   :name: example-language
   :type: string
   :default: "text"

   What the print is coloured as. ``text`` by default because no highlighter
   on this site knows reStructuredText, and a language the server cannot
   colour is better said than faked; a project whose examples are written in
   something it does know says so here.

.. confval:: class
   :name: example-class
   :type: string

   Carried onto the frame the rendering stands in, for the reason the grid's
   is.

**The frame is dashed, and it is the only dashed line in the system.** That is
what it is for: a solid one would be a box on the page, and what is inside
this one is not part of the page — it is a thing shown, at the end of a run of
things read. It is ``.sds-example``, and it carries no fill either, so a card
or a surface in it stands on the ground it would really stand on rather than
on a plane the manual put under it.

The options are not in the print, because the parser has already taken them
off the body by the time the directive sees it.

**What an example cannot show is a page.** The frame is a box in the column,
so a band inside one is the section a band is on a manual page rather than the
full-bleed ground it becomes on a marketing one — which is what the band above
is in an example to show. What follows a band belongs to it only where the
page is built out of bands, so a source that opens two of them renders here as
two sections with the text loose between them, and that one stays a
``code-block`` beside prose that says so. ``:layout:`` is a field rather than
a directive and has nowhere to go in a body at all.

specimen
========

A rendered card, embedded at the size it was drawn for.

.. example:: The same file Storybook opens, and the design pane exports

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

The frame is an ``sds-embed`` — the element in
:doc:`/frontend/components/media` — fixed at the viewport above: where the
column is narrower it scrolls rather than squeezing the card into a width
nothing ever measured. :doc:`markup` has the other half of that node — a
video, which is the same directive's opposite and fills the column instead.

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
