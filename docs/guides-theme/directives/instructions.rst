:navigation-title: Instructions

==========================
Instructions and questions
==========================

Work with an order, and answers behind a fold.

.. _directive-steps:

steps
=====

An instruction read from the top, numbered down one rail.

.. example:: Three stops, one of them skippable

   .. steps::

      .. step:: Require the package

         It brings the renderer, the highlighter and the Markdown parser with
         it, so this one line is all four.

      .. step:: Select the theme

         ``theme="soul"`` in ``guides.xml`` names it, and the ``<extension>``
         element is what makes it exist — see :doc:`/guides-theme/installation`.

      .. step:: Draw the signet
         :optional:

         A project with no mark takes its title in the bar, which is where a
         name belongs when there is only one.

**No option numbers a stop, and there is none to add.** The number is the
set's own count. So a step in the middle renumbers everything under it, and
no page changes in two places. That is the whole reason to write a set, not
four paragraphs with a typed figure each. For the same reason nothing here
says how far along a reader is. A rendered page does not know, and a manual
that guessed is wrong for every reader but one.

Use it where the order is the point. Things to do in any order are a bullet
list. A numbered list from ``#.`` is the right shape for steps of one line
each. This one is for stops with a command, a file to edit and the output
that says it worked. The element is ``sds-steps`` in
:doc:`/frontend/components/content`.

.. _directive-step:

step
====

One stop of an instruction, and the blocks that do it.

.. example:: One stop, with the work under it

   .. steps::

      .. step:: Render the site
         :name: render-the-site

         The first command writes documents; the second turns them into a site.

         .. code-block:: bash

            vendor/bin/guides docs --output=site -c docs --fail-on-error

It stands inside a ``steps``, and that is not a formality. A stop draws a
number, and a number is a place in a set. A step anywhere else is the
blocks it holds, the way a ``half`` outside a ``split`` is the column it
was going to be.

.. confval:: optional
   :type: flag

   A stop a reader can skip. The disc stays unfilled, and the word stands
   beside the title. An unfilled ring says nothing to a reader who cannot
   see it, so the drawing is never the whole claim.

.. confval:: name
   :name: step-name
   :type: string

   The address of this one stop, for a page that links to it, as ``:name:``
   means everywhere else. It lands on the stop itself, and nothing has to
   open first. A step has no fold, which is the one thing that made
   ``accordion-item`` put its address on the answer instead.

**The title is the argument, and the work follows it**, for the reason a
question and its answer stand that way. A command, a file to edit and the
line that says it worked are what no attribute carries. The title takes no
heading level either. The number says where a reader is in an instruction,
and a page whose outline is its steps has buried its own sections.

.. _directive-accordion:

accordion
=========

Questions with their answers folded behind them, in the spelling a TYPO3
manual already uses.

.. example:: A set of two, one of them open

   .. accordion::
      :group: what-a-theme-answers

      .. accordion-item:: What does it need installed?
         :open:

         PHP 8.2 or newer, and a project it can read —
         see :doc:`/guides-theme/installation`.

      .. accordion-item:: Can it run in CI?

         Yes. :doc:`/guides-theme/publishing` is the job, command for command.

.. confval:: group
   :name: accordion-group
   :type: string

   The set's name. It is the group the answers fold in, so one open closes
   the last. A page with two sets gives them different names, or one closes
   the other's answers. A set with none gets one.

   It is ``:group:`` and not ``:name:`` because an answer takes ``:name:``
   in the meaning every other directive gives it: the address of a link.
   One spelling for both is two meanings a page apart.

.. confval:: multiple
   :type: flag

   More than one answer open at a time, for a set whose answers a reader
   compares. Without it a set is exclusive, because a list is easier to read
   than a wall.

**The fold is a** ``<details>``. It works before a script runs, the keyboard
reaches it, find-in-page opens the answer it lands in, and the platform
closes the others. That is why the answers carry the set's name, and why a
page never writes one on an item. The element is ``sds-accordion`` in
:doc:`/frontend/components/navigation`.

.. _directive-accordion-item:

accordion-item
==============

One question, and the blocks folded behind it.

.. example:: One question on its own, standing open

   .. accordion-item:: What does it need installed?
      :open:

      PHP 8.2 or newer, and a project it can read.
      No daemon, and no database of its own.

.. confval:: open
   :type: flag

   Open at the start. For the first answer on a page of them, usually, so
   the shape of an answer shows without a press. ``:show:`` is the same flag
   under the name the Bootstrap theme gave it.

.. confval:: header-level
   :name: accordion-item-header-level
   :type: integer

   Accepted and dropped. A control folds a set of questions, not a heading,
   so it takes no level in the outline.

.. confval:: name
   :name: accordion-item-name
   :type: string

   The address of this one answer, for a page that links to it. It stands
   on the answer, not on the question. The platform opens a fold whose
   content a fragment points into. One a fragment points at stays shut,
   which is why a link that has to show the answer aims inside it. The
   reader still arrives at the question. The answer keeps the head's height
   as scroll margin, so the row stands at the line and not behind the bar.

**The question is the argument, and the answer follows it.** That is not a
preference. An answer is paragraphs, lists and code blocks, which no
attribute carries. The node is ``sds-accordion-item`` itself, and the
template writes none of its markup, the same arrangement as the cards
above.
