:navigation-title: Guides theme

=================
As a Guides theme
=================

``phpdocumentor/guides`` turns reStructuredText and Markdown into HTML. This
package is a theme for it. Templates that emit the ``sds-`` vocabulary, and
the directives and the document field the renderer lacks. And a second
stylesheet for everything a renderer emits without a class. This manual
renders with it, and so does the fixture the gate checks the theme against.

.. toctree::
   :titlesonly:

   quickstart
   installation
   example
   publishing
   configuration
   directives
   markup

.. tip::

   :doc:`quickstart` starts from an empty directory and ends at a local
   site. :doc:`example` is the complete project and workflow to copy.

Two halves, and no third
========================

A Guides theme is a Composer package with two parts. Twig templates that
override the renderer's own by path, and container configuration that
registers them. This one adds directives and a document field the same way:
a service with a tag the parser finds.

What the renderer emits carries almost no names. It writes ``admonition
note``, ``section``, ``toc``, ``confval``. For a paragraph, a list, a quote
or an inline literal it writes nothing. The only class from the source is
one an author put there. So a template can reach what corresponds to a
directive and nothing else, and a stylesheet has to meet everything that
falls out of text.

**The templates put the vocabulary in the markup.** An admonition becomes
``<sds-note>``, a tab set becomes ``<sds-tabs>``, a table gets the box it
scrolls in, the toctree becomes the rail. A page is the same markup a
hand-built screen is, node for node.

**The bare elements catch the rest.** ``soul.css`` sets ``<p>``, ``<ul>``,
``<dl>``, ``<blockquote>``, ``<table>``, ``<figure>`` and all six heading
levels. Each stands in the sheet of its component, or in ``base.css`` where
it belongs to none. :doc:`/frontend/documents` says which sheet draws what, and
where the measure gives way.

Templates without the stylesheet leave every paragraph unset. A stylesheet
without templates writes this system a second time, in somebody else's
vocabulary, where the next change to a component never arrives.

What a page comes out as
========================

Every page is the shell every screen in this system uses, ``sds-app``,
``sds-shell``, ``sds-bar``, and under it one of two bodies.

A **manual page** is a column beside a rail. A **landing page** is a run of
full-bleed bands with no rail, because there is nothing to navigate on the
way in. A page says which it is in the ``:layout:`` field at the top,
beside its navigation title. :doc:`directives` holds that field, both shapes
and the directives of a landing page.

The bar is the same on both. It carries the mark, the sections of the site,
the version as a badge, the search field and the mode switch. On a narrow
screen, the button that opens the rail. All of it is :doc:`configuration
<configuration>`, not markup. A bar each page writes for itself disagrees
with itself by the third page.

It reads with the script off
============================

The renderer writes static HTML, and the server does the work. A code block
arrives with its colour, and tab panels are all in the markup. The rail is a
list of links, and the mode follows the reader's own setting. The elements
upgrade what is there: the copy button, the keys in the tab bar, the fold in
the rail, the search. None of them is necessary to read the page.

That is the rule the specimen cards follow too. It is why the theme emits
elements around real markup, not elements fed by attributes.

.. seealso::

   :doc:`installation` is the shortest path to a rendered site, and
   :doc:`example` is a whole project at the end of it. :doc:`publishing` is
   the workflow that builds it in CI. :doc:`markup` says what the renderer's
   own nodes come out as, which admonition type lands on which tone, and both
   spellings of a tab set.
