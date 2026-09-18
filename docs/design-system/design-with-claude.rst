:navigation-title: Design with Claude

==================
Design with Claude
==================

Claude designs from a Design System artifact on claude.ai: a brand book, the
tokens, a bundle of the elements, and rendered cards it can open. This
repository builds the files such an artifact keeps.

Import it once into a design system of your own, then design against it. The
artifact is yours, and ``make design-sync`` is an ordinary task.

What you need
=============

- **Docker and Make.** Every command here runs in the repository's container.
- **Claude Code**, with the Artifact tool and a claude.ai login (``/login``).
  The tool publishes files into an artifact through that login.
- **An account that can make a "Design System" artifact.** The type is one
  of the Artifact types the account lists. ``Artifact list scope:types``
  in Claude Code shows it.

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

      It builds the files, runs the gate, says what will change, and writes
      ``.design-sync/.cache/upload-plan.json``. A first run reports no link
      and no removals, because nothing is in the artifact yet.

      .. warning::

         A red gate stops it, and nothing goes up. Every fault it names is
         invisible in review and wrong in every design after it. An undefined
         class does nothing, a broken reference ships an unstyled card, the
         page crops an oversized card.

   .. step:: Upload it
      :name: upload-it

      In Claude Code, in this checkout:

      .. code-block:: text

         Run the plan in .design-sync/.cache/upload-plan.json with the Artifact tool,
         step by step, in its order.

      The plan carries the decisions:

      - **With no link set, it makes a new design system from the type.** A
        fresh one starts empty, so this upload is everything in it.
      - **With one set, it reads the artifact first.** The record of what the
        system holds, the index, and the list of its files. The tool refuses a
        publish into an artifact the session has not read.
      - **Uploads first, then the files, then the index.** Every picture goes
        to the artifact's store one call at a time. ``make design-index``
        writes the ids it gets back into the previews and the index.
      - **It reads the index back** at the end, because a publish result is
        not proof.

      .. note::

         The plan is the whole instruction, order included. An agent that
         improvises the upload forgets a renamed file the way a hand-derived
         list does.

   .. step:: Make sure the link is set
      :name: remember-where-it-landed

      The tool addresses an artifact by its link. Without it here, the next
      sync makes a second system. `Upload it <#upload-it>`__ reported it, so
      this step confirms:

      .. code-block:: bash

         make design-project

      It names the link a sync uses and which of its three sources answered.
      To set it by hand, give it the link the upload reported:

      .. code-block:: bash

         make design-project ARGS=https://claude.ai/artifact/Xk2pQ9rTvB4nLm7sWc3dYe

      The link lands in ``.design-sync/config.local.json``, untracked. The
      task refuses to replace a link this clone already has; ``ARGS="<url>
      --force"`` is how you mean it.

      Nothing set, and the reported line gone? Paste this into Claude Code:

      .. code-block:: text

         List my artifacts of the type "Design System" with their links, newest
         first, and run `make design-project ARGS=<the newest link>`.

   .. step:: Record what the artifact holds

      .. code-block:: bash

         make design-synced

      Without it, ``make design-status`` and ``make design-plan`` answer from
      the previous upload.

   .. step:: Open it

      Open the artifact. The cover stands above the brand book, the tokens
      have their sections, and every card opens under its group. The page
      compiles its own cards, ``tokens.css`` and the README's index on that
      first open.

Designing with it
=================

Everything the agent needs is there before your first sentence:

- ``README.md``: the conventions, the screens to start from, and the index
  the page appends
- ``guidelines/build-rules.md``: ``SKILL.md``, the operating instruction
- each element's ``README.md`` and ``.d.ts``: its attributes, and what goes
  between its tags
- each card's ``README.md``: its classes and its markup, as a block to copy
- each screen's ``preview.html``: a complete page at its design width

How to ask for a surface
------------------------

**Name the surface and its job, not its markup.** "A get-started page for an
extension: what it does, how it installs, the first command." The layout is
a decision already made; :doc:`screens` says which shape answers which job.

**Start from a screen where one fits.** It settles the shell, header,
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
   * - It links ``components/bundle.css`` and writes no CSS of its own
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

A token moved, a component grew. The same three stops, into the system the
link names.

.. steps::

   .. step:: Build, gate, and plan what will change

      .. code-block:: bash

         make design-sync

   .. step:: Push what moved

      .. code-block:: text

         Run the plan in .design-sync/.cache/upload-plan.json with the Artifact tool.

      It reads what the artifact holds before it writes anything, uploads
      only the pictures that changed, and publishes only the files that
      moved.

   .. step:: Record that the artifact now holds this build

      .. code-block:: bash

         make design-synced

Look at what moved. The gate checks mechanics, not judgement. When ``make
design-status`` lists changed cards, run ``make baseline`` before the change
and ``make shots && make diff`` after.

.. note::

   On a fresh clone the plan lists no removals and says so. The record of
   what the artifact holds is a local cache this clone never wrote. The
   plan's preflight fetches it; then run ``make design-plan`` again.

Which design system a sync lands in
-----------------------------------

``make design-project`` reads three places and reports which one answered.
That explains a sync that arrived somewhere unexpected.

**Only a system made from the "Design System" type is a target, and a first
import makes its own.** The plan reads the artifact's index before it writes
a byte and stops on one without the type's marker.

A new one, from the start
-------------------------

.. code-block:: bash

   make design-project ARGS=--forget

That is the whole reset. The link goes, and with it the record of what the
old design system held, the cached index, the plan and the uploads in
flight. The next ``make design-sync`` is a first import again:
the plan makes a new design system, and you set its link as in `Make sure
the link is set <#remember-where-it-landed>`__.

All of it goes together on purpose. With the record kept and the link on a
new design system, the next plan computes removals for files that were never
there. Nothing else changes. The old artifact stays until you delete it, and
the screenshots of a visual review stay in the cache.

.. confval:: SDS_DESIGN_SYSTEM
   :type: environment variable
   :required: false

   The design system a sync updates, as the artifact's link, and the first
   source read. Then ``.design-sync/config.local.json``, which ``make
   design-project ARGS=<url>`` writes. Then the committed ``config.json``,
   which carries none, because a clone must not inherit somebody else's. An
   export outranks both files.

When it does not look right
===========================

.. list-table::
   :header-rows: 1

   * - What you see
     - What it is
   * - Every card renders in a system face with no icons
     - The generated fonts and icons are not in the clone.
       ``make verify ARGS=assets`` names what to run.
   * - A card shows a broken picture
     - The preview names an upload the store had no id for when the file went
       up. ``make design-index`` fills the ids; run the plan from step 2.
   * - The gallery lists a picture twice
     - A changed picture is a new upload, and nothing removes the old blob.
       Delete the old one in the page.
   * - A second design system appeared beside yours
     - That sync ran with no link. Set it, see `Make sure the link is set
       <#remember-where-it-landed>`__, then delete the duplicate.
   * - The plan reports no removals
     - This clone has no cache of what the artifact holds; see the note above.
   * - ``make design-sync`` stops before the plan
     - The gate is red. Fix what it names and run it again.
   * - The tool refuses the publish
     - The session has not read the artifact, or a path it touches. Run the
       plan's preflight first, in the same session.

What goes up
============

``make build`` writes ``.out/bundle/project/``, the tree a Design System
artifact keeps:

.. code-block:: text

   .out/bundle/project/
     design-system.json    the index: the system's name, the asset groups, the last change
     tokens.json           every token, one list per family, a colour per theme
     README.md             the conventions, and the screens to start from
     guidelines/           the written rules, and the two prompts
     components/
         bundle.js         the elements, as one classic script — window.SDS
         bundle.css        the faces, the tokens and the class layer, as one sheet
         index.d.ts        every element's properties, read out of its source
         <Class>/          an element: README.md and <Class>.d.ts
         <Name>/           a card: preview.html at a declared size, and README.md
         <Name>Screen/     a whole page to start a design from
         Cover/            the system's face, above the brand book
     fonts/                the faces
     assets/<Group>/       the marks, the icons, the drawings, the pictures — uploads the index names
     icons/                the icon lookup and the sprites
     sync.json             the record the next sync compares against

Why cards and not descriptions
==============================

Every component ships as a static HTML card at a declared viewport, generated
from the story that documents it in Storybook.

.. warning::

   A card contains **no custom elements**. It holds the markup the element
   *produces*, so it reads with the stylesheet alone, and the page shows the
   same card whatever the bundle does.

Beside each card is a ``README.md``: what the component is, which classes it
uses, and its markup as a block to copy. The agent reads that when it places
one.

Why every element ships a contract
==================================

A card cannot carry a custom element, so the cards alone describe a system of
classes. An agent that only has classes writes classes. So the elements have
their own place.

``components/<Class>/`` is what the elements *are*: a ``.d.ts`` and a
``README.md`` per tag, which ``scripts/lib/elements.ts`` compiles out of the
element's own source. The properties Lit registers, the attribute each
answers to, and what the props interface says about it. A second copy of a
component's surface goes stale at the next property, so this one reads the
source.

``components/bundle.js`` is the bundle that registers them, built from the
same entry as the drop-in's ``soul.js``. The artifact loads a classic script
before every preview, and a module cannot be one. So this is the same code
under the other format. It registers the elements as it loads and puts every
class under ``window.SDS``. A project installs the module; ``make verify
ARGS=dist`` checks that one against ``src/``. ``make build`` stops if ``make
dist`` has not run, because the stylesheet ships from there.

What the gate checks
====================

.. code-block:: bash

   make verify

- every card declares a ``@dsCard`` header, and renders at its declared size
- every class in use has a definition in the stylesheets
- every local reference resolves
- every card comes from a story, and every story has its card
- the committed drop-in still matches its sources
- every name the conventions header writes exists in the built stylesheet

.. seealso::

   The written rules that travel with the upload are ``SKILL.md``. The pages
   in this section keep each rule beside its reason and its rendered
   evidence.
