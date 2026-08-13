:navigation-title: Components

==========
Components
==========

Every element in this system renders **light DOM** and emits the ``sds-``
classes the stylesheet defines. There is no shadow root to pierce, no slot to
name and nothing to theme twice: the element is a shorter, safer way to write
markup the class layer already describes.

.. toctree::
   :titlesonly:

   controls
   content
   data
   media
   navigation
   forms
   overlays

A component is addressed, never rebuilt
=======================================

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

Properties, attributes, and what a server can write
===================================================

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
     - ``sds-pagination``
   * - ``previousHref``, ``previousLabel``, ``nextHref``, ``nextLabel``
     - ``previous-href``, ``previous-label``, ``next-href``, ``next-label``
     - ``sds-pager``

.. note::

   ``box-style`` exists because every host in this system is
   ``display: contents`` and therefore not in the box tree: a width or a
   ``flex`` set on the tag would land on nothing. What the property carries is
   given to the element that is actually laid out.

Names that had to differ from the obvious one
=============================================

Three of them, and each is a global HTML or ARIA attribute that a component
would otherwise have quietly overridden.

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
     - ``sds-pills``, ``sds-menu``, ``sds-rail``, ``sds-tabs``
     - ``{ index, label }`` — the item that became current
   * - ``sds-change``
     - ``sds-pagination``
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
