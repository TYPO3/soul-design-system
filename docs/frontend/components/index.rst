:navigation-title: Components

==========
Components
==========

Every element in this system renders **light DOM** and emits the ``sds-``
classes the stylesheet defines. There is no shadow root to pierce, no slot to
name and nothing to theme twice: the element is a shorter, safer way to write
markup the class layer already describes.

The reference pages follow the concerns named in the navigation rather than
the implementation directories. That grouping is for browsing; the index
below remains alphabetical, because somebody looking up an element already
knows its name and should not have to know which concern owns it.

.. toctree::
   :titlesonly:

   controls
   content
   data
   media
   navigation
   forms
   overlays

Element index
=============

Alphabetical, because a reader looking one up already knows its name and not
which group it was filed under.

.. list-table::
   :header-rows: 1

   * - Element
     - What it is
     - Reference
   * - ``sds-accordion``, ``sds-accordion-item``
     - questions with their answers folded behind them
     - :ref:`Navigation — sds-accordion <component-sds-accordion>`,
       :ref:`sds-accordion-item <component-sds-accordion-item>`
   * - ``sds-badge``
     - a small, named piece of state
     - :ref:`Controls — sds-badge <component-sds-badge>`
   * - ``sds-button``
     - the action that starts work, or the press that is a link
     - :ref:`Controls — sds-button <component-sds-button>`
   * - ``sds-byline``
     - who wrote it, and when
     - :ref:`Content — sds-byline <component-sds-byline>`
   * - ``sds-card``
     - a way into something: a chapter, a product, a news entry, a page
     - :ref:`Content — sds-card <component-sds-card>`
   * - ``sds-checkbox``
     - one thing that is either so or not
     - :ref:`Forms — sds-checkbox <component-sds-checkbox>`
   * - ``sds-code``
     - a fenced block, its head and its copy button
     - :ref:`Data — sds-code <component-sds-code>`
   * - ``sds-confval``
     - one configuration value in a reference
     - :ref:`Data — sds-confval <component-sds-confval>`
   * - ``sds-dialog``
     - a surface that opens over the page, and what opens it
     - :ref:`Overlays — sds-dialog <component-sds-dialog>`
   * - ``sds-diff``
     - a file's changes
     - :ref:`Data — sds-diff <component-sds-diff>`
   * - ``sds-embed``
     - a document from somewhere else, in a frame this page controls
     - :ref:`Media — sds-embed <component-sds-embed>`
   * - ``sds-field``
     - a text field, a text area and a select, in one element
     - :ref:`Forms — sds-field <component-sds-field>`
   * - ``sds-field-error``
     - the message under an invalid field
     - :ref:`Forms — sds-field-error <component-sds-field-error>`
   * - ``sds-figure``
     - a picture and the claim it makes
     - :ref:`Media — sds-figure <component-sds-figure>`
   * - ``sds-footer``
     - how a page ends, and where the rest of the site is
     - :ref:`Navigation — sds-footer <component-sds-footer>`
   * - ``sds-form-errors``
     - what stopped the form, at the top of it
     - :ref:`Forms — sds-form-errors <component-sds-form-errors>`
   * - ``sds-grid``
     - the wall a set is read in
     - :ref:`Content — sds-grid <component-sds-grid>`
   * - ``sds-icon``
     - one icon from the set, in the document rather than linked
     - :ref:`Controls — sds-icon <component-sds-icon>`
   * - ``sds-image``
     - a picture, and nothing around it
     - :ref:`Media — sds-image <component-sds-image>`
   * - ``sds-lightbox``
     - a drawing opened at the size it was drawn
     - :ref:`Media — sds-lightbox <component-sds-lightbox>`
   * - ``sds-link``
     - a link, and always an ``<a>`` with an ``href``
     - :ref:`Controls — sds-link <component-sds-link>`
   * - ``sds-modal``
     - the surface alone, with nothing that opens or closes it
     - :ref:`Overlays — sds-modal <component-sds-modal>`
   * - ``sds-nav-breadcrumb``
     - where the page sits, as a trail
     - :ref:`Navigation — sds-nav-breadcrumb <component-sds-nav-breadcrumb>`
   * - ``sds-nav-main``
     - the bar at the top of a page
     - :ref:`Navigation — sds-nav-main <component-sds-nav-main>`
   * - ``sds-nav-pager``
     - the way on from a page that is read in order
     - :ref:`Navigation — sds-nav-pager <component-sds-nav-pager>`
   * - ``sds-nav-pagination``
     - where a list continues
     - :ref:`Navigation — sds-nav-pagination <component-sds-nav-pagination>`
   * - ``sds-nav-pills``
     - navigation for the sections of a page
     - :ref:`Navigation — sds-nav-pills <component-sds-nav-pills>`
   * - ``sds-nav-rail``
     - the navigation rail beside a column
     - :ref:`Navigation — sds-nav-rail <component-sds-nav-rail>`
   * - ``sds-nav-toc``
     - what is on this page, and where in it the reader is
     - :ref:`Navigation — sds-nav-toc <component-sds-nav-toc>`
   * - ``sds-note``
     - what an answer carries besides the answer
     - :ref:`Content — sds-note <component-sds-note>`
   * - ``sds-overlay``
     - the wash a floating surface sits on
     - :ref:`Overlays — sds-overlay <component-sds-overlay>`
   * - ``sds-quote``
     - a sentence borrowed from somewhere, with where it came from
     - :ref:`Content — sds-quote <component-sds-quote>`
   * - ``sds-radio``
     - one answer out of a few, all of them visible
     - :ref:`Forms — sds-radio <component-sds-radio>`
   * - ``sds-search``
     - finding a page in a site that has no server
     - :ref:`Navigation — sds-search <component-sds-search>`
   * - ``sds-search-hits``
     - what a query was answered with
     - :ref:`Navigation — sds-search-hits <component-sds-search-hits>`
   * - ``sds-search-result``
     - one hit in a list of them
     - :ref:`Navigation — sds-search-result <component-sds-search-result>`
   * - ``sds-stat``
     - a number stated as a fact
     - :ref:`Content — sds-stat <component-sds-stat>`
   * - ``sds-surface``
     - a filled plane holding a statement
     - :ref:`Content — sds-surface <component-sds-surface>`
   * - ``sds-table``
     - rows and columns, with the scroll a wide one needs
     - :ref:`Data — sds-table <component-sds-table>`
   * - ``sds-tabs``, ``sds-tab-item``
     - one set of panels, one of them shown
     - :ref:`Navigation — sds-tabs <component-sds-tabs>`,
       :ref:`sds-tab-item <component-sds-tab-item>`
   * - ``sds-theme``
     - light or dark, as two segments with the chosen one filled
     - :ref:`Controls — sds-theme <component-sds-theme>`

What box an element is
======================

Each of these is stated in the component's own stylesheet, in a ``@layer
base`` block above the one that draws it — the display, the step and the box's
own give-up in the three lines that only mean anything together. A contract
split across a shared list and a component file is a contract that drifts into
two layers, which is how a byline once kept a step nothing could take off it.

**Every element is the box it draws.** A custom element is ``inline`` until it
is told otherwise, and an inline tag around a block makes itself the box a row
lays out while the block sits inside it — gap, alignment and margin then all
land one level too high. So the stylesheet states a display for every element,
and the class it draws states the same one: where no script runs the element is
gone and the class is what is left, and the page measures the same either way.

An element that stands in a flow is a block and carries the step below it,
which is why what it draws inside gives that step up. An element that stands in
a line of text or a row of controls is inline. Either way a distance is read off
the element it belongs to rather than assembled from two of them, and no rule in
this system reaches past a tag to find a block.

Four elements are ``display: contents`` — ``sds-dialog``, ``sds-lightbox``,
``sds-modal`` and ``sds-overlay``. What they draw is in the top layer or fixed
to the viewport, so a box where they stand is one nothing would ever fill. That
is the whole list, and it is stated rather than defaulted to.

What a component is made of
===========================

**Everything a component is, it is through a property of its own.** Each one
declares its set at the top of its own stylesheet, derived from the tokens
every component shares, and every declaration under it reads only that set:

.. code-block:: css

   .sds-btn {
     --sds-btn-height: var(--control-height);
     --sds-btn-fill: transparent;
     --sds-btn-fill-hover: var(--sds-btn-fill);

     min-height: var(--sds-btn-height);
     background: var(--sds-btn-fill);
   }

A variant, a size and a state then **assign values and draw nothing**:

.. code-block:: css

   .sds-btn--primary {
     --sds-btn-fill: var(--accent);
     --sds-btn-fill-hover: var(--accent-hover);
   }

   .sds-btn:hover { --sds-btn-fill: var(--sds-btn-fill-hover); }

Three things follow. There is no ``.sds-btn--primary:hover`` rule for a later
one to outweigh — the state is written once, whatever the variant. A size is a
handful of numbers rather than the same declarations repeated per variant. And
a surface that needs one instance different sets a property on it instead of
writing a class this system has never heard of.

A value that reaches a declaration without passing through the set is the
thing this prevents: ``line-height: 1.55`` in one component and
``var(--leading-body)`` in every other is drift nothing can see.
``make verify ARGS=sets`` holds every component to it. Two things are read
straight, and only two: the focus ring, because there is one ring, and the
colours that mean something — a component able to re-point those could draw an
error green.

The one thing the check cannot see is **where** a set is declared. A property
travels down: never sideways to a box beside the one that declared it, never
up to the page around it. A set therefore sits on an ancestor of everything
that reads it — which is why a tab panel standing beside its row carries its
own, and why the offset the page scrolls to is declared on the page rather
than on the bar that causes it.

Addressed, never rebuilt
========================

**Everything that fits in a string is a property.** Between the tags goes only
what an attribute cannot carry — and that is *content*, never structure: the
paragraphs of a summary, the blocks behind a question, the picture a renderer
already wrote.

.. code-block:: html

   <!-- Addressed. -->
   <sds-card heading="Release 1.4" tag="news" label="12 May" href="/news/1-4">
     <p>What changed, in the two lines that decide whether it is opened.</p>
   </sds-card>

   <!-- Rebuilt. This is the failure the system exists to prevent. -->
   <article class="sds-card">
     <div class="sds-card__body">…</div>
   </article>

A ``sds-x__y`` class is ``sds-x``'s own name for its own node. A page may write
``.sds-card`` and ``.sds-note--warn``; it may not write ``.sds-card__foot``,
because the day that node changes, every hand-written copy of it is a surface
nobody will fix.

.. important::

   If an element cannot say something a page needs, the gap is closed **in the
   element**. A consumer writing three declarations into their own stylesheet
   is the outcome this system exists to prevent — see :doc:`/design-system/index`.

Properties and attributes
=========================

Strings, numbers and booleans are attributes and a server writes them
directly. Anything that is a list or a piece of markup is a **property**, set
from JavaScript or from a template that binds one:

.. code-block:: html

   <sds-table density="compact" scrollable
     .columns="${[{ head: 'Tool' }, { head: 'Answers', cls: 'sds-td-meta' }]}"
     .rows="${[{ cells: ['search', 'yes'] }]}"></sds-table>

A renderer that holds markup rather than data has the other route: write the
markup between the tags and let the element take it. That is how the Guides
theme emits a code block that is already coloured, a rail that is already
resolved, and a figure whose picture is on the page before any script runs.

Where a property's name is more than one word, its attribute is spelled out
rather than left to be lower-cased:

.. list-table::
   :header-rows: 1

   * - Property
     - Attribute
     - On
   * - ``iconOnly``
     - ``icon-only``
     - ``sds-button``
   * - ``lang``
     - ``code-lang``
     - ``sds-code``
   * - ``boxStyle``
     - ``box-style``
     - ``sds-surface``
   * - ``fieldId``
     - ``field-id``
     - ``sds-field``
   * - ``minWidth``
     - ``min-width``
     - ``sds-field``
   * - ``perPage``
     - ``per-page``
     - ``sds-nav-pagination``
   * - ``previousHref``, ``previousLabel``, ``nextHref``, ``nextLabel``
     - ``previous-href``, ``previous-label``, ``next-href``, ``next-label``
     - ``sds-nav-pager``

.. note::

   ``box-style`` carries layout for the plane itself, which is the box that
   draws the frame. A ``style`` on the element sizes the block standing around
   it instead — the two are different boxes and the property says which one is
   meant.

Names that had to differ
========================

Each of these is a global HTML or ARIA attribute that a component would
otherwise have quietly overridden.

.. list-table::
   :header-rows: 1

   * - Written
     - Instead of
     - Because
   * - ``heading``
     - ``title``
     - ``title`` is the global attribute, and would put a tooltip on the whole
       component
   * - ``as``
     - ``role``
     - ``role`` is the ARIA attribute, so ``role="maintainer"`` claims a role
       that does not exist — and axe says so
   * - ``code-lang``
     - ``lang``
     - ``lang`` names the *human* language, so ``lang="json"`` sends every
       screen reader to a language tag that does not exist

What an element announces
=========================

Every event below bubbles and is composed, so a page listens on the element
rather than on whatever is inside it.

.. list-table::
   :header-rows: 1

   * - Event
     - From
     - ``detail``
   * - ``sds-change``
     - ``sds-nav-pills``, ``sds-nav-main``, ``sds-nav-rail``, ``sds-tabs``
     - ``{ index, label }`` — the item that became current
   * - ``sds-change``
     - ``sds-nav-pagination``
     - ``{ page }``, one-based. **Cancelable**: call ``preventDefault()`` to
       page in place instead of following the link
   * - ``sds-change``
     - ``sds-checkbox``, ``sds-radio``
     - the new state, or the chosen value
   * - ``sds-input``
     - ``sds-field``
     - what is in the field now
   * - ``sds-command``
     - ``sds-button`` with ``for``
     - ``{ command, source }`` — dispatched **on the element named by**
       ``for``, the way the platform's own invokers do it
   * - ``sds-theme-change``
     - ``sds-theme``
     - ``{ theme }`` — ``"light"``, ``"dark"``, or ``null`` for the machine's

Wiring one control to another is markup:

.. code-block:: html

   <sds-button for="the-drawing">Open the drawing</sds-button>
   <sds-lightbox id="the-drawing" src="/art/pipeline.svg" alt="…"></sds-lightbox>

An id and an event, so neither end holds the other. ``command`` says what is
being asked — ``show`` unless something else is written, and ``close`` or
``toggle`` where that is what the press means.

Before the script, and without one
==================================

These elements are written to survive both. A page rendered ahead of the
browser holds its markup already, the element upgrades it in place rather than
drawing it a second time, and a reader who runs no script keeps everything but
the behaviour.

Two things follow for anything rendering in Node — the specimen cards, the
Guides site, a static export:

- Content between the tags is lifted on connect, which never happens outside a
  browser. The same content arrives as the ``content`` property instead, and
  every element reads whichever it was given.
- A card carries no JavaScript at all, so ``renderStatic`` flattens each
  element to the markup it renders. An element that was handed children cannot
  be flattened — the body goes in as a property there.

.. seealso::

   :doc:`/frontend/layout` for the page these components stand in, and
   :doc:`/design-system/screens` for finished pages built out of them.
