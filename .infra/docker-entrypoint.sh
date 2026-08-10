#!/bin/sh
# Make the tree complete before anything runs.
#
# `fonts/` and `assets/icons/` are generated from npm packages and are not in
# git. The image builds them, but the compose file bind-mounts the project
# over /app so an edit on the host is visible inside — and that mount hides
# whatever the image put there. A host that has never run these generators
# therefore presents an empty `fonts/`, and every card renders in system-ui
# with no icons, which looks like a design bug and is not one.
#
# `assets/icons.ts` is worse than cosmetic: the components import it, so its
# absence is a build error rather than a visual one.
#
# Regenerating is a few hundred milliseconds and idempotent, so it happens
# whenever the artefact is missing rather than being left to a human to
# remember.
set -e

if [ ! -d /app/fonts ] || [ -z "$(ls -A /app/fonts 2>/dev/null)" ]; then
  echo "fonts/ is empty — generating" >&2
  node /app/scripts/fonts.ts >&2
fi

if [ ! -f /app/src/lib/icons.generated.ts ] || [ ! -d /app/assets/icons ] || [ -z "$(ls -A /app/assets/icons 2>/dev/null)" ]; then
  echo "assets/icons is incomplete — generating" >&2
  node /app/scripts/icons.ts >&2
fi

exec "$@"
