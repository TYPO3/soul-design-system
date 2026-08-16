:navigation-title: Frontend

=========================
As a standalone frontend
=========================

Two files, and no assumptions about what rendered the page. Markup produced by
PHP, Twig, Fluid or a template string uses the class layer with no JavaScript
at all; the custom elements upgrade that markup where there is behaviour to
add.

.. toctree::
   :titlesonly:

   quickstart
   layout
   stylesheets
   components/index
   documents

.. tip::

   :doc:`quickstart` puts a working surface on a page from either the package
   or the drop-in, before the reference below explains each part.

Two shapes
==========

.. tabs::

   .. tab:: The drop-in

      Copy the directory somewhere public and link two files. Lit is bundled
      in, because a drop-in has nothing to share a copy with.

      .. code-block:: html

         <script src="/soul/soul-boot.js"></script>
         <link rel="stylesheet" href="/soul/soul.css">
         <script type="module" src="/soul/soul.js"></script>

   .. tab:: The package

      ESM with ``lit`` external, for a page that already has a bundler.
      Bundling Lit here would give a consumer a second reactive-element
      registry and an element that upgrades under the wrong one.

      .. code-block:: bash

         npm install github:TYPO3/soul-frontend#main lit

      .. code-block:: javascript

         import '@typo3/soul-frontend';
         import '@typo3/soul-frontend/dist/soul.css';

.. confval:: data-theme
   :type: "light" | "dark"
   :required: false

   Forces a mode on a subtree. Put it on ``<html>`` for a whole page, so the
   browser's own scrollbars and form controls match. Left off, the reader's
   system decides and both modes work — they are the same declaration.

.. confval:: soul-boot.js
   :type: script
   :required: where there is a mode switch

   Four lines, loaded **before** the stylesheet and **not** as a module. It
   reads the stored choice and writes ``data-theme`` before the first paint;
   ``<sds-theme>`` then shows which side is pressed, because it reads what the
   document already says rather than its own idea of it.

   Leave it out and a switch still switches — the choice is simply forgotten
   on the next page, which on a site of many pages is every click. The choice
   is kept under ``soul-theme``, which is ``sds-theme``'s own default too;
   name another with ``data-key`` on the tag and give the element the same one,
   or the mode is decided in one place and looked for in another.

.. confval:: soul.css
   :type: stylesheet
   :required: true

   The tokens and the ``sds-`` class vocabulary, in one file. It is not scoped
   to a class: linking it *is* the opt-in, which is what lets a bare ``<p>`` or
   ``<h2>`` be set without an editor writing a class it does not know about.

.. confval:: document.css
   :type: stylesheet
   :required: where a document is being set

   A second entry point, scoped to ``.sds-prose``, for everything a
   Markdown or reStructuredText renderer produces without a name.
   ``soul.css`` deliberately does not import it — see :doc:`documents`.

What it needs of a browser
==========================

**Chrome and Edge 129, Safari 17.5, Firefox 130** — browsers from autumn 2024
and anything newer. The floor is not a policy, it is what the features below
cost, and each of them is load-bearing rather than a convenience:

.. list-table::
   :header-rows: 1

   * - Feature
     - What depends on it
   * - ``light-dark()``
     - every colour token. Both modes are one declaration, which is the whole
       reason they cannot drift — see :doc:`/design-system/colours`
   * - the ``lh`` unit
     - a glyph centred on the line it stands beside, at whatever line height
       that line turns out to have
   * - ``<details name>``
     - a set of answers where opening one closes the last, done by the
       platform instead of a listener
   * - ``:dir()``
     - the glyphs that mean *onward*, turned where the text runs the other way

.. warning::

   Below the floor a page does not degrade — it renders **unstyled**. An
   unsupported ``light-dark()`` makes every colour token invalid at once, so
   the page loses its palette rather than a feature. A project that must serve
   older browsers should say so before it adopts the system, not after.

The JavaScript is built to ``es2022``, which is a lower bar than the CSS and
never the thing that decides. Nothing here uses a shadow root, a container
query or ``@layer``.

One contract across the layers
==============================

**Tokens** hold the decisions. Every colour, size, space, radius and duration
is declared under a semantic name, and light and dark sit in the same
declaration.

**Classes** are the vocabulary. ``sds-`` names what a thing *is* —
``.sds-card``, ``.sds-note--warn``, ``.sds-table--compact`` — and gives
server-rendered markup the whole visual system without any JavaScript.

**Elements** add behaviour. Every one of them renders **light DOM** and emits
exactly the classes above, so an element upgrades the markup that was already
there instead of introducing a second contract. There is no shadow root and no
encapsulation anywhere in this system: ``sds-`` is it.

The classes came first because the product that proved the system renders HTML
in PHP and has to work without a JavaScript component runtime. A framework
wrapper would have created another source for markup that this surface could
not use. Custom elements change that answer: light DOM lets an element emit
the same class vocabulary a server writes, so ``components.css`` remains the
source of the pixels and JavaScript adds behaviour rather than another visual
implementation.

.. code-block:: html

   <!-- The same pixels, from either column. -->
   <sds-badge tone="ok" label="passed"></sds-badge>
   <span class="sds-badge sds-badge--ok">passed</span>

Use the element where there is state, behaviour or a decision the markup would
have to repeat; use the class where a server already knows the answer and
nothing on the page will change it.

The namespace states ownership
==============================

``sds-`` is the system's own prefix. ``t3-`` would imply that these names
belong to an official TYPO3 surface, which this community system does not.
Blocks start with the prefix, their private parts append a double underscore,
modifiers append a double hyphen and transient state uses ``.is-*``.

The prefix also keeps common names such as ``card``, ``button`` and ``badge``
from colliding with application styles. It gives the gate the same boundary a
reader sees: an ``sds-`` name belongs to the system, while a screen's layout
classes belong to that screen.

Only the system declares names in that namespace. If a consumer needs an
``sds-`` component or modifier that does not exist, the gap is closed here so
the element, class layer, specimen and rendered documentation can agree on it.
A local invention cannot be rendered, tested or changed with the system and
will be declared differently by the next consumer.

.. important::

   **Web components first.** ``<sds-code code-lang="bash">``, never a ``div``
   with the classes on it. The classes are the fallback for surfaces that run
   no JavaScript — not the front door — and a page that writes an element's
   own ``sds-x__y`` names has taken a copy of something only the system may
   change.

Where to read on
================

.. list-table::
   :header-rows: 1

   * - Page
     - What it answers
   * - :doc:`layout`
     - the page itself: bar, rail, column, bands, footer, and where the
       layout sheds as the window narrows
   * - :doc:`stylesheets`
     - how the stylesheets are written: the layers, the flow contract, the
       property sets, and what nesting may do
   * - :doc:`components/index`
     - every element — what it is for, what it takes, what goes between its
       tags, and the classes it emits
   * - :doc:`documents`
     - the second stylesheet, for prose a renderer produced

Non-negotiable
==============

.. warning::

   **Never a colour literal.** Not a hex, not an ``rgb()``, not a named
   colour. If nothing fits, the answer is a new token rather than a local
   value.

.. warning::

   **One accent, three places.** ``--accent`` appears on the active navigation
   item, on a shell prompt and on the wordmark's pipe. A fourth use makes the
   first three stop meaning anything.

.. seealso::

   ``SKILL.md`` carries the operating rules into the design bundle. What is
   here is the interface and the reason for its constraints;
   :doc:`/design-system/index` does the same for visual decisions, with the
   rendered evidence beside them.
