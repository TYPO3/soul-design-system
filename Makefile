# The only way in. Everything runs in a container.
#
#   make                # this list
#   make storybook      # the documentation surface
#   make verify         # the gate
#   make test           # the Playwright suite
#
# The host needs Docker and Make. Nothing else — no Node version to match,
# no `npm ci`, no `playwright install`. That is the reason this is a Makefile
# and not an npm script: `npm run` would put a Node toolchain back on the
# host, which is the thing being avoided.
#
# What each task actually runs lives in `scripts/task.ts`, once, and is read
# there by the container. This file only decides how to get into one.

# /dev/tcp needs bash; sh has no way to test a port without extra tools.
SHELL := /bin/bash

COMPOSE := docker compose -f .infra/docker-compose.yml
TASK := .infra/task.sh

# The container writes into the bind-mounted tree, so it runs as whoever owns
# it. Without this, everything under .out/ comes back owned by root and the
# next run cannot delete what the last one made.
export SDS_UID := $(shell id -u)
export SDS_GID := $(shell id -g)

# Storybook gets the same port inside and out, so Vite's HMR websocket — which
# addresses the port Storybook was told to listen on — resolves from the
# browser. Still free-port selection, just decided here instead of by Docker,
# because only one side of the mapping can be chosen late.

# Into the container that is already up, or a fresh one if none is — see
# `.infra/task.sh`. Every task used to be its own `run --build`: a container
# per command, and a cache check over the whole tree before any of them.
RUN := $(TASK) node scripts/task.ts

# Every task that is just "run this in the container". Keep in step with the
# TASKS map in scripts/task.ts, which is where they are defined.
TASKS := verify test cards embed chrome typecheck fit ssr coverage php css build dist split guides fonts icons \
         diagrams baseline shots diff look design-project design-sync design-status design-plan design-synced

# The long-running ones. `app` is among them: it holds the environment every
# task above runs in, so a task is an `exec` rather than a new container.
SERVICES := storybook site acceptance dist app

# What each of them is for, and what to say about one that publishes no port.
# Read by `status`, in this order — the order a reader opens them in, not the
# alphabetical one Docker answers with.
SURFACES := \
	'storybook||guidelines, components with controls, a11y' \
	'site||the rendered documentation, as it will be served' \
	'acceptance||every node the renderer can emit, published never' \
	'dist|(watching the frontend package)|rebuilds the drop-in on every edit' \
	'app|(idle)|every make task runs in here'

.PHONY: help tasks $(TASKS) release notes mounts start status stop restart logs shell clean
.DEFAULT_GOAL := help

# A bind-mount path the host does not have is created by Docker, as root —
# and `.out/storybook` is one, so a tree that has generated nothing yet ends
# up with a root-owned `.out/` that the container cannot write into. Made
# here first, by whoever ran make, which is who the container runs as.
mounts:
	@mkdir -p .out/storybook

# Written out rather than read from the container: a help screen that first
# builds a Docker image is not a help screen. `make tasks` asks the
# authoritative list, which is the TASKS map in scripts/task.ts.
help:
	@echo 'Everything runs in a container. The host needs Docker and Make.'
	@echo
	@echo '  make start           bring the stack up and report what is running'
	@echo '  make status          what is running, and where it answers'
	@echo '  make verify          the gate: headers, classes, refs, fit, cards, types'
	@echo '                       one check while working: make verify ARGS=classes'
	@echo '                       the names: make verify ARGS=--help'
	@echo '  make test            the Playwright suite'
	@echo '                       one spec: make test ARGS=tests/parity.spec.ts'
	@echo '  make cards           regenerate the component cards from their stories'
	@echo
	@echo '  make guides          render the documentation fixture into .out/site/'
	@echo '  make build           assemble .out/bundle/, the upload payload'
	@echo '  make dist            the publishable ESM package and its types'
	@echo '  make release ARGS=0.2.0  gate, suite, write the version, commit, tag (never pushes)'
	@echo '  make notes           what the release page will say; ARGS=v0.1.1 for a tag'
	@echo '  make design-sync     build + verify + what-would-change + upload plan'
	@echo '  make design-project  which claude.ai design system a sync uploads into;'
	@echo '                       ARGS=<uuid> sets it, and without one a re-sync'
	@echo '                       makes a new design system instead of updating yours'
	@echo '  make design-status design-plan design-synced   the steps individually'
	@echo
	@echo '  make baseline shots diff     screenshot before, after, compare'
	@echo '  make look ARGS=screens/x.html  photograph one page in both modes'
	@echo '  make fonts icons     regenerate from the npm packages'
	@echo '  make coverage        is every component shown in a story, a class and the render'
	@echo '  make php             format the theme’s PHP; ARGS=--check to only report'
	@echo '  make fit typecheck'
	@echo
	@echo '  make stop            take everything down'
	@echo '  make restart         stop, then start'
	@echo '  make logs            follow the Storybook log'
	@echo '  make shell           a prompt inside the image'
	@echo '  make clean           remove containers, volumes and build output'
	@echo '  make tasks           the task list, from the container'
	@echo
	@echo 'Extra flags: make cards ARGS=--check'

tasks:
	@$(RUN) --help

# ARGS reaches the task inside the container: `make cards ARGS=--check`.
$(TASKS) tasks start shell release notes: mounts
$(TASKS):
	@$(RUN) $@ $(ARGS)

# What the release page will say, before there is a page. The log comes from
# the host for the same reason the commit and the tag do — git is not in the
# image — and the container turns it into the document. `.github/workflows/ci.yml`
# runs the same two halves and hands the file to `gh release create`.
#
# `ARGS=v0.1.1` reads a tag that exists; without one it is the version this
# tree carries, from the branch as it stands.
notes:
	@git log --no-merges --pretty=format:'%h%x1f%D%x1f%s' | $(RUN) notes $(ARGS)

# The one task that finishes on the host. Writing the version happens in the
# container like everything else; the commit and the tag are git, which this
# image deliberately does not carry and which needs the name of whoever is
# releasing. The push is not here, and that is the whole of what a person
# still decides — see MAINTAINERS.md.
#
# `ARGS=` is emptied for the sub-make on purpose: a variable set on the command
# line is inherited by every make below it, so `ARGS=0.1.0` arrived at `verify`
# as the name of a check and the gate refused it.
#
# The gate and the suite run first and run here, not in a sentence somebody
# reads beforehand: a tag is the one thing in this repository that is never
# taken back, so the run that would have caught it has to be the run that
# cannot be skipped. Before the version is written rather than after, so a red
# gate leaves the tree exactly as it was and the same command works again.
#
# And it refuses a dirty tree, because a green gate over a tree carrying work
# that will not be in the commit says nothing about what the tag points at —
# which is the one way a hard gate is still not one.
#
# Only the paths the task itself names are committed, so work in flight beside
# them stays where it is — and they are asked for before the version is
# written, because the write is the last thing that happens in a container.
# A flag or no argument is a question rather than a release: it is handed to
# the task and nothing else here runs.
release:
	@case '$(ARGS)' in ''|-*) exec $(RUN) release $(ARGS) ;; esac; \
	 if [ -n "$$(git status --porcelain)" ]; then \
	   printf '\n  the working tree is not clean. A release is cut from what the gate ran\n  over, and none of this would be in the commit:\n\n'; \
	   git status --short | sed 's/^/    /'; echo; exit 1; fi; \
	 if git rev-parse -q --verify 'refs/tags/v$(ARGS)' >/dev/null; then \
	   printf '\n  v%s is a tag here already. A release that was wrong is followed by\n  another release, never by moving one\n\n' '$(ARGS)'; exit 1; fi; \
	 $(MAKE) --no-print-directory ARGS= verify test && \
	 paths=$$($(TASK) node scripts/release.ts --paths 2>/dev/null) && \
	 $(RUN) release $(ARGS) && \
	 git commit -q -m 'release: $(ARGS)' -- $$paths && \
	 git tag -a 'v$(ARGS)' -m '$(ARGS)' && \
	 printf '\n  committed and tagged v%s. Nothing was pushed:\n\n    git push origin main --follow-tags\n\n' '$(ARGS)'

# Bring the stack up, and report it. Detached, because it is a surface you
# look at while working on something else.
#
# The ports are searched for in the recipe rather than at parse time, which
# saw the still-running stack and picked the next number up — every restart
# drifted one higher than the address it printed. `down` first, so `start`
# means "up on a known port" whatever was running before; `--remove-orphans`
# because a service dropped from the compose file otherwise runs forever.
#
# It reports by running `status`, so the addresses come from the containers
# rather than from the numbers this recipe hoped they would take.
start:
	@$(COMPOSE) down --remove-orphans >/dev/null 2>&1 || true
	@port=$$(for p in $$(seq 6007 6099); do \
		(exec 3<>/dev/tcp/127.0.0.1/$$p) 2>/dev/null || { echo $$p; break; }; done); \
	site=$$(for p in $$(seq 4173 4199); do \
		(exec 3<>/dev/tcp/127.0.0.1/$$p) 2>/dev/null || { echo $$p; break; }; done); \
	acceptance=$$(for p in $$(seq $$((site + 1)) 4199); do \
		(exec 3<>/dev/tcp/127.0.0.1/$$p) 2>/dev/null || { echo $$p; break; }; done); \
	SDS_STORYBOOK_PORT=$$port SDS_SITE_PORT=$$site SDS_ACCEPTANCE_PORT=$$acceptance \
	$(COMPOSE) up -d --build $(SERVICES)
	@$(MAKE) --no-print-directory status

# What is up and where it answers, read out of the running containers — so a
# stack somebody else started answers too, and no port has to be remembered.
# One-offs are dropped: a `compose run` container carries its service's name,
# and a task running in one put a second `app` in the list. Under WSL the VM's
# address is named too: the relay stops without the stack becoming unhealthy.
status:
	@command -v docker >/dev/null 2>&1 || { \
		printf '\n  Docker is not installed — this repo runs nothing on the host\n\n'; exit 0; }
	@rows=$$($(COMPOSE) ps -a --format '{{.Labels}}|{{.Service}}|{{.State}}|{{.Publishers}}' 2>/dev/null \
		| grep -v 'oneoff=True' | cut -d'|' -f2-); \
	case "$$rows" in *running*) ;; *) \
		printf '\n  nothing is running        make start   brings the stack up\n\n'; exit 0;; esac; \
	printf '\n  running:\n'; \
	printf '%s\n' $(SURFACES) | while IFS='|' read -r service idle what; do \
		row=$$(printf '%s\n' "$$rows" | grep "^$$service|" || true); \
		state=$$(printf '%s' "$$row" | cut -d'|' -f2); \
		port=$$(printf '%s' "$$row" | sed -n 's/.*|\[{[^ ]* [0-9]* \([0-9]*\) .*/\1/p'); \
		if [ -z "$$state" ]; then where='(not created)'; \
		elif [ "$$state" != running ]; then where="($$state)"; \
		elif [ -n "$$port" ]; then where="http://localhost:$$port"; \
		else where="$$idle"; fi; \
		printf '    %-10s %-31s  %s\n' "$$service" "$$where" "$$what"; \
	done; \
	if grep -qi microsoft /proc/sys/kernel/osrelease 2>/dev/null; then \
		port=$$(printf '%s\n' "$$rows" | sed -n 's/^storybook|running|\[{[^ ]* [0-9]* \([0-9]*\) .*/\1/p'); \
		ip=$$(ip -4 addr show eth0 2>/dev/null | awk '/inet /{print $$2}' | cut -d/ -f1); \
		[ -n "$$ip" ] && [ -n "$$port" ] && \
			printf '\n    from Windows, if localhost does not answer:  http://%s:%s/\n' "$$ip" "$$port"; \
	fi; \
	echo && echo '  make logs    follow it        make stop   take it down' && echo

# `--remove-orphans` for the same reason as above.
stop:
	@$(COMPOSE) down --remove-orphans

# `start` already tears down first, so this is the same thing by the name
# people reach for.
restart: start

logs:
	@$(COMPOSE) logs -f $(SERVICES)

shell:
	@$(TASK) bash

clean:
	@$(COMPOSE) down -v --remove-orphans
	@rm -rf .out packages/frontend/dist
	@echo 'removed containers, volumes and build output'
