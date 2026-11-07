:navigation-title: Page shape

===================
The shape of a page
===================

What a page consists of, and where its columns stand.

.. _directive-layout:

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

.. _directive-hero:

hero
====

The opening claim of a marketing page, beside one decorative image. It goes
right after the document title, so the title stays the page's real heading,
browser title and source for navigation.

.. example:: The opening claim, beside its one image

   .. hero:: /_images/design-system-workbench-cutout.png
      :plain:

      The opening summary belongs inside the directive.

      A second paragraph can make the promise concrete.

.. example:: The claim with its press and a quieter way

   .. hero:: /_images/design-system-workbench-cutout.png
      :plain:
      :eyebrow: Guides theme
      :action: Publish a first site
      :href: /guides-theme/quickstart
      :second: Read the example
      :second-href: /guides-theme/example

      Copy the example project and replace its content.

The document title stands above it in the source and is not part of it. The
argument is the image source. The theme writes ``sds-hero``. At a narrow
viewport the two halves become a column by the rule of every split in the
system. Content after the hero and
before the next band stays part of the opening section.

.. confval:: alt
   :name: hero-alt
   :type: string
   :default: ""

   What the image shows, when it adds a meaning the copy lacks. Leave it out
   for a decorative illustration whose subject already has its name beside
   it.

.. confval:: plain
   :name: hero-plain
   :type: flag

   Takes the frame off the picture, for an illustration with no edge of its
   own. A screenshot or a drawing keeps its frame.

.. confval:: eyebrow
   :name: hero-eyebrow
   :type: string

   The line over the title: what kind of page this is.

.. confval:: action
   :name: hero-action
   :type: string

   The press, in words, with a verb first. With no ``href`` no button draws.

.. confval:: href
   :name: hero-href
   :type: string

   Where the press goes.

.. confval:: icon
   :name: hero-icon
   :type: string

   The name of a glyph in front of the press.

.. confval:: second
   :name: hero-second
   :type: string

   The way for a reader who is not ready, quieter than the press. It draws
   only beside a press.

.. confval:: second-href
   :name: hero-second-href
   :type: string

   Where the second way goes.

.. confval:: align
   :name: hero-align
   :type: start | center | end
   :default: center

   Where the copy and the picture stand against each other: at the top, level,
   or at the foot.

.. confval:: leads
   :name: hero-leads
   :type: start | end
   :default: start

   Which half comes first once the two have stacked. ``end`` puts the picture
   above the copy on a phone.

.. _directive-band:

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

The landing page of :doc:`the example project </guides-theme/example>` is the same
directive at home, with the run of them at work.

.. _directive-split:

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

.. _directive-half:

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

.. confval:: align
   :name: half-align
   :type: start | center | end

   Where this half stands, top to foot, when it differs from the split's
   ``align``. It is the same three positions, for one half.

.. _directive-grid:

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

.. confval:: columns
   :name: grid-columns
   :type: number

   This many across, while each item keeps its minimum. A narrower room
   takes fewer. For a set whose rows are the point: two by two, or three
   and two.

.. confval:: align
   :name: grid-align
   :type: start | center | end

   Where a shorter item stands in its row: at the top, level, or at the foot.
   With nothing said, it fills the row, so feet line up. ``flush`` ignores it,
   because a tile that stops short leaves a hole in the wall.

