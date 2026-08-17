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
# dependencies and the browser. If what declares them has changed, exec-ing
# into the running container answers about a tree that is not this one — so it
# is rebuilt and restarted here rather than warned about. A warning that a
# reader has to act on is a warning a reader learns to scroll past, and the
# thing behind this one is a gate running against the wrong dependencies.
#
# Compared by content, against the copies the image kept of what it installed
# from — and by what those files declare rather than byte for byte, so a
# release writing its own version number is not a reason to install anything
# again. The timestamp said "changed" after every checkout and every stash,
# which is how the old warning came to be ignored.
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
    stale=$($compose exec -T app node -e '
      const { readFileSync } = require("node:fs");
      /* Everything about the manifests except what this repository calls
         itself: a release writes its own version into both and into the
         workspace entries of the lock, and rebuilding for that would install
         the same dependencies again. A dependency version is not stripped —
         it is under node_modules, and it is the whole question. */
      const deps = (path) => {
        const json = JSON.parse(readFileSync(path, "utf8"));
        delete json.version;
        for (const [name, entry] of Object.entries(json.packages ?? {})) {
          if (!name.startsWith("node_modules")) delete entry.version;
        }
        return JSON.stringify(json);
      };
      const stale = [];
      for (const file of ["package.json", "package-lock.json"]) {
        try { if (deps(`/image/${file}`) !== deps(`/app/${file}`)) stale.push(file); }
        catch { stale.push(file); }
      }
      try {
        if (readFileSync("/image/Dockerfile", "utf8") !== readFileSync("/app/.infra/Dockerfile", "utf8")) stale.push("the Dockerfile");
      } catch { stale.push("the Dockerfile"); }
      console.log(stale.join(", "));
    ' 2>/dev/null || true)
    if [ -n "$stale" ]; then
      printf '\n  %s changed since this image was built — rebuilding, then running\n  (a task against the dependencies of another tree answers nothing)\n\n' \
        "$stale" >&2
      $compose up -d --build app >&2
    fi
    exec $compose exec $tty app "$@"
    ;;
esac

exec $compose run --rm --build $tty app "$@"
