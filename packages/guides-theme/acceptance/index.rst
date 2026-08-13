:navigation-title: Overview

=================================
The Soul design system, as a book
=================================

This project is the fixture the theme is built against. It is written in
reStructuredText rather than Markdown for one reason: the Guides Markdown
parser reads CommonMark and nothing else, so an admonition, a ``confval``, a
tab or a text role has no spelling there. A reference is made mostly of those.

This one is narrative — the shapes a page of prose falls into. The
:doc:`nodes` is a real one, and it is where the nodes that only a
reference uses appear. :doc:`depth/index` is neither: it is a tree, and it is
there because navigation is the one thing a page cannot show about itself.

.. toctree::
   :maxdepth: 3

   nodes
   depth/index

.. note::

   Nobody reads this project. Every node kind appears exactly once so that it
   can be looked at instead of guessed at, and where it looks wrong, that is
   the finding.

Headings
========

The page title above is the first level. This is the second.

Third level
-----------

Fourth level
~~~~~~~~~~~~

Fifth level
^^^^^^^^^^^

Sixth level
"""""""""""

Six levels, because reStructuredText allows six and the type scale names
three.

Text
====

A paragraph with *emphasis*, **strong emphasis**, ``an inline literal``, and a
`link to the renderer <https://docs.phpdoc.org/components/guides/guides/>`__. A
second sentence, so the measure has something to hold: text is set at
sixty-six characters and everything wider than words runs to the column.

| A line block keeps the breaks the author put in,
| which is what an address or a verse needs.
|
| A line left empty is a line, and an indented run keeps its step:
|     one line in,
|     and a second under it.

   A block quote is somebody else's sentences, stepped in and marked at the
   edge rather than set in italics.

.. rubric:: A rubric

A rubric is a heading that stays out of the outline — the one heading a
reference uses that no table of contents should list.

----

The transition above is punctuation of the text, not a divider of the page.

Text roles
----------

The words a manual has to say precisely: press :kbd:`Ctrl-K`, choose
:guilabel:`Save`, edit :file:`config/system/settings.php`, run
:command:`composer install`, and note that :abbr:`DS (Design System)` means
something specific here. A formula may carry :sup:`superscript` and
:sub:`subscript`, and :dfn:`a term being defined` is marked where it is first
used.

A formula is handed through as the source it was written as — :math:`E = mc^2`
in a sentence, and on a line of its own:

.. math::

   \frac{a}{b} = \frac{c}{d}

Nothing here typesets it. The renderer writes what the author wrote, so it is
set as what it is rather than as a formula it is not.

Lists
=====

- A bullet
- A second bullet

  - Nested, one level in
  - And a second nested item

- A third bullet

1. An enumerated item
2. A second one

   a. A nested letter
   b. And another

3. A third

Definition list
   What the term means, set as ordinary prose one step in. This is the shape a
   reference falls into whenever it names things.

Second term
   Terms carry the weight, because that is what somebody scans for.

Admonitions
===========

Twelve of them, and the system has four tones. The mapping is a design
decision, and this is where it can be made by looking rather than by argument.

.. note::
   A note.

.. tip::
   A tip.

.. hint::
   A hint.

.. important::
   Something important.

.. caution::
   A caution.

.. attention::
   Attention.

.. warning::
   A warning.

.. danger::
   Danger.

.. error::
   An error.

.. seealso::
   Somewhere else worth reading. This one has no tone in this system at all.

.. admonition:: A title of its own

   The generic form, which carries whatever title the author wrote.

.. versionadded:: 1.1
   What arrived.

.. versionchanged:: 1.2
   What moved.

.. deprecated:: 2.0
   What is going away.

Code
====

.. code-block:: php
   :caption: Where a caption sits, and which lines are marked
   :linenos:
   :emphasize-lines: 5

   <?php
   namespace TYPO3\CMS\Core;

   // The scope a question is answered in.
   final class Version
   {
       public function __construct(private readonly string $number) {}
   }

.. code-block:: yaml

   versions:
     - "13.4"   # LTS
     - "14.3"
   domains: [labels, xlf]

A literal block introduced by a double colon::

   vendor/bin/typo3 cache:flush

.. code-block:: text

   A block whose language is text: escaped, uncoloured, and the honest
   answer when nobody said what it is.

Tables
======

.. table:: A table with a caption of its own
   :widths: auto

   =========  ==============  ====================
   Layer      What it is      Where
   =========  ==============  ====================
   tokens     the values      ``src/tokens/``
   classes    the vocabulary  ``src/styles/``
   elements   the behaviour   ``src/components/``
   =========  ==============  ====================

.. list-table:: A list table, which is how a wide one is written
   :header-rows: 1

   * - Command
     - What it does
     - When you reach for it
   * - ``make verify``
     - headers, classes, references, fit, cards, types, conventions
     - before calling anything done
   * - ``make guides``
     - renders this project into ``.out/site/``
     - while the theme is being written

Pictures
========

.. figure:: /_images/placeholder.svg
   :alt: A placeholder

   The caption, which sits under the picture and reads as a label for it
   rather than as a sentence of the text.

.. image:: /_images/placeholder.svg
   :alt: A placeholder, dropped into the page without a claim under it

.. figure:: /_images/unprepared.svg
   :alt: A drawing that names no id="art"

   A drawing that was never prepared to be referenced. The finishing step reads
   the file and shows it as an image, in the colours it was exported with —
   which is what is lost, rather than the picture.

Cards
=====

.. grid::

   .. teaser:: A card with every option on it
      :href: /nodes
      :tag: Reference
      :meta: Both halves at once
      :src: /_images/placeholder.svg
      :alt: A placeholder

      What the directive can say is what ``sds-teaser`` draws, and this is the
      whole of it: the picture, the row above the title, the title as the
      link, and the two lines that decide whether it is opened.

   .. teaser:: A card with nowhere to go

      Without a target the title is a title. The row above it is dropped
      rather than left blank, and so is the ground the picture would sit on —
      a card with a hole in it is what a set of them lines up against.

The cards a manual is signposted with
=====================================

The other card, and the spelling a TYPO3 manual already uses: the target is
written into the title, the column counts are read as how much room a card
needs, and the whole card is the link.

.. card-grid::
   :columns: 1
   :columns-md: 2
   :gap: 4
   :card-height: 100

   .. card:: :doc:`nodes`

      The title is a reference and nothing else says where this goes. What is
      between the tags is blocks, which is the one thing an attribute cannot
      carry:

      - a list is one of them,
      - and a second paragraph is another.

   .. card:: A card with every option on it
      :href: /nodes
      :label: Chapter 02
      :icon: actions-book
      :src: /_images/placeholder.svg
      :alt: A placeholder
      :footer: Both halves at once
      :action: Read it

      What the directive can say is what ``sds-card`` draws, and this is the
      whole of it: the picture, the glyph and the row above the title, the
      title, the foot, and the words that say what pressing the card does.

``:gap: 0`` is the one gutter a page may ask for, because it is a shape rather
than a distance: the cards share a hairline and the set reads as one block.

.. card-grid::
   :columns: 3
   :gap: 0

   .. card:: :doc:`nodes`

      A tile has no frame and no corner of its own — both belong to the wall
      around it — and it does not rise under the pointer, because a tile that
      lifts tears the lines it shares.

   .. card:: The line between two of them
      :href: /nodes
      :action: Read it

      It is the wall's ground showing through a gap one hairline wide. A grid
      that reflows cannot know which tile sits on an edge, so no tile can be
      told to drop the border it shares.

.. card-grid::
   :columns: 6

   .. card:: :doc:`nodes`
      :icon: actions-database

      Five or six across, where a card is a name and a glyph.

   .. card:: A card with nowhere to go
      :icon: actions-tag

      Without a target the title is a title, the card is not a target, and no
      action is drawn under it.

Questions with their answers folded away
========================================

The fold is a ``<details>``, so it works with no script on the page and
find-in-page opens the answer it lands in. One answer stands open, because the
shape of an answer is worth seeing without pressing anything.

.. accordion::
   :name: what-it-holds

   .. accordion-item:: What can an answer hold?
      :open:

      Blocks, which is the whole reason the answer is written between the tags
      rather than said as an option:

      - a list is one of them,
      - and a code block is another.

      .. code-block:: bash

         make verify

   .. accordion-item:: Who decides which one is open?

      The platform. Every answer in the set carries the set's name, so opening
      this one closed the one above it, and nothing on the page listened for
      anything.

``:multiple:`` empties that name, for a set whose answers are meant to be
compared rather than found.

.. accordion::
   :multiple:

   .. accordion-item:: The first of two that stay open together

      Both can stand open at once, which is what a comparison needs.

   .. accordion-item:: And the second

      Opening this one leaves the one above it exactly as it was.

A document inside this one
==========================

.. specimen:: guidelines/colors-surfaces.card.html
   :viewport: 700x270
   :title: Surfaces

The embedded frame, which arrives here as a specimen and on a manual page as a
video. Both are the same node and both are drawn by ``sds-embed``; the frame
itself is written by the renderer, so this reads with no script running at
all. A page in this fixture reaches no host but its own — a frame that fetched
a video would make the render depend on a network the container may not have.

Footnotes and citations
=======================

A statement that needs a source [#note]_, and one that cites a work [CIT2026]_.

.. [#note] The footnote itself, at the foot of the document.
.. [CIT2026] A citation, which is a footnote with a name.

Grouping
========

.. topic:: A topic

   A block with a title of its own that stays out of the outline.

.. sidebar:: A sidebar

   An aside, which the core templates render as an admonition.

.. container:: a-class-from-the-source

   A container carries whatever class the author wrote, and the class means
   nothing more here than it did in the source. The text inside it is still
   set, because it is text; the box around it is not, because nobody said
   what it is.

.. hlist::
   :columns: 3

   - One
   - Two
   - Three
   - Four
   - Five
   - Six
