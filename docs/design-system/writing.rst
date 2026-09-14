:navigation-title: Writing

========
Writing
========

The system has a voice as deliberately as it has a type scale. A page sounds
like the software that explains what it knows: direct, bounded and short.

Two rules bind every text in this tree. The first is ASD-STE100, Simplified
Technical English. The second is the terse rule: say it once, and cut what the
reader already has. ``make verify ARGS=prose`` measures what a machine can
measure. Review holds the rest.

The standard
============

ASD-STE100 is a controlled language for technical documents. The standard is
free to get from ASD, and its dictionary is the authority for every word this
page does not name. The rules below are the ones this tree holds a text to.

.. list-table::
   :header-rows: 1

   * - Rule
     - Limit
   * - A sentence in a paragraph
     - 25 words
   * - A sentence in an instruction: a list item, a table cell, a step
     - 20 words
   * - A paragraph
     - 6 sentences, one topic
   * - An instruction
     - One action, in the imperative. A condition stands before it: "If the
       gate is red, read the row."
   * - Voice
     - Active. The subject does the work: "The renderer writes the markup."
   * - Tense
     - Simple present. Simple past only for a thing that happened once.
   * - Verb forms
     - No -ing verb forms: "when the gate runs", not ``when running the
       gate``. A noun that ends in -ing is a name and stays.
   * - Necessity
     - ``must`` for a rule, ``can`` for an ability, ``will`` for a future fact.
       Not ``shall``, ``should``, ``may``, ``might``, ``could`` or ``would``.
   * - Words
     - One meaning per word, and the approved word: "make sure", not
       ``ensure``; "before", not ``prior to``; "use", not ``utilize``.
   * - Noun clusters
     - Three nouns at most in a row. Cut a longer cluster with "of" or a
       hyphen.
   * - Articles
     - Every noun that takes one gets one. Do not cut "the" to save a word.

A technical name stays as its source spells it, in mono, and counts as one
word: ``sds-code``, ``make verify``, ``--space-4``.

The terse rule
==============

The standard limits the sentence. The terse rule limits what the page says.

- Say a rule once, and link to it from everywhere else.
- Cut what the line below already shows.
- Cut the story: what it used to be, who asked, when it broke.
- Cut the second example. One example shows the shape.
- Cut the aside. A sentence that starts with "Note that" is one to delete.
- Keep the reason. A rule without its reason is a preference.

What the check measures
=======================

``scripts/prose.ts`` reads every document, every comment in a source file and
every sentence a component or a task prints. It finds:

- a sentence over its limit, and a paragraph over six sentences;
- the passive voice, ``is written`` and ``was given``;
- an -ing verb form after a preposition or an auxiliary, ``by running``;
- a modal verb the standard does not approve;
- a word this tree replaced, with the approved word to write instead.

The list of replaced words is ``WORDS_REPLACED`` in the same file. A word the
dictionary does not approve goes on that list the day review finds it. A noun
that ends in -ing goes on ``ING_NOUNS`` if it is a name.

The software is the subject
===========================

Make the software, the command or the document the subject: "The renderer
writes the markup before the browser opens it." Then the sentence stays true
outside the page it stands on.

Do not write ``we``. It can mean the maintainers, TYPO3, a consumer or the
reader. Write ``you`` only for an action on the reader's own machine: "Open
the rendered page."

Precision before promotion
==========================

A claim names the boundary that makes it true: the source, the versions, the
prerequisite, the part it leaves out. A limitation stands beside the claim it
limits, not in a footnote.

.. list-table::
   :header-rows: 1

   * - Write
     - Avoid
     - Why
   * - "The renderer reads reStructuredText and Markdown."
     - "We support all common formats."
     - names the actor and the boundary
   * - "The search reads the generated site index."
     - "Powerful, seamless search."
     - states the mechanism
   * - "No page matched this address."
     - "Something went wrong."
     - gives the boundary
   * - "Run ``make verify`` before a commit."
     - "Run the usual checks."
     - names an action a reader can repeat

A heading names a subject
=========================

A heading is a noun phrase that names what stands under it, or an instruction
if the section is one: "Install it". It is not a question and not a clause
about ``it``. A column of "What it returns", "What it leaves out" differs only
in its last words, and a scan does not reach them.

.. list-table::
   :header-rows: 1

   * - Write
     - Avoid
   * - "The fallback"
     - "What the fallback is"
   * - "Its limits"
     - "What it does not do"
   * - "Making a specimen"
     - ``How a specimen gets made``

The question a heading hid belongs in the first sentence under it. A heading
over a table, a list of facts or a log is one word if it can be: **Overview**,
**Commits**, **Access**. A block of data needs no paragraph over it. The reason
for its shape belongs in this documentation.

A manual heading fits on one line of the 210px local contents. Keep it to a
noun phrase or one short clause.

Names stay as written
=====================

Headings use sentence case. A tool name, a package name, a path, a key and a
command keep the spelling of their source, in mono: ``@typo3/soul-frontend``,
``data-theme``, ``make verify``. Do not title-case, translate or prettify a
machine-named string.

Every text in the tree is English, whatever language the conversation uses.
One vocabulary keeps search terms, examples and reviews on the same thing.

Values and inventories
======================

A value the design depends on is the rule. Write it exactly: 16px is the icon
floor, 140ms is a transition. "Small" and "quick" hide the constraint.

A count is different. Do not write how many elements, cards, checks or icons
there are. Name the thing and the source that lists it. A count is correct
until the next item lands; the directory stays correct.

No emoji
========

An emoji is a platform's drawing with a platform's meaning. Status is a named
icon and text, or the mono check where that glyph is part of machine output.
See :doc:`icons` and :doc:`accessibility`.
