:navigation-title: Overlays

========
Overlays
========

What floats over the page, and what it floats on. Depth is spent only here —
nothing that stays on the page is told apart by elevation — and a shadow alone
would not say what is underneath, so an overlay takes a wash and a hairline to
be an overlay *of* something. It is also why the specimen draws the modal
inside a bordered box rather than floating it over the page.

.. specimen:: components/surfaces/surfaces.card.html
   :viewport: 700x431
   :title: The planes, and what floats over them

Surface and behaviour, apart
============================

``sds-modal`` draws the surface, which is what a card can document: a card is a
still picture and has nothing to open. ``sds-dialog`` is the behaviour —
opening, taking the focus and giving it back, Escape, the page behind it inert
— on the platform's ``<dialog>``, which does all of it correctly.

Deliberately not one component: a dialog that had to be opened to be drawn
would be undocumentable, and a surface that grabbed the focus would be unusable
in a specimen.

How big one is
==============

A size is a shape rather than a width: each one says how wide the surface is
*and* how tall it may get, so two dialogs of the same size are the same box
whatever is written in them. Past that height nothing grows — the head and the
foot stay where they are and ``sds-modal__body`` is what scrolls.

.. list-table::
   :header-rows: 1

   * - Size
     - Class
     - Wide
     - Tall, at most
   * - ``auto``
     - ``sds-modal``
     - the content's own, up to ``--measure-modal 560px``
     - what keeps it on the screen
   * - ``sm``
     - ``sds-modal--sm``
     - ``--modal-width-sm 360px``
     - ``--modal-height-sm``
   * - ``md``
     - ``sds-modal--md``
     - ``--modal-width-md``, the reading measure
     - ``--modal-height-md``
   * - ``lg``
     - ``sds-modal--lg``
     - ``--modal-width-lg 800px``
     - ``--modal-height-lg``

``sm`` is the default, because a dialog asks one question. ``md`` is the width
prose is read at. ``lg`` is past the reading measure on purpose: what needs that
much room is operated rather than read — a table, a picker, a diff — and a
question set that wide is one nobody finishes reading. Every size gives its
gutter back on a narrow screen rather than running to the edges.

.. _component-sds-dialog:

sds-dialog
==========

.. code-block:: html

   <sds-button for="confirm-delete" command="show">Remove the token</sds-button>

   <sds-dialog id="confirm-delete" heading="Remove this token?"
     body="Anything using it stops answering immediately."
     .actions="${[cancel, remove]}"></sds-dialog>

.. confval:: heading
   :name: sds-dialog-heading
   :type: string
   :required: true

   Also the dialog's accessible name.

.. confval:: body
   :name: sds-dialog-body
   :type: string | markup

.. confval:: actions
   :name: sds-dialog-actions
   :type: "markup[]"

   Rendered buttons. **Ghost first, primary last** — the order the rest of the
   system reads in.

.. confval:: size
   :name: sds-dialog-size
   :type: "auto | sm | md | lg"
   :default: sm

   How much room it takes, in both directions — see `How big one is`_.

.. confval:: width
   :name: sds-dialog-width
   :type: number
   :default: 0

   A width of its own, where the question needs one the scale has no size for.
   The exception, and the one place a dialog carries a number; unset, the size
   decides.

.. confval:: open
   :name: sds-dialog-open
   :type: boolean
   :default: false

``show()`` opens it modally and ``close()`` closes it; it answers ``sds-command``
from a button that names it with ``for``.

.. _component-sds-modal:

sds-modal
=========

The surface alone — the same head, body and foot, with nothing that opens or
closes it. For a specimen, and for a page that positions and manages its own
floating surface.

.. confval:: heading
   :name: sds-modal-heading
   :type: string

.. confval:: body
   :name: sds-modal-body
   :type: string | markup

.. confval:: actions
   :name: sds-modal-actions
   :type: "markup[]"

.. confval:: size
   :name: sds-modal-size
   :type: "auto | sm | md | lg"
   :default: sm

.. confval:: width
   :name: sds-modal-width
   :type: number
   :default: 0

.. note::

   It is positioned by whatever opens it. This is one of the four elements that
   draw nothing where they stand, so the element is ``display: contents`` and
   the styles land on the box it actually draws.

.. _component-sds-overlay:

sds-overlay
===========

The wash a floating surface sits on — ``--surface-overlay``, never a shadow. It
takes nothing and draws nothing else: what floats on it is a modal, and that is
its own element.

.. code-block:: html

   <sds-overlay></sds-overlay>

.. seealso::

   :doc:`media` for ``sds-lightbox``, which is the same platform ``<dialog>``
   with a different surface: a modal stops at a reading measure because what is
   inside one is read, and a drawing is looked at.
