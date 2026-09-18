:navigation-title: Screens

=======
Screens
=======

Whole surfaces, not components. Each one is a **Starting Point**. The design
system shows them as layouts to start a design from, so each is a complete
page, not a sketch.

An ``@startingPoint`` comment on the first line marks one: section, subtitle
and the viewport it renders at. That is the contract with the build that
ships it as a layout, and ``make verify`` enforces it. A screen is its own
thumbnail.

Every screen is a **live page** under **Pages** in the sidebar, in the group
its ``section`` names, and the files here are their static export. Open one
there and click through it. The rail folds, a pill answers, the tabs filter
the list, a form that fails says where, the mode switch moves the whole page. The test suite opens every
story, so a live page is a page under test. Static markup proves the layout
and nothing else.

One composition serves both. The branch appears only where the two differ.
A component that takes its content between the tags has no export, because
Lit's SSR emits authored children beside the element's own template. Those
use the markup function the element itself renders.

**A page is where this system finds out what it lacks.** Every page
below grew something, or proved that the vocabulary is complete. A gap closes
in the component and never in the page; see the list at the end.

Two shapes of page
==================

Every screen is one of two layouts, and the choice is not decoration.

**A page that reports** is ``sds-page``: one measure, one ground, sections
stacked down it. Right for an answer, a reference, a document. The reader
came for one thing, and the page stays out of the way. A list of its own
sections beside it is ``sds-body`` with an ``sds-nav-rail``.

**A page that argues** is ``sds-bands``: full-bleed sections whose *ground*
changes, contents held to one measure. Right where the parts are steps in an
argument, a pitch, then who it is for, then what it costs. Wrong everywhere
else: a change of ground that means nothing loses the reader's trust.

Site
====

The front of a product site. Every page here argues: it is ``sds-bands``,
and the ground changes where the argument takes a step. A reader arrives with
a question about the product and leaves with a decision.

The landing page
----------------

The first page a project shows: the pitch, the parts of the system, and how
to start. Every element on it is the real one. A change to a button or a code
block arrives here without an edit to this page.

.. specimen:: screens/landing.html
   :viewport: 1440x900
   :title: Landing

A feature in full
-----------------

The page a product site owes each claim. What the thing is, how it works,
what it changes, what it costs, and what it does **not** do. The last one is
the reason a reader trusts this page.

.. specimen:: screens/feature.html
   :viewport: 1440x900
   :title: Feature

The tour
--------

A feature presentation that is not three cards in a row. Cards compare: they
put four things beside each other for a reader to pick from. A reader reads
a tour in order, because the second step means nothing until the first one
has happened. So the steps alternate sides down the page, and the eye
crosses the column at every one. Each carries the picture of the thing it
describes, and a press opens it at full size.

.. specimen:: screens/tour.html
   :viewport: 1440x900
   :title: Tour

One audience
------------

The same software, argued to one audience. A landing page that tries to
convince three different people convinces none. So this page speaks to one
of them and says at the top which one. The way across is there for whoever
landed on the wrong one. This is the agency: not the buyer and not the
user, but who carries the thing for years after both have moved on. What
convinces them is what it costs them to keep.

.. specimen:: screens/audience.html
   :viewport: 1440x900
   :title: Audience

Which way to run it
-------------------

A comparison whose gaps are the point. A matrix with everything present
somewhere tells a reader nothing. Every mark carries the name of its column,
so the table reads without sight.

.. specimen:: screens/compare.html
   :viewport: 1440x900
   :title: Compare

What it costs
-------------

The page a marketing site gets wrong most reliably, in the same two ways.
The tiers are adjectives instead of what you get. And the question every
reader has, what happens when I stop the payment, has no answer anywhere.
Both answers stand on the page. Three tiers, and the middle one carries a
mark: not the one to sell, but the one most readers land on.

.. specimen:: screens/plans.html
   :viewport: 1440x900
   :title: Plans

One deployment
--------------

A reference page earns nothing unless a reader can check it. So the two
things that decide are near the top. Who this was, in figures a reader can
compare themselves against. And what it cost, the part that went wrong
included. A case study with no bad month reads as marketing. The headline
is the outcome rather than the name, because somebody who scans a list of
these looks for their own situation.

.. specimen:: screens/case-study.html
   :viewport: 1440x900
   :title: Case study

Who is behind it
----------------

Who answers for it, why it exists, who pays for it, and what happens if it
stops. No photographs: a face is a file to fetch, keep in step and licence,
and none of that names a maintainer.

.. specimen:: screens/about.html
   :viewport: 1440x900
   :title: About

Get started
-----------

The three questions a careful reader asks before they run somebody else's
code. Which file is mine, is it the published one, and what happens when it
does not answer. It needed no new component.

.. specimen:: screens/get-started.html
   :viewport: 1440x900
   :title: Get started

Docs
====

The reference a product ships. A page here reports: a column of text with
what a text needs, and the way through the set beside it.

The documentation surface
-------------------------

The one place where the documentation *is* the product presentation. A
visitor gets the pitch and scrolls into the reference without a seam. 210px
tool rail, a 1200px page measure, 48px gutters.

.. specimen:: screens/documentation.html
   :viewport: 1440x900
   :title: Documentation

The guideline
-------------

What a construction rule looks like on a page. The values a drawing has to
hold, the palette it can use, and the two grounds it has to survive.
Everything here is a fact somebody checks their own work against, so
nothing is prose that can be a number. No ground, no colour and no size
stands typed into the page. A guideline that hardcodes what it documents
stops being true the day the system moves.

.. specimen:: screens/guide.html
   :viewport: 1440x900
   :title: Guide

An article
----------

One column of text with what a text needs in it: a drawing, a borrowed
sentence, a block the machine wrote. Its contents stand beside it as
``sds-nav-rail``, because a table of contents is a list of links beside a
column.

.. specimen:: screens/article.html
   :viewport: 1440x900
   :title: Article

The reading page
----------------

The page that shows its own measure. Every other page is an archetype of
something a product needs; this one is the reference for the rhythm they
all follow. The registers stand under each other in one column, and each
block with a title stands beside one without. It holds one of everything,
because it is what ``make baseline`` and ``make diff`` read as the rhythm's
record.

.. specimen:: screens/reading.html
   :viewport: 1440x900
   :title: Reading

The questions
-------------

A list of questions, not a wall of answers. ``sds-accordion`` is a real
``<details>``, so the fold works before a script runs and find-in-page opens
the answer it lands in.

.. specimen:: screens/questions.html
   :viewport: 1440x900
   :title: Questions

The tool reference
------------------

The full tool surface at compact density: the least room a row reads in. Here
the list *is* the work, and a scan beats a read.

.. specimen:: screens/tool-reference.html
   :viewport: 1440x900
   :title: Tool reference

Catalog
=======

A set, and one thing out of it. A page here either shows the set narrowed
and paged, or the one entry a reader found in it.

The front door
--------------

The front door to a large set, and not a product pitch. A reader who
arrives here looks for one thing out of hundreds. So the first control is
the search, and the first thing under it is the set itself. What a page like
this owes is counts. An adjective is something anybody can write and a
reader cannot check; a figure they can.

.. specimen:: screens/library.html
   :viewport: 1440x900
   :title: Library

The catalog
-----------

Several hundred small, uniform things a reader arrives at with half the
name. A reader finds them by shape, so the wall is tiles and not cards. The
drawing is the box, and the identifier under it holds back until the shape
turns up. Search is the control at the centre of the page, and the set
comes in pages. The facets narrow the wall for real, and which items show
is the page's state, never the wall's.

.. specimen:: screens/catalog.html
   :viewport: 1440x900
   :title: Catalog

One entry
---------

One entry of a catalog, in full. What the reader came for is the identifier
and the confidence that this is the right one. So the name stands as the
machine text it is, and the item shows in both modes rather than on two
colours somebody typed in. Every ground here is the system's own, forced
onto a subtree. A page that hardcodes ``#ffffff`` has left the theme.

.. specimen:: screens/catalog-entry.html
   :viewport: 1440x900
   :title: Catalog entry

The list
--------

News, releases, references and search results are the same page with
different rows. It proves the set, not one entry, and the state a list page
usually skips: a filter that matches nothing, with how much it read.

.. specimen:: screens/news.html
   :viewport: 1440x900
   :title: News

The results
-----------

The query stays in the field, so a refinement is not a retype. The facets say
how many stand behind each, so a narrower search is a decision. A source that
answered with nothing says so.

.. specimen:: screens/search.html
   :viewport: 1440x900
   :title: Search

An answer
---------

An answer always carries its source, its version binding, and what it leaves
out. Every state in Guidelines → States carries exactly that.

.. specimen:: screens/answer.html
   :viewport: 1440x900
   :title: Answer

Service
=======

The pages a site owes its readers, and the page behind a row of a list. A
form that fails, a status that reports, a record in full, and the boundary a
wrong address meets.

The form
--------

Three states: the form, what it does when it fails, and what it says when it
worked. The failure matters most. A summary at the top, focused, each line a
link to its field. A mark on the box is enough for a reader who sees the
whole form, and nothing for one who does not.

.. specimen:: screens/contact.html
   :viewport: 1440x900
   :title: Contact

One record
----------

The page behind a row of the list. ``Components/Content/Table`` draws the
list and gives every row its way in; this is what the way in leads to.
It is the shape any record's page falls into. Its name, what a reader can
do to it, what it stands at, what it consists of, and what happened to it,
in that order.

Nothing here is a class of this page's own. A value somebody
copies is an ``sds-code`` block with its term as the caption. A list of
commits is a table.

.. specimen:: screens/checkout.html
   :viewport: 1440x900
   :title: Checkout

The status
----------

It reports **sources**, not a service: nothing here runs on a host. Two of the
sources are the reader's own machine, and the page says so instead of a blank.
The status colours carry the subject, and they still sit only in badges and
result rows.

.. specimen:: screens/status.html
   :viewport: 1440x900
   :title: Status

One source
----------

The page behind a row of the status list, and the only one with **work in
progress**. Every other surface reports something settled. A reader reads
this one while a job runs. A share above, the stops below, and what each one
wrote inside the stop that wrote it.

A layout finds out what it lacks only under a page that changes while it is
open. What does a stop still ahead offer? Where does the block a row opens
onto start? What marks the current row when both status colours already mean
something?

.. specimen:: screens/source.html
   :viewport: 1440x900
   :title: One source

What holds until when
---------------------

The page a self-hosted project cannot do without, and almost always a bare
table with colours in it. Two things fix most of it. The date the page was
last true, at the top where a reader meets it. And a phase that is a word
and a glyph rather than a fill. A support state in colour alone is one half
the readers cannot read.

The order is the reader's: what to run
now, how long each release has, what it needs, what is in progress. The
archive is last, because it is for an audit and not for a decision.

.. specimen:: screens/releases.html
   :viewport: 1440x900
   :title: Releases

What it reads and what it sends
-------------------------------

The page procurement reads, and the one place where an open project beats
a hosted one. Somebody who has the source can check every claim here. So the
page consists of things a reader can go and check, not of badges. An
address for reports, a named team, an advisory history, a stated retention.

The address comes first. On most pages of this kind it is a line in the
footer, where a researcher who found something gives up the search. Here it
is the first thing under the heading, because it is the only part of this
page with a deadline.

.. specimen:: screens/security.html
   :viewport: 1440x900
   :title: Security

The page that is not there
--------------------------

The address the reader asked for is the headline, the source that answered is
the lead, and the search field is the nearest real thing. Three named pages,
not a link to the front page. It keeps its chrome: a 404 without the header
has also lost the navigation.

.. specimen:: screens/not-found.html
   :viewport: 1440x900
   :title: Not found

Paper
=====

A document, not a page of a site. No bar and no footer, because nothing on
it leads anywhere else. Its frame is ``sds-paper``, and its contents stand in
the panel beside it.

A review
--------

The document a reviewer hands back. It is a document and not a page of a
site: no bar and no rail, because nothing on it leads anywhere else. Its head
is its own: what kind of review, the title, and the facts of the change in an
``sds-facts`` list.

The summary stands first, because that is what the author came for. It is
an ``sds-surface``: what the change does, and the recommendation with a link
to each finding it rests on. Under it four statements, one per weight, each
a sentence on a plain surface. Then the context, the mechanism, the error,
and the change as ``sds-diff`` with its paths traced in a table.

The findings are one ``sds-register`` with an ``sds-entry`` per finding,
``F`` before a finding and ``T`` before the thing to do. The register numbers
them and groups them by weight: what blocks, what goes back, what is worth
a change, and what the review found sound. It opens with every one of them
in a table, each row a jump to its entry. The work they ask for stands in a
second.

The remarks stand under the code they cite, in ``sds-code``. Then the
evidence: the probes on parent and change, the suites, the test coverage.
Then the scope: what the review raised and dropped, the follow-ups, the
surfaces it ran. The long parts fold into the appendix.

Five parts, and the outline nests the way they do.

Its frame is the one a concept paper has: ``sds-paper``, with the panel
beside the document. The head says what the reader has open, the
``sds-nav-outline`` says where they are in it, and the foot says what the
review came to. A review's parts carry no numbers: a reader cites a
finding, ``F1.2``, and the register numbers those.

This is also the page an agent starts from for a report it publishes as one
file. ``SKILL.md`` carries that recipe.

.. specimen:: screens/review.html
   :viewport: 1440x900
   :title: Review

A concept paper
---------------

The document that asks for a decision. What the thing is, where it stands,
what the evidence says, what the paper proposes, what that costs, and the
question at the end. A document on its own, like the review, and in the
same frame: no bar, no footer, nothing that leads anywhere else.

It is long, and that is what it exists to show. A review has five parts. A
concept has nine here and twenty in practice, with sections under most of
them. A list of sixty places is longer than any window.

So the document stands in ``sds-paper``, beside a panel that is its whole
frame. The panel holds the head, the contents and the state of the draft.
It stands the height of the window, and scrolls on its own.

The contents is ``sds-nav-outline`` with ``numbered``: the whole tree,
every part with its number, and the mark on the part the reader is in. It
is the document's base navigation, and an element of its own; the contents
beside a column, ``sds-nav-toc``, keeps its place and its behaviour. Under
860px the panel is the page's head, and the outline folds behind one press
in it.

The heading carries the number too, ``4`` on a part and ``4.2`` on a
section in it, as text in an ``sds-section__number``. So a reader can write
"see 4.2" and a screen reader says it. A counter drawn by the stylesheet
does not reach the name a heading has out loud.

The author as ``sds-byline`` under the lead. Two screenshots of pages as
they stand, each in ``sds-figure``, with the claim under it and ``zoomable``
for the detail. After each, a table of what the page says and what the
reader asks. The evidence as tables of questions and of tasks, and the
sentences readers said as ``sds-quote``. The findings as ``sds-register``
with groups of the paper's own: a gap, a cost, and what works as it stands.

The proposal with one drawing under the diagram rule. The file it adds in
an ``sds-tree`` of the cache, and the terminal in two ``sds-tabs``. The one
setting as ``sds-confval``, the sentence the note grows as ``sds-diff``.
The options as three ``sds-card`` in a grid, then side by side in a table
whose cells are verdicts.

The cost as work packages, the order as ``sds-steps``, the dates as
``sds-timeline``, the risks as notes. The decision as ``sds-decision``, the
one block the reader came for, with an ``sds-answer`` per answer. The
sources as ``sds-link``, and the long parts in the appendix.

The readers and the numbers are fiction; the screenshots are this system's
own status pages.

.. specimen:: screens/concept.html
   :viewport: 1440x900
   :title: Concept

What the pages asked for
========================

Every entry came from a page that had no words for something, and every one
closed in the component:

.. list-table::
   :header-rows: 1

   * - The page needed
     - The system grew
   * - a section whose ground changes
     - ``sds-band``, and ``sds-page`` stayed what it was
   * - where the reader is
     - ``sds-nav-breadcrumb``, the one navigation with no active mark
   * - a number as a fact
     - ``sds-stat``, whose ``note`` keeps it from a boast
   * - a drawing at the size of its drawing
     - ``sds-figure`` + ``sds-lightbox``, and ``sds-art`` under both
   * - the end of a *site*
     - ``sds-footer``, whose ``note`` is mandatory
   * - an entry, and a hit
     - ``sds-card`` and ``sds-search-result``: an invitation and an answer
       have different shapes
   * - where the list continues
     - ``sds-nav-pagination``
   * - a boundary as an answer
     - nothing new. A page says it in its headline, a list in an ``info``
       note
   * - a borrowed sentence, a byline
     - ``sds-quote``, ``sds-byline``
   * - questions that fold
     - ``sds-accordion``
   * - a form anybody can answer
     - ``sds-checkbox``, ``sds-radio``, ``sds-form-errors``, and
       ``sds-field`` grew the row a form owes a control
   * - work in progress, not work to do
     - ``sds-run``, not a state on ``sds-steps``. An instruction never
       changes; a run arrives one stop at a time and ends on a verdict
   * - one thing a review found, and the list of them a reader cites
     - ``sds-entry`` and ``sds-register``. The number in a rail, the kind as
       a word in the head. The register numbers, groups, and lists the work
   * - a finding at a line of code
     - ``remarks`` on ``sds-code``. A sentence in the sans face on a strip
       across the block. In the comment colour a reader reads past it
   * - a document with more places than a window is tall
     - ``sds-paper``, the panel that is a long document's frame, and
       ``sds-nav-outline`` in it, the document's base navigation. The number
       as text in the row and in the heading, ``sds-section__number``,
       because a counter never reaches a screen reader

The pages also found four older bugs. A scrollable table that made every
table narrower. A button with no ``type`` that submitted its form. A field
row with no ``min-width: 0`` that pushed a phone sideways. And ``lang="json"``
on a code block.
