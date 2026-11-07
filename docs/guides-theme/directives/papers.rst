:navigation-title: Papers and decks

================
Papers and decks
================

The parts of a long document, and its frames.

part
====

Where a part of a paper begins. The argument names the part. It stands
before the first heading of the part, and takes no body.

.. code-block:: text

   .. part:: Problem

   The problem
   ===========

The name stands over that heading. In ``:layout: paper``, the outline in the
panel groups the sections under it, up to the next part. See
:doc:`/guides-theme/configuration`.

outline
=======

The short name the outline of a paper gives the next section. It stands
before the heading, as ``part`` does, and takes no body.

.. code-block:: text

   .. outline:: Overview

   In short: the whole concept on one page
   =======================================

A heading says what a section claims. A list of claims reads slowly, so the
outline can name a section in a word.

decision
========

The question a concept puts, with the answers it can take. The question is
the argument. The answers stand between the tags as ``answer``, each with
what it means.

.. example:: An open question, and the answer the paper recommends

   .. decision:: What is the name of the TCA key?
      :label: Open
      :by: The core team
      :due: 2026-11-30

      .. answer:: primaryFields
         :recommended:

         Neutral, and close to "primary" in the backend.

      .. answer:: contentFields

         Clear for content elements, wrong for pages.

.. confval:: label
   :name: decision-label
   :type: string
   :default: Decision

   The word over the block: ``Open`` while the question stands, ``Decided``
   once it fell.

.. confval:: by
   :name: decision-by
   :type: string

   Who decides.

.. confval:: due
   :name: decision-due
   :type: string

   By when, as written. Once an answer is ``:decided:``, the day it fell.

.. confval:: lead
   :name: decision-lead
   :type: string

   A sentence about the question, before the answers. Blocks before the
   first answer do the same for more than a sentence.

.. confval:: name
   :name: decision-name
   :type: string

   The address of the decision, and a target of ``:ref:``, as the
   ``:name:`` of every directive here is.

**The letters count themselves.** An answer with no ``:key:`` takes the next
letter. So an answer put in the middle renames the ones after it, and no
page changes in two places. The element is ``sds-decision`` in
:ref:`component-sds-decision`.

answer
======

One answer a decision can take, and what it means. The answer in a few
words is the argument.

.. confval:: recommended
   :name: answer-recommended
   :type: flag

   The answer the paper proposes.

.. confval:: decided
   :name: answer-decided
   :type: flag

   The answer the decision took. The block then speaks in the past at its
   foot.

.. confval:: key
   :name: answer-key
   :type: string

   The letter or number the paper cites the answer by. Without it, the
   decision counts.

slide
=====

One frame of a deck, in the text of a paper. The heading is the argument.
On the page the slide is a picture at the width of the column. A paper with
``:deck:`` plays all its slides, in their order, from the press under its
title. See :doc:`/guides-theme/configuration`.

.. example:: A slide that says one thing

   .. slide:: Every question of the concept is decided.
      :kind: statement

A figure slide holds its picture between the tags: a diagram, an image, or
markup. With a ``:caption:`` it is a figure of the paper and counts as one.
A label in front of it is the target of ``:ref:``.

.. code-block:: text

   .. _figure-needs:

   .. slide:: Needs met and open
      :kind: figure
      :lead: Nine needs are met, twenty-three are open.
      :caption: The needs, met and open.

      .. diagram::

         tiles
         title "Needs met and open"
         description "Two counts of needs."
         tile "9" "met"
         tile "23" "open"
           emphasis

.. confval:: kind
   :name: slide-kind
   :type: string
   :default: content

   ``cover``, ``section``, ``statement``, ``content``, ``figure`` or
   ``closing``. A ``section`` slide whose heading is the name of a
   ``.. part::`` lists the parts of the paper and marks its own.

.. confval:: eyebrow
   :name: slide-eyebrow
   :type: string

   The line over the heading.

.. confval:: lead
   :name: slide-lead
   :type: string

   The sentence under the heading.

.. confval:: legend
   :name: slide-legend
   :type: string

   The key of the drawing, at the right of the heading. Entries stand
   apart by `` | ``, and each is a key and its words. ``■`` is a filled
   square, ``□`` an outlined one, ``[ID]`` an id on a plate. Any other key
   is an id in mono: ``■ MVP | □ First version | ID after the MVP``.

.. confval:: note
   :name: slide-note
   :type: string

   What the speaker says. The slide does not show it.

.. confval:: layout
   :name: slide-layout
   :type: string

   The room a figure takes: ``wide``, ``full``, ``headed``, ``row`` or
   ``text-start``. ``full`` shows the picture alone. ``headed`` gives it
   the frame under a short head and a rule. ``row`` stands the
   drawings between the tags side by side, each under the ``:label:`` of
   its ``.. diagram::``.

.. confval:: ground
   :name: slide-ground
   :type: string

   The ground of the frame. ``terminal`` is the dark one a cover stands on.

.. confval:: caption
   :name: slide-caption
   :type: string

   The caption under the slide. The slide then counts as a figure.

.. confval:: page-only
   :name: slide-page-only
   :type: flag

   The slide stands in the page, and the deck does not play it. For a
   figure that reads as a slide in the text and has no place in the talk.

.. confval:: name
   :name: slide-name
   :type: string

   The address of the slide.

The element is ``sds-slide`` in :ref:`component-sds-slide`. The Markdown
twin writes the heading in bold, the lead and what the slide holds.
