#!/bin/sh
# Run a task in the container.
#
# In the one that is already up, if there is one. `make start` leaves `app`
# running with nothing to do, and the working tree is bind-mounted into it, so
# a source edit is already inside — there is nothing to copy and nothing to
# build, and a task starts in milliseconds instead of seconds.
#
# Otherwise a fresh container, built first. That is the path on a clean
# checkout and in CI, where nothing is running and `--build` is the only thing
# that makes an edited Dockerfile take effect.
#
# Two things are in the image rather than in the mount: the installed
# dependencies and the browser. If what declares them has changed since the
# container started, exec-ing into it runs against the old ones — so that is
# checked and said out loud rather than left to be debugged.
set -e

# `-T` unless there is a terminal to attach: `make shell` wants one, and every
# other task is a pipe whose output make is reading.
tty=-T
[ -t 0 ] && tty=

here=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
compose="docker compose -f $here/docker-compose.yml"

running=$($compose ps --status running --services 2>/dev/null || true)

case "
$running
" in
  *"
app
"*)
    id=$($compose ps -q app 2>/dev/null || true)
    started=$(docker inspect -f '{{.State.StartedAt}}' "$id" 2>/dev/null || true)
    if [ -n "$started" ]; then
      at=$(date -d "$started" +%s 2>/dev/null || echo 0)
      for f in "$here/../package-lock.json" "$here/Dockerfile"; do
        [ -f "$f" ] || continue
        if [ "$at" -gt 0 ] && [ "$(date -r "$f" +%s)" -gt "$at" ]; then
          printf '\n  %s changed since the container started — run `make restart`\n  (running against the dependencies it was built with)\n\n' \
            "$(basename "$f")" >&2
        fi
      done
    fi
    exec $compose exec $tty app "$@"
    ;;
esac

exec $compose run --rm --build $tty app "$@"
