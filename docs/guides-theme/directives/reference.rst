:navigation-title: Reference

=========
Reference
=========

What a reader looks up and cites.

facts
=====

A block of facts, scanned down the terms. The body is a field list, which
is the shape a name-and-value pair already has in the source.

.. example:: The facts of a change

   .. facts::

      :Change: `1482 <https://example.org/c/1482>`__ · patch set 2
      :Target: ``main`` · ``2.4``
      :Read: 2026-09-11, in a worktree of its own

The field's name is the term and its body the value, and a value carries a
link, a literal or a badge. The element is ``sds-facts`` in
:doc:`/frontend/components/data`.

directory-tree
==============

A directory, in the shape it has on disk, in the spelling a TYPO3 manual
already uses. So a page written for the other theme renders here as it is.

A nested list, because that is what a tree is. **The name is the first
literal in an item, and the rest of the line is what it is for.** A filename
is a literal anyway, and prose after it is prose about it, so there is no
syntax of this directive's own to learn. An item with no literal is a name
and nothing else.

.. example:: What a project renders from, and what it gets back

   .. directory-tree::
      :level: 2

      * ``docs/`` the sources, as a project already writes them

        * ``Index.rst``
        * ``guides.xml`` the theme, the mark and the versions

      * ``site/`` what the render writes, and what is published

        * ``index.html``
        * ``styles/`` the drop-in, copied there by the finishing step

          * ``soul.css``
          * ``soul.js``

The fold is ``<details>``, so it works before a script runs and
find-in-page opens the directory it lands in. This replaces the tree as a
text block with its notes lined up with spaces. That alignment goes wrong
the moment one name changes by a character, and a reader with a narrow
window never sees it straight.

.. confval:: level
   :name: directory-tree-level
   :type: integer
   :default: 2

   How deep it stands **open**. Nothing drops below it. What is deeper
   folds, which a reader can undo. A level past the depth of the tree opens
   the whole of it.

   The theme this spelling comes from stops the *draw* below the level
   instead. That takes away what a reader came for and gives them no way to
   ask for it. A page that set it for that reason still renders here, with
   the deep part folded, not gone.

.. confval:: show-file-icons
   :name: directory-tree-show-file-icons
   :type: flag

   Mark a directory and a file as such. Off by default. The fold says which
   is which wherever there is anything to fold, and a wall of glyphs down a
   short tree is decoration. The slash in its name tells an empty directory
   apart.

diagram
=======

A drawing, written as the text that describes it. The body is the text of a
``.diagram`` file as it is, one statement per line, and
:doc:`/design-system/diagrams/index` names its statements. The directive takes
the body raw, so the parser of reStructuredText never reads it. It draws
:ref:`sds-diagram <component-sds-diagram>`, and the finishing step renders
the drawing before the page ships.

.. example:: A drawing from the text under the directive

   .. diagram::

      tiles
      title "Needs met and open"
      description "Two counts of needs."
      tile "9" "met"
      tile "23" "open" emphasis

A text the grammar refuses draws the refusal in the place of the drawing.
The message names the line or the part, so the author sees it on the page
they wrote. The finishing step then fails, so the page does not ship. The
Markdown twin holds the text in a fenced block. The drawing
has no caption and no frame of its own: the text of the document around it
says what it claims.

.. confval:: name
   :name: diagram-name
   :type: string

   The prefix of the ids inside the drawing. Two drawings with the same text
   on one page need two names.

.. confval:: caption
   :name: diagram-caption
   :type: string

   The claim of the drawing. With it, the drawing stands in
   ``sds-figure``, with the caption under it. The frame and the caption are
   the figure's.

.. confval:: label
   :name: diagram-label
   :type: string

   On a slide of the ``row`` layout, the word over the drawing: what it
   shows, such as the product of a comparison.

.. confval:: file
   :name: diagram-file
   :type: string

   A ``.diagram`` file to read the text from, relative to the document,
   or to the documentation root with a leading ``/``. The directive then
   has no body. A path that leads nowhere stops the render.

.. confval:: canvas
   :name: diagram-canvas
   :type: string

   The size of the drawing: ``940`` for the width of its column, ``940,480`` for
   a height too. It stands over the size in the text.

.. confval:: margin
   :name: diagram-margin
   :type: number

   The free space on every side of the drawing. It stands over the margin in the
   text.

.. confval:: zoomable
   :name: diagram-zoomable
   :type: flag

   A press on the drawing opens it at the size of the window, in the
   page's tokens. For a drawing too dense to read in the column.

swatch
======

One colour of a palette: the chip, its name, and what it resolves to.

.. example:: A palette, at the width a colour holds

   .. grid:: wide

      .. swatch:: var(--accent)
         :name: --accent
         :resolved: #FF8700

      .. swatch:: var(--text-primary)
         :name: --text-primary
         :resolved: light-dark(#1C1A17, #F1EDE6)

      .. swatch:: var(--border-subtle)
         :name: --border-subtle
         :resolved: light-dark(#E3DFD6, #3D3932)
         :kind: line

.. confval:: the argument
   :name: swatch-value
   :type: string
   :required: true

   What paints the chip: a token as written, ``var(--accent)``, or a literal
   where the value belongs to a mode the page is not in. It is the argument
   because it is what the line is about. **Anything that is not a colour
   drops out, and nothing paints it.** The value arrives from a document,
   and a style attribute is not where a theme finds out what it is.

.. confval:: name
   :name: swatch-name
   :type: string

   The name of the colour. The token where there is one, because that is
   the name a design writes. The human name where the palette has no
   tokens.

.. confval:: resolved
   :name: swatch-resolved
   :type: string

   What that name resolves to, in full. A token alone documents half the
   system. The value is the half that says what the mode did with it, and a
   pair stands as the pair: ``light-dark(#FFFFFF, #1D1B18)``.

.. confval:: kind
   :name: swatch-kind
   :type: string

   ``fill`` (the default) or ``line``. A hairline is a colour too and cannot
   show as a fill. At one pixel a value is invisible, and as a fill it is a
   different job by the same number. ``line`` makes the chip its own edge,
   with the page's ground inside it.

**There is no body.** A colour that needs a paragraph carries a rule about
where it can appear. That rule is prose beside the palette, not inside one
entry of it.

**A palette is a set**, so it goes in ``grid`` like any other. At ``wide``,
the width a name and a ``light-dark()`` pair under it hold. The element is
``sds-swatch`` in :doc:`/frontend/components/content`.

register
========

A list a reader cites: numbered, addressed, and scanned at a glance first.
The entries stand in the body in any order. The register numbers them when
the page renders, sorts them into their groups, and writes every one into
one table first. Every entry with a ``:todo:`` goes into a second table, the
work the list asks for. No line of the document says a number.

.. example:: A review's findings, two of them

   .. register::
      :name: findings
      :prefix: F
      :todo-prefix: T
      :findings:

      .. entry:: The unit suite for the lookup fails
         :group: blocks
         :origin: introduced by this change
         :todo: Adapt the four tests that expect the second read.

         Every case that resolves one key twice fails.

      .. entry:: The key stays the file's own identifier
         :group: ok

         Checked against a catalogue with a dotted key.

.. confval:: name
   :name: register-name
   :type: string
   :default: "register"

   What the group sections and the entries' addresses start with,
   ``findings-blocks`` and ``findings-1-1``, so two registers on one page
   keep apart.

.. confval:: prefix
   :name: register-prefix
   :type: string

   What stands before every entry's number, ``F`` for findings. Nothing
   unless the register says so: an entry is ``1.1`` by itself.

.. confval:: todo-prefix
   :name: register-todo-prefix
   :type: string

   What stands before the number of what is to do, ``T`` for the work a
   finding asks for.

.. confval:: findings
   :name: register-findings
   :type: flag

   The four groups of a review's findings, in the order a review reads
   them: *Blocks submission*, *Sent back*, *Worth a change*, *Checked and
   correct*. Their keys are ``blocks``, ``back``, ``change`` and ``ok``.

.. confval:: groups
   :name: register-groups
   :type: string

   Any other set of groups, as the JSON the element takes:
   ``[{ "key": "…", "heading": "…", "label": "…", "tone": "…" }]``. An
   entry whose group the register does not name stands last, in the order
   written. Without groups the entries count up as written.

The element is ``sds-register`` in :doc:`/frontend/components/content`,
which says how it numbers and what it draws.

entry
=====

One entry of a register. Its title is the argument, what it holds the
body, and everything that fits in a string an option.

.. example:: One entry, on its own

   .. entry:: The reader is a new instance per call
      :group: change
      :origin: older than the change
      :todo: Construct the reader once, in the constructor.

      The service is a singleton, so one reader in the constructor is the
      same object with one construction fewer per label.

.. confval:: group
   :name: entry-group
   :type: string

   The key of the group it belongs to, for the register that groups.

.. confval:: origin
   :name: entry-origin
   :type: string

   Where it came from, in a few words: ``introduced by this change``,
   ``older than the change``.

.. confval:: todo
   :name: entry-todo
   :type: string

   What is to do about it, in one sentence. It stands as the entry's last
   line, and the register lists it with the work of the other entries.

.. confval:: name
   :name: entry-name
   :type: string

   The address of this one entry, where the register's own, made from the
   number, is not the one a page wants to cite.

