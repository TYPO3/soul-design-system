:navigation-title: Core markup

================================
Core markup, and what it becomes
================================

Most of a page does not use this theme's directives. It uses the renderer's
own, an admonition, a code block, a table, a ``confval``, and what those
come out as is the theme's real subject. This page says what each one
becomes, and where the answer was a decision, not a mapping.

Nothing here changes what an author writes. The source is ordinary
reStructuredText. The theme stands between it and the markup.

Rendered before the publish
===========================

One arrangement runs under everything below, so it stands here once.

Every template here *addresses* a component, ``<sds-card heading="…">``,
``<sds-nav-rail entry="…">``, and writes none of its markup. That is the
whole point of components. What a card looks like is one file's decision,
and a page this theme renders cannot drift from a page a product wrote.

On its own that costs the reader with no JavaScript everything, because an
element addressed by attributes draws nothing until it upgrades. So the
render happens earlier. ``make guides`` runs every element in the output
through the renderer the design system uses for its specimen cards. It
writes the markup back into the page inside the element's own tag. The
published document already holds the card, the rail and the frame. In a
browser the element upgrades over its own rendering and takes the
behaviour.

What follows is visible from outside:

- **A page works with the script off.** Not a reduced version: the same
  markup, minus the behaviour. A tab bar that cannot switch, a copy button
  that cannot copy.
- **A directive's options are the element's properties.** If a component
  grows one, the directive gains it in the same commit, with the same
  spelling on both sides. Nothing in this theme translates a component.

Component contract
------------------

Every element the theme uses must render in Node. The prerenderer creates
an element and calls its template without browser lifecycle hooks. So a
render cannot depend on ``document``, ``navigator`` or ``customElements``.
``make verify ARGS=ssr`` holds that as a check.

Content has to reach the same template by either route. In a browser the
element lifts what an author wrote between its tags. In a server render
there are no connected children, so the prerenderer passes that markup
through the element's ``content`` property. A component reads the browser
value when it exists and the property otherwise. Anything it decides from
its children, tab labels or a control with only a glyph, must also be a
property. Otherwise the server and the browser reach different answers.

The published element keeps the author's original content in an inert
``<template data-sds-content>`` before its rendered markup. The template is
there even when that content is empty. It tells the upgraded element which
children came from the author and which from its own earlier render.
Without that, the element lifts its rendered frame as input and draws a
second copy around it.

Admonitions
===========

The renderer has more types than this system has tones. The mapping below is
Sphinx's own grouping, not a ladder of severity.

.. list-table::
   :header-rows: 1

   * - Type
     - Tone
   * - ``note``, ``hint``, ``important``, ``seealso``, ``todo``, and any
       generic ``.. admonition::``
     - ``info``, the tone that does not tint
   * - ``tip``
     - ``ok``
   * - ``attention``, ``caution``, ``warning``
     - ``warn``
   * - ``danger``, ``error``
     - ``error``

``important`` sits on the quiet side of that line on purpose. Sphinx splits
these into note-like and warning-like, and ``important`` is emphasis, not a
hazard. An author who writes it means what Sphinx means by it. A mapping
that turns it into an alarm changes what their page says.

**The type's own word survives the mapping.** ``caution`` and ``danger``
both become ``warn``, so the tone no longer tells them apart. But the
glyph's accessible name is the type's word, not the tone's. A reader who
cannot see the colour still hears which one this was.

**No category heading.** Almost none of the types carry a title, and "Note"
over each one is the category name ``sds-note`` forbids as a heading. Where
an author wrote a title, it is theirs and goes in as a label, as text. A
heading is an attribute, and markup inside it arrives as visible angle
brackets. A title that leans on inline markup does a paragraph's job.

Everything an admonition holds, paragraphs, lists, a whole code block, goes
between the element's tags, not into a property. That is the rule the whole
document layer follows here.

Code blocks
===========

**The colour is the server's.** ``guides-code`` highlights with a PHP port
of highlight.js. So what lands in the page already carries ``hljs-``
classes, and ``soul.css`` maps exactly those onto this system's three
syntax colours. The page has its colour with no JavaScript, which is the
point of a generator that ships HTML.

``<sds-code>`` still wraps it, and in a browser it does the same job the
other way round. Markup that already carries ``hljs-`` classes stays as it
is, wrapper, line numbers and emphasised lines included. The element adds
the head, the language label and the copy button. Only a block that arrived
without colour gets it from the element.

.. code-block:: text
   :caption: The caption goes above the block, where this system puts it

   .. code-block:: php
      :caption: config/system.php

      return ['siteTitle' => 'TYPO3'];

TypoScript has colour too
=========================

The PHP port ships no TypoScript grammar, and the theme registers one. So
``.. code-block:: typoscript`` gets its colour on the server like every
other block. The grammar reads the shape of the language, not a list of
names that goes stale a release later. The object path on the left of an
assignment, and an all-caps object type alone on the right. The value, a
``{$constant}``, a ``[condition]``, an ``@import``, and a comment. TypoScript
has a comment only at the start of a line, so a ``#`` in the middle of one
keeps its colour.

It is the same grammar ``<sds-code>`` uses in the browser: one file, written
in the design system and handed to both. So a block does not change colour
the moment a script runs. :doc:`/frontend/components/data` names the
languages the element declares and shows each one set.

A diff changes the body
=======================

``sds-diff`` draws ``.. code-block:: diff``, not ``sds-code``. The same
frame and the same head, and rows with status colour, the one place in this
system a fill marks a line. It is the spelling an author already writes, so
a page that documents an upgrade gets it as it is. ``:caption:`` names the
file the way the element's own ``path`` does.

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

The two file headers of the format stay context, not a line added and a
line removed. The head above them already says which file this is.
Everything else unmarked is context, which covers ``@@`` and ``diff --git``
without a name for either. The server reads the rows, so a reader with no
JavaScript gets the colour too. ``:linenos:`` and ``:emphasize-lines:`` do
not apply. A diff states which lines changed, and a gutter of numbers nobody
cites is decoration.

.. warning::

   A fenced Markdown block with **no language** kills a render. The
   Markdown parser leaves the language ``null``, the highlighter's filter
   declares a string, and the render dies with a ``TypeError`` three
   packages deep. This theme's code template defaults it to ``text``, which
   escapes the block and colours nothing, the honest answer when nobody
   said what it is.

Tabs, in both spellings
=======================

``.. tabs::`` and ``.. configuration-block::`` are two directives with
different markup and the same intent, and both become ``<sds-tabs>``. A
reader must not have to work out which one an author used.

Alone, neither works. The core renders a row of buttons and every panel
under it, and the renderer ships no script to switch them. The element
builds its own tab bar and wires the arrow keys. With JavaScript off the
bar is there and the panels stack open under it. A button that cannot
switch anything must not hide what it switches.

**What ``configuration-block`` is for, and ``.. tabs::`` is not.** The same
setting appears on a page four times, and the reader chooses a language
once. Every block of a document follows the choice, and it outlives the
page: a reader reads a manual across ten of them. That is ``sds-tabs`` with
``sync``, a word the template sets and an author does not. Two blocks of
one document that disagree is the bug it prevents. A ``.. tabs::`` set
beside them, with the author's own labels, follows nothing, and nothing
follows it.

The choice is an order, not a word. A reader who picks ``bash`` in the one
block that offers it still prefers PHP to YAML everywhere else. So every
word they choose stays, most recent first, and each set takes the first of
them it has. A set with none of them keeps the panel it shows.

Reference nodes
===============

.. confval:: an example
   :type: string
   :required: true
   :default: "this one"

   ``confval`` is the backbone of any TYPO3-adjacent reference, and it
   becomes ``sds-confval``; see :doc:`/frontend/components/data`. It has a
   component of its own because a reference is dozens of these in a column.
   How they read together is a design, not a mapping.

The name is mono and carries the anchor, and ``required`` is a badge. The
type, the default and every further option stand in a grid under the name.
Each behind its own label, because "type script" with the type in upper
case reads as the name of a language. A hairline and nothing else separates
an entry: forty boxes in a column are not a list. A ``confval`` holds
blocks, admonitions included, so its description is not one line of text
and does not render as one.

``:type:`` and ``:default:`` parse inline and reach the element as text.
That is a decision, not an oversight. A type is ``array<string>`` as often
as it is a reference, and a value read as markup is a value with half of
itself gone.

**Option lists**, the ``.. option::`` directive of a command-line reference,
and plain **definition lists** come out through the same document-layer
rules. A **field list** at the top of a document, the author-version-date
block, is the one place with a class the core did not write. Without it a
docinfo block is a bare ``<table>``. A bare table in a document is a data
table with ruled rows and a header. It is neither.

Set-apart blocks
================

``.. topic::`` and ``.. sidebar::`` are both an ``<aside>`` on
``.sds-panel``: a hairline, a fill, and a title that labels the box. They
draw alike because they are alike, a digression with a heading. The core
renders ``sidebar`` as an admonition, and that is where it went wrong. An
admonition says something about the reader's situation and carries a glyph
that names which one. A topic says nothing about the reader.

A sidebar does not float here. In a column held to sixty-six characters
there is nothing for it to float beside. A box pulled out of a measure that
narrow leaves both halves too thin to read.

``.. versionadded::``, ``.. versionchanged::`` and ``.. deprecated::`` are
notes, and not loosely. "Changed in version 1.2" is a fact as a heading.
The paragraph under it is what that fact costs a reader today, which is the
shape ``sds-note`` already is.

**Only deprecation carries a tone.** ``warn``
is this system's degraded but usable answer, which is exactly what a
deprecated thing is. The other two are facts about the surface with nothing
wrong, so they are ``info``, the tone that does not tint. On an API page
with one of these every third paragraph, a tint on all of them reads as an
alarm about the page.

Navigation the document asks for
================================

The **toctree** feeds the rail on every manual page. Where a page writes one
in its body, it prints there too, as a list of documents to read. It must
not look like the rail beside it, which says where the reader is.

**What is on this page** comes from the theme, not from the author. Every
manual page with headings to list gets the contents a ``.. contents::``
makes, under the title. It is the same node the directive builds, so what
happens to it after that is one path, not two. A page whose sections are
one heading gets none, and a landing page gets none. There is nothing to
navigate on the way in.

``.. contents::`` still stands wherever an author
writes it and wins there. That is how a page asks for a caption, a
``:depth:`` or a place of its own.

At the page's full measure, that list leaves the column and stands beside
it on the right, at the line the rail rests at. So the
sections of the page are reachable from anywhere in it. The column gives
the width up, and the list does not take it, which is why nothing runs
underneath. A window narrower than the page measure has no width to give,
and the list is a block under the title again.

The list is :ref:`sds-nav-toc <component-sds-nav-toc>`, addressed with the
sections, not written as markup. So it **marks the section the reader has
scrolled to**, a fact about the page no renderer can put in a template.
Above the first heading nothing has the mark, which is where a page opens.

Its entries come from the current document plus an anchor, not from the
renderer's link answer. For the page in render that answer is ``#``, which
is how a local contents ends up as a row of links to nothing.

**Breadcrumbs** sit above the title, from the same tree. **Footnotes** get
the number the compiler assigned, not the label the author typed. So a mark
in the line and the note at the foot of the page agree: ``[#name]_`` prints
``[1]`` at both ends.

Tables
======

A table becomes ``<sds-table>``, and the theme writes the table's own
children inside it. The caption, the ``<colgroup>`` from a ``:widths:``
option, the head and the body, cells and all. A cell carries a link, a
literal or an emphasis, and ``colspan`` and ``rowspan`` stand on it. None
of that fits in a property, which is why this is the one component a
document hands markup to, not values.

It survives because every element renders before the publish. The finishing
step leaves the drawn table in the page and, beside it, the rows in a
``<template>``. That is the one place the parser keeps a ``<thead>``
outside a ``<table>``.

The ``<table>`` itself is the element's, and so is its density and the box
it scrolls in. That box has to be *around* the table. ``overflow-x`` on the
table itself needs ``display: block``, which takes it out of table layout
and shrink-wraps every table. A four-column reference then sits in the left
third of the page with nothing beside it. In a wrapper, nothing about the
table changes, and it overflows only where its own minimum is wider than the
column.

What does not survive is the renderer's own class list: ``colwidths-auto``,
``align-*``, ``grid-*``. No stylesheet here defines them, so they drew
nothing before either. ``:width:`` survives, as the element's own property.

Pictures
========

``.. figure::`` and ``.. image::`` are the same picture to a reader, and
both become ``<sds-figure>``. What the renderer writes on its own is a bare
``<figure>``. No frame around the picture, and no ground under one that
does not fill its column. A caption as text at the size of the prose. A
drawing exported on white then stands in a hole on a dark page. One
exported on nothing has no edge to say where it ends.

The two directives differ in one thing, the caption. A figure is a picture
with the author's claim about it, an image is one they dropped in. The claim
draws under the frame in a caption's register, quieter and smaller than the
text. A picture that makes none gets the frame alone, not an empty line
under it.

Every picture is a link, whatever is in the file: one ``<img>``, and a
drawing in the colours of its file. So a picture dropped into a project
arrives as it is. It is the same picture in light and in dark, on the one
ground drawn for those colours. :doc:`/design-system/artwork` says why
the page does not read it in, and what has to change.

``:zoomable:`` opens the picture at full size. The frame becomes a press,
and the viewer carries the caption into its own head. A picture draws at
the width of its column, which is not the width of a diagram's drawing.
This option gives that back. It is a choice, not a default, because a reader
reads most pictures in a document where they stand. A press on every one of
them offers the same answer down a whole page.

.. code-block:: text

   .. figure:: /_images/pipeline.svg
      :alt: Source, build, published site
      :zoomable:

      What the drawing claims, in the caption the viewer takes with it.

``:target:`` stays a link around the picture, and it is the one place the
theme ignores ``:zoomable:``. The author's link already wraps the whole
picture, and the press is a second anchor inside it. ``:align:`` drops, for
the reason the sidebar's float does. A measure this narrow has nothing to
float beside.

Embedded documents
==================

``.. youtube::`` and this theme's own ``specimen`` (:doc:`directives`) are
the same node, a document of somebody else's inside this one, and both
become ``<sds-embed>``. As the renderer writes it, that node is a bare
``<iframe>``. The browser's own inset ridge around it, no ground under it,
and as wide as the ``width`` option says, whatever the column can hold.

The element states which of two shapes the frame has, because an embed has
no proportions of its own. A player **fills the column and holds its
ratio**. Its native size is the size of its authoring, not what it wants.
560 pixels of player in a narrower column loses its right-hand side. A
specimen **keeps the size of its measurement** and scrolls below it, the
answer a wide table gets here. A card reflowed to fit documents a layout the
gate never checked.

The renderer still writes the frame itself, between the element's tags, and
the element lifts it. It does not write a second one. One fetch of the
document, and the page shows its evidence with no script. It is never
lazy. A frame that loads on scroll is blank in every screenshot of the page,
the one place somebody looks at all of them at once.

Everything else
===============

What remains is text: paragraphs, lists, quotes, transitions, inline
literals, the six heading levels. No template can reach it, because the
renderer writes no name on any of it. That is the document layer's half of
the job, and :doc:`/frontend/documents` writes it down.

A heading is the one place both halves meet. The six levels are the document
layer's. The ``#`` beside one is a template's, because the id it points at is
on the section, and only the renderer knows it.

The classes an author writes
============================

``.. container:: whatever`` and ``:class:`` put a name into the markup that
no system chose. The name goes through as it is, and it means nothing more
than it did in the source.

**Nothing here will ever grow a rule that matches one.** A stylesheet that
draws ``.a-class-from-the-source`` makes every author's private vocabulary
public API of this design system. Two projects with the same word get each
other's design. What is inside the container still gets its style, because
it is document content. The box around it does not, because nobody said
what it is.

The system's own names are the exception that proves it. This system
defines them, and the class layer is hand-writable on purpose. A surface
with no JavaScript is what it exists for. So ``.. container:: sds-panel``
works and is honest about what it gets. The class layer's drawing of a
panel, and not one thing a component adds on top.

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
     - ``.. sidebar::`` as a topic, not an admonition
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
     - a definition list whose terms take a link
   * - ``body/menu/*``
     - the rail, the trail, the printed toctree, the local contents
   * - ``body/figure``, ``body/image``
     - ``sds-figure``: the frame both get, and the caption only one has
   * - ``body/embedded-frame``
     - ``sds-embed``: the frame a video fills and the size a specimen keeps
   * - ``inline/footnote``
     - the mark that matches the note it points at
   * - ``body/directive/{band,grid}``
     - the landing page; see :doc:`directives`
   * - ``body/directive/card``
     - the cards that signpost a manual; see :doc:`directives`
   * - ``body/directive/{accordion,accordion-item}``
     - the questions a page folds its answers behind; see :doc:`directives`

Anything not in that list is the renderer's own template, with the
renderer's own markup, and it lands on the document layer.
