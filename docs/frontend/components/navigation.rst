:navigation-title: Navigation

==========
Navigation
==========

The way around a page, a site and a list. Three of these share one base and
so one shape. An item is a **control**, not a picture of one: focusable,
pressable, and it announces ``sds-change`` when it becomes current. An item
that goes somewhere says ``href``, and the browser handles it.

.. specimen:: components/navigation/navigation.card.html
   :viewport: 700x163
   :title: Tabs & tool rail

.. _menu-entry:

One entry, for every navigation
===============================

A bar, a rail, a trail, a row of pills and the columns of a footer are the
same list at different sizes. So they get the same entry. Whoever renders
the page knows where an entry goes, what is under it and what is true of it
on this page. A component works none of that out. A second shape for the
same list is a second place to keep in step.

.. code-block:: ts

   interface MenuEntry {
     label: string;
     href?: string;
     icon?: IconId;
     external?: boolean;   // somebody else's site: it opens away
     current?: boolean;    // the page — or the item — the reader is on
     here?: boolean;       // on the way to it
     front?: boolean;      // a front door: it stands in the bar's row as well
     open?: boolean;       // a fold that starts open whatever else is true
     items?: MenuEntry[];
   }

.. confval:: items
   :name: navigation-items
   :type: "(string | MenuEntry)[]"

   What ``sds-nav-pills``, ``sds-nav-main`` and ``sds-tabs`` are lists of.
   A bare string is a label and nothing else: a set of choices with nowhere
   to go. ``sds-nav-rail`` takes one ``entry`` instead, with its pages under
   it.

.. confval:: active
   :name: navigation-active
   :type: number
   :default: 0

   Which item is current, by position, where nothing in the list says so
   itself. An entry marked ``current`` wins. A list that names its page
   states a fact, while ``active`` is a position in a set. To believe both
   at once marks two items.

   The current item is a **filled block, never a tint**. A tint reads as
   "hovered" or "disabled" by what is under it, and hover already spends a
   colour change.

   Where an item carries a marker, a section in the bar with pages under it,
   the block is the *pair*. The fill wraps the name and the marker, and so
   does the focus ring. A fill around half of a control makes the other half
   look like something that arrived with the row.

.. note::

   ``aria-current``, not ``aria-selected``, for the ones that navigate.
   Selection belongs to a tablist, and a tablist owes its panel an
   ``aria-controls``. Current within a set is what is true of a pill or a
   rail item. An entry that is only ``here``, a section the reader is inside
   without the page, gets ``aria-current="true"``, not ``page``.

.. _component-sds-nav-main:

sds-nav-main
============

The bar at the top of a page: the mark, the site's menu, and the controls at
the end of the row. It is the whole bar, not a part of one. A page addresses
it and writes no ``.sds-bar`` of its own. The element measures what a header
does as the page narrows, and a row by hand cannot fold.

.. code-block:: html

   <sds-nav-main home="/" signet="_images/signet.svg" brand="Acme" product="Your product"
     index="_search.json" .menu="${SITE}"></sds-nav-main>

   <!-- Or, for a renderer that has already resolved its own navigation and has
        no tree to hand over. -->
   <sds-nav-main product="Your product" index="_search.json">
     <a class="sds-pill is-active" href="/design-system/" aria-current="page">Design system</a>
     <a class="sds-pill" href="/frontend/">Frontend</a>
   </sds-nav-main>

**One list, drawn as far as the width permits.** The bar gets the site,
every section, its pages, and the reader's page marked wherever it sits. It
decides only how much of that it can show. The front doors stand in the
row. A section with pages carries the marker that opens them under it. A
drop for a few, a wall across the bar for more than a glance takes in.

Once the row holds nothing more, the same list stands behind one button,
because a reader on a phone presses once.

**On a phone it is one level at a time.** The drawer opens on the site's own
sections and steps *into* one. The marker beside the link is the way
through, and the row above the list names the way back. A phone is a window
onto a long list. The whole tree in one column is forty rows to scroll past
for the four that are the site.

**What no longer fits goes away, never drops.** As the row runs out of room,
the field goes first, because a field squeezed to a stub is a control nobody
can use. Then the sections after it. The drawer then opens the menu, not the
row that lost its room. The way somewhere else is what a reader opens a menu
for. The section they are in is the one answer they did not ask for.

**A panel and the drawer are the same construction.** A panel is a
``<details>`` under the row, so it folds before a script runs, and a page
with no script still opens a section. Both stand on the bar's canvas and
carry ``--shadow-flyout``. A second kind of surface is a second thing to
learn, and a shadow is how this system says a surface has left the page.

**Both mark the reader's page, without noise.** A reader reads a rail down
to find where they are, and there the current page is a filled block. A
reader opens a menu to *leave* that page, so the same block shouts the one
row nobody presses. The ink alone carries it, and ``aria-current`` says it
to whoever does not read colour.

An open drawer continues the bar's row. So it is the canvas and it spans the
page. Nothing about its own surface says it is in front, and the system has
no shadow for that. The page under it takes a wash instead, in the plane a
modal sits on. A press on that wash is a way out, beside the toggle and the
Escape key.

**The decision is a measurement, not a declaration.** A bar holds a product
name as long as the product has one, so a breakpoint is wrong on the next
site. The element measures what the sections and the field need against the
room the row has left, without the button that stands in their place.
Nothing in the measurement depends on the state, so there is no width at
which the two disagree.

**It holds its room before it draws.** The bar is the first thing on the
page, and the element is empty until its script has run. So the stylesheet
gives the host the header's height, and the page keeps ``scroll-padding-top``
from that moment. Otherwise the page lays out once without a bar and again
with one, under a reader who has started to read. It is the same
reservation ``sds-icon`` makes for a glyph.

.. confval:: home
   :name: sds-nav-main-home
   :type: string

   Where the mark goes: the way home, from anywhere on the site.

.. confval:: signet
   :name: sds-nav-main-signet
   :type: string

   The mark, as the file of its drawing. A link, like every other picture
   in this system; see :doc:`/design-system/artwork`. It is the same
   construction the footer draws, so the two ends of a site say the name one
   way.

.. confval:: brand
   :name: sds-nav-main-brand
   :type: string

.. confval:: product
   :name: sds-nav-main-product
   :type: string

   The name, in the machine's own spelling, never title case. With a
   ``brand`` beside it, the accent rule stands between the two. Alone, the
   name is the mark itself, not the quiet half of a lockup.

.. confval:: search
   :name: sds-nav-main-search
   :type: boolean

.. confval:: index
   :name: sds-nav-main-index
   :type: string

   Where the search index is, relative to the page. It asks for the field
   as well, since a site with an index has a search. ``search`` alone draws
   a field with nothing behind it, which is a specimen, not a site.

.. confval:: menu
   :name: sds-nav-main-menu
   :type: MenuEntry

   The site, as one entry with everything under it. The bar works nothing
   out from it. Whoever renders the page knows the front doors, the section
   the reader is in and the page they are on. It says so with ``front``,
   ``here`` and ``current``. The bar decides only how much fits; see
   :ref:`the contract <menu-entry>` above.

   A site whose sections hold nothing can hand a flat ``items`` instead:
   the same list without the second level.

.. confval:: label
   :name: sds-nav-main-label
   :type: string
   :default: "Menu"

   The toggle's name, for a reader who cannot see that it is a menu.

.. confval:: theme-key
   :name: sds-nav-main-theme-key
   :type: string

   Where ``sds-theme`` keeps the reader's choice, where it keeps one.

.. note::

   Links between the tags stay exactly as written: ``target``, ``rel`` and
   the current mark intact. That is the shape for a renderer with a resolved
   navigation and no tree. One with a tree gives it as ``menu`` and gets the
   panels and the drawer with it.

.. _component-sds-nav-pills:

sds-nav-pills
=============

Navigation for the sections of a page. The accent marks the active item,
one of the exactly three places ``--accent`` can appear.

.. code-block:: html

   <sds-nav-pills .items="${['Overview', 'Tools', 'Changelog']}" active="0"></sds-nav-pills>

.. _component-sds-nav-rail:

sds-nav-rail
============

The navigation rail beside a column: one entry, with its pages under it.
Items are often names the machine gave, so they set in mono, verbatim.

.. code-block:: html

   <sds-nav-rail .entry="${{ label: 'Reference', items: [
     { label: 'overview', href: '#overview', current: true },
     { label: 'tools', items: [{ label: 'search', href: '#search' }] },
   ] }}"></sds-nav-rail>

A page with pages of its own is a ``<details>``. So the fold works before a
script runs, and the one with the current page starts open, at whatever
depth that page sits. Data, not composed elements, unlike the tabs: a fold
holds links and no content of its own.

.. confval:: entry
   :name: sds-nav-rail-entry
   :type: MenuEntry
   :required: true

   What this is the list of, and the list. The entry's label is the heading
   over it, and the way to the section's own page where it has one. Empty,
   there is no heading, which is right where the rail is the whole
   navigation.

   The current row is the entry that says ``current``, never a count from
   outside. A rail has one current page wherever it sits. A caller who
   thinks in "third item of the second group" thinks about the markup.

.. _component-sds-nav-toc:

sds-nav-toc
===========

What is on this page, and where in it the reader is. The sections of the
page, as a list to jump from. It is the one navigation in the system that
finds its own current entry. A heading is current when the reader has
scrolled to it, and nothing that renders the page can know that.

.. code-block:: html

   <sds-nav-toc label="On this page" .entries="${[
     { label: 'Space scale', href: '#space-scale' },
     { label: 'Reading rhythm', href: '#reading-rhythm' },
   ]}"></sds-nav-toc>

The list has **two forms, and the markup around it chooses**. On its own it
is a block where it stands. Inside a ``.sds-aside`` inside a ``.sds-prose``,
it leaves the flow from 1296px and rests beside the column at the rail's
line. The column gives the width up. It carries two levels there, against
all six in the flow.

:doc:`/frontend/documents` has the reason and the width. Both boxes are in
``styles.css``, so a product surface can ask for either. The outline of a
long document beside its panel is another element,
:ref:`sds-nav-outline <component-sds-nav-outline>`: this one has its place
and its behaviour, and the panel does not borrow it.

.. code-block:: html

   <article class="sds-prose">
     <div class="sds-aside">
       <sds-nav-toc label="On this page" .entries="${SECTIONS}"></sds-nav-toc>
     </div>
     …
   </article>

The marked entry is **the last heading past the line a jumped-to heading
lands on**: ``scroll-padding-top``, read off the scroller. So the entry a
press marks is the entry the scroll marks. Above the first heading nothing
has the mark. A page opens there, and no section holds it.

Only the headings the list **draws** count. Beside the column it carries two
levels, and a reader at a third-level heading is still inside the section
above it. From the data instead, the list marks a row that is not there.
Every visible entry then goes blank at the depth a long page has most of.

Where the list is taller than its reserve, it **scrolls to keep the mark in
view**, by the least it can and never past that. A list that already shows
the entry does not move under a reader who scrolled it. Its own scroll
offset and nothing else. The page is what the reader moves, and a list that
went along reads itself.

A list with more rows than it shows **keeps the wheel**. Let through, a
scroll at the list's edge runs on into the page. The mark moves, and the
list jumps after it, away from where the reader put it. So the element
measures its own overflow and writes ``is-scrollable`` on the box, and the
stylesheet gives that box ``overscroll-behavior: contain``. Measured, not
declared: on a box with nothing to scroll, containment swallows the wheel
and the page stops under it.

An entry is **one line**, cut with an ellipsis where the column runs out. A
reader scans a list of places down its left edge, and an entry on a second
line is two places to that scan. So a heading is short enough to scan, and
the cut says it was not; :doc:`/design-system/writing` has that rule.

The mark is the **filled block in the accent** every current navigation
item in this system gets. The row bleeds by exactly its padding, so the
fill is the only thing that grew. The text stands where it stood, and the
entry keeps its measure, which a column beside a page has least of.

The mark **fades across** instead of an appearance, at ``--duration-fast``,
the same change a pill and the mode switch make. It matters more here.
Those move because somebody pressed them, and the press is the
announcement. This one moves under a reader who looks at the text.

.. confval:: entries
   :name: sds-nav-toc-entries
   :type: MenuEntry[]
   :required: true

   The sections, nested as deep as the page nests them. An entry that points
   at this page, an ``href`` that is a fragment, is a place the reader can
   be in. Anything else is a link and never gets the mark.

   ``current`` on an entry is what a card, a story and a server-rendered
   page have instead of a reader. The page wins the moment the element reads it.

.. confval:: label
   :name: sds-nav-toc-label
   :type: string
   :default: "On this page"

   The heading over the list, and the name of the navigation.

.. note::

   ``aria-current="location"``, not ``page``. Every entry here **is** the
   page, and the mark is the part of it the reader is at.

   Before the script, and on a page where it never runs, it is the list with
   nothing marked. That is a contents, which the page had without it.

.. _component-sds-nav-outline:

sds-nav-outline
===============

The parts of a long document, beside it. The whole tree of a document with
more places than a window is tall, in the panel that is the document's
frame. Every part and every section. It is the document's base navigation:
a reader has the whole document in reach from any part of it.

.. code-block:: html

   <aside class="sds-paper__panel">
     …
     <sds-nav-outline label="Contents" numbered .entries="${SECTIONS}"></sds-nav-outline>
     …
   </aside>

It reads the page for where the reader is, as ``sds-nav-toc`` does, by the
same line and the same rule. The marked row stays inside its own scrolling
box, by the least move that brings it there. The box keeps the wheel while
it has rows to scroll to, by the same measure. Above the first heading
nothing has the mark.

**Where the panel has no room beside the page**, under 860px, the list
folds behind one press in the page's head. The press is the glyph of a
list, the name, and the marker that says what a press will do. The list
drops under the head as a row of its own, half the window at most, and
scrolls.
A press on a row shuts it again: the reader chose a place, and the list has
done its work.

The fold is a ``<details>``, written open, so the list is there before any
script and where none runs. The script shuts it where the press draws, and
opens it again where the press does not. It asks the press rather than the
window, so the width stands in the stylesheet alone.

.. confval:: entries
   :name: sds-nav-outline-entries
   :type: MenuEntry[]
   :required: true

   The parts, nested as deep as the document nests them. An entry that
   points at this page is a place the reader can be in. ``current`` on an
   entry is what a card and a static page have instead of a reader.

.. confval:: label
   :name: sds-nav-outline-label
   :type: string
   :default: "Contents"

   The heading over the list, the name of the navigation, and the word on
   the press where the list folds.

.. confval:: numbered
   :name: sds-nav-outline-numbered
   :type: boolean
   :default: false

   Every entry carries its number, ``4`` and ``4.2``, counted from its place
   in the list the way a numbered document counts its parts. The number is
   text in the row, in the mono face and a step quieter. So it is in the
   name the row has out loud. A counter drawn by the stylesheet is not: a
   browser leaves generated content out of an accessible name.

   The headings on the page carry the same numbers as text, in an
   ``sds-section__number``; :doc:`/frontend/documents` has that half. The
   two agree as long as the list mirrors the document, which it must
   anyway.

.. _component-sds-nav-breadcrumb:

sds-nav-breadcrumb
==================

Where the page sits, as a trail.

.. code-block:: html

   <sds-nav-breadcrumb .items="${[{ label: 'Docs', href: '/' },
                          { label: 'Frontend', href: '/frontend/' },
                          { label: 'Navigation' }]}"></sds-nav-breadcrumb>

.. confval:: items
   :name: sds-nav-breadcrumb-items
   :type: "{ label, href? }[]"
   :required: true

   The last entry is the page itself and draws as text, with or without an
   ``href`` from the caller. A trail whose last step is a link is a trail
   pasted from the one above it.

.. confval:: label
   :name: sds-nav-breadcrumb-label
   :type: string
   :default: "Breadcrumb"

.. note::

   The one navigation here with **no active mark**. A reader reads the trail
   as a path, and its end is where they already are. The accent there
   leaves nothing to mark what they came to do. The separator is a
   character, not an icon: punctuation between two words, at their size.

.. _component-sds-tabs:
.. _component-sds-tab-item:

sds-tabs, sds-tab-item
======================

A switch of a panel's content, not of the page. A tab is a label and a
panel, and the pair is the whole component. Apart, the caller keeps them in
step, and the bar is a row of words.

.. code-block:: html

   <sds-tabs>
     <sds-tab-item label="The drop-in">
       <p>Copy the directory somewhere public and link two files.</p>
     </sds-tab-item>
     <sds-tab-item label="The package" icon="actions-code">
       <p>ESM with <code>lit</code> external.</p>
     </sds-tab-item>
   </sds-tabs>

.. confval:: label
   :name: sds-tabs-sds-tab-item-label
   :type: string
   :required: true

   On ``sds-tab-item``. The bar takes its labels off the panels, so a
   composed set says everything once.

.. confval:: icon
   :name: sds-tabs-sds-tab-item-icon
   :type: icon id

   For a tab whose subject has one, a file type, a tool. Never as
   decoration on a set that reads fine without.

.. confval:: active
   :name: sds-tabs-sds-tab-item-active
   :type: boolean
   :default: false

   On ``sds-tab-item``: the panel that shows. The set writes it, not a page.
   A set claims its panels the moment it exists, and a panel nothing has
   claimed shows in any case. That is what a panel is where nothing switches
   it.

.. confval:: sync
   :name: sds-tabs-sync
   :type: string

   On ``sds-tabs``. A word, and every set with the same one follows the
   choice made in any of them. For a page that states one thing in several
   places, the same setting in YAML and PHP, the same command for three
   shells. One choice is the point, and four are the annoyance.

   Sets match **by the label, not the position**. A set with YAML and
   TypoScript has no PHP, and one with none of the chosen words keeps the
   panel it shows. The choice outlives the page and is an order, not a
   word. A pick of ``bash`` where it was on offer does not stop a reader who
   prefers PHP to YAML where it was not. A set with no ``sync`` follows
   nothing, and nothing follows it.

A real tablist. Each tab names the panel it controls, and the arrow keys
move between them. Home and End go to the ends, and the focus follows the
selection. A panel that is not current **hides and does not go**, so
find-in-page reaches it and anything with state in there keeps it.

.. note::

   A panel decides for itself until a set of tabs claims it. That is what a
   panel is on a page where nothing switches it. A hide of every one there
   leaves content in the document and invisible in it.

.. _component-sds-accordion:
.. _component-sds-accordion-item:

sds-accordion, sds-accordion-item
=================================

Questions with their answers folded behind them.

.. code-block:: html

   <sds-accordion name="what-a-theme-answers">
     <sds-accordion-item question="What does it need installed?" open>
       <p>PHP 8.2 or newer, and a project it can read.</p>
     </sds-accordion-item>
     <sds-accordion-item question="Can it run in CI?" anchor="in-ci">
       <p>Yes — the workflow is one job.</p>
     </sds-accordion-item>
   </sds-accordion>

``<details>`` and ``<summary>``, like the rail's groups. The fold works
before a script runs, the keyboard reaches it, and find-in-page opens the
one it lands in. A button drawn as a summary looks the same and has none of
that.

.. confval:: entries
   :name: sds-accordion-sds-accordion-item-entries
   :type: "{ question, answer, open?, anchor? }[]"

   Where a page has the questions as data. An answer of blocks, what a
   documentation renderer hands over, goes between the tags as
   ``sds-accordion-item`` instead, and then this stays empty.

.. confval:: multiple
   :name: sds-accordion-sds-accordion-item-multiple
   :type: boolean
   :default: false

   More than one open at a time. Otherwise the platform's own exclusivity
   is on, because a list is easier to read than a wall.

.. confval:: name
   :name: sds-accordion-sds-accordion-item-name
   :type: string
   :default: "sds-accordion"

   The set's name. Two exclusive groups on one page must not close each
   other's answers. The set tells its items, so a page says it once.

.. confval:: question
   :name: sds-accordion-sds-accordion-item-question
   :type: string
   :required: true

   On ``sds-accordion-item``. The question, in the summary. The answer is
   whatever stands between the tags, because paragraphs, lists and code
   blocks are what no attribute can carry.

.. confval:: open
   :name: sds-accordion-sds-accordion-item-open
   :type: boolean
   :default: false

   On ``sds-accordion-item``. Open at the start, for the first answer on a
   page of them, so the shape of an answer shows without a press.

.. confval:: anchor
   :name: sds-accordion-sds-accordion-item-anchor
   :type: string

   On ``sds-accordion-item``. The address of this one answer. It lands on
   the **answer**, not on the question. A fragment that points *into* a
   ``<details>`` unfolds it, and one that points *at* the element leaves it
   shut. So no rule forces the fold, and nothing watches the hash.

.. note::

   For a *list* of questions. Where the folded part is the point, a log, a
   stack trace, one ``<details>`` in the document needs no component.

.. _component-sds-nav-pagination:

sds-nav-pagination
==================

Where a list continues.

.. code-block:: html

   <sds-nav-pagination count="1240" per-page="20" current="3"
     href="?q=typo3&amp;page={n}&amp;sort=date" label="entries"></sds-nav-pagination>

.. confval:: count
   :name: sds-nav-pagination-count
   :type: number
   :required: true

   How many there are in all, in the list, not on the page. The row gets
   the total and the page size and divides, so nobody hands over the same
   fact twice.

.. confval:: per-page
   :name: sds-nav-pagination-per-page
   :type: number
   :default: 10

.. confval:: current
   :name: sds-nav-pagination-current
   :type: number
   :default: 1

   One-based, as the page writes it. The current page is text, not a link.

.. confval:: href
   :name: sds-nav-pagination-href
   :type: string
   :default: "#page-{n}"

   A page's **whole** address, with ``{n}`` where its number goes. A list is
   as often at ``?q=…&page=2&sort=date`` as at the end of a path. A caller
   who can only append has to reorder the query. A template with no
   ``{n}`` counts as a prefix.

.. confval:: label
   :name: sds-nav-pagination-label
   :type: string

   What the count is of, in the label register. Without it the row ends
   with the bare number.

.. note::

   Every number is an ``href``. A page reachable only by scroll is one a
   reader cannot send to anyone. A surface that pages **in place** listens
   for ``sds-change`` and calls ``preventDefault()``: the same press, not a
   second mode.

.. _component-sds-nav-pager:

sds-nav-pager
=============

The way on from a page in a sequence: the one behind and the one ahead, and
nothing between them. Not ``sds-nav-pagination``. That numbers a set a
reader moves around inside. This is a line they walk along.

.. code-block:: html

   <sds-nav-pager previous-href="/guide/install" previous-label="Installing the server"
     next-href="/guide/skills" next-label="Writing a task skill"></sds-nav-pager>

.. confval:: previous-href
   :name: sds-nav-pager-previous-href
   :type: string

.. confval:: previous-label
   :name: sds-nav-pager-previous-label
   :type: string

   Both halves or neither. A control with a target and no name has no
   read-out, and one with a name and no target does nothing. With one
   absent, that end of the row is empty. An inert control is a control a
   reader tries.

.. confval:: next-href
   :name: sds-nav-pager-next-href
   :type: string

.. confval:: next-label
   :name: sds-nav-pager-next-label
   :type: string

.. confval:: label
   :name: sds-nav-pager-label
   :type: string
   :default: "Pages either side of this one"

   The row's name, for a reader who cannot see that it is one.

.. note::

   Four strings, not one object per side. A label and a target each fit in
   an attribute, so no caller's idea of a page reaches the component. A
   documentation renderer that walks a toctree and an application that
   reads a database fill exactly the same four.

   The glyph carries the direction, and its own accessible name is
   ``Previous page`` / ``Next page``. It joins the page title, not replaces
   it. A name over the whole control says a sentence the reader cannot see
   in place of the one they can.

.. _component-sds-search:

sds-search
==========

The search for a page in a site with no server. A rendered site is files,
so the index is a file too: a small JSON the build writes, fetched the first
time somebody types.

.. code-block:: html

   <sds-search index="/search-index.json" label="Search"></sds-search>

.. confval:: index
   :name: sds-search-index
   :type: string
   :required: true

   Where the index is. Hits resolve against the index's own address, not
   against the current page. The index lists every page as the build sees
   them, and a reader rarely stands in the root.

.. confval:: label
   :name: sds-search-label
   :type: string
   :default: "Search"

.. confval:: size
   :name: sds-search-size
   :type: "md" | "sm" | "lg"
   :default: "md"

   The height of the box, ``sds-field``'s own three. The box *is* one, so
   the field decides what a size changes. A bar with its controls at ``sm``
   runs the search at ``sm`` too, or the row has two heights.

The field is a combobox. Down goes into the list, the arrows walk it, up
from the first goes back to the typed text, and Escape gives the page back.
``sds-search-hits`` draws what the search found, not a rebuild in the drop.
A query with no match gets that element's sentence in the same box.

**The drop hangs from the end of the field**, where a bar usually puts its
search. From the start edge instead where that leaves it off the page. A
field near the start of a narrow window is the common case. A drop in the
top layer that has left the window cannot scroll back. Both routes
place it that way. ``sds-dropdown``'s panel and this one share
``src/lib/flyout.ts``, and the stylesheet does it where the engine can
anchor.

An entry in the index is ``{ title, url, text }``, and can carry ``image``:
the page's picture, named from the root like ``url`` and resolved the same
way. It becomes the hit's thumbnail.

A hit in the drop carries the same four things it carries anywhere, but the
sentence **stops at two lines** there. A drop under a field is a passage on
the way to a page. A paragraph per row is a page of text in front of the one
the reader asked for. A page of results shows the sentence whole.

.. important::

   Without JavaScript neither the element nor the field is there. A search
   box that cannot search is worse than an honest absence, and the rail
   still lists every page.

.. _component-sds-search-hits:

sds-search-hits
===============

The answer to a query: the hits, in the reader's order, and the sentence a search
with nothing to show gives. It gets the hits, and does not find them.
``sds-search`` owns the index, the field and the keys, and what it knows
about a hit ends where this starts. So a page of results and a drop under a
field draw the same list.

.. code-block:: html

   <sds-search-hits match="label" .items="${[
     { heading: 'typo3_label_lookup', href: '/tools/label-lookup',
       path: 'Documentation · Tools', snippet: 'Reads labels from the installation.' },
   ]}"></sds-search-hits>

.. confval:: items
   :name: sds-search-hits-items
   :type: "SearchResultProps[]"
   :required: true

   One entry per hit, in the reader's order. Every field ``sds-search-result``
   takes is a field here, the thumbnail among them.

.. confval:: match
   :name: sds-search-hits-match
   :type: string

   The search term. Handed to every hit, so the mark happens once and in
   one place, and named in the heading of an empty answer.

.. confval:: empty
   :name: sds-search-hits-empty
   :type: string
   :default: "what a site index holds"

   What the search read, said where the hits stand otherwise. The default names
   the titles and opening lines a site index keeps. A caller who searches
   something else says what that was. Blank leaves the heading alone.

.. note::

   An answer of nothing is an answer. It says which pages the search read
   and what of them is not in the index. So a query with no match differs
   from a search that broke.

   **The hairline between two hits is the list's**, drawn in the gap, not
   on either box. So the plane a hit takes under the pointer never meets
   it, and it stops at the words' own edge, not the plane's. A hit on its
   own carries none, and the list neither opens nor closes with one. What
   closes it is its container: the drop's own frame, or the band a page of
   results stands in.

.. _component-sds-search-result:

sds-search-result
=================

One hit in a list of them. What the search found, **where it is**, the
sentence it stands in, and what kind of thing it is. The second is what a
list of titles and snippets leaves out, and the reader opens a page to learn
it.

.. code-block:: html

   <sds-search-result heading="Publishing" href="/guides-theme/publishing"
     path="Documentation · Guides theme" kind="reference" match="publish"
     snippet="The workflow that renders the site and puts it where readers are."
   ></sds-search-result>

.. confval:: heading
   :name: sds-search-result-heading
   :type: string
   :required: true

.. confval:: href
   :name: sds-search-result-href
   :type: string
   :default: "#"

.. confval:: path
   :name: sds-search-result-path
   :type: string

   Where it is, as the site's own trail. Mono, because a path is a
   machine-named thing.

.. confval:: snippet
   :name: sds-search-result-snippet
   :type: string

   The sentence the search found it in, cut from the text, not written for
   the list.

.. confval:: match
   :name: sds-search-result-match
   :type: string

   The search term. **The mark happens here**, not in the caller. The
   highlight has to be the search term, and a page that marks by hand marks
   what it thinks it searched for. The two part at the first normalised
   query.

.. confval:: kind
   :name: sds-search-result-kind
   :type: string

   What kind of thing it is: reference, guide, changelog. Optional, like the
   path and the release on its line. Where a source reports none of the
   three, the line drops instead of an empty draw. So a list of hits has no
   hole above its titles.

.. confval:: meta
   :name: sds-search-result-meta
   :type: string

   The release it holds for, where it holds for one.

.. confval:: src
   :name: sds-search-result-src
   :type: string

   The picture the found thing carries. Beside the words and never over
   them. A hit stays a line, so a reader still reads a list of them down one
   edge. A photograph crops to the same box whatever shape the file is. A
   drawing keeps the colours of its export and fits instead of a crop.

.. confval:: alt
   :name: sds-search-result-alt
   :type: string

   Leave it empty where the picture repeats the title, which is most of the
   time. The heading beside it already names the target.

.. note::

   **The hit is the link.** It renders an ``<a>`` around the whole row, not
   a title's anchor over one. The target is a box, the text in it stays
   selectable, and the ring is the one every other focusable thing draws.
   The heading names the link. Without that, its name is everything in the
   row at once. With no ``href`` it is an ``<article>`` and goes nowhere.

.. _component-sds-footer:

sds-footer
==========

How a page ends. A **site** says where the rest of itself is, in columns
that read as sections. A **screen** with no site around it says what it is
and the way out. One shape either way. Every part of it falls away where
nothing sets it, so the second is the first with less in it.

.. code-block:: html

   <sds-footer note="A tool for TYPO3 community projects." product="soul-frontend"
     signet="/_images/signet.svg" brand="TYPO3"
     copyright="© 2026 The TYPO3 Project"
     .groups="${[{ label: 'Documentation', items: [{ label: 'Frontend', href: '/frontend/' }] }]}"
     .marks="${[{ label: 'GitHub', href: 'https://github.com/…', external: true,
                  icon: 'actions-brand-github' }]}"></sds-footer>

   <!-- A screen with no site around it: the same element, less set. -->
   <sds-footer product="soul-frontend" note="A tool for TYPO3 community projects."
     .meta="${[{ label: 'docs.typo3.org', href: 'https://docs.typo3.org', external: true }]}"
   ></sds-footer>

.. confval:: groups
   :name: sds-footer-groups
   :type: "{ label, href?, items }[]"

   The columns. They reflow by their own minimum, so no breakpoint decides
   how many fit.

   ``href`` makes the heading the page it names, where the column collects
   a section with a page of its own. That page is reachable from its column
   or from nowhere. Its name as the first entry under it is a column that
   says the same word twice. The heading keeps the label's colour, not
   the links'. At theirs it reads as the first entry of the list it names.
   A column of links that belong together, not a section, leaves it out.

.. confval:: note
   :name: sds-footer-note
   :type: string
   :required: true

   What this is. Stated, never implied, and never whose it is. A mandatory
   property, not a slot a page can forget, because a page that says nothing
   about itself leaves a reader to guess.

   It sits under the lockup, not in the line at the bottom. It is the one
   thing in a footer somebody reads instead of scans. Fine print is what a
   page uses to excuse what it says.

.. confval:: product
   :name: sds-footer-product
   :type: string

   The machine's name for it, set as the machine's. A product, a package, a
   repository, verbatim, and never title case. It is the name in the
   lockup. A reader who scrolled this far has left the bar behind, and the
   mark alone is a picture they have to know already.

.. confval:: signet
   :name: sds-footer-signet
   :type: string

   The mark, as the file of its drawing: the same file the bar carries,
   shown the same way.

.. confval:: brand
   :name: sds-footer-brand
   :type: string

   Whose product it is, where that is a second name: the first half of the
   lockup, with the accent rule between the two. Without it, the mark is
   one name, and there is nothing to separate.

.. confval:: copyright
   :name: sds-footer-copyright
   :type: string

   Whose it is and from when. A separate line from the note, because it is
   a separate claim.

.. confval:: version
   :name: sds-footer-version
   :type: string

   What the reader reads, where the site has a version. It stands in the
   closing line, in mono like everything the machine names.

.. confval:: meta
   :name: sds-footer-meta
   :type: "FooterLink[]"

   What has to travel with it: a licence, a legal page, the manual behind
   it.

.. confval:: marks
   :name: sds-footer-marks
   :type: "FooterLink[]"

   Where else it lives: a repository, a chat, a feed. At the far end of the
   line. They are the one thing in a footer a reader looks for by position,
   not by a read.

   Drawn as the marks they are: the glyph at 24, no word beside it and no
   external glyph after it. The label is the link's name, on the element
   for whoever cannot see it. This is the one place a brand glyph stands
   alone. In a column the same link has its label, because a reader reads
   it there. An entry with no mark in the set keeps its label, so an
   account is never a link nobody can name.

.. note::

   A footer is a directory, and **not** a place for the accent. Its links
   carry the page's own secondary ink. The other shape is ``sds-nav-pager``:
   one row with the way out of this page, which is all a single screen owes
   its reader. See :doc:`/frontend/layout`.

.. seealso::

   :doc:`/frontend/layout` for where a rail, a bar and a footer stand on the
   page, and :doc:`/guides-theme/configuration` for the navigation a
   rendered site builds all of this from.
