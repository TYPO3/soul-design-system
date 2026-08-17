#!/bin/sh
# Make the tree complete before anything runs.
#
# The image builds what is generated, but the compose file bind-mounts the
# project over /app so an edit on the host is visible inside — and that mount
# hides whatever the image put there. A host that has never run the generators
# therefore presents an empty `fonts/`, and every card renders in system-ui,
# which looks like a design bug and is not one.
#
# What is asked about is what git does not keep, and nothing else. Everything a
# package ships is committed now, so the single icons are the whole of it: ask
# after the directory above them and this never runs again, which is how a
# green tree on a desk arrived red in CI.
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
