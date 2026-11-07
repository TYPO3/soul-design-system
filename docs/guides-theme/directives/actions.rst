:navigation-title: Actions

=======
Actions
=======

What a reader can do next.

cta
===

The one thing a reader can do next. A heading says what the reader gets, a
line says what it costs, and the press starts it.

.. example:: The press and a second way

   .. cta:: Your first site in ten minutes
      :action: Publish a first site
      :href: /guides-theme/quickstart
      :second: Read the example
      :second-href: /guides-theme/example

      Copy the example project and replace its content.

.. confval:: the argument
   :name: cta-heading
   :type: string
   :required: true

   What the reader gets, as a claim and not as a command. The press says the
   command.

.. confval:: action
   :name: cta-action
   :type: string

   The press, in words, with a verb first. A reader who hears the links hears
   only this, so it never says "Click here".

.. confval:: href
   :name: cta-href
   :type: string

   Where the press goes. With no ``href`` no button draws, because a press
   must go somewhere.

.. confval:: icon
   :name: cta-icon
   :type: string

   The name of a glyph in front of the press.

.. confval:: second
   :name: cta-second
   :type: string

   The way for a reader who is not ready, quieter than the press. It draws
   only beside a press.

.. confval:: second-href
   :name: cta-second-href
   :type: string

   Where the second way goes.

The body is the line under the heading. It is not an option, because out of a
document it carries links.

**One per page.** The press is the page's one primary. A way into a chapter
is ``card``, and a row of presses with no claim is ``button-bar``.

button
======

One press, and where it goes.

.. example:: One press on its own, and the one beside it

   .. button:: :doc:`/guides-theme/installation`
      :icon: actions-download

   .. button:: The renderer
      :href: https://docs.phpdoc.org/components/guides/guides/
      :variant: secondary
      :rel: external

.. confval:: the argument
   :name: button-label
   :type: string
   :required: true

   The label, and where the press goes with it. As a reference, a ``:doc:``
   or an external link, the words are the label and the reference is the
   target. A card's title carries the same thing. It is the argument
   and not an option because it is what the control says.

.. confval:: href
   :name: button-href
   :type: string

   The target as a path instead, and it wins where both stand.

.. confval:: variant
   :name: button-variant
   :type: string
   :default: "primary"

   ``primary``, ``secondary`` or ``ghost``. One primary per view. A second
   makes neither of them mean anything.

.. confval:: size
   :name: button-size
   :type: string
   :default: "md"

   ``sm`` for the smaller control, a press beside a line of text, not under
   a section. ``lg`` for the one action a page is for. Beside a second large
   button neither is the one, and that is what ``md`` is for.

.. confval:: icon
   :name: button-icon
   :type: string

   A glyph before the label, an icon of this system; see
   :doc:`/design-system/brand-and-imagery/icons`.

.. confval:: icon-only
   :type: flag

   The glyph is the whole control, and the button is a square. It needs a
   name, and the label is it. The words become the control's title and do
   not draw.

.. confval:: title
   :name: button-title
   :type: string

   The control's name where the label does not say it, and what a pointer
   at rest on it reads.

.. confval:: rel
   :name: button-rel
   :type: string

   What the target is to this page: ``external``, ``prev``, ``next``. Only
   with a target, as the anchor's own attribute.

.. confval:: disabled
   :type: flag

   The control is there and takes no press. It drops where the press goes
   somewhere. A link has no disabled state, and a grey one the browser
   follows anyway is worse than none.

**A press on a rendered page is a link.** With somewhere to go, the element
draws an ``<a>``. That gives the reader the middle click, the hover target
and the status line the browser already has. A control with a listener has
none of them.

A button with nowhere to go does nothing on a press. So ``type``, ``for``
and ``command`` are not on offer. A document has no form
to submit and no element to command, and a page that needs them is an
application, not a manual.

**The label is the words, not the markup.** A reference rendered where it
stands puts a link inside the control. The reference becomes the control's
target instead. That is the trade the card makes with its title, and why
both come off the node, not out of a template.

The element is ``sds-button`` in :doc:`/frontend/components/controls`, with
the properties this leaves out and the ones above.

button-bar
==========

The controls of a page, in one row.

.. example:: The presses of a page, on one line

   .. button-bar::

      .. button:: :doc:`/guides-theme/installation`

      .. button:: The renderer
         :href: https://docs.phpdoc.org/components/guides/guides/
         :variant: secondary
         :rel: external

Named for what it holds and the shape it holds them in. A row of controls
is layout, not a component, so it has no variant. What stands in it sits on
one line, centred against each other, which is what a link beside a button
needs. It holds whatever a page puts in it, and
one press in it is the primary. It emits ``.sds-actions``, the row in
:doc:`/frontend/layout`, written by the theme the way ``band`` writes its
section.
