:navigation-title: Screens

=======
Screens
=======

Whole surfaces, not components. Each one is a **Starting Point**: a consuming
project offers these in a picker to seed a new design, so they have to be
finished pages rather than sketches.

They are marked by an ``@startingPoint`` comment on their first line —
section, subtitle and the viewport they are rendered at — which is the
contract with the Design System pane, and ``make verify`` enforces it. A
screen is its own thumbnail; there is no thumbnail file anywhere.

Every one of them is a **live page** under **Pages** in the sidebar, and the
files here are their static export. Open one there and click through it: the
rail folds, a pill answers, the tabs filter the list, a filter that matches
nothing answers, a form that fails says where, the block copies itself, the
mode switch moves the whole page. That is the difference that matters — every
story is opened by the test suite, so a live page is a page under test, and a
page of static markup proves the layout and nothing else.

One composition serves both, and the branch appears only where the two
genuinely differ: a component that takes its content between the tags cannot
be exported, because Lit's SSR emits authored children beside the element's
own template. Those use the markup function the element itself renders.

**A page is where this system finds out what it is missing.** Every one below
grew something, and the ones that grew nothing are worth as much: the
get-started page and the sitemap needed no new word, which is how you learn
the vocabulary is finished rather than merely large. Where a page did need
something, the gap was closed in the component and never in the page — see the
list at the end.

Two shapes of page
==================

Everything here is one of two layouts, and the choice is not decoration.

**A page that reports** is ``sds-page``: one measure, one ground, sections
stacked down it. Right for an answer, a reference, a document — the reader
came for something specific and the page's job is to be out of the way. Where
it needs a list of its own sections beside it, that is ``sds-body`` with an
``sds-rail``.

**A page that argues** is ``sds-bands``: full-bleed sections whose *ground*
changes, contents held to the same measure. Right where the parts of the page
are steps in an argument — a pitch, then who it is for, then what it costs —
and wrong everywhere else, because a change of ground that means nothing is a
change of ground the reader stops believing.

Ankommen — the pages that argue
===============================

The landing page
----------------

The first page a project shows: the pitch, what the system is made of, and how
to start. Every element on it is the real one, so a change to a button or a
code block arrives here without anybody editing this page.

.. specimen:: screens/landing.html
   :viewport: 1440x900
   :title: Landing

A feature in full
-----------------

The page a product site owes each of its claims: what the thing is, how it
works, what it changes in a result, what it costs, and what it does **not** do.
The last of those is the one most feature pages leave out, and it is the reason
this one is trusted.

.. specimen:: screens/feature.html
   :viewport: 1440x900
   :title: Feature

Which way to run it
-------------------

A comparison whose gaps are the point. A matrix in which everything is present
somewhere tells a reader nothing they could not have guessed — and every mark
carries the name of the column it is in, so the table is readable without
seeing it.

.. specimen:: screens/compare.html
   :viewport: 1440x900
   :title: Compare

Who is behind it
----------------

Who is answerable, why it exists, how it is paid for, and what happens if it
stops. No photographs: a face is a file to fetch, keep in step and licence, and
none of that is what naming a maintainer is for.

.. specimen:: screens/about.html
   :viewport: 1440x900
   :title: About

Get started
-----------

The three questions a careful reader asks before running someone else's code:
which file is mine, is it the one that was published, and what happens when it
does not answer. It needed no new component, which is the result worth
recording.

.. specimen:: screens/get-started.html
   :viewport: 1440x900
   :title: Get started

Finden — the pages that distribute
==================================

The list
--------

News, releases, references and search results are the same page with different
rows. What it has to prove is the set rather than any one entry — and the state
a list page usually skips: a filter that matches nothing, answering with how
much was read.

.. specimen:: screens/news.html
   :viewport: 1440x900
   :title: News

The results
-----------

The query stays in the field, so refining is not retyping. The facets say how
many are behind each of them, so narrowing is a decision rather than a guess.
And a source that answered with nothing says so, rather than leaving a blank
column.

.. specimen:: screens/search.html
   :viewport: 1440x900
   :title: Search

The sitemap
-----------

The only page that shows the shape of the site rather than a path through it.
It is ``sds-rail`` three times over, groups standing open, nothing marked
current — a map has no *here* on it.

.. specimen:: screens/sitemap.html
   :viewport: 1440x900
   :title: Sitemap

Lesen — the pages that hold text
================================

The documentation surface
-------------------------

The one place where the documentation *is* the product presentation: a
visitor gets the pitch and keeps scrolling into the reference without a seam.
210px tool rail, a 1200px page measure, 48px gutters.

.. specimen:: screens/documentation.html
   :viewport: 1440x900
   :title: Documentation

An article
----------

One column of running text with the things a text needs standing in it — a
drawing, a borrowed sentence, a block the machine wrote — and its contents
beside it. Those contents are ``sds-rail``: an article's table of contents is a
list of links beside a column, which is what the rail already is.

.. specimen:: screens/article.html
   :viewport: 1440x900
   :title: Article

The questions
-------------

A list of questions rather than a wall of answers. ``sds-accordion`` is a real
``<details>``, so the fold works before any script has run and find-in-page
opens the answer it lands in.

.. specimen:: screens/questions.html
   :viewport: 1440x900
   :title: Questions

An answer
---------

An answer always carries its source, its version binding, and what it leaves
out. Every state in Guidelines → States exists to carry exactly that.

.. specimen:: screens/answer.html
   :viewport: 1440x900
   :title: Answer

The tool reference
------------------

The full tool surface at compact density — 30px rows, 13px type, because here
the list *is* the work and scanning beats reading.

.. specimen:: screens/tool-reference.html
   :viewport: 1440x900
   :title: Tool reference

Handeln und Ränder
==================

The form
--------

Three states, and most forms are drawn in the first one and shipped without the
other two: the form, what it does when it fails, and what it says when it
worked. The failure is the one that matters — a summary at the top, focused,
each line a link to the field it is about, because marking the boxes is enough
for whoever sees the whole form at once and nothing at all for whoever does
not.

.. specimen:: screens/contact.html
   :viewport: 1440x900
   :title: Contact

The page that is not there
--------------------------

``sds-empty`` — the same component the filtered list and the search use,
because it is the same statement: what was asked, that it was read, what is not
there, and the nearest real thing. Three named pages rather than a link to the
front page. It keeps its chrome, because a 404 stripped of the header has also
lost the navigation.

.. specimen:: screens/not-found.html
   :viewport: 1440x900
   :title: Not found

The status
----------

It reports **sources**, not a service: nothing here is hosted for anyone to
depend on. Two of the six are the reader's own machine and are stated as
unreportable rather than left blank. The one page whose subject is carried by
the status colours — and they still sit only in badges and result rows.

.. specimen:: screens/status.html
   :viewport: 1440x900
   :title: Status

What the pages made the system grow
===================================

Every one of these came from a page that could not say something, and every one
was closed in the component rather than in the page:

.. list-table::
   :header-rows: 1

   * - The page needed
     - The system grew
   * - a section whose ground changes
     - ``sds-band``, and ``sds-page`` stayed what it was
   * - where the reader is
     - ``sds-crumbs`` — the one navigation with no active mark
   * - a number stated as a fact
     - ``sds-stat``, whose ``note`` is what keeps it from being a boast
   * - a drawing at the size it was drawn
     - ``sds-figure`` + ``sds-lightbox``, and ``sds-art`` under both
   * - the end of a *site*
     - ``sds-footer``, whose ``note`` is required
   * - an entry, and a hit
     - ``sds-teaser`` and ``sds-result`` — an invitation and an answer are not
       the same shape
   * - where the list continues
     - ``sds-pagination``
   * - a boundary drawn as an answer
     - ``sds-empty``, and the states guideline is generated from it now
   * - a borrowed sentence, a byline
     - ``sds-quote``, ``sds-byline``
   * - questions that fold
     - ``sds-accordion``
   * - a form anybody can answer
     - ``sds-checkbox``, ``sds-radio-group``, ``sds-form-errors``, and
       ``sds-field`` grew the row a form owes a control

And four bugs the pages found, each of them older than the page that found it:
a scrollable table that made every table narrower, a button with no ``type``
that submitted the form it stood in, a field row with no ``min-width: 0`` that
pushed a phone sideways, and ``lang="json"`` on a code block telling a screen
reader to switch to a language that does not exist.
