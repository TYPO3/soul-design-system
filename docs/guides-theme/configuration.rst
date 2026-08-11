:navigation-title: Configuration

=============
Configuration
=============

Everything a site says on every page — the mark, the sections in the bar, the
footer — is configuration and not markup. A theme that read those from the
documents would have every page free to disagree with the others by the third
one, and a theme that hard-coded them would fit exactly one project.

It is written in two places in the same file: the attributes on ``<guides>``,
which are the renderer's own, and an ``<extension>`` element, which is how
Guides hands a block of configuration to the extension that claims it.

What the renderer needs
=======================

.. confval:: theme
   :type: string
   :required: true

   ``soul``. The attribute selects a theme; the ``<extension>`` element below
   is what makes one called ``soul`` exist, and a project that sets the
   attribute without loading the extension stops on *Theme "soul" is not
   registered*. Selecting it is what puts the theme's templates in front of
   the packaged ones.

   A theme is not a list of template paths. Paths are searched **after** the
   renderer's own templates, so a file replacing one of theirs is never
   reached — which is the difference, and the reason a theme exists as a
   concept at all.

.. confval:: links_are_relative
   :type: bool
   :default: false

   Leave it false and every asset URL is absolute, which is a site that only
   works served from a domain root. Anything published under a repository
   path — GitHub Pages, most of the time — needs this on.

.. confval:: default_code_language
   :type: string
   :default: none

   The language a fenced block is highlighted as when it does not say. Set it,
   and know that the Markdown parser does not consult it: a bare fence arrives
   with the language ``null``, and this theme's code template is what stops
   that being fatal.

.. confval:: input-format
   :type: string
   :default: "rst"

   ``rst`` or ``md``. See the note in :doc:`installation` on what the Markdown
   parser cannot spell.

The project element
===================

.. code-block:: xml

   <project title="Your project" version="1.0" copyright="© 2026 Acme"/>

The **title** is the name in the bar when nothing else is configured, and the
name after the em dash in every ``<title>`` tag. The **version** is a badge at
the end of the bar rather than part of the mark: it is a fact about the
documentation the reader is in, not about the product, so it stands with the
search and the mode switch and it is the first thing the bar drops when it
narrows. The **copyright**, where there is one, prints in the footer.

The theme element
=================

.. code-block:: xml
   :caption: guides.xml

   <extension class="TYPO3\Soul\GuidesTheme\DependencyInjection\SoulExtension">
       <signet>_images/signet.svg</signet>
       <brand>Acme</brand>
       <product>Your product</product>
       <navigation>
           <link href="/overview" label="Overview"/>
           <link href="https://example.org" label="Elsewhere" external="true"/>
       </navigation>
       <footer>
           <group title="Elsewhere">
               <link href="https://example.org" label="Product site" external="true"/>
           </group>
           <social href="https://github.com/…" label="GitHub"/>
           <note>Not an official product.</note>
       </footer>
   </extension>

**The element itself is not optional** — it is what registers the theme — but
everything inside it is. Written empty, the bar carries the project title, and
the footer carries the site's own sections beside that title and the copyright,
which is the least a page can say and still be honest about what it is.

The mark
--------

.. confval:: signet
   :type: string
   :default: none

   A path relative to the documentation root, and it must be a file the
   renderer can **see**: put it beside the documents, so it is copied into the
   output with them rather than pointing at something that only exists on the
   machine that built the site. ``_images/`` is the conventional place.

   An SVG is **referenced** into the page rather than linked, so the mark is
   drawn in the page's ink and follows it into dark. That costs the file three
   lines — a root named ``id="art"``, a ``viewBox`` on it, and every colour
   written as a ``var()`` with a hex fallback — and a file that has not been
   told draws nothing at all. :doc:`/guidelines/artwork` is the rule, and it is
   worth reading before pointing this at an SVG. Any other format is linked and
   simply works, the same picture in both modes.

   A signet is not an icon. It ships at three optical sizes with different
   construction, and bar height is the small one's job — see
   :doc:`/guidelines/brand` for which file to hand over.

.. confval:: product
   :type: string
   :default: the project title

   The name in the bar, when it is not the project's own title: a manual that
   documents one product inside a larger project says the product.

.. confval:: brand
   :type: string
   :default: none

   Whose product it is, where that is a second name. It becomes the first half
   of a lockup, with the accent rule between the two halves — one of exactly
   three places that colour appears. With no brand the mark is one name in the
   mark's own weight, because a single name is not the quiet half of a lockup
   with nothing beside it.

.. confval:: home
   :type: string
   :default: the project's index

   Where the mark leads. Resolved as an asset path, for the case where the
   documentation sits under a marketing page that is not part of the rendered
   project. Left out, the mark leads to ``/index``, which is where it should
   lead.

The bar's sections
------------------

.. code-block:: xml

   <navigation>
       <link href="/guide/index" label="Guide"/>
       <link href="/reference/index" label="Reference"/>
       <link href="https://github.com/…" label="Source" external="true"/>
   </navigation>

The handful of places a site has, and only the site knows them. Not the
toctree: that is the rail's job, and a manual's every page in the bar is not
navigation.

.. confval:: link
   :type: href, label, external

   ``href`` is a **document** — ``/guide/index``, written the way a ``:doc:``
   reference is — unless ``external="true"``, in which case it is a URL and
   opens in a new tab with the external marker on it.

   A section is marked current on its own page **and on every page under it**,
   which is the toctree walked upwards: a page three levels inside the guide
   still marks Guide. Marking only the exact page leaves the bar saying nothing
   on all but a handful of pages.

The footer
----------

The columns are the site itself, and nothing configures them: the top level of
the toctree is one column per section, and under each of them the pages that
section holds. A page added below a section is in the footer the moment it is
written, the same way it reaches the rail and the breadcrumb. A section with
nothing under it is the link itself, and the tree is read two levels deep — a
section and its pages is a footer, a section and its pages and *their* sections
is a sitemap, which is a page rather than the end of every page.

What is configured is what the tree cannot know:

.. code-block:: xml

   <footer>
       <group title="Elsewhere">
           <link href="https://example.org" label="Product site" external="true"/>
       </group>
       <social href="https://github.com/…" label="GitHub"/>
       <note>Not an official product.</note>
   </footer>

``<group>`` is a column of links under a label, and it follows the site's own
columns; ``<link>`` follows the same document-or-URL rule as the bar's.
``<social>`` is always a URL and sits at the end of the last line. It carries
the mark of the service before its name, and there is nothing to set: the host
says which service it is, so a glyph cannot name one the link does not go to.
A host the icon set has no brand mark for keeps its label and no glyph — as
does an instance somebody runs themselves, which is a host no URL can be read
for. ``<note>`` is the sentence that says what this is not — the place a
project disclaims an affiliation, beside the product name and the copyright.

.. note::

   Both lists resolve their document links **per page**, because a bar and a
   footer render on every one of them and they are not all at the same depth.
   That is why ``/overview`` and not ``overview.html``: the second resolves
   from wherever the reader happens to be standing, and lands in nothing one
   directory down.

Per-page settings
=================

Two fields at the top of a document, before the title. Both are read by the
theme; anything the parser does not claim renders as a definition list in the
body, which is what a stray field looks like when it is misspelled.

.. code-block:: text

   :navigation-title: Overview
   :layout: marketing

   ============
   The long one
   ============

.. confval:: navigation-title
   :type: string
   :default: the page title

   What the rail, the trail and the browser tab call this page. The renderer's
   own field, and the reason it exists is that a page title written for the
   page is often too long for a list of thirty of them.

``:layout: marketing`` builds the page as a run of full-bleed bands with no
rail; anything else, and any page that writes no such field, is the manual
shape — a column beside the rail, held to the measure. It is written down in
:doc:`directives`, beside the three directives that fill a marketing page,
because on its own it is a page shape with nothing in it.
