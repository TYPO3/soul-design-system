:navigation-title: Forms

=====
Forms
=====

A form is the one surface where the reader acts instead of reads. Every rule
here is about one question: can somebody who does not see the whole form at
once answer it?

.. specimen:: components/core/form.card.html
   :viewport: 700x725
   :title: A field in a form

A placeholder is not a label
============================

``sds-field`` has two shapes, and ``caption`` is the difference. Without one
it is the bare control, right in a header, a toolbar or a filter row, where
the surface says what it is for. With one it renders the row a form owes a
control: **label above, hint under, error under both.**

The label is a real ``<label>`` for the control's own id. A press on the
words reaches the field, and an error summary can send a reader to it.

A placeholder cannot do that job. It leaves the moment somebody types, and it
is invisible to anything that reads the page as a document.

.. code-block:: html

   <sds-field
     caption="Your email"
     field-id="email"
     name="email"
     type="email"
     hint="Used for the reply and for nothing else."
     required
   ></sds-field>

**``required`` is a word on the page.** An asterisk needs a legend somewhere
on the page, and the legend is the first thing to go.

``type`` **is the browser's business.** ``email``, ``tel``, ``url``: it
decides which keyboard a phone offers and what the platform validates before
any script runs.

An error is a sentence
======================

``error`` sets the message *and* the invalid state. A field that says what is
wrong without the mark is two halves of one state, and halves drift. The
sentence sits under the control, never in a tooltip: the pointer has to find
a tooltip, and the keyboard never does.

The summary nobody writes
=========================

A mark on the box is enough for a reader who sees the whole form. For anyone
else, a failed submit looks like a page that did nothing.

``sds-form-errors`` is a summary at the top. The reader's send focuses it, a
screen reader announces it, and every line links to its field. It renders
``sds-note`` instead of a box of its own, so a failure looks one way.

.. code-block:: html

   <sds-form-errors
     .errors="${[{ message: 'The message is empty', for: 'message' }]}"
     announce
   ></sds-form-errors>

``announce`` means *this is the result of a submit the reader just made*.
Without it the summary draws and takes no focus. A server that returns the
page with its errors in it needs that. Focus on load moves a reader who was
on the way somewhere else.

Choices
=======

``sds-checkbox`` is one fact: a consent, an opt-in. ``sds-radio`` is one
answer out of a few, all visible. The *group* is the component, because a
radio alone cannot unset and means nothing. ``sds-checkbox-group`` is the
same shape for the other question: several answers, any number of them.

Above about five answers, that is ``sds-select``. The line is not a count.
It is if the reader scans the answers or already knows the one they want. A
select keeps the answers it cannot offer *on* the list, disabled. A reader
who cannot find a release learns nothing.

All of them are the platform's own controls. A hand-built box has to
re-implement the keyboard, the tap target on a phone, the indeterminate state
and how the whole thing reads out. The one that skips a part skips the part
nobody on the team tests with.

The one list this system draws
==============================

``sds-select`` is the exception to the rule above, and it has a reason.

A browser's own option list is not part of the page. It opens in a window the
page has no reach into, in the operating system's colours. So a dark page
opens a light list, and the headings of a grouped one come out in a grey
nobody chose. That is a control whose open state belongs to a different
design system.

So the element draws the list, and puts back by hand what the platform did.
``role="combobox"`` over ``role="listbox"``, the arrows, ``Home`` and
``End``, type-ahead, ``Enter`` and ``Escape``. And ``aria-activedescendant``,
so the focus stays on the button. The list is a popover. The top layer holds
it, and a press outside closes it the way the platform closes one.

**The real** ``<select>`` **stays underneath.** It is what the form submits,
and until the element upgrades it is the whole control. A page with no script
gets the browser's list, not nothing. That is the whole exception: the
picture is ours, the value and the fallback are the platform's.

This is the only place where the trade is worth it. A drawn control loses
things a screenshot does not show.

A switch is not a checkbox
==========================

.. specimen:: components/core/form-controls.card.html
   :viewport: 700x437
   :title: Beyond the text field

``sds-checkbox`` answers a question the form asks, and the submit sends it.
``sds-switch`` turns something on **now**. A reader who has to press Save
after a flip got the wrong message from the control. A page of switches that
wait for a submit is a settings page that lies.

``sds-range`` is for a value where the *position* is the answer and the exact
number is not: a zoom, a threshold. It always carries its number in an
``<output>``. A slider with nothing beside it is a value nobody can read
back. Where the reader knows the number, that is a field with
``type="number"``, which takes typed and pasted input.

``sds-file`` keeps the browser's own picker and paints its button. The picker
opens only for a press on a real file input. A drawn box with a hidden input
behind it is a control the keyboard cannot reach.

The form knows the controls
===========================

Every control is form-associated through ``ElementInternals``. That makes it
a member of the form, not a box with a control in it. A reset reaches the
element, a ``<fieldset disabled>`` disables everything under it, and
``error`` becomes a validity the browser refuses to submit past.

The value is still the real ``<input>``'s. Every control renders a named
input into the light DOM, so a prerendered page submits what it shows before
a line of script runs. That is the case this system serves, and the one a
value in JavaScript loses.

.. warning::

   The tick is ``--text-primary``, not ``--accent``. The accent marks three
   things in this system. A form of nine ticked boxes spends the loudest
   colour on what somebody typed.

The button that submits says so
===============================

``sds-button`` renders ``type="button"`` unless told otherwise, and that
default carries weight. A ``<button>`` with no type inside a ``<form>`` is a
submit button. So a filter, a toggle or a Cancel submits the form it stands
in. The browser then blocks on the first invalid field and moves the focus
there.

A real submit says ``type="submit"``. Then Enter in a text field submits too,
which is right, and only one button carries it.

Hand-written markup carries the same rule:
``<button class="sds-btn" type="button">``.

The measure
===========

``sds-form`` is one column at ``--measure-lead``. Fields side by side scan
faster and complete slower, and this is the one surface where completion is
the point.

Three states exist, and most forms ship one. Pages → Contact has all three:
the form, what it does when it fails, and what it says when it worked. The
last one says what went, what happens to it, and how long that takes. A page
that says "thank you" and stops took something and gave nothing back.

.. seealso::

   :doc:`/frontend/components/forms` is the same set of controls as a
   reference: every attribute, what a reset puts back, and the markup a
   server writes where no script runs.
