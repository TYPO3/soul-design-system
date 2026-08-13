:navigation-title: Controls

========
Controls
========

What a reader presses, follows or reads a state off. Everything here is small,
everything here appears in a bar or a row of actions, and everything here is a
real ``<button>`` or ``<a>`` underneath.

.. specimen:: components/core/buttons.card.html
   :viewport: 700x260
   :title: Buttons & links

sds-button
==========

The action that starts work. **One primary per view** — a second makes neither
mean anything.

.. code-block:: html

   <sds-button variant="primary" type="submit">Send the message</sds-button>
   <sds-button variant="ghost" size="sm" for="filters" command="toggle">
     <sds-icon name="actions-filter"></sds-icon>
   </sds-button>

The label is content rather than a property, because a button's label is often
a name in mono, a count, or a glyph — none of which fits in a string.

.. confval:: variant
   :name: sds-button-variant
   :type: "primary" | "secondary" | "ghost"
   :default: "primary"

   ``primary`` is the action that starts work, ``secondary`` stands beside it,
   ``ghost`` is the one that belongs in a bar or a head where a filled box
   would be the loudest thing on the surface.

.. confval:: size
   :name: sds-button-size
   :type: "md" | "sm"
   :default: "md"

   ``sm`` is for a control inside another surface — a table head, a code
   block's chrome — not for making a page fit.

.. confval:: type
   :name: sds-button-type
   :type: "button" | "submit" | "reset"
   :default: "button"

   The default is the whole reason the property exists. A ``<button>`` with no
   type inside a ``<form>`` **submits it**, so a filter or a Cancel drawn with
   this element would send the form the moment it was pressed. A real submit
   says so — and then Enter in a text field submits too, which only that button
   should carry.

.. confval:: disabled
   :name: sds-button-disabled
   :type: boolean
   :default: false

   Emits ``is-disabled`` beside the button's own classes.

.. confval:: icon-only
   :name: sds-button-icon-only
   :type: boolean
   :default: false

   That the label is one glyph and the button is the square. It is inferred
   where the label can be read, and a caller says it where the label arrives as
   markup rather than as nodes — a button that loses its shape there is a round
   control gone rectangular in a bar.

.. confval:: title
   :name: sds-button-title
   :type: string

   Required by an icon-only button, because nothing else names it.

.. confval:: for
   :name: sds-button-for
   :type: string

   The id of what this button acts on. Pressing it dispatches ``sds-command``
   **on that element**; without it the button keeps its own click.

.. confval:: command
   :name: sds-button-command
   :type: string
   :default: "show"

   What it asks of it — ``show``, ``close``, ``toggle``, or a word a page's own
   listener understands.

.. code-block:: html

   <!-- The class equivalent, for a surface that runs no JavaScript. -->
   <button class="sds-btn sds-btn--primary" type="button">Send the message</button>

sds-link
========

A link. Always an ``<a>`` with an ``href``, the external one included: anything
else looks like a link, cannot be focused or opened in a new tab, and is
invisible to whatever reads the page as a document.

.. code-block:: html

   <sds-link label="The changelog" href="/changelog"></sds-link>
   <sds-link label="On GitHub" href="https://github.com/…" external></sds-link>

.. confval:: label
   :name: sds-link-label
   :type: string
   :required: true

   The words. A link is never a bare glyph — a row of marks is a row of
   pictures the reader has to already know.

.. confval:: href
   :name: sds-link-href
   :type: string
   :default: "#"

.. confval:: external
   :name: sds-link-external
   :type: boolean
   :default: false

   Opens away from this surface: gets the glyph, and says so to the browser as
   well as to the eye.

.. confval:: icon
   :name: sds-link-icon
   :type: icon id

   A glyph beside the label — a repository, a chat, a feed. Whether it leads or
   follows is the component's decision and not the caller's: an arrow, a
   chevron or a caret says where pressing goes and follows the label;
   everything else says what the link is and leads it.

sds-badge
=========

A small, named piece of state. ``accent`` names where an answer came from; the
status tones are the result of one.

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

   The three result tones carry a glyph as well as a colour, because colour
   alone leaves the meaning to anyone who cannot tell three hues apart.

.. confval:: icon
   :name: sds-badge-icon
   :type: icon id

   An explicit glyph, where the icon adds a fact the word does not.

.. warning::

   Status colour belongs in a badge, in code output, in a result row and in a
   diagram that is about status. Never as page furniture — a colour meaning
   "something is wrong" on a header says it about the page.

sds-icon
========

A TYPO3 icon, in the document rather than linked from it, so it inherits
``currentColor``. Colour following the UI is the whole icon rule.

.. code-block:: html

   <sds-icon name="actions-check-circle"></sds-icon>
   <sds-icon name="actions-search" size="24" label="Search"></sds-icon>

.. confval:: name
   :name: sds-icon-name
   :type: icon id
   :required: true

   An identifier from the set this system ships. An unknown one throws rather
   than rendering blank: a missing glyph reads as a design decision, and the
   fix is a one-line edit and ``make icons``.

.. confval:: size
   :name: sds-icon-size
   :type: 16 | 20 | 24 | 32 | 48 | "em"
   :default: "em"

   ``em`` is the default because an icon almost always sits inside something
   that has a text size — a button's label, a badge, a table cell — and
   matching it is what makes a glyph look placed rather than dropped in. A
   number is for a glyph standing on its own, and **16 is the floor**.

.. confval:: label
   :name: sds-icon-label
   :type: string

   For an icon that stands without text beside it, and only for that. Anything
   sitting beside its own label is hidden from assistive technology rather than
   read out twice.

.. seealso::

   :doc:`/design-system/icons` for the set, where a missing one comes from, and
   the four glyphs that may stand alone in running text.

sds-theme
=========

Light or dark, as two segments with the chosen one filled — the same treatment
as an active navigation item, because it is one.

.. code-block:: html

   <sds-theme></sds-theme>

Never a switch, and never one moon standing for the pair: there are three
states, not two — light, dark, and the machine's, which is what a reader who
has pressed neither gets. Pressing the current one gives the machine back.
Each segment carries its own mark, so the pair still reads as two things to
press rather than one state to flip.

.. confval:: key
   :name: sds-theme-key
   :type: string
   :default: "theme"

   Where the choice is stored. Two products on one origin are two keys, and the
   boot script in the document head has to be given the same one — see
   :doc:`/frontend/index`.

.. confval:: compact
   :name: sds-theme-compact
   :type: boolean

   The words dropped and the marks left standing, for a row that has run out of
   room for them. Set from outside, because what is short of room is never the
   control itself: in a bar it is ``sds-header``, and these two words are the
   first thing it sheds — before the search field, and long before a section.
   The word a segment no longer draws is still said to a reader who cannot see
   the mark.

.. note::

   The element reads ``data-theme`` off the document rather than keeping an
   idea of its own, and watches it: the boot script writes it before the first
   paint, the machine's setting changes it, and a second tab changes it too.
   Same-origin frames on the page are painted with it, which is what keeps a
   specimen from staying light inside a dark page.
