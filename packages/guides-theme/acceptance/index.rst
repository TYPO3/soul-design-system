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

Figures
=======

Numbers stated as facts, at the width a figure holds. Each carries the line
that bounds it — without one a number is a boast — and the third is a share of
a stated whole, which it says in words. Every one of them has the same three
lines, so the notes are read across the set rather than each on its own.

.. grid:: dense

   .. stat:: 5
      :label: sources
      :icon: actions-database

      Bundled knowledge, this checkout, installed packages, the booted
      installation, and the network.

   .. stat:: 240
      :unit: ms
      :label: typical answer
      :icon: actions-clock

      From bundled knowledge, with no installation booted and no request
      leaving the machine. The line may carry a :doc:`reference <nodes>`,
      which is why it is written between the tags.

   .. stat:: 2
      :of: 3
      :label: network sources answering
      :icon: actions-globe

      One is slow and one is unreachable from the checker. Neither is required
      to answer.

   .. stat:: 0
      :label: writes
      :icon: actions-file-shield

      Every source is read. Nothing is written back, and nothing is executed
      to answer.

Planes
======

The same wall holding statements rather than figures: a plane that says
something in place, which is what tells it from the card below — nothing here
goes anywhere. The first is told apart by its glyph before it is read, the
second is numbered as one of a set, and the third is the sunken fill, which is
what machine output is drawn on.

.. grid::

   .. surface:: Read, never write
      :icon: actions-file-shield

      Every source is read, nothing is written back, and the line may carry a
      :doc:`reference <nodes>` — which is why it is written between the tags.

   .. surface:: One answer, one origin
      :label: Rule 02

      Two answers that disagree are told apart by where they came from rather
      than by which was asked for last.

   .. surface:: The reply, as it arrives
      :plane: sunken

      The sunken fill, for machine output. It is the same plane and the same
      parts; only the ground it is drawn on says what kind of thing is on it.

Presses
=======

The controls of a page, on one line. The first is the one press this section
is about; a second primary beside it would make neither mean anything. The
label of the first carries where it goes, which is how a card says the same
thing, and the last is the glyph alone — named by its title, because nothing
else names it.

.. button-bar::

   .. button:: :doc:`nodes`
      :icon: actions-book

   .. button:: The renderer
      :href: https://docs.phpdoc.org/components/guides/guides/
      :variant: secondary
      :rel: external

   .. button:: A press with nowhere to go
      :variant: ghost
      :size: sm
      :disabled:

   .. button:: Copy
      :href: /nodes
      :icon: actions-clipboard
      :icon-only:

A button stands on its own as readily as in a row, and a press that goes
somewhere is a link — the browser's own middle click and status line, which no
control with a listener on it has.

.. button:: Read the reference
   :href: /nodes
   :icon: actions-arrow-right

Cards
=====

The grid that takes no column count, holding the register one entry in a list
is written in: what kind of thing it is, when it is from, and the two lines
that decide whether it is opened.

.. grid::

   .. card:: One entry in a list of them
      :href: /nodes
      :tag: Reference
      :label: 12 May 2026
      :src: /_images/placeholder.svg
      :alt: A placeholder

      The picture sits flush at the top, the badge and the label share the one
      line over the title, and the title is where the entry goes.

   .. card:: A card with nowhere to go

      Without a target the title is a title. The row above it is dropped
      rather than left blank, and so is the ground the picture would sit on —
      a card with a hole in it is what a set of them lines up against.

The cards a manual is signposted with
=====================================

The same card, in the spelling a TYPO3 manual already uses: the target is
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
      :tag: Reference
      :icon: actions-book
      :src: /_images/placeholder.svg
      :alt: A placeholder
      :footer: Both halves at once
      :action: Read it

      What the directive can say is what ``sds-card`` draws, and this is the
      whole of it: the picture, the glyph, the badge and the label on the row
      above the title, the title, the foot, and the words that say what
      pressing the card does.

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
