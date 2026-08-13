:navigation-title: Forms

=====
Forms
=====

The one surface where the reader has to do something rather than read
something. Every element here wraps a **real** control — an ``<input>``, a
``<select>``, a ``<textarea>``, a ``<fieldset>`` — so the keyboard, the tap
target, the platform's validation and how it all reads out arrive with it.
Anything drawn instead looks right in a screenshot and cannot be typed in.

.. specimen:: components/core/input.card.html
   :viewport: 700x180
   :title: Fields & search

sds-field
=========

A text field, a text area and a select, in one element. It has two shapes and
the difference is ``caption``.

.. tabs::

   .. tab:: In a form

      .. code-block:: html

         <sds-field caption="Your email" field-id="email" name="email"
           type="email" hint="Used for the reply and for nothing else."
           required></sds-field>

      With a caption it renders the row a form owes a control: **label above,
      hint under, error under both.** The label is a real ``<label>`` pointing
      at the control's own id, so pressing the words reaches the field and an
      error summary can send a reader straight to it.

   .. tab:: On a surface

      .. code-block:: html

         <sds-field icon="actions-search" value="Filter tools"
           label="Filter tools" min-width="260"></sds-field>

      Without one it is the bare control — right in a header, a toolbar, a
      filter row, where the surface around it says what it is for. It still
      owes a ``label``, because nothing visible names it.

.. confval:: caption
   :name: sds-field-caption
   :type: string

   The visible label, which turns this into a field in a *form*.

.. confval:: label
   :name: sds-field-label
   :type: string

   What the control is called for anything that cannot see what it sits beside.
   A field with no visible label of its own owes one here.

.. confval:: value
   :name: sds-field-value
   :type: string

   What is in the field: its value when ``filled``, its placeholder when not.

.. confval:: type
   :name: sds-field-type
   :type: string
   :default: "text"

   The browser's business — ``email``, ``tel``, ``url`` decide which keyboard a
   phone offers and what the platform validates before anything of ours runs.

.. confval:: name
   :name: sds-field-name
   :type: string

.. confval:: field-id
   :name: sds-field-field-id
   :type: string

   The control's id, so the label points at it and an error summary can.

.. confval:: rows
   :name: sds-field-rows
   :type: number
   :default: 0

   Lines. Anything above one renders a ``<textarea>``, not a taller input: the
   difference is what the browser does with a newline.

.. confval:: select
   :name: sds-field-select
   :type: boolean
   :default: false

   A select rather than a text field: the same sunken box, closed by a chevron.

.. confval:: options
   :name: sds-field-options
   :type: "string[]"

   What a select offers. A text field ignores it.

.. confval:: hint
   :name: sds-field-hint
   :type: string

   What the answer has to be, under the control. Never inside it.

.. confval:: error
   :name: sds-field-error
   :type: string

   What is wrong with what is in it. **Sets the invalid state with it**, so the
   colour and the sentence cannot disagree: a field that says what is wrong
   without being marked wrong is two halves of one state, and halves drift.

.. confval:: required
   :name: sds-field-required
   :type: boolean
   :default: false

   Said in words beside the label, never as an asterisk that needs a legend
   somewhere else on the page.

.. confval:: min-width
   :name: sds-field-min-width
   :type: number
   :default: 220

   The width it asks for — and what it gets is that or the room there is. It
   was a ``min-width`` once, which wins over every other width rule in CSS: a
   field asking for 260px in a header with 240px left pushed the page sideways,
   and nothing in the row looked wrong.

.. confval:: icon
   :name: sds-field-icon
   :type: icon id

.. confval:: focused
   :name: sds-field-focused
   :type: boolean

.. confval:: invalid
   :name: sds-field-invalid
   :type: boolean

.. confval:: filled
   :name: sds-field-filled
   :type: boolean

   The three states exist for a **specimen**, which is a still picture and can
   hold neither focus nor invalidity. Set none of them and the states are the
   browser's; typing sets ``filled`` itself.

.. warning::

   **A placeholder is not a label.** It leaves exactly when it is needed — the
   moment someone starts typing — and it is invisible to anything reading the
   page as a document.

sds-field-error
===============

The message under an invalid field, with its own glyph, because colour alone is
not a message.

.. code-block:: html

   <sds-field-error message="An address needs an @ in it."></sds-field-error>

.. confval:: message
   :name: sds-field-error-message
   :type: string
   :required: true

An element of its own rather than a slot on the field: an error is often
written by whatever validated the value, which is not always what drew the box.
``sds-field`` renders one for you when it is given ``error``.

.. important::

   Never a tooltip. An error the pointer has to find is an error the keyboard
   never surfaces at all.

sds-checkbox
============

One thing that is either so or not — the platform's own control in this
system's colours, not a box with a glyph in it.

.. code-block:: html

   <sds-checkbox name="digest" value="weekly" label="Send me the weekly digest"
     hint="One message, on Fridays. Unsubscribe from any of them."></sds-checkbox>

A real ``<label>`` wraps both, so the words are part of the target: a 16px box
is hard to hit and the sentence beside it is not.

.. confval:: label
   :name: sds-checkbox-label
   :type: string
   :required: true

.. confval:: hint
   :name: sds-checkbox-hint
   :type: string

   What ticking it commits to, where the label cannot say it in a line.

.. confval:: checked
   :name: sds-checkbox-checked
   :type: boolean
   :default: false

.. confval:: indeterminate
   :name: sds-checkbox-indeterminate
   :type: boolean
   :default: false

   Neither on nor off: the box stands for a set only some of which is ticked.
   Ticking it resolves to on, the way the platform resolves it.

.. confval:: name
   :name: sds-checkbox-name
   :type: string

.. confval:: value
   :name: sds-checkbox-value
   :type: string

.. confval:: required
   :name: sds-checkbox-required
   :type: boolean

.. confval:: disabled
   :name: sds-checkbox-disabled
   :type: boolean

sds-radio
=========

One answer out of a few, all of them visible. The **set** is the component and
a single button is not: what makes one a choice is the set it belongs to, the
name they share and that exactly one holds.

.. code-block:: html

   <sds-radio legend="How should we reply?" name="reply" value="email"
     .choices="${[{ label: 'By email', value: 'email' },
                  { label: 'In the issue', value: 'issue',
                    hint: 'Public, and the thread stays with the code.' }]}"
   ></sds-radio>

.. confval:: legend
   :name: sds-radio-legend
   :type: string
   :required: true

   What is being asked. Rendered as the ``<legend>`` of a real ``<fieldset>``.

.. confval:: name
   :name: sds-radio-name
   :type: string
   :required: true

.. confval:: choices
   :name: sds-radio-choices
   :type: "{ label, value?, hint? }[]"
   :required: true

.. confval:: value
   :name: sds-radio-value
   :type: string

   The chosen value, or the label where a choice has none.

.. confval:: hint
   :name: sds-radio-hint
   :type: string

.. confval:: required
   :name: sds-radio-required
   :type: boolean

.. note::

   Where the answers are many, or the reader already knows the one they want,
   that is a select. Above roughly five the set stops being scannable.

sds-form-errors
===============

What stopped the form, at the top of it.

.. code-block:: html

   <sds-form-errors announce
     .errors="${[{ message: 'The message is empty', for: 'message' }]}"
   ></sds-form-errors>

Marking the boxes is enough for a reader who sees the whole form at once and
nothing at all for one who does not: a phone is sent back to a page that looks
unchanged, a screen reader is told nothing happened. So the summary is where
the reader lands — first, focusable, announced, and every line a link to the
field it names.

.. confval:: errors
   :name: sds-form-errors-errors
   :type: "{ message, for? }[]"
   :required: true

   ``for`` is the id of the field, so pressing an entry moves the focus to the
   control rather than to a heading above it.

.. confval:: heading
   :name: sds-form-errors-heading
   :type: string

   What the form calls itself, so the heading names the thing that failed
   rather than saying "there were errors".

.. confval:: announce
   :name: sds-form-errors-announce
   :type: boolean
   :default: false

   That this is the result of a submit the reader just made, so send them to
   it. Left off, the summary is drawn and takes nothing — which is what a page
   returned by a server with its errors already in it needs, because taking the
   focus there pulls a reader out of wherever they were.

It renders ``sds-note`` rather than drawing the error block again: what a
failure looks like is decided once.

Sent, and reset
===============

Two behaviours worth knowing before a form is assembled out of these.

**A button in a form is not a submit unless it says so.** ``sds-button``
defaults to ``type="button"`` for that reason — see :doc:`controls`. Give the
one button that sends the form ``type="submit"``, and Enter in a text field
then submits too, which is the behaviour only that button should carry.

**A reset puts back what the markup said.** ``sds-checkbox`` and ``sds-radio``
keep the state the page was drawn with and restore it when the form around them
is reset — not the last thing that was clicked, which is what mirroring the
live state into the attribute would have restored.

.. seealso::

   :doc:`/design-system/forms` is the same subject as a set of rules: why the
   label is above, why the summary is the part that is always skipped, and what
   a form owes a reader who cannot see all of it at once.
