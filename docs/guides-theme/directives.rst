:navigation-title: Directives

==========
Directives
==========

Four directives and one document field, which is everything this theme adds to
what an author can write. They are registered by the extension, so a project
that selected the theme can use them immediately — there is nothing to add to
``guides.xml`` and no template to copy.

Three of them build a landing page: a page of a different shape than a manual
page, and the renderer has no vocabulary for it. The fourth embeds a rendered
specimen at the size it was measured at.

.. contents::
   :local:

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

grid
====

Cards that reflow by their own minimum width.

.. code-block:: text

   .. grid::

      .. teaser:: What it is
         :to: /overview

         Two sentences.

      .. teaser:: What it costs
         :to: /pricing

         Two more.

No column count, and that is the design: three across on a desk, two on a
tablet, one on a phone, decided by how narrow a card may get rather than by a
breakpoint somebody picked. It takes no options, and it holds teasers —
anything else inside it is laid out by the same rule and left to fend for
itself.

teaser
======

One card in a grid: a title, a few sentences, and where it goes.

.. code-block:: text

   .. teaser:: As a render guide template
      :to: /guides-theme/index
      :tag: Package
      :meta: Composer

      A Composer package that turns reStructuredText or Markdown into pages
      set with this system.

.. confval:: to
   :type: string

   A document, written the way a ``:doc:`` reference is, and resolved per
   page. With it, the title is a link and the whole card follows it on hover;
   without it, the title is a title.

.. confval:: tag
   :type: string

   What kind of entry it is, in the badge above the title. A fact about the
   card rather than a result, so it carries no tone and no glyph.

.. confval:: meta
   :type: string

   When, or anything else in the label register: it sits beside the tag, in
   the same row, and the row is dropped where neither is written.

.. confval:: src
   :type: string

   The picture, flush at the top of the card. A path in the documentation
   source is copied into the output and resolved per page; a URL somewhere
   else is linked as it stands. An SVG of this project's own is referenced
   rather than linked, so it takes the page's tokens and follows it into dark
   — which costs the file the one line :doc:`/guidelines/artwork` asks for.

.. confval:: alt
   :type: string

   What the picture shows, for a reader who cannot see it. Written and empty
   says decorative — a card whose art only repeats the title beside it — and
   left out entirely says nothing was decided, which reads very differently.

**The options are ``sds-teaser``'s properties, all of them.** A directive that
draws one of this system's components and answers for half of it sends the
author who wanted the other half to their own stylesheet, which is the one
thing this system exists to prevent. What the element gains, this gains.

**What is pressable is the title and not the card.** A card wrapped in one
anchor announces its entire contents as that link's name to a screen reader,
and takes selecting the text inside it away from everybody else. The card
following on hover is what makes it feel like the target it deliberately is
not — and this is the markup ``sds-teaser`` renders, node for node, so a
rendered page and a hand-built one cannot drift.

specimen
========

A rendered card, embedded at the size it was drawn for.

.. code-block:: text

   .. specimen:: guidelines/colors-surfaces.card.html
      :viewport: 700x260
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
