:navigation-title: Components

==========
Components
==========

Every element in this system renders **light DOM** and emits the ``sds-``
classes the stylesheet defines. There is no shadow root, no slot and nothing
to theme twice. The element is a shorter, safer way to write markup the
class layer already describes.

The reference pages follow the concerns in the navigation, not the
implementation directories. That grouping is for a browse. The index below
is alphabetical, because a reader who looks up an element knows its name and
not its concern.

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

Alphabetical, because a reader who looks one up knows its name and not its
group.

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
   * - ``sds-checkbox-group``
     - tick any of these, under one question
     - :ref:`Forms — sds-checkbox-group <component-sds-checkbox-group>`
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
   * - ``sds-eyebrow``
     - the line over a title, saying what kind of thing it opens
     - :ref:`Content — sds-eyebrow <component-sds-eyebrow>`
   * - ``sds-field``
     - one line of whatever a reader types
     - :ref:`Forms — sds-field <component-sds-field>`
   * - ``sds-field-error``
     - the message under an invalid field
     - :ref:`Forms — sds-field-error <component-sds-field-error>`
   * - ``sds-field-group``
     - fields that answer one question, under one caption
     - :ref:`Forms — sds-field-group <component-sds-field-group>`
   * - ``sds-file``
     - the platform's own picker, with its button painted
     - :ref:`Forms — sds-file <component-sds-file>`
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
     - the wall a reader reads a set in
     - :ref:`Content — sds-grid <component-sds-grid>`
   * - ``sds-icon``
     - one icon from the set, in the document rather than linked
     - :ref:`Controls — sds-icon <component-sds-icon>`
   * - ``sds-icon-tile``
     - one glyph in a wall of them, scanned rather than read
     - :ref:`Content — sds-icon-tile <component-sds-icon-tile>`
   * - ``sds-image``
     - a picture, and nothing around it
     - :ref:`Media — sds-image <component-sds-image>`
   * - ``sds-lightbox``
     - a drawing open at the size of its drawing
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
     - the way on from a page in a sequence
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
   * - ``sds-progress``
     - how far a running job has got
     - :ref:`Controls — sds-progress <component-sds-progress>`
   * - ``sds-quote``
     - a sentence borrowed from somewhere, with where it came from
     - :ref:`Content — sds-quote <component-sds-quote>`
   * - ``sds-radio``
     - one answer out of a few, all of them visible
     - :ref:`Forms — sds-radio <component-sds-radio>`
   * - ``sds-range``
     - a value picked along a run of them
     - :ref:`Forms — sds-range <component-sds-range>`
   * - ``sds-search``
     - the search for a page in a site with no server
     - :ref:`Navigation — sds-search <component-sds-search>`
   * - ``sds-search-hits``
     - the answer to a query
     - :ref:`Navigation — sds-search-hits <component-sds-search-hits>`
   * - ``sds-search-result``
     - one hit in a list of them
     - :ref:`Navigation — sds-search-result <component-sds-search-result>`
   * - ``sds-run``
     - work in progress, as its stops
     - :ref:`Controls — sds-run <component-sds-run>`
   * - ``sds-select``
     - one answer out of a list the reader does not need to see
     - :ref:`Forms — sds-select <component-sds-select>`
   * - ``sds-stat``
     - a number stated as a fact
     - :ref:`Content — sds-stat <component-sds-stat>`
   * - ``sds-steps``, ``sds-step``
     - an instruction read from the top, numbered down one rail
     - :ref:`Content — sds-steps <component-sds-steps>`,
       :ref:`sds-step <component-sds-step>`
   * - ``sds-surface``
     - a filled plane holding a statement
     - :ref:`Content — sds-surface <component-sds-surface>`
   * - ``sds-swatch``
     - one colour, as the chip, the name and what it resolves to
     - :ref:`Content — sds-swatch <component-sds-swatch>`
   * - ``sds-switch``
     - a setting that takes effect where it stands
     - :ref:`Forms — sds-switch <component-sds-switch>`
   * - ``sds-table``
     - rows and columns, with the scroll a wide one needs
     - :ref:`Data — sds-table <component-sds-table>`
   * - ``sds-tabs``, ``sds-tab-item``
     - one set of panels, one of them shown
     - :ref:`Navigation — sds-tabs <component-sds-tabs>`,
       :ref:`sds-tab-item <component-sds-tab-item>`
   * - ``sds-textarea``
     - an answer of more than one line
     - :ref:`Forms — sds-textarea <component-sds-textarea>`
   * - ``sds-theme``
     - the mode the page is in, as one press that changes it
     - :ref:`Controls — sds-theme <component-sds-theme>`

What box an element is
======================

Each component's own stylesheet states this, in a ``@layer base`` block
above the one that draws it: the flow contract, whose three rules
:doc:`/frontend/stylesheets` explains. A contract split across a shared list
and a component file drifts into two layers.

**Every element is the box it draws.** A custom element is ``inline`` until
told otherwise. An inline tag around a block makes itself the box a row lays
out, while the block sits inside it. Gap, alignment and margin then all land
one level too high. So the stylesheet states a display for every element,
and the class it draws states the same one. Where no script runs, only the
class remains, and the page measures the same either way.

An element in a flow is a block and carries the step below it. That is why
what it draws inside gives that step up. An element in a line of text or a
row of controls is inline. Either way a reader reads a distance off the
element it belongs to, not off two of them. No rule in this system reaches
past a tag to find a block.

Four elements are ``display: contents``: ``sds-dialog``, ``sds-lightbox``,
``sds-modal`` and ``sds-overlay``. What they draw is in the top layer or
fixed to the viewport, so a box where they stand is one nothing fills. That
is the whole list, and each states it.

What a component is made of
===========================

**Everything a component is, it is through a property of its own.** A set
at the top of its stylesheet that every declaration below reads. So a
variant assigns values and draws nothing, and a surface that needs one
instance different sets a property instead of a new class. The shape, its
reasons and the nesting rules are :doc:`/frontend/stylesheets`. The
consequence matters here: an ancestor can re-theme any single instance
through its ``--sds-<name>-*`` properties, and through nothing else.

Addressed, never rebuilt
========================

**Everything that fits in a string is a property.** Between the tags goes
only what an attribute cannot carry, and that is *content*, never structure.
The paragraphs of a summary, the blocks behind a question, the picture a
renderer already wrote.

.. code-block:: html

   <!-- Addressed. -->
   <sds-card heading="Release 1.4" tag="news" label="12 May" href="/news/1-4">
     <p>What changed, in the two lines that decide whether it is opened.</p>
   </sds-card>

   <!-- Rebuilt. This is the failure the system exists to prevent. -->
   <article class="sds-card">
     <div class="sds-card__body">…</div>
   </article>

A ``sds-x__y`` class is ``sds-x``'s own name for its own node. A page can
write ``.sds-card`` and ``.sds-note--warn``. It must not write
``.sds-card__foot``: the day that node changes, every hand-written copy is a
surface nobody fixes.

.. important::

   If an element cannot say something a page needs, close the gap **in the
   element**. A consumer who writes three declarations into their own
   stylesheet is the outcome this system exists to prevent; see
   :doc:`/design-system/index`.

Properties and attributes
=========================

Strings, numbers and booleans are attributes, and a server writes them. A
list or a piece of markup is a **property**, set from JavaScript or from a
template that binds one:

.. code-block:: html

   <sds-table density="compact" scrollable
     .columns="${[{ head: 'Tool' }, { head: 'Answers', cls: 'sds-td-meta' }]}"
     .rows="${[{ cells: ['search', 'yes'] }]}"></sds-table>

A renderer that holds markup, not data, has the other route: write the
markup between the tags and let the element take it. That is how the Guides
theme emits a code block with its colour and a rail with its links resolved.
And a figure whose picture is on the page before a script runs.

Where a property's name is more than one word, its attribute has its own
spelling:

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

   ``box-style`` carries layout for the plane itself, the box that draws the
   frame. A ``style`` on the element sizes the block around it instead. The
   two are different boxes, and the property says which one you mean.

Names that had to differ
========================

Each of these is a global HTML or ARIA attribute a component must not
override.

.. list-table::
   :header-rows: 1

   * - Written
     - Instead of
     - Because
   * - ``heading``
     - ``title``
     - ``title`` is the global attribute, and puts a tooltip on the whole
       component
   * - ``as``
     - ``role``
     - ``role`` is the ARIA attribute, so ``role="maintainer"`` claims a role
       that does not exist, and axe says so
   * - ``code-lang``
     - ``lang``
     - ``lang`` names the *human* language, so ``lang="json"`` sends every
       screen reader to a language tag that does not exist

What an element announces
=========================

Every event below bubbles and crosses roots, so a page listens on the
element, not on what is inside it.

.. list-table::
   :header-rows: 1

   * - Event
     - From
     - ``detail``
   * - ``sds-change``
     - ``sds-nav-pills``, ``sds-nav-main``, ``sds-nav-rail``, ``sds-tabs``
     - ``{ index, label }``, the item that became current
   * - ``sds-change``
     - ``sds-nav-pagination``
     - ``{ page }``, one-based. **Cancelable**: call ``preventDefault()`` to
       page in place and not follow the link
   * - ``sds-change``
     - ``sds-checkbox``, ``sds-switch``, ``sds-radio``,
       ``sds-checkbox-group``, ``sds-select``, ``sds-file``
     - the new state, the chosen value, the values ticked, or the files chosen
   * - ``sds-input``
     - ``sds-field``, ``sds-textarea``, ``sds-range``
     - what is in the field, or where the thumb now stands
   * - ``sds-command``
     - ``sds-button`` with ``for``
     - ``{ command, source }``, sent **to the element named by** ``for``,
       the way the platform's own invokers do it
   * - ``sds-note-action``
     - ``sds-note`` with ``action``
     - the label pressed. A note with ``href`` announces nothing: the link is
       the answer
   * - ``sds-dialog-confirm``
     - ``sds-dialog`` with ``confirm-label``
     - none. The press is the whole message
   * - ``sds-dialog-cancel``
     - ``sds-dialog``
     - none. Anything that closed a dialog without a confirm: the cancel
       button, the header X, Escape, a ``close()``
   * - ``sds-theme-change``
     - ``sds-theme``
     - ``{ theme }``: ``"light"``, ``"dark"``, or ``null`` for the machine's

One control wires to another in markup:

.. code-block:: html

   <sds-button for="the-drawing">Open the drawing</sds-button>
   <sds-lightbox id="the-drawing" src="/art/pipeline.svg" alt="…"></sds-lightbox>

An id and an event, so neither end holds the other. ``command`` says what
the press asks for: ``show`` unless written otherwise, and ``close`` or
``toggle`` where that is what the press means.

Before the script, and without one
==================================

These elements survive both. A prerendered page holds its markup already.
The element upgrades it in place instead of a second draw, and a reader with
no script keeps everything but the behaviour.

Two things follow for anything that renders in Node: the specimen cards, the
Guides site, a static export.

- The element lifts the content between the tags on connect, which never
  happens outside a browser. The same content arrives as the ``content``
  property instead, and every element reads whichever it got.
- A card carries no JavaScript, so ``renderStatic`` flattens each element to
  the markup it renders. An element with children has no flat form; the body
  goes in as a property there.

.. seealso::

   :doc:`/frontend/layout` for the page these components stand in, and
   :doc:`/design-system/screens` for finished pages built out of them.
