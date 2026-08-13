:navigation-title: Render guide template

==========================
As a render guide template
==========================

``phpdocumentor/guides`` turns reStructuredText and Markdown into HTML. This
package is a theme for it: templates that emit the ``sds-`` vocabulary, the
directives and the document field the renderer does not have, and a second
stylesheet for everything a renderer produces that carries no class at all.
This manual is rendered with it, and so is the fixture the theme is checked
against.

.. toctree::
   :titlesonly:

   installation
   example
   publishing
   configuration
   directives
   markup

Two halves, and no third
========================

A Guides theme is a Composer package with two parts and no third: Twig
templates that override the renderer's own by path, and container
configuration that registers them. This one adds directives and a document
field to that, which is the same mechanism — a service tagged so the parser
finds it.

What the renderer emits carries almost no names. It writes
``admonition note``, ``section``, ``toc``, ``confval``; for a paragraph, a
list, a quote or an inline literal it writes nothing at all, and the only
class that arrives from the source is one an author put there themselves. So a template can reach
what corresponds to a directive and nothing else, and everything that falls
out of running text has to be met by a stylesheet.

**The templates put the vocabulary in the markup.** An admonition becomes
``<sds-note>``, a tab set becomes ``<sds-tabs>``, a table gets the box it
scrolls in, the toctree becomes the rail. What a page is made of is the same
markup a hand-built screen is made of, node for node.

**The document layer catches the rest.** ``document.css`` sets ``<p>``,
``<ul>``, ``<dl>``, ``<blockquote>``, ``<table>``, ``<figure>`` and all six
heading levels, scoped to ``.sds-prose``. See :doc:`/frontend/documents` for what it
covers and where the measure gives way.

Overriding templates without it leaves every paragraph unset. Styling without
templates writes this system a second time, in somebody else's vocabulary,
where the next change to a component will not reach it.

What a page comes out as
========================

Every page is the shell each screen in this system is built from —
``sds-app``, ``sds-shell``, ``sds-bar`` — and under it one of two bodies.

A **manual page** is a column beside a rail. A **landing page** is a run of
full-bleed bands with no rail, because there is nothing to navigate on the way
in. A page says which it is in the ``:layout:`` field at the top, beside its
navigation title — :doc:`directives` is where that field, both shapes and the
directives that build a landing page are written down.

The bar is the same on both. It carries the mark, the handful of sections a
site has, the version as a badge, the search field and the mode switch, and on
a narrow screen the button that opens the rail. All of it is
:doc:`configuration <configuration>` rather than markup, because a bar that
each page wrote for itself is a bar that disagrees with itself by the third
page.

It reads with the script off
============================

The renderer writes static HTML and the server is where the work happens: a
code block arrives already coloured, tab panels are all in the markup, the
rail is a list of links, and the mode follows the reader's own setting. The
elements upgrade what is there — the copy button, the keyboard handling in the
tab bar, the fold in the rail, the search — and none of them is load-bearing
for reading the page.

That is the same rule the specimen cards follow, and it is why the theme emits
elements around real markup rather than elements fed by attributes.

.. seealso::

   :doc:`installation` is the shortest path to a rendered site, and
   :doc:`example` is a whole project already at the end of it — copy the
   directory rather than assembling one. :doc:`publishing` is the workflow that
   builds it in CI. :doc:`markup` says what the renderer's own nodes come out
   as, including which admonition type lands on which tone and both spellings
   of a tab set.
