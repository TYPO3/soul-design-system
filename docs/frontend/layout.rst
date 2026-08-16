:navigation-title: Page layout

===========
Page layout
===========

A page is furniture before it is components, and the furniture is classes
rather than elements because a server can write all of it. Nothing here
declares a width and nothing here is a component: what a page is made of is
stated once, so no surface writes its own breakpoints.

.. code-block:: html

   <body class="sds-app">
     <a class="sds-skip sds-btn sds-btn--secondary" href="#main-content">Skip to content</a>
     <div class="sds-shell">
       <header class="sds-bar">…</header>
       <div class="sds-body">
         <aside class="sds-body__rail">…</aside>
         <main class="sds-body__main" id="main-content">…</main>
       </div>
       <footer class="sds-footer">…</footer>
     </div>
   </body>

The canvas and the frame
========================

.. confval:: .sds-app
   :name: sds-app
   :type: class
   :required: true

   Establishes the canvas: the ground colour, the text colour and the sans
   stack. It belongs on ``<body>`` or the application root, and without it
   every surface inside is drawn on whatever the browser decided.

   The margin reset lives here rather than in a reset file of its own: on
   ``<body>`` the browser's own gutter makes a full-height page overflow its
   viewport and scroll for no reason.

.. confval:: .sds-shell
   :name: sds-shell
   :type: class

   The column the whole page is: full height, bar at the top, footer at the
   bottom, and whatever is between them taking the rest.

.. confval:: .sds-skip
   :name: sds-skip
   :type: class

   The first tab stop, and the way past the bar, the rail and the breadcrumbs
   into the text. It is a link like any other — give it ``.sds-btn`` for the
   shape — and it points at the ``id`` the page's ``<main>`` carries.

   It sits off the top of the page until it is focused, rather than being
   hidden: ``display: none`` and ``visibility: hidden`` both take a link out
   of the tab order, which leaves it on the page and out of reach of the one
   reader it exists for.

.. confval:: .sds-bar
   :name: sds-bar
   :type: class

   The header. Sticky rather than fixed, so nothing below it needs to know its
   height, and the one translucent surface in a system with no shadows — solid
   it reads as a lid, transparent it lets letters run through the mark.

   **The bar sheds, it never wraps.** A header on two lines moves the offset
   everything below it is measured against, so as the window narrows the bar
   drops what it can spare instead: first the version badge, then the search
   field, then the brand half of the wordmark. The mark, the product's own
   name and the navigation stay.

.. confval:: .sds-bar__end
   :name: sds-bar-end
   :type: class

   The cluster against the right edge — the mode switch, the search, whatever
   a surface puts there. It does not shrink; it sheds, because a box narrower
   than its own contents is a header that overflows without anything in the
   row looking wrong.

.. confval:: .sds-footer
   :name: sds-footer
   :type: class

   The end of a **site**: link columns, and the line that says what the
   product is. It is a different ground rather than a ruled-off area of the
   same one — a hairline between two areas of one ground is a horizontal rule
   across the window, saying nothing except that something ended.

The two bodies a page can have
==============================

Everything is one of two layouts, and the choice is not decoration. It is the
same distinction :doc:`/design-system/screens` draws between a page that
reports and a page that argues.

.. tabs::

   .. tab:: A column, with or without a rail

      .. code-block:: html

         <div class="sds-body">
           <aside class="sds-body__rail"><sds-nav-rail …></sds-nav-rail></aside>
           <main class="sds-body__main">…</main>
         </div>

      Right for an answer, a reference, a document. Where there is nothing to
      list beside the text, ``.sds-page`` is the same measure with no rail
      and no column beside it.

   .. tab:: Bands, whose ground changes

      .. code-block:: html

         <div class="sds-bands">
           <section class="sds-band">…</section>
           <section class="sds-band sds-band--quiet">…</section>
         </div>

      Right where the parts of the page are steps in an argument — the pitch,
      then who it is for, then what it costs — and wrong everywhere else,
      because a change of ground that means nothing is a change of ground the
      reader stops believing.

.. confval:: .sds-body
   :name: sds-body
   :type: class

   A rail beside a column. It is also what becomes a single stack once there
   is no room for two.

.. confval:: .sds-body__rail
   :name: sds-body-rail
   :type: class

   Where the navigation stands. Sticky for the bar's reason — the list of
   pages is the frame, not part of what is read — and it comes to rest where
   it started rather than against the bar, so nothing jumps as it catches.

   Below the width at which a column beside the text stops fitting, it is not
   drawn at all: the bar is handed the whole site on every page, and its drawer
   holds these pages among the rest.

.. confval:: .sds-body__main
   :name: sds-body-main
   :type: class

   The other half of the body, and named for it: what stands beside the rail is
   this page, the way the rail is its list. It has no width of its own — the
   measure comes from what is in it, which is what lets a table run wide while
   the prose beside it stays at sixty-six characters.

.. confval:: .sds-column
   :name: sds-column
   :type: class

   **A half of a split, and nothing else.** The split states the width; the
   column is what stands in it. A page's own reading column is
   ``.sds-body__main`` or ``.sds-page`` — writing this one there says half of
   something that has no other half.

.. confval:: .sds-page
   :name: sds-page
   :type: class

   One measure on one canvas, with nothing beside it. It replaces
   ``.sds-body``, never wraps it.

.. confval:: .sds-bands
   :name: sds-bands
   :type: class

   A page whose ground changes. It replaces ``.sds-page`` — two insets would
   indent the text twice.

.. confval:: .sds-band
   :name: sds-band
   :type: class

   One full-bleed section. ``.sds-band--quiet`` is the second ground, with the
   hairlines that keep two of them apart; consecutive quiet bands share one
   line rather than drawing two.

The measure, and its numbers
============================

The bar, the body, the page, the bands and both footers are full-bleed, and
what is held to the measure is their *contents*. A fill that stops short reads
as a wide box rather than as a change of ground.

.. list-table::
   :header-rows: 1

   * - Token
     - Value
     - What it decides
   * - ``--width-page``
     - 1200px
     - the measure the page is centred on
   * - ``--width-sidebar``
     - 210px
     - the rail
   * - ``--height-header``
     - 72px
     - the bar, and what the rail's sticky offset is measured from. 56px once
       the page has narrowed: the height a desktop can spare is height a phone
       is reading with
   * - ``--gutter-page``
     - 48px
     - the inset, before it is narrowed by the steps below

.. note::

   The inset is inherited rather than recomputed, because things that hang off
   the bar — the menu panel, the search drop — have to start where its
   contents do.

Where it sheds
==============

Each step is a thing the page can no longer afford, rather than a device it was
drawn for. **These are every width the design changes at**, and a stylesheet
that reaches for a sixth is a band nobody named — ``make verify
ARGS=breakpoints`` holds the two together.

.. list-table::
   :header-rows: 1

   * - At most
     - What changes
   * - 1140px
     - the gutters narrow, and the vertical rhythm with them
   * - 860px
     - the rail stops being a column, the bar's own menu being where the site
       is read at this width; the bar gives its height back to the page; the
       version badge leaves it
   * - 640px
     - a row of controls wraps, and the marks at the end of the footer's
       closing line give up their end of it — there is none once the line broke
   * - 460px
     - the wordmark keeps the signet and the product, and drops the brand —
       the surviving name is set as the mark it now is

And one the other way. At 1296px the page has room to give rather than to save:
the local contents leaves the flow and stands beside the column, so the page
reads rail, text, contents with the same width either side. It is the only
width in this system that adds something — see :doc:`documents`.

.. important::

   What the bar does with the search field and the sections is **not** one of
   these. ``sds-nav-main`` measures what they need against the room the row has
   left, because a bar holds a product name as long as the product is called;
   what it can no longer hold waits in the one drawer that carries the site's
   whole menu rather than being dropped — see :doc:`components/navigation`.

   Neither is a split or a grid. Both reflow by the minimum their own halves
   and items hold, so what decides is the column they stand in and never the
   window — and beside a rail those are different numbers.

Layout a page may reach for
===========================

Named, rather than written inline on the page, for one reason: layout a page
writes for itself is layout nothing else can keep in step.

The vocabulary stays this small on purpose, and it stays composition. A block
carries its own step, and the pairs of a title group state theirs, so a page
composes loose and stands on the grid with no container paying for it. A stack
regroups where one distance should hold whatever a box comes to hold; and a
set that *means* something graduates into a component that pays its own steps
— ``sds-field-group`` is a control and what stands with it, because a field
and a row of actions each owe no step alone. What never returns is the wrapper
that exists only to space things: that is layout wearing no name.

.. list-table::
   :header-rows: 1

   * - Class
     - What it lays out
   * - ``.sds-sections``
     - the rhythm *between* the parts of a page
   * - ``.sds-stack``
     - the rhythm *inside* one of them
   * - ``.sds-stack--tight``
     - a title group regrouped — the trail, the eyebrow, the heading, the
       lead read as one thing. Composed loose the pairs already stand at this
       step; the class remains for a box that holds more than the pairs
   * - ``.sds-actions``
     - a row of controls, centred — a link beside a button is a line of text
       in a box the button's height
   * - ``.sds-row``
     - a row of small things that may run onto a second line: badges, a
       version, the two words under a heading
   * - ``.sds-row__end``
     - the one thing in such a row that belongs at the far end of it
   * - ``.sds-split``
     - two of anything, side by side until there is no room for two
   * - ``.sds-split--center``, ``.sds-split--end``
     - where the shorter half stands against the taller one: level with it, or
       at its foot. Nothing said, it stands at the top
   * - ``.sds-split--leads-end``
     - the second half read first once the two have stacked — a picture beside
       the sentence on a page and above it on a phone
   * - ``.sds-grid``
     - the wall a set is read in, reflowing by its own minimum; ``sds-grid``
       is the element that writes it, and a page reaches for that
   * - ``.sds-form``
     - one column of fields, at the measure a form is *filled in* rather than
       the one a page is read at

.. warning::

   None of these is a place to put a colour, a border or a type size. A class
   here says how far apart things stand and nothing else, which is what lets
   the same page frame hold a marketing band and a tool reference.

Which way the page runs
=======================

**Write** ``dir="rtl"`` **on** ``<html>`` **and the layout mirrors itself.**
That is the whole of what a project does. Nothing else is configured, no
second stylesheet is linked, and no class changes.

It works because the sheets are written in logical properties throughout — a
start edge follows the document rather than the screen, so a rail, a card's
action line, the bar's end cluster and a table's first column all change sides
together. Physical properties are what makes a mirrored page fall apart one
rule at a time, which is why they are not used even where a value looks
symmetrical today.

A drawing cannot mirror itself, so the glyphs the system uses to mean *onward*
are turned under ``:dir(rtl)``: the arrow on a card's action, the pager, the
pagination steps, and the marker on a closed fold. Only those — a page that
asked for ``actions-arrow-right`` named an arrow rather than a heading, and
gets the one it named.

.. note::

   **What this does not cover.** The type is not chosen for Arabic or Hebrew —
   :doc:`/design-system/type` ships a Latin pair, and a project setting an RTL
   script supplies the face for it. Nothing in the system reorders a sentence
   or a date, because nothing in it writes one.

The mark in the bar
===================

.. code-block:: html

   <a class="sds-lockup" href="/">
     <sds-image class="sds-signet" src="/soul/assets/signet.svg" alt=""
       width="24" height="24"></sds-image>
     <span class="sds-wordmark"><span class="sds-wordmark__brand">TYPO3</span><span
       class="sds-wordmark__pipe" aria-hidden="true"></span><span
       class="sds-wordmark__product">Soul</span></span>
   </a>

The lockup states the mark's size itself, because a signet is crisp only at
the size its file was drawn for and a number left to each call site drifts. The
pipe is the third and last place ``--accent`` may appear. On a narrow bar the
brand half and the pipe go: the signet already says whose the page is, and the
product's own name is what says which page it is.

.. seealso::

   :doc:`/design-system/brand` for which drawing to hand over at which size,
   and :doc:`/design-system/screens` for the finished pages these parts were
   taken from.
