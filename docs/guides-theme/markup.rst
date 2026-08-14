:navigation-title: Core markup

================================
Core markup, and what it becomes
================================

Most of a page is not written with this theme's directives. It is written with
the renderer's own — an admonition, a code block, a table, a ``confval`` — and
what those come out as is the theme's real subject. This page says what each
one becomes, and where the answer was a decision rather than a mapping.

Nothing here is something an author writes differently. The source is
ordinary reStructuredText; the theme is what stands between it and the markup.

Rendered before publishing
==========================

One arrangement runs under everything below, so it is worth saying once.

Every template here *addresses* a component — ``<sds-card heading="…">``,
``<sds-rail items="…">`` — and writes none of its markup. That is the whole
point of there being components: what a card looks like is decided in one file,
and a page this theme renders cannot drift from a page a product wrote.

On its own that would cost the reader with no JavaScript everything, because an
element addressed by attributes draws nothing until it upgrades. So it is
rendered earlier instead: ``make guides`` runs every element in the output
through the same renderer the design system uses to export its specimen cards,
and writes the markup back into the page inside the element's own tag. The
document that is published already holds the card, the rail and the frame; in
a browser the element upgrades over its own rendering and takes over the
behaviour.

What follows is visible from the outside:

- **A page works with scripting off.** Not a reduced version of it — the same
  markup, minus the parts that are behaviour: a tab bar that cannot switch, a
  copy button that cannot copy.
- **A directive's options are the element's properties.** If a component grows
  one, the directive gains it in the same commit, and it is spelt the same way
  on both sides. Nothing in this theme is a translation of a component.

Component contract
------------------

Every element used by the theme must render in Node. The prerenderer creates
an element and calls its template without browser lifecycle hooks, so rendering
cannot depend on ``document``, ``navigator`` or ``customElements``. ``make
verify ARGS=ssr`` keeps that requirement executable.

Content has to reach the same template by either route. In a browser the
element lifts what an author wrote between its tags; during server rendering
there are no connected children, so the prerenderer passes that markup through
the element's ``content`` property. A component reads the browser value when
it exists and the property otherwise. Anything it would decide by inspecting
children — tab labels or whether a control contains only a glyph — must also
be expressible as a property, or the server and browser can reach different
answers.

The published element keeps the author's original content in an inert
``<template data-sds-content>`` before its rendered markup. The template is
written even when that content is empty: it tells the upgrading element which
children came from the author and which came from its own earlier rendering.
Without that distinction the element would lift its rendered frame as input
and draw a second copy around it.

Admonitions
===========

The renderer has more types than this system has tones, and the mapping below
is Sphinx's own grouping rather than a ladder of severity.

.. list-table::
   :header-rows: 1

   * - Type
     - Tone
   * - ``note``, ``hint``, ``important``, ``seealso``, ``todo``, and any
       generic ``.. admonition::``
     - ``info`` — the tone that does not tint
   * - ``tip``
     - ``ok``
   * - ``attention``, ``caution``, ``warning``
     - ``warn``
   * - ``danger``, ``error``
     - ``error``

``important`` sits on the quiet side of that line on purpose: Sphinx splits
these into note-like and warning-like, and ``important`` is emphasis rather
than a hazard. An author writing it today means what Sphinx means by it, and a
mapping that turned it into an alarm would change what their page says.

**The type's own word survives the mapping.** ``caution`` and ``danger`` both
become ``warn``, so the tone can no longer tell them apart — but the glyph's
accessible name is the type's word and not the tone's, and a reader who cannot
see the colour still hears which one this was.

**No category heading.** Almost none of the types carry a title at all, and
printing "Note" over each one would be the category name ``sds-note`` forbids
its heading to be. Where an author did write a title, it is theirs and it goes
in as a label — as text, because a heading is an attribute and markup inside it
would arrive as visible angle brackets. A title that leans on inline markup is
a title doing a paragraph's job.

Anything an admonition holds — paragraphs, lists, a whole code block — is
carried between the element's tags rather than handed to it as a property,
which is the rule the whole document layer follows here.

Code blocks
===========

**The colour is the server's.** ``guides-code`` highlights with a PHP port of
highlight.js, so what lands in the page already carries ``hljs-`` classes, and
``soul.css`` maps exactly those onto this system's three syntax colours. The
page is coloured with no JavaScript on it at all, which is the point of a
generator that ships HTML.

``<sds-code>`` still wraps it, and in a browser it does the same job the other
way round: markup that already carries ``hljs-`` classes is handed back
untouched — wrapper, line numbers and emphasised lines included — and what the
element adds is the head, the language label and the copy button. Only a block
that arrived uncoloured is coloured by the element.

.. code-block:: text
   :caption: The caption goes above the block, where this system puts it

   .. code-block:: php
      :caption: config/system.php

      return ['siteTitle' => 'TYPO3'];

Diffs change the body
=====================

``.. code-block:: diff`` is drawn by ``sds-diff`` rather than ``sds-code``:
the same frame and the same head, and rows that carry status colour — the one
place in this system a fill marks a line. It is the spelling an author already
writes, so a page that documents an upgrade gets it without being rewritten,
and ``:caption:`` names the file the way the element's own ``path`` does.

.. code-block:: text

   .. code-block:: diff
      :caption: composer.json

      --- a/composer.json
      +++ b/composer.json
       {
      -    "typo3/cms-core": "^12.4"
      +    "typo3/cms-core": "^13.4"
       }

That source, on this page:

.. code-block:: diff
   :caption: composer.json

   --- a/composer.json
   +++ b/composer.json
    {
   -    "typo3/cms-core": "^12.4"
   +    "typo3/cms-core": "^13.4"
    }

The two file headers of the format stay context rather than reading as a line
added and a line removed — the head above them already says which file this
is. Everything else unmarked is context, which covers ``@@`` and
``diff --git`` without either being named. The rows are read on the server, so
a reader with no JavaScript gets the colour too; ``:linenos:`` and
``:emphasize-lines:`` do not apply, because a diff states which lines changed
and a gutter of numbers nobody cites is decoration.

.. warning::

   A fenced Markdown block with **no language** kills a render. The Markdown
   parser leaves the language ``null``, the highlighter's filter declares a
   string, and the render dies with a ``TypeError`` three packages deep naming
   a template nobody wrote. This theme's code template defaults it to ``text``,
   which escapes the block and colours nothing — the honest answer when nobody
   said what it is.

Tabs, in both of its spellings
==============================

``.. tabs::`` and ``.. configuration-block::`` are two directives with
different markup and the same intent, and both become ``<sds-tabs>``. A reader
must not have to work out which one an author reached for.

Left alone, neither works: the core renders a row of buttons and every panel
under it, and the script that would switch them is not something the renderer
ships. The element builds its own tab bar and wires the arrow keys. With
JavaScript off the bar is there and the panels stack open under it, because a
button that cannot switch anything must not hide what it would have switched.

**What ``configuration-block`` is for, and ``.. tabs::`` is not:** the same
setting appears on a page four times, and the reader chooses a language once.
Every block of a document follows the choice, and it outlives the page — a
manual is read across ten of them. That is ``sds-tabs`` carrying ``sync``, a
word the template sets and an author does not: two blocks of one document that
disagreed would be the bug it prevents. A ``.. tabs::`` set beside them, whose
labels the author wrote, follows nothing and is followed by nothing.

The choice is an order rather than a word. A reader who picks ``bash`` in the
one block that offers it has not stopped preferring PHP to YAML everywhere
else, so every word they choose is kept, most recent first, and each set takes
the first of them it has. A set that has none of them keeps the panel it is
showing rather than falling back to its first.

Reference nodes
===============

.. confval:: an example
   :type: string
   :required: true
   :default: "this one"

   ``confval`` is the backbone of any TYPO3-adjacent reference, and it becomes
   ``sds-confval`` — see :doc:`/frontend/components/data`. It has a component
   of its own because a reference is dozens of these in a column, and how they
   read together is a design rather than a mapping.

The name is mono and carries the anchor, ``required`` is a badge, and the type,
the default and any further option the author set stand in a grid under the
name — each behind its own label, because "type script" with the type
upper-cased reads as the name of a language. An entry is separated by a
hairline and nothing else: forty boxes in a column are not a list. A
``confval`` holds blocks, including admonitions, so its description is not one
line of text and is not rendered as though it were.

``:type:`` and ``:default:`` are parsed inline and reach the element as text.
That is a decision and not an oversight: a type is written ``array<string>`` as
often as it is written as a reference, and a value that is read as markup is a
value with half of itself missing.

**Option lists** — the ``.. option::`` directive a command-line reference uses
— and plain **definition lists** come out through the same document-layer
rules. A **field list** at the top of a document, the author-version-date
block, is the one place the theme adds a class the core did not write: without
it a docinfo block is a bare ``<table>``, and a bare table in a document is a
data table with ruled rows and a header. It is neither.

Set-apart blocks
================

``.. topic::`` and ``.. sidebar::`` are both an ``<aside>`` on ``.sds-panel``:
a hairline, a fill, and a title that labels the box. They are drawn alike
because they are alike — a digression with a heading — and the core rendering
``sidebar`` as an admonition is where that went wrong. An admonition says
something about the reader's situation and carries a glyph that names which
one; a topic says nothing about the reader.

A sidebar does not float here. In a column held to sixty-six characters there
is nothing for it to float beside, and a box pulled out of a measure that
narrow leaves both halves too thin to read.

``.. versionadded::``, ``.. versionchanged::`` and ``.. deprecated::`` are
notes, and not as loosely as that sounds: "Changed in version 1.2" is a fact
stated as a heading, and the paragraph under it is what that fact costs
somebody reading the page today — which is the shape ``sds-note`` already is.
**Only deprecation carries a tone.** ``warn`` is this system's degraded but
usable answer, which is exactly what a deprecated thing is; the other two are
facts about the surface with nothing gone wrong, so they are ``info``, the tone
that does not tint. On an API page carrying one of these every third paragraph,
tinting them all would make the page read as an alarm about itself.

Navigation the document asks for
================================

The **toctree** feeds the rail on every manual page, and where a page writes
one in its body it prints there too — as a list of documents to read, which
must not look like the rail beside it saying where the reader is.

**What is on this page** is written by the theme, not by the author. Every
manual page with headings to list gets the contents a ``.. contents::`` would
have made, inserted under the title — the same node the directive builds, so
what happens to it after that is one path and not two. A page whose sections
are one heading gets none, and a landing page gets none: there is nothing to
navigate on the way in. ``.. contents::`` still stands wherever it is written
and wins there, which is how a page asks for a caption, a ``:depth:`` or a
place of its own.

Where the page is at its full measure, that list leaves the column and stands
beside it on the right, resting at the line the rail rests at, so the sections
of the page are reachable from anywhere in it. The column gives the width up
rather than the list taking it, which is why nothing runs underneath. A window
narrower than the page measure has no width to give, and the list is a block
under the title again.

Its entries are built from the current document plus an anchor rather than from
the renderer's link answer, which for the page being rendered is ``#`` — that
is how a local contents ends up as a row of links pointing at nothing.

**Breadcrumbs** sit above the title, from the same tree. **Footnotes** get the
number the compiler assigned rather than the label the author typed, so a mark
in the line and the note at the foot of the page agree — ``[#name]_`` prints
``[1]`` at both ends.

Tables
======

A table becomes ``<sds-table>``, and what the theme writes inside it is the
table's own children — the caption, the ``<colgroup>`` a ``:widths:`` option
worked out, the head and the body, cells and all. A cell carries a link, a
literal or an emphasis, and ``colspan`` and ``rowspan`` are on it; none of that
fits in a property, which is why this is the one component a document hands
markup to rather than values.

It survives because every element is rendered before the page is published:
what the finishing step leaves in the page is the drawn table and, beside it,
the rows in a ``<template>``, which is the one place the parser keeps a
``<thead>`` that is not inside a ``<table>``.

The ``<table>`` itself is the element's, and so is its density and the box it
scrolls in. That box has to be *around* the table: ``overflow-x`` on the table
itself needs ``display: block``, which takes it out of table layout and makes
every table shrink-wrap — a four-column reference sitting in the left third of
the page with nothing beside it. Wrapped, nothing about the table changes, and
it overflows only where its own minimum is wider than the column.

What does not survive is the renderer's own class list — ``colwidths-auto``,
``align-*``, ``grid-*``. No stylesheet here defines them, so they drew nothing
before either. ``:width:`` does survive, as the element's own property.

Pictures
========

``.. figure::`` and ``.. image::`` are the same picture to a reader, and both
become ``<sds-figure>``. What the renderer writes on its own is a bare
``<figure>`` — no frame around the picture, no ground under one that does not
fill the column it was put in, and a caption set as running text at the size of
the prose beside it. A drawing exported on white then stands in a hole on a
dark page, and one exported on nothing has no edge saying where it ends.

The two directives differ in one thing, and it is the caption: a figure is a
picture the author made a claim about, an image is one they dropped in. The
claim is drawn under the frame in the register a caption belongs to, quieter
and smaller than the text; a picture that makes none gets the frame alone,
rather than an empty line under it.

A drawing this system ships is *referenced* into the page and everything else
is linked. That distinction is the element's and it matters here: a referenced
SVG is drawn in the page's own tokens and follows it into dark, while an
``<img>`` renders in a document of its own where none of them are declared. It
costs the drawing one line — ``id="art"`` on its root — and
:doc:`/design-system/artwork` says what else it has to do.

An SVG that never paid it is shown as an image rather than as a blank space:
the finishing step reads the file before it draws the page, and says in the run
which drawings those were. So a picture dropped into a project arrives whatever
was done to it, and the line buys the mode, not the picture.

``:zoomable:`` opens the picture at full size: the frame becomes a press and
the viewer carries the caption into its own head. A picture is drawn at the
width of the column it stands in, which is not the width a diagram was made
for — and this is the option that gives that back. It is written rather than
assumed, because most pictures in a document are read where they stand, and a
press on every one of them offers the same answer down a whole page.

.. code-block:: text

   .. figure:: /_images/pipeline.svg
      :alt: Source, build, published site
      :zoomable:

      What the drawing claims, in the caption the viewer takes with it.

``:target:`` stays a link around the picture, and it is the one place
``:zoomable:`` is ignored: the author's link is already around the whole
picture, and the press would be a second anchor inside it. ``:align:`` is
dropped, for the reason the sidebar is: a measure this narrow has nothing to
float beside.

Embedded documents
==================

``.. youtube::`` and this theme's own ``specimen`` (:doc:`directives`) are the
same node — a document of somebody else's, shown inside this one — and both
become ``<sds-embed>``. Left as the renderer writes it, that node is a bare
``<iframe>``: the browser's own inset ridge around it, no ground under it, and
as wide as the ``width`` option says whatever the column can hold.

The element states which of two shapes the frame has, because an embed has no
proportions of its own to fall back on. A player **fills the column and holds
its ratio** — its native size is what it was authored at and not what it
wants, and 560 pixels of player in a narrower column is a player with its
right-hand side cut off. A specimen **keeps the size it was measured at** and
scrolls below it, the same answer a wide table gets here: a card reflowed to
fit would be documenting a layout the gate never checked.

The frame itself is still written by the renderer, between the element's tags,
and the element lifts it rather than writing a second one — the document is
fetched once, and the page shows its evidence with no script running. It is
never lazy: a frame that loads on scroll is blank in every screenshot taken of
the page, which is the one place somebody looks at all of them at once.

Everything else
===============

What is left is running text — paragraphs, lists, quotes, transitions, inline
literals, the six heading levels — and no template can reach it,
because the renderer writes no name on any of it. That is the document layer's
half of the job, and :doc:`/frontend/documents` is where it is written down.

A heading is the one place both halves meet: the six levels are the document
layer's, and the ``#`` beside one is a template's, because the id it points at
is on the section and only the renderer knows it.

The classes an author writes
============================

``.. container:: whatever`` and ``:class:`` put a name straight into the markup
that no system chose. The name is carried through untouched, and it means
nothing more than it did in the source.

**Nothing here will ever grow a rule that matches one.** A stylesheet that
started drawing ``.a-class-from-the-source`` would make every author's private
vocabulary public API of this design system, and two projects that happened to
pick the same word would be handed each other's design. What is inside the
container is still set, because it is document content; the box around it is
not, because nobody said what it is.

The system's own names are the exception that proves it: they are defined here,
and the class layer is deliberately hand-writable — a surface with no
JavaScript is what it exists for. ``.. container:: sds-panel`` therefore works
and is honest about what it gets: the class layer's drawing of a panel, and not
one thing a component would have added on top of it.

Which template does which
=========================

.. list-table::
   :header-rows: 1

   * - Template
     - What it decides
   * - ``structure/layout``, ``structure/document``
     - the shell, and which body the page's ``:layout:`` field asks for
   * - ``structure/head``
     - the stylesheets, the preloaded faces, the pre-paint mode script
   * - ``structure/header``, ``structure/brand``, ``structure/navigation``
     - the bar: the mark, the sections, the version, search, the mode switch
   * - ``structure/footer``
     - groups, socials, the note
   * - ``structure/sidebar``
     - ``.. sidebar::`` as a topic rather than an admonition
   * - ``structure/header-title``
     - the mark that hands over the place a heading names
   * - ``structure/pager``
     - the pages either side of this one, where a project asked for them
   * - ``body/admonition``
     - the renderer's types onto this system's tones
   * - ``body/code``
     - the caption above the block, and a language floor
   * - ``body/table``
     - ``sds-table``: the rows as markup, the table itself as the element's
   * - ``body/topic``, ``body/directive/topic``
     - both spellings of a topic, as one shape
   * - ``body/version-change``
     - a note, and a tone only for deprecation
   * - ``body/field-list``
     - a docinfo block that is not a data table
   * - ``body/configuration-block``, ``body/directive/tabs``
     - two tab directives onto one element
   * - ``body/directive/confval``
     - the reference entry, and its labels
   * - ``body/directive/glossary``
     - a definition list whose terms can be pointed at
   * - ``body/menu/*``
     - the rail, the trail, the printed toctree, the local contents
   * - ``body/figure``, ``body/image``
     - ``sds-figure``: the frame both get, and the caption only one has
   * - ``body/embedded-frame``
     - ``sds-embed``: the frame a video fills and the size a specimen keeps
   * - ``inline/footnote``
     - the mark that matches the note it points at
   * - ``body/directive/{band,grid}``
     - the landing page — see :doc:`directives`
   * - ``body/directive/card``
     - the cards a manual is signposted with — see :doc:`directives`
   * - ``body/directive/{accordion,accordion-item}``
     - the questions a page folds its answers behind — see :doc:`directives`

Anything not in that list is the renderer's own template, rendering the
renderer's own markup, and it lands on the document layer.
