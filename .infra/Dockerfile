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
FROM node:24-bookworm AS base

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

COPY package.json package-lock.json ./

# `--ignore-scripts` is required, not tidiness: this package's `prepare` runs
# `scripts/fonts.ts` and `scripts/icons.ts`, and only the two manifests
# have been copied at this point — the scripts do not exist yet. The
# entrypoint runs them instead, where they can also repair a bind-mounted
# tree that never had them.
RUN npm ci --no-audit --no-fund --ignore-scripts \
 && npx playwright install --with-deps chromium \
 && chmod -R a+rX /ms-playwright \
 # npm and npx write here, and the container runs as a UID with no home.
 && mkdir -p /tmp/.npm && chmod -R a+rwX /tmp/.npm

COPY . .

# The image is run as an arbitrary UID, and the build writes into /app —
# ds-bundle/, dist/ and storybook-static/. Writable by anyone is
# right for a development image and wrong for a published one; this is the
# former.
#
# storybook-static/ is created here even though it is empty, and that is the
# load-bearing part: compose keeps it in an anonymous volume, and Docker
# seeds such a volume from the image path it shadows. With no directory
# there, it creates one owned by root — which the container, running as the
# host's UID, then cannot write.
RUN mkdir -p /app/storybook-static /app/test-results /app/playwright-report \
 && chmod -R a+rwX /app

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
