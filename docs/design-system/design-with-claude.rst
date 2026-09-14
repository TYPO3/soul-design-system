:navigation-title: Design with Claude

==================
Design with Claude
==================

Claude at claude.ai/design designs from an uploaded system: a stylesheet, the
tokens, the written rules, and rendered cards it can inspect. This repository
builds that upload.

Import it once into a design system of your own, then design against it. The
design system in the app is yours, and ``make design-sync`` is an ordinary
task.

What you need
=============

- **Docker and Make.** Every command here runs in the repository's container.
- **Claude Code**, with the ``/design-sync`` skill and a claude.ai login
  (``/login``). The first call into the app asks to add design access to
  that login; see `Upload it <#upload-it>`__.
- **An account that can open claude.ai/design.** Open it in a browser with
  the same account. The account holds the design access, not a command.

The first import
================

.. steps::

   .. step:: Get the repository

      .. code-block:: bash

         git clone https://github.com/TYPO3/soul-design-system.git
         cd soul-design-system

      Every command below runs from there.

   .. step:: Build the upload

      .. code-block:: bash

         make design-sync

      It builds the bundle, runs the gate, says what will change, and writes
      ``.design-sync/.cache/upload-plan.json``. A first run reports no project
      id and no deletes, because nothing is in the app yet.

      .. warning::

         A red gate stops it, and nothing goes up. Every fault it names is
         invisible in review and wrong in every design after it. An undefined
         class does nothing, a broken reference ships an unstyled card, the
         pane crops an oversized card.

   .. step:: Upload it
      :name: upload-it

      In Claude Code, in this checkout:

      .. code-block:: text

         /design-sync

      It executes the plan in the plan's order. The plan carries the
      decisions:

      - **With no id set, it creates a new design system.** A fresh one starts
        empty, so this upload is everything in it.
      - **With one set, it checks it first.** The plan stops before it writes
        a byte unless ``get_project`` answers ``PROJECT_TYPE_DESIGN_SYSTEM``.
      - **It reports the new id** so you can set it here. That is the next
        step.
      - **It reads the sentinel back** at the end, because that one write
        reports success and can land nothing.

      **Claude Code asks before it reaches the app.** The first design call
      requests a scope, ``user:design:write``, on your claude.ai login. You
      approve it once. After that only the acts ask: the new design system,
      and the plan lock, which shows the exact writes and deletes first.

      The approval can still end in *design scopes not granted*, and the same
      line says why: a token refresh succeeded. A refresh returns the scopes
      the token already had, and only a fresh login adds one. Log out, log in,
      and read the consent screen. If it does not offer design access, the
      account has none. Open claude.ai/design in a browser with that account
      to see where you stand.

      .. note::

         No ``/design-sync`` in your Claude Code? Ask the agent to execute
         ``.design-sync/.cache/upload-plan.json`` step by step. The file is
         the whole instruction, order included.

   .. step:: Make sure the id is set
      :name: remember-where-it-landed

      The app addresses an uploaded system by a project id. Without it here,
      the next sync imports a second copy. `Upload it <#upload-it>`__ set it,
      so this step confirms:

      .. code-block:: bash

         make design-project

      It names the id a sync uses and which of its three sources answered. To
      set it by hand, give it the uuid the upload reported:

      .. code-block:: bash

         make design-project ARGS=0189a4c1-6f2e-4b7a-9c31-2d8f5e0a7b64

      The id lands in ``.design-sync/config.local.json``, untracked. The task
      refuses to replace an id this clone already has; ``ARGS="<uuid>
      --force"`` is how you mean it.

      Nothing set, and the reported line gone? Paste this into Claude Code:

      .. code-block:: text

         List my claude.ai design systems with their ids, newest first — the one the
         last upload created is the newest — and run `make design-project ARGS=<that id>`.

   .. step:: Record what the app holds

      .. code-block:: bash

         make design-synced

      Without it, ``make design-status`` and ``make design-plan`` answer from
      the previous upload.

   .. step:: Open it in the app

      Open the design system at claude.ai/design. The cards appear on that
      first open: the upload writes files, and the app compiles its card index
      when it next finds the sentinel.

      The Design System pane then lists the cards under their groups, and the
      Starting Points picker offers the screens.

Designing with it
=================

Everything the agent needs is there before your first sentence:

- ``README.md``: the conventions, and every card with the path to its prompt
- ``guidelines/build-rules.md``: ``SKILL.md``, the operating instruction
- each element's ``.prompt.md``: its attributes, and what goes between its tags
- each card's ``.prompt.md``: its classes and its markup, as a block to copy
- ``screens/``: complete pages, offered as Starting Points

How to ask for a surface
------------------------

**Name the surface and its job, not its markup.** "A get-started page for an
extension: what it does, how it installs, the first command." The layout is
a decision already made; :doc:`screens` says which shape answers which job.

**Start from a Starting Point where one fits.** It settles the shell, header,
measure and footer in one move.

**Name a component by its element.** ``<sds-code code-lang="bash">``, not a
``div`` with classes on it.

**Ask the agent to name a gap, not fill it.** "If the system has no answer for
this, say so instead of CSS." A gap closes here, in the component. CSS in a
design is the one part of the output that cannot travel.

What to check in the result
---------------------------

.. list-table::
   :header-rows: 1

   * - Check
     - Why
   * - It links ``styles.css`` and writes no CSS of its own
     - That stylesheet is the whole contract: tokens, then the class layer.
   * - Every class is one the system defines
     - An invented name does nothing. An ``sds-x__y`` part belongs to its
       component.
   * - No ``spec-*`` class anywhere
     - Those draw the specimen cards' chrome and stop at the card.
   * - One accent, no emoji
     - ``--accent`` marks three things; status is a colour and a glyph.
       :doc:`colours` carries the rest.
   * - It holds up in both modes
     - The tokens carry light and dark. Switch the mode and read it again.

A design in your project
========================

Markup plus one stylesheet, so it moves as it stands. Install the package or
copy the drop-in: :doc:`../frontend/quickstart`, and
:doc:`../frontend/documents` for a page of prose.

A stylesheet of the design's own does not travel. If the design needed a
declaration the system has no name for, close that gap in the component here.

In Claude Code, in a project of your own
========================================

Claude Code designs a page from a skill it has loaded, and ``SKILL.md`` at
the root of this repository is one. It carries the build rules and the
recipe for a page that goes out as one file: a review, a report, a
claude.ai Artifact. With it loaded, an agent that writes such a page writes
it on this system and not on a palette of its own.

.. steps::

   .. step:: Put the skill where Claude Code reads skills

      .. code-block:: bash

         git clone https://github.com/TYPO3/soul-design-system.git ~/.claude/skills/soul-design-system

      A clone, because the skill names files beside itself:
      ``packages/frontend/dist/soul-inline.css`` and
      ``packages/frontend/dist/soul-finish.js``, both in git. A checkout you
      already have works the same through a symbolic link at that path. The
      directory under ``.claude/skills/`` of one project holds it for that
      project alone.

   .. step:: Name it in the project

      One line in the project's ``CLAUDE.md``:

      .. code-block:: text

         A page for the TYPO3 community, a review or a report among them,
         follows the Soul design system: load the soul-design-system skill
         before you write markup.

      Claude Code loads a skill when a task matches its description, and this
      line makes the match. Without it the agent reads the built-in design
      guidance first and reaches for the system only if it finds one.

   .. step:: Ask for the page

      Name the document and its job, as `How to ask for a surface
      <#how-to-ask-for-a-surface>`__ says. The agent writes the elements,
      renders them with ``soul-finish.js``, pastes the sheet, and publishes.
      What to check in the result is the list above, plus: the page carries no
      script, and its title stands before the sheet.

The uploaded system, kept current
=================================

A token moved, a component grew. The same three stops, into the system the id
names.

.. steps::

   .. step:: Build, gate, and plan what will change

      .. code-block:: bash

         make design-sync

   .. step:: Push what moved

      .. code-block:: text

         /design-sync

      It reads what the app holds before it writes anything.

   .. step:: Record that the app now holds this build

      .. code-block:: bash

         make design-synced

Look at what moved. The gate checks mechanics, not judgement. When ``make
design-status`` lists changed cards, run ``make baseline`` before the change
and ``make shots && make diff`` after.

.. note::

   On a fresh clone the plan lists no deletes and says so. The record of what
   the app holds is a local cache this clone never wrote. The upload does not
   change, since the skill reads the app itself.

Which design system a sync lands in
-----------------------------------

``make design-project`` reads three places and reports which one answered.
That explains a sync that arrived somewhere unexpected.

**Only a design system is a target, and a first import makes its own.** The
plan asks ``get_project`` before it writes a byte and stops on anything else.
A project's type never changes after creation, so the answer to a wrong target is a
new design system. That is what a first import creates anyway.

A new one, from the start
-------------------------

.. code-block:: bash

   make design-project ARGS=--forget

That is the whole reset. The id goes, and with it the record of what the old
design system held and the plan against it. The next ``make design-sync`` is
a first import again: ``/design-sync`` creates a new design system, and you
set its id as in `Make sure the id is set <#remember-where-it-landed>`__.

Both go together on purpose. With the record kept and the id on a new design
system, the next plan computes deletes for files that were never there.
Nothing else changes. The old design system stays in the app until you
delete it there, and the screenshots of a visual review stay in the cache.

.. confval:: SDS_DESIGN_PROJECT
   :type: environment variable
   :required: false

   The design system a sync updates, as its project id, and the first source
   read. Then ``.design-sync/config.local.json``, which ``make design-project
   ARGS=<uuid>`` writes. Then the committed ``config.json``, which carries
   none, because a clone must not inherit somebody else's. An export outranks
   both files.

When it does not look right
===========================

.. list-table::
   :header-rows: 1

   * - What you see
     - What it is
   * - Every card renders in a system face with no icons
     - The generated fonts and icons are not in the clone.
       ``make verify ARGS=assets`` names what to run.
   * - The import ran and the pane is empty
     - Reopen it once: the card index compiles on open. If it stays empty, the
       sentinel did not land. Ask for ``DesignSync get_file
       _ds_needs_recompile``. A 404 means that write reported success and
       landed nothing. Re-run the sentinel step, then reopen.
   * - The pane still shows the previous upload
     - Same cause, one upload later. A stale pane means the sentinel did not
       land.
   * - A second design system appeared beside yours
     - That sync ran with no project id. Set it, see `Make sure the id
       is set <#remember-where-it-landed>`__, then delete the duplicate in
       the app.
   * - The plan reports no deletes
     - This clone has no cache of what the app holds; see the note above.
   * - ``make design-sync`` stops before the plan
     - The gate is red. Fix what it names and run it again.
   * - *DesignSync needs a claude.ai login*, after ``/login``
     - Read the rest of the line. *Refresh succeeded but design scopes not
       granted* means the token kept its old scopes. Log out and in, so the
       consent screen asks again. A consent screen without design access
       means the account has none; see `Upload it <#upload-it>`__.

What goes up
============

``make build`` writes ``.out/bundle/``. It is **flat** where the repo is not,
because that is the shape the pane expects:

.. code-block:: text

   .out/bundle/
     styles.css          the entry point a rendered design links
     _ds_bundle.css      the class layer
     soul.js             the elements, bundled — what a design links
     _ds_bundle.js       the same bundle under the app's own name, which it overwrites
     _specimen.css       the chrome the cards are drawn with
     tokens/             every value, one file per family
     fonts/  assets/     the faces, the icons, the marks
     components/<Group>/<Name>/
         <Name>.html         the card, rendered at a declared size
         <Name>.prompt.md    what it is, which classes it uses, its markup
     components/Elements/<Class>/
         <Class>.d.ts        the element's properties, read out of its source
         <Class>.prompt.md   its attributes, and what goes between its tags
     screens/            whole pages to start a design from
     guidelines/         the written rules, and why they exist

.. confval:: shape
   :type: string
   :default: "package"

   Set in ``.design-sync/config.json``. It pins the converter to this
   repository's own build. With a Storybook config present, the sync kit's
   own detection guesses wrong.

Why cards and not descriptions
==============================

Every component ships as a static HTML card at a declared viewport, generated
from the story that documents it in Storybook.

.. warning::

   A card contains **no custom elements**. The pane opens these files with
   ``styles.css`` and no JavaScript, so a card holds the markup the element
   *produces*. A card with ``<sds-button>`` in it renders nothing.

Beside each card is a ``.prompt.md``: what the component is, which classes it
uses, and its markup as a block to copy. The agent reads that when it places
one.

Why every element ships a contract
==================================

A card cannot carry a custom element, so the cards alone describe a system of
classes. An agent that only has classes writes classes. So the elements have
their own two places.

``components/Elements/<Class>/`` is what the elements *are*: a ``.d.ts`` and a
``.prompt.md`` per tag, which ``scripts/lib/elements.ts`` compiles out of the
element's own source. The properties Lit registers, the attribute each
answers to, and what the props interface says about it. A second copy of a
component's surface goes stale at the next property, so this one reads the
source.

``soul.js`` is the bundle that registers them. A design links it the way a
project does: ``<script type="module" src="soul.js"></script>``. It is a copy
of ``packages/frontend/dist/soul.js``, not a second build. ``make verify
ARGS=dist`` checks that file against ``src/``, and the ``dropin`` suite links
it. So what a design links is what a project installs. ``make build`` stops
if ``make dist`` has not run.

.. warning::

   Never ``_ds_bundle.js``. That name belongs to the app. The app rebuilds
   the file from component sources it can compile, and this system ships
   none it recognises. So it writes an empty namespace over the upload. A
   design that links it loads a script that registers nothing, and
   ``_ds_manifest.json`` reports ``"components": []``.

What the gate checks
====================

.. code-block:: bash

   make verify

- every card declares a ``@dsCard`` header, and renders at its declared size
- every class in use has a definition in the stylesheets
- every local reference resolves, **inside the bundle**
- every card comes from a story, and every story has its card
- the committed drop-in still matches its sources

.. seealso::

   The written rules that travel with the upload are ``SKILL.md``. The pages
   in this section keep each rule beside its reason and its rendered
   evidence.
