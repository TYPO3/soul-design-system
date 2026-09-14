:navigation-title: Controls

========
Controls
========

What a reader presses, follows or reads a state off. Everything here is
small, appears in a bar or a row of actions, and is a real ``<button>`` or
``<a>`` underneath.

.. specimen:: components/core/buttons.card.html
   :viewport: 700x410
   :title: Buttons & links

.. _component-sds-button:

sds-button
==========

The action that starts work. **One primary per view.** A second makes
neither mean anything.

.. code-block:: html

   <sds-button variant="primary" type="submit">Send the message</sds-button>
   <sds-button variant="ghost" size="sm" for="filters" command="toggle">
     <sds-icon name="actions-filter"></sds-icon>
   </sds-button>

The label is content, not a property. A button's label is often a name in
mono, a count, or a glyph, and none of those fits in a string.

.. confval:: variant
   :name: sds-button-variant
   :type: "primary" | "secondary" | "ghost" | "danger"
   :default: "primary"

   ``primary`` is the action that starts work. ``secondary`` stands beside
   it. ``ghost`` belongs in a bar or a head, where a filled box is the
   loudest thing on the surface. ``danger`` is the press with no undo:
   status colour as ink and a hairline, never a fill, and a label that names
   what goes. It stands last, after the way out. :doc:`/design-system/colours`
   says why it is the one control with a status colour.

.. confval:: size
   :name: sds-button-size
   :type: "md" | "sm" | "lg"
   :default: "md"

   ``sm`` is for a control inside another surface, a table head, a code
   block's chrome, not to make a page fit. ``lg`` is the one action a screen
   is for, a landing's single call. Beside a second large button neither is
   the one, and that is what ``md`` is for.

.. confval:: type
   :name: sds-button-type
   :type: "button" | "submit" | "reset"
   :default: "button"

   The default is the whole reason for the property. A ``<button>`` with no
   type inside a ``<form>`` **submits it**. So a filter or a Cancel drawn
   with this element sends the form on the press. A real submit says so, and
   then Enter in a text field submits too, which only that button carries.

.. confval:: disabled
   :name: sds-button-disabled
   :type: boolean
   :default: false

   Emits ``is-disabled`` beside the button's own classes.

.. confval:: icon-only
   :name: sds-button-icon-only
   :type: boolean
   :default: false

   The label is one glyph, and the button is the square. The element infers
   it where it can read the label. A caller says it where the label arrives
   as markup, or the button loses its shape in a bar.

.. confval:: title
   :name: sds-button-title
   :type: string

   An icon-only button must have one, because nothing else names it.

.. confval:: href
   :name: sds-button-href
   :type: string

   Where it goes, for the press that is a link. It renders an ``<a>`` and
   nothing else changes: same classes, same shape. The browser adds its own
   middle-click, hover target and status line, which a ``<button>`` with a
   handler does not have. A link has no disabled state, so ``disabled``
   drops there. A control nobody must follow is one nobody writes.

.. confval:: rel
   :name: sds-button-rel
   :type: string

   What that link is to this page: ``prev``, ``next``, ``external``. Only
   with ``href``, as the anchor's own attribute.

.. confval:: for
   :name: sds-button-for
   :type: string

   The id of what this button acts on. A press dispatches ``sds-command``
   **on that element**. Without it the button keeps its own click.

.. confval:: command
   :name: sds-button-command
   :type: string
   :default: "show"

   What it asks: ``show``, ``close``, ``toggle``, or a word a page's own
   listener understands.

.. code-block:: html

   <!-- The class equivalent, for a surface that runs no JavaScript. -->
   <button class="sds-btn sds-btn--primary" type="button">Send the message</button>

.. _component-sds-dropdown:

sds-dropdown
============

A button, and the short list it opens under itself.

.. specimen:: components/core/dropdown.card.html
   :viewport: 700x546
   :title: Dropdown

The card draws the control open, the button pressed and its list under it,
as a box in the flow. That is the one state a specimen can hold: it runs no
script, and nothing static opens a popover. Everything that makes the panel
a flyout hangs off the attribute. So what a surface with no JavaScript
writes is exactly what the card draws, down to the distance of the list
from its button.

.. code-block:: html

   <sds-dropdown label="Language" name="Language"></sds-dropdown>

**The entries decide what the list is.** Entries with ``href`` are pages, so
the panel is a disclosure of links, and Tab walks them as well. Entries
without one are commands, so it is a menu with ``role="menu"``. The element
asks the entries, not the caller. A caller who has to say which one it is can
say the wrong one. Menu commands over a list of pages is a promise the panel
cannot keep.

The arrows belong to both. From the button they open the panel and step into
it from the end the key came from. Inside it they walk the rows and stop at
the ends. ``Home`` and ``End`` go straight there. A reader on the button
presses down before anything else. A panel that answers that in one list and
not in the other is a control to learn twice.

The trigger is a real button of this system, from the same classes, so it
takes the variants and sizes every other one does. What a dropdown says
about itself, expanded, and which panel it controls, stands on the
``<button>`` itself. That is why it is not an ``<sds-button>`` with
attributes.

**The panel is a popover.** The top layer holds it, so no ancestor's
overflow clips it and nothing on the page stacks over it. The open, the
press outside that closes it, Escape and the focus back on the button are
the platform's. Placement is the one part that is not.

Where the engine has anchor positioning, the stylesheet does it. Where it
has not, the element measures the button and writes the edges itself:
``src/lib/flyout.ts``, which ``sds-search`` uses for its own drop. Both
routes write the same two edges from ``anchor()``, not a ``position-area``.
An area is a box the panel fits into, and it pushes a list wider than its
control off its own anchor.

The window is the one edge the top layer does not answer for. A button near
the side the panel grows towards leaves less room than the panel needs. What
leaves the window is out of reach. So the panel hangs from the button's
other edge instead, on both routes. ``position-try-fallbacks: flip-inline``
where the engine anchors, and the same question of the measurement where it
does not.

``align`` says which side it starts from and is a preference. To stay on
the page is not one.

.. confval:: choices
   :name: sds-dropdown-choices
   :type: DropdownChoice[]

   The entries, in the order a reader reads them. Set from script, as a list. ``label``, then
   ``href`` for a page, ``icon`` for a glyph before the label, ``current``
   for the one in force, ``disabled``, ``external``. And ``lang`` where the
   entry names a language. That last one makes a reader hear "Deutsch" in
   German, not in the voice of the page.

.. confval:: label
   :name: sds-dropdown-label
   :type: string

   What the button says. A dropdown whose entries are settings names the
   setting, not the value, and lets ``current`` mark the one in force.

.. confval:: name
   :name: sds-dropdown-name
   :type: string

   The control's name, where the label is too short to say it: a language
   code for "Language". It stands **in front of** the label, not
   instead of it. An accessible name that drops the word a reader can see is
   a name they cannot ask for by voice.

.. confval:: align
   :name: sds-dropdown-align
   :type: "start" | "end"
   :default: "start"

   Which side the panel hangs from. ``end`` where the button sits at the end
   of a row, so the list opens back over the row. A side with no room for
   the panel is the placement's business: the panel hangs from the button's
   other edge instead.

.. confval:: variant
   :name: sds-dropdown-variant
   :type: "primary" | "secondary" | "ghost"
   :default: "secondary"

   The button's own variant. ``size`` beside it takes the button's sizes.

.. confval:: icon-only
   :name: sds-dropdown-icon-only
   :type: boolean

   The label drops and ``icon`` stands alone. Then ``name`` is mandatory:
   nothing else says what the control is.

A chosen entry dispatches ``sds-dropdown-choose`` with the entry and its
position. A page that never listens still works. An entry with a target is a
link and stays one, so the event stands **beside** the navigation, not
instead of it. ``preventDefault()`` is how an app takes the navigation over.

.. _component-sds-link:

sds-link
========

A link. Always an ``<a>`` with an ``href``, the external one included.
Anything else looks like a link, takes no focus, opens in no new tab, and is
invisible to whatever reads the page as a document.

.. code-block:: html

   <sds-link label="The changelog" href="/changelog"></sds-link>
   <sds-link label="On GitHub" href="https://github.com/…" external></sds-link>

.. confval:: label
   :name: sds-link-label
   :type: string
   :required: true

   The words. A link is never a bare glyph. A row of marks is a row of
   pictures the reader has to know already.

.. confval:: href
   :name: sds-link-href
   :type: string
   :default: "#"

.. confval:: external
   :name: sds-link-external
   :type: boolean
   :default: false

   Opens away from this surface. It gets the glyph, and says so to the
   browser and to the eye.

.. confval:: icon
   :name: sds-link-icon
   :type: icon id

   A glyph beside the label: a repository, a chat, a feed. The component
   decides if it leads or follows. An arrow, a chevron or a caret says where
   the press goes and follows the label. Everything else says what the link
   is and leads it.

.. confval:: bare
   :name: sds-link-bare
   :type: boolean
   :default: false

   The mark alone, with ``icon``: drawn at 24, the ``label`` carried for
   whoever cannot see it, and the external glyph dropped. Two marks on one
   link say one thing twice. For a row of accounts at the end of a footer,
   where a reader looks for marks by position. Nowhere a link stands in a
   sentence.

.. _component-sds-badge:

sds-badge
=========

A small, named piece of state. ``accent`` names where an answer came from.
The status tones are the result of one.

.. code-block:: html

   <sds-badge label="1.4.0" tone="accent"></sds-badge>
   <sds-badge label="answered" tone="ok"></sds-badge>

.. confval:: label
   :name: sds-badge-label
   :type: string
   :required: true

.. confval:: tone
   :name: sds-badge-tone
   :type: "default" | "accent" | "ok" | "warn" | "error"
   :default: "default"

   The three result tones carry a glyph and a colour. Colour alone
   leaves the meaning to anyone who cannot tell three hues apart.

.. confval:: icon
   :name: sds-badge-icon
   :type: icon id

   An explicit glyph, where the icon adds a fact the word does not.

.. warning::

   Status colour belongs in a badge, in code output, in a result row and in
   a diagram about status. Never as page furniture. A colour for "something
   is wrong" on a header says it about the page.

.. _component-sds-progress:

sds-progress
============

How far a running job has got: a share, not a sequence of stops.
``sds-steps`` claims that step two follows step one. This claims a distance,
and the outside drives it. Set ``value`` as the work reports, and the bar
travels to the new width in ``--duration-fast``.

**The fill takes its colour from that same distance.** The ink comes from
the share itself: grey with nothing to report, and the whole way to
``--status-ok`` as the work approaches a complete run. So the colour says
what the length says, moves as slowly as the bar does, and needs no
threshold. A flat colour at every moment, never a gradient.

It never passes through red or amber. A job at a fifth is not a failure. A
colour that says so is the one thing on the page that claims a fault.

.. specimen:: components/core/progress.card.html
   :viewport: 700x515
   :title: Progress

.. code-block:: html

   <sds-progress caption="Rendering the manual" value="42"
     note="Chapter 5 of 12 — writing the search index next."></sds-progress>

   <sds-progress caption="Uploading the release" value="3" max="12"
     readout="count" unit="files"></sds-progress>

.. confval:: caption
   :name: sds-progress-caption
   :type: string

   What the work is, over the bar. Without one the bar is bare, right where
   the surface around it names the job, and it still owes ``label``.

.. confval:: label
   :name: sds-progress-label
   :type: string

   Its name for anything that cannot see what it sits beside. The track is
   the ``progressbar``, and a bar with no name reads out as a number out of
   a hundred of nothing.

.. confval:: value
   :name: sds-progress-value
   :type: number
   :default: 0

   Where it stands, in the unit of ``max``. Clamped to the run, so work that
   overruns its own estimate draws a full bar, not one out of its track.

.. confval:: max
   :name: sds-progress-max
   :type: number
   :default: 100

   The whole the value is a part of.

.. confval:: readout
   :name: sds-progress-readout
   :type: "percent" | "count" | "none"
   :default: "percent"

   How it says the position. ``count`` gives the two numbers themselves, "3
   of 12 files", where the count is the useful part. A percentage of twelve
   is arithmetic the reader has to undo.

.. confval:: unit
   :name: sds-progress-unit
   :type: string

   What the numbers count, after them in a ``count`` read-out.

.. confval:: note
   :name: sds-progress-note
   :type: string

   What the work does right now. Over 2s this line has to say why. The same
   line can stand between the tags where it carries a link or a name in
   mono.

.. confval:: size
   :name: sds-progress-size
   :type: "medium" | "small"
   :default: "medium"

   ``small`` thins the track alone, for a bar in a row of other things. The
   read-out over it is the same line it is anywhere else.

.. confval:: pulsing
   :name: sds-progress-pulsing
   :type: boolean
   :default: false

   Work happens **right now**: a hatch travels through the filled part while
   the bar stands still, the one thing a bar at rest cannot say. Use it where
   reports arrive far apart. A bar with no movement for ten seconds and a
   stalled one look the same otherwise. Turn it off the moment the work
   stops, and at the end of the run. A bar at work at a standstill claims
   something nobody measured.

   It sets ``aria-busy`` while it runs. Reduced motion keeps the hatch and
   stops its travel, so a working bar still reads as one. The note under the
   bar, never the movement alone, says what happens.

   The stripes are the system's second and last gradient, beside the lit
   frame of a card under the pointer. One ink at two strengths, for motion,
   not colour. See :doc:`/design-system/colours`.

.. note::

   **Where the share is unknown, there is nothing to fill.** That is
   ``.sds-loading`` with a spinner, which claims no distance; see :doc:`the
   states guideline </design-system/states>`. A bar that advances by itself
   tells the reader something the work never said.

.. _component-sds-run:

sds-run
=======

Work **in progress**, as its stops. ``sds-progress`` above says how far.
This says what the work goes through, and it is the one component in the
system that changes while a reader watches it.

Not :ref:`sds-steps <component-sds-steps>`, and the difference is not the
drawing. An instruction renders before the page ships and never changes. A
run arrives one stop at a time, and each stop carries what it wrote. The
stops fold, and the whole ends on a **verdict** an instruction has no place
for. Nothing in a document still runs, which is why this element is an
application's and appears in no rendered page here.

.. code-block:: html

   <sds-run heading="Reading docs.typo3.org" verdict="running"
     note="Step 3 of 5 · 1m 27s so far" open
     .steps="${[
       { label: 'Fetch the sitemap', state: 'done', meta: '0.4s' },
       { label: 'Build the index', state: 'running', meta: '23s',
         output: '→ 12880 of 18412 pages' },
       { label: 'Swap it in', state: 'ahead' },
     ]}"></sds-run>

.. confval:: heading
   :name: sds-run-heading
   :type: string
   :required: true

   What the run is, in one line. Or what became of it, which is what a set
   of jobs says at the top: "Some checks haven't completed yet".

.. confval:: verdict
   :name: sds-run-verdict
   :type: "running | done | failed"
   :default: running

   What became of the whole. It is the mark beside the heading, and the one
   thing a folded run still says.

.. confval:: note
   :name: sds-run-note
   :type: string

   The line under the heading: where the work has got to, or the counts.

.. confval:: steps
   :name: sds-run-steps
   :type: "{ label, state, meta?, note?, output?, group? }[]"
   :required: true

   The stops, set from script, as a list that changes. ``state`` is
   ``ahead``, ``running``, ``done`` or ``failed``. ``meta`` is the quiet word
   at the far end of the row, a duration or a count. ``note`` is what happens
   to it *in words*, which a queue owes a reader that a mark cannot say.
   ``output`` is what it wrote.

.. confval:: group
   :name: sds-run-group
   :type: string

   Named on a step, not on the run. Where the work is many jobs at once, the
   order says nothing and the state sorts them. So the stops carry their
   group, and each group folds under a name with its own count. Stops with
   no group are one run, in order.

.. confval:: open
   :name: sds-run-open
   :type: boolean
   :default: false

   If the whole stands unfolded. A run under watch is ``open``. One in a
   list of past runs is not, and the head is then the whole of it.

.. confval:: state-words
   :name: sds-run-state-words
   :type: "{ ahead?, running?, done?, failed? }"

   The names of the states, where the page is not in English. Partial: a
   page names the ones it has a word for, and the rest keep theirs. So a
   language that arrives one string at a time is never a run with no words.

**A stop that wrote nothing does not open.** It draws no chevron and takes
no press. A control that opens onto an empty box is a promise the row cannot
keep. A stop that wrote something opens by itself while it is in hand and
closes once it is behind. A press is the reader's answer to that question,
kept for as long as the run is on screen.

**The mark has a name, not only a drawing.** A shape and a colour are one
claim, and neither reaches a reader who hears the page. So every state
carries its word; see :doc:`/design-system/accessibility`. The word is
English until ``state-words`` says otherwise. It is the only part of a run
this element writes itself. Without the words, a page in another language
draws its own labels and announces somebody else's.

**The row in hand carries a band and the page's own ink**, never the accent.
The accent marks three things, and a step is none of them. The movement says
that this is the row under work, which the two settled ends have no need of.

.. note::

   The share is ``sds-progress``, above it, where the work reports one. Most
   runs cannot. A job of five steps knows its step and nothing about how long
   the fourth takes. A bar that advances by itself tells the reader something
   the work never said.

.. _component-sds-icon:

sds-icon
========

A TYPO3 icon, in the document, not linked from it, so it inherits
``currentColor``. Colour that follows the UI is the whole icon rule.

.. code-block:: html

   <sds-icon name="actions-check-circle"></sds-icon>
   <sds-icon name="actions-search" size="24" label="Search"></sds-icon>

.. confval:: name
   :name: sds-icon-name
   :type: icon id
   :required: true

   An identifier from the set this system ships. An unknown one throws
   instead of a blank. A missing glyph reads as a design decision, and the
   fix is a one-line edit and ``make icons``.

.. confval:: size
   :name: sds-icon-size
   :type: 16 | 20 | 24 | 32 | 48 | "em"
   :default: "em"

   ``em`` is the default because an icon almost always sits inside something
   with a text size: a button's label, a badge, a table cell. A match makes
   a glyph look placed, not dropped in. A number is for a glyph on its own,
   and **16 is the floor**.

.. confval:: label
   :name: sds-icon-label
   :type: string

   For an icon without text beside it, and only for that. An icon beside its
   own label hides from assistive technology, so nothing reads twice.

.. seealso::

   :doc:`/design-system/icons` for the set, where a missing one comes from,
   and which state glyphs can stand alone in text.

.. _component-sds-theme:

sds-theme
=========

The mode the page is in, as one press that changes it: a state a reader
flips, not a choice from a list.

.. code-block:: html

   <sds-theme></sds-theme>

It is the system's own icon button and draws no control of its own. Square,
ghost, and with its sentence in ``title``, which is both the accessible name
and the words the pointer reveals. It draws three marks and fades two out,
so a press confirms the change without movement on the row.

**There are three states, and one press steps to the next.** The machine's
setting, light, dark, and round again. The machine's is the default most
readers are on, so it is a stop on the way, not something only a cleared key
gives back. A control that reaches two of its three states takes the default
away from whoever tries it once.

**The document says which mark stands**, and the stylesheet decides it. No
``data-theme`` is the machine's, and the attribute names the other two. So
the button is right before a script runs. A button drawn from its own state
renders its construction value, which on a prerendered dark page is a sun. The sentence in ``title`` names no state for the same reason.
Where a script has read the document, ``aria-label`` names both the state
and where the press goes.

.. confval:: key
   :name: sds-theme-key
   :type: string
   :default: "soul-theme"

   Where the choice lives. The boot script in the document head has the same
   default, both ends on one name. Two products on one origin are two keys,
   and then each end gets its own; see :doc:`/frontend/index`.

.. note::

   The element reads ``data-theme`` off the document, keeps no idea of its
   own, and watches it. The boot script writes it before the first paint,
   the machine's setting changes it, and a second tab changes it too.
   Same-origin frames on the page get it as well, which keeps a specimen
   from a light state inside a dark page.
