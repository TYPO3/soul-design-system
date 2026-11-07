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
in these sections grew something, or proved that the vocabulary is complete. A gap closes
in the component and never in the page; see the list at the end.

.. toctree::
   :titlesonly:
   :hidden:

   site
   docs
   catalog
   service
   paper

.. grid::

   .. card:: Site
      :href: /design-system/patterns/screens/site
      :icon: actions-template

      The landing page, a feature, the pages that argue a product.

   .. card:: Docs
      :href: /design-system/patterns/screens/docs
      :icon: actions-book

      The reference a product ships, a column of text with its way through.

   .. card:: Catalog
      :href: /design-system/patterns/screens/catalog
      :icon: actions-search

      A set, and one thing out of it.

   .. card:: Service
      :href: /design-system/patterns/screens/service
      :icon: actions-cog

      The form, the record, the status and the page that is not there.

   .. card:: Paper
      :href: /design-system/patterns/screens/paper
      :icon: actions-file-text

      A document with no bar and no footer: a review and a concept.

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
