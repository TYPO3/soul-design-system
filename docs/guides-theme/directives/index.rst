:navigation-title: Directives

==========
Directives
==========

The directives this theme adds to what an author can write, and the document
field. The extension registers them, so a project with the theme can use
them at once. There is nothing to add to ``guides.xml`` and no template to
copy.

.. toctree::
   :titlesonly:
   :hidden:

   page-shape
   actions
   content
   instructions
   reference
   text-roles
   papers
   tools

.. grid::

   .. card:: The shape of a page
      :href: /guides-theme/directives/page-shape
      :icon: actions-template

      Bands, the hero, splits, grids and the page field.

   .. card:: Actions
      :href: /guides-theme/directives/actions
      :icon: actions-play

      The call to action, a button and a row of buttons.

   .. card:: Content blocks
      :href: /guides-theme/directives/content
      :icon: actions-file-text

      Cards, figures, quotes, logos and lists with checks.

   .. card:: Instructions and questions
      :href: /guides-theme/directives/instructions
      :icon: actions-list

      Numbered steps, and answers behind a fold.

   .. card:: Reference
      :href: /guides-theme/directives/reference
      :icon: actions-book

      Facts, directory trees, diagrams, swatches and registers.

   .. card:: Text roles
      :href: /guides-theme/directives/text-roles
      :icon: actions-tag

      Badges, states, anchors and ids in a line of text.

   .. card:: Papers and decks
      :href: /guides-theme/directives/papers
      :icon: actions-document-edit

      The parts of a paper, its decisions and its slides.

   .. card:: The manual's own tools
      :href: /guides-theme/directives/tools
      :icon: actions-code

      Raw markup, examples that print themselves, and rendered cards.

.. list-table:: The shape of a page
   :header-rows: 1
   :columns: name, , meta

   * - Written
     - What it is for
     - Draws
   * - :ref:`layout <directive-layout>`
     - a field, not a directive: which of the two shapes the page takes
     - —
   * - :ref:`image <directive-image>`
     - two fields, not a directive: the picture a link to the page shows on another site
     - —
   * - :ref:`hero <directive-hero>`, :ref:`hero-figure <directive-hero-figure>`
     - the opening claim of a page, its press, and one image or what stands beside it
     - ``sds-hero``
   * - :ref:`band <directive-band>`
     - a full-bleed section of a landing page, and everything after it
     - ``.sds-band``
   * - :ref:`split <directive-split>`
     - two of anything, side by side until there is no room for two
     - ``.sds-split``
   * - :ref:`half <directive-half>`
     - one side of a split, where that side is several blocks
     - ``.sds-stack``
   * - :ref:`grid <directive-grid>`
     - a set read side by side, reflowed by its own minimum width
     - ``sds-grid``

.. list-table:: Actions
   :header-rows: 1
   :columns: name, , meta

   * - Written
     - What it is for
     - Draws
   * - :ref:`cta <directive-cta>`
     - the one thing a reader can do next: what they get, and the press
     - ``sds-cta``
   * - :ref:`button <directive-button>`
     - one press, and where it goes
     - ``sds-button``
   * - :ref:`button-bar <directive-button-bar>`
     - the presses of a page, in one row
     - ``.sds-actions``

.. list-table:: Content blocks
   :header-rows: 1
   :columns: name, , meta

   * - Written
     - What it is for
     - Draws
   * - :ref:`card <directive-card>`
     - a way into something: a title that goes somewhere, and what is behind it
     - ``sds-card``
   * - :ref:`stat <directive-stat>`
     - one number as a fact
     - ``sds-stat``
   * - :ref:`surface <directive-surface>`
     - one filled plane, with a statement in place
     - ``sds-surface``
   * - :ref:`quote <directive-quote>`
     - a sentence from somewhere else, with its source
     - ``sds-quote``
   * - :ref:`byline <directive-byline>`
     - who wrote the page, and when
     - ``sds-byline``
   * - :doc:`figure </guides-theme/markup>`
     - a picture with its caption, in a frame or plain
     - ``sds-figure``
   * - :ref:`checks <directive-checks>`
     - a list whose items each carry a check
     - ``sds-checks``
   * - :ref:`logos <directive-logos>`, :ref:`logo <directive-logo>`
     - a wall of marks, each in the ink of the page
     - ``sds-logos``

.. list-table:: Instructions and questions
   :header-rows: 1
   :columns: name, , meta

   * - Written
     - What it is for
     - Draws
   * - :ref:`steps <directive-steps>`, :ref:`step <directive-step>`
     - an instruction read from the top, numbered down one rail
     - ``sds-steps``
   * - :ref:`accordion <directive-accordion>`, :ref:`accordion-item <directive-accordion-item>`
     - questions with their answers folded behind them
     - ``sds-accordion``

.. list-table:: Reference
   :header-rows: 1
   :columns: name, , meta

   * - Written
     - What it is for
     - Draws
   * - :ref:`facts <directive-facts>`
     - a block of facts, scanned down the terms
     - ``sds-facts``
   * - :doc:`table </guides-theme/markup>`
     - a table with a title, and a role for each column
     - ``sds-table``
   * - :ref:`directory-tree <directive-directory-tree>`
     - a directory, in the shape it has on disk
     - ``sds-tree``
   * - :ref:`diagram <directive-diagram>`
     - a drawing, written as the text that describes it
     - ``sds-diagram``
   * - :ref:`swatch <directive-swatch>`
     - one colour of a palette: the chip, its name, its value
     - ``sds-swatch``
   * - :ref:`register <directive-register>`, :ref:`entry <directive-entry>`
     - a list a reader cites: numbered, addressed, and the work it asks for
     - ``sds-register``

.. list-table:: Text roles
   :header-rows: 1
   :columns: name, , meta

   * - Written
     - What it is for
     - Draws
   * - :ref:`badge <directive-badge>`
     - a short state in a line
     - ``sds-badge``
   * - :ref:`state <directive-state>`
     - a state as a glyph, for a cell of a matrix
     - ``sds-icon``
   * - :ref:`anchor <directive-anchor>`
     - an address in a line, for a word in a table cell
     - an id

.. list-table:: Papers and decks
   :header-rows: 1
   :columns: name, , meta

   * - Written
     - What it is for
     - Draws
   * - :ref:`part <directive-part>`
     - where a part of a paper begins
     - what the paper reads
   * - :ref:`outline <directive-outline>`
     - the short name the outline gives the next section
     - what the paper reads
   * - :ref:`decision <directive-decision>`, :ref:`answer <directive-answer>`
     - the question a concept puts, and the answers it can take
     - ``sds-decision``
   * - :ref:`slide <directive-slide>`
     - one frame of a deck, in the text of a paper
     - ``sds-slide``

.. list-table:: The manual's own tools
   :header-rows: 1
   :columns: name, , meta

   * - Written
     - What it is for
     - Draws
   * - :ref:`codemode <directive-codemode>`
     - markup that stands in the page as its author wrote it
     - what it holds
   * - :ref:`example <directive-example>`
     - a piece of markup and, under it, what it renders as
     - ``sds-code`` in ``.sds-example``
   * - :ref:`specimen <directive-specimen>`
     - a rendered card, at the size of its measurement
     - ``sds-embed``

Each of them draws an element of this system and takes that element's own
options, spelt the way the element spells them. So ``href`` links and
``src`` takes a file here as everywhere else, and what a component gains,
the directive gains with it. Every section of these pages names the element
it draws, and :doc:`/frontend/components/index` is that element's reference.

Every example in these pages stands once: the block is the body that drew
the thing under it, which is what ``example`` is for.
