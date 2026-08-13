:navigation-title: Navigation

==========
Navigation
==========

Getting around a page, a site and a list. Three of these share one base and
therefore one shape: an item is a **control**, not a picture of one —
focusable, pressable, and announcing ``sds-change`` when it becomes current. An
item that goes somewhere says ``href`` and is left to the browser.

.. specimen:: components/navigation/navigation.card.html
   :viewport: 700x156
   :title: Tabs & tool rail

.. confval:: items
   :name: navigation-items
   :type: "(string | { label, href?, icon? })[]"

   What ``sds-pills``, ``sds-menu``, ``sds-rail`` and ``sds-tabs`` are lists
   of. A bare string is a label; an object adds where it goes and a glyph
   before it.

.. confval:: active
   :name: navigation-active
   :type: number
   :default: 0

   Which item is current, by position. The active item is a **filled block,
   never a tint**: a tint reads as "hovered" or "disabled" depending on what is
   under it, and this system already spends hover on a colour change.

.. note::

   ``aria-current``, not ``aria-selected``, for the ones that navigate:
   selection belongs to a tablist, and a tablist owes its panel an
   ``aria-controls``. Current-within-a-set is what is true of a pill or a rail
   item.

sds-menu
========

The navigation in a header, and what it does as the header runs out of room.
Pills in a row while there is room; a toggle and a panel below the bar when
there is not.

.. code-block:: html

   <sds-menu label="Sections" .items="${SECTIONS}" active="1"></sds-menu>

   <!-- Or, for a renderer that has already resolved its own navigation. -->
   <sds-menu label="Sections">
     <a class="sds-pill is-active" href="/design-system/" aria-current="page">Design system</a>
     <a class="sds-pill" href="/frontend/">Frontend</a>
   </sds-menu>

**The decision is measured, not declared.** A bar holds a product name as long
as the product is called, so a breakpoint would be wrong on the next site: the
element measures what its items need against the room the row has left, with
itself out of the sum. Collapsed, the panel is the same navigation moved —
never a second copy.

.. confval:: label
   :name: sds-menu-label
   :type: string
   :default: "Menu"

   What the toggle is called, for a reader who cannot see that it is a menu.

.. confval:: for
   :name: sds-menu-for
   :type: string

   The id of a navigation that lives **outside** the bar — the page rail. Given
   one, this element is that navigation's toggle and holds no items of its own:
   the sections run out of room in the header, which this measures, and the
   rail runs out of a *column*, which the layout decides. So a menu with
   ``for`` presses, and never measures.

   It draws nothing at all where that element is not on the page, so the same
   bar can sit on every page without each layout remembering to leave the
   button out.

.. note::

   Links written between the tags are kept exactly as written — ``target``,
   ``rel`` and the current mark intact. Passing them back through ``items``
   would encode and resolve a rendered site's own navigation a second time.

sds-pills
=========

Navigation for the sections of a page. The accent marks the active item — one
of the exactly three places ``--accent`` may appear at all.

.. code-block:: html

   <sds-pills .items="${['Overview', 'Tools', 'Changelog']}" active="0"></sds-pills>

sds-rail
========

The navigation rail beside a column. Items are often things the machine named,
so they set in mono, verbatim.

.. code-block:: html

   <sds-rail label="Reference"
     .items="${['overview', { label: 'tools', items: ['search', 'fetch'] }]}"
     active="1"></sds-rail>

A group is a ``<details>``, so the fold works before any script runs and the
group holding the current item starts open. Groups are data rather than
composed elements, unlike the tabs: a group holds links and no content of its
own.

.. confval:: label
   :name: sds-rail-label
   :type: string

   What this is the list of, standing over it. A rail holding one section of a
   site says which; left empty there is no heading, which is right where the
   rail is the whole navigation there is.

.. confval:: items
   :name: sds-rail-items
   :type: "(NavItem | { label, items, open? })[]"

   ``active`` counts across the whole rail, **groups flattened**: a rail has
   one current item wherever it sits, and a caller thinking in "third item of
   the second group" is thinking about the markup.

sds-crumbs
==========

Where the page sits, as a trail.

.. code-block:: html

   <sds-crumbs .items="${[{ label: 'Docs', href: '/' },
                          { label: 'Frontend', href: '/frontend/' },
                          { label: 'Navigation' }]}"></sds-crumbs>

.. confval:: items
   :name: sds-crumbs-items
   :type: "{ label, href? }[]"
   :required: true

   The last entry is the page itself and is drawn as text whether or not a
   caller gave it an ``href`` — a trail whose last step is a link is a trail
   that was pasted from the one above it.

.. confval:: label
   :name: sds-crumbs-label
   :type: string
   :default: "Breadcrumb"

.. note::

   The one navigation here with **no active mark**. The trail is read as a path
   and its end is where the reader already is, so spending the accent there
   would leave nothing to mark what they came to do. The separator is a
   character rather than an icon: punctuation between two words, at their size.

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

A real tablist: each tab names the panel it controls, the arrow keys move
between them, Home and End go to the ends, and the focus follows the selection.
Panels that are not current are **hidden rather than unrendered**, so
find-in-page reaches them and anything with state in there keeps it.

.. note::

   A panel decides for itself until a set of tabs claims it. That is what a
   panel is on a page where nothing switches it — and hiding every one there
   would leave content in the document and invisible in it.

sds-accordion, sds-accordion-item
=================================

Questions with their answers folded behind them.

.. code-block:: html

   <sds-accordion name="what-a-theme-answers">
     <sds-accordion-item question="What does it need installed?" open>
       <p>PHP 8.2 or newer, and a project it can read.</p>
     </sds-accordion-item>
     <sds-accordion-item question="Can it run in CI?">
       <p>Yes — the workflow is one job.</p>
     </sds-accordion-item>
   </sds-accordion>

``<details>`` and ``<summary>``, like the rail's groups: the fold works before
any script runs, the keyboard reaches it, and find-in-page opens the one it
lands in. A button drawn to look like a summary looks identical and has none of
that.

.. confval:: entries
   :name: sds-accordion-sds-accordion-item-entries
   :type: "{ question, answer, open? }[]"

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

.. note::

   For a *list* of questions. Where the folded part is the point — a log, a
   stack trace — one ``<details>`` in the document needs no component.

sds-pagination
==============

Where a list continues.

.. code-block:: html

   <sds-pagination count="1240" per-page="20" current="3"
     href="?q=typo3&amp;page={n}&amp;sort=date" label="entries"></sds-pagination>

.. confval:: count
   :name: sds-pagination-count
   :type: number
   :required: true

   How many there are in all — the list, not the page. The row is told the
   total and the page size and divides, so nothing hands over the same fact
   twice.

.. confval:: per-page
   :name: sds-pagination-per-page
   :type: number
   :default: 10

.. confval:: current
   :name: sds-pagination-current
   :type: number
   :default: 1

   One-based, the way it is written in the page. The current page is text, not
   a link.

.. confval:: href
   :name: sds-pagination-href
   :type: string
   :default: "#page-{n}"

   A page's **whole** address, with ``{n}`` where its number goes. A list is as
   often at ``?q=…&page=2&sort=date`` as at the end of a path, and a caller
   that can only append has to reorder the query it already has. A template
   with no ``{n}`` is treated as a prefix.

.. confval:: label
   :name: sds-pagination-label
   :type: string

   What was counted, in the label register. Left off, the row ends with the
   bare number.

.. note::

   Every number is an ``href``: a page reachable only by scrolling is one a
   reader cannot send to anyone. A surface that pages **in place** listens for
   ``sds-change`` and calls ``preventDefault()`` — the same press, not a second
   mode.

sds-pager
=========

The way on from a page, where a page is read in order: the one behind and the
one ahead, and nothing between them. Not ``sds-pagination`` — that numbers a
set a reader moves around inside, this is a line they are walking along.

.. code-block:: html

   <sds-pager previous-href="/guide/install" previous-label="Installing the server"
     next-href="/guide/skills" next-label="Writing a task skill"></sds-pager>

.. confval:: previous-href
   :name: sds-pager-previous-href
   :type: string

.. confval:: previous-label
   :name: sds-pager-previous-label
   :type: string

   Both halves or neither: a control with a target and no name cannot be read,
   and one with a name and no target does nothing. Missing, that end of the row
   is empty — an inert control is a control a reader tries.

.. confval:: next-href
   :name: sds-pager-next-href
   :type: string

.. confval:: next-label
   :name: sds-pager-next-label
   :type: string

.. confval:: label
   :name: sds-pager-label
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

sds-footer
==========

The end of a **site**, not the end of a screen: where the rest of itself is,
grouped so the columns read as sections, and the line saying what the product
is.

.. code-block:: html

   <sds-footer note="Not an official TYPO3 product." product="soul-frontend"
     signet="/_images/signet.svg" brand="TYPO3"
     copyright="© 2026 The TYPO3 Project"
     .groups="${[{ label: 'Documentation', items: [{ label: 'Frontend', href: '/frontend/' }] }]}"
     .marks="${[{ label: 'GitHub', href: 'https://github.com/…', external: true,
                  icon: 'actions-brand-github' }]}"></sds-footer>

.. confval:: groups
   :name: sds-footer-groups
   :type: "{ label, items }[]"

   The columns. They reflow by their own minimum, so no breakpoint decides how
   many fit.

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
   the same distinction ``sds-image`` makes everywhere: an SVG is referenced
   into the page and follows it into dark, anything else is linked.

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

.. confval:: meta
   :name: sds-footer-meta
   :type: "FooterLink[]"

   What has to travel with it: a licence, a version, a legal page.

.. confval:: marks
   :name: sds-footer-marks
   :type: "FooterLink[]"

   Where else it lives — a repository, a chat, a feed. At the far end of the
   line, because they are the one thing in a footer a reader looks for by
   position rather than by reading. Labelled, always.

.. note::

   A footer is a directory, and **not** a place the accent appears: its links
   carry the page's own secondary ink. ``.sds-foot`` is the other shape — one
   row with the way out of this page, which is all a single screen owes its
   reader. See :doc:`/frontend/layout`.

.. seealso::

   :doc:`/frontend/layout` for where a rail, a bar and a footer stand on the
   page, and :doc:`/guides-theme/configuration` for the navigation a rendered
   site builds all of this from.
