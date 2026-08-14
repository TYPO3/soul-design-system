:navigation-title: Navigation

==========
Navigation
==========

Getting around a page, a site and a list. Three of these share one base and
therefore one shape: an item is a **control**, not a picture of one —
focusable, pressable, and announcing ``sds-change`` when it becomes current. An
item that goes somewhere says ``href`` and is left to the browser.

.. specimen:: components/navigation/navigation.card.html
   :viewport: 700x157
   :title: Tabs & tool rail

.. _menu-entry:

One entry, for every navigation
===============================

A bar, a rail, a trail, a row of pills and the columns of a footer are the same
list read at different sizes, so they are given the same entry. Whoever renders
the page knows where an entry goes, what is under it and what is true of it on
this page; a component works none of that out, and a second shape for the same
list is a second place to keep in step.

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

   What ``sds-nav-pills``, ``sds-nav-main`` and ``sds-tabs`` are lists of. A bare
   string is a label and nothing else — what a set of choices is, where there is
   nowhere to go. ``sds-nav-rail`` takes one ``entry`` instead, its pages being what
   is under it.

.. confval:: active
   :name: navigation-active
   :type: number
   :default: 0

   Which item is current, by position, where nothing in the list says so
   itself. An entry marked ``current`` wins: a list naming the page it is on is
   stating a fact, while ``active`` is a position in a set, and believing both
   at once is how two items come out marked.

   The current item is a **filled block, never a tint**: a tint reads as
   "hovered" or "disabled" depending on what is under it, and this system
   already spends hover on a colour change.

   Where an item carries a marker — a section in the bar with pages under it —
   the block is the *pair*: the fill wraps the name and the marker, and so does
   the focus ring. A fill around half of a control is what makes the other half
   look like something that arrived with the row.

.. note::

   ``aria-current``, not ``aria-selected``, for the ones that navigate:
   selection belongs to a tablist, and a tablist owes its panel an
   ``aria-controls``. Current-within-a-set is what is true of a pill or a rail
   item. An entry that is only ``here`` — a section the reader is inside
   without being the page they are reading — is marked ``aria-current="true"``
   rather than ``page``.

.. _component-sds-nav-main:

sds-nav-main
==========

The bar at the top of a page: the mark, the site's menu, and the controls at
the end of the row. It is the whole bar and not a part of one — a page
addresses it and writes no ``.sds-bar`` of its own, because what a header does
as the page narrows is measured, and a row written by hand cannot fold.

.. code-block:: html

   <sds-nav-main home="/" signet="_images/signet.svg" brand="Acme" product="Your product"
     index="_search.json" .menu="${SITE}"></sds-nav-main>

   <!-- Or, for a renderer that has already resolved its own navigation and has
        no tree to hand over. -->
   <sds-nav-main product="Your product" index="_search.json">
     <a class="sds-pill is-active" href="/design-system/" aria-current="page">Design system</a>
     <a class="sds-pill" href="/frontend/">Frontend</a>
   </sds-nav-main>

**One list, drawn as much of as the width allows.** The bar is handed the site
— every section, its pages, and the page the reader is on marked wherever it
sits — and decides only how much of that it can show. The front doors stand in
the row; a section that holds pages carries the marker that opens them under
it, as a drop where they are a handful and as a wall across the bar where they
are more than a reader takes in at a glance; and once the row can hold nothing
more, the same list is behind one button, because a reader on a phone looking
for the way somewhere presses once.

**On a phone it is one level at a time.** The drawer opens on the site's own
sections and steps *into* one — the marker beside the link is the way through,
and the row above the list names what it goes back to. A phone is a window onto
a long list, and the whole tree unfolded into one column is forty rows to
scroll past to reach the four that are the site.

**What no longer fits is put away, never dropped.** As the row runs out of room
the field goes first — a field squeezed to a stub is a control that is there
and cannot be used — and the sections after it. What the drawer then opens is
the menu and not the row it could not hold: the way somewhere else is what a
reader opens a menu for, and the section they are already in is the one answer
they did not ask for.

**A panel and the drawer are the same construction.** A panel is a
``<details>`` under the row, so it folds before any script runs and a page
whose script never arrives still opens a section; both stand on the canvas the
bar is drawn on and carry ``--shadow-flyout``, because a second kind of surface
is a second thing to learn, and a shadow is how this system says a surface has
left the page.

**The page a reader is on is marked quietly in both.** A rail is a column read
down to find where you are, and there the current page is a filled block; a
menu is opened to *leave* that page, so the same block would shout the one row
nobody is going to press. The ink alone carries it, and ``aria-current`` says
it outright to whoever is not reading colour.

An open drawer is the bar's row continued, so it is the canvas and it spans the
page — nothing about its own surface says it is in front, and the system has no
shadow to say it with. The page under it is washed instead, in the plane a
modal sits on, and pressing that wash is a way back out alongside the toggle
and the escape key.

**The decision is measured, not declared.** A bar holds a product name for as
long as the product is called, so a breakpoint would be wrong on the next site:
the element measures what the sections and the field need against the room the
row has left, with the button that appears in their place taken out of the sum.
Nothing in the measurement depends on which state it is in, so there is no
width at which the two disagree and it oscillates.

.. confval:: home
   :name: sds-nav-main-home
   :type: string

   Where the mark goes: the way home, from anywhere on the site.

.. confval:: signet
   :name: sds-nav-main-signet
   :type: string

   The mark, as the file it is drawn in. It is linked like every other picture
   in this system — see :doc:`/design-system/artwork` — and it is the same
   construction the footer draws, so the two ends of a site cannot say the name
   two ways.

.. confval:: brand
   :name: sds-nav-main-brand
   :type: string

.. confval:: product
   :name: sds-nav-main-product
   :type: string

   The name, in the machine's own spelling and never title-cased. With a
   ``brand`` beside it the accent rule is drawn between the two; alone, the
   name is the mark itself rather than the quiet half of a lockup with nothing
   next to it.

.. confval:: search
   :name: sds-nav-main-search
   :type: boolean

.. confval:: index
   :name: sds-nav-main-index
   :type: string

   Where the search index is, relative to the page; setting it asks for the
   field as well, a site with an index having a search. ``search`` alone draws
   a field with nothing behind it, which is a specimen rather than a site.

.. confval:: menu
   :name: sds-nav-main-menu
   :type: MenuEntry

   The site, as one entry with everything under it. The bar works nothing out
   from it: whoever renders the page knows which entries are its front doors,
   which one the reader is inside and which page they are on, and says so with
   ``front``, ``here`` and ``current``. What the bar decides is only how much
   of it fits — see :ref:`the contract <menu-entry>` above.

   A site whose sections hold nothing may hand a flat ``items`` instead, which
   is the same list with the second level left out.

.. confval:: label
   :name: sds-nav-main-label
   :type: string
   :default: "Menu"

   What the toggle is called, for a reader who cannot see it is a menu.

.. confval:: theme-key
   :name: sds-nav-main-theme-key
   :type: string

   Where ``sds-theme`` keeps the reader's choice, where it keeps one.

.. note::

   Links written between the tags are kept exactly as written — ``target``,
   ``rel`` and the current mark intact. It is the shape for a renderer that
   has resolved its navigation and has no tree to hand over; one that has a
   tree gives it as ``menu`` and gets the panels and the drawer with it.

.. _component-sds-nav-pills:

sds-nav-pills
=========

Navigation for the sections of a page. The accent marks the active item — one
of the exactly three places ``--accent`` may appear at all.

.. code-block:: html

   <sds-nav-pills .items="${['Overview', 'Tools', 'Changelog']}" active="0"></sds-nav-pills>

.. _component-sds-nav-rail:

sds-nav-rail
========

The navigation rail beside a column: one entry, with its pages under it. Items
are often things the machine named, so they set in mono, verbatim.

.. code-block:: html

   <sds-nav-rail .entry="${{ label: 'Reference', items: [
     { label: 'overview', href: '#overview', current: true },
     { label: 'tools', items: [{ label: 'search', href: '#search' }] },
   ] }}"></sds-nav-rail>

A page that holds pages of its own is a ``<details>``, so the fold works before
any script runs and the one holding the current page starts open — at whatever
depth that page sits. Data rather than composed elements, unlike the tabs: what
a fold holds is links and no content of its own.

.. confval:: entry
   :name: sds-nav-rail-entry
   :type: MenuEntry
   :required: true

   What this is the list of, and the list. The entry's label is the heading
   over it, and the way to the section's own page where it has one; left empty
   there is no heading, which is right where the rail is the whole navigation
   there is.

   Which row is current is the entry that says ``current``, never a count from
   the outside: a rail has one current page wherever it sits, and a caller
   thinking in "third item of the second group" is thinking about the markup.

.. _component-sds-nav-toc:

sds-nav-toc
========

What is on this page, and where in it the reader is. The sections of the page
being read, as a list to jump from — and the one navigation in the system that
finds its own current entry, because a heading is current when the reader has
scrolled to it and nothing rendering the page can know that.

.. code-block:: html

   <sds-nav-toc label="On this page" .entries="${[
     { label: 'Space scale', href: '#space-scale' },
     { label: 'Reading rhythm', href: '#reading-rhythm' },
   ]}"></sds-nav-toc>

The entry marked is the **last heading to have passed the line the browser
lands a jumped-to heading on** — ``scroll-padding-top``, read off the scroller,
so the entry a press marks is the entry the scroll marks. Above the first
heading nothing is marked: a page opens there and no section holds it.

The mark is the **filled block in the accent** every current navigation item in
this system gets. A step of ink was the first answer and it was one step in
dark and half of one in light — a mark on a list this quiet has to read the
same in both. The row bleeds by exactly what it is padded with, so the fill is
the only thing that grew: the text stands where it stood and the entry keeps
its measure, which is what a column beside a page has least of.

The mark **fades across** rather than appearing, at ``--duration-fast`` — the
same change a pill and the mode switch make. It is worth more here: those move
because somebody pressed them, and the press is the announcement, while this
one moves under a reader who is looking at the text.

.. confval:: entries
   :name: sds-nav-toc-entries
   :type: MenuEntry[]
   :required: true

   The sections, nested as deep as the page nests them. An entry pointing at
   this page — an ``href`` that is a fragment — is a place the reader can be
   in; anything else is a link and is never marked.

   ``current`` on an entry is what a card, a story and a server-rendered page
   have instead of a reader. The page wins the moment it has been read.

.. confval:: label
   :name: sds-nav-toc-label
   :type: string
   :default: "On this page"

   The heading over the list, and what the navigation is called.

.. note::

   ``aria-current="location"``, not ``page``: every entry here **is** the page,
   and what is marked is the part of it the reader is at.

   Before the script, and on a page where it never runs, it is the list with
   nothing marked — which is a contents, and what the page had without it.

.. _component-sds-nav-breadcrumb:

sds-nav-breadcrumb
==========

Where the page sits, as a trail.

.. code-block:: html

   <sds-nav-breadcrumb .items="${[{ label: 'Docs', href: '/' },
                          { label: 'Frontend', href: '/frontend/' },
                          { label: 'Navigation' }]}"></sds-nav-breadcrumb>

.. confval:: items
   :name: sds-nav-breadcrumb-items
   :type: "{ label, href? }[]"
   :required: true

   The last entry is the page itself and is drawn as text whether or not a
   caller gave it an ``href`` — a trail whose last step is a link is a trail
   that was pasted from the one above it.

.. confval:: label
   :name: sds-nav-breadcrumb-label
   :type: string
   :default: "Breadcrumb"

.. note::

   The one navigation here with **no active mark**. The trail is read as a path
   and its end is where the reader already is, so spending the accent there
   would leave nothing to mark what they came to do. The separator is a
   character rather than an icon: punctuation between two words, at their size.

.. _component-sds-tabs:
.. _component-sds-tab-item:

sds-tabs, sds-tab-item
======================

Switching the content of a panel rather than the page. A tab is a label and a
panel, and the pair is the whole component — written apart, keeping them in
step is the caller's problem and the bar is a row of words.

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

   On ``sds-tab-item``. The bar takes its labels off the panels, so a composed
   set says everything once.

.. confval:: icon
   :name: sds-tabs-sds-tab-item-icon
   :type: icon id

   For a tab whose subject has one — a file type, a tool — never as decoration
   on a set that reads fine without.

.. confval:: active
   :name: sds-tabs-sds-tab-item-active
   :type: boolean
   :default: false

   On ``sds-tab-item``: the panel that is showing. The set writes it, not a
   page — a set claims its panels the moment it exists, and a panel nothing has
   claimed shows regardless, which is what a panel is where nothing switches
   it.

.. confval:: sync
   :name: sds-tabs-sync
   :type: string

   On ``sds-tabs``. A word, and every set carrying the same one follows the
   choice made in any of them. For a page stating one thing in several places —
   the same setting in YAML and PHP, the same command for three shells — where
   choosing it once is the point and choosing it four times is the annoyance.

   Sets are matched **by the label, not the position**: a set offering YAML and
   TypoScript has no PHP, and one that has none of the chosen words keeps the
   panel it is showing rather than falling back to its first. The choice
   outlives the page and is an order rather than a word — picking ``bash`` where
   it was offered does not stop a reader preferring PHP to YAML where it was
   not. A set writing no ``sync`` follows nothing and is followed by nothing.

A real tablist: each tab names the panel it controls, the arrow keys move
between them, Home and End go to the ends, and the focus follows the selection.
Panels that are not current are **hidden rather than unrendered**, so
find-in-page reaches them and anything with state in there keeps it.

.. note::

   A panel decides for itself until a set of tabs claims it. That is what a
   panel is on a page where nothing switches it — and hiding every one there
   would leave content in the document and invisible in it.

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

``<details>`` and ``<summary>``, like the rail's groups: the fold works before
any script runs, the keyboard reaches it, and find-in-page opens the one it
lands in. A button drawn to look like a summary looks identical and has none of
that.

.. confval:: entries
   :name: sds-accordion-sds-accordion-item-entries
   :type: "{ question, answer, open?, anchor? }[]"

   Where a page has the questions as data. An answer that is blocks — what a
   documentation renderer hands over — goes between the tags as
   ``sds-accordion-item`` instead, and then this stays empty.

.. confval:: multiple
   :name: sds-accordion-sds-accordion-item-multiple
   :type: boolean
   :default: false

   More than one open at a time. The platform's own exclusivity is otherwise
   on, and it is on because a list is easier to read than a wall.

.. confval:: name
   :name: sds-accordion-sds-accordion-item-name
   :type: string
   :default: "sds-accordion"

   What the set is called. Two exclusive groups on one page must not close each
   other's answers. The set tells its items, so a page says it once.

.. confval:: question
   :name: sds-accordion-sds-accordion-item-question
   :type: string
   :required: true

   On ``sds-accordion-item``. What is asked, in the summary. The answer is
   whatever stands between the tags, because paragraphs, lists and code blocks
   are what no attribute can carry.

.. confval:: open
   :name: sds-accordion-sds-accordion-item-open
   :type: boolean
   :default: false

   On ``sds-accordion-item``. Standing open — for the first answer on a page of
   them, so the shape of an answer is visible without pressing anything.

.. confval:: anchor
   :name: sds-accordion-sds-accordion-item-anchor
   :type: string

   On ``sds-accordion-item``. The address of this one answer, and it lands on
   the **answer** rather than on the question: a fragment pointing *into* a
   ``<details>`` is what unfolds it, and one pointing *at* the element leaves it
   shut. So there is no rule forcing the fold and nothing watching the hash.

.. note::

   For a *list* of questions. Where the folded part is the point — a log, a
   stack trace — one ``<details>`` in the document needs no component.

.. _component-sds-nav-pagination:

sds-nav-pagination
==============

Where a list continues.

.. code-block:: html

   <sds-nav-pagination count="1240" per-page="20" current="3"
     href="?q=typo3&amp;page={n}&amp;sort=date" label="entries"></sds-nav-pagination>

.. confval:: count
   :name: sds-nav-pagination-count
   :type: number
   :required: true

   How many there are in all — the list, not the page. The row is told the
   total and the page size and divides, so nothing hands over the same fact
   twice.

.. confval:: per-page
   :name: sds-nav-pagination-per-page
   :type: number
   :default: 10

.. confval:: current
   :name: sds-nav-pagination-current
   :type: number
   :default: 1

   One-based, the way it is written in the page. The current page is text, not
   a link.

.. confval:: href
   :name: sds-nav-pagination-href
   :type: string
   :default: "#page-{n}"

   A page's **whole** address, with ``{n}`` where its number goes. A list is as
   often at ``?q=…&page=2&sort=date`` as at the end of a path, and a caller
   that can only append has to reorder the query it already has. A template
   with no ``{n}`` is treated as a prefix.

.. confval:: label
   :name: sds-nav-pagination-label
   :type: string

   What was counted, in the label register. Left off, the row ends with the
   bare number.

.. note::

   Every number is an ``href``: a page reachable only by scrolling is one a
   reader cannot send to anyone. A surface that pages **in place** listens for
   ``sds-change`` and calls ``preventDefault()`` — the same press, not a second
   mode.

.. _component-sds-nav-pager:

sds-nav-pager
=========

The way on from a page, where a page is read in order: the one behind and the
one ahead, and nothing between them. Not ``sds-nav-pagination`` — that numbers a
set a reader moves around inside, this is a line they are walking along.

.. code-block:: html

   <sds-nav-pager previous-href="/guide/install" previous-label="Installing the server"
     next-href="/guide/skills" next-label="Writing a task skill"></sds-nav-pager>

.. confval:: previous-href
   :name: sds-nav-pager-previous-href
   :type: string

.. confval:: previous-label
   :name: sds-nav-pager-previous-label
   :type: string

   Both halves or neither: a control with a target and no name cannot be read,
   and one with a name and no target does nothing. Missing, that end of the row
   is empty — an inert control is a control a reader tries.

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

   What the row is called for a reader who cannot see that it is one.

.. note::

   Four strings and not one object per side. A label and a target each fit in
   an attribute, so no caller's idea of what a page *is* reaches the component:
   a documentation renderer walking a toctree and an application reading a
   database fill exactly the same four.

   The direction is carried by the glyph, whose own accessible name is
   ``Previous page`` / ``Next page``. It joins the page title rather than
   replacing it — a name written over the whole control would say a sentence
   the reader cannot see in place of the one they can.

.. _component-sds-search:

sds-search
==========

Finding a page in a site that has no server. A rendered site is files, so the
index is a file too: a small JSON the build writes, fetched the first time
somebody types.

.. code-block:: html

   <sds-search index="/search-index.json" label="Search"></sds-search>

.. confval:: index
   :name: sds-search-index
   :type: string
   :required: true

   Where the index is. Hits are resolved against the index's own address rather
   than against the current page — the index lists every page as the build sees
   them, and a reader is rarely standing in the root.

.. confval:: label
   :name: sds-search-label
   :type: string
   :default: "Search"

The field is a combobox: down goes into the list, the arrows walk it, up from
the first goes back to what was typed, and Escape gives the page back. It draws
``sds-result`` for a hit rather than rebuilding one, and a query that matched
nothing gets a sentence in the same drop: which pages were read, and what of
them is not indexed.

.. important::

   Without JavaScript neither the element nor the field is there. A search box
   that cannot search is worse than an honest absence — and the rail still
   lists every page.

.. _component-sds-result:

sds-result
==========

One hit in a list of them: what was found, **where it is**, the sentence it was
found in, and what kind of thing it is. The second is what a list of titles and
snippets leaves out, and the reader opens a page to learn it.

.. code-block:: html

   <sds-result heading="Publishing" href="/guides-theme/publishing"
     path="Documentation · Guides theme" kind="reference" match="publish"
     snippet="The workflow that renders the site and puts it where readers are."
   ></sds-result>

.. confval:: heading
   :name: sds-result-heading
   :type: string
   :required: true

.. confval:: href
   :name: sds-result-href
   :type: string
   :default: "#"

.. confval:: path
   :name: sds-result-path
   :type: string

   Where it is, as the site's own trail. Mono, because a path is a
   machine-named thing.

.. confval:: snippet
   :name: sds-result-snippet
   :type: string

   The sentence it was found in, cut from the text and not written for the list.

.. confval:: match
   :name: sds-result-match
   :type: string

   What was searched for. **The marking happens here**, not in the caller: what
   is highlighted has to be what was searched for, and a page marking by hand
   marks what it thinks it searched for — the two part the first time a query is
   normalised.

.. confval:: kind
   :name: sds-result-kind
   :type: string

   What kind of thing it is — reference, guide, changelog.

.. confval:: meta
   :name: sds-result-meta
   :type: string

   The release it holds for, where it holds for one.

.. _component-sds-footer:

sds-footer
==========

How a page ends. A **site** says where the rest of itself is, grouped so the
columns read as sections; a **screen** with no site around it says what it is
and the way out. One shape either way: every part of it falls away where
nothing was set, so the second is the first with less in it.

.. code-block:: html

   <sds-footer note="Not an official TYPO3 product." product="soul-frontend"
     signet="/_images/signet.svg" brand="TYPO3"
     copyright="© 2026 The TYPO3 Project"
     .groups="${[{ label: 'Documentation', items: [{ label: 'Frontend', href: '/frontend/' }] }]}"
     .marks="${[{ label: 'GitHub', href: 'https://github.com/…', external: true,
                  icon: 'actions-brand-github' }]}"></sds-footer>

   <!-- A screen with no site around it: the same element, less set. -->
   <sds-footer product="soul-frontend" note="Not an official TYPO3 product."
     .meta="${[{ label: 'docs.typo3.org', href: 'https://docs.typo3.org', external: true }]}"
   ></sds-footer>

.. confval:: groups
   :name: sds-footer-groups
   :type: "{ label, href?, items }[]"

   The columns. They reflow by their own minimum, so no breakpoint decides how
   many fit.

   ``href`` makes the heading the page it names, where what the column collects
   is a section with a page of its own: that page is reachable from its column
   or from nowhere, and repeating its name as the first entry under it is a
   column saying the same word twice. The heading keeps the label's colour
   rather than taking the links' — at theirs it reads as the first entry of the
   list it names. A column that collects links belonging together rather than a
   section leaves it out.

.. confval:: note
   :name: sds-footer-note
   :type: string
   :required: true

   What this is. Stated, never implied — and never whose it is. A required
   property rather than a slot a page may forget to fill, because no surface
   here may imply an endorsement it does not have.

   It sits under the lockup rather than in the line at the bottom, and not in
   the micro register that line is set in: it is the one thing in a footer
   somebody reads rather than scans, and fine print is what a page uses to be
   forgiven for what it says.

.. confval:: product
   :name: sds-footer-product
   :type: string

   The machine's name for it, set as the machine's: a product, a package, a
   repository — verbatim, and never title-cased. It is the name in the lockup:
   a reader who scrolled this far has left the bar behind, and the mark alone
   is a picture they have to already know.

.. confval:: signet
   :name: sds-footer-signet
   :type: string

   The mark, as the file it is drawn in — the same file the bar carries, and
   shown the same way.

.. confval:: brand
   :name: sds-footer-brand
   :type: string

   Whose product it is, where that is a second name: the first half of the
   lockup, with the accent rule between the two. Left out, the mark is one
   name and there is nothing to separate.

.. confval:: copyright
   :name: sds-footer-copyright
   :type: string

   Whose it is and from when. A separate line from the note because it is a
   separate claim.

.. confval:: version
   :name: sds-footer-version
   :type: string

   What the reader is reading, where the site has a version. It stands in the
   closing line, set in mono like anything the machine names.

.. confval:: meta
   :name: sds-footer-meta
   :type: "FooterLink[]"

   What has to travel with it: a licence, a legal page, the manual it was
   built from.

.. confval:: marks
   :name: sds-footer-marks
   :type: "FooterLink[]"

   Where else it lives — a repository, a chat, a feed. At the far end of the
   line, because they are the one thing in a footer a reader looks for by
   position rather than by reading.

   Drawn as the marks they are: the glyph at 24, no word beside it and no
   external glyph after it. The label is what the link is called and is on the
   element for whoever cannot see it. This is the one place a brand glyph
   stands alone — in a column the same link is labelled, because there it is
   read rather than looked for. An entry with no mark in the set keeps its
   label, so an account is never a link nobody can name.

.. note::

   A footer is a directory, and **not** a place the accent appears: its links
   carry the page's own secondary ink. ``.sds-foot`` is the other shape — one
   row with the way out of this page, which is all a single screen owes its
   reader. See :doc:`/frontend/layout`.

.. seealso::

   :doc:`/frontend/layout` for where a rail, a bar and a footer stand on the
   page, and :doc:`/guides-theme/configuration` for the navigation a rendered
   site builds all of this from.
