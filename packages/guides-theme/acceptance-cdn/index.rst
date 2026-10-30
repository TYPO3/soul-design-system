=====================
The drop-in on a CDN
=====================

This page renders with ``<cdn>jsdelivr</cdn>``. The stylesheet, the script,
the faces and the sprites come from jsDelivr, at the release of the theme.
The site carries only its own files.

.. button-bar::

   .. button:: Read the page again
      :href: /index
      :icon: actions-book

   .. button:: Copy
      :href: /index
      :icon: actions-clipboard
      :icon-only:

.. code-block:: php

   $cdn = 'jsdelivr';

.. diagram::

   flow columns=1,1 gap=120,16
   title "A page and its drop-in"
   description "The page loads the stylesheet and the script from a CDN."

   page "The page" at=0,0
   cdn "jsDelivr" at=1,0
   page -> cdn "soul.css, soul.js"

.. diagram::
   :zoomable:

   flow columns=1,1 gap=120,16
   title "A drawing the reader can open"
   description "The viewer draws it again, with the engine from the CDN."

   page "The page" at=0,0
   viewer "The viewer" at=1,0
   page -> viewer "a press"
