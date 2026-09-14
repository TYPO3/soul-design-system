:navigation-title: Documents

=========
Documents
=========

``soul.css`` styles things with a name: ``.sds-card``, ``.sds-note``,
``.sds-table``. A renderer that turns reStructuredText or Markdown into HTML
names almost nothing. It emits ``<p>``, ``<ul>``, ``<dl>``, ``<blockquote>``,
``<code>``, and the class it does write comes from the source text.

The same one file draws those bare elements too. It draws this page.

The link
========

.. code-block:: html

   <link rel="stylesheet" href="styles/soul.css">

There is no second sheet. A bare element belongs to the layer that owns it.
``<pre>`` draws where ``sds-code`` draws, ``<table>`` where ``sds-table``
does. What belongs to no component, ``<dl>``, ``<kbd>``, ``<abbr>``,
``<mark>``, is in ``base.css``. A split sheet held the same element twice,
once for a document and once for a screen, and the two drifted.

Little remains. A paragraph carries the measure, because a paragraph is a
paragraph anywhere. The register below ``h3`` is what those elements are.
The blocks a renderer emits under this system's own names have files of
their own.

``components/prose.css`` is the one sheet with a passage scope.
It holds the line block, where a break is the content and the parser writes
the class. It draws where a page says it is a passage:

.. code-block:: html

   <main class="sds-body__main">
     <article class="sds-prose">
       <!-- whatever the renderer produced -->
     </article>
   </main>

The theme's layout writes that wrapper on a manual page. A hand-built page
has to. A page of bands has none: what a band holds stands in the band,
which already carries the page measure.

What draws a document
=====================

The sheet that owns a group draws it: the component's own file where the
thing has a component, ``base.css`` where it belongs to none. None of it
has a ``.sds-prose`` scope. A document and a screen are the same elements.
A rule that fires only inside a passage is the second copy this system
exists to avoid.

.. list-table::
   :header-rows: 1

   * - Group
     - Covers
   * - Headings
     - ``h1``–``h6``, all six levels, and ``.sds-permalink``, the mark that
       hands over the place a heading names
   * - Blocks
     - paragraphs, block quotes, transitions, code blocks and literal blocks,
       and line blocks, where the break is the content
   * - Lists
     - the rhythm of bullets and numbers, nested, and definition lists. The
       marker and the indent are ``soul.css``, because a screen has lists too
   * - Tables
     - ``caption``, ``th``, ``td``, and the scroll a wide one needs
   * - Figures
     - ``figure``, ``figcaption``, and images held to the column
   * - In the line
     - ``code``, ``kbd``, ``abbr``, ``cite``, ``mark``, and ``math``: a
       formula, set as the source it arrived as
   * - Before the script
     - ``sds-note``, ``sds-figure``, ``sds-card``, ``sds-code`` and
       ``sds-embed`` while they are ``:not(:defined)``. The frame each one
       lacks on a page whose script has not run yet, or never will
   * - Nodes with no element
     - the blocks a renderer emits that no element covers, under names this
       system defines because the theme writes their markup. ``sds-topic``
       with ``sds-topic__title``, ``sds-rubric``, ``sds-docinfo``. ``sds-hlist``
       with ``sds-hlist--3`` to ``sds-hlist--6``. ``sds-options`` with
       ``sds-options__name``. ``sds-classifier`` with
       ``sds-classifier__mark`` for a term's kind and its colon
   * - What stays the renderer's
     - ``.line-block`` and ``.line``, in ``components/prose.css``, the only
       thing scoped to a passage. The parser sets those two on the node, so
       they are the one pair this system cannot rename
   * - Notes at the foot
     - ``sds-footnote`` with ``sds-footnote__label`` and
       ``sds-footnote__content``, names of this system's own, because the
       theme writes that markup. A citation is one of these with a name in
       the label instead of a number. The renderer's anchor tells the two
       apart where a page needs it

.. note::

   A list reads as a passage's and is not. What a list *is* stands in
   ``base.css``: the marker, the indent at the width of that marker, the
   muted marker colour. The step under the block is the flow contract's. So
   a screen has lists too. The air between items is what an author asks for,
   with a class. See :doc:`/design-system/type` for ``.sds-list`` and
   ``.sds-list--plain``.

Where block spacing lives
=========================

A paragraph, a list or a heading carries its own step below it, in the flow
contract. One distance for every block, in a passage or not. Authored
blocks also sit inside notes, accordion answers, the stops of an
instruction, cards and modal bodies. None of those has to be a document, and
a step from the passage leaves two paragraphs in one of them without a gap.

A passage adds what only a reading flow can know: the measure, the ink, and
the air between the items of a list. A container that declares its own gap
takes the blocks' lower margins back. So ``.sds-column``, ``.sds-stack`` and
component bodies produce one step, not two.

This split is a contract. A container of authored blocks either lets those
blocks keep their step or owns the gap and removes it. Never both.
``tests/defaults.spec.ts`` exercises both sides.

The section is the one box a renderer draws that the theme had to take over.
A heading gets its air from the block *before* it, the only way to state a
distance in one direction. A heading inside a section has no sibling outside
it, so every section ran into the next at a paragraph's step.

The Guides theme draws the box as ``.sds-section``, and the section carries
the step.
One distance above every section that is not the first in its box, whatever
level its heading has. The last block inside a section owes its edge
nothing. ``tests/guides.spec.ts`` measures it on the rendered page.

What is on this page
====================

A contents list is a block where the author wrote it. At the one width with
room to give, it stands beside the column instead. From 1296px,
``--width-page`` and its two gutters, a ``.sds-aside`` around it leaves the
flow and rests at the line the rail rests at. The column gives up the width.
So the page reads rail, text, contents with the same width either side. At
a narrower width the list stays where it was.

It carries two levels there and all six in the flow. The column is what a
reader jumps *from*, and nobody jumps to a fourth-level heading from a rail.
Drawn, the deeper levels are identical muted lines a step apart, each with
less measure than the one above.

The list itself is :ref:`sds-nav-toc <component-sds-nav-toc>`, not markup
from a template. That is what makes it follow the reader. It marks the
section under them as they scroll, the one thing about this list a renderer
cannot work out. A ``toctree`` that prints itself in the page is the other
list and must not look like this one. It is a list of other documents, with
no place for a mark that says where the reader is. The contents apparatus's
own classes draw it.

Six levels, three sizes
=======================

The editorial scale names three headings. A page has a title, a section and
a subsection, and then a reader can tell nothing more apart at a glance. A
document has six.

The deeper levels drop through the **register**, not the scale. A
fourth-level heading is body size at semibold weight. A fifth is the UI
size. The sixth lands in the label register, mono, upper case, tracked out,
the one the system keeps for a machine's own words.

.. note::

   Three new size tokens are duplicates. ``--font-size-h4`` at 16px is
   ``--font-size-body`` under another name. Weight and the air above it tell
   a fourth-level heading from the paragraph under it, as in a book.

The measure
===========

A paragraph inside ``.sds-prose`` keeps ``--measure-prose``. The token holds
620px, the reading measure of sixty-six characters. Blocks do not keep it.

A reference is sentences *and* a forty-column table, a command nobody wants
wrapped, and a diagram. A clamp to the reading width gives a documentation
page three horizontal scrollbars. So the column has no limit of its own.
The things made of words carry it. The paragraph, and the blocks a reader
reads: a quotation, a topic, a note under a statement. Each in its own file,
off that same token.

The paragraph's half is the passage's rule, not the element's. A bare ``p``
has no measure. It stands in a card, a note, a field or a modal as often as
in a document. A width on the element leaves every one of those boxes with
a column of text and a waste beside it. ``prose.css`` states it for the
paragraphs inside the passage, without weight. So a paragraph with a class
of its own, ``.sds-lead``, keeps the measure that class gives it.

Everything else runs to its column, and a table wider than that scrolls
inside itself.

.. seealso::

   :doc:`/guides-theme/markup` for the renderer side: which templates the
   theme replaces, and why the colour of a code block arrives with the
   markup.
