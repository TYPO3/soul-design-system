#!/usr/bin/env node
/* One entry point, one way to run anything: in the container.

   The map below is what each task runs. The `Makefile` is how a human gets into
   a container and knows nothing about the tasks, so there is one place to
   change a command and one to change how it is launched. From the host this
   hands the task to `docker compose` — the `SDS_IN_CONTAINER` check below.

     make verify            # the normal way in
     node scripts/task.ts   # lists every task
*/
import { spawn, spawnSync } from 'node:child_process';

interface Task {
  /** What runs inside the container. Every task has one: the long-running
      services are not tasks and are brought up by `make start`. */
  cmd: string[];
  /** Keep stdin attached — `shell` is the only one that needs it. */
  interactive?: boolean;
  help: string;
}

const node = (file: string, ...args: string[]): string[] => ['node', file, ...args];

/* Every task, and what it actually runs inside the container. Anything not
   listed here is not a thing you can run — which is the point. */
const TASKS: Record<string, Task> = {
  // The long-running surfaces are brought up by `make start`, not from here.

  // The gate and what feeds it
  /* No `sh -c` wrapper: `ARGS` has to reach the script, and appended to a
     wrapped command it lands on the shell instead — a filtered gate that
     silently ran all of it. `verify.ts` builds the bundle itself, for the one
     check that reads it. `make verify ARGS=--help` lists the names. */
  verify: { cmd: node('scripts/verify.ts'), help: 'the gate: headers, classes, refs, fit, cards, types, conventions — ARGS names a subset' },
  cards: { cmd: node('scripts/cards.ts'), help: 'regenerate the component cards from their stories, and embed them' },
  embed: { cmd: node('scripts/embed.ts'), help: 'put the generated cards where the documents that embed them can reach them' },
  typecheck: { cmd: node('node_modules/typescript/bin/tsc', '--noEmit'), help: 'tsc --noEmit' },
  test: { cmd: ['npx', 'playwright', 'test'], help: 'the Playwright suite' },
  fit: { cmd: node('scripts/fit.ts'), help: 'does every card fit its declared viewport' },
  ssr: { cmd: node('scripts/ssr.ts'), help: 'does every element render outside a browser' },
  coverage: { cmd: node('scripts/coverage.ts'), help: 'is every component shown in a story, a class and the Guides render' },
  php: { cmd: node('scripts/php.ts'), help: 'format the theme’s PHP against typo3/coding-standards — ARGS=--check to only report' },

  // The documentation site
  guides: { cmd: node('scripts/guides.ts'), help: 'render the Guides fixture into .out/site/ with the theme' },

  // Build artefacts
  build: { cmd: node('scripts/build.ts'), help: 'assemble .out/bundle/, the upload payload' },
  dist: { cmd: node('scripts/dist.ts'), help: 'build the publishable ESM package and its types' },
  split: { cmd: node('scripts/split.ts'), help: 'assemble the Guides theme as the package it is published as, into .out/split/' },
  fonts: { cmd: node('scripts/fonts.ts'), help: 'regenerate fonts/ from @fontsource' },
  icons: { cmd: node('scripts/icons.ts'), help: 'regenerate assets/icons/ from @typo3/icons' },
  diagrams: { cmd: node('scripts/diagrams.ts'), help: 'read the drawings’ viewBoxes into src/components/diagrams.generated.ts' },

  // Visual regression
  baseline: { cmd: node('scripts/shoot.ts', '.design-sync/.cache/baseline'), help: 'screenshot every card as the before' },
  shots: { cmd: node('scripts/shoot.ts'), help: 'screenshot every card as the after' },
  diff: { cmd: node('scripts/diff.ts'), help: 'compare after against baseline' },
  sheets: { cmd: node('scripts/sheet.ts'), help: 'tile screenshots into contact sheets' },
  look: { cmd: node('scripts/look.ts'), help: 'photograph one page in both modes — make look ARGS=screens/feature.html' },

  // Sync to claude.ai/design
  sync: { cmd: ['sh', '-c', 'node scripts/verify.ts && node scripts/status.ts && node scripts/plan.ts'], help: 'build + verify + what-would-change + upload plan' },
  status: { cmd: node('scripts/status.ts'), help: 'what a sync would change' },
  plan: { cmd: node('scripts/plan.ts'), help: 'the ordered upload plan, with deletes' },
  synced: { cmd: node('scripts/synced.ts'), help: 'record that the project holds this build' },

  shell: { cmd: ['bash'], interactive: true, help: 'a prompt inside the image' },
};

function usage() {
  const width = Math.max(...Object.keys(TASKS).map((k) => k.length));
  for (const [name, t] of Object.entries(TASKS)) {
    console.log(`  make ${name.padEnd(width)}  ${t.help}`);
  }
}

const name = process.argv[2];
if (!name || name === '--help') {
  usage();
  process.exit(name ? 0 : 1);
}

const task = TASKS[name];
if (!task) {
  console.error(`unknown task "${name}"\n`);
  usage();
  process.exit(1);
}

const passthrough = process.argv.slice(3);

/* Inside the image: just run it. */
if (process.env['SDS_IN_CONTAINER']) {
  const [bin, ...args] = task.cmd;
  const r = spawnSync(bin as string, [...args, ...passthrough], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}

/* On the host: hand it to compose. The image is built on demand and compose
   caches it, so this is a no-op while the dependencies have not moved. The
   comparison is written out rather than negated, so a machine without Docker
   gets the sentence below instead of a raw spawn error. */
if (spawnSync('docker', ['--version'], { stdio: 'ignore' }).status !== 0) {
  console.error('Docker is required — this repo runs nothing on the host.');
  process.exit(1);
}

/* The container writes into bind-mounted directories, so it has to write as
   whoever owns them. Without this, everything under `.out/` comes back owned
   by root and the next run cannot delete it. */
process.env['SDS_UID'] ??= String(process.getuid?.() ?? 1000);
process.env['SDS_GID'] ??= String(process.getgid?.() ?? 1000);

/* `--build` on every run. Compose does not rebuild for `run` by default, so
   without it an edited Dockerfile or a changed lockfile silently keeps the
   old image — and the failure that produces looks like a bug in the code
   rather than a stale layer. The cache check is cheap when nothing moved. */
const args = ['compose', '-f', '.infra/docker-compose.yml', 'run', '--rm', '--build', ...(task.interactive ? [] : ['-T']), 'app', 'node', 'scripts/task.ts', name, ...passthrough];
const child = spawn('docker', args, { stdio: 'inherit', env: process.env });
child.on('exit', (code) => process.exit(code ?? 0));
