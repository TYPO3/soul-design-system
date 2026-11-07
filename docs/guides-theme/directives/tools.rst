:navigation-title: Tools

======================
The manual's own tools
======================

What a page about a system needs to show that system.

codemode
========

Markup that stands in the page as its author wrote it. The body is HTML, and the
theme passes it through. It takes no argument and no option.

.. example:: An element of the system, written by hand

   .. codemode::

      <sds-note tone="info" heading="Written as markup">
        The theme passes this block through as it is.
      </sds-note>

**It is the way out, not the way in.** The gate checks a directive that
draws the element: its options, its names, its twin. Nothing checks the
markup here. The Markdown twin prints the block as fenced HTML.

example
=======

What the author wrote, and under it what it renders as, out of one body.

.. example:: An example, shown by an example

   .. example:: A press, and where it goes

      .. button:: :doc:`/guides-theme/installation`
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
full-bleed ground of a marketing one. That is what the band in
:doc:`page-shape` is in an example to show.

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
nothing measured. :doc:`/guides-theme/markup` has the other half of that node: a video,
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

   :doc:`/guides-theme/markup` for what the renderer's own directives, admonitions, code
   blocks, tabs, ``confval``, topics, come out as under this theme.
