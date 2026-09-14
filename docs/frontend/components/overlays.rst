:navigation-title: Overlays

========
Overlays
========

What floats over the page, and what it floats on. Depth appears only here.
Nothing on the page stands apart by elevation, and a shadow alone does not
say what is underneath. So an overlay takes a wash and a hairline to be an
overlay *of* something. That is also why the specimen draws the modal
inside a bordered box, not over the page.

.. specimen:: components/surfaces/surfaces.card.html
   :viewport: 700x428
   :title: The planes, and what floats over them

Surface and behaviour, apart
============================

``sds-modal`` draws the surface, which a card can document. A card is a
still picture and has nothing to open. ``sds-dialog`` is the behaviour. The
open, the focus in and back, Escape, the page behind it inert, all on the
platform's ``<dialog>``, which does all of it right.

Not one component, on purpose. A dialog that has to open before it draws
has no documentation, and a surface that takes the focus has no specimen.

How big one is
==============

A size is a shape, not a width. Each one says how wide the surface is *and*
how tall it can get. So two dialogs of the same size are the same box,
whatever they say. Past that height nothing grows. The head and the foot
stay, and ``sds-modal__body`` scrolls.

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

``sm`` is the default, because a dialog asks one question. ``md`` is the
reading width of prose. ``lg`` is past the reading measure on purpose. What
needs that much room is a thing to operate, not to read: a table, a picker,
a diff. A question that wide is one nobody reads to the end. Every size
gives its gutter back on a narrow screen.

The head, in every surface that has one
=======================================

The title on the left and the close on the right, the same row whichever
surface opened. A ``<dialog>``, the ``sds-modal`` a card documents, the
lightbox. It carries a property set of its own for that reason. A custom
property travels down and never sideways, and the head inside
``sds-lightbox``, which is no ``.sds-modal``, has no other set to read.

Two things settle there, and a glance judges a surface by both. The close
is a square around a glyph. Its box reaches the padding edge, while the
mark inside stands half a square further in than the title. The head gives
that half back, and the two marks end up the same distance from their own
edges. And the head is one control tall, the band the foot's buttons make.
So the two strips the body sits between are one band.

A long heading wraps. The close never gives. Squeezed, it is a rectangle
around a glyph off its centre. So it keeps its square, at the end of the
row, with the row's gap before it.

.. _component-sds-dialog:

sds-dialog
==========

.. code-block:: html

   <sds-button for="confirm-delete" command="show">Remove the token</sds-button>

   <sds-dialog id="confirm-delete" heading="Remove this token?"
     body="Anything using it stops answering immediately."
     confirm-label="Remove" confirm-icon="actions-delete"
     tone="danger"></sds-dialog>

A question
==========

A ``confirm-label`` is the whole of a confirmation. The dialog draws the
pair itself, the way out first, the press that answers last, and says which
one the reader pressed. Nothing above comes from a script, which is the
point. A question is markup, and the button that opens it names the dialog
by id.

The pair is a ``<form method="dialog">``, so the platform closes the dialog
and records the press. Two events carry it, both bubbling and composed:

.. list-table::
   :header-rows: 1

   * - Event
     - When
   * - ``sds-dialog-confirm``
     - the reader pressed the confirm button
   * - ``sds-dialog-cancel``
     - anything else closed it: the cancel button, the header X, Escape, a
       ``close()``

A dismissal is an answer. So the second one fires whatever closed the
dialog, with or without the dialog's own pair. ``ask()`` is the same thing
as a promise, for a caller that waits for the answer:

.. code-block:: js

   if (await document.querySelector('#confirm-delete').ask()) remove(token);

Set ``actions``, and the dialog draws those buttons instead. A question with
more than two answers, or one whose press is a link, is markup a caller
writes.

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

   The label of the button that answers yes. With it, the dialog draws its
   own pair; see `A question`_. Say what goes, not "OK". A reader who cannot
   tell the tones apart still reads the consequence off the button.

.. confval:: confirm-icon
   :name: sds-dialog-confirm-icon
   :type: string

   A glyph on that button, before its label: an icon name, the vocabulary
   ``sds-icon`` takes. The press with the consequence is the one worth a
   mark. The way out stays a word. Two marked buttons side by side are a
   pair nothing tells apart.

.. confval:: cancel-label
   :name: sds-dialog-cancel-label
   :type: string
   :default: Cancel

.. confval:: tone
   :name: sds-dialog-tone
   :type: "primary | danger"
   :default: primary

   What kind of press the confirm is. ``danger`` is the press with no undo.

.. confval:: actions
   :name: sds-dialog-actions
   :type: "markup[]"

   Rendered buttons, where the pair cannot answer the question. **Ghost
   first, primary last**, the order the rest of the system reads in.

.. confval:: size
   :name: sds-dialog-size
   :type: "auto | sm | md | lg"
   :default: sm

   How much room it takes, in both directions; see `How big one is`_.

.. confval:: width
   :name: sds-dialog-width
   :type: number
   :default: 0

   A width of its own, where the question needs one the scale has no size
   for. The exception, and the one place a dialog carries a number. Unset,
   the size decides.

.. confval:: open
   :name: sds-dialog-open
   :type: boolean
   :default: false

``show()`` opens it modally, ``ask()`` opens it and settles on the answer,
and ``close()`` closes it. It answers ``sds-command`` from a button that
names it with ``for``.

.. _component-sds-modal:

sds-modal
=========

The surface alone: the same head, body and foot, with nothing that opens or
closes it. For a specimen, and for a page that positions and manages its
own floating surface.

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

   Whatever opens it positions it. This is one of the four elements that
   draw nothing where they stand. So the element is ``display: contents``,
   and the styles land on the box it draws.

.. _component-sds-overlay:

sds-overlay
===========

The wash a floating surface sits on: ``--surface-overlay``, never a shadow.
It takes nothing and draws nothing else. What floats on it is a modal, and
that is its own element.

.. code-block:: html

   <sds-overlay></sds-overlay>

.. seealso::

   :doc:`media` for ``sds-lightbox``, the same platform ``<dialog>`` with a
   different surface. A modal stops at a reading measure because a reader
   reads what is inside one, and a reader looks at a drawing.
