:navigation-title: Forms

=====
Forms
=====

A form is the one surface where the reader has to do something rather than read
something, and it is the surface this system had least for: a text field, a
select and an error message, with everything around them left to whoever was
building the page.

What follows is not styling. Every rule here is about whether the form can be
answered by somebody who cannot see all of it at once.

.. specimen:: components/core/form.card.html
   :viewport: 700x498
   :title: A field in a form

A placeholder is not a label
============================

``sds-field`` has two shapes and the difference is ``caption``. Without one it
is the bare control — right in a header, a toolbar, a filter row, where the
surface around it says what it is for. With one it renders the row a form owes
a control: **label above, hint under, error under both.**

The label is a real ``<label>`` pointing at the control's own id, so pressing
the words reaches the field and an error summary can send a reader straight to
it.

A placeholder cannot do that job. It leaves exactly when it is needed — the
moment someone starts typing — and it is invisible to anything reading the page
as a document.

.. code-block:: html

   <sds-field
     caption="Your email"
     field-id="email"
     name="email"
     type="email"
     hint="Used for the reply and for nothing else."
     required
   ></sds-field>

**Required is said in words.** An asterisk is a convention that needs a legend
somewhere else on the page, and the legend is the thing that gets cut.

``type`` **is the browser's business.** ``email``, ``tel``, ``url`` — it
decides which keyboard a phone offers and what the platform validates before
anything of ours runs.

An error is a sentence
======================

``error`` sets the message *and* the invalid state, because a field that says
what is wrong without being marked wrong is two halves of one state, and halves
drift. The sentence sits under the control — never as a tooltip, which is an
error the pointer has to find and the keyboard never surfaces at all.

The summary nobody writes
=========================

Marking the boxes is enough for a reader who can see the whole form. For anyone
who cannot, a failed submit looks like a page that did nothing.

``sds-form-errors`` is a summary at the top: focused when the reader pressed
send, announced, and every line a link to the field it names. It renders
``sds-note`` rather than drawing its own box — what a failure looks like is
decided once.

.. code-block:: html

   <sds-form-errors
     .errors="${[{ message: 'The message is empty', for: 'message' }]}"
     announce
   ></sds-form-errors>

``announce`` is the caller's word for *this is the result of a submit the
reader just made*. Without it the summary is drawn and takes nothing, which is
what a page returned by a server with its errors already in it needs — taking
the focus on load moves a reader who was going somewhere else.

Choices
=======

``sds-checkbox`` is one fact: a consent, an opt-in. ``sds-radio`` is
one answer out of a few, all of them visible — and the *group* is the
component, because a radio on its own cannot be unset and means nothing.
``sds-checkbox-group`` is the same shape for the other question: several
answers, any number of which may hold.

Above roughly five answers, that is a select. The line is not a count, it is
whether the reader is scanning the answers or already knows the one they want.

All of them are the platform's own controls. What a hand-built box has to
re-implement is the keyboard, the tap target on a phone, the indeterminate
state and how the whole thing reads out — and the ones that skip a part skip
the part nobody on the team tests with.

A switch is not a checkbox
==========================

.. specimen:: components/core/form-controls.card.html
   :viewport: 700x382
   :title: Beyond the text field

``sds-checkbox`` answers a question the form asks and is sent when the form is
sent. ``sds-switch`` turns something on **now**. A reader who has to press Save
after flipping one has been told the wrong thing by the control, and a page of
switches that only take effect on submit is a settings page that lies.

``sds-range`` is for the value where the *position* is the answer and the exact
number is not — a zoom, a threshold somebody is feeling their way to. It always
carries its number in an ``<output>``: a slider with nothing beside it is a
value nobody can read back or report. Where the number is what the reader
already knows, that is a field with ``type="number"``, which can be typed into
and pasted.

``sds-file`` keeps the browser's own picker and paints its button. The picker
opens only for a press on a real file input, so the drawn box with a hidden
input behind it — which photographs well and drops nothing — is a control the
keyboard cannot reach at all.

The form knows about the controls
=================================

Every control is form-associated through ``ElementInternals``. That is what
makes it a member of the form rather than a box that happens to contain one: a
reset reaches the element itself, a ``<fieldset disabled>`` disables everything
under it, and ``error`` becomes a validity the browser refuses to submit past
and reports on the right box.

The value is still the real ``<input>``'s. Every one of these renders a named
control into the light DOM, so a page rendered ahead of time submits what it
shows before a single line of script has run — which is the case this system is
built for and the one a value held in JavaScript quietly loses.

.. warning::

   The tick is ``--text-primary``, not ``--accent``. The accent marks three
   things in this system; a form of nine ticked boxes would spend the loudest
   colour it has on what somebody typed.

The button that submits says so
===============================

``sds-button`` renders ``type="button"`` unless told otherwise, and that
default is load-bearing: a ``<button>`` with no type inside a ``<form>`` is a
submit button, so a filter, a toggle or a Cancel drawn with this element
submits the form it stands in. The browser then blocks that on the first
invalid required field and moves the focus there — a page doing something
nobody asked it to, decided by an attribute nobody wrote.

A real submit says ``type="submit"``. Then Enter in a text field submits too,
which is behaviour a form should have and only one button should carry.

Hand-written markup carries the same rule:
``<button class="sds-btn" type="button">``.

The measure
===========

``sds-form`` is one column at ``--measure-lead``. Fields side by side are
faster to scan and slower to complete, and this is the one surface where
completing is the point.

Three states exist and most forms ship one. Pages → Contact has all three: the
form, what it does when it fails, and what it says when it worked — including
what was sent, what happens to it, and how long that takes. A page that says
"thank you" and stops has taken something and given nothing back.

.. seealso::

   :doc:`/frontend/components/forms` is the same set of controls as a
   reference: every attribute each one takes, what a reset puts back, and the
   markup a server writes where no script will run.
