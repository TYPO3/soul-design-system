:navigation-title: Illustrations

=============
Illustrations
=============

Illustrations support a tool or article without explaining it. They give a
card a visual register after its heading and summary have already named the
subject. If position, connection, quantity or a label in the picture has to
be understood, use a diagram instead.

That separation also makes an illustration safe to crop or reduce: the copy
still carries the subject when a decorative edge leaves the frame. A diagram
cannot make the same trade, because its positions and labels are the claim.

An illustration occupies an explicit media slot. It is never a page ground
behind text: page surfaces stay flat, and keeping the picture inside its own
frame makes clear where decoration ends and content begins.

The language
============

- One person, object or still-life gesture, reduced to five to eight broad,
  hard-edged silhouettes.
- A flattened, almost orthographic view. Use overlap and at most two flat
  tones per object instead of realistic perspective, materials or lighting.
- Near-black charcoal, warm greys and muted taupes on a quiet, nearly neutral
  warm-white ground.
- One contained field of regular halftone dots and exactly one small
  ``#FF8700`` detail. Neither carries explanatory meaning.
- No text, labels, arrows, charts, workflows, code or UI screens.

Every illustration is a 1200 × 750 PNG with crop-safe space around its
subject. The same file is used unchanged in light and dark mode. Its
warm-white ground is the canvas of the image, not an attempt to merge into
the page around it. A separate dark rendering would duplicate a decorative
asset and let its composition drift even though the bitmap already carries
the ground it needs.

The set
=======

.. specimen:: guidelines/illustrations-set.card.html
   :viewport: 1400x920
   :title: Illustrations — the set

Drawing another one
===================

The rules above with the generator's own vocabulary around them — the medium,
the negative constraints and how a subject is chosen. It is here in full
rather than behind a link because it is handed over rather than read: copy the
whole block and replace ``[SUBJECT]``, which is the one field that changes.
Rewriting the medium or the rendering language starts a second style, and a
set in two styles is no longer a set.

The prompt deliberately carries no register of subjects already drawn.
``packages/frontend/assets/placeholders/`` owns that list; copying it into a
prompt would turn the instructions for the next image into an inventory that
can quietly fall behind the assets.

.. literalinclude:: illustration-prompt.md
   :language: markdown
   :caption: The illustration prompt — replace only the subject
