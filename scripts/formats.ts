#!/usr/bin/env node
/* Does every node the theme renders have a page and a twin, and does every
   mapping reach the node it stands for?

     make verify ARGS=formats

   Two failures the render cannot report. A node mapped for the page and not
   the twin renders its content without its shape, in silence. A renderer
   supports the class it maps *and everything below it*. So a mapping under
   one of its own ancestors never runs and a twin loses its marks. Asked in
   PHP — the class hierarchy is the question. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const THEME = join(ROOT, 'packages', 'guides-theme');

/* The theme's own answer, asked of the theme. `prepend()` is where a node's
   template stands, so this reads what the renderer gets rather than what
   the source looks like. */
const ASK = `
require 'vendor/autoload.php';
use Symfony\\Component\\DependencyInjection\\ContainerBuilder;
use TYPO3\\Soul\\GuidesTheme\\DependencyInjection\\SoulExtension;

$container = new ContainerBuilder();
(new SoulExtension())->prepend($container);

$mapped = [];
foreach ($container->getExtensionConfig('guides') as $config) {
    foreach ($config['templates'] ?? [] as $template) {
        $mapped[$template['format']][] = $template['node'];
    }
}

$shadowed = [];
foreach ($mapped as $format => $nodes) {
    foreach ($nodes as $at => $node) {
        foreach (array_slice($nodes, 0, $at) as $above) {
            if ($node !== $above && is_a($node, $above, true)) {
                $shadowed[] = ['format' => $format, 'node' => $node, 'above' => $above];
            }
        }
    }
}

echo json_encode([
    'formats' => array_map('count', $mapped),
    'missing' => array_values(array_filter(
        $mapped['html'] ?? [],
        /* Covered by a mapping of its own or by one it inherits from, which
           is what the renderer asks: a mapping supports the class it names
           and everything below it. */
        static function (string $node) use ($mapped): bool {
            foreach ($mapped['md'] ?? [] as $twin) {
                if (is_a($node, $twin, true)) {
                    return false;
                }
            }

            return true;
        },
    )),
    'shadowed' => $shadowed,
]);
`;

report.open('formats', 'every node the theme renders has a page and a twin');

/* The autoloader lives in a gitignored `vendor/`, the way the fixer does —
   see `scripts/php.ts`, which installs it on its own first run. */
if (!existsSync(join(THEME, 'vendor', 'autoload.php'))) {
  report.fact('the theme’s dependencies install', 'first run only');
  const install = spawnSync('composer', ['install', '--no-interaction', '--no-progress'], { cwd: THEME, encoding: 'utf8' });
  if (install.status !== 0) {
    report.summary('the theme’s dependencies did not install', [`${install.stdout ?? ''}${install.stderr ?? ''}`]);
    process.exit(1);
  }
}

const asked = spawnSync('php', ['-r', ASK], { cwd: THEME, encoding: 'utf8' });
if (asked.status !== 0) {
  report.summary('the theme did not answer what it maps', `${asked.stdout ?? ''}${asked.stderr ?? ''}`.split('\n').filter(Boolean));
  process.exit(1);
}

interface Answer {
  formats: Record<string, number>;
  missing: string[];
  shadowed: { format: string; node: string; above: string }[];
}

let answer: Answer;
try {
  answer = JSON.parse(asked.stdout) as Answer;
} catch {
  report.summary('the theme answered with something other than its mappings', [asked.stdout.slice(0, 400)]);
  process.exit(1);
}

const short = (name: string): string => name.split('\\').at(-1) ?? name;
const problems = [
  ...answer.missing.map((node) => `${short(node)} renders as a page and not as a twin — add it to resources/template/markdown.php`),
  ...answer.shadowed.map(({ format, node, above }) =>
    `${short(node)} never runs in the ${format} map: ${short(above)} stands above it and supports it too`),
];

report.summary(
  Object.entries(answer.formats).map(([format, count]) => `${count} node(s) in ${format}`).join(' · '),
  problems,
);
process.exit(problems.length ? 1 : 0);
