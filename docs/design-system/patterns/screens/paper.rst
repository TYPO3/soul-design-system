:navigation-title: Paper

=====
Paper
=====

A document, not a page of a site. No bar and no footer, because nothing on
it leads anywhere else. Its frame is ``sds-paper``, and its contents stand in
the panel beside it.

A review
========

The document a reviewer hands back. It is a document and not a page of a
site: no bar and no rail, because nothing on it leads anywhere else. Its head
is its own: what kind of review, the title, and the facts of the change in an
``sds-facts`` list.

The summary stands first, because that is what the author came for. It is
an ``sds-surface``: what the change does, and the recommendation with a link
to each finding it rests on. Under it four statements, one per weight, each
a sentence on a plain surface. Then the context, the mechanism, the error,
and the change as ``sds-diff`` with its paths traced in a table.

The findings are one ``sds-register`` with an ``sds-entry`` per finding,
``F`` before a finding and ``T`` before the thing to do. The register numbers
them and groups them by weight: what blocks, what goes back, what is worth
a change, and what the review found sound. It opens with every one of them
in a table, each row a jump to its entry. The work they ask for stands in a
second.

The remarks stand under the code they cite, in ``sds-code``. Then the
evidence: the probes on parent and change, the suites, the test coverage.
Then the scope: what the review raised and dropped, the follow-ups, the
surfaces it ran. The long parts fold into the appendix.

Five parts, and the outline nests the way they do.

Its frame is the one a concept paper has: ``sds-paper``, with the panel
beside the document. The head says what the reader has open, the
``sds-nav-outline`` says where they are in it, and the foot says what the
review came to. A review's parts carry no numbers: a reader cites a
finding, ``F1.2``, and the register numbers those.

This is also the page an agent starts from for a report it publishes as one
file. ``SKILL.md`` carries that recipe.

.. specimen:: screens/review.html
   :viewport: 1440x900
   :title: Review

A concept paper
===============

The document that asks for a decision. What the thing is, where it stands,
what the evidence says, what the paper proposes, what that costs, and the
question at the end. A document on its own, like the review, and in the
same frame: no bar, no footer, nothing that leads anywhere else.

It is long, and that is what it exists to show. A review has five parts. A
concept has nine here and twenty in practice, with sections under most of
them. A list of sixty places is longer than any window.

So the document stands in ``sds-paper``, beside a panel that is its whole
frame. The panel holds the head, the contents and the state of the draft.
It stands the height of the window, and scrolls on its own.

The contents is ``sds-nav-outline`` with ``numbered``: the whole tree,
every part with its number, and the mark on the part the reader is in. It
is the document's base navigation, and an element of its own; the contents
beside a column, ``sds-nav-toc``, keeps its place and its behaviour. Under
860px the panel is the page's head, and the outline folds behind one press
in it.

The heading carries the number too, ``4`` on a part and ``4.2`` on a
section in it, as text in an ``sds-section__number``. So a reader can write
"see 4.2" and a screen reader says it. A counter drawn by the stylesheet
does not reach the name a heading has out loud.

The author as ``sds-byline`` under the lead. Two screenshots of pages as
they stand, each in ``sds-figure``, with the claim under it and ``zoomable``
for the detail. After each, a table of what the page says and what the
reader asks. The evidence as tables of questions and of tasks, and the
sentences readers said as ``sds-quote``. The findings as ``sds-register``
with groups of the paper's own: a gap, a cost, and what works as it stands.

The proposal with one drawing under the diagram rule. The file it adds in
an ``sds-tree`` of the cache, and the terminal in two ``sds-tabs``. The one
setting as ``sds-confval``, the sentence the note grows as ``sds-diff``.
The options as three ``sds-card`` in a grid, then side by side in a table
whose cells are verdicts.

The cost as work packages, the order as ``sds-steps``, the dates as
``sds-timeline``, the risks as notes. The decision as ``sds-decision``, the
one block the reader came for, with an ``sds-answer`` per answer. The
sources as ``sds-link``, and the long parts in the appendix.

The readers and the numbers are fiction; the screenshots are this system's
own status pages.

.. specimen:: screens/concept.html
   :viewport: 1440x900
   :title: Concept
