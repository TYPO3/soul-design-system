:navigation-title: Data & machine output

======================
Data & machine output
======================

Lists, code and diffs — everything the machine reads, writes or names. All of
it sets in Source Code Pro at every size, verbatim, and none of it is
title-cased or prettified on the way in.

.. specimen:: components/data/data.card.html
   :viewport: 700x346
   :title: Table, badges & status

.. _component-sds-table:

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
   identifier the machine owns, ``sds-td-meta`` for anything secondary,
   ``sds-td-into`` for the column at the end that carries the way into the
   row.

   ``align`` is which edge the column is read down. ``end`` for a count, a date
   or a duration: it stands at the right edge and is set in tabular figures, so
   the digits line up under each other, and the **head goes with it** — a
   heading over a column it does not stand at names the column beside it. There
   is no third value: a centred column is scanned down neither edge.

   ``sds-td-graph`` is the rail a history is read down: the column draws a line
   through itself and each row puts a ``sds-graph`` node on it, hollow —
   ``sds-graph--open`` — for a place rather than a commit, and
   ``sds-graph--current`` for where the reader is standing, which is the loudest
   node on the rail. It says so with weight and not with colour: the accent
   marks three things and a history is not one of them. The rail begins at
   the first node and ends at the last, because run past either it points at a
   history the table is not showing. It is a rail and not a graph: a history
   that forks is a drawing, and a table cell cannot hold one.

   ``fit`` holds a column to what it holds. A short hash, a version, a date:
   left to its share of the table a seven-character cell sits in a third of it
   and the column carrying the reading is pushed off to the side. What is not
   held takes the slack, so a table says which column is the reading by holding
   every other one.

   .. code-block:: js

      [
        { head: 'Commit', cls: 'sds-td-name', fit: true },
        { head: 'Subject' },
        { head: 'When', cls: 'sds-td-meta', align: 'end', fit: true },
      ]

.. confval:: rows
   :name: sds-table-rows
   :type: "{ cells, selected?, style? }[]"

   A cell is text, or a component where it is a piece of state rather than a
   value — the badge that says how a row answered. ``selected`` emits
   ``is-selected``.

   A cell may also be ``{ value, note }`` — the line the row is read by, and
   under it what is true about it right now: the branch a checkout stands on,
   the changes nobody has committed. The note emits ``sds-td-note`` and is set
   in the register a meta cell is set in, and the cells beside it are centred
   on both of its lines. Two facts about one thing belong in one cell; over two
   columns the head has to name a relationship instead of a fact.

   .. code-block:: html

      <sds-table
        .columns="${[{ head: 'Checkout', cls: 'sds-td-name' }, { head: 'PHP' }]}"
        .rows="${[{ cells: [
          { value: html`13.4-lts <sds-button variant="ghost" size="sm">Open</sds-button>`,
            note: 'main · 2 uncommitted changes' },
          html`<sds-select label="PHP for 13.4-lts" size="sm" min-width="88"
            value="8.4" .options="${['8.3', '8.4']}"></sds-select>`,
        ] }]}"
      ></sds-table>

   **The way into a row is a control at the end of it.** A list of things with
   a detail behind each of them gets a column of its own, marked
   ``sds-td-into``: no head over it — a head there would have to name the
   button rather than a fact — held to what the control needs and hard against
   the end edge. It stands at the same place in every row of every table, so a
   reader travels down one column instead of reading for the way in.

   .. code-block:: html

      <sds-table
        .columns="${[{ head: 'Checkout', cls: 'sds-td-name' }, { head: 'State' },
                     { head: '', cls: 'sds-td-into' }]}"
        .rows="${[{ cells: ['13.4-lts', 'running', html`
          <sds-button href="/w/13-4-lts" variant="secondary" size="sm"
                      title="Open 13.4-lts">Open<sds-icon
                      name="actions-arrow-right"></sds-icon></sds-button>`] }]}"
      ></sds-table>

   ``sds-button`` carrying ``href`` is an **anchor**, which is the whole reason
   it is one: the middle click, the new tab and the copied address all work,
   and it is one keyboard stop per row. A press handler on the ``<tr>`` gives
   back none of that and is invisible to the keyboard; a link stretched over
   the whole row is a bigger target and takes the row's text selection and the
   ``title`` of every cell it covers with it. The control at the end leaves the
   rest of the row alone, which is what lets a cell keep a link of its own, a
   tooltip, or a value somebody copies.

   A row somebody acts on **in place** carries the control itself, as the   A row somebody acts on **in place** carries the control itself, as the
   example above does:
   ``sds-button`` at ``size="sm"`` beside the name, an ``sds-link`` for an
   address, an ``sds-select`` that states ``label`` where it has no room for a
   caption and asks for what the column can give it with ``min-width``. None
   of that is the table's business — a cell takes a component, which is why a
   row of controls never has to be built out of markup by hand.

.. confval:: loading
   :name: sds-table-loading
   :type: boolean
   :default: false

   Waiting for the answer. The head stays — the columns are known before the
   rows are — and the body is drawn as bars at the height the rows will have,
   so the table does not change height the moment they arrive. It emits
   ``sds-table--loading`` and sets ``aria-busy``; nothing lights up under the
   pointer while it waits, because nothing there answers yet.

   A skeleton is honest only where the shape is already known, which a table
   with declared columns has. Where it is not, the answer is ``.sds-loading``
   with a spinner instead — it claims no shape at all. Nothing under 200ms:
   see :doc:`/design-system/states`.

.. confval:: loading-rows
   :name: sds-table-loading-rows
   :type: number
   :default: 3

   How many bar rows to draw. What the caller knows about the answer — the
   page size it asked for, the count the last page came back with — rather
   than a number the element could only guess at.

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
   :viewport: 700x887
   :title: Table density

.. warning::

   **Never zebra stripes.** A row's background changes on hover or on
   selection and nowhere else — that is what makes a filled row mean something.

.. _component-sds-code:

sds-code
========

A fenced block, its head and its copy button.

.. specimen:: components/code/code.card.html
   :viewport: 700x370
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
   the global attribute naming the *human* language: ``lang="json"`` would send
   every screen reader to a language tag that does not exist, and inherit to the
   whole block from there.

   The languages the highlighter is taught are declared rather than surveyed,
   and the value is open at the edges because it arrives from a Markdown fence:
   refusing to print a word is not a service. A word that is not one of these
   is printed, and printed uncoloured.

   The whole list, as a fence writes it:

   ``bash``, ``css``, ``diff``, ``html``, ``javascript``, ``json``,
   ``markdown``, ``php``, ``scss``, ``sql``, ``text``, ``tsconfig``,
   ``twig``, ``typescript``, ``typoscript``, ``xml``, ``yaml``

   ``text`` is declared and colours nothing, which is the honest answer when
   nobody said what a block is. ``typoscript`` is a grammar this system wrote
   itself — highlight.js ships none — and the rendered site is handed the same
   file, so a block does not change colour when the script runs. ``tsconfig``
   is that same grammar under the name the backend's half of the language is
   written under. Each of them
   is set in a block of its own in the *Languages* story, which is where the
   list is kept and what the suite reads.

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

.. confval:: action
   :name: sds-code-action
   :type: markup

   An affordance in the head that is **not** the copy button — a filename, a
   count, a link to the file. It stands where that button would, so the two are
   an either-or: for copying, set ``copy`` and let the component own it.

.. note::

   A block that arrives **already coloured** is left alone. A build that
   highlights on its own hands in finished markup, and colouring it again would
   flatten the spans back to text and rebuild them from fewer grammars. That is
   what lets the Guides theme render every code block on the server and still
   hand it to this element.

.. important::

   No line numbers unless something references them. A gutter nobody cites is
   decoration on the surface with the least room for it.

.. specimen:: components/data/tree.card.html
   :viewport: 700x602
   :title: Directory tree

.. _component-sds-tree:

sds-tree
========

A directory, as the shape it has on disk. A nested list, because that is what a
tree is: a name, and what is under it.

.. code-block:: html

   <sds-tree level="2" .entries="${[
     { label: 'docs/', note: 'the sources', items: [{ label: 'Index.rst' }] },
   ]}"></sds-tree>

It folds **without a script**. A ``<details>`` per directory, so a page rendered
on a server and served to a reader who runs nothing still opens and closes, and
find-in-page opens the directory it lands in. What a document writes is
:ref:`the directive <directives>`; this is the element under it.

.. confval:: entries
   :name: sds-tree-entries
   :type: "{ label, note?, items? }[]"

   ``label`` is what it is called. **A directory is written with its slash** —
   that is how a reader tells an empty one from a file, and the only place it
   can be said, because an entry with nothing under it looks the same either
   way.

   ``note`` is what it is for, beside the name. It is the annotation a tree
   drawn as preformatted text lines up by counting spaces, which is the reason
   those trees go stale: one name changes by a character and every line under
   it is wrong.

   ``items`` is what is under it. Nothing, and it is a leaf.

.. confval:: level
   :name: sds-tree-level
   :type: integer
   :default: 2

   How deep it stands **open**. Nothing is dropped below it: what is deeper is
   folded, which a reader can undo, rather than hidden, which they cannot.

.. confval:: icons
   :name: sds-tree-icons
   :type: flag

   Mark a directory and a file as such. Off by default: the fold says which is
   which wherever there is anything to fold, and a wall of glyphs down the left
   of a short tree is decoration.

.. _component-sds-copy:

sds-copy
========

A value the reader takes away. A path, a database name, a password: what it
says in the machine's own font, and the button that puts it on the clipboard,
on one line.

.. code-block:: html

   <sds-copy label="Directory" value="~/projects/blog/.worktrees/14-3-dev"></sds-copy>

:ref:`sds-code <component-sds-code>` is the other shape and the wrong one for
this. It frames a fence and gives it a head, and around a single word that head
is a bar with nothing in it but the word ``copy`` — four of them down a column
is four frames for four words. A block is for a block.

The shape it is used in is a **definition list**, and where it is a block of
them the list is ``.sds-facts``: the terms down one edge and their values down
the other. That is what anything falls into when it names things, and it is why
this element carries no term of its own.

Two lists in one column go in a ``.sds-facts-set``, with the labels between
them. Apart they size their term columns separately and their values come to
rest at two different edges, which is the one thing a list meant to be scanned
may not do; the set holds one pair of columns and the lists borrow them. The
label cannot go inside the ``<dl>`` — a definition list takes only its own
terms and values, and a browser and an audit both say so. A line saying what is true
about a value is ``sds-facts__note``, under the value: a note at the foot of
the block stands beside nothing it is about.

.. confval:: value
   :name: sds-copy-value
   :type: string
   :required: true

   What is shown, and the whole of what the button writes. Nothing frames it,
   so nothing has to be stripped back off on the way to the clipboard.

.. confval:: label
   :name: sds-copy-label
   :type: string

   What the value is. It becomes ``Copy <label>`` — the tooltip and the
   accessible name from the one property, so four buttons down a column can be
   told apart by somebody who cannot see which line each one is on. Without it
   the button says only that it copies, which is true and names nothing.

The press is **always drawn**. ``navigator.clipboard`` exists only in a secure
context, and a design system is looked at over http on a LAN address or a
``.test`` domain as often as on localhost — asking for the API and drawing
nothing where it is missing left no icon, no press and no hover on exactly the
surfaces this is reviewed on. Where it is not there the value goes by the older
way, which every browser has and no context withholds. The same is true of
:ref:`sds-code <component-sds-code>`'s copy button, which had the same fault.

The press is **one glyph**, and its sentence is in ``title`` — the accessible
name and the words under the pointer from the one attribute. A value stands in
a list of values, and the word ``Copy`` beside every one of them is the same
word four times, which is furniture rather than a label.

A press that worked says so — the glyph becomes a check, and a reader who
cannot see that is told out loud, because a press that changed a glyph and
nothing else is a press they never hear about.

.. _component-sds-diff:

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

.. _component-sds-confval:

sds-confval
===========

One configuration value in a reference: the name a reader searches for, the
facts a machine would check against, and prose that runs to whole blocks.

.. specimen:: components/data/confval.card.html
   :viewport: 700x388
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

.. confval:: body
   :name: sds-confval-body
   :type: string | markup

   The description, where a caller holds it as one string. Out of a document it
   is blocks — paragraphs, a list, an admonition — and those are written
   between the tags instead, which is what the entry keeps every one of.

An entry is a hairline and what stands under it — no box, because a reference
is dozens of these in a column and drawn as boxes it stops being a list. The
facts sit in a grid of their own so a long union type wraps inside its column
instead of pushing the labels out of line, and the description keeps every
block it was written with, admonitions included.

.. seealso::

   :doc:`/design-system/type` for the register these blocks set in, and
   :doc:`/guides-theme/markup` for what a documentation renderer's own code
   nodes come out as.
