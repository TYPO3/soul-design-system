:navigation-title: Text roles

==========
Text roles
==========

What stands inside a line of text.

badge
=====

A short state in a line, as a text role: ``:badge:`Closed <ok>```. The
tone stands in angle brackets after the label: ``ok``, ``warn``, ``error``
or ``accent``. Without one, the badge is neutral. A word in brackets that is
no tone stays part of the label.

.. example:: States in a table cell

   :badge:`Closed <ok>` :badge:`Under review <warn>` :badge:`New`

The element is ``sds-badge``. The Markdown twin writes the label in square
brackets.

anchor
======

An address in a line, as a text role: ``:anchor:`P2 <step-p2>```. A label
stands before a block, so a word in a table cell has none. This role gives
it one. The words stay as they are, and the address in angle brackets is
what a ``:ref:`` names. Without brackets, the words are the address too.

.. code-block:: text

   * - :anchor:`P2 <step-p2>`
     - Add nine sections to the page

   The step :ref:`P2 <step-p2>` fails in the extension.

The Markdown twin writes the words.

id
==

A reference to an id in mono, as a text role: ``:id:`B10 <feat-b10>```.
It is ``:ref:`` with the link in the mono face. An id is a name the machine
gave the thing, and mono says so. A ``:ref:`` cannot hold a literal in its
words, so this role is the route.

.. code-block:: text

   The grid element :id:`B10 <feat-b10>` comes after the MVP.

The Markdown twin writes the link.
