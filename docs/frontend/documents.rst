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

What is genuinely a passage's rather than an element's stays scoped, in
``components/prose.css``: the measure the text is read at, the ink a passage
sets, the register below ``h3``, the underline on a link inside a sentence, and
the names a renderer writes for nodes with no element of their own. Those are
drawn where a page says it is a passage:

.. code-block:: html

   <main class="sds-column">
     <article class="sds-prose">
       <!-- whatever the renderer produced -->
     </article>
   </main>

The theme's layout already writes that wrapper. A hand-built page has to.

What a passage sets
===================

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
   * - What a renderer names
     - the handful of classes it writes for nodes with no element of their
       own: ``.contents`` and ``.toc``, ``.topic``, ``.rubric``,
       ``.field-list``, ``.hlist`` and the classifiers of a definition list.
       They stay the renderer's own names — renamed, the stylesheet would only
       work with the templates that renamed them, and these are the nodes the
       theme has no template for
   * - Notes at the foot
     - ``sds-footnote`` with ``sds-footnote__label`` and
       ``sds-footnote__content`` — names of this system's own, because the
       theme writes that markup itself. A citation is one of these with a name
       in the label instead of a number, which is content; the anchor the
       renderer wrote is what tells the two apart where a page needs it

.. note::

   Lists are the row that is least a passage's. What a list *is* — the marker,
   the indent at the width of that marker, the muted marker colour — is
   ``base.css``, and the gap under the block is the flow contract's, so a
   screen has lists too. What a passage adds is the air between items. See
   :doc:`/design-system/type` for the classes, ``.sds-list`` and
   ``.sds-list--plain``.

Where block spacing lives
=========================

A paragraph, list or heading carries its own step below it, in the flow
contract — one distance for every block, whether or not it stands in a passage.
Authored blocks also sit inside notes, accordion answers, cards and modal
bodies, none of which has to be a document, and a step stated by the passage
would leave two paragraphs in one of those surfaces touching.

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
renderer cannot work out. ``.contents`` stays a passage's rule for a renderer
that writes the list itself, and is the same thing standing still.

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

Text holds sixty-six characters — ``--measure-prose``, which is where that
number is written down. Blocks do not.

A reference is sentences *and* a forty-column table, a command nobody wants
wrapped, and a diagram. Clamping those to the width of comfortable reading is
how a documentation page ends up with three horizontal scrollbars — so the
container gives up its own limit and hands it to the things made of words:
paragraphs, lists, quotes, headings, and the rule, which is punctuation of the
text rather than a block of content.

Everything else runs to the column it was given, and a table wider than that
scrolls inside itself rather than taking the layout with it.

.. seealso::

   :doc:`/guides-theme/markup` for the renderer side: which templates the theme
   replaces, and why the colour of a code block arrives with the markup rather
   than being applied in the browser.
