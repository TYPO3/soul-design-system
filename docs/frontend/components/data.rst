:navigation-title: Data & machine output

======================
Data & machine output
======================

Lists, code and diffs: everything the machine reads, writes or names. All of
it sets in Source Code Pro at every size, verbatim. Nothing here gets title
case or a prettier form on the way in.

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

   A judgement about the reader, not about the data. Compact where the list
   *is* the work and a scan beats a read. Airy where a reader reads the
   rows. Medium where one table has to serve both.

.. confval:: scrollable
   :name: sds-table-scrollable
   :type: boolean
   :default: false

   Lets a table wider than its column scroll inside itself, not take the
   layout with it. A property, not a wrapper the caller has to remember. A
   class the element cannot emit invites hand-written markup.

.. confval:: width
   :name: sds-table-width
   :type: string

   How wide the table itself is, where a source said so. The class layer has
   no name for it and cannot have one. It is a fact about these contents,
   not a kind of table, which is also why a row carries ``style``.

.. confval:: columns
   :name: sds-table-columns
   :type: "{ head, cls? }[]"

   ``cls`` is the cell class for the whole column. ``sds-td-name`` for the
   identifier the machine owns, ``sds-td-meta`` for anything secondary,
   ``sds-td-into`` for the column at the end with the way into the row.

   ``align`` is the edge a reader reads the column down. ``end`` for a
   count, a date or a duration. It stands at the right edge in tabular
   figures, so the digits line up, and **the head goes with it**. A heading
   over a column it does not stand at names the column beside it. There is
   no third value: nobody scans a centred column down an edge.

   ``sds-td-graph`` is the rail of a history. The column draws a line
   through itself, and each row puts a ``sds-graph`` node on it. Hollow,
   ``sds-graph--open``, for a place, not a commit. ``sds-graph--current``
   for where the reader stands, the loudest node on the rail. It says so
   with weight and not with colour. The accent marks three things, and a
   history is not one of them.

   The rail starts at the first node and ends at the last. Past either, it
   points at a history the table does not show. It is a rail and not a
   graph. A history that forks is a drawing, and a table cell cannot hold
   one.

   ``fit`` holds a column to its content. A short hash, a version, a date.
   Left to its share of the table, a seven-character cell sits in a third of
   it. That pushes the column with the reading to the side. The free columns
   take the slack. So a table holds every other column to say which one is
   the reading.

   .. code-block:: js

      [
        { head: 'Commit', cls: 'sds-td-name', fit: true },
        { head: 'Subject' },
        { head: 'When', cls: 'sds-td-meta', align: 'end', fit: true },
      ]

.. confval:: rows
   :name: sds-table-rows
   :type: "{ cells, selected?, style? }[]"

   A cell is text, or a component where it is a piece of state, not a value:
   the badge that says how a row answered. ``selected`` emits
   ``is-selected``.

   A cell can also be ``{ value, note }``: the line a reader reads the row
   by, and under it what is true about it right now. The branch a checkout
   stands on, the changes nobody has committed. The note emits
   ``sds-td-note`` in a meta cell's register, and the cells beside it centre
   on both of its lines. Two facts about one thing belong in one cell. Over
   two columns, the head has to name a relation instead of a fact.

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

   **The way into a row is a control at the end of it.** A list of things
   with a detail behind each gets a column of its own, ``sds-td-into``. No
   head over it, because a head there names the button, not a fact. Held to
   what the control needs, and hard against the end edge. It stands at the
   same place in every row of every table. So a reader travels down one
   column instead of a read for the way in.

   .. code-block:: html

      <sds-table
        .columns="${[{ head: 'Checkout', cls: 'sds-td-name' }, { head: 'State' },
                     { head: '', cls: 'sds-td-into' }]}"
        .rows="${[{ cells: ['13.4-lts', 'running', html`
          <sds-button href="/w/13-4-lts" variant="secondary" size="sm"
                      title="Open 13.4-lts">Open<sds-icon
                      name="actions-arrow-right"></sds-icon></sds-button>`] }]}"
      ></sds-table>

   ``sds-button`` with ``href`` is an **anchor**, and that is the whole
   reason. The middle click, the new tab and the copied address all work,
   and it is one keyboard stop per row. A press handler on the ``<tr>``
   gives none of that and is invisible to the keyboard. A link over the
   whole row is a bigger target, and it takes the row's text selection and
   the ``title`` of every cell with it. The control at the end leaves the
   rest of the row alone. So a cell keeps a link of its own, a tooltip, or a
   value somebody copies.

   A row somebody acts on **in place** carries the control itself, as the
   example above does. ``sds-button`` at ``size="sm"`` beside the name, an
   ``sds-link`` for an address. An ``sds-select`` states ``label`` where it
   has no room for a caption, and asks for its width with ``min-width``.
   None of that is the table's business. A cell takes a component, which is
   why nobody builds a row of controls out of markup by hand.

.. confval:: loading
   :name: sds-table-loading
   :type: boolean
   :default: false

   The wait for the answer. The head stays, because the columns come before
   the rows. The body draws as bars at the height the rows will have,
   so the table keeps its height when they arrive. It emits
   ``sds-table--loading`` and sets ``aria-busy``. Nothing lights up under
   the pointer while it waits, because nothing there answers yet.

   A skeleton is honest only where the shape is certain, and a table with
   declared columns has one. Where it is not, the answer is ``.sds-loading``
   with a spinner, which claims no shape. Nothing under 200ms; see
   :doc:`/design-system/states`.

.. confval:: loading-rows
   :name: sds-table-loading-rows
   :type: number
   :default: 3

   How many bar rows to draw. What the caller knows about the answer, the
   page size it asked for, the count of the last page, not a guess by the
   element.

.. note::

   The rows can also arrive **as markup**: the table's own children, the
   caption and the ``<colgroup>`` included:

   .. code-block:: html

      <sds-table scrollable>
        <caption>What each lookup answers with.</caption>
        <thead><tr><th>Tool</th><th>Source</th></tr></thead>
        <tbody><tr><td><code>typo3_icon_lookup</code></td><td colspan="2">…</td></tr></tbody>
      </sds-table>

   That is the form a renderer uses, and only a renderer. A cell in a
   document carries a link, a literal or an emphasis. ``colspan``,
   ``rowspan`` and a caption have no property. And the rows have to be on
   the page before a script runs. What the table *is*, the class, the
   density, the box it scrolls in, stays the element's either way.

   **Nobody can write a page that way by hand.** The HTML parser drops a
   ``<thead>`` outside a ``<table>``. So the markup above survives only in a
   ``<template>``. That is where the finishing step puts it, and what the
   ``content`` property carries for a caller who composes rows in
   JavaScript. By hand, use the properties.

.. specimen:: components/data/density.card.html
   :viewport: 700x887
   :title: Table density

.. warning::

   **Never zebra stripes.** A row's background changes on hover or on
   selection and nowhere else. That is what makes a filled row mean
   something.

.. _component-sds-facts:

sds-facts
=========

A block of facts, scanned down the terms. Two columns, the terms down one
edge and their values down the other. A reader scans this: down the names
to the one they came for. Stacked, they read every pair.

.. code-block:: html

   <sds-facts>
     <dt>Target</dt>
     <dd><span class="sds-mono">main</span> · <span class="sds-mono">2.4</span></dd>
     <dt>State</dt>
     <dd><sds-badge label="mergeable" tone="ok"></sds-badge></dd>
   </sds-facts>

   <sds-facts entries='[{ "term": "Read", "value": "2026-09-11", "note": "in a worktree of its own" }]'></sds-facts>

The pairs stand between the tags as ``<dt>`` and ``<dd>``, because a value
carries a link, a badge or a literal, and no property can. A line about a
value that is not part of it is ``sds-facts__note``, under the value.

.. confval:: entries
   :name: sds-facts-entries
   :type: "{ term, value, note? }[]"

   The pairs as data, from a caller that holds the strings or a static
   render, which has no children. ``note`` is the line under the value.

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

   The language, lower case as a fence writes it. **Not** ``lang``, the
   global attribute for the *human* language. ``lang="json"`` sends every
   screen reader to a language tag that does not exist, and the whole block
   inherits it.

   The list of languages is a declaration, not a survey, and the value is
   open at the edges because it arrives from a Markdown fence. A refusal to
   print a word is not a service. A word outside the list prints without
   colour.

   The whole list, as a fence writes it:

   ``bash``, ``css``, ``diff``, ``html``, ``javascript``, ``json``,
   ``markdown``, ``php``, ``scss``, ``sql``, ``text``, ``tsconfig``,
   ``twig``, ``typescript``, ``typoscript``, ``xml``, ``yaml``

   ``text`` colours nothing, the honest answer when nobody said what a block
   is. ``typoscript`` is a grammar this system wrote itself, because
   highlight.js ships none. The rendered site gets the same file, so a block
   keeps its colour when the script runs. ``tsconfig`` is that grammar under
   the name of the backend's half of the language. Each has a block of its
   own in the *Languages* story, which holds the list and feeds the suite.

.. confval:: source
   :name: sds-code-source
   :type: string

   A block as text, coloured by ``code-lang`` exactly like content between
   the tags. The two are the same block from two kinds of caller. Content
   for a renderer that holds markup, this for one that holds the source: a
   story, or a page with a static render.

.. confval:: body
   :name: sds-code-body
   :type: "{ kind, text, code? }[]"

   Styled lines, which no attribute can carry. ``shell`` is a command, and
   its ``$`` prompt is one of the three places ``--accent`` appears. ``ok``
   is a success line, with the mono font's check, because emoji are out.
   ``comment`` and ``plain`` are literal. ``remark`` is a reader's sentence
   in the run of lines; ``remarks`` is the form a page writes. ``code`` sets a fragment inside
   the line as a command: a path, a flag, a tool name.

.. confval:: remarks
   :name: sds-code-remarks
   :type: "{ line, text }[]"

   Sentences about lines of the block: a review's findings at the code,
   each one ready for the review tool. ``line`` counts as the file does,
   from ``start``. The block draws the numbers, marks the cited line's
   number in the page's ink, and lists the sentences under itself, each
   with its number. A line the block does not have lands at the nearer
   edge, so a wrong number is a thing a reader sees.

   A remark is prose, so it stands outside the machine's box. The block
   stays what the machine wrote, and the number is the way from the
   sentence to the line. None of it goes to the clipboard.

   For a block that arrives as ``source`` or as text between the tags. A
   block that arrives with its colour stays as it is, remarks included.

.. confval:: start
   :name: sds-code-start
   :type: number

   The number the first line has in its file. With it the block draws the
   numbers, because something cites them: a caption, a finding. A remark
   cites one too, so remarks draw them from one where there is no
   ``start``. Without either there is no gutter, as nothing refers to one.

.. confval:: caption
   :name: sds-code-caption
   :type: string

   What the block is, in a sentence, above it. It can also stand between the
   tags as ``<div class="sds-code__caption">``: the form for a caption with
   markup, and for a page read before the element upgrades. Either way it
   belongs to the element, so the element places it.

.. confval:: copy
   :name: sds-code-copy
   :type: boolean
   :default: false

   The copy button. What lands on the clipboard is what the block says and
   none of its frame. No language, no button label, and no ``$``, which in a
   shell is an error. A browser with no clipboard gets no button. A control
   that cannot do its one job is worse than none.

.. confval:: action
   :name: sds-code-action
   :type: markup

   An affordance in the head that is **not** the copy button: a filename, a
   count, a link to the file. It stands where that button stands, so the two
   are an either-or. For a copy, set ``copy`` and let the component own it.

.. note::

   A block that arrives **with its colour** stays as it is. A build that
   highlights on its own hands in complete markup. A second pass flattens
   the spans back to text and rebuilds them from fewer grammars. That is
   what lets the Guides theme colour every code block on the server and
   still hand it to this element.

.. important::

   No line numbers unless something references them. A gutter nobody cites
   is decoration on the surface with the least room for it.

.. specimen:: components/data/tree.card.html
   :viewport: 700x602
   :title: Directory tree

.. _component-sds-tree:

sds-tree
========

A directory, in the shape it has on disk. A nested list, because that is
what a tree is: a name, and what is under it.

.. code-block:: html

   <sds-tree level="2" .entries="${[
     { label: 'docs/', note: 'the sources', items: [{ label: 'Index.rst' }] },
   ]}"></sds-tree>

It folds **without a script**. A ``<details>`` per directory, so a page
from a server opens and closes for a reader who runs nothing. Find-in-page
opens the directory it lands in. A document writes :ref:`the directive
<directives>`. This is the element under it.

.. confval:: entries
   :name: sds-tree-entries
   :type: "{ label, note?, items? }[]"

   ``label`` is the name. **A directory has its slash.** That is how a
   reader tells an empty one from a file, and the only place to say it. An
   entry with nothing under it looks the same either way.

   ``note`` is what it is for, beside the name. A tree drawn as preformatted
   text lines that annotation up with spaces, which is why those trees go
   stale. One name changes by a character, and every line under it is wrong.

   ``items`` is what is under it. Nothing, and it is a leaf.

.. confval:: level
   :name: sds-tree-level
   :type: integer
   :default: 2

   How deep it stands **open**. Nothing drops below it. What is deeper
   folds, which a reader can undo. It does not hide, which they cannot.

.. confval:: icons
   :name: sds-tree-icons
   :type: flag

   Mark a directory and a file as such. Off by default. The fold says which
   is which wherever there is anything to fold, and a wall of glyphs down a
   short tree is decoration.

.. _component-sds-copy:

sds-copy
========

A value the reader takes away. A path, a database name, a password. What it
says in the machine's own font, and the button that puts it on the
clipboard, on one line.

.. code-block:: html

   <sds-copy label="Directory" value="~/projects/blog/.worktrees/14-3-dev"></sds-copy>

:ref:`sds-code <component-sds-code>` is the other shape and the wrong one
for this. It frames a fence and gives it a head. Around a single word that
head is a bar with nothing in it but the word ``copy``. Four of them down a
column is four frames for four words. A block is for a block.

The shape it stands in is a **definition list**. A block of them is
:ref:`sds-facts <component-sds-facts>`: the terms down one edge, their
values down the other. That is what anything falls into when it names
things, and why this element has no term of its own.

Two lists in one column go in a ``.sds-facts-set``, with the labels between
them. Apart, they size their term columns on their own. Their values then
rest at two different edges, the one thing a list to scan must not do. The
set holds one pair of columns, and the lists borrow them. The label cannot
go inside the ``<dl>``: a definition list takes only terms and values, and
a browser and an audit both say so.

A line about a value is
``sds-facts__note``, under the value. A note at the foot of the block stands
beside nothing it is about.

.. confval:: value
   :name: sds-copy-value
   :type: string
   :required: true

   What shows, and the whole of what the button writes. Nothing frames it,
   so nothing has to come off on the way to the clipboard.

.. confval:: label
   :name: sds-copy-label
   :type: string

   What the value is. It becomes ``Copy <label>``, the tooltip and the
   accessible name from one property. So a reader who cannot see the lines
   tells four buttons down a column apart. Without it the button says only
   that it copies, which is true and names nothing.

.. confval:: ellipsis
   :name: sds-copy-ellipsis
   :type: "none" | "start" | "end"
   :default: "none"

   Which end of the value gives way where the column is too narrow. ``start``
   cuts the front and keeps the name a path ends on. ``end`` cuts the back
   and keeps the root it starts at. The default wraps the value under
   itself, the only form that stays readable whole.

   The side is the caller's, because the answer is the value's. A worktree's
   last segment tells it apart, a key's first. A component that chose for
   both is wrong about one. It draws ``sds-copy--ellipsis-start`` or
   ``sds-copy--ellipsis-end`` on the row.

   The front cut is the row run the other way, with the value isolated
   inside it. So the box turns around and the value never does. The cut part
   is still under the pointer, and the press writes the property, not the
   drawing. A cut value reaches the clipboard whole.

The press **always draws**. ``navigator.clipboard`` exists only in a secure
context. A design system's review happens over http on a LAN address or a
``.test`` domain as often as on localhost. Where the API is absent, the
value goes by the older way, which every browser has and no context
withholds. The copy button of :ref:`sds-code <component-sds-code>` does the
same.

The press is **one glyph**, and its sentence is in ``title``: the accessible
name and the words under the pointer from one attribute. A value stands in
a list of values, and the word ``Copy`` beside every one is the same word
four times, furniture, not a label.

A press that worked says so. The glyph becomes a check, and a reader who
cannot see that hears it. A press that changed a glyph and nothing else is a
press they never hear about.

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

   The file of the diff. A path, so it sets in mono.

.. confval:: icon
   :name: sds-diff-icon
   :type: icon id

.. confval:: body
   :name: sds-diff-body
   :type: "{ kind, text }[]"
   :required: true

   ``context``, ``add`` or ``del``. The tint is faint on purpose. A changed
   line reads as changed without the row as the loudest thing on the
   surface.

The frame is the code block's, same border, same head, because a diff is
machine output like any other. The body is its own, which is why it is an
element of its own and not a mode of ``sds-code``.

.. _component-sds-confval:

sds-confval
===========

One configuration value in a reference: the name a reader searches for, the
facts a machine checks against, and prose that runs to whole blocks.

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

   The value under documentation, verbatim. Mono, like everything the
   machine named, and never prettified.

.. confval:: anchor
   :name: sds-confval-anchor
   :type: string

   Where a link to this one entry lands, and what the mark beside the name
   points at. Without it the entry has no address and no mark, which is what
   a value outside the index wants.

.. confval:: required
   :name: sds-confval-required
   :type: boolean
   :default: false

   A badge beside the name. Stated where true and silent where not. A
   reference of fifty values, half of them "optional", says nothing twice as
   loudly.

.. confval:: type
   :name: sds-confval-type
   :type: string

.. confval:: default
   :name: sds-confval-default
   :type: string

   The two the reference always states, in that order, never alphabetical.
   A reader who compares two entries compares them line by line.

.. confval:: facts
   :name: sds-confval-facts
   :type: "{ label, value }[]"

   Anything else the source named, printed the same way and in the source's
   order. The label is the source's word, set as a label, so ``since`` stays
   ``since``.

.. confval:: body
   :name: sds-confval-body
   :type: string | markup

   The description, where a caller holds it as one string. Out of a document
   it is blocks, paragraphs, a list, an admonition, and those stand between
   the tags instead. The entry keeps every one of them.

An entry is a hairline and what stands under it. No box, because a reference
is dozens of these in a column, and as boxes it stops as a list. The facts
sit in a grid of their own, so a long union type wraps inside its column and
the labels stay in line. The description keeps every block it came with,
admonitions included.

.. seealso::

   :doc:`/design-system/type` for the register these blocks set in, and
   :doc:`/guides-theme/markup` for what a documentation renderer's own code
   nodes come out as.
