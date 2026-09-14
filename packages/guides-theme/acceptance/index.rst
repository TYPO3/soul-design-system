:navigation-title: Overview

=================================
The Soul design system, as a book
=================================

This project is the fixture the theme's check runs against. It is
reStructuredText, not Markdown, for one reason. The Guides Markdown parser
reads CommonMark and nothing else, so an admonition, a ``confval``, a tab
or a text role has no spelling there. A reference is mostly those.

This page is narrative: the shapes a page of prose falls into.
:doc:`nodes` is a real reference, and the nodes only a reference uses
appear there. :doc:`depth/index` is neither. It is a tree, and it is there
because navigation is the one thing a page cannot show about itself.

.. toctree::
   :maxdepth: 3

   nodes
   depth/index

.. note::

   Nobody reads this project. Every node kind appears exactly once, so a
   reviewer can look at it instead of a guess. Where it looks wrong, that is
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

Six levels, because reStructuredText permits six and the type scale names
three.

Text
====

A paragraph with *emphasis*, **strong emphasis**, ``an inline literal``,
and a `link to the renderer
<https://docs.phpdoc.org/components/guides/guides/>`__. A second sentence,
so the measure has something to hold. Text sits at sixty-six characters,
and everything wider than words runs to the column.

| A line block keeps the breaks the author put in,
| which is what an address or a verse needs.
|
| A line left empty is a line, and an indented run keeps its step:
|     one line in,
|     and a second under it.

   A block quote is somebody else's sentences, stepped in and marked at the
   edge, not in italics.

.. rubric:: A rubric

A rubric is a heading outside the outline. It is the one heading a
reference uses that no table of contents lists.

----

The transition above is punctuation of the text, not a divider of the page.

Text roles
----------

The words a manual has to say with precision. Press :kbd:`Ctrl-K`, choose
:guilabel:`Save`, edit :file:`config/system/settings.php`, run
:command:`composer install`. :abbr:`DS (Design System)` means something
specific here. A formula can carry :sup:`superscript` and :sub:`subscript`.
:dfn:`A term with a definition` gets its mark at its first use.

A formula goes through as the source the author wrote: :math:`E = mc^2` in
a sentence, and on a line of its own:

.. math::

   \frac{a}{b} = \frac{c}{d}

Nothing here typesets it. The renderer writes what the author wrote, so it
appears as what it is, and not as a formula it is not.

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
   What the term means, as ordinary prose one step in. This is the shape a
   reference falls into whenever it names things.

Second term
   Terms carry the weight, because that is what a reader scans for.

Admonitions
===========

Twelve of them, and the system has four tones. The mapping is a design
decision, and here a reviewer can make it by sight instead of argument.

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
   Somewhere else worth a look. This one has no tone in this system at all.

.. admonition:: A title of its own

   The generic form, which carries whatever title the author wrote.

.. versionadded:: 1.1
   What arrived.

.. versionchanged:: 1.2
   What moved.

.. deprecated:: 2.0
   What goes away.

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

This theme registers a grammar the highlighter lacks. So a TypoScript block
gets its colour on the server like every other one; see ``Grammars``.

.. code-block:: typoscript
   :caption: A grammar this system wrote itself

   # The site's page object
   page = PAGE
   page {
       10 = FLUIDTEMPLATE
       10.file = EXT:my_site/Resources/Private/Templates/Main.html
       typeNum = 0
   }

   plugin.tx_myext.settings.limit = {$plugin.tx_myext.settings.limit}

   [siteLanguage("locale") == "de_DE"]
   page.10.settings.lang = de
   [END]

.. code-block:: tsconfig
   :caption: The same grammar under the name the backend half is written under

   # Page TSconfig
   TCEMAIN.linkHandler.page {
       handler = TYPO3\CMS\Backend\LinkHandler\PageLinkHandler
       label = Page
   }

.. code-block:: scss

   .card {
       // A variable and a line comment, which is what the grammar reads.
       $pad: 1rem;
       padding: $pad;

       &:hover {
           border-color: currentColor;
       }
   }

A block whose language is ``diff`` is a different body in the same frame.
The rows carry status colour, and the caption names the file. The two file
headers of the format stay context. The head above them already says which
file this is.

.. code-block:: diff
   :caption: composer.json

   --- a/composer.json
   +++ b/composer.json
    {
        "require": {
   -        "typo3/cms-core": "^12.4",
   +        "typo3/cms-core": "^13.4",
            "typo3/soul-guides-theme": "^1.0"
        }
    }

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
     - When you use it
   * - ``make verify``
     - headers, classes, references, fit, cards, types, conventions
     - before you call anything done
   * - ``make guides``
     - renders this project into ``.out/site/``
     - while you write the theme

Pictures
========

.. figure:: /_images/placeholder.svg
   :alt: A placeholder
   :zoomable:

   The caption, which sits under the picture and reads as a label for it,
   not as a sentence of the text. This one opens at full size, on request.
   The frame is the press, and the viewer takes the claim into its own head.

.. image:: /_images/placeholder.svg
   :alt: A placeholder, dropped into the page without a claim under it

.. figure:: /_images/unprepared.svg
   :alt: A drawing with no ground of its own

   Every picture is a link, so every drawing arrives in the colours of its
   file. Nothing on the page has to be true of the file for it to show.

.. figure:: /_images/transparent.svg
   :alt: Three boxes and two arrows, in dark line art on nothing

   And what a diagram from a tool usually is: dark line art on transparency.
   The frame gives it a ground for those colours and keeps that ground in
   both modes. It is the one surface here that does not follow the reader
   into dark.

Two halves
==========

A picture beside the sentences it is of. Neither a figure in the column nor
a set of cards makes that shape. Every block in the split is a column, so
the first of these needs nothing to say where its halves are. A paragraph
and a picture are two blocks and stand as two.

.. split::

   The half on the left is this paragraph and nothing else. At a width that
   holds one column it stacks under the picture in the written order. That
   is the default, and what a reader of the source expects.

   .. figure:: /_images/placeholder.svg
      :alt: A placeholder, standing beside the paragraph rather than under it

      A picture in a half keeps its frame and its claim. Only its place
      changed.

.. split::
   :align: center
   :leads: end

   .. half:: Several blocks stay together

      They are one half only when something says so, and this is it.

      The picture leads here. It stands to the end of the line on a page and
      above this paragraph on a phone. What illustrates a sentence comes
      before it once there is one column. The two are level, not aligned at
      the top, which is what ``center`` is for. A short half beside a tall one
      is a caption of it, not a column that ran out.

   .. half::

      .. figure:: /_images/placeholder.svg
         :alt: A placeholder, level with the text and read before it

         The half that leads, and the claim under it is part of what leads.

Figures
=======

Numbers as facts, at the width a figure holds. Each carries the line that
bounds it. Without one a number is a boast. The third is a share of a stated
whole, which it says in words. Every one of them has the same three lines,
so a reader reads the notes across the set.

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
      out of the machine. The line can carry a :doc:`reference <nodes>`,
      which is why it stands between the tags.

   .. stat:: 2
      :of: 3
      :label: network sources answering
      :icon: actions-globe

      One is slow and one is unreachable from the checker. Neither has to
      answer.

   .. stat:: 0
      :label: writes
      :icon: actions-file-shield

      The tool reads every source. It writes nothing back, and it runs
      nothing to answer.

Colours
=======

A palette, in the same wall. Each entry carries all three things a colour
is. The chip nobody can type, the name a design writes, and the value the
mode resolved it to. The last of them is a hairline, drawn as its own edge.
At one pixel a value is invisible, and as a fill it is a different job by
the same number.

.. grid:: wide

   .. swatch:: var(--accent)
      :name: --accent
      :resolved: #FF8700

   .. swatch:: var(--surface-raised)
      :name: --surface-raised
      :resolved: light-dark(#FFFFFF, #171614)

   .. swatch:: var(--text-primary)
      :name: --text-primary
      :resolved: light-dark(#1C1A17, #EDE9E2)

   .. swatch:: var(--border-subtle)
      :name: --border-subtle
      :resolved: light-dark(#E3DFD6, #2B2823)
      :kind: line

Planes
======

The same wall with statements, not figures. A plane says something in
place, which tells it from the card below. Nothing here goes anywhere. The
first has a glyph a reader sees before a read. The second has a number as
one of a set. The third is the sunken fill, the ground of machine output.

.. grid::

   .. surface:: Read, never write
      :icon: actions-file-shield

      The tool reads every source and writes nothing back. The line can
      carry a :doc:`reference <nodes>`, which is why it stands between the
      tags.

   .. surface:: One answer, one origin
      :label: Rule 02

      Their origins tell two answers that disagree apart, not the order of
      the questions.

   .. surface:: The reply, as it arrives
      :plane: sunken

      The sunken fill, for machine output. It is the same plane and the same
      parts. Only the ground says what kind of thing is on it.

Borrowed sentences
==================

A sentence out of somewhere else, with its source. The first is a person
and carries a monogram. The second is a document, which has no initials and
gets none. A monogram of a filename is a person invented for a source with
none.

.. quote:: Benjamin Kott
   :as: maintainer
   :meta: 24 July 2026
   :initials: BK

   The fallback was never the problem. *Not saying* it was a fallback was the
   problem.

.. quote:: Sources and preconditions
   :as: documentation
   :meta: 12.4 release notes
   :href: /nodes

   Every source declares a precondition, so an answer is reachable before
   the question comes.

Presses
=======

The controls of a page, on one line. The first is the one press this
section is about. A second primary beside it makes neither mean anything.
The label of the first carries where it goes, which is how a card says the
same thing. The last is the glyph alone, named by its title, because
nothing else names it.

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

A button stands on its own as readily as in a row. A press that goes
somewhere is a link, with the browser's own middle click and status line,
which no control with a listener has. On its own it is usually the one
action the page is for, which is what ``lg`` says.

.. button:: Read the reference
   :href: /nodes
   :icon: actions-arrow-right
   :size: lg

Cards
=====

The grid that takes no column count, with the register of one entry in a
list. What kind of thing it is, when it is from, and the two lines that
decide the open.

.. grid::

   .. card:: One entry in a list of them
      :href: /nodes
      :tag: Reference
      :label: 12 May 2026
      :src: /_images/placeholder.svg
      :alt: A placeholder

      The picture sits flush at the top. The badge and the label share the
      one line over the title, and the title is where the entry goes.

   .. card:: A card with nowhere to go

      Without a target the title is a title. The row above it drops, and so
      does the ground under the picture. A card with a hole in it is what a
      set of them lines up against.

How much room one of a set needs
================================

The same cards, in the sets that say how much room one of them holds, not
how many stand in a row. ``wide`` is a card with a picture and a paragraph.
The target stands in the title, which makes the whole card the link.

.. grid:: wide

   .. card:: :doc:`nodes`

      The title is a reference, and nothing else says where this goes. What
      stands between the tags is blocks, the one thing an attribute cannot
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
      whole of it. The picture, the glyph, the badge and the label on the row
      above the title. The title, the foot, and the words that say what a
      press on the card does.

``flush`` takes the gutter out, because it is a shape, not a distance. The
cards share a hairline, and the set reads as one block.

.. grid:: flush

   .. card:: :doc:`nodes`

      A tile has no frame and no corner of its own. Both belong to the wall
      around it. It does not rise under the pointer, because a tile that
      lifts tears the lines it shares.

   .. card:: The line between two of them
      :href: /nodes
      :action: Read it

      It is the wall's ground through a gap one hairline wide. A grid that
      reflows cannot know which tile sits on an edge, so no tile can drop the
      border it shares.

.. grid:: dense

   .. card:: :doc:`nodes`
      :icon: actions-database

      Five or six across, where a card is a name and a glyph.

   .. card:: A card with nowhere to go
      :icon: actions-tag

      Without a target the title is a title, the card is not a target, and
      no action draws under it.

Questions with their answers folded away
========================================

The fold is a ``<details>``, so it works with no script on the page, and
find-in-page opens the answer it lands in. One answer stands open, because
the shape of an answer is worth a look without a press.

Directory trees
---------------

A directory, in the shape it has on disk. A nested list, because that is
what a tree is. The name is the first literal in an item, and the rest of
the line is what it is for.

.. directory-tree::
   :level: 2

   * ``docs/`` the sources, as a project already writes them

     * ``Index.rst``
     * ``guides.xml`` the theme, the mark and the versions
     * ``Introduction/``

       * ``Index.rst``
       * ``Installation.rst``

   * ``site/`` what the render writes, and what is published

     * ``index.html``
     * ``_search.json`` the index the field in the bar fetches
     * ``styles/`` the drop-in, copied there by the finishing step

       * ``soul.css``
       * ``soul.js``

   * ``.github/workflows/publish.yml`` render, finish, publish

Everything below the level folds, and nothing drops. A reader can undo a
fold. With ``:show-file-icons:``, and open to the bottom at a level past the
depth of the tree:

.. directory-tree::
   :level: 9
   :show-file-icons:

   * ``config/``

     * ``sites/``

       * ``main/``

         * ``config.yaml`` the one file a site is
   * ``composer.json``

An item with no literal in it is a name and nothing else:

.. directory-tree::

   * vendor
   * public

.. accordion::
   :group: what-it-holds

   .. accordion-item:: What can an answer hold?
      :open:

      Blocks, which is the whole reason the answer stands between the tags
      and not in an option:

      - a list is one of them,
      - and a code block is another.

      .. code-block:: bash

         make verify

   .. accordion-item:: Who decides which one is open?
      :name: who-opens

      The platform. Every answer in the set carries the set's name. So this
      one's open closed the one above it, and nothing on the page listened
      for anything.

``:multiple:`` empties that name, for a set whose answers a reader compares.
An answer with a ``:name:`` has an address of its own. `This one
<#who-opens>`__ opens on arrival, because the platform unfolds what a
fragment points into.

.. accordion::
   :multiple:

   .. accordion-item:: The first of two that stay open together

      Both can stand open at once, which is what a comparison needs.

   .. accordion-item:: And the second

      This one's open leaves the one above it exactly as it was.

The facts of a thing
====================

A field list becomes the block a reader scans down the terms. A value
carries a literal and a link, which is why the pairs stand between the tags.

.. facts::

   :Change: `1482 <https://example.org/c/1482>`__ · patch set 2
   :Target: ``main`` · ``2.4``
   :Read: 2026-09-11, in a worktree of its own

An instruction, step by step
============================

The numbers are the set's own count. A stop in the middle renumbers
everything under it, and no line of this page says a figure. A stop holds
blocks, which is why the work stands between the tags.

.. steps::

   .. step:: Require the package

      It brings the renderer, the highlighter and the Markdown parser with
      it, so this one line is all four.

      .. code-block:: bash

         composer require typo3/soul-guides-theme

   .. step:: Select the theme
      :name: select-the-theme

      ``theme="soul"`` in ``guides.xml`` names it, and the ``<extension>``
      element makes it exist. A stop with a ``:name:`` has an address of its
      own: `this one <#select-the-theme>`__.

   .. step:: Draw the signet
      :optional:

      The disc stays unfilled, and the word stands beside the title. A ring
      says nothing to a reader who cannot see it.

   .. step:: Render the site

      Two commands, and the second turns documents into a site.

Something shown as it is written
================================

.. example:: A surface, from the body above it

   .. surface:: Read, never write
      :icon: actions-file-shield
      :label: Rule

      The tool reads every source. It writes nothing back.

The block and the plane under it are one body. The print is the lines the
parser got, and the render comes from those same lines. So this page cannot
show markup that produces something else. The frame around the render is
the one dashed line in the system and carries no fill. It says the box is
not part of the page, and leaves the plane inside it on its real ground.

.. example::

   An example holds blocks and not only components, so this is what
   ordinary content looks like inside one:

   - a list is one of them,
   - and a paragraph was the other.

A second one with no argument, which is a block with no caption above it.
The print is ``text``. No highlighter on this site knows reStructuredText,
and a language the server cannot colour is better said than faked.
``:language:`` is there for a project whose examples are in a language the
server knows.

A document inside this one
==========================

.. specimen:: guidelines/colors-surfaces.card.html
   :viewport: 700x277
   :title: Surfaces

The embedded frame, which arrives here as a specimen and on a manual page
as a video. Both are the same node, and ``sds-embed`` draws both. The
renderer writes the frame itself, so this reads with no script. A page in
this fixture reaches no host but its own. A frame that fetched a video makes
the render depend on a network the container can lack.

Footnotes and citations
=======================

A statement that needs a source [#note]_, and one that cites a work
[CIT2026]_.

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
   nothing more here than it did in the source. The text inside it still
   gets its style, because it is text. The box around it does not, because
   nobody said what it is.

.. hlist::
   :columns: 3

   - One
   - Two
   - Three
   - Four
   - Five
   - Six
