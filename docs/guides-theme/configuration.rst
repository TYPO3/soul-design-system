:navigation-title: Configuration

=============
Configuration
=============

Everything a site says on every page, the mark, the sections in the bar, the
footer, is configuration, not markup. A theme that read those from the
documents lets every page disagree with the others by the third one. A
theme with them hard-coded fits exactly one project.

It stands in two places in the same file. The attributes on ``<guides>``
are the renderer's own. The ``<extension>`` element is how Guides hands a
block of configuration to the extension that claims it.

What the renderer needs
=======================

.. confval:: theme
   :type: string
   :required: true

   ``soul``. The attribute selects a theme. The ``<extension>`` element
   below makes one called ``soul`` exist, and a project that sets the
   attribute without the extension stops on ``Theme "soul" is not
   registered``. The selection puts the theme's templates in front of the
   packaged ones.

   A theme is not a list of template paths. The renderer searches paths
   **after** its own templates, so a file that replaces one of theirs never
   loads. That is the difference, and the reason a theme exists as a
   concept.

.. confval:: links_are_relative
   :type: bool
   :default: false

   False, every asset URL is absolute, which is a site that only works from
   a domain root. Anything published under a repository path, GitHub Pages
   most of the time, needs this on.

.. confval:: default_code_language
   :type: string
   :default: none

   The language of a fenced block that does not say. Set it, and know that
   the Markdown parser does not read it. A bare fence arrives with the
   language ``null``, and this theme's code template is what keeps that from
   a fatal error.

.. confval:: input-format
   :type: string
   :default: "rst"

   ``rst`` or ``md``. Both parsers arrive with the theme, so this is the
   whole choice, and it names a file extension. A project is one format, and
   files in the other are not documents. See the note in :doc:`installation`
   on what the Markdown parser cannot spell.

The project element
===================

.. code-block:: xml

   <project title="Your project" version="1.0" copyright="© 2026 Acme"/>

The **title** is the name in the bar without other settings, and the name
after the em dash in every ``<title>`` tag. The **version** is a badge at
the end of the bar, not part of the mark. It is a fact about the
documentation the reader is in, not about the product. So it stands with
the search and the mode switch, and it is the first thing the bar drops when
it narrows. The **copyright**, where there is one, prints in the footer.

The theme element
=================

.. code-block:: xml
   :caption: guides.xml

   <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension">
       <signet>_images/signet.svg</signet>
       <favicon href="_images/signet-s.svg" sizes="16x16"/>
       <favicon href="_images/signet-l.svg" sizes="32x32"/>
       <brand>Acme</brand>
       <product>Your product</product>
       <navigation>
           <link href="/overview" label="Overview"/>
           <link href="https://example.org" label="Elsewhere" external="true"/>
       </navigation>
       <pager>true</pager>
       <footer>
           <group title="Elsewhere">
               <link href="https://example.org" label="Product site" external="true"/>
           </group>
           <social href="https://github.com/…" label="GitHub"/>
           <note>A tool for TYPO3 community projects.</note>
       </footer>
   </extension>

**The element itself is mandatory**, because it registers the theme, but
everything inside it is optional. Empty, the bar carries the project title
and the site's own sections. The footer carries those sections again with
the pages under them, beside that title and the copyright. That is the least
a page can say and still be honest about what it is.

The mark
--------

.. confval:: signet
   :type: string
   :default: none

   A path relative to the documentation root, and it must be a file the
   renderer can **see**. Put it beside the documents, so the render copies
   it into the output. A file that only exists on the build machine is not
   in the site. ``_images/`` is the conventional place.

   The mark is a link like every other picture, so any format works. The
   file's own colours draw it: the same mark in light and in dark. Write
   an SVG's colours as ``var(--token, #hex)`` anyway.
   :doc:`/design-system/artwork` says what that buys, and what Firefox and
   Safari have to ship before a mark can take the page's ink.

   A signet is not an icon. It ships at three optical sizes with different
   construction, and bar height is the small one's job.
   :doc:`/design-system/brand` says which file to hand over.

.. confval:: favicon
   :type: href, sizes
   :default: the signet

   The mark in the tab. Once per file, not as one path, because a browser
   picks between them at the link. ``sizes`` is the slot of a file, spelt as
   the attribute is. One entry can leave it out as the file for everything
   else. Paths follow the signet's rule: inside the documentation
   tree, where the renderer can see them.

   Set nothing, and the signet is the tab icon, the right answer for a
   project with one drawing. A bar with a mark above a tab without one is a
   site that says two things. Set the sizes where there is more than one
   drawing. This system ships three, at three optical sizes, because a
   favicon slot cannot scale one. A media query inside the file cannot pick
   either. As a link, an SVG only sees its own viewport.

.. confval:: product
   :type: string
   :default: the project title

   The name in the bar, when it is not the project's own title. A manual
   that documents one product inside a larger project says the product.

.. confval:: brand
   :type: string
   :default: none

   Whose product it is, where that is a second name. It becomes the first
   half of a lockup, with the accent rule between the two halves, one of
   exactly three places that colour appears. With no brand the mark is one
   name in the mark's own weight. A single name is not the quiet half of a
   lockup with nothing beside it.

.. confval:: home
   :type: string
   :default: the project's index

   Where the mark leads. Resolved as an asset path, for a manual under a
   marketing page outside the rendered project. Without it the mark leads
   to ``/index``.

The bar's sections
------------------

.. code-block:: xml

   <navigation>
       <link href="/guide/index" label="Guide"/>
       <link href="/reference/index" label="Reference"/>
       <link href="https://github.com/…" label="Source" external="true"/>
   </navigation>

The few places a site has. Without it the bar carries the top level of the
toctree, the same source as the footer's columns. So a project with no
configuration still has a bar. What stands here wins over that. Which of
a site's sections are its front doors is the one thing the tree cannot
know. This manual leaves a page out of its bar that the tree has, and adds
nothing the tree lacks.

Not the toctree entire. That is the rail's job, and a manual's every page in
the bar is not navigation. A site whose top level *is* every page is a site
that writes the few it wants.

The bar gets the whole tree all the same, on every page: the site as one
entry, with the reader's page marked wherever it sits. It draws as much as
the width permits. The front doors in the row, a section's pages under it.
One level at a time in the drawer where the row has none of it.

That is not configuration and cannot go. Which sections are front doors is
a choice. To reach the rest of the site from a phone is not.

.. confval:: link
   :type: href, label, external

   ``href`` is a **document**, ``/guide/index``, as a ``:doc:`` reference
   spells it. With ``external="true"`` it is a URL, opens in a new tab and
   carries the external marker.

   ``label`` names the second kind only. A document's own
   ``:navigation-title:`` names it, everywhere.

   A section is current on its own page **and on every page under it**,
   which is the toctree walked upwards. A page three levels inside the guide
   still marks Guide. A mark on the exact page only leaves the bar silent on
   all but a few pages.

The rail
--------

The rail derives from the toctree, with no configuration of its own. The
theme finds the current page's top-level section on its rootline, so the
answer does not depend on how deep the page sits. So the bar and the rail
mark the same section by construction.

On a section with children, the heading above the list **is** the way to
the section's own page. A page with descendants is a row with the marker
that opens them beside it, and what it holds sits in by one step. A section
that is one page has no rail. The bar names it, and that is all there is to
say. Neither has the root, which is in no section. The bar carries the whole
site there, as on every page.

``packages/guides-theme/src/Navigation/Menu.php`` turns the tree into that
one entry, and ``Rail.php`` takes the section a page's column carries. The
transformation is recursive application logic, not template markup, so Twig
receives a complete heading, item tree and active position. The document
template renders that result before the bar and the body. An empty rail
then removes its column and its opening control from one answer.

The way on
----------

.. confval:: pager
   :type: boolean
   :default: false

   The pages either side of this one, as two links at the end of the column.
   The order is the toctree flat: the order of the rail, and the order of a
   read from front to back, with the root first. A toctree lists what is
   under a page and never the page it stands on.

   Off unless a project says otherwise, and that is a decision, not
   caution. The renderer computes no such thing, so this is the theme with
   a path on offer. In a reference nobody reads front to back, that path is
   a row of noise under every page. A manual with a reading order says
   ``true``.

   A page outside the tree gets no row. A reader reaches an orphan from
   somewhere else. A way onward from a page that is not on the way is a path
   this theme invented.

The twin
--------

.. confval:: markdown
   :type: boolean
   :default: true

   The same documents, a second time as Markdown: ``page.md`` beside
   ``page.html``, and every page names its own twin:

   .. code-block:: html

      <link rel="alternate" type="text/markdown" href="stylesheets.md" />
      <link rel="canonical" href="stylesheets.html" />

   It is a second *output format*, not a conversion of the page. The
   renderer writes both from the same parsed document, node by node. So a
   directive decides what it is in Markdown the same way it decides what it
   is in HTML. What has no shape in Markdown, a grid or a band, is what it
   holds, not a box drawn in characters.

   The format's name is the file extension every reference inside it
   resolves to. That makes the twin a site of its own. A link from one twin
   lands on the next twin, and nothing that follows those links ever gets a
   page.

   The dialect is GitHub Flavoured Markdown, the one with a table, a fenced
   block with its language, a footnote and an alert. An admonition comes out
   as ``> [!WARNING]``. The document's own anchors go into it too, one ``<a
   id>`` above every heading and wherever a label stands. A reader that
   derives them from the words derives them its own way, and a reference
   with a fragment has to land.

   What the page carries in its head, the twin carries as front matter. It
   is the first byte of the file, because that is the only place a reader
   reads front matter as such:

   .. code-block:: yaml

      ---
      title: "How the stylesheets are written"
      description: "The class layer is one vocabulary written by many hands, …"
      canonical: stylesheets.html
      navigation-title: "Stylesheets"
      ---

   ``title`` is the page's. ``canonical`` is the page this file is the twin
   of, the same relative name the page writes in its own ``rel="canonical"``.
   So the pair points both ways. ``description`` is what the page says it is
   about. An ``:abstract:`` field or a ``description`` in ``.. meta::`` where
   the author wrote one, and the first sentence of the first paragraph where
   they did not.

   Every other field above the title lands under its own name: ``:author:``,
   ``:date:``, ``:copyright:``, the rest of ``.. meta::``. A field that
   speaks to the renderer and says nothing to a reader, like ``:orphan:`` or
   ``:nosearch:``, lands nowhere. Every value carries quotes. The plain form
   is a list of exceptions, ``yes`` a boolean and ``2024`` a number. A title
   falls into one of them one day, and nobody reads it.

   The same setting writes ``llms.txt`` at the publish root: the site's own
   table of contents, which a reader with no navigation lacks. It is the
   toctree. A heading per section, a line per page with the same
   ``description`` its twin opens with, and every link a twin.

   A twin lands at its page's own path. A project can keep a ``.md`` file
   as an *asset* beside a document of the same name, a prompt, a snippet.
   The twin then overwrites it. Name one or the other something
   else. This site keeps its prompts under names no page carries.

   On unless a project says otherwise, and that is the decision. A reader
   that is a program, an agent on a link, a model asked to read the manual,
   is a reader this theme has. A page with navigation, scripts and a frame
   is none of what it came for. Off is for a project that does not want its
   documents published twice.

The footer
----------

The columns are the site itself, and nothing configures them. The top level
of the toctree is one column per section, and under each the pages that
section holds. A page under a section is in the footer the moment it
exists, the same way it reaches the rail and the breadcrumb. A section with
nothing under it is the link itself.

The footer reads the tree two levels deep. A section and its pages is a
footer. A section, its pages and *their* sections is a sitemap, which is a
page, not the end of every page.

The heading of such a column is that section's own page. The bar carries a
written list of front doors, and a section can be off it. So the footer is
where a reader reaches one that is. A column that names a section without a
link has published a page nothing on the site points at.

What is configuration is what the tree cannot know:

.. code-block:: xml

   <footer>
       <group title="Elsewhere">
           <link href="https://example.org" label="Product site" external="true"/>
       </group>
       <social href="https://github.com/…" label="GitHub"/>
       <note>A tool for TYPO3 community projects.</note>
   </footer>

``<group>`` is a column of links under a label, after the site's own
columns. ``<link>`` follows the bar's document-or-URL rule. ``<social>`` is
always a URL and sits at the end of the last line. It carries the mark of
the service before its name, and there is nothing to set. The host says
which service it is, so a glyph cannot name one the link does not go to.

A host without a brand mark in the icon set keeps its label and no glyph.
So does an instance somebody runs themselves, a host no URL reveals.
``<note>`` is the sentence that says what this is, what the project does and
who it is for, beside the product name and the copyright.

.. note::

   Both lists resolve their document links **per page**, because a bar and
   a footer render on every one of them, at different depths. That is why
   ``/overview`` and not ``overview.html``. The second resolves from
   wherever the reader stands, and lands in nothing one directory down.

Per-page settings
=================

Two fields at the top of a document, before the title. The theme reads
both. A field the parser does not claim renders as a definition list in the
body, which is what a misspelt field looks like.

.. code-block:: text

   :navigation-title: Overview
   :layout: marketing

   ============
   The long one
   ============

.. confval:: navigation-title
   :type: string
   :default: the page title

   What the rail, the trail and the browser tab call this page. The
   renderer's own field. A page title written for the page is often too
   long for a list of thirty.

``:layout: marketing`` builds the page as a run of full-bleed bands with no
rail. Anything else, and a page with no such field, is the manual shape: a
column beside the rail, held to the measure. It stands in
:doc:`directives`, beside the directives that fill a marketing page, because
on its own it is a page shape with nothing in it.
