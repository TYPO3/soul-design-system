:navigation-title: Writing a diagram

=================
Writing a diagram
=================

A diagram is a text, and the engine draws it. The author writes what the
drawing claims and what it holds. The engine sets the geometry, the colours
and the type, and refuses what the grammar forbids. So the work has three
steps:

#. Choose the layout from the shape of the claim. :doc:`index` lists the
   layouts and what each claims.
#. Write the text in the syntax on this page.
#. Put the text where the drawing goes: in a page, a slide, a Guides
   document, or a file.

The same text gives the same drawing in each of those places. A drawing that
no layout makes needs a hand: :ref:`diagrams-by-hand` says how.

Where the text goes
===================

In a page
---------

Write the text between the tags of
:ref:`sds-diagram <component-sds-diagram>`. The element draws it inline, in
the page's tokens and faces, so it turns with the mode. The indent that the
whole text shares does not count.

.. code-block:: html

   <sds-diagram>
     tiles
     title "Where the needs come from"
     description "The number of needs from each source."
     tile "27" "Market"
       emphasis
     tile "15" "Field test"
   </sds-diagram>

With a caption, or to open it large
-----------------------------------

The drawing has no frame and no caption of its own. Put the element in
:ref:`sds-figure <component-sds-figure>` for both. ``zoomable`` lets a press
open the drawing at the size of the window, for a drawing too dense to read
in the column.

.. code-block:: html

   <sds-figure caption="The first lookup reads the file, the second stops at the array.">
     <sds-diagram zoomable>
       flow
       …
     </sds-diagram>
   </sds-figure>

On a slide
----------

Put the element in the ``figure`` region of
:ref:`sds-slide <component-sds-slide>`. Write ``slide=width,height`` on the
first line of the text, in the pixels of the room that the layout leaves.
:doc:`/design-system/slides` states those rooms. The engine then draws with
no margin, and refuses a drawing taller than the room. A slide has no zoom.

A text without ``slide=`` gets the room from the slide. The slide measures
the room its layout leaves in the frame's pixels, and lends the drawing that
room a tenth larger. A reader sees a slide from further away than a page,
so the drawing's type stands near the slide's own scale. A text too dense for that
room first lowers the screens of its sketches in steps, down to 0.7 of their
height. Then it takes the same shape up to twice as large, and the slide
shrinks it whole. A text that still does not fit draws as on a page.

The engine sets a drawing dense in a room that the slide lends. The type
keeps its sizes, and never goes under 13. The controls, rows, pads and gaps
are lower. A field or a button is 24 high, not 28, and a row of a list 20,
not 24. So a figure of a page fits the room of a slide at its full width,
and the slide does not shrink its type.

A text that writes ``slide=`` keeps the page's metrics, because its author
measured it in them. A page drawing does not change.

A chain of a flow folds on a slide. That is one row, with each connector to
the next column. The engine tries one, two and three rows and takes the
fold that wraps its cards the least. Each row runs left to right, and the
connector at its end runs down to the start of the next.

.. code-block:: html

   <sds-slide kind="figure">
     <h2 slot="heading">One key for two languages</h2>
     <sds-diagram slot="figure">
       flow slide=877,354 columns=340,370 gap=167,16
       …
     </sds-diagram>
   </sds-slide>

In a Guides document
--------------------

Write the text as the body of ``.. diagram::``. The directive takes the body
as it is, and :doc:`/guides-theme/directives` lists its options. A text in a
``.diagram`` file of its own is ``:file: diagrams/flow.diagram``, relative
to the document.

.. code-block:: text

   .. diagram::
      :zoomable:

      tiles
      title "Where the needs come from"
      description "The number of needs from each source."
      tile "27" "Market"
        emphasis
      tile "15" "Field test"

As a file to keep
-----------------

A drawing for a README, an image or another tool is an SVG file. The file
carries a cut of its faces, so it reads the same with no page around it.
Each way below writes the same bytes:

- **In this tree.** Write ``<name>.diagram`` in
  ``packages/frontend/assets/diagrams/`` and run ``make diagrams``. It
  writes ``<name>.svg`` beside the text, and ``make verify ARGS=diagrams``
  holds the two together.
- **In a project.** ``npx soul-diagram figures/`` writes an ``.svg`` beside
  each ``.diagram`` under the directory. ``-o <dir>`` writes into another
  directory, and ``--stdout`` writes one file to the output. The command
  stops with an error at the first text that the engine refuses.
- **From a script.** ``parse()`` and ``diagram()`` from
  ``@typo3/soul-frontend/diagram`` run in Node and in a browser.
- **From Storybook.** Each story under ``Diagrams`` has a
  :guilabel:`Download SVG` press under the drawing. It saves the text in the
  controls. Change the text there, look at the drawing, then save it.

.. code-block:: js

   import { diagram, parse } from '@typo3/soul-frontend/diagram';

   const { svg } = diagram(parse(text), { name: 'cache-key' });

The text
========

The text has one statement on each line.

- The first line names the layout. Its options follow on the same line, or
  on indented lines under it.
- ``title "…"`` and ``description "…"`` are necessary. The title is the
  claim and the accessible name. The description tells a reader who cannot
  see the drawing what it shows.
- An indented line belongs to the statement above it. ``#`` starts a
  comment.
- A text stands in double quotes. An identifier, such as a class or a
  path, stands in backticks. The engine sets it in the mono face.
  ``\n`` in a text starts a new line.
- An option is ``key=value``, or ``key value`` on a line of its own. A value
  with a space or a colon stands in quotes.
- A flag is a bare word: ``emphasis``, ``absent``, ``new``.
- ``claim=error``, ``warn`` or ``ok`` on the first line makes the emphasis a
  status colour. Without it, the emphasis is the accent.
- A drawing makes one claim. ``emphasis`` stands on one part, or on peers
  of one kind: columns, items, nodes, rows or cells. Peers of one kind
  make the same claim. The regions of a sketch and their controls are one
  kind, the places of a screen. A part of another kind is a second claim.
- ``emphasis fill`` fills a node, an item or a boxed item with the claim
  colour. Its text then stands in the ground colour.

A statement can stand on one line, or read down the page. These two are the
same node:

.. code-block:: text

   cache `cache[]` at=1,0 body="one entry per key" new

   cache `cache[]`
     at 1,0
     body "one entry per key"
     new

A connector joins two ids, and its arrow says what it is:

.. list-table::
   :header-rows: 1

   * - Arrow
     - Means
   * - ``a -> b``
     - a step or a call
   * - ``a --> b``
     - absent, or not yet there: a dashed line
   * - ``a => b``
     - the emphasis of the drawing
   * - ``a -x b``
     - it fails: a cross at its end
   * - ``a <-> b``
     - a question and its answer

A label in quotes follows the ids: ``cache => store "miss"``.

The layouts
===========

Each section has a text that the engine draws, and the statements that the
layout takes. The stories under ``Diagrams`` in Storybook show larger texts
of each layout, and their controls take any text.

flow
----

Nodes on a grid, joined by connectors, in boundaries.

.. example:: A flow of three nodes

   .. diagram::

      flow
        columns 1,1,1
      title "A request passes the cache first"
      description "A request reaches the cache. On a miss, the cache asks the store."

      request "Request"
        at 0,0
        person
      cache `cache[]`
        at 1,0
        body "one entry per key"
        new
      store "Store"
        at 2,0
        store

      request -> cache
      cache => store "miss"

- ``<id> "Title"`` is a node. ``at=column,row`` places it, from 0.
  ``body=`` adds a line under the title, and ``value=`` a value at the
  right. ``span=`` gives it more than one column, and ``rows=`` more than
  one row.
- The flags of a node are ``new``, ``changed``, ``person``, ``store``,
  ``absent``, ``degraded``, ``emphasis``, ``ink``, ``strong`` and
  ``plain``.
  ``strong`` draws the outline in ink, 2 wide: one of several peers.
  ``eyebrow=`` sets a word in mono capitals over the title: the kind of
  part. ``tag=`` sets an identifier in mono before the title.
  ``dashed`` draws a dashed outline, and the text stays in ink. That is a
  way out of the path, such as an error.
- ``group "label"`` draws a boundary around the nodes indented under it.
  ``group <id> "label"`` gives it an id that a connector can use.
  ``emphasis`` under a group draws its outline in the claim colour. A
  ``group`` indented under a group stands inside it, with its own pad: a
  part of a part.
- A connector takes ``via=h`` or ``via=v`` and ``bend=`` to steer its path.
- ``row 0 "Label" note="…"`` names a row at the left. ``column 0 "Head"``
  sets a head over a column: what the column holds. A head names the
  column of a flow with no boundary around it. ``letter=B`` makes it the
  title of a part, the letter in the colour of the claim. ``eyebrow=``
  sets a word in mono capitals over the head, and the head is then a
  title in bold. ``emphasis`` sets the head in the claim colour, the
  same claim as a boundary with the emphasis.
- ``plain`` on a node draws no box: a note beside the boxes, its title at
  the size of a body. A connector stops short of its text.
- ``item "text"`` lines under a node are its list, under its title and its
  body. A node with items needs no title. ``body=`` sets a line under an
  entry, and the entry is then a name in bold. ``value=`` sets a figure at
  its right. ``across=2`` on the node sets the list in two columns, the
  first filled first. An entry that opens with a sign hangs its other lines
  under its words. So a list of checks beside a boundary is one node, and
  ``rows=`` lets it stand beside several rows.
- The first line takes ``columns=``, the relative widths, and ``gap=``, the
  space across and down. ``fan`` on the first line sends the connectors
  that leave one side of one node out apart. Each leaves at its own height
  and bends at its own place, so no two share a line. With ``fan curve``,
  each connector across a gap is a curve from the middle of its source.
  So the connectors from one source spread as a fan.
- ``even`` on the first line makes every row as high as the highest. Peers
  in a column then have boxes of one height.
- A text with no room does not stop a page drawing at once. That is a
  word in a box, a label on a connector, or the name of a boundary. The
  column that is too narrow takes room from the others. Where they have
  none to give, the flow grows, up to twice its width, and the page shrinks
  it. On a slide, the room stays the room.

sequence
--------

Lanes and numbered steps in phases, time down the page.

.. example:: A sequence of two lanes

   .. diagram::

      sequence
      title "A link opens a preview once"
      description "Two lanes, the browser and the site, in one phase."

      lane browser "Browser"
        person
      lane site "Site"
      phase "Redeem"
        browser -> site "/news?_preview=token"
        site => browser "page with hidden content"

- ``lane <id> "Name"`` takes ``sub=``, ``person`` or ``store``.
- ``host "label" <lane> <lane>`` draws a boundary over the lanes it names.
- ``phase "Title"`` holds its steps indented under it. ``tone ok`` colours
  the phase.
- A step is a connector between lanes. A step from a lane to itself stands
  beside the lane. ``note "text" over=a,b`` adds a note over lanes.

matrix
------

Rows against columns, with a sign in each cell.

.. example:: A matrix of two rows

   .. diagram::

      matrix
      title "Where an editor changes a page"
      description "Two products against two editing places."

      column "In the page"
      column "In a panel"
      emphasis column="In the page"

      row "Product A": yes partly
      row "Product B": no unknown

- ``column "Label"`` takes ``group=``, ``sign=`` and ``split``, which draws
  a rule before the column. ``letter=B`` stands over the label at the size
  of a node, and ``sub=`` under it: an example of the column. ``weight=3`` gives the column three shares of
  the width.
- ``row "Label":`` lists a cell for each column after the colon, or on a
  ``cells …`` line under it. ``sub=`` adds a line under the label.
- A cell is a sign (``yes``, ``partly``, ``no``, ``unknown``), ``-`` for
  none, a text, or ``dot="8 d"``. ``partly^1`` adds note 1, and
  ``note "…"`` gives the notes in order.
- ``path="Click the text › Type › Save"`` puts a click path in a cell: each
  step in an outline, joined by ›. A path goes on to the next line where
  the column ends.
- ``chip="A1,A2"`` puts identifiers in a cell. They go on to the next line
  where the column ends. A text in a cell wraps too, and the row is as
  high as its fullest cell.
- ``group "Name"`` holds the rows indented under it.
- ``emphasis row=`` or ``column=`` names the emphasis. A second line names
  a peer of the same claim. Rows or columns side by side share one frame.
- The first line takes ``row-groups=beside``, and ``figures`` for cells
  that hold figures. ``left`` sets the heads in capitals. It also sets the
  texts at the left of their columns: a table that reads as a list.
  ``end`` on a column of such a table sets its head and its texts at the
  right. ``ids`` sets the first word of each row's label in mono, in a
  column of its own. The name after it is in the regular weight.
  ``head="Task"``
  puts a head over the labels of the rows. ``blocks`` draws each text
  cell as a block across its column, as a bar of a plan. A text in
  parentheses is an outlined block: a smaller piece of work.
- A rule stands under the heads, between two row groups and at the foot.
  The alignment carries the rows. ``rules`` on the first line adds a rule
  between every two rows.
- A row group says its name in bold capitals. A head over a letter or
  over blocks names a thing, and takes the ink of a row's label.
- ``legend yes="good" note="…"`` adds a sentence after the words of the
  legend, on its line. ``notes=outside`` keeps the number on a cell and
  leaves the text of each note to the page around the drawing.

bars
----

Lengths on one scale, in segments, against a dashed target.

.. example:: Bars of two rows

   .. diagram::

      bars
        max 10
        unit steps
      title "Integration passes the fewest steps"
      description "One bar per area, in steps that pass and fail, against all steps of the area."

      row "Editing"
        target 8
        segments ok=7 warn=1
      row "Integration"
        target 9
        segments ok=2 error=4
        emphasis

      legend
        ok "passes"
        warn "passes in part"
        error "fails"

- ``row "Label"`` takes ``target=``, ``value=`` and ``group=``. Its
  segments are ``ok=``, ``warn=``, ``error=``, or a bare number in ink.
  ``absent=`` is a dashed stretch that the row does not have yet.
- A label in backticks is an identifier, with ``sub=`` under it.
- ``legend`` takes one line for each tone it names.
- The first line takes ``max=``, ``unit=`` and ``ticks=``. For a scale of
  named steps, it takes ``bands="a,b,c"`` and ``axis=``.

units
-----

Counts as unit squares, a missing part as dashed squares in its place.

.. example:: Units of two rows

   .. diagram::

      units
      title "A fallback answers less"
      description "Each square is one entry. The fallback returns the declared entries and none of the dynamic ones."

      row "The booted runtime"
        parts 40
      row "The package files"
        missing "dynamic registrations"
        parts 28 degraded=12

- ``row "Label"`` takes ``sub=``, ``note=`` and ``missing=``, the name of
  the part that is not there.
- ``parts`` is a count, then ``absent=`` or ``degraded=`` for the part that
  is not there.
- The first line takes ``lines=``, ``head=`` and ``key=``.

cells
-----

Things as cells in named groups, each with its sign.

.. example:: Cells in two groups

   .. diagram::

      cells
      title "Gap map"
      description "The needs in two groups, each a cell with its state."

      group "Edit"
        F1.1 yes
        F1.2 partly
      group "Compose"
        sub "1 of 3 missing"
        F2.1 partly
        F2.2 yes
        F2.3 no

- ``group "Title"`` takes ``sub=``, and one cell on each line under it: its
  id, then its sign. ``tone=ok``, ``warn`` or ``error`` sets the sub line in
  that status colour: the verdict of the group.
- ``legend partly="19 partly met"`` names a sign with its count.
- ``boxed`` on the first line puts each group in a box, in one line. Its
  cells stand bare in it, each id over its sign. Its sub line stands at
  its foot: the verdict of the group.

chips
-----

Identifiers as chips, in rows or in columns.

.. example:: Chips in two rows

   .. diagram::

      chips
      title "Feature map"
      description "Features in two rows. A filled chip is in the first release, an outlined one is a small first version, a bare one comes later."

      row "Baseline"
        chips A1 A2 (B1) ~B2
      row "Common"
        chips C1 (C2)* ~D1!

      legend
        filled "first release"
        outline "small first version"
        plain "later"
        ring "only with workspaces"

- ``A1`` is a filled chip, ``(B1)`` an outlined one, ``~B2`` a bare
  identifier. ``*`` after a chip adds the ring, and ``!`` makes it the
  emphasis.
- ``row "Label"`` takes ``sub="a|b"`` and ``chips`` lines under it. All
  chips of the rows have one width, so they line up as columns. Where the
  longest row does not fit, the chips and the gaps narrow. A row wraps only
  where the widest id no longer fits.
- With ``direction=columns`` on the first line, ``column "Head"`` holds
  ``task "…"`` and ``chips …`` under it.

tiles
-----

Figures side by side, the value largest.

.. example:: Three tiles

   .. diagram::

      tiles
      title "Where the needs come from"
      description "The number of needs from each source."

      tile "27" "Market"
        emphasis
      tile "15" "Field test"
      tile "9" "Core rule"

- ``tile "value" "Label"`` takes ``unit=``, ``body=`` and ``sign=``.
- The first line takes ``columns=``. ``aside`` sets the value at the right
  of the label, the unit under the label, and a rule under both.

columns
-------

The parts of a whole, as columns of items.

.. example:: Three columns

   .. diagram::

      columns
      title "Three parts, one chain"
      description "Three columns, each with the identifiers it holds."

      column "Requirements"
        item "Functional needs" id=F1
        item "Technical needs" id=T1
      column "Target"
        emphasis
        item "Architecture" id=A1
      column "Appendix"
        absent
        item "Descriptions" absent

- ``column "Title"`` takes ``eyebrow=``, ``value=``, ``sub=``, ``id=``,
  ``place=``, ``body=``, ``note=`` and ``foot=``. ``place=`` draws a
  screen of the editing interface at the right of the head. Its parts have
  a quiet fill, and the part of the case is ink. The parts are
  ``docheader``, ``nav``, ``bar``, ``page``, ``panel``, ``both`` and
  ``form``. ``any`` fills no part. ``value=`` is a figure at
  a tile's size. A figure too wide for its column steps down in size. A
  ``sub=`` that wraps beside the screen stands under it, where it then
  takes fewer lines.
- ``badge="…"`` on a column stands white on ink across its top edge, at
  the right. It names a condition of the whole case.
- ``item "text"`` takes ``id=`` and ``sign=``. ``mark=ok`` sets a status
  mark before it, ``marks=ok,warn`` after it, and ``boxed`` gives it a box.
  An item in backticks is mono.
- ``strong`` on a column or an item draws its outline in ink, 2 wide. It
  marks one of several peers. The emphasis stays the one claim of the
  drawing.
- ``line "…"`` adds a line of a terminal. A column also holds the controls
  below.
- ``key "…" chip=``, ``sign=``, ``badge=`` or ``pill=`` adds a line to
  the legend under the columns. ``sign=any`` is a place that each case
  fills in for itself.
- ``letter=`` puts the letter of a part before the title, in the colour
  of the claim. It spends no emphasis. A column whose head has nothing
  under it has no rule.
- ``chain`` on the first line joins each column to the next with an
  arrow: the steps of one argument.
- ``rise`` on the first line sets the columns as a staircase. Each column
  starts a step higher than the one before. All end on one line: each
  level includes the levels before it.
- In a chain or a staircase, a column with the emphasis sets its eyebrow
  in the claim colour. The eyebrow names the step of the claim.
- In a staircase, the items and the controls of a column stand at its
  foot. So a picture of each level stands on the line all levels end on.
- ``bare`` on the first line draws no card. The items stand as plain
  text, and an id is a key in the body's size and the muted ink. That is
  the key under a sketch.
- ``rows="core,extension"`` on the first line names the items of every
  column at the left, in order. Each item then draws only its sign, and
  the items of all columns line up. The key under the drawing starts at
  its left edge, under the names.
- ``centred`` on the first line sets the title and the body of each column
  in its middle. No rule stands under them. That is a level, and its signs
  stand under it.
- A column is as wide as the longest word it sets. It also holds whole
  each control that cannot wrap, such as tabs or a row of buttons. The
  columns are peers and keep one width. Where one needs more than its
  share, the drawing grows, up to twice its width.

sketch
------

Screens as nested regions, with numbered places.

.. example:: A sketch of one screen

   .. diagram::

      sketch
        height 240
      title "A panel beside the page"
      description "A screen with a toolbar, the page and a panel on the right."

      screen "Panel on the right"
        column
          region "toolbar"
            size 30
            surface raised
          row
            region "page" lines=6 surface=raised
              emphasis
            region "panel" lines=4 size=90

- ``screen "Title"`` takes ``caption=`` and holds exactly one region.
  ``device`` draws a phone: an ink outline, a wide edge and a bar at its
  foot.
- ``row`` and ``column`` split a region. ``region "label"`` takes
  ``size=``, ``lines=``, ``surface=``, ``marker=``, ``flow=row`` and
  ``icons=``, small squares down a folded column.
  ``across=2`` sets its controls in a grid of two columns of one width.
- ``band "Label"`` under the region of a screen draws a dashed strip under
  it. The strip holds what the interface keeps out of sight. Its label stands at its
  left, and its controls share one row after it. ``across=`` breaks them
  into more rows.
- A region holds the controls below. ``strong`` draws its outline in ink,
  ``absent`` a dashed one, and ``hidden`` hatches it. ``head`` sets its
  label as the region's name, in the body's size, bold and in ink.
  ``plain`` sets the label in the sans face: a name of a part, not an
  identifier.
- A ``row`` whose lines are all controls sets them side by side. A ``row``
  of regions splits the screen.
- A region narrower than 40 is a rail. It sets its controls closer to its
  edge, so an icon such as ``text "{page}"`` stays whole in it.
- The first line takes ``height=``. ``heads`` sets the title of each
  screen over it, in capitals. The head of a screen whose region is the
  claim stands in the claim colour.

A page grid is a screen of this kind. The toolbar runs across the top.
Under it, the left column, the page and the panel stand side by side. A
band holds what lies under the surface, and each place holds its items.

.. example:: The page grid of an interface

   .. diagram::

      sketch
        height 200
      title "Features by place"
      description "The page grid of an editing interface: the toolbar holds C3 viewport switch and D1 save state, the page holds A1 text with a live preview, which is the emphasis, and B4 insert at a position, the panel holds A4 element fields, and the band under the surface holds D3 drafts and E1 permissions."

      screen
        column
          region
            size 44
            surface raised
            across 2
            chip "C3" "Viewport switch"
            chip "D1" "Save state"
          row
            region "PAGE"
              surface sunken
              chip "A1" "Text, live preview" emphasis
              chip "B4" "Insert at a position"
            region "PANEL"
              size 220
              surface raised
              chip "A4" "Element fields"
        band "UNDER THE SURFACE"
          chip "D3" "Drafts"
          chip "E1" "Permissions"

notes and compose
-----------------

``notes`` is the numbered list behind the markers of a sketch. ``compose``
puts layouts side by side, with one emphasis for all of them.

.. example:: A sketch and its notes

   .. diagram::

      compose
      title "A place and its principle"
      description "A sketch with one numbered place, and the principle it shows."

      part
        weight 1.4
        sketch
          height 220
        screen
          region "PAGE"
            surface raised
            field lines=2 focus cursor marker=1
      part
        notes
        note 1 "Change with one click"
          body "A click on a text starts the change."

- ``note 1 "Title" body="…"`` is a note. Its number is the marker it
  explains.
- ``part`` takes ``weight=`` and ``label=``. The layout's first line stands
  on the line under it, then its statements.
- The first line of ``compose`` takes ``direction=column`` and ``gap=``.
  ``chain`` draws an arrow across each gap to the head of the next part.
  The arrow is what one part gives to the next.
- Where two parts name the same signs with the same words, the legend
  stands once, under the last of them.

The controls
------------

A region of a sketch and a column hold controls. Each takes ``marker=`` for
a numbered place.

.. list-table::
   :header-rows: 1

   * - Control
     - Takes
   * - ``text "…"``
     - a line of text. ``large`` sets it at the size of a heading of the
       page that a sketch shows
   * - ``field "…"``
     - ``placeholder=``, ``cursor``, ``focus``, ``emphasis``, ``large``,
       ``tag=``, ``lines=``, ``absent``, ``hidden``. Also ``ring``,
       ``dim``, ``inplace``, ``bare`` and ``right=``. ``bare`` draws no box. A ``line "…"`` under it adds a
       paragraph
   * - ``button "…"``
     - ``strong``, ``emphasis``, ``round``: a circle as high as the button,
       a sign in its middle. ``square`` is a touch target, 44 on each side.
       A sign alone in it stands at 20, as a finger sees it
   * - ``span "44 px"``
     - a dimension: a line with a tick at each end, its size under it
   * - ``keyboard``
     - the keys of a screen keyboard
   * - ``tabs "a,b"``
     - ``active=``, the number of the active tab, from 0
   * - ``chip``, ``label "…"``, ``step "…"``
     - ``chip=``
   * - ``chip "A1" "Label"``
     - ``emphasis``, ``fill``, ``strong``: an item in a box, its
       identifier before its label. The engine refuses one wider than its
       place
   * - ``dots "…" value=10 of=12``
     - a count out of a whole: filled dots for the value, hollow ones for
       the rest. A text puts a head over them, with the count at its right
   * - ``hint "…"``
     - ``right=``, ``emphasis``: the note of a place, in the colour of the
       claim. In a narrow column it wraps, and ``right=`` stays on its
       first line
   * - ``code "…"``
     - one line of code, or a ``line "…"`` under it for each line of a
       block. A block keeps every run of spaces in a line
   * - ``page``, ``lock``, ``image``, ``tree``, ``lines``, ``rule``
     - ``lines=`` where it has lines. In a column, a ``rule`` and what
       follows it stand at the column's foot. Every foot starts on one
       line, so the first line under each rule shares one baseline
   * - ``thumb "name"``
     - ``show=picture``, ``lines``, ``teaser`` or ``page``, ``split=50,50``,
       ``selected``, ``absent``: a small picture over its name. That is a
       file, an entry of a library, or a split to choose
   * - ``crop``
     - a picture with a crop frame, its corner handles and a focus point
   * - ``map "Place"``
     - a map with two routes and a pin with its name
   * - ``toggle "…"``
     - ``on``: a switch with its label after it
   * - ``drop "…"``
     - the line where a dragged element lands, with its name over the
       start of the line
   * - ``insert``
     - ``strong``: an insertion point, a dashed line with a circled plus in
       its middle. ``strong`` fills the plus: the point under the pointer
       or the focus
   * - ``entry "Name"``
     - ``body=``, ``sign=``, ``selected``, ``absent``: an entry of a
       library. The sign of its type stands in a tile. The name in bold
       follows it, and the body stands under the name
   * - ``tools``
     - ``count=``
   * - ``devices "…"``
     - ``active=phone``, ``chip=``: a switch of viewports
   * - ``site "Name"``
     - ``nav=``, ``heading=``, ``cards=``, ``width=0.6``, ``selected``,
       ``cursor``: a small site, narrow on a ground under a width of 1
   * - ``keycap "Ctrl"``
     - a key on the keyboard
   * - ``toolbar "B,I,|,Link"``
     - ``active=0,1``, the labels that are on, from 0, ``strong``: short
       buttons in one bar, with ``|`` between groups. ``ink`` fills the
       bar, as the menu of a selected element is
   * - ``pill "Hidden"``
     - ``ink``: a state in a round outline, at the right of a head
   * - ``tag "Hero"``
     - the name of a type or an element, white on ink
   * - ``arrow "…"``
     - ``push``: a connector down to the next control, with a text. An
       arrow with no text stands in the middle
   * - ``progress value=0.6``
     - how far a run of steps is, as a share from 0 to 1
   * - ``row``
     - the controls under it, side by side. ``bar`` frames them with a
       hairline: the bar of a screen. A ``chip`` at its end stands outside
       the frame, because it names the case and not a control
   * - ``frame "Title"``
     - ``close``, ``tone=warn``, ``strong``, ``chip=``: the controls under
       it in a box. That is a dialog, a popover, a panel or a message.
       It takes ``absent`` and ``hidden`` as a field does. ``width=0.5``
       sets it in the middle at that share: a phone in a page. ``ink``
       fills it, and its text stands in the ground colour: a tooltip.
       ``over`` sets it at the right, over the controls after it: a menu
       that opens over a page. ``bare`` draws no box: controls one under
       the other in a row of controls. ``device`` draws the outline of a
       phone. ``sheet`` draws a handle on the top edge: a sheet that
       slides up from the foot of the phone. ``fill`` makes it a grey
       plane: a part of the page, where a white frame is a control. Only
       a dialog has a rule under its title: ``strong``, ``close`` or
       ``chip=``
   * - ``list``
     - ``handle``, ``steps``, ``columns=``, ``rendered``, and a
       ``row "Label"`` line for each row. ``steps`` numbers the rows and
       joins the numbers with a line. A ``selected`` row is a grey plane
       in an ink outline

The controls take these flags and options too:

- ``chip=A1,A2`` sets identifiers at the right end of a control. A
  ``text``, a ``field``, a ``button``, ``tabs``, a ``hint``, a ``code``, a
  ``lock`` and a ``toolbar`` take it. A ``label`` and a ``step`` set it
  after their text.
- A ``field`` with its text in backticks sets it in mono: an address, a
  path or an identifier.
- ``field … slim`` is one line, as high as a button. A line with no room
  breaks after a `` · `` and only there. So a part such as
  ``Hero · Summer offers`` never splits. Every text that wraps breaks
  after a `` · `` where that takes no more lines, and no line opens with
  one. ``strong`` draws the outline of a
  ``field``, a ``code`` or a ``lock`` in ink.
- ``text … small`` is the size of a label: the caption under a sketch.
- ``button … small`` is the size of a label, as the buttons of a bar are.
  ``ink`` fills it.
- ``tabs … switch`` divides the whole width into segments, and the active
  segment has an outline.
- ``absent`` on a ``field`` or a ``frame`` draws a dashed outline with no
  fill. That is an empty place, a placeholder or a preview of a drop.
  ``hidden`` hatches it: editors see the part, and visitors do not.
- A ``text``, a ``field`` and a row of a ``list`` mark a run
  ``~~struck~~``, ``__underlined__``, ``**bold**`` or ``**__both__**``.
  The engine measures the text without the marks. A ``line`` of a code
  block in ``**…**`` is bold.
- ``image "label"`` names what the picture stands for, in its middle.
- ``ring`` on a field draws a second outline outside the first: the focus
  of the keyboard. ``dim`` makes it a quiet band with no outline: a part
  that the interface dims. ``inplace`` draws no box, but a dashed line
  around the text: a text that changes in place.
- ``dot`` on a ``field`` or a ``frame`` sets a dot at its top right. On a
  field with a tag, the dot stands at its foot. The dot marks a change
  that the core has not saved or a user has not published. On a ``page``,
  a round mark in its corner is the marker of the element.
- ``thumb … show=person`` is a round picture with no frame, its name
  under it in the middle: a person.
- A text sets a small sign in its line. Write the name of the sign in
  braces, such as ``{clock}``. The signs for things are ``{people}``,
  ``{person}``, ``{lock}``, ``{site}``, ``{page}`` and ``{blocked}``. The
  signs for states and actions are ``{dot}``, ``{ring}``, ``{plus}``,
  ``{up}`` and ``{down}``. The signs for types are ``{text}``,
  ``{image}``, ``{media}`` and ``{list}``. The sign takes the room of one
  letter and the colour of its text. ``{yes}``, ``{no}`` and ``{partly}``
  are the signs of a matrix, in their own colours. ``sign=`` on an
  ``entry`` takes the same names. A line never breaks after a sign, so
  ``{dot} Saved`` stays on one line.
- ``corner`` puts the marker of a control on its top right corner, not
  beside it. ``pointer`` puts a pointer over the control, near its right
  end.
- ``id=`` names a control or a row of a list. ``join a b`` in a column
  draws a line from the edge of one to the facing edge of the other.
  Where the two overlap, the line runs straight down the middle of the
  overlap. Where they stand side by side, the line runs across.
  ``dashed`` makes it a weaker tie, and ``arrow`` adds a head at ``b``.
  ``right`` runs it near the right end of both.
- ``tabs … switch small`` sets the labels of a switch at the size of a
  label.

A row of controls
~~~~~~~~~~~~~~~~~

.. example:: A bar and a dialog in one column

   .. diagram::

      columns
      title "A save in two steps"
      description "A bar with the save state and a dialog that asks before a save."

      column "Live page"
        place bar
        row
          button "Live" strong small
          text "Unsaved · 1" strong
          chip "D1,D3" push
        frame "Save to the live page?" close strong
          text "Visitors see this change at once."
          row
            button "Cancel" small push
            button "Save live" ink small
      column "Structure"
        list handle
          row "Teaser cards" selected chip=B1
          row "  Card · Summer"
          row "Holiday notice" muted right="24.12."
        row
          keycap "Ctrl"
          keycap "↑"
          text "one position up"

- A control in a row takes its natural width. A field, a list and a frame
  share the width that the others leave. Where the row is too narrow, the
  longest text wraps first.
- ``weight=2`` on a control in a row gives it two shares of the width that
  the others leave. A control with no weight takes one share. So two lists,
  or a menu beside a page, divide the row as the author says. A share can be
  too narrow for what a control holds. Then the control takes what it
  needs, and the others share the rest.
- Frames side by side in a row are as high as the highest of them. A
  frame, a list, a picture and a block of code stand at the top of a row.
  A text beside one of them stands at the top too.
- ``push`` on a control in a row puts it and the controls after it at the
  right end.
- The engine refuses a row that does not fit its width. It also refuses
  tabs or a toolbar wider than their room. In a column, the column grows
  for them first.
- A ``row "Label"`` of a list takes ``indent=``, or two spaces before the
  label for each level. It takes ``selected``, ``boxed``, ``muted``,
  ``strong``, ``absent``, ``right="…"``, ``mark=warn``, ``chip=`` and
  ``marker=``. ``button="Show"`` sets a small button at its right end:
  the action the row offers. A label with no room on one line wraps, and
  its row grows by a line.
- ``columns=1,2,2`` on a list divides each label at ``|`` into cells. Each
  cell starts where its column starts, and the numbers are the relative
  widths. ``head`` on a row sets its cells as the names of the columns.
- ``rendered`` on a list puts each row in a box, with a bar of its
  rendering under its label.

When the engine refuses
=======================

The engine draws nothing that breaks the grammar. In a page, the refusal
stands in the place of the drawing. ``make diagrams`` and ``soul-diagram``
stop with the same message. The message names the line or the part.

.. list-table::
   :header-rows: 1

   * - The message says
     - Change this
   * - a diagram needs a ``title`` or a ``description`` line
     - Write both. They are the accessible name of the drawing.
   * - ``"…"`` is not a layout
     - Write a layout from the table in :doc:`index` on the first line.
   * - a text is wider than its box, or a label has no room
     - Shorten the text, or widen the gap or the column on the first line.
   * - a second emphasis
     - Keep one claim: one part, or peers of one kind.
   * - the text asks for more than twice the room
     - Shorten the text, or make two drawings.
   * - the drawing is higher than the slide's room
     - Take parts out, or choose a layout with a larger room.
   * - a region's controls are more than its room
     - Give the region the size the message names, or the sketch that much
       more ``height``.
   * - a connector starts or ends at nothing, or names no lane
     - Write the id of a node or a lane that the text declares.
   * - a row has more or fewer cells than the columns
     - Give each row one cell for each column, ``-`` for none.
