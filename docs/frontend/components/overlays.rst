:navigation-title: Overlays

========
Overlays
========

What floats over the page, and what it floats on. The system has no shadows, so
an overlay needs a wash and a hairline to be an overlay *of* something — which
is also why the specimen draws the modal inside a bordered box rather than
floating it over the page.

.. specimen:: components/surfaces/surfaces.card.html
   :viewport: 700x425
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

.. confval:: width
   :name: sds-dialog-width
   :type: number
   :default: 330

   Centred, and bounded by the modal measure: what is inside one is read.

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

.. confval:: width
   :name: sds-modal-width
   :type: number
   :default: 330

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
