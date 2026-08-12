:navigation-title: Soul
:layout: marketing

===================================
One system, from design to delivery
===================================

.. hero:: /_images/design-system-workbench.png

   Soul gives TYPO3 community projects a shared visual language for product
   pages, documentation and interface code — so every hand-off starts from the
   same decisions.

   Start with measured screens and rendered components. Publish from
   reStructuredText or Markdown. Ship plain classes or web components. Every
   route resolves to the same tokens and the same markup contract.

   .. The sections below make these routes visible, while the hidden tree remains
      the source for the bar, the rail and the breadcrumb.

   .. toctree::
      :titlesonly:
      :hidden:

      design-system/index
      guides-theme/index
      frontend/index

.. card-grid::
   :columns: 3
   :gap: 0

   .. card:: Design with Claude
      :href: /design-system/design-with-claude
      :label: Design system
      :icon: actions-brush
      :action: Start designing with Claude

      Give Claude the written guidelines, rendered components and finished
      screens it needs to design with the same system developers ship.

   .. card:: Publish documentation as part of the product
      :href: /guides-theme/index
      :label: For documentation teams
      :icon: actions-book
      :action: Explore the Guides theme

      Turn reStructuredText or Markdown into a site whose navigation, search
      and content components already belong to the interface around it.

   .. card:: Ship the interface without a framework
      :href: /frontend/index
      :label: For developers
      :icon: actions-code
      :action: Use the frontend

      Link the class layer directly, then add the custom elements where a
      surface needs behaviour. Server-rendered markup remains the contract.

.. band:: The same decisions survive every hand-off
   :quiet:
   :id: outcomes

Design systems often stop at a design file or a component library. Soul keeps
the design evidence, the documentation renderer, the class vocabulary and the
elements connected to the same sources.

.. card-grid::
   :columns: 2
   :gap: 0

   .. card:: Readers keep their bearings
      :label: Across community projects
      :icon: actions-eye

      Product pages, guides and working interfaces use the same navigation,
      type, controls and states. The next project feels familiar before its
      content is familiar.

   .. card:: Changes keep their source
      :label: Across design and code
      :icon: actions-code-merge

      A colour changes in a token, a component changes in its element, and a
      specimen is regenerated from the story. The hand-off carries evidence
      instead of a second interpretation.

.. band:: One contract, whichever route a project takes
   :id: layers

**Tokens** hold the decisions. Every colour, size, space, radius and duration
is declared under a semantic name. Light and dark sit in the same declaration,
so one mode cannot quietly drift from the other.

**Classes** are the vocabulary. ``sds-`` names what a thing *is* —
``.sds-card``, ``.sds-note--warn``, ``.sds-table--compact`` — and gives
server-rendered markup the complete visual system without requiring
JavaScript.

**Elements** add behaviour. Each renders light DOM and emits the classes
above, so a component upgrades the existing contract instead of introducing a
second one.

.. table:: Choose the entry point the surface needs
   :widths: auto

   ==========  ==========================  ===================================
   Layer       Written as                  Reach for it when
   ==========  ==========================  ===================================
   Tokens      ``var(--surface-card)``     a value is needed at all
   Classes     ``class="sds-card"``        a server produces the markup
   Elements    ``<sds-note tone="warn">``  the surface has behaviour or state
   ==========  ==========================  ===================================

.. band:: Start where the work is
   :quiet:
   :id: start

The system does not ask every project to adopt the same toolchain. It asks
each toolchain to speak the same visual language.

.. card-grid::
   :columns: 2
   :gap: 0

   .. card:: Explore the rules and their specimens
      :href: /design-system/index
      :label: Design system
      :icon: actions-eye-link
      :action: Explore the design system

      See the colour, type, spacing, state and brand decisions beside the
      rendered evidence that keeps each rule concrete.

   .. card:: Render a project of your own
      :href: /guides-theme/example
      :label: Put it to work
      :icon: actions-template
      :action: Copy the example project

      Start from a complete Guides project, then replace its content while the
      shell, search, navigation and publishing workflow stay in place.
