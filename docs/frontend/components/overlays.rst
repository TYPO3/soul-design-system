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
   :viewport: 700x428
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

The head, in every surface that has one
======================================

The title on the left and the close on the right, and the same row whichever
surface opened: a ``<dialog>``, the ``sds-modal`` a card documents, the
lightbox. It carries a property set of its own for that reason — a custom
property travels down and never sideways, so the head standing inside
``sds-lightbox``, which is no ``.sds-modal``, once read that surface's set as
nothing and drew itself with no padding, no rule, and the close button against
the corner.

Two things are settled there, and both are what a surface is judged by at a
glance. The close is a square around a glyph, so its box reaches the padding
edge while the mark inside stands half a square further in than the title does
on the left; the head gives that half back, and the two marks end up the same
distance from their own edges. And the head is one control tall — the band the
foot's buttons make — so the two strips the body sits between are one band
rather than a title crowded against the top edge under a foot that has room.

A heading long enough to wrap wraps. What never gives is the close: squeezed it
would be a rectangle around a glyph that is no longer centred in its own target,
so it keeps its square, at the end of the row, with the row's gap between it and
the last word.

.. _component-sds-dialog:

sds-dialog
==========

.. code-block:: html

   <sds-button for="confirm-delete" command="show">Remove the token</sds-button>

   <sds-dialog id="confirm-delete" heading="Remove this token?"
     body="Anything using it stops answering immediately."
     confirm-label="Remove" confirm-icon="actions-delete"
     tone="danger"></sds-dialog>

Asking a question
=================

A ``confirm-label`` is the whole of a confirmation: the dialog draws the pair
itself — the way out first, the press that answers last — and says which one
was pressed. Nothing above is bound from a script, which is the point: a
question is markup, and the button that opens it names the dialog by id.

The pair is a ``<form method="dialog">``, so the platform closes the dialog and
records the press. Two events carry it, both bubbling and composed:

.. list-table::
   :header-rows: 1

   * - Event
     - When
   * - ``sds-dialog-confirm``
     - the confirming button was pressed
   * - ``sds-dialog-cancel``
     - anything else closed it — the cancel button, the header X, Escape, a
       ``close()``

A dismissal is an answer, so the second one fires whatever closed the dialog
and whether or not it was drawing its own pair. ``ask()`` is the same thing as
a promise, for a caller that has to wait for the answer rather than hear about
it:

.. code-block:: js

   if (await document.querySelector('#confirm-delete').ask()) remove(token);

Set ``actions`` and those buttons are drawn instead: a question with more than
two answers, or one whose press is a link, is markup a caller writes.

.. confval:: heading
   :name: sds-dialog-heading
   :type: string
   :required: true

   Also the dialog's accessible name.

.. confval:: body
   :name: sds-dialog-body
   :type: string | markup

.. confval:: confirm-label
   :name: sds-dialog-confirm-label
   :type: string

   The label of the button that answers yes. Written, the dialog draws its own
   pair — see `Asking a question`_. Say what goes rather than "OK": a reader
   who cannot tell the tones apart still reads the consequence off the button.

.. confval:: confirm-icon
   :name: sds-dialog-confirm-icon
   :type: string

   A glyph on that button, ahead of its label — an icon name, the same
   vocabulary ``sds-icon`` takes. The press that carries the consequence is the
   one worth marking; the way out stays a word, because two marked buttons
   beside each other are a pair nothing tells apart.

.. confval:: cancel-label
   :name: sds-dialog-cancel-label
   :type: string
   :default: Cancel

.. confval:: tone
   :name: sds-dialog-tone
   :type: "primary | danger"
   :default: primary

   What kind of press the confirming one is. ``danger`` is the press that
   cannot be undone.

.. confval:: actions
   :name: sds-dialog-actions
   :type: "markup[]"

   Rendered buttons, where the pair cannot answer the question. **Ghost first,
   primary last** — the order the rest of the system reads in.

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

``show()`` opens it modally, ``ask()`` opens it and settles on the answer, and
``close()`` closes it; it answers ``sds-command`` from a button that names it
with ``for``.

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
