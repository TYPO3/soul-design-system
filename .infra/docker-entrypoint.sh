#!/bin/sh
# Make the tree complete before anything runs.
#
# The image builds what is generated, but the compose file bind-mounts the
# project over /app so an edit on the host is visible inside — and that mount
# hides whatever the image put there. A host that has never run the generators
# therefore presents an empty `fonts/`, and every card renders in system-ui,
# which looks like a design bug and is not one.
#
# Everything generated is committed now, so a clone arrives complete and these
# two questions are answered "yes" on any tree that came from git. What is left
# is repair: a directory somebody emptied, or a generator that stopped halfway.
# Ask after a directory rather than what is inside it and this stops running
# entirely, which is how a green tree on a desk once arrived red in CI.
#
# Regenerating is a few hundred milliseconds and idempotent.
set -e

if [ ! -d /app/packages/frontend/fonts ] || [ -z "$(ls -A /app/packages/frontend/fonts 2>/dev/null)" ]; then
  echo "fonts/ is empty — generating" >&2
  node /app/scripts/fonts.ts >&2
fi

if [ ! -d /app/packages/frontend/assets/icons/svgs ] || [ -z "$(ls -A /app/packages/frontend/assets/icons/svgs 2>/dev/null)" ]; then
  echo "assets/icons/svgs/ is empty — generating" >&2
  node /app/scripts/icons.ts >&2
fi

exec "$@"
