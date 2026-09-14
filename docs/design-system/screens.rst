:navigation-title: Screens

=======
Screens
=======

Whole surfaces, not components. Each one is a **Starting Point**. A consumer
offers these in a picker to seed a new design, so each is a complete page,
not a sketch.

An ``@startingPoint`` comment on the first line marks one: section, subtitle
and the viewport it renders at. That is the contract with the Design System
pane, and ``make verify`` enforces it. A screen is its own thumbnail.

Every screen is a **live page** under **Pages** in the sidebar, and the files
here are their static export. Open one there and click through it. The rail
folds, a pill answers, the tabs filter the list, a form that fails says
where, the mode switch moves the whole page. The test suite opens every
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

Arriving — pages that argue
===========================

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

Which way to run it
-------------------

A comparison whose gaps are the point. A matrix with everything present
somewhere tells a reader nothing. Every mark carries the name of its column,
so the table reads without sight.

.. specimen:: screens/compare.html
   :viewport: 1440x900
   :title: Compare

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

Finding — pages that distribute
===============================

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

Reading — pages that hold text
==============================

The documentation surface
-------------------------

The one place where the documentation *is* the product presentation. A
visitor gets the pitch and scrolls into the reference without a seam. 210px
tool rail, a 1200px page measure, 48px gutters.

.. specimen:: screens/documentation.html
   :viewport: 1440x900
   :title: Documentation

An article
----------

One column of text with what a text needs in it: a drawing, a borrowed
sentence, a block the machine wrote. Its contents stand beside it as
``sds-nav-rail``, because a table of contents is a list of links beside a
column.

.. specimen:: screens/article.html
   :viewport: 1440x900
   :title: Article

The questions
-------------

A list of questions, not a wall of answers. ``sds-accordion`` is a real
``<details>``, so the fold works before a script runs and find-in-page opens
the answer it lands in.

.. specimen:: screens/questions.html
   :viewport: 1440x900
   :title: Questions

An answer
---------

An answer always carries its source, its version binding, and what it leaves
out. Every state in Guidelines → States carries exactly that.

.. specimen:: screens/answer.html
   :viewport: 1440x900
   :title: Answer

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

Five parts, and the contents list nests the way they do.

Its contents rest beside the column in the ``sds-aside`` a document writes,
the same as on a documentation page.

This is also the page an agent starts from for a report it publishes as one
file. ``SKILL.md`` carries that recipe.

.. specimen:: screens/review.html
   :viewport: 1440x900
   :title: Review

The tool reference
------------------

The full tool surface at compact density: the least room a row reads in. Here
the list *is* the work, and a scan beats a read.

.. specimen:: screens/tool-reference.html
   :viewport: 1440x900
   :title: Tool reference

Acting and edges
================

The form
--------

Three states: the form, what it does when it fails, and what it says when it
worked. The failure matters most. A summary at the top, focused, each line a
link to its field. A mark on the box is enough for a reader who sees the
whole form, and nothing for one who does not.

.. specimen:: screens/contact.html
   :viewport: 1440x900
   :title: Contact

The page that is not there
--------------------------

The address the reader asked for is the headline, the source that answered is
the lead, and the search field is the nearest real thing. Three named pages,
not a link to the front page. It keeps its chrome: a 404 without the header
has also lost the navigation.

.. specimen:: screens/not-found.html
   :viewport: 1440x900
   :title: Not found

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

The pages also found four older bugs. A scrollable table that made every
table narrower. A button with no ``type`` that submitted its form. A field
row with no ``min-width: 0`` that pushed a phone sideways. And ``lang="json"``
on a code block.
