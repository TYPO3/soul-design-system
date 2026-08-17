:navigation-title: Documents

=========
Documents
=========

``soul.css`` styles things that were given a name: ``.sds-card``,
``.sds-note``, ``.sds-table``. A renderer that turns reStructuredText or
Markdown into HTML names almost nothing — it emits ``<p>``, ``<ul>``,
``<dl>``, ``<blockquote>``, ``<code>``, and the class it does write comes from
the source text rather than from any system.

Those bare elements are set too, by the same one file. This page is set with it.

Linking it
==========

.. code-block:: html

   <link rel="stylesheet" href="styles/soul.css">

There is no second sheet. A bare element belongs to the layer that owns it:
``<pre>`` is drawn where ``sds-code`` is drawn, ``<table>`` where ``sds-table``
is, and what belongs to no component — ``<dl>``, ``<kbd>``, ``<abbr>``,
``<mark>`` — is in ``base.css``. Splitting them off produced the same element
twice, once for a document and once for a screen, and the two drifted.

Little is left over. A paragraph carries the measure because a paragraph is a
paragraph anywhere, the register below ``h3`` is what those elements are, and
the blocks a renderer emits under names of this system's own have files of
their own like every other component. What stays scoped to a passage is
``components/prose.css``, and it is the line block — where a break is the
content, and the parser rather than a template writes the class. It is drawn
where a page says it is a passage:

.. code-block:: html

   <main class="sds-body__main">
     <article class="sds-prose">
       <!-- whatever the renderer produced -->
     </article>
   </main>

The theme's layout already writes that wrapper on a manual page. A hand-built
page has to. A page rendered as a run of bands has none: what a band holds
stands in the band, which is the box that already carries the page measure.

What draws a document
=====================

Every group below is drawn by the sheet that owns it — the component's own
file where the thing has a component, ``base.css`` where it belongs to none.
None of it is scoped to ``.sds-prose``: a document and a screen are the same
elements, and a rule that only fired inside a passage would be the second copy
this system exists to avoid.

.. list-table::
   :header-rows: 1

   * - Group
     - Covers
   * - Headings
     - ``h1``–``h6``, all six levels, and ``.sds-permalink`` — the mark that
       hands over the place a heading names
   * - Blocks
     - paragraphs, block quotes, transitions, code blocks and literal blocks,
       and line blocks — where the break is the content
   * - Lists
     - the rhythm of bullets and numbers, nested, and definition lists — the
       marker and the indent are ``soul.css``, because a screen has lists too
   * - Tables
     - ``caption``, ``th``, ``td``, and the scroll a wide one needs
   * - Figures
     - ``figure``, ``figcaption``, and images held to the column
   * - In the line
     - ``code``, ``kbd``, ``abbr``, ``cite``, ``mark``, and ``math`` — a
       formula, set as the source it arrived as
   * - Before the script
     - ``sds-note``, ``sds-figure``, ``sds-card``, ``sds-code`` and
       ``sds-embed`` while they are ``:not(:defined)`` — the frame each one is
       missing on a page whose script has not run yet, or never will
   * - Nodes with no element
     - the blocks a renderer emits that no element of this system covers, under
       names this system defines because the theme writes their markup:
       ``sds-topic`` with ``sds-topic__title``, ``sds-rubric``,
       ``sds-docinfo``, ``sds-hlist`` with ``sds-hlist--3``, ``sds-hlist--4``,
       ``sds-hlist--5`` and ``sds-hlist--6``, ``sds-options`` with
       ``sds-options__name``, and ``sds-classifier`` with ``sds-classifier__mark`` for the
       kind a term is given and the colon that introduces it
   * - What stays the renderer's
     - ``.line-block`` and ``.line``, in ``components/prose.css`` and the only
       thing scoped to a passage: the parser sets those two on the node rather
       than a template writing them, so they are the one pair this system
       cannot rename
   * - Notes at the foot
     - ``sds-footnote`` with ``sds-footnote__label`` and
       ``sds-footnote__content`` — names of this system's own, because the
       theme writes that markup itself. A citation is one of these with a name
       in the label instead of a number, which is content; the anchor the
       renderer wrote is what tells the two apart where a page needs it

.. note::

   A list is the one that reads as a passage's and is not. What a list *is* —
   the marker, the indent at the width of that marker, the muted marker colour
   — is ``base.css``, and the step under the block is the flow contract's, so a
   screen has lists too. The air between items is what an author asks for, and
   it is asked for with a class. See :doc:`/design-system/type` for those,
   ``.sds-list`` and ``.sds-list--plain``.

Where block spacing lives
=========================

A paragraph, list or heading carries its own step below it, in the flow
contract — one distance for every block, whether or not it stands in a passage.
Authored blocks also sit inside notes, accordion answers, the stops of an
instruction, cards and modal bodies, none of which has to be a document, and a
step stated by the passage would leave two paragraphs in one of those surfaces
touching.

A passage adds what only a reading flow can know: the measure, the ink, and the
air between the items of a list. A container that declares its own gap takes
the blocks' lower margins back, so ``.sds-column``, ``.sds-stack`` and component
bodies produce one step rather than stacking two.

This split is a contract rather than an implementation accident. A container
of authored blocks either lets those blocks keep their step or owns the gap
and removes it; it never does both. ``tests/defaults.spec.ts`` exercises both
sides.

The section is the one box a renderer draws that the theme had to take over.
A heading gets its air from the block *before* it — the only way to state a
distance in one direction — and a heading wrapped in a section has no sibling
outside it, so every section ran into the next at the step between two
paragraphs. The Guides theme draws the box itself as ``.sds-section``, and the
section carries the step: the level of the heading the next one opens decides
how much, and the last block inside a section owes its edge nothing. Nothing
in a document says any of this — a heading is a section — and
``tests/guides.spec.ts`` measures it on the rendered page.

What is on this page
====================

A contents list is a block where the author wrote it, and at the one width the
page has room to give it stands beside the column instead: from 1296px —
``--width-page`` and its two gutters, where the page stops growing — a
``.sds-aside`` around it leaves the flow, rests at the line the rail rests at,
and the column gives up the width rather than the box taking it. So the page
reads rail, text, contents with the same width either side, and narrower than
that the list simply stays where it was.

It carries two levels there and all six in the flow. The column is what a
reader jumps *from*, and a fourth-level heading is not a jump anybody makes
from a rail: drawn, the deeper levels are identical muted lines a step apart,
each with less measure than the one above.

The list itself is :ref:`sds-nav-toc <component-sds-nav-toc>` rather than
markup a template writes, and that is what makes it follow the reader: it marks
the section under them as they scroll, which is the one thing about this list a
renderer cannot work out. A ``toctree`` that prints itself in the page is the
other list and must not look like this one — it is a list of other documents,
with no place on it for a mark saying where the reader is, and it is drawn with
the contents apparatus's own classes.

Six levels, three sizes
=======================

The editorial scale names three headings, because a page has a title, a
section and a subsection and then it has run out of things a reader can tell
apart at a glance. A document has six.

The deeper levels drop through the **register** rather than through the scale:
a fourth-level heading is body size at semibold weight, a fifth is the UI
size, and the sixth lands in the label register — mono, upper case, tracked
out — the one the rest of the system keeps for a machine's own words.

.. note::

   Three new size tokens would have been duplicates. ``--font-size-h4`` at
   16px is ``--font-size-body`` under another name. What separates a
   fourth-level heading from the paragraph under it is weight and the air
   above it, which is how a book does it too.

The measure
===========

A paragraph is held to ``--measure-prose``. The token holds 620px, which is
where the number is written down and what the rest of these pages call the
reading measure of sixty-six characters. Blocks are not held to it.

A reference is sentences *and* a forty-column table, a command nobody wants
wrapped, and a diagram. Clamping those to the width of comfortable reading is
how a documentation page ends up with three horizontal scrollbars — so the
column keeps no limit of its own, and the limit is carried by the things made
of words: the paragraph, in ``base.css``, because a paragraph is a paragraph
wherever it stands, and the blocks that are read rather than scanned — a
quotation, a topic, a note under a statement — each in its own file, off that
same token.

Everything else runs to the column it was given, and a table wider than that
scrolls inside itself rather than taking the layout with it.

.. seealso::

   :doc:`/guides-theme/markup` for the renderer side: which templates the theme
   replaces, and why the colour of a code block arrives with the markup rather
   than being applied in the browser.
