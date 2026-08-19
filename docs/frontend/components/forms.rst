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
   :viewport: 700x357
   :title: Fields & search

.. _component-sds-field:

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

   The browser's business — ``email``, ``tel``, ``url``, ``number``, ``date``
   decide which keyboard a phone offers and what the platform validates before
   anything of ours runs.

.. confval:: size
   :name: sds-field-size
   :type: "md" | "sm" | "lg"
   :default: "md"

   The control heights a button has, so a field and the button beside it stand
   on one line. ``sm`` is for a field inside another surface — a toolbar, a
   table head, a filter row — and never for making a form fit; ``lg`` is the
   field a screen is *for*, beside the large button that answers it. In a form
   the label follows the control, so the words never outweigh the box.

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

.. confval:: disabled
   :name: sds-field-disabled
   :type: boolean
   :default: false

   Present, and not on offer. The real attribute, so nothing can type in it and
   the form sends nothing for it. A ``<fieldset disabled>`` around it does the
   same, and reaches it through ``formDisabledCallback`` rather than through
   markup anybody had to write.

.. confval:: readonly
   :name: sds-field-readonly
   :type: boolean
   :default: false

   Shown and sent, and not editable — what a form already knows and the reader
   may not change. The box gives up the sunken fill that says *type here* and
   keeps everything else: it stays focusable and copyable, which is the whole
   difference from ``disabled``.

.. confval:: prefix
   :name: sds-field-prefix
   :type: string

.. confval:: suffix
   :name: sds-field-suffix
   :type: string

   What stands inside the box beside the value and is not part of it: a
   currency, a scheme, a unit, the fixed head of an address. Nothing is typed
   into one and nothing is sent for it.

.. confval:: autocomplete
   :name: sds-field-autocomplete
   :type: string

   What the browser may fill in — ``email``, ``street-address``, ``off``. A form
   that names them is a form filled in once instead of every time.

.. confval:: inputmode
   :name: sds-field-inputmode
   :type: string

   Which keyboard a phone offers where ``type`` does not decide it —
   ``numeric``, ``decimal``, ``search``.

.. confval:: min
   :name: sds-field-min
   :type: string

.. confval:: max
   :name: sds-field-max
   :type: string

.. confval:: step
   :name: sds-field-step
   :type: string

   The bounds and the step the platform validates against, for a number, a date
   or a time. Strings, because a date's bound is one.

.. confval:: maxlength
   :name: sds-field-maxlength
   :type: number

.. confval:: pattern
   :name: sds-field-pattern
   :type: string

   How much may be typed, and the shape it has to have — the browser's own
   validation, before anything of ours runs.

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

.. _component-sds-field-group:

sds-field-group
===============

A control and what stands with it, as one thing. A field, a row of actions and
a hint each owe no step of their own — a container or a set spaces them — so
standing loose on a page they touch. The group is the set that pays: the
normal step between its parts, and the flow step around itself.

.. code-block:: html

   <sds-field-group>
     <sds-field icon="actions-search" value="Search 392 glyphs"
       label="Search the glyph set" min-width="420"></sds-field>
     <div class="sds-actions">
       <sds-button variant="primary">Browse all 392</sds-button>
     </div>
   </sds-field-group>

Reach for it where a control is what a page is *for* — a search hero, a finder
above the wall it filters. Inside a form nothing changes: a field with a
``caption`` already renders the row a form owes it, and ``sds-form`` holds the
column.

.. _component-sds-field-error:

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

.. _component-sds-checkbox:

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

.. _component-sds-checkbox-group:

sds-checkbox-group
==================

Tick any of these, under one question. ``sds-checkbox`` is one fact standing on
its own; this is the other shape a set of boxes takes. Written as loose
checkboxes it is a heading that happens to sit above some rows — nothing binds
them, so nothing reads them out as one question either.

The set is the component, as it is for :ref:`sds-radio <component-sds-radio>`:
the legend, the shared name and what is ticked are three things a caller would
otherwise keep in step by hand.

.. code-block:: html

   <sds-checkbox-group legend="What may we attach?" name="scope"
     .values="${['versions']}"
     .choices="${[{ label: 'Installed versions', value: 'versions' },
                  { label: 'File contents', value: 'files',
                    hint: 'Not on offer while the project is public.',
                    disabled: true }]}"
   ></sds-checkbox-group>

.. confval:: legend
   :name: sds-checkbox-group-legend
   :type: string
   :required: true

   What is being asked. Rendered as the ``<legend>`` of a real ``<fieldset>``.

.. confval:: name
   :name: sds-checkbox-group-name
   :type: string
   :required: true

   One name for the whole set, so a server reads the answers as a list.

.. confval:: choices
   :name: sds-checkbox-group-choices
   :type: "{ label, value?, hint?, disabled? }[]"
   :required: true

.. confval:: values
   :name: sds-checkbox-group-values
   :type: "string[]"

   Which of them are ticked, by value or by label where a choice has none.

.. confval:: hint
   :name: sds-checkbox-group-hint
   :type: string

.. _component-sds-switch:

sds-switch
==========

A setting that takes effect where it stands.

.. specimen:: components/core/form-controls.card.html
   :viewport: 700x382
   :title: Beyond the text field

A checkbox answers a question the form asks and is sent when the form is sent;
a switch turns something on **now**. That is the whole difference, and it is
why the two look nothing alike: a reader who has to press Save after flipping
one has been told the wrong thing by the control.

.. code-block:: html

   <sds-switch name="theme" label="Follow the system theme" checked></sds-switch>

.. confval:: label
   :name: sds-switch-label
   :type: string
   :required: true

.. confval:: hint
   :name: sds-switch-hint
   :type: string

   What turning it on does, where the label cannot say it in a line.

.. confval:: checked
   :name: sds-switch-checked
   :type: boolean
   :default: false

.. confval:: name
   :name: sds-switch-name
   :type: string

.. confval:: value
   :name: sds-switch-value
   :type: string

.. confval:: disabled
   :name: sds-switch-disabled
   :type: boolean

.. note::

   On is ``--text-primary``, the colour a ticked box is filled with — never the
   accent. The accent marks three things in this system and a page of settings
   is not one of them.

.. _component-sds-range:

sds-range
=========

A value picked along a run of them — for a quantity where the *position* is the
answer and the exact number is not: a zoom, a weight, a threshold somebody is
feeling their way to. Where the number is what the reader already knows, that
is a field with ``type="number"``, which can be typed into and pasted.

.. code-block:: html

   <sds-range caption="Preview width" field-id="w" name="w"
     min="320" max="1440" step="10" value="960" unit="px"></sds-range>

.. confval:: caption
   :name: sds-range-caption
   :type: string

   The visible label. Without one the slider is bare and still owes ``label``.

.. confval:: label
   :name: sds-range-label
   :type: string

.. confval:: name
   :name: sds-range-name
   :type: string

.. confval:: min
   :name: sds-range-min
   :type: string
   :default: "0"

.. confval:: max
   :name: sds-range-max
   :type: string
   :default: "100"

.. confval:: step
   :name: sds-range-step
   :type: string
   :default: "1"

.. confval:: value
   :name: sds-range-value
   :type: string
   :default: "50"

.. confval:: unit
   :name: sds-range-unit
   :type: string

   What the number means, beside the read-out: ``px``, ``%``, ``ms``.

.. confval:: hint
   :name: sds-range-hint
   :type: string

.. confval:: disabled
   :name: sds-range-disabled
   :type: boolean

.. confval:: field-id
   :name: sds-range-field-id
   :type: string

.. important::

   The read-out is an ``<output>`` pointing at the control, and it is not
   decoration: a slider with no number beside it is a value nobody can read
   back, report or check against a hint.

.. _component-sds-file:

sds-file
========

The one native control that looks like nothing else on a page. A file input is
a button and a sentence the browser draws itself, and the picker only opens for
a press on a **real** one — so the real one stays and its button is painted
through ``::file-selector-button``. The sentence beside it is the browser's, in
its own language, saying what is chosen.

.. code-block:: html

   <sds-file caption="Attach a screenshot" field-id="shot" name="shot"
     accept="image/*" hint="PNG or JPEG, up to 5 MB."></sds-file>

.. confval:: caption
   :name: sds-file-caption
   :type: string

.. confval:: label
   :name: sds-file-label
   :type: string

.. confval:: name
   :name: sds-file-name
   :type: string

.. confval:: accept
   :name: sds-file-accept
   :type: string

   Which kinds the picker offers first — ``image/*``, ``.pdf,.md``. A filter and
   not a guarantee: what arrives is still checked where it lands.

.. confval:: multiple
   :name: sds-file-multiple
   :type: boolean

.. confval:: hint
   :name: sds-file-hint
   :type: string

   What to attach. Say the kinds and the size limit here, not after the upload
   failed.

.. confval:: error
   :name: sds-file-error
   :type: string

.. confval:: required
   :name: sds-file-required
   :type: boolean

.. confval:: disabled
   :name: sds-file-disabled
   :type: boolean

.. confval:: field-id
   :name: sds-file-field-id
   :type: string

.. warning::

   What is deliberately **not** here is a drawn box with a hidden input behind
   it. It photographs well, drops nothing, and loses the keyboard.

.. _component-sds-radio:

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

.. _component-sds-form-errors:

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

**A reset puts back what the markup said.** Every control here keeps the state
the page was drawn with and restores it when the form around it is reset — not
the last thing that was clicked, which is what mirroring the live state into
the attribute would have restored.

**The form knows about the elements themselves.** Each one is form-associated
through ``ElementInternals``, which is what makes it a member of the form
rather than a box that happens to contain one. From that come four things a
hand-rolled control never gets right:

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Comes from internals
     - What it means on the page
   * - ``formResetCallback``
     - a reset reaches the element and not only the input inside it
   * - ``formDisabledCallback``
     - a ``<fieldset disabled>`` actually disables what is under it, with
       nothing written on each control
   * - ``setValidity``
     - ``error`` is a validity the browser refuses to submit past and reports
       on the right box, rather than a colour somebody has to notice
   * - ``form``, ``labels``, ``checkValidity()``
     - answer on the element the way they answer on an ``<input>``

What internals deliberately do **not** carry is the value. Every control here
renders a real named ``<input>``, ``<select>`` or ``<textarea>`` into the light
DOM, and that is what the browser submits — including on a page rendered ahead
of time that runs no script at all. Calling ``setFormValue`` as well would send
every answer twice.

.. seealso::

   :doc:`/design-system/forms` is the same subject as a set of rules: why the
   label is above, why the summary is the part that is always skipped, and what
   a form owes a reader who cannot see all of it at once.
