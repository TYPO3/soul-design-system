:navigation-title: The document layer

==================
The document layer
==================

``soul.css`` styles things that were given a name: ``.sds-card``,
``.sds-note``, ``.sds-table``. A renderer that turns reStructuredText or
Markdown into HTML names almost nothing — it emits ``<p>``, ``<ul>``,
``<dl>``, ``<blockquote>``, ``<code>``, and the class it does write comes from
the source text rather than from any system.

``document.css`` is that other half. This page is set with it.

Linking it
==========

.. code-block:: html

   <link rel="stylesheet" href="styles/soul.css">
   <link rel="stylesheet" href="styles/document.css">

.. important::

   It is a **second entry point**, and ``soul.css`` deliberately does not
   import it. A backend module or an application screen has no paragraphs to
   have opinions about, and must not acquire any because it linked a design
   system. Link the second file where a document is being set, and nowhere
   else.

Everything in it is scoped to ``.sds-prose``, which is what makes it safe on a
page that also has a bar, a rail and a footer:

.. code-block:: html

   <main class="sds-column">
     <article class="sds-prose">
       <!-- whatever the renderer produced -->
     </article>
   </main>

The theme's layout already writes that wrapper. A hand-built page has to.

What it sets
============

.. list-table::
   :header-rows: 1

   * - Group
     - Covers
   * - Headings
     - ``h1``–``h6``, all six levels
   * - Blocks
     - paragraphs, block quotes, transitions, code blocks and literal blocks
   * - Lists
     - bullets and numbers, nested, and definition lists
   * - Tables
     - ``caption``, ``th``, ``td``, and the scroll a wide one needs
   * - Figures
     - ``figure``, ``figcaption``, and images held to the column
   * - In the line
     - ``code``, ``kbd``, ``abbr``, ``cite``, ``mark``, ``sup``, ``sub``

Six levels without three new sizes
==================================

The editorial scale names three headings, because a page has a title, a
section and a subsection and then it has run out of things a reader can tell
apart at a glance. A document has six.

The deeper levels drop through the **register** rather than through the scale:
a fourth-level heading is body size at semibold weight, a fifth is the UI
size, and the sixth lands in the label register — mono, upper case, tracked
out — the one the rest of the system keeps for a machine's own words.

.. note::

   Three new size tokens would have been duplicates. ``--font-size-h4`` at
   17px is ``--font-size-body`` under another name. What separates a
   fourth-level heading from the paragraph under it is weight and the air
   above it, which is how a book does it too.

The measure
===========

Text holds sixty-six characters. Blocks do not.

A reference is sentences *and* a forty-column table, a command nobody wants
wrapped, and a diagram. Clamping those to the width of comfortable reading is
how a documentation page ends up with three horizontal scrollbars — so the
container gives up its own limit and hands it to the things made of words:
paragraphs, lists, quotes, headings, and the rule, which is punctuation of the
text rather than a block of content.

Everything else runs to the column it was given, and a table wider than that
scrolls inside itself rather than taking the layout with it.

.. seealso::

   :doc:`guides-theme` for the renderer side: which templates the theme
   replaces, and why the colour of a code block arrives with the markup rather
   than being applied in the browser.
