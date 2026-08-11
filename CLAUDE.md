# CLAUDE.md

Read [AGENTS.md](AGENTS.md) first. It routes to every other document, says
which paths are source and which are generated, and lists the tasks and the
gate. This file holds nothing beyond it — the three lines below are the ones
worth having in context before the first tool call.

- **Everything runs in the container.** `make <task>`, never `npm run` and
  never a Node toolchain on the host. `make` alone prints the list.
- **`make start` takes the stack down before bringing it up.** To see whether
  it is running, `docker compose -f .infra/docker-compose.yml ps` — restart
  only when `.infra/` changed.
- **Do not edit generated files.** `components/`, `guidelines/`, `screens/`,
  `dist/`, `ds-bundle/`, `fonts/`, `assets/icons/` all come from `src/` and
  `stories/` via a task. AGENTS.md has the mapping.

Before calling anything done: `make verify` and `make test`, both green, with
no addon, spec or threshold weakened to get there.
