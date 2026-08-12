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
# it. Without this, ds-bundle/ and test-results/ come back owned by root and
# the next run cannot delete what the last one made.
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
TASKS := verify test cards typecheck fit ssr coverage php build dist split guides fonts icons \
         baseline shots diff sheets look sync status plan synced

# The long-running ones. `app` is among them: it holds the environment every
# task above runs in, so a task is an `exec` rather than a new container.
SERVICES := storybook site dist app

.PHONY: help tasks $(TASKS) start stop restart logs shell clean
.DEFAULT_GOAL := help

# Written out rather than read from the container: a help screen that first
# builds a Docker image is not a help screen. `make tasks` asks the
# authoritative list, which is the TASKS map in scripts/task.ts.
help:
	@echo 'Everything runs in a container. The host needs Docker and Make.'
	@echo
	@echo '  make start           bring the stack up and report what is running'
	@echo '  make verify          the gate: headers, classes, refs, fit, cards, types'
	@echo '                       one check while working: make verify ARGS=classes'
	@echo '                       the names: make verify ARGS=--help'
	@echo '  make test            the Playwright suite'
	@echo '                       one spec: make test ARGS=tests/parity.spec.ts'
	@echo '  make cards           regenerate the component cards from their stories'
	@echo
	@echo '  make guides          render the documentation fixture into site/'
	@echo '  make build           assemble ds-bundle/, the upload payload'
	@echo '  make dist            the publishable ESM package and its types'
	@echo '  make sync            build + verify + what-would-change + upload plan'
	@echo '  make status plan synced      the sync steps individually'
	@echo '                       set SDS_DESIGN_PROJECT to your own design project,'
	@echo '                       or a re-sync makes a new one instead of updating it'
	@echo
	@echo '  make baseline shots diff     screenshot before, after, compare'
	@echo '  make look ARGS=screens/x.html  photograph one page in both modes'
	@echo '  make sheets          tile screenshots into contact sheets'
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
$(TASKS):
	@$(RUN) $@ $(ARGS)

# Bring the stack up, and report it. Detached, because it is a surface you
# look at while working on something else.
#
# Under WSL the report also names the VM's own address. A browser on Windows
# reaches the container through WSL's localhost relay, which is a moving part
# nobody thinks about until it stops — and then `http://localhost:PORT` is a
# lie the stack itself printed, while everything inside it is healthy.
#
# Everything happens in one recipe, which is the point: the port is searched
# for *after* the old container has let go of it. Computed at parse time it
# saw the still-running stack, picked the next number up, and every restart
# drifted one higher than the address it printed.
#
# `down` first, so `start` means "the stack is up on a known port" whatever
# was running before. `--remove-orphans` because a service removed from the
# compose file is otherwise left running forever — that is exactly how a
# retired `gallery` container outlived its own definition.
start:
	@$(COMPOSE) down --remove-orphans >/dev/null 2>&1 || true
	@port=$$(for p in $$(seq 6007 6099); do \
		(exec 3<>/dev/tcp/127.0.0.1/$$p) 2>/dev/null || { echo $$p; break; }; done); \
	site=$$(for p in $$(seq 4173 4199); do \
		(exec 3<>/dev/tcp/127.0.0.1/$$p) 2>/dev/null || { echo $$p; break; }; done); \
	SDS_STORYBOOK_PORT=$$port SDS_SITE_PORT=$$site $(COMPOSE) up -d --build $(SERVICES) && \
	printf '\n  running:\n    %-10s http://localhost:%-6s  %s\n' \
		storybook "$$port" 'guidelines, components with controls, a11y' && \
	printf '    %-10s http://localhost:%-6s  %s\n' \
		site "$$site" 'the rendered documentation, as it will be served' && \
	printf '    %-10s %-29s  %s\n' \
		dist '(watching the frontend package)' 'rebuilds the drop-in on every edit' && \
	printf '    %-10s %-29s  %s\n' \
		app '(idle)' 'every make task runs in here' && \
	if grep -qi microsoft /proc/sys/kernel/osrelease 2>/dev/null; then \
		ip=$$(ip -4 addr show eth0 2>/dev/null | awk '/inet /{print $$2}' | cut -d/ -f1); \
		[ -n "$$ip" ] && printf '\n    from Windows, if localhost does not answer:  http://%s:%s/\n' "$$ip" "$$port"; \
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
	@rm -rf ds-bundle packages/frontend/dist storybook-static test-results playwright-report .split
	@echo 'removed containers, volumes and build output'
