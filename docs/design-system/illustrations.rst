:navigation-title: Illustrations

=============
Illustrations
=============

An illustration supports a tool or an article without an explanation. It
gives a card a visual register after its heading and summary have named the
subject. If a reader must understand a position, a connection, a quantity or
a label in the picture, use a diagram.

That separation makes an illustration safe to crop or reduce. The copy still
carries the subject when a decorative edge leaves the frame. A diagram cannot
make the same trade, because its positions and labels are the claim.

An illustration sits in an explicit media slot. It is never a page ground
behind text. Page surfaces stay flat, and the frame shows where decoration
ends and content starts.

The language
============

- One person, object or still-life gesture, reduced to five to eight broad,
  hard-edged silhouettes.
- A flat, almost orthographic view. Use overlap and at most two flat tones
  per object instead of perspective, materials or light.
- Near-black charcoal, warm greys and muted taupes on a quiet, almost neutral
  warm-white ground.
- One contained field of regular halftone dots and exactly one small
  ``#FF8700`` detail. Neither carries a meaning.
- No text, labels, arrows, charts, workflows, code or UI screens.

Every illustration is a 1200 × 750 PNG with crop-safe space around its
subject. The same file serves light and dark mode. Its warm-white ground is
the canvas of the image, not a match for the page. A second dark rendering
is a duplicate asset whose composition drifts.

The set
=======

.. specimen:: guidelines/illustrations-set.card.html
   :viewport: 1400x835
   :title: Illustrations — the set

Another one
===========

The rules above with the generator's vocabulary: the medium, the negative
constraints, the choice of subject. It stands here in full because it is a
thing to hand over. Copy the whole block and replace ``[SUBJECT]``, the one
field that changes. A new medium or a new rendering language starts a second
style, and a set in two styles is no set.

The prompt carries no list of subjects already drawn.
``packages/frontend/assets/placeholders/`` owns that list. A copy in the
prompt is an inventory that falls behind the assets.

.. literalinclude:: illustration-prompt.md
   :language: markdown
   :caption: The illustration prompt — replace only the subject
