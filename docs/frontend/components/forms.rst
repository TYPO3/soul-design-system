:navigation-title: Forms

=====
Forms
=====

The one surface where the reader acts instead of reads. Every element here
wraps a **real** control: an ``<input>``, a ``<select>``, a ``<textarea>``, a
``<fieldset>``. So the keyboard, the tap target, the platform's validation
and the read-out arrive with it. A drawn control looks right in a screenshot
and takes no input.

.. specimen:: components/core/input.card.html
   :viewport: 700x422
   :title: Fields & search

.. _component-sds-field:

sds-field
=========

One line of whatever a reader types. It has two shapes, and ``caption`` is
the difference. An answer of more than one line is :ref:`sds-textarea
<component-sds-textarea>`, and a list of answers is :ref:`sds-select
<component-sds-select>`. Both share this box and little else.

.. tabs::

   .. tab:: In a form

      .. code-block:: html

         <sds-field caption="Your email" field-id="email" name="email"
           type="email" hint="Used for the reply and for nothing else."
           required></sds-field>

      With a caption it renders the row a form owes a control: **label
      above, hint under, error under both.** The label is a real ``<label>``
      for the control's own id. A press on the words reaches the field, and
      an error summary can send a reader to it.

   .. tab:: On a surface

      .. code-block:: html

         <sds-field icon="actions-search" value="Filter tools"
           label="Filter tools" min-width="260"></sds-field>

      Without one it is the bare control, right in a header, a toolbar or a
      filter row, where the surface says what it is for. It still owes a
      ``label``, because nothing visible names it.

.. confval:: caption
   :name: sds-field-caption
   :type: string

   The visible label, which turns this into a field in a *form*.

.. confval:: label
   :name: sds-field-label
   :type: string

   The control's name for anything that cannot see what it sits beside. A
   field with no visible label owes one here.

.. confval:: value
   :name: sds-field-value
   :type: string

   What is in the field: its value when ``filled``, its placeholder when
   not.

.. confval:: type
   :name: sds-field-type
   :type: string
   :default: "text"

   The browser's business. ``email``, ``tel``, ``url`` decide which keyboard
   a phone offers and what the platform validates before any script runs.

.. confval:: size
   :name: sds-field-size
   :type: "md" | "sm" | "lg"
   :default: "md"

   The control heights a button has, so a field and the button beside it
   stand on one line. ``sm`` is for a field inside another surface, a
   toolbar, a table head, a filter row, and never to make a form fit.
   ``lg`` is the field a screen is *for*, beside the large button that
   answers it. In a form the label follows the control, so the words never
   outweigh the box.

.. confval:: name
   :name: sds-field-name
   :type: string

.. confval:: field-id
   :name: sds-field-field-id
   :type: string

   The control's id, so the label and an error summary can point at it.

.. confval:: disabled
   :name: sds-field-disabled
   :type: boolean
   :default: false

   Present, and not on offer. The real attribute, so nothing can type in it
   and the form sends nothing for it. A ``<fieldset disabled>`` around it
   does the same, through ``formDisabledCallback``, with no markup on each
   control.

.. confval:: readonly
   :name: sds-field-readonly
   :type: boolean
   :default: false

   Shown and sent, and not editable: what a form already knows and the
   reader must not change. The box gives up the sunken fill that says *type
   here* and keeps everything else. It stays focusable and copyable, which
   is the whole difference from ``disabled``.

.. confval:: prefix
   :name: sds-field-prefix
   :type: string

.. confval:: suffix
   :name: sds-field-suffix
   :type: string

   What stands inside the box beside the value and is not part of it. A
   currency, a scheme, a unit, the fixed head of an address. Nobody types
   into one, and the form sends nothing for it.

.. confval:: autocomplete
   :name: sds-field-autocomplete
   :type: string

   What the browser can fill in: ``email``, ``street-address``, ``off``. A
   form that names them fills in once instead of every time.

.. confval:: inputmode
   :name: sds-field-inputmode
   :type: string

   Which keyboard a phone offers where ``type`` does not decide it:
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

   The bounds and the step the platform validates against, for a number, a
   date or a time. Strings, because a date's bound is one.

.. confval:: maxlength
   :name: sds-field-maxlength
   :type: number

.. confval:: pattern
   :name: sds-field-pattern
   :type: string

   How much a reader can type, and the shape it has to have. The browser's
   own validation, before any script runs.

.. confval:: hint
   :name: sds-field-hint
   :type: string

   What the answer has to be, under the control. Never inside it.

.. confval:: error
   :name: sds-field-error
   :type: string

   What is wrong with what is in it. **It sets the invalid state too**, so
   the colour and the sentence cannot disagree. A field that says what is
   wrong without the mark is two halves of one state, and halves drift.

.. confval:: required
   :name: sds-field-required
   :type: boolean
   :default: false

   A word beside the label, never an asterisk that needs a legend somewhere
   else on the page.

.. confval:: min-width
   :name: sds-field-min-width
   :type: number
   :default: 220

   The width it asks for. It gets that, or the room there is. A CSS
   ``min-width`` wins over every other width rule: a field that asks for
   260px in a header with 240px left pushes the page sideways.

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

   The three states exist for a **specimen**, a still picture that can hold
   neither focus nor invalidity. Set none of them, and the states are the
   browser's. Input sets ``filled`` itself.

.. warning::

   **A placeholder is not a label.** It leaves the moment somebody types,
   and it is invisible to anything that reads the page as a document.

.. _component-sds-textarea:

sds-textarea
============

An answer of more than one line: a real ``<textarea>`` in the field's own
box. Its own element, not a taller field. It shares the box with a text
field, and nothing a caller writes.

.. code-block:: html

   <sds-textarea caption="What did the tool answer?" field-id="message"
     name="message" rows="6" required
     hint="The tool name and the question are enough to reproduce it."
   ></sds-textarea>

.. confval:: rows
   :name: sds-textarea-rows
   :type: number
   :default: 4

   Lines. What the box is *worth* to ask for, not a limit on the answer.

.. confval:: value
   :name: sds-textarea-value
   :type: string

   What is in it: its value when ``filled``, its placeholder when not. The
   value in the markup is the element's **default**, which is what a reset
   puts back. Never the last thing typed.

.. confval:: resize
   :name: sds-textarea-resize
   :type: "vertical" | "none" | "both"
   :default: "vertical"

   Which way the corner drags. A box that widens breaks its column, which
   is why ``vertical`` is the default.

.. confval:: caption
   :name: sds-textarea-caption
   :type: string

.. confval:: label
   :name: sds-textarea-label
   :type: string

.. confval:: name
   :name: sds-textarea-name
   :type: string

.. confval:: field-id
   :name: sds-textarea-field-id
   :type: string

.. confval:: hint
   :name: sds-textarea-hint
   :type: string

.. confval:: error
   :name: sds-textarea-error
   :type: string

.. confval:: required
   :name: sds-textarea-required
   :type: boolean

.. confval:: disabled
   :name: sds-textarea-disabled
   :type: boolean

.. confval:: readonly
   :name: sds-textarea-readonly
   :type: boolean

.. confval:: maxlength
   :name: sds-textarea-maxlength
   :type: number

.. confval:: autocomplete
   :name: sds-textarea-autocomplete
   :type: string

.. confval:: size
   :name: sds-textarea-size
   :type: "md" | "sm" | "lg"
   :default: "md"

.. confval:: min-width
   :name: sds-textarea-min-width
   :type: number
   :default: 420

.. confval:: filled
   :name: sds-textarea-filled
   :type: boolean

.. confval:: invalid
   :name: sds-textarea-invalid
   :type: boolean

.. confval:: focused
   :name: sds-textarea-focused
   :type: boolean

.. _component-sds-select:

sds-select
==========

One answer out of a list the reader does not need to see. Its own element,
not a shape a field takes. A select and a text field share a box and
nothing else. A select has a list, with headings, and entries on it but not
on offer. It has nothing to type, no length, no pattern, no keyboard to
choose.

**The element draws the list, and it is the one place this system rebuilds
a native control.** A browser's own list opens in a window the page has no
reach into, in the operating system's colours. So a dark page opens a light
list, and the headings of a grouped one come out in a grey nobody chose.

The cost is everything the platform did, and the element puts all of it
back by hand. ``role="combobox"`` over ``role="listbox"``, the arrows,
``Home`` and ``End``, type-ahead, ``Enter`` and ``Escape``. And
``aria-activedescendant``, so the focus stays on the button. The list is a
popover, so the top layer holds it. No ancestor's overflow clips it, and a
press outside is the platform's own dismissal.

.. list-table:: What the keyboard does
   :header-rows: 1
   :widths: 34 66

   * - Key
     - Closed · open
   * - ``↓`` ``↑`` ``Home`` ``End``
     - opens the list, at the answer in force · walks it, stops at the ends
   * - ``Enter`` ``Space``
     - opens the list · takes the answer the keys are on and closes
   * - a letter
     - goes to the next answer that starts with it, without an open · the
       same, inside the list. What arrives within a second is one word
   * - ``Escape``
     - — · closes and leaves the answer where it was
   * - ``Tab``
     - leaves · takes the answer under the keys, then leaves

**The real** ``<select>`` **stays underneath and carries the value.** It is
what the form submits, and the whole control on a page with no script. The
drawn list hides until the element upgrades. After that, the native control
leaves the reading and the tab order. Its ``required`` moves to the
element's own validity, reported on the visible button.

.. specimen:: components/core/select.card.html
   :viewport: 700x651
   :title: A select

.. code-block:: html

   <sds-select caption="Which release is this about?" field-id="release"
     name="release" value="13.4" filled
     .options="${[{ label: '14.3', group: 'Supported' },
                  { label: '13.4', group: 'Supported' },
                  { label: '11.5', group: 'Out of support', disabled: true }]}"
   ></sds-select>

.. confval:: options
   :name: sds-select-options
   :type: "(string | { label, value?, disabled?, group? })[]"

   The list. A bare string is the label and the value at once, which is
   what most lists are. ``group`` puts consecutive entries with the same one
   under a single ``<optgroup>``, so the order of the list is the grouping.
   ``disabled`` leaves an answer on the list and not on offer. That is worth
   it: a reader who cannot find it at all learns nothing.

.. confval:: value
   :name: sds-select-value
   :type: string

   The chosen value. Or, while ``filled`` is off, what the closed box says
   instead. That entry renders on the list, disabled, so the reader sees it
   and never picks it. A ``required`` select blocks in the browser until
   they choose another. A closed box has no place for a placeholder, so the
   prompt is an option.

.. confval:: caption
   :name: sds-select-caption
   :type: string

   The visible label, which turns this into a control in a *form*: label
   above, hint under, error under both. Without one it is the bare box.

.. confval:: label
   :name: sds-select-label
   :type: string

.. confval:: name
   :name: sds-select-name
   :type: string

.. confval:: field-id
   :name: sds-select-field-id
   :type: string

.. confval:: hint
   :name: sds-select-hint
   :type: string

.. confval:: error
   :name: sds-select-error
   :type: string

   What is wrong with the choice. It sets the invalid state too, **and the
   browser refuses to submit past it**. The message goes through
   ``ElementInternals``, so the platform blocks the send and reports on the
   box, not a colour somebody has to notice.

.. confval:: required
   :name: sds-select-required
   :type: boolean

.. confval:: disabled
   :name: sds-select-disabled
   :type: boolean

.. confval:: size
   :name: sds-select-size
   :type: "md" | "sm" | "lg"
   :default: "md"

.. confval:: min-width
   :name: sds-select-min-width
   :type: number
   :default: 220

.. confval:: filled
   :name: sds-select-filled
   :type: boolean

.. confval:: focused
   :name: sds-select-focused
   :type: boolean

.. confval:: invalid
   :name: sds-select-invalid
   :type: boolean

.. note::

   The chevron is **not** the opener. The ``<select>`` under it stretches
   over the whole box, and the glyph takes no press. So the part that looks
   most like the opener is one.

.. seealso::

   Where the answers are few and each has a consequence, that is
   :ref:`sds-radio <component-sds-radio>`. Where several can hold at once,
   it is :ref:`sds-checkbox-group <component-sds-checkbox-group>`. Never a
   ``multiple`` select, which hides its own rules behind a modifier key.

.. _component-sds-field-group:

sds-field-group
===============

A control and what stands with it, as one thing. A field, a row of actions
and a hint each owe no step of their own. A container or a set spaces them,
so loose on a page they touch. The group is the set that pays: the normal
step between its parts, and the flow step around itself.

.. code-block:: html

   <sds-field-group>
     <sds-field icon="actions-search" value="Search 392 glyphs"
       label="Search the glyph set" min-width="420"></sds-field>
     <div class="sds-actions">
       <sds-button variant="primary">Browse all 392</sds-button>
     </div>
   </sds-field-group>

Use it where a control is what a page is *for*: a search hero, a finder
above the wall it filters. Inside a form nothing changes. A field with a
``caption`` already renders the row a form owes it, and ``sds-form`` holds
the column.

.. _component-sds-field-error:

sds-field-error
===============

The message under an invalid field, with its own glyph, because colour alone
is not a message.

.. code-block:: html

   <sds-field-error message="An address needs an @ in it."></sds-field-error>

.. confval:: message
   :name: sds-field-error-message
   :type: string
   :required: true

An element of its own, not a slot on the field. Whatever validated the value
often writes the error, and that is not always what drew the box.
``sds-field`` renders one for you with ``error``.

It has the size of the control, not of a hint, and it follows a compact
control down the way that control's label does. The sentence stands between
a reader and the send, and the form's summary says the same one in the
reading register.

.. important::

   Never a tooltip. An error the pointer has to find is an error the
   keyboard never gets.

.. _component-sds-checkbox:

sds-checkbox
============

One thing that is either so or not. The platform's own control in this
system's colours, not a box with a glyph in it.

.. code-block:: html

   <sds-checkbox name="digest" value="weekly" label="Send me the weekly digest"
     hint="One message, on Fridays. Unsubscribe from any of them."></sds-checkbox>

A real ``<label>`` wraps both, so the words are part of the target. A 16px
box is hard to hit, and the sentence beside it is not.

.. confval:: label
   :name: sds-checkbox-label
   :type: string
   :required: true

.. confval:: hint
   :name: sds-checkbox-hint
   :type: string

   What a tick commits to, where the label cannot say it in a line.

.. confval:: checked
   :name: sds-checkbox-checked
   :type: boolean
   :default: false

.. confval:: indeterminate
   :name: sds-checkbox-indeterminate
   :type: boolean
   :default: false

   Neither on nor off. The box stands for a set with only some of it
   ticked. A tick resolves it to on, the way the platform does.

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

Tick any of these, under one question. ``sds-checkbox`` is one fact on its
own; this is the other shape a set of boxes takes. As loose checkboxes it is
a heading above some rows. Nothing binds them, so nothing reads them out as
one question either.

The set is the component, as for :ref:`sds-radio <component-sds-radio>`.
The legend, the shared name and the ticked entries are three things a
caller otherwise keeps in step by hand.

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

   The question. Rendered as the ``<legend>`` of a real ``<fieldset>``.

.. confval:: legend-said-only
   :name: sds-checkbox-group-legend-said-only
   :type: boolean
   :default: false

   The question goes to the ear and not the eye. For a set whose question
   the page already carries: a dialog's title, a heading over the set. The legend
   stays. It names the group, and a set with an empty one is a group with
   no name. See :ref:`said-only <said-only>`.

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

   Which of them hold a tick, by value, or by label where a choice has none.

.. confval:: hint
   :name: sds-checkbox-group-hint
   :type: string

.. _component-sds-switch:

sds-switch
==========

A setting that takes effect where it stands.

.. specimen:: components/core/form-controls.card.html
   :viewport: 700x437
   :title: Beyond the text field

A checkbox answers a question the form asks, and the submit sends it. A
switch turns something on **now**. That is the whole difference, and why
the two look nothing alike. A reader who has to press Save after a flip got
the wrong message from the control.

.. code-block:: html

   <sds-switch name="theme" label="Follow the system theme" checked></sds-switch>

.. confval:: label
   :name: sds-switch-label
   :type: string
   :required: true

.. confval:: hint
   :name: sds-switch-hint
   :type: string

   What the on state does, where the label cannot say it in a line.

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

   On is ``--text-primary``, the fill of a ticked box, never the accent.
   The accent marks three things in this system, and a page of settings is
   not one of them.

.. _component-sds-range:

sds-range
=========

A value along a run of them. For a quantity where the *position* is the
answer and the exact number is not: a zoom, a weight, a threshold. Where
the reader knows the number, that is a field with ``type="number"``, which
takes typed and pasted input.

.. code-block:: html

   <sds-range caption="Preview width" field-id="w" name="w"
     min="320" max="1440" step="10" value="960" unit="px"></sds-range>

.. confval:: caption
   :name: sds-range-caption
   :type: string

   The visible label. Without one the slider is bare and still owes
   ``label``.

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

   The read-out is an ``<output>`` for the control, and it is not
   decoration. A slider with no number beside it is a value nobody can read
   back, report or check against a hint.

.. _component-sds-file:

sds-file
========

The one native control that looks like nothing else on a page. A file input
is a button and a sentence the browser draws itself, and the picker opens
only for a press on a **real** one. So the real one stays, and
``::file-selector-button`` paints its button. The sentence beside it is the
browser's, in its own language, and names the chosen file.

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

   Which kinds the picker offers first: ``image/*``, ``.pdf,.md``. A filter,
   not a guarantee. What arrives still gets a check where it lands.

.. confval:: multiple
   :name: sds-file-multiple
   :type: boolean

.. confval:: hint
   :name: sds-file-hint
   :type: string

   What to attach. Say the kinds and the size limit here, not after the
   upload failed.

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

   What is **not** here, on purpose, is a drawn box with a hidden input
   behind it. It photographs well, drops nothing, and loses the keyboard.

.. _component-sds-radio:

sds-radio
=========

One answer out of a few, all visible. The **set** is the component, and a
single button is not. What makes one a choice is the set it belongs to, the
shared name, and that exactly one holds.

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

   The question. Rendered as the ``<legend>`` of a real ``<fieldset>``.

.. confval:: legend-said-only
   :name: sds-radio-legend-said-only
   :type: boolean
   :default: false

   The question goes to the ear and not the eye. For a set whose question
   the page already carries: a dialog's title, a heading over the set. The legend
   stays. It names the group, and a set with an empty one is a group with
   no name. See :ref:`said-only <said-only>`.

   ``required`` stands *inside* the legend, so it goes with it. A page that
   draws the question itself draws whatever marks it as well. Otherwise the
   reader hears about the set only after the form refuses to go.

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

   Where the answers are many, or the reader knows the one they want, that
   is a select. Above about five, a reader cannot scan the set.

.. _component-sds-form-errors:

sds-form-errors
===============

What stopped the form, at the top of it.

.. code-block:: html

   <sds-form-errors announce
     .errors="${[{ message: 'The message is empty', for: 'message' }]}"
   ></sds-form-errors>

A mark on the boxes is enough for a reader who sees the whole form at once,
and nothing for one who does not. A phone comes back to a page that looks
the same, and a screen reader hears nothing. So the summary is where the
reader lands: first, focusable, announced, and every line a link to its
field.

.. confval:: errors
   :name: sds-form-errors-errors
   :type: "{ message, for? }[]"
   :required: true

   ``for`` is the id of the field, so a press on an entry moves the focus
   to the control, not to a heading above it.

.. confval:: heading
   :name: sds-form-errors-heading
   :type: string

   What the form calls itself, so the heading names the thing that failed
   and does not say "there were errors".

.. confval:: announce
   :name: sds-form-errors-announce
   :type: boolean
   :default: false

   This is the result of a submit the reader just made, so send them to it.
   Off, the summary draws and takes nothing. A page a server returns with
   its errors in it needs that, because focus there pulls a reader out of
   wherever they were.

It renders ``sds-note`` instead of a second error block. What a failure
looks like has one decision.

Sent, and reset
===============

Two behaviours to know before you assemble a form out of these.

**A button in a form is not a submit unless it says so.** ``sds-button``
defaults to ``type="button"`` for that reason; see :doc:`controls`. Give
the one button that sends the form ``type="submit"``. Enter in a text field
then submits too, and only that button carries it.

**A reset puts back what the markup said.** Every control here keeps the
state of the page's first draw and restores it on a reset of the form. Not
the last click, which a mirror of the live state into the attribute
restores.

**The form knows the elements themselves.** Each one is form-associated
through ``ElementInternals``, which makes it a member of the form, not a
box with a control in it. Four things follow that a hand-rolled control
never gets right:

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Comes from internals
     - What it means on the page
   * - ``formResetCallback``
     - a reset reaches the element and not only the input inside it
   * - ``formDisabledCallback``
     - a ``<fieldset disabled>`` disables what is under it, with nothing on
       each control
   * - ``setValidity``
     - ``error`` is a validity the browser refuses to submit past, on the
       right box, not a colour to notice
   * - ``form``, ``labels``, ``checkValidity()``
     - answer on the element the way they answer on an ``<input>``

What internals do **not** carry, on purpose, is the value. Every control
here renders a real named ``<input>``, ``<select>`` or ``<textarea>`` into
the light DOM, and the browser submits that. That holds on a prerendered
page with no script. A ``setFormValue`` as well sends every answer twice.

.. seealso::

   :doc:`/design-system/forms` is the same subject as a set of rules. Why
   the label is above, and why the summary is the part most forms skip.
   What a form owes a reader who cannot see all of it at once.
