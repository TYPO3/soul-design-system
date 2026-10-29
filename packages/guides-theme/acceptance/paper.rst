:navigation-title: Paper
:layout: paper
:numbered: yes
:deck: The fixture · slides
:eyebrow: Concept · the fixture
:foot: Draft 1, for the check
:foot: Two lines, one field each

===================================
A document that goes out on its own
===================================

A paper has no bar and no footer of a site. The panel beside the text holds
the outline of this document, from its headings.

.. byline:: Benjamin Kott
   :as: responsible for the content
   :meta: draft 1

.. slide:: A document that goes out on its own
   :kind: cover
   :ground: terminal
   :lead: The panel holds the outline, and the press under the title plays the slides.

.. part:: Ask

.. outline:: Question

.. _the-ask:

The question
============

What the paper asks, and what :ref:`the proposal <the-proposal>` answers
(:ref:`# <the-proposal>`).

.. slide:: Ask
   :kind: section

.. _figure-needs:

.. slide:: Needs met and open
   :kind: figure
   :lead: Nine needs are met, twenty-three are open.
   :caption: The needs, met and open. A slide that is a figure counts as one.

   .. diagram::

      tiles
      title "Needs met and open"
      description "Two counts of needs."
      tile "9" "met"
      tile "23" "open"
        emphasis

The slide is :ref:`the figure <figure-needs>` of this section.

.. list-table:: What a reader weighs
   :header-rows: 1

   *  - Option
      - Cost
   *  - A rail
      - A second navigation

Open
----

.. decision:: Does a paper need a rail?
   :label: Open

   .. answer:: No: the outline is in the panel
      :recommended:

      A paper goes out on its own.

   .. answer:: Yes

      A second navigation.

Decided
-------

The decision fell.

.. part:: Propose

.. _the-proposal:

The proposal
============

What the paper proposes, in a section of its own.

.. slide:: Two drawings side by side
   :kind: figure
   :layout: row

   .. diagram::
      :label: Before

      tiles
      title "Two needs met"
      description "The count of needs met before."
      tile "2" "met"

   .. diagram::
      :label: After

      tiles
      title "Nine needs met"
      description "The count of needs met after."
      tile "9" "met"
        emphasis

.. slide:: A drawing under a short head
   :kind: figure
   :layout: headed
   :eyebrow: Proposal · The needs
   :legend: ■ Met | □ Met in part | [ID] Need
   :lead: The drawing takes the frame, and the head stays short.

   .. diagram::

      tiles
      title "Nine needs met"
      description "The count of needs met after the proposal."
      tile "9" "met"
        emphasis

.. slide:: A table on a slide

   .. list-table::
      :header-rows: 1

      * - Role
        - Holder
      * - Project lead
        - The team

.. slide:: A slide of the page alone
   :kind: statement
   :page-only:

.. slide:: A picture on a slide
   :kind: figure
   :lead: The slide is the frame, so the picture has none of its own.

   .. image:: /_images/placeholder.svg
      :alt: A placeholder
