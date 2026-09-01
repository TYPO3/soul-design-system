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

A heading names a subject, it does not ask
=========================================

Written as a question, every heading turns its page into a list of FAQ entries.
A reader scanning down a column of "What it returns", "What it leaves out",
"What a result carries" can tell them apart only by reading each to the end —
and the words doing the telling are the last two, which is where a scan does
not reach.

So a heading is a **noun phrase naming what is under it**, or an instruction
where the section is one: "Install it", "Check what you got". What it is not is
an interrogative — ``What``, ``Why``, ``How``, ``Whether``, ``Where``, ``When``
— or a clause about ``it``.

.. list-table::
   :header-rows: 1

   * - Write
     - Avoid
   * - "The fallback"
     - "What the fallback is"
   * - "Its limits"
     - "What it does not do"
   * - "Inside a result"
     - "What a result carries"
   * - "Behind a rule"
     - "Where a rule comes from"
   * - "Making a specimen"
     - "How a specimen gets made"
   * - "The starting point"
     - "Whether this is you"

The question a heading was hiding usually belongs in the first sentence under
it, where it can be answered instead of posed. A page whose headings really are
questions is a list of questions — and it says so, like the FAQ page does.

Over data, shorter still
------------------------

A heading standing over a table, a list of facts, a set of figures or a log is
scanned rather than read: **Overview**, **Commits**, **History**, **Access**. A
reader arrives at whichever block they came for, has to recognise it, and
arrives at it again tomorrow.

**A block of data usually needs no description at all.** A paragraph saying why
a table is arranged the way it is belongs in this documentation, where it is
read once on purpose — above the table it is passed over on every visit, and it
pushes the data it explains below the fold.

The same goes for a mark nobody asked for. A badge on a detail page saying
``serving`` where nothing but serving things are shown is a word a reader stops
on once, works out, and never needs again. A state worth drawing is one that
varies, and it gets a name over it in the overview like every other fact.

Names stay as written
=====================

Headings use sentence case. Tool names, package names, paths, configuration
keys and commands keep the spelling their source gives them and are set in
mono: ``@typo3/soul-frontend``, ``data-theme`` and ``make verify``. Never title
case, translate or prettify a machine-named string.

A manual heading must also scan on one line in the 210px local contents, which
gives every entry one line and ends what does not fit in an ellipsis. Keep it
to a noun phrase or one short clause. A second clause belongs in the opening
sentence below it; ``text-wrap: balance`` can shape a concise heading, but it
cannot make a long one easier to scan.

The repository, shipped strings and published documentation are written in
English, whatever language the conversation around them uses. One shared
vocabulary keeps search terms, examples and reviews referring to the same
thing; a second language in the tree divides that vocabulary.

Values and inventories
======================

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
