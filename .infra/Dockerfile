# The design system, containerised. There is no other way to run it.
#
#   make              # every task
#   make storybook    # the documentation surface
#   make verify       # the gate
#   make test         # the Playwright suite
#
# The host needs Docker and Make, and nothing else — no Node, no `npm ci`,
# no `playwright install`. The Makefile drives compose; `scripts/task.ts`
# says what each task actually runs, in here.
#
# Node 24 rather than the Playwright image's runtime: this repo runs its
# `.ts` sources directly by type-stripping, which needs Node 22.18+, and the
# published Playwright images ship whatever Node their base had. Pinning Node
# here and installing the browser afterwards keeps the two independent — a
# Playwright bump changes one line and cannot move the runtime out from under
# the scripts.
#
# `-slim`, because the difference is a compiler toolchain and a set of
# version-control clients nothing here asks for — most of a gigabyte that CI
# moves on every run. `npm ci` runs with `--ignore-scripts`; nothing compiles.
FROM node:24-bookworm-slim AS base

# PHP, because the documentation renderer is written in it.
#
# `phpdocumentor/guides` turns reStructuredText into the HTML this system has
# to set, and it is a Composer package — there is no JavaScript port and a
# reimplementation would be a second renderer to keep in step with the first.
# The promise at the top of this file is about the *host*: it still needs
# Docker and Make and nothing else. The image is where the languages a task
# needs are allowed to live, and it now holds two.
#
# Bookworm's php-cli is 8.2, one minor above what Guides asks for. The three
# extensions are not optional: it parses XML configuration, walks UTF-8 source
# text and unpacks its own dependencies.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      php-cli php-mbstring php-xml php-zip unzip \
 && rm -rf /var/lib/apt/lists/*
# From the published image rather than piping an installer through a shell:
# one pinned major, no network trust decision, and it is how Composer says to
# do it in a container.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Anything run through `scripts/task.ts` checks this to decide whether it is
# already inside, or has to shell out to compose. Without it the container
# would try to run Docker inside Docker.
ENV SDS_IN_CONTAINER=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    # The container runs as the host's UID so bind-mounted output is not
    # owned by root. That UID has no home directory here, and npm and
    # Playwright both want somewhere to write.
    HOME=/tmp \
    NPM_CONFIG_UPDATE_NOTIFIER=false

WORKDIR /app

# The workspace root and the one package in it: `npm ci` resolves both, and
# a lock file copied without the manifest it locks is a failed install.
COPY package.json package-lock.json ./
COPY packages/frontend/package.json packages/frontend/

# `--ignore-scripts` is required, not tidiness: this package's `prepare` runs
# `scripts/fonts.ts` and `scripts/icons.ts`, and only the two manifests
# have been copied at this point — the scripts do not exist yet. The
# entrypoint runs them instead, where they can also repair a bind-mounted
# tree that never had them.
RUN npm ci --no-audit --no-fund --ignore-scripts \
 && npx playwright install --with-deps chromium \
 && chmod -R a+rX /ms-playwright \
 # Vite and Storybook write their caches inside node_modules, which the
 # container's UID does not own. It happens in this layer rather than after
 # the source is copied: a recursive chmod writes every file it touches into
 # its own layer, and one placed below `COPY . .` is rebuilt on every commit.
 && chmod -R a+rwX node_modules \
 # npm and npx write here, and the container runs as a UID with no home.
 && mkdir -p /tmp/.npm && chmod -R a+rwX /tmp/.npm

COPY . .

# The image runs as an arbitrary UID and writes into /app — ds-bundle/, dist/,
# storybook-static/. Writable by anyone is right for a development image and
# wrong for a published one; this is the former. node_modules is skipped
# because the layer above already granted it, and repeating it here would copy
# the installed dependencies into a layer that every commit invalidates.
#
# storybook-static/ is created empty on purpose: compose keeps it in an
# anonymous volume seeded from this path, and with no directory here Docker
# creates that volume owned by root, which the container then cannot write.
RUN mkdir -p /app/storybook-static /app/test-results /app/playwright-report \
 && chmod a+rwX /app \
 && find /app -mindepth 1 -maxdepth 1 ! -name node_modules -exec chmod -R a+rwX {} +

COPY .infra/docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]


# Everything except Storybook. `scripts/task.ts` dispatches, so this one
# image serves verify, test, build, sync and the rest.
FROM base AS app
CMD ["node", "scripts/task.ts", "--help"]


# The documentation surface. Bound to 0.0.0.0 because a server listening on
# the container's loopback is unreachable from the host, which looks exactly
# like a broken build. The host port is assigned by Docker — see the compose
# file.
FROM base AS storybook
EXPOSE 6007
CMD ["npx", "storybook", "dev", "-p", "6007", "-h", "0.0.0.0", "--ci", "--no-open"]
