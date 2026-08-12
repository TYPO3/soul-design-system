:navigation-title: Data & machine output

======================
Data & machine output
======================

Lists, code and diffs — everything the machine reads, writes or names. All of
it sets in Source Code Pro at every size, verbatim, and none of it is
title-cased or prettified on the way in.

.. specimen:: components/data/data.card.html
   :viewport: 700x280
   :title: Table, badges & status

sds-table
=========

.. code-block:: html

   <sds-table density="compact" scrollable
     .columns="${[{ head: 'Tool', cls: 'sds-td-name' }, { head: 'Answers' }]}"
     .rows="${[{ cells: ['search', html`<sds-badge tone="ok" label="yes"></sds-badge>`] }]}"
   ></sds-table>

.. confval:: density
   :name: sds-table-density
   :type: "compact" | "medium" | "airy"
   :default: "medium"

   A judgement about the reader, not about the data: compact where the list
   *is* the work and scanning beats reading, airy where the rows are read
   rather than scanned, medium where one table has to serve both.

.. confval:: scrollable
   :name: sds-table-scrollable
   :type: boolean
   :default: false

   Lets a table wider than its column scroll inside itself rather than taking
   the layout with it. A property rather than a wrapper the caller has to
   remember: a class the element cannot emit is a class that invites the markup
   to be written by hand again.

.. confval:: width
   :name: sds-table-width
   :type: string

   How wide the table itself is, where a source said so. The class layer has
   no name for it and cannot have one: it is a fact about these contents
   rather than a kind of table, which is the reason a row carries ``style``
   too.

.. confval:: columns
   :name: sds-table-columns
   :type: "{ head, cls? }[]"

   ``cls`` is the cell class for the whole column — ``sds-td-name`` for the
   identifier the machine owns, ``sds-td-meta`` for anything secondary.

.. confval:: rows
   :name: sds-table-rows
   :type: "{ cells, selected?, style? }[]"

   A cell is text, or a component where it is a piece of state rather than a
   value — the badge that says how a row answered. ``selected`` emits
   ``is-selected``.

.. note::

   The rows may also be **given as markup** — the table's own children, the
   caption and the ``<colgroup>`` included:

   .. code-block:: html

      <sds-table scrollable>
        <caption>What each lookup answers with.</caption>
        <thead><tr><th>Tool</th><th>Source</th></tr></thead>
        <tbody><tr><td><code>typo3_icon_lookup</code></td><td colspan="2">…</td></tr></tbody>
      </sds-table>

   That is the form a renderer uses, and only a renderer: a cell in a document
   carries a link, a literal or an emphasis, ``colspan``, ``rowspan`` and a
   caption have no property at all, and the rows have to be on the page before
   any script runs. What the table *is* — the class, the density, the box it
   scrolls in — stays the element's either way.

   **A page cannot be written that way by hand.** The HTML parser drops a
   ``<thead>`` that is not inside a ``<table>``, so the markup above survives
   only where it is parsed inside a ``<template>`` — which is where the
   finishing step puts it, and what the ``content`` property carries for a
   caller composing the rows in JavaScript. Written by hand, use the
   properties.

.. specimen:: components/data/density.card.html
   :viewport: 700x800
   :title: Table density

.. warning::

   **Never zebra stripes.** A row's background changes on hover or on
   selection and nowhere else — that is what makes a filled row mean something.

sds-code
========

A fenced block, its head and its copy button.

.. specimen:: components/code/code.card.html
   :viewport: 700x360
   :title: Code block & diff

.. code-block:: html

   <sds-code code-lang="bash" copy>
     <div class="sds-code__caption">What a project runs to publish.</div>
     <code>composer require typo3/soul-guides-theme</code>
   </sds-code>

.. confval:: code-lang
   :name: sds-code-code-lang
   :type: string

   The language, lower case as a fence writes it. **Not** ``lang``, which is
   the global attribute naming the *human* language — and since the host is
   ``display: contents``, ``lang="json"`` would send every screen reader to a
   language tag that does not exist for the whole block.

   The languages the highlighter is taught are declared rather than surveyed,
   and the value is open at the edges because it arrives from a Markdown fence:
   refusing to print a word is not a service.

.. confval:: source
   :name: sds-code-source
   :type: string

   A block as text, highlighted by ``code-lang`` exactly as content between the
   tags is. The two are the same block from two kinds of caller: content for a
   renderer that already holds markup, this for one that holds the source — a
   story, or a page that has to render statically.

.. confval:: body
   :name: sds-code-body
   :type: "{ kind, text, code? }[]"

   Styled lines, which no attribute can carry. ``shell`` is a command, and its
   ``$`` prompt is one of the three places ``--accent`` appears; ``ok`` is a
   success line, marked with the mono font's check because emoji are forbidden
   outright; ``comment`` and ``plain`` are literal. ``code`` sets a fragment
   inside the line as a command — a path, a flag, a tool name.

.. confval:: caption
   :name: sds-code-caption
   :type: string

   What the block is, in a sentence, above it. It may also be written between
   the tags as ``<div class="sds-code__caption">`` — the form for a caption
   carrying markup, and for a page read before the element upgrades. Either
   way it belongs to the element, so the element places it.

.. confval:: copy
   :name: sds-code-copy
   :type: boolean
   :default: false

   The copy button. What lands on the clipboard is what the block says and none
   of what frames it — no language, no button label, and no ``$``, which in a
   shell is an error. A browser with no clipboard gets no button: a control
   that cannot do its one job is worse than none.

.. note::

   A block that arrives **already coloured** is left alone. A build that
   highlights on its own hands in finished markup, and colouring it again would
   flatten the spans back to text and rebuild them from fewer grammars. That is
   what lets the Guides theme render every code block on the server and still
   hand it to this element.

.. important::

   No line numbers unless something references them. A gutter nobody cites is
   decoration on the surface with the least room for it.

sds-diff
========

A file's changes, and the one place status colour fills a whole line.

.. code-block:: html

   <sds-diff path="src/styles/components.css"
     .body="${[{ kind: 'del', text: '  box-shadow: 0 1px 2px …' },
               { kind: 'add', text: '  border: 1px solid var(--border-subtle);' }]}"
   ></sds-diff>

.. confval:: path
   :name: sds-diff-path
   :type: string
   :required: true

   The file the diff is of — a path, so it sets in mono.

.. confval:: icon
   :name: sds-diff-icon
   :type: icon id

.. confval:: body
   :name: sds-diff-body
   :type: "{ kind, text }[]"
   :required: true

   ``context``, ``add`` or ``del``. The tint is deliberately faint, so a
   changed line reads as changed without the row becoming the loudest thing on
   the surface.

The frame is the code block's — same border, same head — because a diff is
machine output like any other. What it does not share is the body, which is why
it is an element of its own rather than a mode of ``sds-code``.

sds-confval
===========

One configuration value in a reference: the name a reader searches for, the
facts a machine would check against, and prose that runs to whole blocks.

.. specimen:: components/data/confval.card.html
   :viewport: 700x400
   :title: Configuration values

.. code-block:: html

   <sds-confval name="cache.lifetime" anchor="confval-cache-lifetime"
     type="int" default="86400" required
   >How long a rendered page may be served from cache.</sds-confval>

.. confval:: name
   :name: sds-confval-name
   :type: string
   :required: true

   The value being documented, verbatim. Mono, like everything else the
   machine named, and never prettified.

.. confval:: anchor
   :name: sds-confval-anchor
   :type: string

   Where a link to this one entry lands, and what the mark beside the name
   points at. Without it the entry carries no address and the mark is left
   off — which is what a value excluded from the index wants.

.. confval:: required
   :name: sds-confval-required
   :type: boolean
   :default: false

   A badge beside the name. Stated where it is true and silent where it is
   not: a reference of fifty values, half of them marked "optional", says
   nothing twice as loudly.

.. confval:: type
   :name: sds-confval-type
   :type: string

.. confval:: default
   :name: sds-confval-default
   :type: string

   The two the reference always states, in that order and never alphabetised:
   a reader comparing two entries compares them line by line.

.. confval:: facts
   :name: sds-confval-facts
   :type: "{ label, value }[]"

   Anything else the source named, printed the same way and in the order it
   was named. The label is whatever it was called and is set as a label, so
   ``since`` stays ``since``.

An entry is a hairline and what stands under it — no box, because a reference
is dozens of these in a column and drawn as boxes it stops being a list. The
facts sit in a grid of their own so a long union type wraps inside its column
instead of pushing the labels out of line, and the description keeps every
block it was written with, admonitions included.

.. seealso::

   :doc:`/design-system/type` for the register these blocks set in, and
   :doc:`/guides-theme/markup` for what a documentation renderer's own code
   nodes come out as.
