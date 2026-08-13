:navigation-title: Writing

========
Writing
========

The system has a voice as deliberately as it has a type scale. A page should
sound like the software explaining what it knows: direct, bounded and free of
the promotional language that makes a precise limitation hard to find.

The software is the subject
===========================

Write in the present tense and usually make the software, command or document
the subject: "The renderer writes the markup before the browser opens it."
This names who does the work and keeps the sentence true outside the page on
which it appears.

Avoid ``we``. It can mean the maintainers, TYPO3, a consuming project or the
reader and leaves ownership to be guessed. Use ``you`` only when the reader is
acting on their own machine; instructions may say "Open the rendered page",
while a product claim should state what the product does.

Precision before promotion
==========================

A claim names the boundary that makes it true: the source consulted, the
versions covered, the prerequisite assumed or the part deliberately left out.
A limitation belongs beside the claim it limits, not in a footnote after the
reader has already acted on it.

Long sentences are allowed when their clauses depend on one another. Split
independent facts, but do not replace the connection between cause and effect
with a row of short slogans.

.. list-table::
   :header-rows: 1

   * - Write
     - Avoid
     - Why
   * - "The renderer reads reStructuredText and Markdown."
     - "We support all common formats."
     - names the actor and the actual boundary
   * - "The search reads the generated site index."
     - "Powerful, seamless search."
     - states the mechanism instead of praising it
   * - "No page matched this address."
     - "Something went wrong."
     - gives the boundary instead of hiding it behind a mood
   * - "Run ``make verify`` before committing."
     - "Run the usual checks."
     - names the action a reader can reproduce

Names stay as written
=====================

Headings use sentence case. Tool names, package names, paths, configuration
keys and commands keep the spelling their source gives them and are set in
mono: ``@typo3/soul-frontend``, ``data-theme`` and ``make verify``. Never title
case, translate or prettify a machine-named string.

The repository, shipped strings and published documentation are written in
English, whatever language the conversation around them uses. One shared
vocabulary keeps search terms, examples and reviews referring to the same
thing; a second language in the tree divides that vocabulary.

Values are concrete; inventories are linked
============================================

A value the design depends on is the rule and is written exactly: 16px is an
icon floor and 140ms is an interaction duration. "Small" or "quick" would
hide the constraint a consumer has to reproduce.

An inventory count is different. Do not copy the current number of elements,
cards, checks or icons into prose; name the thing and point to the source that
lists it. The count is correct only until the next item lands, while the
directory, task help or component index remains the authority.

No emoji
========

Emoji bring a platform-specific drawing and meaning into a vocabulary the
system otherwise controls. Status uses a named icon plus text, or the mono
check where that glyph is already part of machine output. See :doc:`icons` and
:doc:`accessibility` for the visual and accessible halves of that rule.
