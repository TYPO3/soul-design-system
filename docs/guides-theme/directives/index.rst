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

   page-shape
   actions
   content
   instructions
   reference
   text-roles
   papers
   tools

.. list-table:: The shape of a page
   :header-rows: 1

   * - Written
     - What it is for
     - Draws
   * - ``:layout:``
     - a field, not a directive: which of the two shapes the page takes
     - —
   * - ``hero``
     - the opening claim of a landing page, its press, and one image
     - ``sds-hero``
   * - ``band``
     - a full-bleed section of a landing page, and everything after it
     - ``.sds-band``
   * - ``split``
     - two of anything, side by side until there is no room for two
     - ``.sds-split``
   * - ``half``
     - one side of a split, where that side is several blocks
     - ``.sds-stack``
   * - ``grid``
     - a set read side by side, reflowed by its own minimum width
     - ``sds-grid``

.. list-table:: Actions
   :header-rows: 1

   * - Written
     - What it is for
     - Draws
   * - ``cta``
     - the one thing a reader can do next: what they get, and the press
     - ``sds-cta``
   * - ``button``
     - one press, and where it goes
     - ``sds-button``
   * - ``button-bar``
     - the presses of a page, in one row
     - ``.sds-actions``

.. list-table:: Content blocks
   :header-rows: 1

   * - Written
     - What it is for
     - Draws
   * - ``card``
     - a way into something: a title that goes somewhere, and what is
       behind it
     - ``sds-card``
   * - ``stat``
     - one number as a fact
     - ``sds-stat``
   * - ``surface``
     - one filled plane, with a statement in place
     - ``sds-surface``
   * - ``quote``
     - a sentence from somewhere else, with its source
     - ``sds-quote``
   * - ``checks``
     - a list whose items each carry a check
     - ``sds-checks``
   * - ``logos``, ``logo``
     - a wall of marks, each on the ground its colours are for
     - ``sds-logos``

.. list-table:: Instructions and questions
   :header-rows: 1

   * - Written
     - What it is for
     - Draws
   * - ``steps``, ``step``
     - an instruction read from the top, numbered down one rail
     - ``sds-steps``
   * - ``accordion``, ``accordion-item``
     - questions with their answers folded behind them
     - ``sds-accordion``

.. list-table:: Reference
   :header-rows: 1

   * - Written
     - What it is for
     - Draws
   * - ``facts``
     - a block of facts, scanned down the terms
     - ``sds-facts``
   * - ``register``, ``entry``
     - a list a reader cites: numbered, addressed, and the work it asks for
     - ``sds-register``

.. list-table:: Papers and decks
   :header-rows: 1

   * - Written
     - What it is for
     - Draws
   * - ``slide``
     - one frame of a deck, in the text of a paper
     - ``sds-slide``

.. list-table:: The manual's own tools
   :header-rows: 1

   * - Written
     - What it is for
     - Draws
   * - ``codemode``
     - markup that stands in the page as its author wrote it
     - what it holds
   * - ``example``
     - a piece of markup and, under it, what it renders as
     - ``sds-code`` in ``.sds-example``
   * - ``specimen``
     - a rendered card, at the size of its measurement
     - ``sds-embed``

Each of them draws an element of this system and takes that element's own
options, spelt the way the element spells them. So ``href`` links and
``src`` takes a file here as everywhere else, and what a component gains,
the directive gains with it. Every section of these pages names the element
it draws, and :doc:`/frontend/components/index` is that element's reference.

Every example in these pages stands once: the block is the body that drew
the thing under it, which is what ``example`` is for.
