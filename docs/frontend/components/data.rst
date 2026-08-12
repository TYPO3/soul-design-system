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

.. confval:: columns
   :name: sds-table-columns
   :type: "{ head, cls? }[]"
   :required: true

   ``cls`` is the cell class for the whole column — ``sds-td-name`` for the
   identifier the machine owns, ``sds-td-meta`` for anything secondary.

.. confval:: rows
   :name: sds-table-rows
   :type: "{ cells, selected?, style? }[]"
   :required: true

   A cell is text, or a component where it is a piece of state rather than a
   value — the badge that says how a row answered. ``selected`` emits
   ``is-selected``.

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

.. seealso::

   :doc:`/design-system/type` for the register these blocks set in, and
   :doc:`/guides-theme/markup` for what a documentation renderer's own code
   nodes come out as.
